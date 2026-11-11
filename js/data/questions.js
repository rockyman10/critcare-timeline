/* Placeholder practice items only. Schema: README.md. Not board items and not clinical claims. */
window.CRITCARE_QUESTIONS = {
  meta: {
    title: "Practice questions",
    examDurationSeconds: 120
  },
  items: [
    {
      id: "example-q1",
      placeholder: true,
      topic: "vasopressors",
      relatedTrialId: "example-alpha",
      stem: "EXAMPLE, not a real trial. Which phrase marks this item as a placeholder?",
      choices: [
        { id: "a", text: "A lane color" },
        { id: "b", text: "EXAMPLE, not a real trial" },
        { id: "c", text: "The zoom control" },
        { id: "d", text: "The footer date" }
      ],
      correctId: "b",
      explanation: "The phrase EXAMPLE, not a real trial is the placeholder label. This item does not describe a medication study.",
      source: {
        label: "Placeholder source for EXAMPLE-Q1",
        doi: "10.0000/example.q1",
        note: "EXAMPLE, not a real trial."
      }
    },
    {
      id: "example-q2",
      placeholder: true,
      topic: "sedation",
      relatedTrialId: "example-beta",
      stem: "EXAMPLE, not a real trial. Which field records the place a guideline cites a trial?",
      choices: [
        { id: "a", text: "Locus" },
        { id: "b", text: "Lane color" },
        { id: "c", text: "Zoom level" },
        { id: "d", text: "Footer date" }
      ],
      correctId: "a",
      explanation: "The locus field is where a guideline entry records the place the document cites the trial. This item is a placeholder.",
      source: {
        label: "Placeholder source for EXAMPLE-Q2",
        doi: "10.0000/example.q2",
        note: "EXAMPLE, not a real trial."
      }
    }
  ]
};
