import type { Quote } from "../../quote";
import { PreviewHeader } from "../header/header";
import "../service/service.css"

export function ServicePages({ q }: { q: Quote }) {
  return (
    <>
      {q.services.map((service) => (
        <article className="servicePreviewPage" key={service.title}>
          <PreviewHeader q={q} className="servicePreviewTop" providerClassName="servicePreviewProvider" dateClassName="servicePreviewDate" />
          <h2 className="servicePreviewTitle">{service.title}</h2>
          <p className="servicePreviewIntro">{service.intro}</p>
          <div className="servicePreviewGrid">
            {service.items.map((item, index) => (
              <div
                className={`servicePreviewItem ${index === 1 || index === 2 ? "secondary" : "primary"}`}
                key={item.title}
              >
                <div className="servicePreviewNumber">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      ))}
    </>
  );
}
