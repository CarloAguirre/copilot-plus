import { useMemo } from "react";

const KEYWORDS_JS = [
  "import","from","export","default","const","let","var","function","return",
  "if","else","for","while","switch","case","break","continue","class","extends",
  "new","this","typeof","instanceof","async","await","try","catch","finally",
  "throw","null","undefined","true","false","of","in","as","interface","type",
];
const KEYWORDS_PY = [
  "import","from","def","return","if","elif","else","for","while","class",
  "try","except","finally","with","as","pass","break","continue","lambda",
  "True","False","None","and","or","not","in","is","yield","global","nonlocal",
];

function getKeywords(lang: string) {
  if (lang === "py") return KEYWORDS_PY;
  return KEYWORDS_JS;
}

type Token = { text: string; cls: string };

function tokenizeLine(line: string, lang: string): Token[] {
  if (lang === "md") return [{ text: line, cls: "text-[var(--ed-fg)]" }];
  if (lang === "json") return tokenizeJson(line);

  const kws = getKeywords(lang);
  const tokens: Token[] = [];
  // Regex captures: strings, comments, numbers, identifiers, punctuation
  const re =
    /(\/\/.*$|#.*$|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b\d+(?:\.\d+)?\b|\b[A-Za-z_$][\w$]*\b|[{}()[\];,.:<>=+\-*/%!?&|^~]+|\s+)/g;
  let m;
  while ((m = re.exec(line)) !== null) {
    const t = m[0];
    if (/^\s+$/.test(t)) tokens.push({ text: t, cls: "" });
    else if (/^(\/\/|#)/.test(t) || /^\/\*/.test(t))
      tokens.push({ text: t, cls: "text-[var(--ed-comment)] italic" });
    else if (/^["'`]/.test(t))
      tokens.push({ text: t, cls: "text-[var(--ed-string)]" });
    else if (/^\d/.test(t))
      tokens.push({ text: t, cls: "text-[var(--ed-number)]" });
    else if (/^[A-Za-z_$]/.test(t)) {
      if (kws.includes(t))
        tokens.push({ text: t, cls: "text-[var(--ed-keyword)]" });
      else if (/^[A-Z]/.test(t))
        tokens.push({ text: t, cls: "text-[var(--ed-type)]" });
      else tokens.push({ text: t, cls: "text-[var(--ed-ident)]" });
    } else tokens.push({ text: t, cls: "text-[var(--ed-punct)]" });
  }
  return tokens;
}

function tokenizeJson(line: string): Token[] {
  const tokens: Token[] = [];
  const re = /("(?:\\.|[^"\\])*")(\s*:)?|(\b\d+(?:\.\d+)?\b)|(\btrue\b|\bfalse\b|\bnull\b)|([{}\[\],])|(\s+)|(.)/g;
  let m;
  while ((m = re.exec(line)) !== null) {
    if (m[1])
      tokens.push({
        text: m[1] + (m[2] || ""),
        cls: m[2]
          ? "text-[var(--ed-key)]"
          : "text-[var(--ed-string)]",
      });
    else if (m[3]) tokens.push({ text: m[3], cls: "text-[var(--ed-number)]" });
    else if (m[4]) tokens.push({ text: m[4], cls: "text-[var(--ed-keyword)]" });
    else if (m[5]) tokens.push({ text: m[5], cls: "text-[var(--ed-punct)]" });
    else if (m[6]) tokens.push({ text: m[6], cls: "" });
    else if (m[7]) tokens.push({ text: m[7], cls: "" });
  }
  return tokens;
}

export function HighlightedCode({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  const lines = useMemo(() => code.split("\n"), [code]);
  return (
    <>
      {lines.map((line, i) => (
        <div key={i} className="whitespace-pre min-h-[1.5em]">
          {tokenizeLine(line, language).map((t, j) => (
            <span key={j} className={t.cls}>
              {t.text}
            </span>
          ))}
        </div>
      ))}
    </>
  );
}
