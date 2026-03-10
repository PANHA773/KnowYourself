import React, { useEffect, useMemo, useState } from "react";
import Card from "../../components/Card.jsx";
import Field from "../../components/Field.jsx";
import { http } from "../../api/http.js";
import { useI18n } from "../../i18n/I18nContext.jsx";

const empty = {
  title: "",
  titleKm: "",
  description: "",
  descriptionKm: "",
  url: "",
  tags: ""
};

export default function AdminVideos() {
  const i18n = useI18n();
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(null);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function toCsv(arr) {
    return (arr || []).join(", ");
  }

  function load() {
    return http
      .get("/admin/videos")
      .then(({ data }) => setItems(data.videos || []))
      .catch((e) => setError(e?.response?.data?.message || i18n.t("admin.loadFail.videos")));
  }

  useEffect(() => {
    load();
  }, []);

  const isEditing = useMemo(() => Boolean(active?._id), [active]);

  function select(item) {
    setActive(item);
    setForm({
      title: item.title || "",
      titleKm: item.titleKm || "",
      description: item.description || "",
      descriptionKm: item.descriptionKm || "",
      url: item.url || "",
      tags: toCsv(item.tags)
    });
  }

  function newItem() {
    setActive(null);
    setForm(empty);
  }

  async function save() {
    setError("");
    try {
      setSaving(true);
      if (!form.title.trim()) return setError(i18n.t("admin.required.title"));
      if (!form.url.trim()) return setError(i18n.t("admin.required.url"));
      if (isEditing) {
        await http.put(`/admin/videos/${active._id}`, form);
      } else {
        await http.post("/admin/videos", form);
      }
      await load();
      newItem();
    } catch (e) {
      setError(e?.response?.data?.message || i18n.t("admin.saveFail"));
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!active?._id) return;
    // eslint-disable-next-line no-alert
    if (!confirm(i18n.t("admin.confirmDeleteVideo"))) return;
    setError("");
    try {
      setSaving(true);
      await http.delete(`/admin/videos/${active._id}`);
      await load();
      newItem();
    } catch (e) {
      setError(e?.response?.data?.message || i18n.t("admin.deleteFail"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-[320px,1fr]">
      <Card>
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">{i18n.t("admin.videos")}</div>
          <button className="btn-secondary press" onClick={newItem}>
            {i18n.t("admin.new")}
          </button>
        </div>
        <div className="mt-3 grid gap-2">
          {items.map((v) => (
            <button
              key={v._id}
              onClick={() => select(v)}
              className={`text-left rounded-xl border border-white/10 px-3 py-2 transition-colors hover:bg-white/10 ${
                active?._id === v._id ? "bg-white/10" : "bg-white/5"
              }`}
            >
              <div className="text-sm font-semibold text-slate-100">{v.title}</div>
              {v.titleKm ? <div className="text-xs text-slate-200/70">{v.titleKm}</div> : null}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <div className="text-lg font-semibold">
          {isEditing ? i18n.t("admin.editVideo") : i18n.t("admin.createVideo")}
        </div>
        {error ? (
          <div className="mt-3 rounded-2xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">
            {error}
          </div>
        ) : null}
        <div className="mt-4 grid gap-3">
          <Field label={i18n.t("admin.field.titleEn")}>
            <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Field>
          <Field label={i18n.t("admin.field.titleKm")}>
            <input className="input" value={form.titleKm} onChange={(e) => setForm({ ...form, titleKm: e.target.value })} />
          </Field>
          <Field label={i18n.t("admin.field.descEn")}>
            <textarea className="textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
          <Field label={i18n.t("admin.field.descKm")}>
            <textarea
              className="textarea"
              value={form.descriptionKm}
              onChange={(e) => setForm({ ...form, descriptionKm: e.target.value })}
            />
          </Field>
          <Field label={i18n.t("admin.field.url")}>
            <input className="input" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
          </Field>
          <Field label={i18n.t("admin.field.tags")}>
            <input
              className="input"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder={i18n.t("admin.ph.csvTags")}
            />
          </Field>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button disabled={saving} onClick={save} className="btn-primary press">
            {saving ? i18n.t("admin.saving") : i18n.t("admin.save")}
          </button>
          {isEditing ? (
            <button disabled={saving} onClick={remove} className="btn-secondary press">
              {i18n.t("admin.delete")}
            </button>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
