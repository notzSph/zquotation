import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { createProposalPdf } from "./server/pdf.mjs";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "zquotation-pdf-export",
      configureServer(server) {
        server.middlewares.use("/api/pdf", async (request, response, next) => {
          console.log("[zquotation] /api/pdf", request.method);
          if (request.method !== "POST") return next();
          try {
            const chunks = [];
            for await (const chunk of request) chunks.push(Buffer.from(chunk));
            const q = JSON.parse(Buffer.concat(chunks).toString("utf8"));
            const buffer = await createProposalPdf(q);
            response.statusCode = 200;
            response.setHeader("Content-Type", "application/pdf");
            response.setHeader("Content-Length", buffer.length);
            response.end(buffer);
          } catch (cause) {
            console.error("[zquotation] PDF export failed", cause);
            response.statusCode = 500;
            response.end(cause instanceof Error ? cause.message : "PDF export failed");
          }
        });
      },
    },
  ],
});
