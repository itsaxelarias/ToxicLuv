import { AlertTriangle, ArrowLeft, ArrowRight, Check, ChevronRight, Heart, Image, Lock, Mail, MessageCircle, ShieldCheck, Sparkles, Upload, UserRound } from "lucide-react";
import { FormEvent, PointerEvent, useMemo, useState } from "react";

type Gender = "woman" | "man";
type Step = "register" | "modes" | "tree" | "chat" | "upload" | "image" | "result";
type Answer = { id: string; label: string; score: number; next?: string };
type Question = { text: string; detail: string; answers: Answer[] };
type Result = { level: "Bajo" | "Medio" | "Alto" | "Crítico"; title: string; description: string; actions: string[] };

const questions: Record<string, Question> = {
  start: { text: "¿Qué comportamiento te preocupa más ahora?", detail: "Elige el patrón que más se parece a lo que estás viviendo.", answers: [
    { id: "control", label: "Controla con quién hablo o qué hago", score: 3, next: "control" },
    { id: "blame", label: "Me culpa cuando intento hablar", score: 2, next: "repair" },
    { id: "avoid", label: "Evita conversar o siempre pone excusas", score: 1, next: "frequency" },
    { id: "normal", label: "Discutimos, pero también reparamos", score: 0, next: "repair" },
  ]},
  control: { text: "Cuando intenta controlar, ¿cómo suele pasar?", detail: "Esto ayuda a diferenciar inseguridad, control repetido o riesgo.", answers: [
    { id: "phone", label: "Revisa mi celular o pide contraseñas", score: 3, next: "fear" },
    { id: "friends", label: "Se molesta si salgo o hablo con amistades", score: 2, next: "frequency" },
    { id: "guilt", label: "Dice que si le amo debo obedecer", score: 3, next: "fear" },
    { id: "talk", label: "Lo hablamos y respeta mis límites", score: 0, next: "repair" },
  ]},
  frequency: { text: "¿Con qué frecuencia se repite?", detail: "La frecuencia cambia mucho el nivel de alerta.", answers: [
    { id: "daily", label: "Casi todos los días", score: 3, next: "fear" },
    { id: "weekly", label: "Varias veces por semana", score: 2, next: "repair" },
    { id: "sometimes", label: "A veces, en discusiones puntuales", score: 1, next: "repair" },
    { id: "rare", label: "Pasó una vez y se habló bien", score: 0, next: "repair" },
  ]},
  repair: { text: "Después del conflicto, ¿qué ocurre?", detail: "Una relación sana no evita todo conflicto; lo importante es reparar.", answers: [
    { id: "change", label: "Se disculpa y cambia conductas", score: 0, next: "fear" },
    { id: "repeat", label: "Promete cambiar, pero se repite igual", score: 2, next: "fear" },
    { id: "minimize", label: "Minimiza lo que siento", score: 2, next: "fear" },
    { id: "punish", label: "Me castiga con silencio, celos o culpa", score: 3, next: "fear" },
  ]},
  fear: { text: "¿Te has sentido con miedo o bajo presión?", detail: "Si hay miedo, amenazas o violencia, la prioridad siempre es tu seguridad.", answers: [
    { id: "threat", label: "Sí, hubo amenazas o agresión", score: 5 },
    { id: "afraid", label: "Sí, tengo miedo de su reacción", score: 4 },
    { id: "pressure", label: "A veces cedo para evitar problemas", score: 2 },
    { id: "safe", label: "No, me siento seguro/a al poner límites", score: 0 },
  ]},
};

const modes = [
  { id: "chat", title: "Conversación guiada", body: "Cuéntanos qué ocurre y recibe preguntas que ordenan tu historia.", icon: MessageCircle, step: "chat" as Step, tag: "Beta" },
  { id: "tree", title: "Mapa de patrones", body: "Un recorrido breve para identificar señales y su intensidad.", icon: Sparkles, step: "tree" as Step, tag: "Recomendado" },
  { id: "upload", title: "Importar conversación", body: "Analiza un chat exportado sin perder su contexto.", icon: Upload, step: "upload" as Step, tag: "Próximamente" },
  { id: "image", title: "Capturas de pantalla", body: "Detecta patrones en imágenes y conversaciones visuales.", icon: Image, step: "image" as Step, tag: "Próximamente" },
];

function getResult(score: number): Result {
  if (score >= 9) return { level: "Crítico", title: "Hay señales importantes de riesgo", description: "Aparecen patrones de miedo, amenaza, control o presión alta. La prioridad es tu seguridad y una red de apoyo fuera de la relación.", actions: ["Habla con alguien de confianza", "Evita confrontar si puede ponerte en riesgo", "Busca ayuda profesional o recursos locales"] };
  if (score >= 6) return { level: "Alto", title: "Hay patrones dañinos repetidos", description: "Tu recorrido muestra control, culpa, invalidación o poca reparación. Conviene observar hechos sostenidos, no solo promesas.", actions: ["Define límites concretos", "Observa si existen cambios reales", "Considera apoyo terapéutico"] };
  if (score >= 3) return { level: "Medio", title: "Hay señales que merecen atención", description: "No todo conflicto es una alerta grave, pero algunos patrones pueden desgastar la relación cuando se repiten.", actions: ["Hablen en un momento tranquilo", "Pide cambios específicos", "Vuelve a evaluar si se repite"] };
  return { level: "Bajo", title: "No aparecen alertas fuertes", description: "Se ven conflictos manejables o intentos de reparación. Aun así, vale la pena cuidar los límites y la comunicación.", actions: ["Mantén conversaciones honestas", "Revisen sus límites mutuos", "Construyan acuerdos claros"] };
}

function Brand() {
  return <div className="brand"><span className="brand-mark"><Heart size={17} fill="currentColor" /></span><strong>ToxicLuv</strong><span className="beta">BETA</span></div>;
}

export function App() {
  const [step, setStep] = useState<Step>("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState<Gender>("woman");
  const [questionId, setQuestionId] = useState("start");
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [story, setStory] = useState("");
  const currentQuestion = questions[questionId];
  const result = useMemo(() => getResult(score), [score]);

  function handleRegister(event: FormEvent) { event.preventDefault(); setStep("modes"); }
  function answerQuestion(answer: Answer) {
    setScore((value) => value + answer.score);
    setAnswers((value) => [...value, answer.label]);
    if (answer.next) setQuestionId(answer.next); else setStep("result");
  }
  function resetTree() { setScore(0); setAnswers([]); setQuestionId("start"); setStep("modes"); }
  function finishStory() {
    setScore(Math.min(10, Math.ceil(story.length / 80) + (story.toLowerCase().includes("miedo") ? 4 : 0)));
    setAnswers(story ? ["Relato libre analizado en modo beta"] : []);
    setStep("result");
  }
  function moveArtwork(event: PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${((event.clientX - bounds.left) / bounds.width - 0.5) * 2}`);
    event.currentTarget.style.setProperty("--my", `${((event.clientY - bounds.top) / bounds.height - 0.5) * 2}`);
  }

  return <main className={`app theme-${gender}`}>
    {step === "register" ? <div className="onboarding">
      <section className="visual-pane" onPointerMove={moveArtwork} onPointerLeave={(e) => { e.currentTarget.style.setProperty("--mx", "0"); e.currentTarget.style.setProperty("--my", "0"); }}>
        <img className="hero-art" src="/assets/toxicluv-clarity.png" alt="Dos formas de cristal conectadas por un haz de luz" />
        <div className="art-wash" />
        <div className="art-content"><Brand /><div className="hero-copy"><span className="overline"><span /> Bienestar emocional privado</span><h1>Mira tu relación<br />con <em>más claridad.</em></h1><p>Reconoce patrones, escucha tu intuición y toma decisiones desde un lugar más seguro.</p></div><div className="trust-row"><ShieldCheck size={19} /><span><strong>Tu historia es tuya</strong>Privacidad desde el primer momento</span></div></div>
      </section>
      <section className="auth-pane"><div className="mobile-brand"><Brand /></div><form className="auth-card" onSubmit={handleRegister}>
        <div className="auth-heading"><span className="step-number">01</span><div><span>Comienza aquí</span><h2>Crea tu espacio personal</h2><p>Solo tomará un momento.</p></div></div>
        <label>Nombre<span className="input-wrap"><UserRound size={18} /><input value={name} onChange={(e) => setName(e.target.value)} placeholder="¿Cómo quieres que te llamemos?" required /></span></label>
        <label>Correo electrónico<span className="input-wrap"><Mail size={18} /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" required /></span></label>
        <fieldset><legend>Personaliza tu experiencia</legend><div className="segmented"><button type="button" className={gender === "woman" ? "active" : ""} onClick={() => setGender("woman")}>Mujer</button><button type="button" className={gender === "man" ? "active" : ""} onClick={() => setGender("man")}>Hombre</button></div></fieldset>
        <button className="primary" type="submit"><span>Entrar a mi espacio</span><ArrowRight size={19} /></button><p className="legal"><Lock size={13} /> Tus datos permanecen en este dispositivo durante la beta.</p>
      </form></section>
    </div> : <div className="product-shell">
      <header className="topbar"><Brand /><div className="session"><span>{name.slice(0, 1).toUpperCase() || "T"}</span><div><strong>{name || "Tu espacio"}</strong><small>Sesión privada</small></div></div></header>
      <div className="workspace"><aside className="context-rail"><span className="rail-label">Tu recorrido</span><div className="progress-line"><span className={step === "modes" ? "active" : "done"}>1</span><div /><span className={step === "modes" ? "" : step === "result" ? "done" : "active"}>2</span><div /><span className={step === "result" ? "active" : ""}>3</span></div><div className="rail-copy"><span>Explora sin juicios</span><h3>Entender también es cuidarte.</h3><p>No buscamos etiquetar a una persona. Observamos conductas, frecuencia y cómo te hacen sentir.</p></div><div className="privacy-chip"><ShieldCheck size={17} /><span><strong>Espacio confidencial</strong>Tu información no se comparte</span></div></aside>
        <section className="content-pane">
          {step === "modes" && <><div className="page-heading"><span className="overline"><span /> Hola, {name || "qué gusto verte"}</span><h2>¿Cómo quieres empezar?</h2><p>Elige la forma que se sienta más cómoda para ti hoy.</p></div><div className="mode-grid">{modes.map((mode) => { const Icon = mode.icon; return <button className="mode-card" key={mode.id} onClick={() => setStep(mode.step)}><span className="mode-icon"><Icon size={23} /></span><span className="mode-tag">{mode.tag}</span><strong>{mode.title}</strong><p>{mode.body}</p><span className="mode-link">Comenzar <ChevronRight size={16} /></span></button>; })}</div></>}
          {step === "tree" && <><Back onClick={() => setStep("modes")} /><div className="question-layout"><div className="question-count"><strong>0{answers.length + 1}</strong><span>de 04</span></div><div className="question-card"><span className="overline"><span /> Observa el patrón</span><h2>{currentQuestion.text}</h2><p>{currentQuestion.detail}</p></div></div><div className="answers">{currentQuestion.answers.map((answer, index) => <button key={answer.id} onClick={() => answerQuestion(answer)}><span className="answer-letter">{String.fromCharCode(65 + index)}</span><strong>{answer.label}</strong><ChevronRight size={18} /></button>)}</div></>}
          {step === "chat" && <><Back onClick={() => setStep("modes")} /><div className="page-heading compact"><span className="overline"><span /> Conversación guiada</span><h2>Cuéntame qué está pasando</h2><p>Escribe como lo dirías a alguien de confianza. No necesitas ordenar todo primero.</p></div><div className="story-box"><textarea value={story} onChange={(e) => setStory(e.target.value)} placeholder="Por ejemplo: cuando intento poner límites, me culpa y después actúa como si nada..." /><span>{story.length} caracteres</span></div><button className="primary action-button" onClick={finishStory} disabled={story.trim().length < 20}>Analizar mi relato <ArrowRight size={18} /></button></>}
          {(step === "upload" || step === "image") && <><Back onClick={() => setStep("modes")} /><div className="empty-state"><span className="empty-icon">{step === "upload" ? <Upload size={30} /> : <Image size={30} />}</span><span className="overline"><span /> Próxima función</span><h2>{step === "upload" ? "Importar conversación" : "Analizar capturas"}</h2><p>Estamos preparando este análisis con el nivel de privacidad y precisión que merece.</p><button className="primary action-button" onClick={() => setStep("tree")}>Probar el mapa de patrones <ChevronRight size={18} /></button></div></>}
          {step === "result" && <div className="result-view"><span className={`result-badge result-${result.level.toLowerCase().replace("í", "i")}`}><AlertTriangle size={17} /> Nivel {result.level}</span><div className="result-score"><strong>{Math.min(10, score)}</strong><span>/ 10</span></div><h2>{result.title}</h2><p className="result-copy">{result.description}</p>{answers.length > 0 && <div className="summary"><span>Patrones que señalaste</span>{answers.map((answer) => <p key={answer}>{answer}</p>)}</div>}<div className="actions"><span>Próximos pasos</span>{result.actions.map((action) => <div key={action}><Check size={17} /><strong>{action}</strong></div>)}</div><button className="primary action-button" onClick={resetTree}>Hacer un nuevo análisis <ArrowRight size={18} /></button><p className="disclaimer">Esta orientación no sustituye una evaluación profesional.</p></div>}
        </section>
      </div>
    </div>}
  </main>;
}

function Back({ onClick }: { onClick: () => void }) {
  return <button className="ghost" onClick={onClick}><ArrowLeft size={17} /> Cambiar método</button>;
}
