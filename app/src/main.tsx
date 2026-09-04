import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { ProposalPreview } from "./components/preview/preview";
import { seed, type Quote } from "./quote";
import "./style.css";

function App() {
  const [raw, setRaw] = useState(JSON.stringify(seed, null, 2));
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);
  const [logs, setLogs] = useState([
    "Ready — save the live preview directly as PDF.",
  ]);

  const quote = useMemo(() => {
    try {
      setError("");
      return JSON.parse(raw) as Quote;
    } catch {
      setError("Invalid JSON — fix the copy structure before exporting.");
      return seed;
    }
  }, [raw]);

  const log = (message: string) => {
    const line = `${new Date().toLocaleTimeString()}  ${message}`;
    console.info("[ZQuotation]", line);
    setLogs((current) => [...current.slice(-7), line]);
  };

  const download = async () => {
    setExporting(true);
    log("Rendering the live pages to A4 PDF.");
    try {
      await document.fonts.ready;
      const pages = Array.from(
        document.querySelectorAll<HTMLElement>(".htmlPreview > .printPage > article"),
      );
      if (!pages.length) throw new Error("No proposal pages found");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
        compress: true,
      });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      for (const [index, page] of pages.entries()) {
        const canvas = await html2canvas(page, {
          scale: 2,
          backgroundColor: "#ffffff",
          useCORS: true,
          logging: false,
        });
        if (index > 0) pdf.addPage("a4", "portrait");
        pdf.addImage(
          canvas.toDataURL("image/jpeg", 0.94),
          "JPEG",
          0,
          0,
          pageWidth,
          pageHeight,
          undefined,
          "FAST",
        );
      }

      pdf.save(`${quote.client.replace(/\s+/g, "-").toLowerCase()}-proposal.pdf`);
      log(`PDF downloaded · ${pages.length} A4 pages.`);
    } catch (cause) {
      log(`EXPORT FAILED: ${cause instanceof Error ? cause.message : String(cause)}`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <main>
      <aside>
        <div className="brand">zQUOTATION</div>
        <h1>
          Proposal
          <br />
          generator.
        </h1>
        <p>
          Replace the copy in the structured brief. The page family and A4
          layout stay locked.
        </p>
        <label>PROJECT BRIEF · JSON</label>
        <textarea
          value={raw}
          onChange={(event) => setRaw(event.target.value)}
          spellCheck={false}
        />
        {error && <div className="error">{error}</div>}
        <button
          type="button"
          onClick={() => void download()}
          disabled={!!error || exporting}
          className="export"
        >
          {exporting ? "Building PDF…" : "Download A4 PDF"}
        </button>
        <pre className="log">{logs.join("\n")}</pre>
      </aside>
      <section>
        <div className="previewHead">
          <div>
            <div className="previewLabel">LIVE HTML PROPOSAL PREVIEW</div>
            <p className="client">Prepared for {quote.client}</p>
          </div>
          <span>{quote.services.length} service pages</span>
        </div>
        <div className="pdfPreview">
          <ProposalPreview q={quote} />
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
