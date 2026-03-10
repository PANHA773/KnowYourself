import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Container from "../components/Container.jsx";
import Card from "../components/Card.jsx";
import { http } from "../api/http.js";
import { useI18n } from "../i18n/I18nContext.jsx";

export default function RoadmapDetailPage() {
  const { slug } = useParams();
  const i18n = useI18n();
  const [career, setCareer] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    http
      .get(`/careers/${slug}`, { params: { lang: i18n.lang } })
      .then(({ data }) => setCareer(data.career))
      .catch(() => setError("Roadmap not found"));
  }, [slug, i18n.lang]);

  if (error) {
    return (
      <Container>
        <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">
          {error}
        </div>
      </Container>
    );
  }

  if (!career) return <Container>Loading…</Container>;

  return (
    <Container>
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{career.title}</h2>
          <p className="mt-1 text-slate-200/70">{career.description}</p>
        </div>
        <Link className="link text-sm" to="/roadmaps">
          {i18n.t("roadmap.back")}
        </Link>
      </div>

      <div className="mt-6 grid gap-4">
        <Card>
          <div className="text-sm font-semibold text-slate-200">{i18n.t("roadmap.skillsBuild")}</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {(career.skills || []).map((s) => (
              <span key={s} className="chip">
                {s}
              </span>
            ))}
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold text-slate-200">{i18n.t("roadmap.steps")}</div>
          <ol className="mt-3 grid gap-3">
            {(career.roadmap || []).map((r, idx) => (
              <li key={idx} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold text-slate-200">
                  {i18n.t("roadmap.step", { n: idx + 1 })}
                </div>
                <div className="mt-1 font-semibold text-slate-100">{r.step}</div>
                {r.details ? <div className="mt-1 text-sm text-slate-200/70">{r.details}</div> : null}
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </Container>
  );
}
