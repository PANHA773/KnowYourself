import React, { useEffect, useState } from "react";
import Container from "../components/Container.jsx";
import Card from "../components/Card.jsx";
import { http } from "../api/http.js";
import { useI18n } from "../i18n/I18nContext.jsx";
import { toYouTubeEmbedUrl } from "../utils/youtube.js";

export default function VideosPage() {
  const i18n = useI18n();
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    http
      .get("/videos", { params: { lang: i18n.lang } })
      .then(({ data }) => setVideos(data.videos || []))
      .catch(() => setError(i18n.t("videos.loadError")));
  }, [i18n.lang]);

  return (
    <Container>
      <h2 className="text-2xl font-semibold">{i18n.t("videos.title")}</h2>
      <p className="mt-1 text-slate-200/70">{i18n.t("videos.subtitle")}</p>

      {error ? (
        <div className="mt-4 rounded-2xl border border-amber-400/30 bg-amber-500/10 p-3 text-sm text-amber-100">
          {error}
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {videos.map((v) => {
          const embed = toYouTubeEmbedUrl(v.url);
          return (
            <Card key={v.slug}>
              <div className="text-lg font-semibold text-slate-100">{v.title}</div>
              {v.description ? <div className="mt-2 text-sm text-slate-200/70">{v.description}</div> : null}

              {embed ? (
                <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                  <div className="aspect-video">
                    <iframe
                      className="h-full w-full"
                      src={embed}
                      title={v.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                </div>
              ) : (
                <a className="link mt-4 inline-block text-sm" href={v.url} target="_blank" rel="noreferrer">
                  {i18n.t("videos.openLink")}
                </a>
              )}

              {v.tags?.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {v.tags.map((t) => (
                    <span className="chip" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
            </Card>
          );
        })}
      </div>
    </Container>
  );
}
