import express from 'express';
import { generateRoadmapWithGemma } from '../services/geminiService.js';
import { db, firebaseInitialized } from '../config/firebase.js';

const router = express.Router();

// In-memory fallback cache when Firebase is not connected
const inMemoryRoadmaps = [];

/**
 * POST /api/generate-roadmap
 * Receives user profile, calls Gemma 4 via Gemini API, stores in Firestore/memory, and returns result.
 */
router.post('/generate-roadmap', async (req, res) => {
  try {
    const { currentSkills, careerGoal, experienceLevel, hoursPerDay } = req.body;

    // Validation
    if (!currentSkills || !careerGoal || !experienceLevel || !hoursPerDay) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'Please provide currentSkills, careerGoal, experienceLevel, and hoursPerDay.'
      });
    }

    const hoursNum = parseFloat(hoursPerDay);
    if (isNaN(hoursNum) || hoursNum <= 0 || hoursNum > 24) {
      return res.status(400).json({
        error: 'Invalid study hours',
        details: 'hoursPerDay must be a positive number between 0.5 and 24.'
      });
    }

    console.log(`\n🚀 Generating Roadmap for: ${careerGoal} | Level: ${experienceLevel} | Hours: ${hoursNum}h/day`);
    
    // Call Gemma 4 through Gemini API
    const { roadmap, modelUsed } = await generateRoadmapWithGemma({
      currentSkills: currentSkills.trim(),
      careerGoal: careerGoal.trim(),
      experienceLevel: experienceLevel.trim(),
      hoursPerDay: hoursNum
    });

    const timestamp = new Date().toISOString();
    const roadmapId = 'rm_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    const roadmapRecord = {
      id: roadmapId,
      userInputs: {
        currentSkills,
        careerGoal,
        experienceLevel,
        hoursPerDay: hoursNum
      },
      roadmap,
      modelUsed,
      createdAt: timestamp
    };

    // Save to Firebase Firestore if initialized
    if (firebaseInitialized && db) {
      try {
        await db.collection('roadmaps').doc(roadmapId).set(roadmapRecord);
        console.log(`💾 Saved roadmap to Firebase Firestore with ID: ${roadmapId}`);
      } catch (dbErr) {
        console.warn('⚠️ Firestore write warning:', dbErr.message);
        inMemoryRoadmaps.unshift(roadmapRecord);
      }
    } else {
      inMemoryRoadmaps.unshift(roadmapRecord);
    }

    return res.status(200).json({
      success: true,
      data: roadmapRecord
    });
  } catch (error) {
    console.error('❌ Error generating roadmap:', error);
    return res.status(500).json({
      error: 'Failed to generate learning roadmap',
      message: error.message || 'An unexpected error occurred while communicating with Gemma 4.'
    });
  }
});

/**
 * GET /api/roadmaps
 * Retrieves recent generated roadmaps.
 */
router.get('/roadmaps', async (req, res) => {
  try {
    if (firebaseInitialized && db) {
      const snapshot = await db.collection('roadmaps').orderBy('createdAt', 'desc').limit(10).get();
      const docs = snapshot.docs.map(doc => doc.data());
      return res.status(200).json({ success: true, count: docs.length, data: docs });
    } else {
      return res.status(200).json({ success: true, count: inMemoryRoadmaps.length, data: inMemoryRoadmaps.slice(0, 10) });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve roadmaps', message: error.message });
  }
});

export default router;
