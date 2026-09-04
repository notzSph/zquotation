import type { Quote } from "../../quote";
import { PreviewHeader } from "../header/header";
import "./cover.css";

export function CoverPage({ q }: { q: Quote }) {
  return (
    <article className="coverPreviewPage">
      <div className="coverPreviewImage" />
      <div className="coverPreviewAccent" />
      <PreviewHeader
        q={q}
        className="coverPreviewHeader"
        providerClassName="coverPreviewProvider"
        dateClassName="coverPreviewDate"
      />
      <h2>{q.title}</h2>
      <div className="coverPreviewParties">
        <div>
          <p>Presentata da:</p>
          <strong>{q.provider.replace("\n", " ")}</strong>
          <span>{q.contactLines[0]}</span>
        </div>
        <div>
          <p>Presentata per:</p>
          <strong>{q.client}</strong>
          {q.clientVat && <span>P.IVA {q.clientVat}</span>}
        </div>
      </div>
    </article>
  );
}
