import background from "../assets/loading.jpg";
import logo from "../assets/logo.png";
import frame from "../assets/progress-frame.png";
import type { PingResult } from "./ping";

function element<T extends HTMLElement>(id: string): T {
  const result = document.getElementById(id);
  if (!result) throw new Error(`Missing loading element: ${id}`);
  return result as T;
}

const status = element<HTMLParagraphElement>("status");
const latency = element<HTMLParagraphElement>("latency");
const retry = element<HTMLButtonElement>("retry");
const progress = element<HTMLProgressElement>("progress");
const fill = element<HTMLDivElement>("progress-fill");
let busy = false;
let timer: ReturnType<typeof setTimeout> | undefined;

function isPingResult(value: unknown): value is PingResult {
  if (typeof value !== "object" || value === null) return false;
  const result = value as Partial<PingResult>;
  return (
    result.target === "http-gateway" &&
    typeof result.online === "boolean" &&
    typeof result.checkedAt === "string" &&
    (result.latencyMs === null ||
      (typeof result.latencyMs === "number" &&
        Number.isFinite(result.latencyMs) &&
        result.latencyMs >= 0))
  );
}

async function ping() {
  if (busy) return;
  busy = true;
  clearTimeout(timer);
  retry.disabled = true;
  status.dataset.state = "checking";
  status.textContent = "Conectando ao servidor…";
  try {
    const response = await fetch("/api/ping", {
      cache: "no-store",
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) throw new Error("Ping unavailable");
    const result: unknown = await response.json();
    if (!isPingResult(result) || !result.online || result.latencyMs === null) {
      throw new Error("Gateway offline");
    }
    status.dataset.state = "online";
    status.textContent = "Servidor HTTP disponível";
    latency.textContent = `${result.latencyMs} ms · última verificação às ${new Date(result.checkedAt).toLocaleTimeString("pt-BR")}`;
    retry.textContent = "Verificar novamente";
  } catch {
    status.dataset.state = "offline";
    status.textContent = "Não foi possível conectar ao servidor";
    latency.textContent = "Uma nova tentativa será feita em 5 segundos";
    retry.textContent = "Tentar novamente";
  } finally {
    busy = false;
    retry.disabled = false;
    if (!document.hidden) timer = setTimeout(() => void ping(), 5_000);
  }
}

retry.addEventListener("click", () => void ping());
document.addEventListener("visibilitychange", () => {
  clearTimeout(timer);
  if (!document.hidden) void ping();
});

async function start() {
  const assets = [
    ["background", background],
    ["logo", logo],
    ["progress-frame", frame],
  ] as const;
  const loaded = await Promise.allSettled(
    assets.map(async ([id, src]) => {
      const image = element<HTMLImageElement>(id);
      image.src = src;
      await image.decode();
      progress.value += 1;
      fill.style.width = `${(progress.value / progress.max) * 100}%`;
    }),
  );
  if (loaded.some((asset) => asset.status === "rejected")) {
    document.body.dataset.assetError = "true";
    status.textContent = "Alguns recursos visuais não puderam ser carregados";
    latency.textContent = "Recarregue a página para tentar novamente";
    return;
  }
  await ping();
}

void start();
