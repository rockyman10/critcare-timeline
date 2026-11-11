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
      body: "Each lane is one adult ICU medication topic. Years run along the top of the timeline, starting in 1989. A marker opens the trial card for that year."
    },
    {
      id: "snapshot",
      title: "Trial snapshot",
      body: "A marker opens one Trial snapshot. More details keeps the same fields, then adds limitations, any guideline that cites the trial, the locus for that citation, sources, and where the numbers were read.",
      action: { kind: "trial", id: "soap-ii", label: "Open the SOAP II snapshot" }
    },
    {
      id: "practice",
      title: "Practice questions",
      body: "Study mode shows an explanation after an answer. Exam mode is timed and holds explanations until the sitting is submitted.",
      action: { kind: "practice", label: "Open a practice question" }
    }
  ]
};
