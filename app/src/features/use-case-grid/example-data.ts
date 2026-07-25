import {
  type Direction,
  type GridOutput,
  type Intent,
  type UseCase,
} from "./domain";

const provenance = [
  {
    source: "model-inference" as const,
    detail: "Suggested from the fictional HR business partner role and stated goal.",
  },
];

const makeUseCase = (
  input: Omit<UseCase, "problem" | "requiredInputs" | "specificity" | "sensitivityNote" | "provenance"> & {
    problem?: string;
    requiredInputs?: string[];
    specificity?: UseCase["specificity"];
    sensitivityNote?: string | null;
  },
): UseCase => ({
  ...input,
  problem: input.problem ?? input.summary,
  requiredInputs: input.requiredInputs ?? ["Approved source material", "Human reviewer"],
  specificity: input.specificity ?? "broad",
  sensitivityNote: input.sensitivityNote ?? null,
  provenance,
});

export const exampleIntent: Intent = {
  goal: "Improve my current role",
  timeHorizon: "quarter",
  notes: "Find practical AI use cases I could test in the next 30 days.",
};

export const exampleDirections: Direction[] = [
  {
    id: "manager-support",
    title: "Manager support",
    description: "Prepare managers for recurring questions, conversations, and decisions.",
    fitReason: "The example role repeatedly coaches managers in a high-context environment.",
  },
  {
    id: "policy-clarity",
    title: "Policy clarity",
    description: "Make approved guidance easier to find, interpret, and communicate consistently.",
    fitReason: "Policy interpretation and workforce communication are central to the example role.",
  },
  {
    id: "workforce-patterns",
    title: "Workforce patterns",
    description: "Review de-identified signals to find recurring needs and improve future support.",
    fitReason: "The example role synthesizes questions and employee-relations themes over time.",
  },
];

export const exampleGrid: GridOutput = {
  profile: {
    summary:
      "You support managers and an hourly workforce in a regulated, unionized automotive environment. Your work combines recurring communication and preparation with high-context decisions.",
    roles: ["HR Business Partner"],
    industries: ["Automotive manufacturing", "Human resources"],
    skills: ["Manager coaching", "Employee relations", "Policy interpretation", "Workforce communication"],
    organizations: ["Fictional automotive manufacturer"],
    facts: [
      "Supports managers and an hourly workforce",
      "Works in a unionized environment",
      "Handles policy interpretation and recurring employee-relations questions",
    ],
    inferences: [
      "Preparation and pattern-finding may be safer starting points than automating employment decisions",
    ],
  },
  useCases: [
    makeUseCase({ id: "policy-answer-prep", title: "Policy Answer Prep", summary: "Turn an approved policy excerpt and a manager question into a concise, cited answer draft.", fitReason: "Policy interpretation is a recurring responsibility in the example profile.", expectedBenefit: "Faster first drafts with clearer source references.", firstStep: "Test ten common, non-sensitive questions against one approved policy and review every citation.", feasibility: "configure", rowId: "prepare", columnId: "faster" }),
    makeUseCase({ id: "meeting-brief-builder", title: "Meeting Brief Builder", summary: "Convert non-sensitive notes and an objective into an agenda, talking points, and follow-ups.", fitReason: "Manager support creates repeated preparation work.", expectedBenefit: "Less meeting preparation time and more consistent follow-through.", firstStep: "Use it for one recurring manager check-in and compare preparation time with the normal process.", feasibility: "use-now", rowId: "prepare", columnId: "faster" }),
    makeUseCase({ id: "case-pattern-review", title: "Case Pattern Review", summary: "Group de-identified case summaries to surface recurring issues and resolution patterns.", fitReason: "Employee-relations work benefits from aggregate pattern recognition.", expectedBenefit: "Earlier visibility into recurring issues worth human investigation.", firstStep: "Manually de-identify a small historical set and compare the resulting themes with existing reporting.", feasibility: "configure", rowId: "prepare", columnId: "decisions", sensitivityNote: "Use only approved, de-identified case summaries." }),
    makeUseCase({ id: "policy-ambiguity-finder", title: "Policy Ambiguity Finder", summary: "Review policy drafts from a manager and employee perspective to find inconsistent interpretations.", fitReason: "Clear policy communication is central to the role.", expectedBenefit: "Fewer preventable clarification cycles after publication.", firstStep: "Test one upcoming policy communication and ask an HR colleague to judge the flagged ambiguities.", feasibility: "use-now", rowId: "prepare", columnId: "decisions" }),
    makeUseCase({ id: "personal-hr-playbook", title: "Personal HR Playbook", summary: "Create a source-linked collection of approved templates, checklists, and recurring answers.", fitReason: "The role reuses similar guidance across manager conversations.", expectedBenefit: "Faster retrieval and more consistent preparation.", firstStep: "Collect five frequently reused, non-sensitive artifacts and define when each is appropriate.", feasibility: "configure", rowId: "prepare", columnId: "capability" }),
    makeUseCase({ id: "prompt-guard", title: "Sensitive-Data Prompt Guard", summary: "Detect identifiers and protected case details before content reaches an AI service.", fitReason: "The environment regularly handles sensitive employee information.", expectedBenefit: "A practical safety boundary for wider AI experimentation.", firstStep: "Define prohibited-input categories and test detection on synthetic examples.", feasibility: "build", rowId: "prepare", columnId: "capability", sensitivityNote: "This safeguard complements—not replaces—approved data handling controls." }),
    makeUseCase({ id: "manager-conversation-prep", title: "Manager Conversation Prep", summary: "Create a neutral opening, questions, and guardrails for a difficult manager conversation.", fitReason: "Manager coaching is a stated responsibility.", expectedBenefit: "More prepared and consistent coaching conversations.", firstStep: "Prepare for one low-risk fictional coaching scenario and review the output with HR.", feasibility: "use-now", rowId: "deliver", columnId: "faster" }),
    makeUseCase({ id: "communication-variants", title: "Communication Variant Studio", summary: "Adapt one approved message for leaders, supervisors, and employees without changing meaning.", fitReason: "The profile includes workforce communication across several audiences.", expectedBenefit: "Faster audience-specific drafts with consistent policy meaning.", firstStep: "Rewrite one routine announcement for three audiences and check that commitments stay identical.", feasibility: "use-now", rowId: "deliver", columnId: "faster" }),
    makeUseCase({ id: "manager-issue-triage", title: "Manager Issue Triage", summary: "Ask a short sequence of questions and route a manager issue to the right HR owner.", problem: "Managers may approach HR with incomplete context and unclear escalation needs.", fitReason: "The profile describes frequent manager support where consistent routing matters.", expectedBenefit: "More complete intake, faster routing, and fewer back-and-forth questions.", requiredInputs: ["Approved routing categories", "Escalation rules", "Prohibited-input guidance", "Human owner for each route"], firstStep: "Create a five-question prototype for three low-risk categories using fictional scenarios.", feasibility: "configure", rowId: "deliver", columnId: "decisions", sensitivityNote: "Do not enter employee-identifiable, medical, investigative, or privileged details." }),
    makeUseCase({ id: "labor-scenario-comparison", title: "Labor Scenario Comparison", summary: "Compare approaches against agreement language, operations, employee impact, and unresolved risks.", fitReason: "The fictional context includes a union environment and labor-relations judgment.", expectedBenefit: "Clearer assumptions and tradeoffs before expert review.", firstStep: "Use a hypothetical scenario and verify that the comparison surfaces assumptions rather than deciding.", feasibility: "use-now", rowId: "deliver", columnId: "decisions", sensitivityNote: "Human labor-relations and legal review remains required." }),
    makeUseCase({ id: "manager-practice-simulator", title: "Manager Practice Simulator", summary: "Let managers rehearse difficult conversations and receive feedback tied to approved principles.", fitReason: "The role coaches managers through sensitive conversations.", expectedBenefit: "More practice opportunities without using real employee cases.", firstStep: "Create one fictional attendance scenario and test it with two HR reviewers.", feasibility: "configure", rowId: "deliver", columnId: "capability" }),
    makeUseCase({ id: "question-router", title: "Recurring Question Router", summary: "Classify manager questions, answer low-risk items from approved sources, and route the rest.", fitReason: "The profile suggests recurring manager questions with different risk levels.", expectedBenefit: "Faster safe answers and clearer escalation.", firstStep: "Categorize 50 de-identified historical questions and identify those with stable, source-backed answers.", feasibility: "build", rowId: "deliver", columnId: "capability", sensitivityNote: "Sensitive and ambiguous questions must always route to a person." }),
    makeUseCase({ id: "workforce-update-drafting", title: "Workforce Update Drafting", summary: "Turn approved facts into a plain-language workforce update and supervisor talking points.", fitReason: "Workforce communication is part of the example role.", expectedBenefit: "Faster drafts and more consistent supervisor messages.", firstStep: "Draft one routine update and compare it with the final human-written version.", feasibility: "use-now", rowId: "improve", columnId: "faster" }),
    makeUseCase({ id: "listening-note-synthesis", title: "Listening-Note Synthesis", summary: "Summarize approved, de-identified listening notes into themes and follow-up questions.", fitReason: "HR business partners synthesize input across the workforce.", expectedBenefit: "Quicker pattern identification with traceability to source notes.", firstStep: "Test with synthetic notes and require every theme to link back to a passage.", feasibility: "configure", rowId: "improve", columnId: "faster", sensitivityNote: "Use synthetic or explicitly approved de-identified notes." }),
    makeUseCase({ id: "grievance-theme-analysis", title: "Grievance Theme Analysis", summary: "Analyze de-identified grievance records by provision, location, stage, and resolution pattern.", fitReason: "The fictional environment includes union representation and recurring labor questions.", expectedBenefit: "A clearer aggregate view without predicting individual outcomes.", firstStep: "Create an approved sample dataset and compare themes with the labor team’s current view.", feasibility: "configure", rowId: "improve", columnId: "decisions", sensitivityNote: "Analyze aggregate patterns only; do not predict individual case outcomes." }),
    makeUseCase({ id: "change-impact-map", title: "Change Impact Map", summary: "Map a proposed change across affected groups, questions, training gaps, and labor considerations.", fitReason: "The role sits between operations, managers, employees, and policy.", expectedBenefit: "Fewer missed stakeholders and communication needs.", firstStep: "Apply the template to one low-risk upcoming change and review it with operations and HR.", feasibility: "use-now", rowId: "improve", columnId: "decisions" }),
    makeUseCase({ id: "workforce-signal-dashboard", title: "Workforce Signal Dashboard", summary: "Combine approved aggregate indicators to highlight areas that deserve human review.", fitReason: "The role needs to understand patterns across workforce questions and issues.", expectedBenefit: "Earlier, more coherent signals from existing aggregate measures.", firstStep: "Choose three approved aggregate measures and define what human action each might trigger.", feasibility: "build", rowId: "improve", columnId: "capability" }),
    makeUseCase({ id: "agreement-navigation", title: "Agreement Navigation Assistant", summary: "Retrieve relevant agreement provisions with citations and an explicit expert-review path.", fitReason: "A unionized environment creates repeated source-retrieval work.", expectedBenefit: "Faster navigation while preserving authoritative review.", firstStep: "Index one approved agreement and reject every benchmark answer that lacks a controlling citation.", feasibility: "build", rowId: "improve", columnId: "capability", sensitivityNote: "The assistant retrieves sources; labor-relations experts interpret and decide." }),
  ],
  refinementQuestions: [
    {
      id: "work-mode",
      question: "Which part of the work should the next set lean toward?",
      choices: ["Everyday manager support", "Policy and communication", "Patterns across many cases"],
    },
    {
      id: "ambition",
      question: "What kind of next step feels most useful?",
      choices: ["Something I can prompt today", "A repeatable workflow", "A capability worth building"],
    },
    {
      id: "risk-posture",
      question: "How close should these ideas get to sensitive work?",
      choices: ["Stay with low-risk preparation", "Use approved de-identified inputs", "Explore safeguards and controls"],
    },
  ],
};
