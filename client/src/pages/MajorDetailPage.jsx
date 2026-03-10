import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Container from "../components/Container.jsx";
import Card from "../components/Card.jsx";
import { http } from "../api/http.js";
import { toAssetUrl } from "../api/http.js";
import { useI18n } from "../i18n/I18nContext.jsx";

export default function MajorDetailPage() {
  const { slug } = useParams();
  const i18n = useI18n();
  const [major, setMajor] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    http
      .get(`/majors/${slug}`, { params: { lang: i18n.lang } })
      .then(({ data }) => setMajor(data.major))
      .catch(() => setError("Major not found"));
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

  if (!major) return <Container>Loading…</Container>;

  return (
    <Container>
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{major.title}</h2>
          <p className="mt-1 text-slate-200/70">{major.description}</p>
        </div>
        <Link className="link text-sm" to="/majors">
          {i18n.t("major.back")}
        </Link>
      </div>

      {major.imageUrl ? (
        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <div className="aspect-[21/9]">
            <img src={toAssetUrl(major.imageUrl)} alt={major.title} className="h-full w-full object-cover" />
          </div>
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <div className="text-sm font-semibold text-slate-200">{i18n.t("major.skillsNeeded")}</div>
          <ul className="mt-2 list-disc pl-5 text-sm text-slate-100/90">
            {(major.skills || []).map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </Card>
        <Card>
          <div className="text-sm font-semibold text-slate-200">{i18n.t("major.careerOps")}</div>
          <ul className="mt-2 list-disc pl-5 text-sm text-slate-100/90">
            {(major.careers || []).map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <div className="mt-3 text-sm text-slate-200/70">{i18n.t("major.tipRoadmaps")}</div>
          <div className="mt-2">
            <Link className="link text-sm" to="/roadmaps">
              {i18n.t("major.exploreRoadmaps")}
            </Link>
          </div>
        </Card>
      </div>
    </Container>
  );
}
