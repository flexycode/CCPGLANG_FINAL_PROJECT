# 🎓 Student Attendance Monitoring System

[![CCPGLANG](https://img.shields.io/badge/Subject-CCPGLANG-blue?style=for-the-badge)](https://github.com/flexycode/CCPGLANG_FINAL_PROJECT)
[![Section](https://img.shields.io/badge/Section-COM232-green?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

> A final project for **CCPGLANG — Programming Language** that demonstrates the contrast between **JavaScript (Functional Paradigm)** and **Python (Object-Oriented Paradigm)** through a Student Attendance Monitoring System.

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Team Members](#-team-members---artificial-ledger)
- [Tech Stack & Paradigms](#-tech-stack--paradigms)
- [Key Features](#-key-features)
- [Project Structure](#-project-structure)
- [Timeline](#-timeline)
- [Getting Started](#-getting-started)
- [License](#-license)

---

## 📖 About the Project

The **Student Attendance Monitoring System** is designed to track and manage student attendance records in an academic setting. This project serves as a practical demonstration of how **two different programming languages** — each using a **different programming paradigm** — approach the same problem domain.

### Objective

- Demonstrate how **JavaScript + React** solves attendance tracking using **Functional Programming** (pure functions, immutability, composition)
- Demonstrate how **Python** solves the same problem using **Object-Oriented Programming** (classes, encapsulation, methods)
- Document and explain every function/method with detailed purpose and paradigm-specific rationale

---

## 👥 Team Members — Artificial Ledger

| # | Name | Role | GitHub |
|---|------|------|--------|
| 1 | **TALOSIG, JAY ARRE PIANO** | 🏆 Project Leader | [![GitHub](https://img.shields.io/badge/-flexycode-181717?style=flat&logo=github)](https://github.com/flexycode) |
| 2 | **CASTRO, JAMES ADRIAN BEER** | Member | [![GitHub](https://img.shields.io/badge/-GitHub-181717?style=flat&logo=github)](#) |
| 3 | **CUNANAN, MARCO POLO MOLINA FEBRERO** | Member | [![GitHub](https://img.shields.io/badge/-GitHub-181717?style=flat&logo=github)](#) |
| 4 | **DELA RAMA, RINOAH VENEDICT B** | Member | [![GitHub](https://img.shields.io/badge/-GitHub-181717?style=flat&logo=github)](#) |
| 5 | **GLODO, JANNAH CLEINE TIBOR** | Member | [![GitHub](https://img.shields.io/badge/-GitHub-181717?style=flat&logo=github)](#) |
| 6 | **MARISGA, JERSEY MAE DELA PAZ** | Member | [![GitHub](https://img.shields.io/badge/-GitHub-181717?style=flat&logo=github)](#) |
| 7 | **POSERIO, JED NATHAN BUSTAMANTE** | Member | [![GitHub](https://img.shields.io/badge/-GitHub-181717?style=flat&logo=github)](#) |

> **Note:** GitHub profile links with `#` are placeholders. Team members should update with their actual GitHub profile URLs.

---

## 🛠 Tech Stack & Paradigms

| Component | Technology | Paradigm | Purpose |
|-----------|------------|----------|---------|
| **Frontend** | JavaScript + React | Functional Programming | UI rendering, state management via pure functions, attendance calculations using `map`, `filter`, `reduce` |
| **Backend** | Python | Object-Oriented Programming | Data modeling via classes, encapsulated business logic, method-based analytics |
| **Design** | Figma | — | UI/UX wireframes and prototyping |

### Paradigm Comparison at a Glance

```
┌─────────────────────────────────────────────────────────────────────┐
│                     SAME PROBLEM DOMAIN                            │
│              Student Attendance Monitoring System                   │
├──────────────────────────────┬──────────────────────────────────────┤
│    JavaScript + React        │          Python                     │
│    (Functional Paradigm)     │     (OOP Paradigm)                  │
├──────────────────────────────┼──────────────────────────────────────┤
│  Pure functions              │  Classes & Objects                  │
│  Immutable state             │  Mutable internal state             │
│  Function composition        │  Method chaining                    │
│  Higher-order functions      │  Encapsulation                      │
│  useState / useReducer       │  self attributes                    │
│  No side effects             │  Stateful methods                   │
└──────────────────────────────┴──────────────────────────────────────┘
```

---

## ✨ Key Features

### Attendance Status Tracking

| Status | Description |
|--------|-------------|
| ✅ **Present** | Student attended the class session |
| ❌ **Absent** | Student did not attend with no valid excuse |
| ⏰ **Late** | Student arrived after the designated cutoff time |
| 📋 **Excused** | Student absent with an approved valid excuse |

### Student Status Management

| Status | Description |
|--------|-------------|
| 🟢 **Regular / Enrolled** | Actively enrolled and attending classes |
| 🟡 **Late Enrolled** | Enrolled after the official enrollment period |
| 🔴 **Dropped Out** | Voluntarily or involuntarily removed from the class |
| ⛔ **Suspended** | Temporarily barred from attending |

### Time Tracking

- **Time In** — Logs the exact timestamp when a student arrives / checks in
- **Time Out** — Logs the exact timestamp when a student leaves / checks out

### Attendance Analytics & Calculated Metrics

| Metric | Description | Formula |
|--------|-------------|---------|
| **Total Present** | Number of days marked present | `count(status == "present")` |
| **Total Absent** | Number of days marked absent | `count(status == "absent")` |
| **Total Excused** | Number of excused absences | `count(status == "excused")` |
| **Total Days Attended** | Days physically in class | `total_present + total_late` |
| **Total School Days** | All scheduled class days | `count(all_scheduled_days)` |
| **Attendance Percentage** | Overall attendance rate | `(days_attended / school_days) × 100` |
| **Absence Percentage** | Overall absence rate | `(total_absent / school_days) × 100` |
| **Late Percentage** | Rate of tardiness | `(total_late / school_days) × 100` |
| **Consecutive Absences** | Longest absence streak | Max sequential absent days |
| **Consecutive Lates** | Longest late streak | Max sequential late days |

> 📝 Each metric above is implemented in **both JS (functional)** and **Python (OOP)** with detailed inline documentation explaining the paradigm-specific approach.

---

## 📁 Project Structure

```
CCPGLANG_FINAL_PROJECT/
├── 📄 README.md
├── 📄 LICENSE
│
├── 📂 docs/                          # Manuscript & documentation
│   ├── manuscript.md                 # Full written manuscript
│   ├── paradigm-comparison.md        # Side-by-side code comparisons
│   └── figures/                      # Diagrams, Figma exports
│
├── 📂 frontend/                      # JS + React (Functional Paradigm)
│   ├── src/
│   │   ├── components/               # React functional components
│   │   ├── hooks/                    # Custom hooks
│   │   ├── utils/                    # Pure utility functions
│   │   │   ├── attendance.js         # Attendance marking functions
│   │   │   ├── analytics.js          # Metrics & calculations
│   │   │   └── time.js               # Time tracking utilities
│   │   └── App.jsx
│   └── package.json
│
├── 📂 backend/                       # Python (OOP Paradigm)
│   ├── models/
│   │   ├── student.py                # Student class
│   │   ├── attendance_record.py      # AttendanceRecord class
│   │   └── attendance_tracker.py     # AttendanceTracker manager
│   ├── services/
│   │   ├── analytics_service.py      # Analytics calculations
│   │   └── time_service.py           # Time tracking logic
│   ├── main.py
│   └── requirements.txt
│
└── 📂 figma/                         # Figma design assets & exports
    └── exports/
```

---

## 📅 Timeline

| Week | Focus | Key Deliverables |
|------|-------|-----------------|
| **Week 1** (Sep 8–14) | Research, Design & Docs Foundation | Figma wireframes, manuscript outline, feature docs |
| **Week 2** (Sep 15–21) | Python OOP Backend | Working backend, unit tests, OOP manuscript section |
| **Week 3** (Sep 22–28) | JS + React Frontend | Working frontend, Figma-to-code, Functional manuscript section |
| **Week 4** (Sep 29–Oct 6) | Integration, Polish & Submission | Complete system, final manuscript, demo, GitHub release |

---

## 🚀 Getting Started

> 🔧 **Setup instructions will be added once the development phase begins.**

### Prerequisites

- Node.js (v18+)
- Python (v3.10+)
- npm or yarn

### Frontend (JavaScript + React)

```bash
cd frontend
npm install
npm run dev
```

### Backend (Python)

```bash
cd backend
pip install -r requirements.txt
python main.py
```

---

## 📜 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <b>Artificial Ledger</b> · CCPGLANG — Programming Language · COM232
</p>
