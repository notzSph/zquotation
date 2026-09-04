import type { Quote, Row } from "../../quote";
import { PreviewHeader } from "../header/header";
import { prospectTotal } from "./prospectTotal";
import "./prospect.css";

export function ProspectPage({
  q,
  title,
  rows,
  intro,
}: {
  q: Quote;
  title: string;
  rows: Row[];
  intro?: string;
}) {
  return (
    <article className="prospectPreviewPage">
      <PreviewHeader q={q} className="prospectPreviewTop" />
      <h2>{title}</h2>
      {intro && <p className="prospectPreviewIntro">{intro}</p>}
      <table className="prospectPreviewTable">
        <colgroup>
          <col className="prospectPreviewItemColumn" />
          <col />
          <col className="prospectPreviewTotalColumn" />
        </colgroup>
        <thead>
          <tr>
            <th>VOCE</th>
            <th>DESCRIZIONE</th>
            <th>TOTALE</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              <td>{row.description}</td>
              <td>{row.total}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">TOTALE</th>
            <td />
            <td>{prospectTotal(rows)}</td>
          </tr>
        </tfoot>
      </table>
      <p className="prospectPreviewNote">
        Il presente {title} è da considerarsi indicativo e potrà essere adeguato
        in funzione di richieste specifiche o modifiche.
      </p>
    </article>
  );
}
