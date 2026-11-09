# JEE Quiz Studio

A modern, zero-dependency quiz and practice studio for JEE-level Physics, Chemistry, and Mathematics — featuring 450+ built-in questions, procedural formula-based generators, on-demand AI question synthesis, and per-topic accuracy tracking to surface weak areas over time.

🔗 **Live App:** https://happ3ns.github.io/JEE-Quiz-Generator/

---

## Features

- **450+ Verified Questions + Procedural Generators:** Covers Physics, Chemistry, and Mathematics across Easy, Medium, and Hard tiers.
- **⚡ On-Demand AI Generation:** Generate fresh, custom JEE questions in real time on any subject/topic using the integrated Google Gemini API.
- **Mock Exam & Practice Modes:** Timed multi-subject mock sessions (Chemistry → Physics → Maths) or focused practice with instant step-by-step explanations.
- **Smart Weak-Topic Tracker:** Automatically tracks your per-topic accuracy in `localStorage` across attempts to guide your revision.
- **Live Question Map & Side Rail:** Interactive navigation matrix showing status (answered, unanswered, correct, incorrect) in real time.
- **Zero Build Setup:** Runs directly in any browser with no dependencies or build steps required.

---

## Architecture

```mermaid
flowchart LR
    %% ---------- Styling ----------
    classDef client  fill:#eef4f0,stroke:#2f6f4e,stroke-width:1.5px,color:#18181b
    classDef engine  fill:#eff4fb,stroke:#1d4ed8,stroke-width:1.5px,color:#18181b
    classDef storage fill:#fdf6e3,stroke:#a16207,stroke-width:1.5px,color:#18181b
    classDef host    fill:#f5f5f5,stroke:#52525b,stroke-width:1px,color:#18181b
    classDef ai      fill:#f3e8ff,stroke:#7c3aed,stroke-width:1.5px,color:#18181b

    %% ---------- Layer 1: Delivery ----------
    subgraph L1["1 · Delivery"]
        direction TB
        H1["GitHub Pages<br/><i>static hosting</i>"]
        H2["index.html<br/><i>UI & state manager</i>"]
    end

    %% ---------- Layer 2: Client ----------
    subgraph L2["2 · User Interface"]
        direction TB
        U1["Subject + Difficulty<br/>selector"]
        U2["Question view<br/>+ instant feedback"]
        U3["Results view<br/>+ answer review"]
    end

    %% ---------- Layer 3: Engine ----------
    subgraph L3["3 · Quiz Engine"]
        direction TB
        Q1["Question Bank<br/><i>questions.js / questions.json</i>"]
        Q2["Procedural Generator<br/><i>formula-based numericals</i>"]
        Q3["Filter & Shuffle<br/>subject × difficulty × topic"]
        Q4["Score & Weak-Topic Analyzer<br/>per-topic accuracy tracking"]
    end

    %% ---------- Layer 4: AI & Persistence ----------
    subgraph L4["4 · External & Storage"]
        direction TB
        AI["Gemini API<br/><i>on-demand question synthesis</i>"]
        P1[("topic_accuracy<br/><i>localStorage</i>")]
        P2[("attempt_history<br/><i>localStorage</i>")]
    end

    %% ---------- Edges ----------
    H1 --> H2
    H2 --> U1
    Q1 --> Q3
    Q2 --> Q3
    AI -.->|injects questions| Q3
    U1 --> Q3
    Q3 --> U2
    U2 --> Q4
    Q4 --> P1
    Q4 --> P2
    P1 -.->|loads on open| U1
    Q4 --> U3

    %% ---------- Apply classes ----------
    class H1,H2 host
    class U1,U2,U3 client
    class Q1,Q2,Q3,Q4 engine
    class P1,P2 storage
    class AI ai
```

---

## Project Structure

```
├── index.html                  # UI, state management, timer, and AI generation controls
├── questions.js                # Modular question bank & procedural generator functions
├── questions.json              # Full 450+ validated questions exported for tooling/APIs
├── tools/
│   └── validate_questions.py   # Automated validation script (checks bounds, duplicate text, keys)
└── README.md
```

---

## Running Locally

No build step or bundler needed. Simply open `index.html` in your browser or run:

```bash
python3 -m http.server 8000
# Open http://localhost:8000 in your browser
```

---

## Automated Validation

To run automated checks across the question bank (verifying answer bounds, field schemas, and duplicate questions):

```bash
python tools/validate_questions.py
```

---

## License

MIT — feel free to use, modify, and extend.
