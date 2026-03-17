import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/Container.jsx";
import Card from "../components/Card.jsx";
import { http } from "../api/http.js";
import { useAuth } from "../state/AuthContext.jsx";
import { useI18n } from "../i18n/I18nContext.jsx";

export default function TestPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const i18n = useI18n();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    http
      .get("/test/questions", { params: { lang: i18n.lang } })
      .then(({ data }) => {
        const nextQuestions = data.questions || [];
        setQuestions(nextQuestions);
        setAnswers((prev) => {
          if (Array.isArray(prev) && prev.length === nextQuestions.length) return prev;
          return new Array(nextQuestions.length).fill(-1);
        });
      })
      .catch(() => setError(i18n.t("test.loadError")));
  }, [i18n.lang]);

  const canSubmit = useMemo(() => answers.length && answers.every((a) => Number(a) >= 0), [answers]);

  async function submit() {
    setError("");
    if (!auth.isAuthed) return navigate("/login", { state: { from: "/test" } });
    if (!canSubmit) return setError(i18n.t("test.answerAll"));
    try {
      setSubmitting(true);
      await http.post("/test/submit", { answers });
      navigate("/test/result");
    } catch (e) {
      setError(e?.response?.data?.message || i18n.t("test.submitFailed"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">{i18n.t("test.title")}</h2>
          <p className="mt-1 text-slate-200/70">
            {i18n.t("test.subtitle", { count: questions.length || 20 })}
          </p>
        </div>
        <button
          onClick={submit}
          disabled={!canSubmit || submitting}
          className="btn-primary press"
        >
          {submitting ? i18n.t("test.submitting") : i18n.t("test.seeResult")}
        </button>
      </div>

      {error ? (
        <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <div className="mt-6 grid gap-4">
        {questions.map((q, idx) => (
          <Card key={q.id || idx}>
            <div className="text-sm font-semibold text-slate-200">
              {i18n.t("test.question", { n: idx + 1 })}
            </div>
            <div className="mt-1 text-base font-semibold">{q.prompt}</div>
            <div className="mt-3 grid gap-2">
              {(q.choices || []).map((c, choiceIdx) => (
                <label
                  key={choiceIdx}
                  className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition-colors hover:bg-white/10"
                >
                  <input
                    type="radio"
                    name={`q_${idx}`}
                    checked={answers[idx] === choiceIdx}
                    onChange={() => {
                      const next = answers.slice();
                      next[idx] = choiceIdx;
                      setAnswers(next);
                    }}
                    className="mt-1"
                  />
                  <span className="text-sm text-slate-100">{c.text}</span>
                </label>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </Container>
  );
}
