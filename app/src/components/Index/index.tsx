import type { Quote } from "../../quote";
import { PreviewHeader } from "../header/header";
import "./index.css";

export function IndexPage({ q }: { q: Quote }) {
  return (
    <article className="indexPreviewPage">
      <PreviewHeader q={q} className="indexPreviewTop" />
      <div className="indexPreviewIntro">
        <h3>Introduzione</h3>
        <div className="indexPreviewRule" />
      </div>
      <h2 className="indexPreviewTitle">
        {[q.title, q.indexSubtitle, q.client].join("\n")}
      </h2>
      <div className="indexPreviewBody">
        <div className="indexPreviewDescription">
          {q.intro.split("\n").map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <ol className="indexPreviewItems">
          {q.indexItems.map((item, index) => (
            <li key={item.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{item.title}</h3>
                {item.copy.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </article>
  );
}
