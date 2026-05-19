# 🎓 Progressive English Learning Library (PELL)

PELL is a premium gamified English learning platform designed with modern visual aesthetics. The platform features an automated role-based gateway routing system, an interactive student progression pathway, and a complete teacher administration workspace built on a structured **Clean Architecture** codebase.

---

## 🛠️ Technology Stack

The platform is engineered using modern, high-performance web technologies:

* **Next.js 15 (v15.5.18)** — Modern React meta-framework utilizing client-to-server App Router architecture for optimized, instantaneous routing transitions.
* **React 19 (v19.2.6)** — Component-driven dynamic UI layer with high reactivity.
* **TypeScript (v5)** — Type-safe implementation enforcing core clean coding architectures and data structures.
* **Tailwind CSS v4** — High-performance utility CSS system styling the platform's glassmorphic dark-mode visuals.
* **Lucide React (v1.16)** — Minimalist modern vector icons powering all dashboard navigation and interactive controls.
* **Firebase SDK (v12.13)** — Utilizes **Cloud Firestore** for real-time document data synchronization and **Firebase Authentication** for secure account validations.
* **Smart Sandbox Fallback** — Integrates an automatic offline database simulation inside `localStorage` when running on `localhost` (zero configuration needed for local testing).

---

## ✨ Features by Dashboard & Role

### 1. Student Dashboard (Siswa)
An interactive, high-fidelity gamified learning environment:
* **Interactive Leveling System** — Automatically calculates student level based on accumulated XP (Level ups every 100 XP), complete with a sleek glowing level badge and animated progression tracker.
* **Progressive Milestones Pathway** — Multi-milestone curriculum pathway. Topik kuis berikutnya terkunci secara otomatis hingga siswa mengumpulkan batas minimum XP (misal: 50 XP) sebagai syarat kelulusan.
* **Rich Quiz Portal** — Take responsive, time-sensitive quizzes attached to specific learning topics to generate classroom XP payouts.

### 2. Teacher & School Admin Portal
A unified administration workspace to monitor and shape class curriculums:
* **Real-time Analytics** — Instantly review total curriculum students, active learning topics, and cumulative classroom XP scores.
* **Smart Student Roster (CRUD)**:
  * **Register New Student** — Add student profiles to automatically generate permanent student IDs matching the tenant format (e.g. `AAR-0001`).
  * **Inline Roster Editing** — Fast, premium inline row editor to update first names, last names, current grades, class sections, and cumulative XP scores directly in the table.
  * **Student Deletion** — Instantly remove records, automatically adjusting class analytics and metrics.
* **Content & Quiz Builder**:
  * **Topic Creator** — Construct new learning topics complete with description parameters, order sequencing, and custom XP rewards.
  * **Question Generator** — Attach questions to curriculum topics. Supports **Multiple Choice** (with dynamic option arrays), **Translation**, and **Short Answer** (Fill-in-the-blank) formats.

---

## 📂 Core Folder Architecture

The codebase enforces a strict separation of concerns following **Clean Architecture**:
```bash
lib/
├── domain/       # Core business logic entities & generators (e.g., student ID logic)
├── repositories/ # Abstract interface boundaries for database queries
├── data/         # Implementations of interfaces (Firestore & Offline LocalStorage fallbacks)
├── usecases/     # Interactors executing core application use cases (Auth, ContentBuilder)
└── controllers/  # Framework-agnostic React hooks bridging database models to UI states
```

---

## 🚀 Getting Started

### 1. Installation
Clone the repository and install all dependencies:
```bash
npm install
```

### 2. Run the Development Server
Initiate the Next.js dev compiler:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to experience PELL.

---

## 🔒 Developer Quick Login Guide (Sandbox Mode)

When PELL is compiled locally on `localhost`, the sandbox mode initializes automatically. You can bypass cloud databases and log in immediately using these pre-seeded local credentials:

| Role / Role Title | Mock Account ID / Email | Default Password | Initial Roster State |
| :--- | :--- | :--- | :--- |
| **School Administrator** | `admin@pell.edu` | `12345678` | Reroutes to Dashboard as *Principal Fatima* |
| **Teacher** | `teacher@pell.edu` | `12345678` | Reroutes to Dashboard as *Mr. Hariri* |
| **Student** | `AAR-0001` | `12345678` | Reroutes to Student Pathway as *Fatimah Al-Mansoor* |
