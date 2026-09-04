import type { ReactNode } from "react";
import type { Quote } from "../../quote";
import { ClosingPage } from "../closing/closing";
import { CoverPage } from "../cover/cover";
import { IndexPage } from "../Index";
import { ProspectPage } from "../prospect/prospect";
import { ServicePages } from "../service/service";
import { TimelinePage } from "../timeline/timeline";

function PrintPage({ children }: { children: ReactNode }) {
  return <div className="printPage">{children}</div>;
}

export function ProposalPreview({ q }: { q: Quote }) {
  return (
    <div className="htmlPreview">
      <PrintPage><CoverPage q={q} /></PrintPage>
      <PrintPage><IndexPage q={q} /></PrintPage>
      <ServicePages q={q} />
      {q.showHourlyProspect !== false && (
        <PrintPage><ProspectPage q={q} title="Prospetto Orario" rows={q.hours} /></PrintPage>
      )}
      <PrintPage><ProspectPage q={q} title="Prospetto Economico" rows={q.economics} /></PrintPage>
      {q.showMaintenanceProspect !== false && (
        <PrintPage><ProspectPage q={q} title="Maintenance" rows={[q.maintenance]} intro={q.maintenanceIntro} /></PrintPage>
      )}
      {q.showTimeline !== false && <PrintPage><TimelinePage q={q} /></PrintPage>}
      <PrintPage><ClosingPage q={q} /></PrintPage>
    </div>
  );
}
