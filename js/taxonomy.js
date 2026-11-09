// ── JEE Three-Tier Syllabus Taxonomy & Formula Repository ──
(function (root) {
  "use strict";

  const JEE_TAXONOMY = [
    {
      id: "Physics",
      name: "Physics",
      icon: "⚛️",
      color: "#06b6d4",
      subsections: [
        {
          id: "mechanics",
          name: "Mechanics & Properties of Matter",
          icon: "🚀",
          desc: "Kinematics, dynamics, gravitation, circular motion & fluids",
          topics: [
            "Kinematics",
            "Projectile Motion",
            "Circular Motion",
            "Work, Energy and Power",
            "Gravitation",
            "Properties of Matter",
            "Mechanics"
          ]
        },
        {
          id: "waves-optics",
          name: "Oscillations, Waves & Optics",
          icon: "🌊",
          desc: "Simple harmonic motion, sound waves, ray & wave optics",
          topics: [
            "Oscillations",
            "Waves",
            "Optics"
          ]
        },
        {
          id: "electromagnetism-modern",
          name: "Electrodynamics & Modern Physics",
          icon: "⚡",
          desc: "Electric fields, potential, circuits, magnetism, quanta & atoms",
          topics: [
            "Electrostatics",
            "Electrodynamics",
            "Modern Physics"
          ]
        }
      ]
    },
    {
      id: "Chemistry",
      name: "Chemistry",
      icon: "🧪",
      color: "#10b981",
      subsections: [
        {
          id: "physical-chemistry",
          name: "Physical Chemistry & States of Matter",
          icon: "🔬",
          desc: "Stoichiometry, atomic models, bonding, thermodynamics & solutions",
          topics: [
            "Mole Concept",
            "Atomic Structure",
            "Chemical Bonding",
            "States of Matter",
            "Thermodynamics",
            "Solutions",
            "Physical"
          ]
        },
        {
          id: "equilibrium-kinetics",
          name: "Equilibrium, Kinetics & Electrochemistry",
          icon: "⚖️",
          desc: "Reversible reactions, pH, rates of reaction, redox & galvanic cells",
          topics: [
            "Chemical Equilibrium",
            "Ionic Equilibrium",
            "Acid-Base Equilibrium",
            "Chemical Kinetics",
            "Electrochemistry",
            "Redox Reactions",
            "Equilibrium"
          ]
        },
        {
          id: "inorganic-organic",
          name: "Inorganic & Organic Chemistry",
          icon: "🧬",
          desc: "Coordination complexes, periodic trends, reaction mechanisms & biomolecules",
          topics: [
            "Coordination Compounds",
            "Inorganic",
            "Organic",
            "Organic Chemistry"
          ]
        }
      ]
    },
    {
      id: "Mathematics",
      name: "Mathematics",
      icon: "📐",
      color: "#6366f1",
      subsections: [
        {
          id: "algebra",
          name: "Algebra & Discrete Mathematics",
          icon: "🧮",
          desc: "Quadratic equations, sequences & series, binomial, matrices & complex numbers",
          topics: [
            "Quadratic Equations",
            "Complex Numbers",
            "Sequences",
            "Series",
            "Progressions",
            "Binomial Theorem",
            "Matrices",
            "Algebra"
          ]
        },
        {
          id: "calculus",
          name: "Differential & Integral Calculus",
          icon: "📈",
          desc: "Limits, continuity, derivatives, tangents, definite integrals & differential equations",
          topics: [
            "Limits",
            "Differentiation",
            "Applications of Derivatives",
            "Integral Calculus",
            "Differential Equations",
            "Calculus"
          ]
        },
        {
          id: "geometry-vectors",
          name: "Geometry, Vectors & Probability",
          icon: "🧭",
          desc: "Coordinate geometry, straight lines, circles, 3D vectors & probability models",
          topics: [
            "Coordinate Geometry",
            "Geometry",
            "Parametric Equations",
            "Trigonometry",
            "Vectors",
            "Probability",
            "Statistics"
          ]
        }
      ]
    }
  ];

  // High-yield formula references
  const FORMULA_RECORDS = [
    {
      subject: "Physics",
      subsection: "Mechanics & Properties of Matter",
      title: "Equations of Kinematics",
      formulas: [
        { label: "Velocity-Time", tex: "v = u + at" },
        { label: "Displacement-Time", tex: "s = ut + \\frac{1}{2}at^2" },
        { label: "Velocity-Displacement", tex: "v^2 = u^2 + 2as" },
        { label: "Displacement in nth second", tex: "s_n = u + \\frac{a}{2}(2n - 1)" }
      ]
    },
    {
      subject: "Physics",
      subsection: "Mechanics & Properties of Matter",
      title: "Projectile Motion",
      formulas: [
        { label: "Time of Flight", tex: "T = \\frac{2u \\sin\\theta}{g}" },
        { label: "Maximum Height", tex: "H = \\frac{u^2 \\sin^2\\theta}{2g}" },
        { label: "Horizontal Range", tex: "R = \\frac{u^2 \\sin 2\\theta}{g}" },
        { label: "Trajectory Equation", tex: "y = x \\tan\\theta - \\frac{g x^2}{2 u^2 \\cos^2\\theta}" }
      ]
    },
    {
      subject: "Physics",
      subsection: "Mechanics & Properties of Matter",
      title: "Work, Energy & Gravitation",
      formulas: [
        { label: "Work-Energy Theorem", tex: "W_{\\text{net}} = \\Delta K = K_f - K_i" },
        { label: "Universal Gravitation", tex: "F = G\\frac{m_1 m_2}{r^2}" },
        { label: "Escape Velocity", tex: "v_e = \\sqrt{\\frac{2GM}{R}} = \\sqrt{2gR}" },
        { label: "Orbital Velocity", tex: "v_o = \\sqrt{\\frac{GM}{R}}" }
      ]
    },
    {
      subject: "Physics",
      subsection: "Electrodynamics & Modern Physics",
      title: "Electrostatics & Capacitors",
      formulas: [
        { label: "Coulomb's Law", tex: "F = \\frac{1}{4\\pi\\varepsilon_0} \\frac{q_1 q_2}{r^2}" },
        { label: "Electric Potential", tex: "V = \\frac{1}{4\\pi\\varepsilon_0} \\frac{q}{r}" },
        { label: "Parallel-Plate Capacitance", tex: "C = \\frac{\\varepsilon_0 A}{d}" },
        { label: "Energy Stored in Capacitor", tex: "U = \\frac{1}{2}CV^2 = \\frac{Q^2}{2C}" }
      ]
    },
    {
      subject: "Chemistry",
      subsection: "Physical Chemistry & States of Matter",
      title: "Thermodynamics & Mole Concept",
      formulas: [
        { label: "First Law of Thermodynamics", tex: "\\Delta U = q + w = q - P\\Delta V" },
        { label: "Enthalpy Relation", tex: "\\Delta H = \\Delta U + \\Delta n_g RT" },
        { label: "Gibbs Free Energy", tex: "\\Delta G = \\Delta H - T\\Delta S" },
        { label: "Equilibrium Constant Relation", tex: "\\Delta G^\\circ = -RT \\ln K" }
      ]
    },
    {
      subject: "Chemistry",
      subsection: "Equilibrium, Kinetics & Electrochemistry",
      title: "Kinetics & Nernst Equation",
      formulas: [
        { label: "First-Order Rate Law", tex: "k = \\frac{2.303}{t}\\log\\frac{[A]_0}{[A]}" },
        { label: "First-Order Half-Life", tex: "t_{1/2} = \\frac{0.693}{k}" },
        { label: "Arrhenius Equation", tex: "k = A e^{-E_a / RT}" },
        { label: "Nernst Equation at 298 K", tex: "E = E^\\circ - \\frac{0.0591}{n}\\log Q" }
      ]
    },
    {
      subject: "Mathematics",
      subsection: "Algebra & Discrete Mathematics",
      title: "Quadratic & Matrices",
      formulas: [
        { label: "Roots of Quadratic", tex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}" },
        { label: "Sum & Product of Roots", tex: "\\alpha + \\beta = -\\frac{b}{a},\\quad \\alpha\\beta = \\frac{c}{a}" },
        { label: "Matrix Inverse", tex: "A^{-1} = \\frac{\\text{adj}(A)}{\\det(A)}" },
        { label: "Determinant of Product", tex: "\\det(AB) = \\det(A)\\det(B)" }
      ]
    },
    {
      subject: "Mathematics",
      subsection: "Differential & Integral Calculus",
      title: "Limits & Differentiation",
      formulas: [
        { label: "Standard Trig Limit", tex: "\\lim_{x\\to 0} \\frac{\\sin x}{x} = 1" },
        { label: "Exponential Limit", tex: "\\lim_{x\\to 0} (1 + x)^{1/x} = e" },
        { label: "Product Rule", tex: "\\frac{d}{dx}(uv) = u'v + uv'" },
        { label: "Quotient Rule", tex: "\\frac{d}{dx}\\left(\\frac{u}{v}\\right) = \\frac{u'v - uv'}{v^2}" }
      ]
    },
    {
      subject: "Mathematics",
      subsection: "Differential & Integral Calculus",
      title: "Integration & Differential Equations",
      formulas: [
        { label: "Power Rule of Integration", tex: "\\int x^n dx = \\frac{x^{n+1}}{n+1} + C \\quad (n \\neq -1)" },
        { label: "Logarithmic Integral", tex: "\\int \\frac{1}{x} dx = \\ln|x| + C" },
        { label: "Integration by Parts", tex: "\\int u v' dx = uv - \\int u' v dx" },
        { label: "Linear Diff Eq Integrating Factor", tex: "I.F. = e^{\\int P(x)dx}" }
      ]
    }
  ];

  function getTaxonomy() {
    return JEE_TAXONOMY;
  }

  function getSubsectionForTopic(subject, topic) {
    const sec = JEE_TAXONOMY.find(s => s.name === subject);
    if (!sec) return null;
    return sec.subsections.find(sub => sub.topics.includes(topic)) || null;
  }

  function getFormulas() {
    return FORMULA_RECORDS;
  }

  root.QuizTaxonomy = {
    getTaxonomy,
    getSubsectionForTopic,
    getFormulas
  };

})(typeof window !== "undefined" ? window : globalThis);
