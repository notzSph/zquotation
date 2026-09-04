import type { Quote } from "../../quote";
import "./header.css";

export function previewDate() {
  const now = new Date();
  const month = new Intl.DateTimeFormat("it-IT", { month: "long" }).format(now);
  return {
    month: month.charAt(0).toUpperCase() + month.slice(1),
    year: now.getFullYear(),
  };
}

export function PreviewHeader({
  q,
  className,
  providerClassName,
  dateClassName,
}: {
  q: Quote;
  className: string;
  providerClassName?: string;
  dateClassName?: string;
}) {
  const { month, year } = previewDate();
  return (
    <div className={`${className} proposalPreviewHeader`}>
      <div className={`proposalPreviewProvider ${providerClassName ?? ""}`}>
        <img
          className="proposalPreviewLogo"
          src={`/${(q.logo || "z-logo.svg").replace(/^\/+/, "")}`}
          alt=""
        />
        <div className="proposalPreviewProviderText">
          {q.provider.split("\n").map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>
      </div>
      <div className={dateClassName}>
        {month}
        <br />
        {year}
      </div>
    </div>
  );
}
