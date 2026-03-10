const CODE_LABELS = {
  R: "Realistic",
  I: "Investigative",
  A: "Artistic",
  S: "Social",
  E: "Enterprising",
  C: "Conventional"
};

const RECOMMENDATIONS = {
  RI: {
    majors: ["Information Technology", "Engineering"],
    careers: ["Software Developer", "Network Engineer"]
  },
  IA: {
    majors: ["Computer Science", "Data Science"],
    careers: ["Data Analyst", "AI Engineer"]
  },
  AS: {
    majors: ["Media & Communication", "Education"],
    careers: ["Content Creator", "Teacher"]
  },
  ES: {
    majors: ["Business Administration", "Marketing"],
    careers: ["Sales & Marketing Specialist", "Entrepreneur"]
  },
  CE: {
    majors: ["Accounting", "Business Administration"],
    careers: ["Accountant", "Project Coordinator"]
  }
};

function computeTestResult(questions, answers) {
  const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  for (let i = 0; i < questions.length; i += 1) {
    const q = questions[i];
    const choiceIndex = answers[i];
    const choice = q?.choices?.[choiceIndex];
    if (choice?.code && scores[choice.code] !== undefined) {
      scores[choice.code] += 1;
    }
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topCodes = sorted.slice(0, 2).map(([code]) => code);
  const topKey = topCodes.join("");

  const personalityLabel = topCodes.map((c) => CODE_LABELS[c]).join(" + ");
  const rec =
    RECOMMENDATIONS[topKey] ||
    RECOMMENDATIONS[[topKey[1], topKey[0]].join("")] || { majors: [], careers: [] };

  return {
    scores,
    topCodes,
    personalityLabel,
    recommendedMajors: rec.majors,
    recommendedCareers: rec.careers
  };
}

module.exports = { computeTestResult };

