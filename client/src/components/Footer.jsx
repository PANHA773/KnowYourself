import React from "react";
import { Link } from "react-router-dom";
import Container from "./Container.jsx";
import { useI18n } from "../i18n/I18nContext.jsx";

export default function Footer() {
  const i18n = useI18n();

  return (
    <footer className="mt-10 border-t border-white/10 bg-slate-950/40">
      <Container>
        <div className="flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-100">
              Know<span className="text-sky-300">Yourself</span>
            </div>
            <div className="mt-1 text-xs text-slate-200/70">{i18n.t("footer.tagline")}</div>
          </div>

          <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <Link className="link" to="/test">
              {i18n.t("nav.selfTest")}
            </Link>
            <Link className="link" to="/majors">
              {i18n.t("nav.majors")}
            </Link>
            <Link className="link" to="/roadmaps">
              {i18n.t("nav.roadmaps")}
            </Link>
            <Link className="link" to="/videos">
              {i18n.t("nav.videos")}
            </Link>
            <Link className="link" to="/blog">
              {i18n.t("nav.blog")}
            </Link>
            <Link className="link" to="/about">
              {i18n.t("nav.about")}
            </Link>
          </nav>

          <div className="text-xs text-slate-200/60">{i18n.t("footer.copyright")}</div>
        </div>
      </Container>
    </footer>
  );
}
