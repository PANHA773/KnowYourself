import React, { useEffect, useMemo, useState } from "react";
import Card from "../../components/Card.jsx";
import Field from "../../components/Field.jsx";
import { http } from "../../api/http.js";
import { useI18n } from "../../i18n/I18nContext.jsx";

const empty = {
  title: "",
  titleKm: "",
  excerpt: "",
  excerptKm: "",
  content: "",
  contentKm: "",
  coverImageUrl: "",
  tags: ""
};

export default function AdminPosts() {
  const i18n = useI18n();
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(null);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  function toCsv(arr) {
    return (arr || []).join(", ");
  }

  function load() {
    return http
      .get("/admin/posts")
      .then(({ data }) => setItems(data.posts || []))
      .catch((e) => setError(e?.response?.data?.message || i18n.t("admin.loadFail.posts")));
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
      excerpt: item.excerpt || "",
      excerptKm: item.excerptKm || "",
      content: item.content || "",
      contentKm: item.contentKm || "",
      coverImageUrl: item.coverImageUrl || "",
      tags: toCsv(item.tags)
    });
    setImageFile(null);
  }

  function newItem() {
    setActive(null);
    setForm(empty);
    setImageFile(null);
  }

  async function uploadPostImage() {
    if (!imageFile) return;
    setError("");
    try {
      setUploading(true);
      const data = new FormData();
      data.append("file", imageFile);
      const res = await http.post("/admin/uploads/post-image", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setForm((prev) => ({ ...prev, coverImageUrl: res.data?.url || "" }));
    } catch (e) {
      setError(e?.response?.data?.message || i18n.t("admin.uploadFail"));
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    setError("");
    try {
      setSaving(true);
      if (!form.title.trim()) return setError(i18n.t("admin.required.title"));
      if (isEditing) {
        await http.put(`/admin/posts/${active._id}`, form);
      } else {
        await http.post("/admin/posts", form);
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
    if (!confirm(i18n.t("admin.confirmDeletePost"))) return;
    setError("");
    try {
      setSaving(true);
      await http.delete(`/admin/posts/${active._id}`);
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
          <div className="text-lg font-semibold">{i18n.t("admin.posts")}</div>
          <button className="btn-secondary press" onClick={newItem}>
            {i18n.t("admin.new")}
          </button>
        </div>
        <div className="mt-3 grid gap-2">
          {items.map((p) => (
            <button
              key={p._id}
              onClick={() => select(p)}
              className={`text-left rounded-xl border border-white/10 px-3 py-2 transition-colors hover:bg-white/10 ${
                active?._id === p._id ? "bg-white/10" : "bg-white/5"
              }`}
            >
              <div className="text-sm font-semibold text-slate-100">{p.title}</div>
              {p.excerpt ? <div className="line-clamp-2 text-xs text-slate-200/70">{p.excerpt}</div> : null}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <div className="text-lg font-semibold">
          {isEditing ? i18n.t("admin.editPost") : i18n.t("admin.createPost")}
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
            <input
              className="input"
              value={form.titleKm}
              onChange={(e) => setForm({ ...form, titleKm: e.target.value })}
            />
          </Field>
          <Field label={i18n.t("admin.field.imageUrl")} hint="/images/posts/how-to-choose-a-major.svg">
            <input
              className="input"
              value={form.coverImageUrl}
              onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })}
              placeholder="/uploads/posts/your-image.jpg"
            />
          </Field>
          <div className="grid gap-2 md:grid-cols-[1fr,auto] md:items-end">
            <Field label={i18n.t("admin.field.uploadImage")} hint={i18n.t("admin.field.uploadHint")}>
              <input
                className="input"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
            </Field>
            <button
              type="button"
              disabled={!imageFile || uploading}
              onClick={uploadPostImage}
              className="btn-secondary press"
            >
              {uploading ? i18n.t("admin.uploading") : i18n.t("admin.upload")}
            </button>
          </div>
          <Field label={i18n.t("admin.field.excerpt")}>
            <textarea className="textarea" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
          </Field>
          <Field label={i18n.t("admin.field.excerptKm")}>
            <textarea
              className="textarea"
              value={form.excerptKm}
              onChange={(e) => setForm({ ...form, excerptKm: e.target.value })}
            />
          </Field>
          <Field label={i18n.t("admin.field.content")}>
            <textarea className="textarea" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          </Field>
          <Field label={i18n.t("admin.field.contentKm")}>
            <textarea
              className="textarea"
              value={form.contentKm}
              onChange={(e) => setForm({ ...form, contentKm: e.target.value })}
            />
          </Field>
          <Field label={i18n.t("admin.field.tags")}>
            <input
              className="input"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder={i18n.t("admin.ph.csvTagsPost")}
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
