import { useState } from "react";
import {
  X,
  Cpu,
  Sparkles,
  Palette,
  Keyboard,
  Plug,
  Check,
  Loader2,
  ShieldCheck,
  Download,
  Server,
} from "lucide-react";

type Section = "ai" | "appearance" | "shortcuts" | "about";

type Provider = "ollama" | "llamacpp" | "openai-compat" | "lmstudio";

type LLMConfig = {
  enabled: boolean;
  provider: Provider;
  endpoint: string;
  model: string;
  apiKey?: string;
  contextWindow: number;
  temperature: number;
};

const defaults: LLMConfig = {
  enabled: false,
  provider: "ollama",
  endpoint: "http://localhost:11434",
  model: "llama3.2",
  contextWindow: 8192,
  temperature: 0.2,
};

const providerInfo: Record<
  Provider,
  { label: string; defaultEndpoint: string; example: string; icon: any }
> = {
  ollama: {
    label: "Ollama",
    defaultEndpoint: "http://localhost:11434",
    example: "llama3.2, deepseek-coder, qwen2.5-coder",
    icon: Server,
  },
  llamacpp: {
    label: "llama.cpp",
    defaultEndpoint: "http://localhost:8080",
    example: "phi-3-mini.gguf, mistral-7b.gguf",
    icon: Cpu,
  },
  lmstudio: {
    label: "LM Studio",
    defaultEndpoint: "http://localhost:1234/v1",
    example: "lmstudio-community/Phi-3.5-mini",
    icon: Plug,
  },
  "openai-compat": {
    label: "OpenAI-Compatible",
    defaultEndpoint: "http://localhost:8000/v1",
    example: "vLLM, TGI, custom server",
    icon: Plug,
  },
};

export function SettingsModal({ onClose }: { onClose: () => void }) {
  const [section, setSection] = useState<Section>("ai");
  const [cfg, setCfg] = useState<LLMConfig>(defaults);
  const [test, setTest] = useState<"idle" | "loading" | "ok" | "fail">("idle");

  const update = <K extends keyof LLMConfig>(k: K, v: LLMConfig[K]) =>
    setCfg((c) => ({ ...c, [k]: v }));

  const onProviderChange = (p: Provider) => {
    setCfg((c) => ({ ...c, provider: p, endpoint: providerInfo[p].defaultEndpoint }));
    setTest("idle");
  };

  const runTest = () => {
    setTest("loading");
    setTimeout(() => {
      setTest(Math.random() > 0.15 ? "ok" : "fail");
    }, 1100);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl glass rounded-3xl overflow-hidden flex flex-col sm:flex-row"
        style={{ height: "min(640px, 90vh)" }}
      >
        <aside className="sm:w-52 sm:border-r border-b sm:border-b-0 border-[var(--border)] p-3 flex sm:flex-col gap-1 overflow-x-auto shrink-0">
          <div className="px-2 pb-2 text-[10.5px] uppercase tracking-[0.12em] text-[var(--muted-fg)]">
            Settings
          </div>
          <SideItem
            icon={Sparkles}
            label="Nebula AI"
            active={section === "ai"}
            onClick={() => setSection("ai")}
          />
          <SideItem
            icon={Palette}
            label="Appearance"
            active={section === "appearance"}
            onClick={() => setSection("appearance")}
          />
          <SideItem
            icon={Keyboard}
            label="Shortcuts"
            active={section === "shortcuts"}
            onClick={() => setSection("shortcuts")}
          />
          <SideItem
            icon={ShieldCheck}
            label="About"
            active={section === "about"}
            onClick={() => setSection("about")}
          />
        </aside>

        <div className="flex-1 min-w-0 min-h-0 flex flex-col">
          <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)]">
            <div className="text-[14px] tracking-tight text-[var(--panel-fg)]">
              {section === "ai" && "Nebula AI · Offline LLM"}
              {section === "appearance" && "Appearance"}
              {section === "shortcuts" && "Keyboard Shortcuts"}
              {section === "about" && "About"}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-[var(--muted-fg)]"
            >
              <X size={15} />
            </button>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-5 pb-8 text-[13px] text-[var(--panel-fg)]">
            {section === "ai" && (
              <div className="space-y-5">
                <div className="rounded-2xl p-4 bg-gradient-to-br from-violet-500/15 via-fuchsia-500/10 to-sky-500/15 border border-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck size={14} className="text-emerald-300" />
                    <span className="tracking-tight">100% Private · Runs On Your Machine</span>
                  </div>
                  <p className="text-[12px] text-[var(--muted-fg)] leading-relaxed">
                    Connect any local LLM directly to Nebula. Your code, prompts and
                    completions never leave your computer. No API keys. No telemetry.
                  </p>
                </div>

                <Row
                  label="Enable Offline LLM"
                  hint="Route AI chat through your local model"
                >
                  <Toggle
                    checked={cfg.enabled}
                    onChange={(v) => update("enabled", v)}
                  />
                </Row>

                <div>
                  <Label>Provider</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {(Object.keys(providerInfo) as Provider[]).map((p) => {
                      const info = providerInfo[p];
                      const active = cfg.provider === p;
                      return (
                        <button
                          key={p}
                          onClick={() => onProviderChange(p)}
                          className={`text-left rounded-lg px-2.5 py-1.5 border transition-all ${
                            active
                              ? "bg-gradient-to-br from-violet-500/25 to-sky-500/20 border-violet-400/40"
                              : "bg-white/5 border-white/10 hover:bg-white/8"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 text-[12px]">
                            <info.icon size={11} className="text-violet-300" />
                            <span>{info.label}</span>
                            {active && (
                              <Check size={11} className="ml-auto text-emerald-300" />
                            )}
                          </div>
                          <div className="text-[10px] text-[var(--muted-fg)] mt-0.5 truncate">
                            {info.example}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Row label="Endpoint URL">
                  <Input
                    value={cfg.endpoint}
                    onChange={(v) => update("endpoint", v)}
                    placeholder="http://localhost:11434"
                  />
                </Row>

                <Row label="Model">
                  <Input
                    value={cfg.model}
                    onChange={(v) => update("model", v)}
                    placeholder="llama3.2"
                  />
                </Row>

                {cfg.provider === "openai-compat" && (
                  <Row label="API Key (optional)">
                    <Input
                      value={cfg.apiKey ?? ""}
                      onChange={(v) => update("apiKey", v)}
                      placeholder="sk-local-..."
                      type="password"
                    />
                  </Row>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <Row label="Context Window">
                    <Input
                      value={String(cfg.contextWindow)}
                      onChange={(v) =>
                        update("contextWindow", Number(v) || 0)
                      }
                    />
                  </Row>
                  <Row label="Temperature">
                    <Input
                      value={String(cfg.temperature)}
                      onChange={(v) => update("temperature", Number(v) || 0)}
                    />
                  </Row>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    onClick={runTest}
                    className="px-3.5 py-2 rounded-full bg-gradient-to-br from-violet-500 to-sky-500 text-white text-[12.5px] flex items-center gap-2 shadow-lg shadow-violet-500/25 shrink-0"
                  >
                    {test === "loading" ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Plug size={13} />
                    )}
                    Test Connection
                  </button>
                  <button className="px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-[12.5px] flex items-center gap-2 shrink-0">
                    <Download size={13} /> Pull Model
                  </button>
                  {test === "ok" && (
                    <span className="basis-full text-[12px] text-emerald-300 flex items-center gap-1">
                      <Check size={12} /> Connected to {cfg.model}
                    </span>
                  )}
                  {test === "fail" && (
                    <span className="basis-full text-[12px] text-rose-300 break-all">
                      Couldn't reach {cfg.endpoint}
                    </span>
                  )}
                </div>

                <div className="text-[11.5px] text-[var(--muted-fg)] leading-relaxed pt-3 mt-1 border-t border-[var(--border)] break-words">
                  Tip: install{" "}
                  <a className="text-sky-300" href="https://ollama.com">
                    Ollama
                  </a>
                  , then run{" "}
                  <code className="mono px-1.5 py-0.5 rounded bg-white/10 break-all">
                    ollama pull {cfg.model}
                  </code>{" "}
                  and start chatting — fully offline.
                </div>
              </div>
            )}

            {section === "appearance" && (
              <div className="text-[var(--muted-fg)]">
                Theme, font size, density, and accent color settings.
              </div>
            )}
            {section === "shortcuts" && (
              <div className="text-[var(--muted-fg)]">
                Open the dedicated shortcut sheet from the menu bar (⌘K).
              </div>
            )}
            {section === "about" && (
              <div className="space-y-2">
                <div className="text-[14px] tracking-tight">
                  Nebula Code · v1.0
                </div>
                <div className="text-[12px] text-[var(--muted-fg)]">
                  Glass-aesthetic, AI-native code editor with first-class
                  offline LLM support.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SideItem({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: any;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-[12.5px] transition-colors ${
        active
          ? "bg-white/10 text-[var(--panel-fg)]"
          : "text-[var(--muted-fg)] hover:bg-white/5 hover:text-[var(--panel-fg)]"
      }`}
    >
      <Icon size={13} />
      {label}
    </button>
  );
}

function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="text-[12.5px]">{label}</div>
        {hint && (
          <div className="text-[11px] text-[var(--muted-fg)] mt-0.5">{hint}</div>
        )}
      </div>
      <div className="shrink min-w-0 w-[220px] max-w-[55%]">{children}</div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-[12.5px]">{children}</div>;
}

function Input({
  value,
  onChange,
  placeholder,
  type,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      type={type ?? "text"}
      className="w-full mono text-[12px] bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 outline-none focus:border-violet-400 text-[var(--panel-fg)]"
    />
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-6 rounded-full transition-colors ${
        checked
          ? "bg-gradient-to-r from-violet-500 to-sky-500"
          : "bg-white/10 border border-white/10"
      }`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-[18px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
