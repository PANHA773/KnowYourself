import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../components/Container.jsx";
import Card from "../components/Card.jsx";
import { useAuth } from "../state/AuthContext.jsx";
import { http } from "../api/http.js";
import { useI18n } from "../i18n/I18nContext.jsx";

export default function DashboardPage() {
  const auth = useAuth();
  const i18n = useI18n();
  const [latest, setLatest] = useState(null);

  useEffect(() => {
    http
      .get("/test/me/latest")
      .then(({ data }) => setLatest(data.result))
      .catch(() => setLatest(null));
  }, []);

  return (
    <Container>
      <h2 className="text-2xl font-semibold">{i18n.t("dash.title")}</h2>
      <p className="mt-1 text-slate-200/70">
        {i18n.t("dash.welcome", { name: auth.user?.name || "Student" })}
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <div className="text-sm font-semibold text-slate-200">{i18n.t("dash.latest")}</div>
          {latest ? (
            <>
              <div className="mt-2 text-lg font-semibold">{latest.personalityLabel}</div>
              <div className="mt-2 text-sm text-slate-200/70">
                {i18n.t("dash.recommendedMajors")}{" "}
                <span className="font-semibold text-slate-100">
                  {(latest.recommendedMajors || []).join(", ") || "—"}
                </span>
              </div>
              <div className="mt-3">
                <Link className="link text-sm" to="/test/result">
                  {i18n.t("dash.viewResult")}
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="mt-2 text-sm text-slate-200/70">{i18n.t("dash.noLatest")}</div>
              <div className="mt-3">
                <Link className="link text-sm" to="/test">
                  {i18n.t("dash.takeTest")}
                </Link>
              </div>
            </>
          )}
        </Card>
        <Card>
          <div className="text-sm font-semibold text-slate-200">{i18n.t("dash.quick")}</div>
          <div className="mt-3 grid gap-2 text-sm">
            <Link
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-colors hover:bg-white/10"
              to="/majors"
            >
              {i18n.t("dash.exploreMajors")}
            </Link>
            <Link
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-colors hover:bg-white/10"
              to="/roadmaps"
            >
              {i18n.t("dash.exploreRoadmaps")}
            </Link>
            <Link
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-colors hover:bg-white/10"
              to="/experiences"
            >
              {i18n.t("dash.shareExp")}
            </Link>
          </div>
        </Card>
      </div>
    </Container>
  );
}
