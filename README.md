# JEE Quiz Studio

A modern, zero-dependency quiz and practice studio for JEE-level Physics, Chemistry, and Mathematics — featuring 450+ built-in questions, procedural formula-based generators, on-demand AI question synthesis, and per-topic accuracy tracking to surface weak areas over time.

🔗 **Live App:** https://happ3ns.github.io/JEE-Quiz-Generator/

---

## Features

- **Multi-Page Web Architecture:** Seamless client-side routing across 5 dedicated modules: Practice Studio, Syllabus Explorer, Mock Center, Analytics, and Formula Vault.
- **Three-Tier Syllabus Explorer:** Complete hierarchical tree navigation (Sections → Subsections → Sub-subsections) covering Physics, Chemistry, and Mathematics with instant topic drills.
- **Computer-Based Test (CBT) Mock Center:** Realistic NTA-style timed test environment with section switching and official JEE Mains (+4 / -1) negative marking.
- **KaTeX Mathematical Equations:** High-performance LaTeX rendering for complex integrals, kinetic rates, and vectors.
- **Persistent Diagnostic Analytics:** Local storage accuracy matrix tracking strong and weak areas with percentile estimates.
- **Verified Question Bank & Procedural Generators:** 450+ multi-tier conceptual questions and automated Gemini API batch generation tooling.
- **Zero Build Setup:** Runs directly in any browser on GitHub Pages with zero external build dependencies.

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
├── index.html                  # Semantic application markup & CDN integrations (KaTeX, Confetti)
├── css/                        # Modular stylesheet architecture
│   ├── theme.css               # Design tokens, fonts, colors, and resets
│   ├── layout.css              # Masthead, responsive grid, card containers
│   ├── components.css          # Subject cards, segmented controls, option rows, solution drawer
│   ├── navigation.css          # Tab navigation, breadcrumbs, 3-tier syllabus tree & mock cards
│   └── results.css             # Score gauge, stats grid, topic mastery bars, review list
├── js/                         # Modular JavaScript application engine
│   ├── state.js                # App state, localStorage persistence, Web Audio synth
│   ├── taxonomy.js             # 3-tier JEE hierarchy (Sections, Subsections, Topics) & formulas
│   ├── marking.js              # JEE Mains (+4 / -1) vs Standard scoring calculation
│   ├── katex-render.js         # KaTeX math auto-renderer
│   ├── router.js               # Client-side hash routing across application pages
│   ├── ui.js                   # Active quiz canvas, question pool, results controller
│   ├── views/                  # View modules
│   │   ├── syllabus-view.js    # Sections & sub-subsections matrix with search & drills
│   │   ├── mock-view.js        # CBT mock exam test center launcher
│   │   ├── analytics-view.js   # Diagnostic metrics, percentile estimate & history log
│   │   └── formulas-view.js    # High-yield KaTeX equation reference vault
│   └── app.js                  # App bootstrap, event wiring, and keyboard shortcuts
├── questions.js                # Modular question bank & procedural generator functions
├── questions.json              # Full 450+ validated questions exported for tooling/APIs
├── tools/
│   ├── validate_questions.py   # Automated validation script (checks bounds, duplicate text, keys)
│   └── generate_with_gemini.py # Automated batch question generator with Gemini
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
