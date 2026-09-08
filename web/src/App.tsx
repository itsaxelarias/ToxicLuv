import {
  AlertTriangle,
  ArrowLeft,
  Check,
  ChevronRight,
  Heart,
  Image,
  Lock,
  Mail,
  MessageCircle,
  Shield,
  Sparkles,
  Upload,
  UserRound,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

type Gender = "woman" | "man";
type Step = "register" | "modes" | "tree" | "chat" | "upload" | "image" | "result";
type Answer = {
  id: string;
  label: string;
  score: number;
  next?: string;
};
type Question = {
  id: string;
  text: string;
  detail: string;
  answers: Answer[];
};
type Result = {
  level: "Bajo" | "Medio" | "Alto" | "Critico";
  title: string;
  description: string;
  actions: string[];
};

const questions: Record<string, Question> = {
  start: {
    id: "start",
    text: "Que comportamiento te preocupa mas ahora?",
    detail: "Elige el patron que mas se parece a lo que estas viviendo.",
    answers: [
      { id: "control", label: "Controla con quien hablo o que hago", score: 3, next: "control" },
      { id: "blame", label: "Me culpa cuando intento hablar", score: 2, next: "repair" },
      { id: "avoid", label: "Siempre evita conversar o pone excusas", score: 1, next: "frequency" },
      { id: "normal", label: "Discutimos, pero tambien reparamos", score: 0, next: "repair" },
    ],
  },
  control: {
    id: "control",
    text: "Cuando intenta controlar, como suele pasar?",
    detail: "Esto ayuda a diferenciar inseguridad, control repetido o riesgo.",
    answers: [
      { id: "phone", label: "Revisa mi celular o pide contrasenas", score: 3, next: "fear" },
      { id: "friends", label: "Se molesta si salgo o hablo con amistades", score: 2, next: "frequency" },
      { id: "guilt", label: "Dice que si lo/la amo debo obedecer", score: 3, next: "fear" },
      { id: "talk", label: "Lo hablamos y respeta mis limites", score: 0, next: "repair" },
    ],
  },
  frequency: {
    id: "frequency",
    text: "Con que frecuencia se repite?",
    detail: "La frecuencia cambia mucho el nivel de alerta.",
    answers: [
      { id: "daily", label: "Casi todos los dias", score: 3, next: "fear" },
      { id: "weekly", label: "Varias veces por semana", score: 2, next: "repair" },
      { id: "sometimes", label: "A veces, en discusiones puntuales", score: 1, next: "repair" },
      { id: "rare", label: "Paso una vez y se hablo bien", score: 0, next: "repair" },
    ],
  },
  repair: {
    id: "repair",
    text: "Despues del conflicto, que ocurre?",
    detail: "Una relacion sana no evita todo conflicto; lo importante es reparar.",
    answers: [
      { id: "change", label: "Se disculpa y cambia conductas", score: 0, next: "fear" },
      { id: "repeat", label: "Promete cambiar, pero se repite igual", score: 2, next: "fear" },
      { id: "minimize", label: "Minimiza lo que siento", score: 2, next: "fear" },
      { id: "punish", label: "Me castiga con silencio, celos o culpa", score: 3, next: "fear" },
    ],
  },
  fear: {
    id: "fear",
    text: "Te has sentido con miedo o presion para actuar contra ti?",
    detail: "Si hay miedo, amenazas o violencia, la prioridad es tu seguridad.",
    answers: [
      { id: "threat", label: "Si, hubo amenazas o agresion", score: 5 },
      { id: "afraid", label: "Si, tengo miedo de su reaccion", score: 4 },
      { id: "pressure", label: "A veces cedo para evitar problemas", score: 2 },
      { id: "safe", label: "No, me siento seguro/a al poner limites", score: 0 },
    ],
  },
};

const modes = [
  {
    id: "chat",
    title: "Chat en tiempo real",
    body: "Cuenta lo que pasa y recibe preguntas guia.",
    icon: MessageCircle,
    step: "chat" as Step,
  },
  {
    id: "tree",
    title: "Arbol de patrones",
    body: "Responde opciones rapidas y obten un primer mapa.",
    icon: Sparkles,
    step: "tree" as Step,
  },
  {
    id: "upload",
    title: "Chat exportado",
    body: "Prepara un archivo para analizar despues.",
    icon: Upload,
    step: "upload" as Step,
  },
  {
    id: "image",
    title: "Imagenes",
    body: "Sube capturas cuando activemos OCR.",
    icon: Image,
    step: "image" as Step,
  },
];

function getResult(score: number): Result {
  if (score >= 9) {
    return {
      level: "Critico",
      title: "Hay senales fuertes de riesgo",
      description:
        "Aparecen patrones de miedo, amenaza, control o presion alta. La prioridad es tu seguridad y apoyo externo.",
      actions: ["Habla con alguien de confianza", "Evita confrontar si te pone en riesgo", "Busca ayuda profesional o recursos locales"],
    };
  }

  if (score >= 6) {
    return {
      level: "Alto",
      title: "Se detectan patrones daninos repetidos",
      description:
        "El relato muestra control, culpa, invalidacion o falta de reparacion. Conviene tomar distancia emocional y mirar hechos, no promesas.",
      actions: ["Define limites concretos", "Observa si hay cambios reales", "Considera apoyo terapeutico"],
    };
  }

  if (score >= 3) {
    return {
      level: "Medio",
      title: "Hay senales que merecen atencion",
      description:
        "No todo conflicto es una alerta grave, pero algunos patrones pueden desgastar si se repiten.",
      actions: ["Conversen en un momento tranquilo", "Pide cambios especificos", "Vuelve a evaluar si se repite"],
    };
  }

  return {
    level: "Bajo",
    title: "No aparecen alertas fuertes en este recorrido",
    description:
      "Se ven conflictos manejables o intentos de reparacion. Igual vale cuidar limites y comunicacion.",
    actions: ["Mantener conversaciones honestas", "Revisar limites mutuos", "Buscar acuerdos claros"],
  };
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

  function handleRegister(event: FormEvent) {
    event.preventDefault();
    setStep("modes");
  }

  function answerQuestion(answer: Answer) {
    const nextScore = score + answer.score;
    setScore(nextScore);
    setAnswers((current) => [...current, answer.label]);

    if (answer.next) {
      setQuestionId(answer.next);
      return;
    }

    setStep("result");
  }

  function resetTree() {
    setScore(0);
    setAnswers([]);
    setQuestionId("start");
    setStep("modes");
  }

  function finishStory() {
    const storyScore = Math.min(10, Math.ceil(story.length / 80) + (story.toLowerCase().includes("miedo") ? 4 : 0));
    setScore(storyScore);
    setAnswers(story ? ["Relato libre analizado en modo beta"] : []);
    setStep("result");
  }

  return (
    <main className={`app theme-${gender}`}>
      <section className="shell">
        <div className="brand-row">
          <div className="logo">
            <Heart size={22} fill="currentColor" />
          </div>
          <div>
            <p>ToxicLuv</p>
            <span>Beta privada</span>
          </div>
        </div>

        {step === "register" && (
          <section className="panel intro-panel">
            <div className="hero-copy">
              <span className="eyebrow">claridad emocional</span>
              <h1>Entiende los patrones de tu relacion con calma.</h1>
              <p>
                Empieza con correo, elige tu estilo visual y prueba el primer arbol de analisis.
              </p>
            </div>

            <form className="form" onSubmit={handleRegister}>
              <label>
                Nombre
                <span className="input-wrap">
                  <UserRound size={18} />
                  <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Tu nombre" required />
                </span>
              </label>

              <label>
                Correo
                <span className="input-wrap">
                  <Mail size={18} />
                  <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="correo@ejemplo.com" required />
                </span>
              </label>

              <div className="segmented" aria-label="Selecciona genero">
                <button type="button" className={gender === "woman" ? "active" : ""} onClick={() => setGender("woman")}>
                  Mujer
                </button>
                <button type="button" className={gender === "man" ? "active" : ""} onClick={() => setGender("man")}>
                  Hombre
                </button>
              </div>

              <button className="primary" type="submit">
                Continuar
                <ChevronRight size={18} />
              </button>
            </form>
          </section>
        )}

        {step === "modes" && (
          <section className="panel">
            <div className="section-head">
              <div>
                <span className="eyebrow">hola {name || "ahi"}</span>
                <h2>Como quieres analizar?</h2>
              </div>
              <Shield size={24} />
            </div>

            <div className="mode-grid">
              {modes.map((mode) => {
                const Icon = mode.icon;
                return (
                  <button className="mode-card" key={mode.id} onClick={() => setStep(mode.step)}>
                    <Icon size={24} />
                    <strong>{mode.title}</strong>
                    <span>{mode.body}</span>
                    <ChevronRight size={18} />
                  </button>
                );
              })}
            </div>

            <p className="privacy-note">
              <Lock size={16} />
              Tus datos quedan solo en esta beta local hasta integrar backend seguro.
            </p>
          </section>
        )}

        {step === "tree" && (
          <section className="panel">
            <button className="ghost" onClick={() => setStep("modes")}>
              <ArrowLeft size={18} />
              Volver
            </button>

            <div className="question-card">
              <span className="step-pill">Pregunta {answers.length + 1}</span>
              <h2>{currentQuestion.text}</h2>
              <p>{currentQuestion.detail}</p>
            </div>

            <div className="answers">
              {currentQuestion.answers.map((answer) => (
                <button key={answer.id} onClick={() => answerQuestion(answer)}>
                  <span>{answer.label}</span>
                  <ChevronRight size={18} />
                </button>
              ))}
            </div>
          </section>
        )}

        {step === "chat" && (
          <section className="panel">
            <button className="ghost" onClick={() => setStep("modes")}>
              <ArrowLeft size={18} />
              Volver
            </button>
            <h2>Cuéntame que esta pasando</h2>
            <textarea value={story} onChange={(event) => setStory(event.target.value)} placeholder="Ejemplo: me culpa cuando pongo limites, evita hablar y luego actua como si nada..." />
            <button className="primary" onClick={finishStory} disabled={story.trim().length < 20}>
              Analizar relato
              <Check size={18} />
            </button>
          </section>
        )}

        {(step === "upload" || step === "image") && (
          <section className="panel">
            <button className="ghost" onClick={() => setStep("modes")}>
              <ArrowLeft size={18} />
              Volver
            </button>
            <div className="empty-state">
              {step === "upload" ? <Upload size={34} /> : <Image size={34} />}
              <h2>{step === "upload" ? "Chat exportado" : "Imagenes y capturas"}</h2>
              <p>Esta entrada queda lista para la siguiente fase. En esta beta ya puedes probar chat y arbol de patrones.</p>
              <button className="primary" onClick={() => setStep("tree")}>
                Probar arbol
                <ChevronRight size={18} />
              </button>
            </div>
          </section>
        )}

        {step === "result" && (
          <section className="panel">
            <div className={`result-badge result-${result.level.toLowerCase()}`}>
              <AlertTriangle size={22} />
              Alerta {result.level}
            </div>
            <h2>{result.title}</h2>
            <p className="result-copy">{result.description}</p>

            {answers.length > 0 && (
              <div className="summary">
                <span>Patrones marcados</span>
                {answers.map((answer) => (
                  <p key={answer}>{answer}</p>
                ))}
              </div>
            )}

            <div className="actions">
              {result.actions.map((action) => (
                <div key={action}>
                  <Check size={17} />
                  {action}
                </div>
              ))}
            </div>

            <button className="primary" onClick={resetTree}>
              Nuevo analisis
              <ChevronRight size={18} />
            </button>
          </section>
        )}
      </section>
    </main>
  );
}

