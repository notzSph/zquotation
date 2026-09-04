import { Flag } from "lucide-react";
import type { Quote } from "../../quote";
import { PreviewHeader } from "../header/header";
import "./timeline.css";

export function TimelinePage({ q }: { q: Quote }) {
  return (
    <article className="timelinePreviewPage">
      <PreviewHeader q={q} className="timelinePreviewTop" />
      <h2>Timeline</h2>
      <p className="timelinePreviewNote">{q.timelineNote}</p>
      <ol className="timelinePreviewRoute">
        {q.timeline.map((phase, index) => (
          <li
            className={`timelinePreviewStop ${index % 2 ? "right" : "left"}`}
            key={phase.period}
          >
            <div className="timelinePreviewStopCopy">
              <p className="timelinePreviewPeriod">
                <Flag
                  aria-hidden="true"
                  size={12}
                  strokeWidth={1.5}
                  fill="currentColor"
                />
                {phase.period}
              </p>
              <h3>{phase.title}</h3>
              <ul>
                {phase.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <span className="timelinePreviewNode" aria-hidden="true" />
          </li>
        ))}
      </ol>
    </article>
  );
}
