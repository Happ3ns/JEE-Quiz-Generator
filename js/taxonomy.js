// ── JEE Three-Tier Syllabus Taxonomy with Plain-English Summaries & Formulas ──
(function (root) {
  "use strict";

  const JEE_TAXONOMY = [
    {
      id: "Physics",
      name: "Physics",
      icon: "⚛️",
      tagline: "PHYSICAL SCIENCES · MECHANICS, THERMODYNAMICS & ELECTROMAGNETISM",
      color: "#06b6d4",
      subsections: [
        {
          id: "mechanics",
          name: "Mechanics & Properties of Matter",
          icon: "🚀",
          desc: "Kinematics, Newton's laws, work-energy, gravitation & fluids",
          topics: [
            {
              name: "Kinematics",
              summary: "Motion in 1D and 2D, displacement-time graphs, and uniform acceleration.",
              formula: "v = u + at, s = ut + ½at²",
              weight: "Core Fundamental"
            },
            {
              name: "Projectile Motion",
              summary: "2D parabolic flight under constant gravity, flight time, and range.",
              formula: "R = (u² sin 2θ)/g, H = (u² sin²θ)/2g",
              weight: "High Weightage"
            },
            {
              name: "Circular Motion",
              summary: "Centripetal acceleration, angular frequency, and banking of curved tracks.",
              formula: "a_c = v²/r = ω²r",
              weight: "High Scoring"
            },
            {
              name: "Work, Energy and Power",
              summary: "Work-energy theorem, conservative force fields, kinetic and potential energy.",
              formula: "W_net = ΔK, P = F·v",
              weight: "High Weightage"
            },
            {
              name: "Gravitation",
              summary: "Newton's inverse-square law, satellite orbital velocity, and escape speed.",
              formula: "v_e = √(2gR), F = G m₁m₂/r²",
              weight: "High Scoring"
            },
            {
              name: "Properties of Matter",
              summary: "Density, stress-strain curves, Hooke's law, and hydrostatic pressure.",
              formula: "ρ = m/V, Y = Stress / Strain",
              weight: "Core Fundamental"
            },
            {
              name: "Mechanics",
              summary: "Free-body diagrams, friction coefficients, and conservation of linear momentum.",
              formula: "F_net = ma, f_k = μ_k N",
              weight: "High Weightage"
            }
          ]
        },
        {
          id: "waves-optics",
          name: "Oscillations, Waves & Optics",
          icon: "🌊",
          desc: "Simple harmonic motion, sound propagation, lenses & wave optics",
          topics: [
            {
              name: "Oscillations",
              summary: "Simple harmonic motion, restoring force, period of spring and pendulum.",
              formula: "T = 2π√(m/k), a = -ω²x",
              weight: "High Weightage"
            },
            {
              name: "Waves",
              summary: "Speed, frequency, wavelength, wave equation, and interference superposition.",
              formula: "v = fλ, y = A sin(kx - ωt)",
              weight: "High Scoring"
            },
            {
              name: "Optics",
              summary: "Refraction, Snell's law, total internal reflection, and thin lens formula.",
              formula: "1/f = 1/v - 1/u, n₁ sin i = n₂ sin r",
              weight: "High Weightage"
            }
          ]
        },
        {
          id: "electromagnetism-modern",
          name: "Electrodynamics & Modern Physics",
          icon: "⚡",
          desc: "Coulomb's law, DC circuits, magnetic forces & quantum atomic models",
          topics: [
            {
              name: "Electrostatics",
              summary: "Coulomb forces between charges, electric potential, and capacitor storage.",
              formula: "F = kq₁q₂/r², C = ε₀A/d",
              weight: "High Weightage"
            },
            {
              name: "Electrodynamics",
              summary: "Ohm's law, Kirchhoff's circuit rules, resistor networks, and power dissipation.",
              formula: "V = IR, P = I²R = V²/R",
              weight: "High Weightage"
            },
            {
              name: "Modern Physics",
              summary: "Photoelectric effect, photon energy, de Broglie matter waves, and Bohr orbits.",
              formula: "E = hf, λ = h/p, E_n = -13.6/n² eV",
              weight: "High Scoring"
            }
          ]
        }
      ]
    },
    {
      id: "Chemistry",
      name: "Chemistry",
      icon: "🧪",
      tagline: "CHEMICAL SCIENCES · PHYSICAL, INORGANIC & ORGANIC SYNTHESIS",
      color: "#10b981",
      subsections: [
        {
          id: "physical-chemistry",
          name: "Physical Chemistry & States of Matter",
          icon: "🔬",
          desc: "Mole concept, atomic structure, gas laws, thermodynamics & solutions",
          topics: [
            {
              name: "Mole Concept",
              summary: "Molar mass, stoichiometric coefficients, empirical formula, and molarity.",
              formula: "n = m/M, M = moles / volume(L)",
              weight: "Core Fundamental"
            },
            {
              name: "Atomic Structure",
              summary: "Quantum numbers, Bohr atomic radii, orbital shapes, and electron configurations.",
              formula: "E = hc/λ, Δx·Δp ≥ h/4π",
              weight: "High Weightage"
            },
            {
              name: "Chemical Bonding",
              summary: "VSEPR geometries, hybridization, bond order from MOT, and dipole moments.",
              formula: "Bond Order = ½(N_b - N_a)",
              weight: "High Weightage"
            },
            {
              name: "States of Matter",
              summary: "Ideal gas equation, Dalton's partial pressure, and root-mean-square speed.",
              formula: "PV = nRT, v_rms = √(3RT/M)",
              weight: "High Scoring"
            },
            {
              name: "Thermodynamics",
              summary: "First law, enthalpy of reaction, entropy changes, and spontaneity via Gibbs energy.",
              formula: "ΔG = ΔH - TΔS, ΔU = q + w",
              weight: "High Weightage"
            },
            {
              name: "Solutions",
              summary: "Raoult's law for ideal solutions, boiling elevation, and freezing depression.",
              formula: "ΔT_b = K_b m, Π = iCRT",
              weight: "High Weightage"
            },
            {
              name: "Physical",
              summary: "General physical chemistry principles, heat capacities, and state functions.",
              formula: "H = U + PV, C_p - C_v = R",
              weight: "Core Fundamental"
            }
          ]
        },
        {
          id: "equilibrium-kinetics",
          name: "Equilibrium, Kinetics & Electrochemistry",
          icon: "⚖️",
          desc: "Reversible reactions, pH, buffer solutions, reaction rates & galvanic cells",
          topics: [
            {
              name: "Chemical Equilibrium",
              summary: "Equilibrium constants K_p and K_c, reaction quotient Q, and Le Chatelier shifts.",
              formula: "K_p = K_c(RT)^Δn",
              weight: "High Weightage"
            },
            {
              name: "Ionic Equilibrium",
              summary: "Weak acid/base dissociation, pH calculations, common-ion effect, and K_sp.",
              formula: "pH = -log[H⁺], K_w = 10⁻¹⁴",
              weight: "High Weightage"
            },
            {
              name: "Acid-Base Equilibrium",
              summary: "Conjugate pairs, buffer solution calculations with Henderson-Hasselbalch.",
              formula: "pH = pK_a + log([Salt]/[Acid])",
              weight: "High Scoring"
            },
            {
              name: "Chemical Kinetics",
              summary: "Reaction orders, integrated rate laws, half-life, and activation energy.",
              formula: "k = A e^(-E_a/RT), t_½ = 0.693/k",
              weight: "High Weightage"
            },
            {
              name: "Electrochemistry",
              summary: "Standard reduction potentials, Nernst cell equation, and Faraday electrolysis.",
              formula: "E_cell = E° - (0.0591/n) log Q",
              weight: "High Weightage"
            },
            {
              name: "Redox Reactions",
              summary: "Determining oxidation states and balancing redox equations in acidic/basic media.",
              formula: "Oxidation: loss of electrons",
              weight: "High Scoring"
            },
            {
              name: "Equilibrium",
              summary: "Dynamic equilibrium thermodynamic criteria and standard free energy.",
              formula: "ΔG° = -RT ln K",
              weight: "Core Fundamental"
            }
          ]
        },
        {
          id: "inorganic-organic",
          name: "Inorganic & Organic Chemistry",
          icon: "🧬",
          desc: "Coordination complexes, periodic trends, reaction mechanisms & functional groups",
          topics: [
            {
              name: "Coordination Compounds",
              summary: "Werner's theory, ligand field splitting, isomerism, and crystal field stability.",
              formula: "CFSE, [Co(NH₃)₆]³⁺",
              weight: "High Weightage"
            },
            {
              name: "Inorganic",
              summary: "Periodic table trends, ionization enthalpies, and characteristic oxidation states.",
              formula: "Electronegativity, Ionization Enthalpy",
              weight: "High Weightage"
            },
            {
              name: "Organic",
              summary: "IUPAC naming conventions, structural/stereoisomerism, inductive effect and resonance.",
              formula: "Hyperconjugation, Electrophiles",
              weight: "High Weightage"
            },
            {
              name: "Organic Chemistry",
              summary: "Nucleophilic substitutions (S_N1/S_N2), elimination (E1/E2), and aromatic reactivity.",
              formula: "Markovnikov addition, Hückel 4n+2",
              weight: "High Weightage"
            }
          ]
        }
      ]
    },
    {
      id: "Mathematics",
      name: "Mathematics",
      icon: "📐",
      tagline: "MATHEMATICAL SCIENCES · CALCULUS, ALGEBRA & ANALYTIC GEOMETRY",
      color: "#6366f1",
      subsections: [
        {
          id: "algebra",
          name: "Algebra & Discrete Mathematics",
          icon: "🧮",
          desc: "Quadratic equations, sequences, series, binomial expansions & matrices",
          topics: [
            {
              name: "Quadratic Equations",
              summary: "Nature of roots via discriminant, symmetric relations between roots α and β.",
              formula: "x = (-b ± √(b² - 4ac))/(2a), α+β = -b/a",
              weight: "High Scoring"
            },
            {
              name: "Complex Numbers",
              summary: "Modulus, argument, polar and Euler forms, De Moivre's theorem, and cube roots of unity.",
              formula: "z = r e^(iθ), 1 + ω + ω² = 0",
              weight: "High Weightage"
            },
            {
              name: "Sequences",
              summary: "Arithmetic and geometric progression terms, common difference, and ratio properties.",
              formula: "T_n = a + (n - 1)d, a r^(n-1)",
              weight: "High Scoring"
            },
            {
              name: "Series",
              summary: "Sum of n terms in arithmetic and geometric series, and sum of infinite GP.",
              formula: "S_∞ = a/(1 - r), Σ n = n(n+1)/2",
              weight: "High Scoring"
            },
            {
              name: "Progressions",
              summary: "Relationships between arithmetic, geometric, and harmonic means.",
              formula: "AM ≥ GM ≥ HM",
              weight: "High Weightage"
            },
            {
              name: "Binomial Theorem",
              summary: "General and middle terms in binomial expansion, and binomial coefficients.",
              formula: "T_{r+1} = ⁿC_r a^{n-r} b^r",
              weight: "High Weightage"
            },
            {
              name: "Matrices",
              summary: "Matrix operations, determinants, adjugate, and inverse matrix calculations.",
              formula: "A⁻¹ = adj(A)/det(A), det(AB)=det(A)det(B)",
              weight: "High Scoring"
            },
            {
              name: "Algebra",
              summary: "Algebraic identities, remainder theorem, factor theorem, and polynomial roots.",
              formula: "(a+b)³, a³+b³+c³-3abc",
              weight: "Core Fundamental"
            }
          ]
        },
        {
          id: "calculus",
          name: "Differential & Integral Calculus",
          icon: "📈",
          desc: "Limits, continuity, derivatives, maxima/minima, definite integrals & differential equations",
          topics: [
            {
              name: "Limits",
              summary: "Evaluating indeterminate forms (0/0, ∞/∞), L'Hôpital's rule, and standard trigonometric limits.",
              formula: "lim (sin x)/x = 1, lim (1+x)^(1/x) = e",
              weight: "High Weightage"
            },
            {
              name: "Differentiation",
              summary: "Chain rule, product and quotient rules, derivative of inverse and parametric functions.",
              formula: "d/dx(uv) = u'v + uv', dy/dx = (dy/dt)/(dx/dt)",
              weight: "Core Fundamental"
            },
            {
              name: "Applications of Derivatives",
              summary: "Tangents, normals, increasing/decreasing intervals, local maxima and minima.",
              formula: "f'(x) = 0, f''(x) > 0 (minima)",
              weight: "High Weightage"
            },
            {
              name: "Integral Calculus",
              summary: "Definite integrals, substitution, integration by parts, and area under curves.",
              formula: "∫ u v' dx = uv - ∫ u' v dx, King's rule",
              weight: "High Weightage"
            },
            {
              name: "Differential Equations",
              summary: "Forming differential equations, variable separation, and first-order linear DEs.",
              formula: "dy/dx + Py = Q, IF = e^(∫ P dx)",
              weight: "High Weightage"
            },
            {
              name: "Calculus",
              summary: "Continuity conditions, differentiability theorems, Rolle's and Mean Value Theorem.",
              formula: "f'(c) = [f(b) - f(a)] / (b - a)",
              weight: "High Weightage"
            }
          ]
        },
        {
          id: "geometry-vectors",
          name: "Geometry, Vectors & Probability",
          icon: "🧭",
          desc: "Coordinate geometry, straight lines, circles, 3D vectors & probability models",
          topics: [
            {
              name: "Coordinate Geometry",
              summary: "Standard equations of lines and circles, point-distance formulas, and tangents.",
              formula: "(x - h)² + (y - k)² = r²",
              weight: "High Weightage"
            },
            {
              name: "Geometry",
              summary: "Slopes, perpendicular and parallel conditions, and intersection points.",
              formula: "d = |ax₁ + by₁ + c| / √(a² + b²)",
              weight: "High Scoring"
            },
            {
              name: "Parametric Equations",
              summary: "Standard parametric forms for conic sections (parabola, ellipse, hyperbola).",
              formula: "Parabola: (at², 2at)",
              weight: "High Scoring"
            },
            {
              name: "Trigonometry",
              summary: "Compound angle formulas, double angle identities, and trigonometric transformations.",
              formula: "sin(A+B), cos 2A = 1 - 2sin²A",
              weight: "High Weightage"
            },
            {
              name: "Vectors",
              summary: "Scalar and vector products, projections, and geometric applications in 3D.",
              formula: "a·b = |a||b| cos θ, |a×b| = |a||b| sin θ",
              weight: "High Scoring"
            },
            {
              name: "Probability",
              summary: "Conditional probability, Bayes' theorem, independence, and binomial distributions.",
              formula: "P(A|B) = P(A ∩ B) / P(B)",
              weight: "High Weightage"
            },
            {
              name: "Statistics",
              summary: "Measures of central tendency, variance, standard deviation, and mean deviation.",
              formula: "Var(X) = E[X²] - (E[X])²",
              weight: "High Scoring"
            }
          ]
        }
      ]
    }
  ];

  // Helper to extract clean name
  function getTopicName(t) {
    return typeof t === "string" ? t : (t.name || "");
  }

  function getTaxonomy() {
    return JEE_TAXONOMY;
  }

  function getSubsectionForTopic(subject, topicName) {
    const sec = JEE_TAXONOMY.find(s => s.name === subject);
    if (!sec) return null;
    return sec.subsections.find(sub =>
      sub.topics.some(t => getTopicName(t) === topicName)
    ) || null;
  }

  function getFormulas() {
    return (root.QuizTaxonomy && root.QuizTaxonomy._formulas) || [
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
        subsection: "Electrodynamics & Modern Physics",
        title: "Electrostatics & Capacitors",
        formulas: [
          { label: "Coulomb's Law", tex: "F = \\frac{1}{4\\pi\\varepsilon_0} \\frac{q_1 q_2}{r^2}" },
          { label: "Electric Potential", tex: "V = \\frac{1}{4\\pi\\varepsilon_0} \\frac{q}{r}" },
          { label: "Parallel-Plate Capacitance", tex: "C = \\frac{\\varepsilon_0 A}{d}" }
        ]
      },
      {
        subject: "Chemistry",
        subsection: "Physical Chemistry & States of Matter",
        title: "Thermodynamics & Mole Concept",
        formulas: [
          { label: "First Law of Thermodynamics", tex: "\\Delta U = q + w = q - P\\Delta V" },
          { label: "Enthalpy Relation", tex: "\\Delta H = \\Delta U + \\Delta n_g RT" },
          { label: "Gibbs Free Energy", tex: "\\Delta G = \\Delta H - T\\Delta S" }
        ]
      },
      {
        subject: "Chemistry",
        subsection: "Equilibrium, Kinetics & Electrochemistry",
        title: "Kinetics & Nernst Equation",
        formulas: [
          { label: "First-Order Rate Law", tex: "k = \\frac{2.303}{t}\\log\\frac{[A]_0}{[A]}" },
          { label: "First-Order Half-Life", tex: "t_{1/2} = \\frac{0.693}{k}" },
          { label: "Nernst Equation at 298 K", tex: "E = E^\\circ - \\frac{0.0591}{n}\\log Q" }
        ]
      },
      {
        subject: "Mathematics",
        subsection: "Algebra & Discrete Mathematics",
        title: "Quadratic & Matrices",
        formulas: [
          { label: "Roots of Quadratic", tex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}" },
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
          { label: "Integration by Parts", tex: "\\int u v' dx = uv - \\int u' v dx" },
          { label: "Linear Diff Eq Integrating Factor", tex: "I.F. = e^{\\int P(x)dx}" }
        ]
      }
    ];
  }

  root.QuizTaxonomy = {
    getTaxonomy,
    getTopicName,
    getSubsectionForTopic,
    getFormulas
  };

})(typeof window !== "undefined" ? window : globalThis);
