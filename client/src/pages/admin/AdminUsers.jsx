import React, { useEffect, useMemo, useState } from "react";
import Card from "../../components/Card.jsx";
import Field from "../../components/Field.jsx";
import { http } from "../../api/http.js";
import { useI18n } from "../../i18n/I18nContext.jsx";
import { useAuth } from "../../state/AuthContext.jsx";

const empty = { name: "", email: "", password: "", role: "student" };

export default function AdminUsers() {
  const i18n = useI18n();
  const auth = useAuth();
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(null);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function load() {
    return http
      .get("/admin/users")
      .then(({ data }) => setItems(data.users || []))
      .catch((e) => setError(e?.response?.data?.message || i18n.t("admin.loadFail.users")));
  }

  useEffect(() => {
    load();
  }, []);

  const isEditing = useMemo(() => Boolean(active?._id), [active]);
  const isMe = useMemo(() => active?._id && auth.user?.id && String(active._id) === String(auth.user.id), [active, auth.user]);

  function select(item) {
    setActive(item);
    setForm({
      name: item.name || "",
      email: item.email || "",
      password: "",
      role: item.role === "admin" ? "admin" : "student"
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
      if (!form.name.trim()) return setError(i18n.t("admin.required.name"));
      if (!isEditing && !form.email.trim()) return setError(i18n.t("admin.required.email"));
      if (!isEditing && !form.password.trim()) return setError(i18n.t("admin.required.password"));

      if (isEditing) {
        const payload = {
          name: form.name,
          role: form.role,
          ...(form.password.trim() ? { password: form.password } : {})
        };
        await http.put(`/admin/users/${active._id}`, payload);
      } else {
        await http.post("/admin/users", form);
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
    if (!confirm(i18n.t("admin.confirmDeleteUser"))) return;
    setError("");
    try {
      setSaving(true);
      await http.delete(`/admin/users/${active._id}`);
      await load();
      newItem();
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
          <div className="text-lg font-semibold">{i18n.t("admin.users")}</div>
          <button className="btn-secondary press" onClick={newItem}>
            {i18n.t("admin.new")}
          </button>
        </div>
        {error ? (
          <div className="mt-3 rounded-2xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">
            {error}
          </div>
        ) : null}
        <div className="mt-4 grid gap-2">
          {items.map((u) => (
            <button
              key={u._id}
              onClick={() => select(u)}
              className={`text-left rounded-xl border border-white/10 px-3 py-2 transition-colors hover:bg-white/10 ${
                active?._id === u._id ? "bg-white/10" : "bg-white/5"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-semibold text-slate-100">{u.name}</div>
                <span className="chip">{u.role}</span>
              </div>
              <div className="mt-1 text-xs text-slate-200/70">{u.email}</div>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <div className="text-lg font-semibold">
          {isEditing ? i18n.t("admin.editUser") : i18n.t("admin.createUser")}
        </div>
        <div className="mt-4 grid gap-3">
          <Field label={i18n.t("admin.field.name")}>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label={i18n.t("admin.field.email")} hint={isEditing ? i18n.t("admin.userEmailLocked") : ""}>
            <input
              className="input"
              value={form.email}
              disabled={isEditing}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="user@example.com"
            />
          </Field>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label={i18n.t("admin.field.role")}>
              <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="student">{i18n.t("admin.role.student")}</option>
                <option value="admin">{i18n.t("admin.role.admin")}</option>
              </select>
            </Field>
            <Field label={i18n.t("admin.field.password")} hint={isEditing ? i18n.t("admin.passwordOptional") : ""}>
              <input
                className="input"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder={isEditing ? "••••••••" : "Min 6 chars"}
              />
            </Field>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button disabled={saving} onClick={save} className="btn-primary press">
            {saving ? i18n.t("admin.saving") : i18n.t("admin.save")}
          </button>
          {isEditing ? (
            <button disabled={saving || isMe} onClick={remove} className="btn-secondary press" title={isMe ? "Disabled" : ""}>
              {i18n.t("admin.delete")}
            </button>
          ) : null}
        </div>
      </Card>
    </div>
  );
}

