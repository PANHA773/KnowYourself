import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "../components/Container.jsx";
import Card from "../components/Card.jsx";
import Field from "../components/Field.jsx";
import { useAuth } from "../state/AuthContext.jsx";
import { useI18n } from "../i18n/I18nContext.jsx";

export default function RegisterPage() {
  const auth = useAuth();
  const i18n = useI18n();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      await auth.register(name, email, password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || i18n.t("register.failed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <div className="mx-auto max-w-md">
        <Card>
          <h2 className="text-xl font-semibold">{i18n.t("register.title")}</h2>
          <p className="mt-1 text-sm text-slate-200/70">{i18n.t("register.subtitle")}</p>
          {error ? (
            <div className="mt-3 rounded-2xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">
              {error}
            </div>
          ) : null}
          <form onSubmit={submit} className="mt-4 grid gap-3">
            <Field label="Name">
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </Field>
            <Field label="Email">
              <input
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </Field>
            <Field label="Password" hint={i18n.t("register.hintPassword")}>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </Field>
            <button
              disabled={loading}
              className="btn-primary press"
            >
              {loading ? i18n.t("register.loading") : i18n.t("register.btn")}
            </button>
          </form>
          <div className="mt-4 text-sm text-slate-200/70">
            {i18n.t("register.have")}{" "}
            <Link className="link" to="/login">
              {i18n.t("register.login")}
            </Link>
          </div>
        </Card>
      </div>
    </Container>
  );
}
