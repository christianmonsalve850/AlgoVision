# AlgoVision

> Learn algorithms through visualization, not memorization.

AlgoVision is an interactive interview preparation platform designed to help developers truly understand data structures and algorithms through real-time visualizations, coding challenges, guided lessons, mock interviews, and AI-assisted learning.

Unlike traditional coding platforms that focus primarily on problem solving, AlgoVision focuses on pattern recognition and conceptual understanding by allowing users to see how algorithms execute step-by-step.

---

## ✨ Features

### 📚 Interactive Lessons

Learn core algorithmic concepts through structured lessons that include:

- Concept explanations
- Code examples
- Interactive visualizations
- Knowledge checks (MCQs)
- Guided walkthroughs

### 💻 Coding Challenges

Practice interview-style problems with:

- Multiple difficulty levels
- Category filtering
- Daily challenges
- Recommended problems
- Multi-language support

### 🎬 Algorithm Visualizations

Visualize code execution in real time.

Features include:

- Step-by-step execution playback
- Variable inspection
- Call stack visualization
- Array visualizations
- Graph visualizations
- Pointer tracking
- Execution timeline controls

### 🤖 AI-Assisted Learning

Receive educational guidance when stuck.

Examples:

- Pattern recognition hints
- Complexity analysis
- Data structure suggestions
- Concept explanations

### 🎯 Mock Interview Mode

Simulate technical interviews with:

- Timed coding sessions
- Hidden test cases
- Difficulty selection
- Performance evaluation

### 📊 Progress Tracking

Track learning progress through:

- Problems solved
- Daily streaks
- Categories mastered
- Lesson completion
- Difficulty statistics

---

## 🚀 Vision

Most interview preparation platforms teach users how to solve a problem.

AlgoVision aims to teach users why a solution works.

The goal is to create a complete learning loop:

```text
Learn
  ↓
Visualize
  ↓
Practice
  ↓
Interview
```

By combining lessons, visualizations, coding challenges, and interview preparation into a single experience, AlgoVision helps users build deeper intuition for algorithms and data structures.

---

## 🏗️ Tech Stack

### Frontend

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Shadcn/UI
- Monaco Editor

### Backend

- Next.js Route Handlers
- TypeScript

### Database

- PostgreSQL
- Supabase

### Authentication

- Supabase Auth
- Google OAuth
- GitHub OAuth
- Email Authentication

### AI

- OpenAI API

### Visualization

- React
- SVG

### Deployment

- Vercel

---

## 🧠 Core Architecture

AlgoVision is built around an execution trace architecture.

```text
User Code
    ↓
Execution Engine
    ↓
Execution Trace
    ↓
Visualization Engine
    ↓
Interactive UI
```

The execution engine generates runtime state information.

The visualization engine consumes that state and renders:

- Variables
- Arrays
- Graphs
- Call stacks
- Pointer movement
- Algorithm progression

This separation allows the visualization system to remain reusable and extensible.

---

## 📂 Project Structure

```text
src/

├── app/
├── components/
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── lessons/
│   ├── problems/
│   ├── visualizer/
│   ├── interviews/
│   └── ai/
│
├── services/
├── hooks/
├── lib/
├── types/
└── content/
    └── lessons/
```

---

## 🛣️ Roadmap

### MVP

- [ ] Authentication
- [ ] Problem Browser
- [ ] Monaco Code Editor
- [ ] Execution Trace System
- [ ] Array Visualizations
- [ ] Two Pointer Visualizations
- [ ] Lesson System
- [ ] Dashboard
- [ ] AI Hints
- [ ] Interview Mode

### Future Features

- [ ] Tree Visualizations
- [ ] Linked List Visualizations
- [ ] Heap Visualizations
- [ ] Trie Visualizations
- [ ] AI Interviewer
- [ ] Multiplayer Interviews
- [ ] Personalized Learning Paths
- [ ] Public User Profiles
- [ ] Redis Integration
- [ ] AWS-Based Execution Infrastructure

---

## 🎯 Target Audience

AlgoVision is designed for:

- Computer Science Students
- Self-Taught Developers
- Bootcamp Graduates
- Interview Candidates
- Professional Software Engineers

---

## 🤝 Contributing

This project is currently under active development.

Future contribution guidelines will be added as the platform matures.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Christian Monsalve

Built to help developers understand algorithms, not just solve them.