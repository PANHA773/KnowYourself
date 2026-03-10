import React, { useEffect, useState } from "react";
import Container from "../components/Container.jsx";
import Card from "../components/Card.jsx";
import Field from "../components/Field.jsx";
import { http } from "../api/http.js";
import { useAuth } from "../state/AuthContext.jsx";
import { useI18n } from "../i18n/I18nContext.jsx";

export default function ExperiencesPage() {
  const auth = useAuth();
  const i18n = useI18n();
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [difficulty, setDifficulty] = useState(3);
  const [saving, setSaving] = useState(false);

  function load() {
    return http
      .get("/experiences")
      .then(({ data }) => setItems(data.experiences || []))
      .catch(() => setError(i18n.t("exp.loadError")));
  }

  useEffect(() => {
    load();
  }, []);

  async function submit() {
    setError("");
    if (!auth.isAuthed) return setError(i18n.t("exp.loginToShare"));
    if (!title || !body) return setError(i18n.t("exp.required"));
    try {
      setSaving(true);
      await http.post("/experiences", { title, body, difficulty });
      setTitle("");
      setBody("");
      setDifficulty(3);
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || i18n.t("exp.failedPost"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Container>
      <h2 className="text-2xl font-semibold">{i18n.t("exp.title")}</h2>
      <p className="mt-1 text-slate-200/70">{i18n.t("exp.subtitle")}</p>

      {error ? (
        <div className="mt-4 rounded-2xl border border-amber-400/30 bg-amber-500/10 p-3 text-sm text-amber-100">
          {error}
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 md:grid-cols-2 md:items-start">
        <Card>
          <div className="text-sm font-semibold text-slate-200">{i18n.t("exp.shareBox")}</div>
          <div className="mt-3 grid gap-3">
            <Field label={i18n.t("exp.field.title")}>
              <input
                className="input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={i18n.t("exp.field.titlePh")}
              />
            </Field>
            <Field label={i18n.t("exp.field.story")} hint={i18n.t("exp.field.storyHint")}>
              <textarea
                className="textarea"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={i18n.t("exp.field.storyPh")}
              />
            </Field>
            <Field label={i18n.t("exp.field.diff")}>
              <input
                type="number"
                min="1"
                max="5"
                className="input"
                value={difficulty}
                onChange={(e) => setDifficulty(Number(e.target.value))}
              />
            </Field>
            <button
              onClick={submit}
              disabled={saving}
              className="btn-primary press"
            >
              {saving ? i18n.t("exp.posting") : i18n.t("exp.post")}
            </button>
          </div>
        </Card>

        <div className="grid gap-3">
          {items.map((x) => (
            <Card key={x._id}>
              <div className="text-lg font-semibold">{x.title}</div>
              <div className="mt-1 text-sm text-slate-200/70">
                {i18n.t("exp.by")} {x.author?.name || "Student"} • {i18n.t("exp.difficulty")}:{" "}
                {x.difficulty}/5
              </div>
              <div className="mt-3 whitespace-pre-wrap text-sm text-slate-100/90">{x.body}</div>
            </Card>
          ))}
        </div>
      </div>
    </Container>
  );
}
