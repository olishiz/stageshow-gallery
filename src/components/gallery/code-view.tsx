import { readFile } from "node:fs/promises";
import path from "node:path";
import { codeToHtml } from "shiki";
import { FileCode2 } from "lucide-react";
import { CopyCodeButton } from "./copy-code-button";

export async function CodeView({ slug }: { slug: string }) {
  const file = `${slug}.tsx`;
  const code = await readFile(path.join(process.cwd(), "src/components/showcase", file), "utf8");
  const html = await codeToHtml(code, {
    lang: "tsx",
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  });
  const lines = code.split("\n").length;

  return (
    <section aria-labelledby="code-heading" className="overflow-hidden rounded-3xl border border-border/70 bg-card">
      <div className="flex items-center gap-3 border-b border-border/70 px-4 py-2.5">
        <FileCode2 className="size-4 text-muted-foreground" aria-hidden />
        <h2 id="code-heading" className="font-mono text-sm">
          {file}
        </h2>
        <span className="hidden text-xs text-muted-foreground sm:inline">{lines} lines</span>
        <div className="ml-auto">
          <CopyCodeButton code={code} />
        </div>
      </div>
      <div
        tabIndex={0}
        role="region"
        aria-label={`Source of ${file}`}
        className="max-h-[560px] overflow-auto py-4 text-[13px]/6 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset [&_pre]:min-w-max [&_pre]:pr-6 [&_pre]:font-mono"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </section>
  );
}
