/* Orientation path. Teaches the page shell. It does not state medication results. */
window.CRITCARE_LEARN_PATH = {
  meta: {
    id: "orientation",
    title: "Learn path",
    subtitle: "How this timeline is organized"
  },
  steps: [
    {
      id: "lanes",
      title: "Lanes and years",
      body: "Each lane is one adult ICU medication topic. Years run along the top of the timeline. A marker named EXAMPLE-A or EXAMPLE-B is a placeholder, and the card title reads EXAMPLE, not a real trial."
    },
    {
      id: "snapshot",
      title: "Trial snapshot",
      body: "A marker opens one Trial snapshot. More details keeps the same fields, then adds limitations, any guideline that cites the trial, the locus for that citation, and sources.",
      action: { kind: "trial", id: "example-alpha", label: "Open the EXAMPLE-A snapshot" }
    },
    {
      id: "practice",
      title: "Practice questions",
      body: "Study mode shows an explanation after an answer. Exam mode is timed and holds explanations until the sitting is submitted. The current items are placeholders labeled EXAMPLE, not a real trial.",
      action: { kind: "practice", label: "Open a practice question" }
    }
  ]
};
