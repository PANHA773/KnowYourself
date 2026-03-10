import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Container from "../components/Container.jsx";
import Card from "../components/Card.jsx";
import { http } from "../api/http.js";
import { toAssetUrl } from "../api/http.js";
import { useI18n } from "../i18n/I18nContext.jsx";

export default function BlogPostPage() {
  const { slug } = useParams();
  const i18n = useI18n();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    http
      .get(`/posts/${slug}`, { params: { lang: i18n.lang } })
      .then(({ data }) => setPost(data.post))
      .catch(() => setError("Post not found"));
  }, [slug, i18n.lang]);

  if (error) {
    return (
      <Container>
        <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">
          {error}
        </div>
      </Container>
    );
  }

  if (!post) return <Container>Loading…</Container>;

  return (
    <Container>
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{post.title}</h2>
          <p className="mt-1 text-slate-200/70">{post.excerpt}</p>
        </div>
        <Link className="link text-sm" to="/blog">
          {i18n.t("blog.back")}
        </Link>
      </div>

      {post.coverImageUrl ? (
        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <div className="aspect-[21/9]">
            <img src={toAssetUrl(post.coverImageUrl)} alt={post.title} className="h-full w-full object-cover" />
          </div>
        </div>
      ) : null}

      <div className="mt-6">
        <Card>
          <div className="whitespace-pre-wrap text-sm leading-6 text-slate-100/90">{post.content}</div>
        </Card>
      </div>
    </Container>
  );
}
