import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../components/Container.jsx";
import Card from "../components/Card.jsx";
import { http } from "../api/http.js";
import { useI18n } from "../i18n/I18nContext.jsx";

export default function TestResultPage() {
  const i18n = useI18n();
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    http
      .get("/test/me/latest")
      .then(({ data }) => setResult(data.result))
      .catch((e) => setError(e?.response?.data?.message || "Failed to load result"));
  }, []);

  if (error) {
    return (
      <Container>
        <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">
          {error}
        </div>
      </Container>
    );
  }

  if (!result) {
    return (
      <Container>
        <Card>
          <div className="text-slate-200/70">{i18n.t("result.noResult")}</div>
          <div className="mt-3">
            <Link className="link text-sm" to="/test">
              {i18n.t("result.goToTest")}
            </Link>
          </div>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{i18n.t("result.title")}</h2>
          <p className="mt-1 text-slate-200/70">{i18n.t("result.subtitle")}</p>
        </div>
        <Link
          to="/dashboard"
          className="btn-secondary"
        >
          {i18n.t("result.openDashboard")}
        </Link>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <div className="text-sm font-semibold text-slate-200">{i18n.t("result.personality")}</div>
          <div className="mt-1 text-xl font-semibold">{result.personalityLabel}</div>
          <div className="mt-3 text-sm text-slate-200/70">
            {i18n.t("result.topCodes")}{" "}
            <span className="font-semibold text-slate-100">{result.topCodes?.join("")}</span>
          </div>
        </Card>
        <Card>
          <div className="text-sm font-semibold text-slate-200">{i18n.t("result.scores")}</div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
            {Object.entries(result.scores || {}).map(([k, v]) => (
              <div key={k} className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="font-medium">{k}</div>
                <div className="text-slate-200/70">{v}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Card>
          <div className="text-sm font-semibold text-slate-200">
            {i18n.t("result.recommendedMajors")}
          </div>
          <ul className="mt-2 list-disc pl-5 text-sm text-slate-100/90">
            {(result.recommendedMajors || []).map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
          <div className="mt-3">
            <Link className="link text-sm" to="/majors">
              {i18n.t("result.exploreMajors")}
            </Link>
          </div>
        </Card>
        <Card>
          <div className="text-sm font-semibold text-slate-200">
            {i18n.t("result.recommendedCareers")}
          </div>
          <ul className="mt-2 list-disc pl-5 text-sm text-slate-100/90">
            {(result.recommendedCareers || []).map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <div className="mt-3">
            <Link className="link text-sm" to="/roadmaps">
              {i18n.t("result.exploreRoadmaps")}
            </Link>
          </div>
        </Card>
      </div>
    </Container>
  );
}
