import React from "react";
import Card from "../../components/Card.jsx";
import { useI18n } from "../../i18n/I18nContext.jsx";

export default function AdminDashboard() {
  const i18n = useI18n();
  return (
    <div className="grid gap-4">
      <Card>
        <div className="text-2xl font-semibold">{i18n.t("admin.panelTitle")}</div>
        <div className="mt-2 text-sm text-slate-200/70">{i18n.t("admin.panelSubtitle")}</div>
      </Card>
      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <div className="text-sm font-semibold text-slate-200">{i18n.t("admin.tipTitle")}</div>
          <div className="mt-2 text-sm text-slate-200/70">
            {i18n.t("admin.tipText")}
          </div>
        </Card>
        <Card>
          <div className="text-sm font-semibold text-slate-200">{i18n.t("admin.securityTitle")}</div>
          <div className="mt-2 text-sm text-slate-200/70">
            {i18n.t("admin.securityText")} <span className="chip">admin</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
