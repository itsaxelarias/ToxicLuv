import { chromium } from "playwright";

const baseUrl = process.env.TOXICLUV_URL ?? "http://127.0.0.1:5174";
const browser = await chromium.launch({ headless: true });

async function begin(page, name = "Alex") {
  await page.goto(baseUrl);
  await page.getByPlaceholder("¿Cómo quieres que te llamemos?").fill(name);
  await page.getByPlaceholder("tu@correo.com").fill(`${name.toLowerCase()}@example.com`);
  await page.getByRole("button", { name: "Entrar a mi espacio" }).click();
  await page.getByRole("button", { name: /Mapa de patrones/ }).click();
}

async function choose(page, answer) {
  await page.getByRole("button", { name: new RegExp(answer) }).click();
}

const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await begin(desktop, "Sana");
for (const answer of [
  "Quiero confirmar",
  "Hay honestidad",
  "lo vemos como algo normal",
  "Se alegra",
  "Hay cariño",
]) await choose(desktop, answer);
await desktop.getByText("Aparecen bases saludables").waitFor();
await desktop.screenshot({ path: "toxicluv-healthy-desktop.png", fullPage: true });

const ambiguous = await browser.newPage({ viewport: { width: 390, height: 844 } });
await begin(ambiguous, "Ambigua");
for (const answer of [
  "discusiones me desgastan",
  "Todo termina siendo mi culpa",
  "Pide perdón, pero pronto",
  "momentos puntuales",
  "Dudo de lo que recuerdo",
  "No siempre lo entiende",
  "Estamos distantes",
]) await choose(ambiguous, answer);
await ambiguous.getByText("Hay patrones que conviene observar").waitFor();
await ambiguous.screenshot({ path: "toxicluv-attention-mobile.png", fullPage: true });

const urgent = await browser.newPage({ viewport: { width: 390, height: 844 } });
await begin(urgent, "Urgente");
for (const answer of [
  "siento miedo",
  "temo su reacción",
  "Golpes, empujones",
]) await choose(urgent, answer);
await urgent.getByText("Tu seguridad merece atención inmediata").waitFor();
await urgent.getByRole("link", { name: /Llamar al 911/ }).waitFor();
await urgent.screenshot({ path: "toxicluv-urgent-mobile.png", fullPage: true });

console.log(JSON.stringify({
  healthy: "Fortalezas",
  ambiguous: "Atención",
  urgent: "Urgente",
  screenshots: ["toxicluv-healthy-desktop.png", "toxicluv-attention-mobile.png", "toxicluv-urgent-mobile.png"],
}, null, 2));

await browser.close();
