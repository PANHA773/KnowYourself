import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../components/Container.jsx";
import Card from "../components/Card.jsx";
import { http } from "../api/http.js";
import { useI18n } from "../i18n/I18nContext.jsx";

export default function RoadmapsPage() {
  const i18n = useI18n();
  const [careers, setCareers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    http
      .get("/careers", { params: { lang: i18n.lang } })
      .then(({ data }) => setCareers(data.careers || []))
      .catch(() => setError(i18n.t("roadmaps.loadError")));
  }, [i18n.lang]);

  return (
    <Container>
      <h2 className="text-2xl font-semibold">{i18n.t("roadmaps.title")}</h2>
      <p className="mt-1 text-slate-200/70">{i18n.t("roadmaps.subtitle")}</p>

      {error ? (
        <div className="mt-4 rounded-2xl border border-amber-400/30 bg-amber-500/10 p-3 text-sm text-amber-100">
          {error}
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {careers.map((c) => (
          <Link key={c.slug} to={`/roadmaps/${c.slug}`}>
            <Card>
              <div className="text-lg font-semibold">{c.title}</div>
              <div className="mt-2 text-sm text-slate-200/70">{c.description}</div>
              <div className="mt-3 text-sm text-slate-200/70">
                {i18n.t("roadmaps.skills")}{" "}
                <span className="text-slate-100">{(c.skills || []).slice(0, 4).join(", ")}</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </Container>
  );
}
