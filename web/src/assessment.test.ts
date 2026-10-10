import { describe, expect, it } from "vitest";
import {
  addImpact,
  buildResult,
  EMPTY_SCORES,
  QUESTIONS,
  shouldFinish,
  TOTAL_ANSWER_OPTIONS,
} from "./assessment";

describe("adaptive relationship assessment", () => {
  it("contains 25 connected situations and 100 answer options", () => {
    expect(Object.keys(QUESTIONS)).toHaveLength(25);
    expect(TOTAL_ANSWER_OPTIONS).toBe(100);
    for (const question of Object.values(QUESTIONS)) {
      expect(question.answers).toHaveLength(4);
      for (const answer of question.answers) {
        if (answer.next) expect(QUESTIONS[answer.next], `${question.id} -> ${answer.next}`).toBeDefined();
      }
    }
  });

  it("stops immediately when an answer signals immediate danger", () => {
    const flags = new Set(["immediate_danger"] as const);
    expect(shouldFinish("impact", EMPTY_SCORES, flags, 2)).toBe(true);
    expect(buildResult({ ...EMPTY_SCORES, safety: 8 }, flags).level).toBe("Urgente");
  });

  it("recognizes a path with strong healthy relationship signals", () => {
    let scores = { ...EMPTY_SCORES };
    scores = addImpact(scores, { healthy: 5 });
    scores = addImpact(scores, { healthy: 3 });
    scores = addImpact(scores, { healthy: 3, repair: 0 });
    expect(buildResult(scores, new Set()).level).toBe("Fortalezas");
  });

  it("does not let positive signals erase strong control patterns", () => {
    const result = buildResult({ ...EMPTY_SCORES, healthy: 5, control: 7, isolation: 4, safety: 2 }, new Set());
    expect(["Alto", "Urgente"]).toContain(result.level);
    expect(result.patterns.some((pattern) => pattern.key === "control")).toBe(true);
  });

  it("keeps ambiguous conflict in the attention range", () => {
    const result = buildResult({ ...EMPTY_SCORES, healthy: 2, conflict: 3, repair: 3, emotional: 2 }, new Set());
    expect(result.level).toBe("Atención");
  });

  it("explains the result with concrete evidence from the selected answers", () => {
    const history = [
      { questionId: "start", answerId: "fear", label: "A veces siento miedo de su reacción", impact: { safety: 3, emotional: 2 }, flags: [] },
      { questionId: "boundaries", answerId: "blame", label: "Termino sintiéndome culpable por poner límites", impact: { control: 3, autonomy: 2 }, flags: [] },
    ];
    const scores = history.reduce((current, entry) => addImpact(current, entry.impact), { ...EMPTY_SCORES });
    const result = buildResult(scores, new Set(), history);

    expect(result.evidence.map((item) => item.label)).toContain("A veces siento miedo de su reacción");
    expect(result.observedAreas).toBeGreaterThanOrEqual(2);
    expect(result.consistency).toBe("Alta");
    expect(result.patternExplanation.length).toBeGreaterThan(30);
  });
});
