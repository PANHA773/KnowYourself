import React, { useEffect, useMemo, useState } from "react";
import Card from "../../components/Card.jsx";
import Field from "../../components/Field.jsx";
import { http } from "../../api/http.js";
import { useI18n } from "../../i18n/I18nContext.jsx";

export default function AdminExperiences() {
  const i18n = useI18n();
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(null);
  const [form, setForm] = useState({ title: "", body: "", difficulty: 3, tags: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function load() {
    return http
      .get("/admin/experiences")
      .then(({ data }) => setItems(data.experiences || []))
      .catch((e) => setError(e?.response?.data?.message || i18n.t("admin.loadFail.experiences")));
  }

  useEffect(() => {
    load();
  }, []);

  const isEditing = useMemo(() => Boolean(active?._id), [active]);

  function toCsv(arr) {
    return (arr || []).join(", ");
  }

  function select(item) {
    setActive(item);
    setForm({
      title: item.title || "",
      body: item.body || "",
      difficulty: item.difficulty || 3,
      tags: toCsv(item.tags)
    });
  }

  function newItem() {
    setActive(null);
    setForm({ title: "", body: "", difficulty: 3, tags: "" });
  }

  async function save() {
    setError("");
    try {
      setSaving(true);
      if (!form.title.trim() || !form.body.trim()) return setError(i18n.t("admin.required.titleBody"));
      if (isEditing) {
        await http.put(`/admin/experiences/${active._id}`, form);
      } else {
        await http.post("/admin/experiences", form);
      }
      await load();
      newItem();
    } catch (e) {
      setError(e?.response?.data?.message || i18n.t("admin.saveFail"));
    } finally {
      setSaving(false);
    }
  }

  async function remove(id) {
    // eslint-disable-next-line no-alert
    if (!confirm(i18n.t("admin.confirmDeleteExperience"))) return;
    setError("");
    try {
      setSaving(true);
      await http.delete(`/admin/experiences/${id}`);
      await load();
      if (active?._id === id) newItem();
    } catch (e) {
      setError(e?.response?.data?.message || i18n.t("admin.deleteFail"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-[360px,1fr]">
      <Card>
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">{i18n.t("admin.experiences")}</div>
          <button className="btn-secondary press" onClick={newItem}>
            {i18n.t("admin.new")}
          </button>
        </div>
        <div className="mt-2 text-sm text-slate-200/70">
          {i18n.t("admin.experiencesSubtitle")} {i18n.t("admin.experiencesModerationTip")}
        </div>
        {error ? (
          <div className="mt-3 rounded-2xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">
            {error}
          </div>
        ) : null}
        <div className="mt-4 grid gap-2">
          {items.map((x) => (
            <button
              key={x._id}
              onClick={() => select(x)}
              className={`text-left rounded-xl border border-white/10 px-3 py-2 transition-colors hover:bg-white/10 ${
                active?._id === x._id ? "bg-white/10" : "bg-white/5"
              }`}
            >
              <div className="text-sm font-semibold text-slate-100">{x.title}</div>
              <div className="mt-1 text-xs text-slate-200/70">
                {x.author?.name || i18n.t("common.student")} • {i18n.t("exp.difficulty")} {x.difficulty}/5
              </div>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <div className="text-lg font-semibold">
          {isEditing ? i18n.t("admin.editExperience") : i18n.t("admin.createExperience")}
        </div>
        <div className="mt-4 grid gap-3">
          <Field label={i18n.t("admin.field.titleEn")}>
            <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Field>
          <Field label={i18n.t("admin.field.body")}>
            <textarea className="textarea" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
          </Field>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label={i18n.t("admin.field.difficulty")}>
              <input
                className="input"
                type="number"
                min="1"
                max="5"
                value={form.difficulty}
                onChange={(e) => setForm({ ...form, difficulty: Number(e.target.value) })}
              />
            </Field>
            <Field label={i18n.t("admin.field.tags")}>
              <input
                className="input"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder={i18n.t("admin.ph.csvTagsExp")}
              />
            </Field>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button disabled={saving} onClick={save} className="btn-primary press">
            {saving ? i18n.t("admin.saving") : i18n.t("admin.save")}
          </button>
          {isEditing ? (
            <button disabled={saving} onClick={() => remove(active._id)} className="btn-secondary press">
              {i18n.t("admin.delete")}
            </button>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
