import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../components/Container.jsx";
import Card from "../components/Card.jsx";
import { http } from "../api/http.js";
import { toAssetUrl } from "../api/http.js";
import { useI18n } from "../i18n/I18nContext.jsx";

export default function BlogPage() {
  const i18n = useI18n();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    http
      .get("/posts", { params: { lang: i18n.lang } })
      .then(({ data }) => setPosts(data.posts || []))
      .catch(() => setError(i18n.t("blog.loadError")));
  }, [i18n.lang]);

  return (
    <Container>
      <h2 className="text-2xl font-semibold">{i18n.t("blog.title")}</h2>
      <p className="mt-1 text-slate-200/70">{i18n.t("blog.subtitle")}</p>

      {error ? (
        <div className="mt-4 rounded-2xl border border-amber-400/30 bg-amber-500/10 p-3 text-sm text-amber-100">
          {error}
        </div>
      ) : null}

      <div className="mt-6 grid gap-4">
        {posts.map((p) => (
          <Link key={p.slug} to={`/blog/${p.slug}`}>
            <Card>
              {p.coverImageUrl ? (
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                  <div className="aspect-[16/9]">
                    <img
                      src={toAssetUrl(p.coverImageUrl)}
                      alt={p.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              ) : null}
              <div className={p.coverImageUrl ? "mt-4 text-lg font-semibold" : "text-lg font-semibold"}>
                {p.title}
              </div>
              <div className="mt-2 text-sm text-slate-200/70">{p.excerpt}</div>
              {p.tags?.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
            </Card>
          </Link>
        ))}
      </div>
    </Container>
  );
}
