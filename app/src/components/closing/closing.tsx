import { ArrowDownLeft } from "lucide-react";
import type { Quote } from "../../quote";
import { PreviewHeader, previewDate } from "../header/header";
import "./closing.css";

export function ClosingPage({ q }: { q: Quote }) {
  const { year } = previewDate();
  return (
    <article className="closingPreviewPage">
      <PreviewHeader q={q} className="closingPreviewTop" />
      <h2>Grazie</h2>
      <div className="closingPreviewContact">
        <p>{q.provider.replace("\n", " ")}</p>
        {q.contactLines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      <ArrowDownLeft
        className="closingPreviewArrow"
        aria-hidden="true"
        size={27}
        strokeWidth={1.5}
      />
      <footer>
        © {year} {q.provider.replace("\n", " ")} | {q.providerMeta}
        <span>Divieto di diffusione non autorizzata</span>
      </footer>
    </article>
  );
}
