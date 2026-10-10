import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  ExternalLink,
  Heart,
  Image,
  Lock,
  Mail,
  MessageCircle,
  Phone,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Upload,
  UserRound,
} from "lucide-react";
import { FormEvent, PointerEvent, useMemo, useState } from "react";
import {
  buildResult,
  calculateState,
  HistoryEntry,
  QUESTIONS,
  REFERENCES,
  shouldFinish,
  TOTAL_ANSWER_OPTIONS,
  TreeAnswer,
} from "./assessment";

type Gender = "woman" | "man";
type Step = "register" | "modes" | "tree" | "chat" | "upload" | "image" | "result";

const modes = [
  { id: "chat", title: "Conversación guiada", body: "Cuéntanos qué ocurre y recibe preguntas que ordenan tu historia.", icon: MessageCircle, step: "chat" as Step, tag: "Beta" },
  { id: "tree", title: "Mapa de patrones", body: "Un recorrido adaptativo con 100 posibles respuestas conectadas.", icon: Sparkles, step: "tree" as Step, tag: "Recomendado" },
  { id: "upload", title: "Importar conversación", body: "Analiza un chat exportado sin perder su contexto.", icon: Upload, step: "upload" as Step, tag: "Próximamente" },
  { id: "image", title: "Capturas de pantalla", body: "Detecta patrones en imágenes y conversaciones visuales.", icon: Image, step: "image" as Step, tag: "Próximamente" },
];

function Brand() {
  return <div className="brand"><span className="brand-mark"><Heart size={17} fill="currentColor" /></span><strong>ToxicLuv</strong><span className="beta">BETA</span></div>;
}

export function App() {
  const [step, setStep] = useState<Step>("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState<Gender>("woman");
  const [questionId, setQuestionId] = useState("start");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [story, setStory] = useState("");
  const currentQuestion = QUESTIONS[questionId];
  const assessmentState = useMemo(() => calculateState(history), [history]);
  const result = useMemo(() => buildResult(assessmentState.scores, assessmentState.flags), [assessmentState]);

  function handleRegister(event: FormEvent) {
    event.preventDefault();
    setStep("modes");
  }

  function answerQuestion(answer: TreeAnswer) {
    const nextHistory: HistoryEntry[] = [...history, {
      questionId,
      answerId: answer.id,
      label: answer.label,
      impact: answer.impact,
      flags: answer.flags ?? [],
    }];
    const nextState = calculateState(nextHistory);
    setHistory(nextHistory);

    if (shouldFinish(answer.next, nextState.scores, nextState.flags, nextHistory.length)) {
      setStep("result");
      return;
    }
    setQuestionId(answer.next!);
  }

  function previousQuestion() {
    const last = history[history.length - 1];
    if (!last) {
      setStep("modes");
      return;
    }
    setQuestionId(last.questionId);
    setHistory((current) => current.slice(0, -1));
  }

  function resetTree() {
    setHistory([]);
    setQuestionId("start");
    setStory("");
    setStep("modes");
  }

  function startTree() {
    setHistory([]);
    setQuestionId("start");
    setStep("tree");
  }

  function finishStory() {
    const normalized = story.toLowerCase();
    const urgentWords = ["miedo", "amenaza", "golpe", "obliga", "arma", "mata"];
    const controlWords = ["control", "celos", "contraseña", "ubicación", "permiso", "prohíbe"];
    const impact = urgentWords.some((word) => normalized.includes(word))
      ? { safety: 5, emotional: 2 }
      : controlWords.some((word) => normalized.includes(word))
        ? { control: 3, emotional: 2 }
        : { conflict: 2 };
    setHistory([{
      questionId: "story",
      answerId: "free-text",
      label: "Relato libre analizado en modo beta",
      impact,
      flags: normalized.includes("arma") || normalized.includes("mata") ? ["immediate_danger"] : [],
    }]);
    setStep("result");
  }

  function moveArtwork(event: PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${((event.clientX - bounds.left) / bounds.width - 0.5) * 2}`);
    event.currentTarget.style.setProperty("--my", `${((event.clientY - bounds.top) / bounds.height - 0.5) * 2}`);
  }

  return <main className={`app theme-${gender}`}>
    {step === "register" ? <div className="onboarding">
      <section className="visual-pane" onPointerMove={moveArtwork} onPointerLeave={(event) => { event.currentTarget.style.setProperty("--mx", "0"); event.currentTarget.style.setProperty("--my", "0"); }}>
        <img className="hero-art" src="/assets/toxicluv-clarity.png" alt="Dos formas de cristal conectadas por un haz de luz" />
        <div className="art-wash" />
        <div className="art-content">
          <Brand />
          <div className="hero-copy"><span className="overline"><span /> Bienestar emocional privado</span><h1>Mira tu relación<br />con <em>más claridad.</em></h1><p>Reconoce patrones, escucha tu intuición y toma decisiones desde un lugar más seguro.</p></div>
          <div className="trust-row"><ShieldCheck size={19} /><span><strong>Tu historia es tuya</strong>Privacidad desde el primer momento</span></div>
        </div>
      </section>
      <section className="auth-pane"><div className="mobile-brand"><Brand /></div><form className="auth-card" onSubmit={handleRegister}>
        <div className="auth-heading"><span className="step-number">01</span><div><span>Comienza aquí</span><h2>Crea tu espacio personal</h2><p>Solo tomará un momento.</p></div></div>
        <label>Nombre<span className="input-wrap"><UserRound size={18} /><input value={name} onChange={(event) => setName(event.target.value)} placeholder="¿Cómo quieres que te llamemos?" required /></span></label>
        <label>Correo electrónico<span className="input-wrap"><Mail size={18} /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="tu@correo.com" required /></span></label>
        <fieldset><legend>Personaliza tu experiencia</legend><div className="segmented"><button type="button" className={gender === "woman" ? "active" : ""} onClick={() => setGender("woman")}>Mujer</button><button type="button" className={gender === "man" ? "active" : ""} onClick={() => setGender("man")}>Hombre</button></div></fieldset>
        <button className="primary" type="submit"><span>Entrar a mi espacio</span><ArrowRight size={19} /></button>
        <p className="legal"><Lock size={13} /> Tus datos permanecen en este dispositivo durante la beta.</p>
      </form></section>
    </div> : <div className="product-shell">
      <header className="topbar"><Brand /><div className="session"><span>{name.slice(0, 1).toUpperCase() || "T"}</span><div><strong>{name || "Tu espacio"}</strong><small>Sesión privada</small></div></div></header>
      <div className="workspace">
        <aside className="context-rail">
          <span className="rail-label">Tu recorrido</span>
          <div className="progress-line"><span className={step === "modes" ? "active" : "done"}>1</span><div /><span className={step === "modes" ? "" : step === "result" ? "done" : "active"}>2</span><div /><span className={step === "result" ? "active" : ""}>3</span></div>
          <div className="rail-copy"><span>Explora sin juicios</span><h3>Entender también es cuidarte.</h3><p>No buscamos etiquetar a una persona. Observamos conductas, frecuencia y cómo te hacen sentir.</p></div>
          <div className="privacy-chip"><ShieldCheck size={17} /><span><strong>Espacio confidencial</strong>Tu información no se comparte</span></div>
        </aside>

        <section className="content-pane">
          {step === "modes" && <>
            <div className="page-heading"><span className="overline"><span /> Hola, {name || "qué gusto verte"}</span><h2>¿Cómo quieres empezar?</h2><p>Elige la forma que se sienta más cómoda para ti hoy.</p></div>
            <div className="mode-grid">{modes.map((mode) => {
              const Icon = mode.icon;
              return <button className="mode-card" key={mode.id} onClick={() => mode.step === "tree" ? startTree() : setStep(mode.step)}><span className="mode-icon"><Icon size={23} /></span><span className="mode-tag">{mode.tag}</span><strong>{mode.title}</strong><p>{mode.body}</p><span className="mode-link">Comenzar <ChevronRight size={16} /></span></button>;
            })}</div>
          </>}

          {step === "tree" && <>
            <div className="tree-toolbar">
              <button className="ghost" onClick={previousQuestion}><ArrowLeft size={17} /> {history.length ? "Respuesta anterior" : "Cambiar método"}</button>
              <span>{TOTAL_ANSWER_OPTIONS} rutas posibles</span>
            </div>
            <div className="adaptive-progress"><span style={{ width: `${Math.min(92, 12 + history.length * 11)}%` }} /></div>
            <div className="question-layout">
              <div className="question-count"><strong>{String(history.length + 1).padStart(2, "0")}</strong><span>recorrido adaptativo</span></div>
              <div className="question-card"><span className="overline"><span /> {currentQuestion.theme}</span><h2>{currentQuestion.text}</h2><p>{currentQuestion.detail}</p></div>
            </div>
            <div className="answers">{currentQuestion.answers.map((answer, index) => <button key={answer.id} onClick={() => answerQuestion(answer)}><span className="answer-letter">{String.fromCharCode(65 + index)}</span><strong>{answer.label}</strong><ChevronRight size={18} /></button>)}</div>
            <p className="adaptive-note"><Sparkles size={14} /> Las siguientes preguntas cambian según los patrones que marcas.</p>
          </>}

          {step === "chat" && <>
            <Back onClick={() => setStep("modes")} />
            <div className="page-heading compact"><span className="overline"><span /> Conversación guiada</span><h2>Cuéntame qué está pasando</h2><p>Escribe como lo dirías a alguien de confianza. No necesitas ordenar todo primero.</p></div>
            <div className="story-box"><textarea value={story} onChange={(event) => setStory(event.target.value)} placeholder="Por ejemplo: cuando intento poner límites, me culpa y después actúa como si nada..." /><span>{story.length} caracteres</span></div>
            <button className="primary action-button" onClick={finishStory} disabled={story.trim().length < 20}>Analizar mi relato <ArrowRight size={18} /></button>
          </>}

          {(step === "upload" || step === "image") && <>
            <Back onClick={() => setStep("modes")} />
            <div className="empty-state"><span className="empty-icon">{step === "upload" ? <Upload size={30} /> : <Image size={30} />}</span><span className="overline"><span /> Próxima función</span><h2>{step === "upload" ? "Importar conversación" : "Analizar capturas"}</h2><p>Estamos preparando este análisis con el nivel de privacidad y precisión que merece.</p><button className="primary action-button" onClick={startTree}>Probar el mapa de patrones <ChevronRight size={18} /></button></div>
          </>}

          {step === "result" && <ResultView result={result} history={history} onReset={resetTree} />}
        </section>
      </div>
    </div>}
  </main>;
}

function ResultView({ result, history, onReset }: { result: ReturnType<typeof buildResult>; history: HistoryEntry[]; onReset: () => void }) {
  const references = REFERENCES.filter((reference) => result.sourceIds.includes(reference.id));
  return <div className={`result-view result-view-${result.level.toLowerCase()}`}>
    <span className={`result-badge result-${result.level.toLowerCase()}`}><AlertTriangle size={17} /> {result.level}</span>
    <div className="result-score"><strong>{result.score}</strong><span>/ 10</span></div>
    <h2>{result.title}</h2>
    <p className="result-copy">{result.description}</p>

    {result.urgent && <div className="urgent-help">
      <div><Phone size={21} /><span><strong>¿Hay peligro ahora?</strong>Llama al 911 desde un lugar seguro.</span></div>
      <a href="tel:911">Llamar al 911 <ArrowRight size={17} /></a>
    </div>}

    <div className="pattern-grid">
      {result.patterns.map((pattern) => <div className={`pattern-item pattern-${pattern.tone}`} key={pattern.key}><span>{pattern.label}</span><strong>{pattern.tone === "positive" ? "Fortaleza presente" : pattern.value >= 5 ? "Señal marcada" : "Conviene observar"}</strong><p>{pattern.description}</p></div>)}
    </div>

    <div className="actions"><span>Próximos pasos</span>{result.actions.map((action) => <div key={action}><Check size={17} /><strong>{action}</strong></div>)}</div>

    <details className="journey-summary"><summary>Ver las {history.length} respuestas de este recorrido</summary><div>{history.map((entry, index) => <p key={`${entry.questionId}-${index}`}><span>{String(index + 1).padStart(2, "0")}</span>{entry.label}</p>)}</div></details>

    <section className="references"><div className="reference-heading"><BookOpen size={19} /><div><strong>En qué se basa esta orientación</strong><span>Fuentes y lecturas relacionadas con tus respuestas</span></div></div><div className="reference-list">{references.map((reference) => reference.url ? <a href={reference.url} target="_blank" rel="noreferrer" key={reference.id}><span>{reference.kind}</span><strong>{reference.title}</strong><small>{reference.author}</small><ExternalLink size={15} /></a> : <div key={reference.id}><span>{reference.kind}</span><strong>{reference.title}</strong><small>{reference.author}</small></div>)}</div></section>

    <button className="primary action-button" onClick={onReset}><RotateCcw size={18} /> Hacer un nuevo análisis</button>
    <p className="disclaimer">ToxicLuv ofrece orientación educativa, no un diagnóstico ni una evaluación profesional. Si algo te hace sentir en peligro, confía en esa señal y busca apoyo.</p>
  </div>;
}

function Back({ onClick }: { onClick: () => void }) {
  return <button className="ghost" onClick={onClick}><ArrowLeft size={17} /> Cambiar método</button>;
}
