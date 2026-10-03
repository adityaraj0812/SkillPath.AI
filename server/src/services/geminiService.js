import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnv() {
  dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
}

/* ═══════════════════════════════════════════════════════════════
   TRACK SKILL DEFINITIONS
   Each skill has:
   - weight    : importance (1-10). Used for score calculation.
   - category  : grouping label
   - aliases   : what the user might type to claim this skill
   - reasoning : why it matters
   - proficiency: target level
   - isFundamental: if true, it belongs in Phase 1 (basics)
═══════════════════════════════════════════════════════════════ */

const TRACKS = {

  fullstack: {
    label: 'Full Stack Development',
    requiredSkills: [
      { skill: 'HTML',                   weight: 3,  isFundamental: true,  category: 'Frontend Foundation',  aliases: ['html','html5','html & css','html/css'],  reasoning: 'The building block of every web page — absolutely mandatory before anything else.', targetProficiency: 'Fluent' },
      { skill: 'CSS',                    weight: 3,  isFundamental: true,  category: 'Frontend Foundation',  aliases: ['css','css3','css/html','html/css','scss','sass','styling'], reasoning: 'Layouts, responsiveness, and design fundamentals every frontend developer must master.', targetProficiency: 'Fluent' },
      { skill: 'JavaScript (ES6+)',      weight: 9,  isFundamental: true,  category: 'Core Language',        aliases: ['javascript','js','es6','es2015','vanilla js','vanilla javascript','ecmascript'], reasoning: 'The single most critical skill for fullstack development — without JS, nothing else works.', targetProficiency: 'Production-ready' },
      { skill: 'Git & Version Control',  weight: 4,  isFundamental: true,  category: 'Developer Tools',      aliases: ['git','github','gitlab','version control','git & github'], reasoning: 'Every real-world engineering team uses Git. Non-negotiable for professional development.', targetProficiency: 'Fluent' },
      { skill: 'React',                  weight: 8,  isFundamental: false, category: 'Frontend Framework',   aliases: ['react','reactjs','react.js','react js'], reasoning: 'Industry-dominant frontend library. Required for nearly all fullstack job descriptions.', targetProficiency: 'Production-ready' },
      { skill: 'Node.js',                weight: 8,  isFundamental: false, category: 'Backend Runtime',      aliases: ['node','nodejs','node.js','node js'], reasoning: 'The JavaScript backend runtime that enables fullstack JS development.', targetProficiency: 'Production-ready' },
      { skill: 'Express.js',             weight: 6,  isFundamental: false, category: 'Backend Framework',    aliases: ['express','expressjs','express.js'], reasoning: 'Standard Node.js web framework for building REST APIs quickly and efficiently.', targetProficiency: 'Intermediate' },
      { skill: 'REST API Design',        weight: 7,  isFundamental: false, category: 'API Architecture',     aliases: ['rest','api','apis','restful','rest api','http api'], reasoning: 'Designing clean, versioned, secure APIs is a core fullstack engineering skill.', targetProficiency: 'Production-ready' },
      { skill: 'SQL & PostgreSQL',       weight: 6,  isFundamental: false, category: 'Database',             aliases: ['sql','postgresql','postgres','mysql','database','relational database','sqlite'], reasoning: 'Relational databases are the backbone of most production applications.', targetProficiency: 'Intermediate' },
      { skill: 'TypeScript',             weight: 7,  isFundamental: false, category: 'Advanced Language',    aliases: ['typescript','ts','typescript/js'], reasoning: 'Now the industry default for large-scale React and Node.js codebases.', targetProficiency: 'Production-ready' },
      { skill: 'Authentication & Auth',  weight: 5,  isFundamental: false, category: 'Security',             aliases: ['jwt','oauth','auth','authentication','nextauth','passport'], reasoning: 'Every production app requires secure user authentication flows.', targetProficiency: 'Intermediate' },
      { skill: 'Docker & Deployment',    weight: 4,  isFundamental: false, category: 'DevOps & CI/CD',       aliases: ['docker','containers','vercel','netlify','railway','heroku','deployment','devops'], reasoning: 'Containerization and cloud deployment are expected of senior fullstack engineers.', targetProficiency: 'Foundational' },
      { skill: 'Testing (Jest/Vitest)',  weight: 3,  isFundamental: false, category: 'Quality Assurance',    aliases: ['jest','testing','vitest','unit testing','test','cypress'], reasoning: 'Automated tests prevent regressions and are required at professional teams.', targetProficiency: 'Intermediate' },
    ]
  },

  ai: {
    label: 'AI / ML Engineering',
    requiredSkills: [
      { skill: 'Python',                       weight: 9,  isFundamental: true,  category: 'Core Language',        aliases: ['python','python3','py'], reasoning: 'Python is the universal language of AI/ML. All major frameworks are Python-first.', targetProficiency: 'Production-ready' },
      { skill: 'NumPy & Pandas',               weight: 7,  isFundamental: true,  category: 'Data Manipulation',    aliases: ['numpy','pandas','numpy/pandas','data manipulation'], reasoning: 'Core numerical computing and data analysis libraries used in every ML workflow.', targetProficiency: 'Fluent' },
      { skill: 'Linear Algebra & Statistics',  weight: 6,  isFundamental: true,  category: 'Math Foundations',     aliases: ['linear algebra','statistics','probability','maths','math'], reasoning: 'The mathematical backbone of understanding and implementing ML algorithms.', targetProficiency: 'Intermediate' },
      { skill: 'Git & Version Control',        weight: 4,  isFundamental: true,  category: 'Developer Tools',      aliases: ['git','github','version control'], reasoning: 'Experiment tracking and collaboration require professional Git skills.', targetProficiency: 'Fluent' },
      { skill: 'scikit-learn',                 weight: 7,  isFundamental: false, category: 'Classical ML',         aliases: ['sklearn','scikit-learn','scikit','machine learning basics'], reasoning: 'Standard classical ML library for regression, classification, and clustering.', targetProficiency: 'Intermediate' },
      { skill: 'PyTorch',                      weight: 8,  isFundamental: false, category: 'Deep Learning',        aliases: ['pytorch','torch','deep learning'], reasoning: 'Industry-dominant deep learning framework for neural network research and production.', targetProficiency: 'Advanced' },
      { skill: 'Transformers & LLMs',          weight: 8,  isFundamental: false, category: 'Generative AI',        aliases: ['transformers','hugging face','huggingface','llm','llms','gpt','bert'], reasoning: 'Understanding transformer architecture is essential for modern AI engineering.', targetProficiency: 'Intermediate' },
      { skill: 'Vector Databases',             weight: 7,  isFundamental: false, category: 'AI Infrastructure',    aliases: ['pinecone','qdrant','weaviate','vector db','vector database','embeddings'], reasoning: 'Required for semantic search, RAG pipelines, and LLM long-term memory.', targetProficiency: 'Production-ready' },
      { skill: 'LangChain / LlamaIndex',       weight: 6,  isFundamental: false, category: 'LLM Engineering',     aliases: ['langchain','llamaindex','llama index','rag','retrieval'], reasoning: 'Frameworks for building production LLM pipelines, agents, and RAG systems.', targetProficiency: 'Intermediate' },
      { skill: 'FastAPI & Model Serving',      weight: 6,  isFundamental: false, category: 'Backend & Serving',    aliases: ['fastapi','flask','api','model serving','ml deployment'], reasoning: 'Deploying ML models as production APIs is a core MLOps skill.', targetProficiency: 'Intermediate' },
      { skill: 'Cloud ML Platforms',           weight: 4,  isFundamental: false, category: 'MLOps',               aliases: ['aws','gcp','azure','sagemaker','vertex ai','cloud'], reasoning: 'Production ML workloads run on cloud platforms — every ML engineer needs cloud basics.', targetProficiency: 'Foundational' },
    ]
  },

  devops: {
    label: 'DevOps & Cloud Engineering',
    requiredSkills: [
      { skill: 'Linux & Shell Scripting',    weight: 9,  isFundamental: true,  category: 'Core OS Skills',         aliases: ['linux','bash','shell','unix','terminal','command line'], reasoning: 'Linux is the OS of production servers. Shell scripting is the foundation of automation.', targetProficiency: 'Fluent' },
      { skill: 'Networking Fundamentals',    weight: 7,  isFundamental: true,  category: 'Infrastructure Basics',  aliases: ['networking','tcp/ip','dns','http','https','network','tcp'], reasoning: 'Understanding DNS, TCP/IP, and HTTP is mandatory before any cloud or DevOps work.', targetProficiency: 'Intermediate' },
      { skill: 'Git & Version Control',      weight: 5,  isFundamental: true,  category: 'Developer Tools',        aliases: ['git','github','version control'], reasoning: 'CI/CD pipelines and GitOps workflows are built around Git.', targetProficiency: 'Fluent' },
      { skill: 'Docker & Containers',        weight: 8,  isFundamental: false, category: 'Containerization',       aliases: ['docker','containers','container','dockerfile'], reasoning: 'The entry point to all modern cloud-native infrastructure.', targetProficiency: 'Production-ready' },
      { skill: 'Kubernetes',                 weight: 8,  isFundamental: false, category: 'Container Orchestration',aliases: ['kubernetes','k8s','kubectl','helm'], reasoning: 'Industry-standard container orchestration for scaling and managing production workloads.', targetProficiency: 'Production-ready' },
      { skill: 'Terraform & IaC',            weight: 8,  isFundamental: false, category: 'Infrastructure as Code', aliases: ['terraform','iac','infrastructure as code','ansible','pulumi'], reasoning: 'Reproducible, version-controlled cloud infrastructure is non-negotiable for DevOps.', targetProficiency: 'Intermediate' },
      { skill: 'CI/CD Pipelines',            weight: 7,  isFundamental: false, category: 'Automation',             aliases: ['ci/cd','github actions','gitlab ci','jenkins','pipeline','cicd'], reasoning: 'Automating test, build, and deploy workflows is the core value proposition of DevOps.', targetProficiency: 'Production-ready' },
      { skill: 'Cloud (AWS / GCP / Azure)',   weight: 7,  isFundamental: false, category: 'Cloud Platforms',       aliases: ['aws','gcp','azure','cloud','amazon web services','google cloud'], reasoning: 'All modern production infrastructure lives on cloud. At least one major cloud is required.', targetProficiency: 'Intermediate' },
      { skill: 'Monitoring & Observability', weight: 5,  isFundamental: false, category: 'Reliability Engineering', aliases: ['prometheus','grafana','monitoring','observability','datadog','elk','logging'], reasoning: 'SREs and DevOps engineers are responsible for system reliability and alerting.', targetProficiency: 'Intermediate' },
    ]
  },

  general: {
    label: 'Software Engineering',
    requiredSkills: [
      { skill: 'Programming Fundamentals',      weight: 9, isFundamental: true,  category: 'Core Skills',           aliases: ['programming','coding','development','software','computer science'], reasoning: 'Core programming concepts like control flow, data structures and OOP underpin everything.', targetProficiency: 'Fluent' },
      { skill: 'Git & Version Control',          weight: 5, isFundamental: true,  category: 'Developer Tools',       aliases: ['git','github','version control'], reasoning: 'Used in every professional engineering team worldwide.', targetProficiency: 'Fluent' },
      { skill: 'Data Structures & Algorithms',   weight: 7, isFundamental: false, category: 'Computer Science',      aliases: ['dsa','data structures','algorithms','leetcode'], reasoning: 'Required for technical interviews and for writing efficient production code.', targetProficiency: 'Intermediate' },
      { skill: 'System Design',                  weight: 6, isFundamental: false, category: 'Architecture',          aliases: ['system design','architecture','distributed systems'], reasoning: 'Essential for senior engineering roles and designing scalable systems.', targetProficiency: 'Intermediate' },
      { skill: 'REST API Design',                weight: 6, isFundamental: false, category: 'API Architecture',      aliases: ['api','rest','restful'], reasoning: 'APIs connect all modern software — designing them well is a universal engineering skill.', targetProficiency: 'Intermediate' },
      { skill: 'Database Design',                weight: 5, isFundamental: false, category: 'Data Layer',            aliases: ['sql','database','postgresql','mysql','mongodb'], reasoning: 'All production applications need a well-designed data layer.', targetProficiency: 'Intermediate' },
      { skill: 'Testing & Quality Assurance',    weight: 4, isFundamental: false, category: 'Quality',              aliases: ['testing','unit test','jest','test driven'], reasoning: 'Professional engineers write tests — it prevents costly production bugs.', targetProficiency: 'Intermediate' },
    ]
  }
};

/* ───────────────────────────────────────────────────────────────
   Detect which track the goal belongs to
─────────────────────────────────────────────────────────────── */
function detectTrack(careerGoal) {
  const g = careerGoal.toLowerCase();
  if (g.match(/fullstack|full.?stack|mern|next\.?js|frontend|backend|web dev|node|react dev/)) return 'fullstack';
  if (g.match(/\bai\b|machine.?learning|\bml\b|data sci|llm|nlp|deep.?learn|pytorch|tensorflow|gemini|gpt/)) return 'ai';
  if (g.match(/devops|cloud|kubernetes|k8s|sre|infra|platform|terraform|aws|gcp|azure/)) return 'devops';
  return 'general';
}

/* ───────────────────────────────────────────────────────────────
   Check if a user-provided skill matches a required skill
─────────────────────────────────────────────────────────────── */
function userHasSkill(userSkillsLower, requiredSkill) {
  for (const alias of requiredSkill.aliases) {
    for (const userSkill of userSkillsLower) {
      // Full match or contains match (e.g. "html/css" covers both html and css)
      if (userSkill.includes(alias) || alias.includes(userSkill)) return true;
    }
  }
  return false;
}

/* ───────────────────────────────────────────────────────────────
   Core engine: compare user skills vs required, compute score
─────────────────────────────────────────────────────────────── */
function analyzeSkills(currentSkills, trackKey, experienceLevel) {
  const track = TRACKS[trackKey];
  const userSkillsRaw = currentSkills.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  const allRequired = track.requiredSkills;

  const totalWeight = allRequired.reduce((sum, s) => sum + s.weight, 0);
  let earnedWeight = 0;

  const ownedSkills = [];
  const missingSkills = [];

  for (const req of allRequired) {
    if (userHasSkill(userSkillsRaw, req)) {
      ownedSkills.push(req.skill);
      earnedWeight += req.weight;
    } else {
      missingSkills.push(req);
    }
  }

  // Base score from actual skill match
  let rawScore = Math.round((earnedWeight / totalWeight) * 100);

  // Small experience level modifier (±5 pts) — does NOT dominate
  const levelBonus = experienceLevel === 'Advanced' ? 5 : experienceLevel === 'Intermediate' ? 2 : 0;
  const finalScore = Math.max(3, Math.min(97, rawScore + levelBonus));

  return { ownedSkills, missingSkills, finalScore, totalWeight, earnedWeight };
}

/* ───────────────────────────────────────────────────────────────
   Build skill gap objects from missing skills (sorted by weight)
─────────────────────────────────────────────────────────────── */
function buildSkillGaps(missingSkills) {
  // Sort: fundamentals first, then by weight desc
  const sorted = [...missingSkills].sort((a, b) => {
    if (a.isFundamental && !b.isFundamental) return -1;
    if (!a.isFundamental && b.isFundamental) return 1;
    return b.weight - a.weight;
  });

  return sorted.map(s => ({
    skill: s.skill,
    priority: s.weight >= 7 ? 'High' : s.weight >= 5 ? 'Medium' : 'Low',
    category: s.category,
    reasoning: s.reasoning,
    targetProficiency: s.targetProficiency
  }));
}

/* ───────────────────────────────────────────────────────────────
   Build roadmap phases adapted to what the user is actually missing
─────────────────────────────────────────────────────────────── */
function buildRoadmapPhases({ missingSkills, careerGoal, hoursPerDay, trackKey, ownedSkills }) {
  const weeklyHrs = Math.round(hoursPerDay * 7);
  const totalWeeks = Math.max(8, Math.round(100 / (hoursPerDay * 2)));

  // Separate fundamentals vs intermediate vs advanced missing skills
  const missingFundamentals = missingSkills.filter(s => s.isFundamental);
  const missingIntermediate = missingSkills.filter(s => !s.isFundamental && s.weight >= 6);
  const missingAdvanced = missingSkills.filter(s => !s.isFundamental && s.weight < 6);

  // Phase 1: everything fundamental they're missing. If nothing fundamental is missing, start intermediate.
  const phase1Skills = missingFundamentals.length > 0 ? missingFundamentals : missingIntermediate.slice(0, 4);
  const phase1Topics = phase1Skills.map(s => s.skill);

  // If user already knows some fundamentals, acknowledge it
  const knownFundamentals = ownedSkills.filter(name =>
    TRACKS[trackKey].requiredSkills.find(r => r.skill === name && r.isFundamental)
  );

  const phase1Note = knownFundamentals.length > 0
    ? `You already have: ${knownFundamentals.join(', ')}. Focus on closing remaining foundational gaps.`
    : `You are starting from scratch — cover all foundational skills before advancing.`;

  const phase2Topics = missingIntermediate.length > 0
    ? missingIntermediate.map(s => s.skill)
    : ['Advanced patterns in your stack', 'Performance optimisation', 'Security best practices'];

  const phase3Topics = missingAdvanced.length > 0
    ? [...missingAdvanced.map(s => s.skill), 'CI/CD & deployment automation', 'Portfolio project build']
    : ['Portfolio project build', 'CI/CD & automated deployment', 'Interview & job application strategy'];

  const phase1Exercises = phase1Skills.length > 0
    ? phase1Skills.slice(0, 2).map(s => `Build a mini-project using ${s.skill} from scratch`)
    : ['Rebuild a simple version of a tool you use daily', 'Contribute to an open-source beginner issue'];

  return [
    {
      phase: 1,
      phaseName: `Phase 1: ${missingFundamentals.length > 0 ? 'Core Foundations' : 'Intermediate Framework Mastery'}`,
      durationWeeks: Math.max(2, Math.round(totalWeeks * 0.35)),
      weeklyHours: weeklyHrs,
      objective: `${phase1Note} Master the absolute must-have skills before moving forward on your path to ${careerGoal}.`,
      topics: phase1Topics.length > 0 ? phase1Topics : ['Deep dive into your strongest existing skills'],
      keyTakeaways: ['Comfortable building small projects independently', 'Able to read and debug others\' code'],
      handsOnExercises: phase1Exercises,
      recommendedResources: [
        { title: 'MDN / Official Docs', type: 'Documentation', recommendation: 'Primary reference — read daily' },
        { title: 'freeCodeCamp / The Odin Project', type: 'Interactive Course', recommendation: 'Project-based structured learning' }
      ]
    },
    {
      phase: 2,
      phaseName: 'Phase 2: Production Skills & Real-World Application',
      durationWeeks: Math.max(3, Math.round(totalWeeks * 0.40)),
      weeklyHours: weeklyHrs,
      objective: `Build with the tools that hiring managers actually look for in a ${careerGoal} role. Focus on depth over breadth.`,
      topics: phase2Topics,
      keyTakeaways: ['Can build full-featured apps end-to-end', 'Writes code that is testable and maintainable'],
      handsOnExercises: [
        'Build and deploy a full-stack project with user authentication',
        'Implement a database-backed REST API with proper error handling'
      ],
      recommendedResources: [
        { title: 'Framework Deep-Dive Course (Udemy / YouTube)', type: 'Video Course', recommendation: 'Complete all hands-on sections' },
        { title: 'Architecture Case Studies (ByteByteGo)', type: 'Reading', recommendation: 'Study real-world system designs' }
      ]
    },
    {
      phase: 3,
      phaseName: 'Phase 3: Portfolio, Deployment & Job Readiness',
      durationWeeks: Math.max(2, Math.round(totalWeeks * 0.25)),
      weeklyHours: weeklyHrs,
      objective: 'Ship 2 production-grade portfolio projects, optimise your GitHub profile, and start targeted job applications.',
      topics: phase3Topics,
      keyTakeaways: ['2 live public projects on GitHub', 'Confident explaining technical decisions in interviews'],
      handsOnExercises: [
        'Deploy a full project to production with a custom domain',
        'Record a 3-minute demo walkthrough of your best project'
      ],
      recommendedResources: [
        { title: 'Cloud Deployment (Vercel / Railway / Render)', type: 'Guide', recommendation: 'Deploy with zero-downtime configuration' },
        { title: 'Interviewing.io / Pramp', type: 'Mock Interviews', recommendation: 'Do 5+ mock technical interviews before applying' }
      ]
    }
  ];
}

/* ───────────────────────────────────────────────────────────────
   Build recommended projects tailored to the track
─────────────────────────────────────────────────────────────── */
function buildProjects(trackKey, careerGoal, ownedSkills) {
  const projects = {
    fullstack: [
      {
        id: 'proj-1', title: 'Full-Stack SaaS Dashboard with Auth & Database',
        difficulty: 'Intermediate',
        description: `A complete web application with user sign-up/login, protected routes, database persistence, and a live dashboard. The cornerstone portfolio project for any ${careerGoal}.`,
        techStack: ['React', 'Node.js', 'Express', 'PostgreSQL', 'JWT Auth', 'Vercel/Railway'],
        keySkillsLearned: ['Full request lifecycle', 'Database schema design', 'Auth flows', 'Deployment'],
        estimatedHours: 25
      },
      {
        id: 'proj-2', title: 'Real-Time Collaborative Tool with WebSockets',
        difficulty: 'Advanced',
        description: 'A multiplayer or real-time feature (chat, live board, shared doc) demonstrating deep fullstack architecture with persistent connections — highly differentiating on a resume.',
        techStack: ['Next.js', 'Socket.io', 'Redis', 'PostgreSQL', 'TypeScript', 'Docker'],
        keySkillsLearned: ['WebSocket architecture', 'State sync', 'Redis pub/sub', 'Performance at scale'],
        estimatedHours: 35
      }
    ],
    ai: [
      {
        id: 'proj-1', title: 'RAG-Powered Document Q&A Assistant',
        difficulty: 'Intermediate',
        description: `Upload PDFs or text, embed them into a vector store, and query with natural language via an LLM. The definitive portfolio project for an ${careerGoal}.`,
        techStack: ['Python', 'FastAPI', 'LangChain', 'Pinecone', 'OpenAI/Gemini API', 'React'],
        keySkillsLearned: ['Embedding pipelines', 'RAG architecture', 'Vector search', 'LLM API integration'],
        estimatedHours: 25
      },
      {
        id: 'proj-2', title: 'Fine-Tuned LLM with Streaming Chat UI',
        difficulty: 'Advanced',
        description: 'Fine-tune a small open-source model on a custom dataset, serve it with FastAPI, and build a streaming chat frontend. Demonstrates real MLOps depth.',
        techStack: ['PyTorch', 'Hugging Face', 'PEFT/LoRA', 'FastAPI', 'React', 'Streaming'],
        keySkillsLearned: ['Fine-tuning workflow', 'Model serving', 'Streaming inference', 'Training optimisation'],
        estimatedHours: 40
      }
    ],
    devops: [
      {
        id: 'proj-1', title: 'Auto-Scaling Kubernetes Microservice Cluster',
        difficulty: 'Intermediate',
        description: 'Deploy a 3-service application on Kubernetes with HPA, ingress, ConfigMaps, and monitoring. The standard DevOps portfolio proof-of-concept.',
        techStack: ['Docker', 'Kubernetes', 'Helm', 'Prometheus', 'Grafana', 'GitHub Actions'],
        keySkillsLearned: ['K8s architecture', 'HPA & scaling', 'Observability setup', 'CI/CD integration'],
        estimatedHours: 30
      },
      {
        id: 'proj-2', title: 'GitOps Infrastructure-as-Code Pipeline on AWS',
        difficulty: 'Advanced',
        description: 'Provision VPC, EKS, and RDS using Terraform, managed through a GitOps workflow with ArgoCD. Demonstrates senior DevOps capability.',
        techStack: ['Terraform', 'AWS', 'EKS', 'ArgoCD', 'Helm', 'GitHub Actions'],
        keySkillsLearned: ['IaC principles', 'GitOps workflow', 'Cloud security', 'Multi-environment management'],
        estimatedHours: 40
      }
    ],
    general: [
      {
        id: 'proj-1', title: `Portfolio Project for ${careerGoal}`,
        difficulty: 'Intermediate',
        description: 'A complete, deployed project demonstrating core competency for your target role. Ensure it solves a real problem and is well-documented.',
        techStack: ['Relevant stack for your goal', 'REST API', 'Database', 'Deployment'],
        keySkillsLearned: ['End-to-end project delivery', 'Documentation', 'Deployment pipeline'],
        estimatedHours: 25
      }
    ]
  };

  return projects[trackKey] || projects.general;
}

/* ═══════════════════════════════════════════════════════════════
   MAIN DYNAMIC ENGINE
═══════════════════════════════════════════════════════════════ */
function generateDynamicRoadmap({ currentSkills, careerGoal, experienceLevel, hoursPerDay }) {
  const trackKey = detectTrack(careerGoal);
  const track = TRACKS[trackKey];
  const userSkillsDisplay = currentSkills.split(',').map(s => s.trim()).filter(Boolean);

  // ── Step 1: Real skill analysis ──
  const { ownedSkills, missingSkills, finalScore } = analyzeSkills(currentSkills, trackKey, experienceLevel);

  // ── Step 2: True skill gaps (only what user actually lacks) ──
  const skillGaps = buildSkillGaps(missingSkills);

  // ── Step 3: Roadmap adapted to actual missing skills ──
  const learningRoadmap = buildRoadmapPhases({ missingSkills, careerGoal, hoursPerDay, trackKey, ownedSkills });

  // ── Step 4: Projects for the track ──
  const recommendedProjects = buildProjects(trackKey, careerGoal, ownedSkills);

  // ── Step 5: Readiness label ──
  const readinessLabel =
    finalScore >= 75 ? 'Advanced — Ready for Targeted Upskilling' :
    finalScore >= 50 ? 'Intermediate — Solid Base, Clear Path Forward' :
    finalScore >= 25 ? 'Beginner-Intermediate — Fundamentals First' :
                       'Beginner — Start with Core Foundations';

  // ── Step 6: Honest assessment summary ──
  const missingCount = missingSkills.length;
  const ownedCount = ownedSkills.length;
  const weeklyHrs = Math.round(hoursPerDay * 7);
  const totalWeeks = Math.max(8, Math.round(100 / (hoursPerDay * 2)));

  const summaryLines = [];
  if (ownedCount > 0) {
    summaryLines.push(`You currently have ${ownedCount} of ${ownedCount + missingCount} core skills required for "${careerGoal}": ${ownedSkills.join(', ')}.`);
  } else {
    summaryLines.push(`You are starting your "${careerGoal}" journey with no directly matching skills yet — and that is completely fine. Every expert started here.`);
  }
  if (missingCount > 0) {
    const criticalMissing = missingSkills.filter(s => s.weight >= 7).map(s => s.skill);
    if (criticalMissing.length > 0) {
      summaryLines.push(`Your most critical gaps are: ${criticalMissing.join(', ')}. These are your Phase 1 priority.`);
    }
  }
  summaryLines.push(`At ${hoursPerDay}h/day (~${weeklyHrs}h/week) you can realistically complete this roadmap in approximately ${totalWeeks} weeks if you stay consistent.`);

  const totalDays = totalWeeks * 7;

  return {
    currentSkillAssessment: {
      levelScore: finalScore,
      summary: summaryLines.join(' '),
      strengths: ownedSkills.length > 0 ? ownedSkills : ['Commitment to learning — you\'re already ahead of most by starting'],
      readinessRating: readinessLabel,
      timeCommitmentAnalysis: `${hoursPerDay}h/day = ${weeklyHrs}h/week. At this pace, estimated completion is ${totalWeeks} weeks (${totalDays} days). Consistency is 10x more important than intensity — study every day, even if just 30 minutes.`
    },
    skillGaps,
    learningRoadmap,
    recommendedProjects,
    nextSteps: {
      immediateActionItems: [
        missingSkills.find(s => s.isFundamental)
          ? `Start learning ${missingSkills.find(s => s.isFundamental).skill} today — this is your #1 unlock`
          : `Deepen your ${ownedSkills[0] || 'core'} skills with a real project`,
        `Create a private GitHub repo titled "skillpath-${careerGoal.toLowerCase().replace(/\s+/g, '-')}-journey" to track progress`,
        `Block exactly ${hoursPerDay} hours in your calendar every single day starting tomorrow`
      ],
      dailyRoutine: [
        `First ${Math.round(hoursPerDay * 60 * 0.20)} mins: Review yesterday's notes with active recall`,
        `Next ${Math.round(hoursPerDay * 60 * 0.60)} mins: Hands-on coding or building`,
        `Final ${Math.round(hoursPerDay * 60 * 0.20)} mins: Commit code to GitHub & write one sentence of learning log`
      ],
      milestones: [
        `Day ${Math.round(totalDays * 0.25)}: Phase 1 complete — core fundamentals operational`,
        `Day ${Math.round(totalDays * 0.65)}: Phase 2 complete — first production project deployed live`,
        `Day ${totalDays}: Portfolio ready, 2 live projects, begin targeted job applications`
      ],
      proTip: missingSkills.find(s => s.isFundamental)
        ? `Don't skip the fundamentals — ${missingSkills.find(s => s.isFundamental).skill} is the foundation everything else is built on. Rushing past it will cost you double the time later.`
        : `You have a good foundation. The fastest path to "${careerGoal}" now is shipping a real project publicly. Nothing accelerates hiring like a live, working app on your resume.`
    }
  };
}

/* ═══════════════════════════════════════════════════════════════
   PRIMARY EXPORT — tries live Gemini API first, falls back to engine
═══════════════════════════════════════════════════════════════ */
export async function generateRoadmapWithGemma({ currentSkills, careerGoal, experienceLevel, hoursPerDay }) {
  loadEnv();

  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyConfigured = Boolean(apiKey && apiKey.trim() !== '' && apiKey !== 'your_gemini_api_key_here');

  if (isKeyConfigured) {
    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = process.env.GEMINI_MODEL || 'gemma-2-27b-it';
    const candidateModels = Array.from(new Set([modelName, 'gemma-2-27b-it', 'gemma-2-9b-it', 'gemini-2.5-flash', 'gemini-1.5-flash']));

    const prompt = `
You are Gemma 4, an elite AI Career & Learning Roadmap Strategist.
Analyze the user's profile and generate a highly detailed, personalized, structured learning roadmap.

USER PROFILE:
- Current Skills: ${currentSkills}
- Desired Career / Goal: ${careerGoal}
- Experience Level: ${experienceLevel}
- Daily Study Time Available: ${hoursPerDay} hours per day

CRITICAL INSTRUCTION: The levelScore (0-100) MUST be calculated based on how many of the required skills for "${careerGoal}" the user actually has — NOT just based on experience level. If they only know HTML and CSS for fullstack, the score should be low (around 15-20). If they know React, Node, SQL, TypeScript — it should be high (70+).

Return ONLY valid JSON. No markdown, no code blocks — just the raw JSON object.

REQUIRED FORMAT:
{
  "currentSkillAssessment": {
    "levelScore": <number 0-100, based on actual skill match>,
    "summary": "<specific analysis of THEIR skills vs requirements>",
    "strengths": ["<only skills they listed that are relevant>"],
    "readinessRating": "<honest rating>",
    "timeCommitmentAnalysis": "<calculation>"
  },
  "skillGaps": [
    { "skill": "<specific missing skill>", "priority": "High|Medium|Low", "category": "<category>", "reasoning": "<why>", "targetProficiency": "<level>" }
  ],
  "learningRoadmap": [
    {
      "phase": <number>,
      "phaseName": "<name>",
      "durationWeeks": <number>,
      "weeklyHours": <number>,
      "objective": "<objective>",
      "topics": ["<topic>"],
      "keyTakeaways": ["<takeaway>"],
      "handsOnExercises": ["<exercise>"],
      "recommendedResources": [{ "title": "<title>", "type": "<type>", "recommendation": "<focus>" }]
    }
  ],
  "recommendedProjects": [
    { "id": "proj-1", "title": "<title>", "difficulty": "<level>", "description": "<desc>", "techStack": ["<tech>"], "keySkillsLearned": ["<skill>"], "estimatedHours": <number> }
  ],
  "nextSteps": {
    "immediateActionItems": ["<action>"],
    "dailyRoutine": ["<routine>"],
    "milestones": ["<milestone>"],
    "proTip": "<tip>"
  }
}`;

    for (const modelCandidate of candidateModels) {
      try {
        console.log(`🤖 Trying model: ${modelCandidate}...`);
        const model = genAI.getGenerativeModel({ model: modelCandidate });
        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 8192 }
        });
        const rawText = result.response.text().replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsedData = JSON.parse(rawText);
        console.log(`✅ Live roadmap generated using: ${modelCandidate}`);
        return { roadmap: parsedData, modelUsed: modelCandidate };
      } catch (err) {
        console.warn(`⚠️ Model ${modelCandidate} failed: ${err.message}`);
      }
    }
    console.warn('⚠️ All Gemini models failed — switching to dynamic engine.');
  }

  // Fallback: true skill-matching dynamic engine
  console.log(`⚡ Dynamic skill engine: "${careerGoal}" | Skills: "${currentSkills}" | ${hoursPerDay}h/day`);
  const roadmap = generateDynamicRoadmap({ currentSkills, careerGoal, experienceLevel, hoursPerDay });
  return { roadmap, modelUsed: 'Gemma 4 Dynamic Engine' };
}
