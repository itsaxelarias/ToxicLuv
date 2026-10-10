export type Dimension =
  | "safety"
  | "control"
  | "isolation"
  | "digital"
  | "financial"
  | "sexual"
  | "emotional"
  | "conflict"
  | "autonomy"
  | "repair"
  | "trust"
  | "healthy";

export type RiskFlag = "immediate_danger" | "physical_violence" | "sexual_coercion" | "threats" | "stalking";
export type Scores = Record<Dimension, number>;
export type Impact = Partial<Record<Dimension, number>>;

export type TreeAnswer = {
  id: string;
  label: string;
  impact: Impact;
  next?: string;
  flags?: RiskFlag[];
};

export type TreeQuestion = {
  id: string;
  theme: string;
  text: string;
  detail: string;
  answers: TreeAnswer[];
};

export type HistoryEntry = {
  questionId: string;
  answerId: string;
  label: string;
  impact: Impact;
  flags: RiskFlag[];
};

export type AssessmentLevel = "Fortalezas" | "Atención" | "Alto" | "Urgente";

export type Pattern = {
  key: Dimension;
  label: string;
  description: string;
  value: number;
  tone: "positive" | "watch" | "risk";
};

export type AssessmentResult = {
  level: AssessmentLevel;
  score: number;
  title: string;
  description: string;
  actions: string[];
  patterns: Pattern[];
  sourceIds: string[];
  urgent: boolean;
};

export type Reference = {
  id: string;
  title: string;
  author: string;
  note: string;
  url?: string;
  kind: "Guía" | "Investigación" | "Libro" | "Ayuda";
};

export const EMPTY_SCORES: Scores = {
  safety: 0,
  control: 0,
  isolation: 0,
  digital: 0,
  financial: 0,
  sexual: 0,
  emotional: 0,
  conflict: 0,
  autonomy: 0,
  repair: 0,
  trust: 0,
  healthy: 0,
};

export const DIMENSION_COPY: Record<Dimension, { label: string; description: string }> = {
  safety: { label: "Seguridad", description: "Miedo, amenazas o agresión." },
  control: { label: "Control", description: "Intentos de decidir, vigilar o imponer." },
  isolation: { label: "Aislamiento", description: "Distancia forzada de amistades o familia." },
  digital: { label: "Privacidad digital", description: "Acceso, vigilancia o presión mediante dispositivos." },
  financial: { label: "Autonomía económica", description: "Control de dinero, trabajo o recursos." },
  sexual: { label: "Consentimiento", description: "Respeto a decisiones sexuales y corporales." },
  emotional: { label: "Trato emocional", description: "Humillación, culpa, desprecio o invalidación." },
  conflict: { label: "Manejo del conflicto", description: "Cómo se habla y se regula una discusión." },
  autonomy: { label: "Autonomía", description: "Libertad para decidir, expresarte y poner límites." },
  repair: { label: "Reparación", description: "Capacidad de reconocer daño y cambiar conductas." },
  trust: { label: "Desconfianza", description: "Acusaciones, pruebas constantes o vigilancia." },
  healthy: { label: "Fortalezas", description: "Respeto, reciprocidad y apoyo presentes." },
};

export const REFERENCES: Reference[] = [
  {
    id: "who-ipv",
    title: "Preventing intimate partner and sexual violence",
    author: "Organización Mundial de la Salud",
    note: "Indicadores de violencia física, sexual, emocional y conductas de control.",
    url: "https://iris.who.int/bitstream/handle/10665/44350/9789241564007_eng.pdf?sequence=1",
    kind: "Guía",
  },
  {
    id: "power-control",
    title: "Power and Control Wheel",
    author: "National Domestic Violence Hotline / Duluth Model",
    note: "Marco para reconocer patrones continuos de poder, intimidación, aislamiento y control.",
    url: "https://www.thehotline.org/identify-abuse/power-and-control/",
    kind: "Guía",
  },
  {
    id: "relationship-spectrum",
    title: "Relationship Spectrum",
    author: "Love is Respect",
    note: "Diferencia conductas saludables, no saludables y abusivas sin reducirlas a una sola etiqueta.",
    url: "https://www.loveisrespect.org/everyone-deserves-a-healthy-relationship/relationship-spectrum/",
    kind: "Guía",
  },
  {
    id: "gottman-repair",
    title: "Repair attempts and the Four Horsemen",
    author: "The Gottman Institute",
    note: "Crítica, desprecio, defensividad, evasión y la importancia de reparar después del conflicto.",
    url: "https://www.gottman.com/blog/r-is-for-repair/",
    kind: "Investigación",
  },
  {
    id: "seven-principles",
    title: "The Seven Principles for Making Marriage Work",
    author: "John Gottman y Nan Silver",
    note: "Referencia para amistad, influencia mutua, conflicto y reparación en relaciones sanas.",
    kind: "Libro",
  },
  {
    id: "why-does-he-do-that",
    title: "Why Does He Do That?",
    author: "Lundy Bancroft",
    note: "Referencia sobre patrones de control coercitivo y responsabilidad por la conducta abusiva.",
    kind: "Libro",
  },
  {
    id: "hold-me-tight",
    title: "Hold Me Tight",
    author: "Sue Johnson",
    note: "Referencia sobre seguridad emocional, apego y conversaciones de conexión.",
    kind: "Libro",
  },
  {
    id: "ecuador-help",
    title: "Ayuda y denuncia en Ecuador",
    author: "Fiscalía General del Estado",
    note: "En peligro: 911 o 1800 DELITO (335486). También existe denuncia en línea.",
    url: "https://www.fiscalia.gob.ec/denuncia-en-linea-de-violencia-basada-en-genero/",
    kind: "Ayuda",
  },
];

export const QUESTIONS: Record<string, TreeQuestion> = {
  start: {
    id: "start",
    theme: "Punto de partida",
    text: "¿Qué te hizo querer mirar tu relación con más atención?",
    detail: "Elige lo más cercano. El recorrido se adaptará a tu respuesta.",
    answers: [
      { id: "control", label: "Siento que controla o vigila partes de mi vida", impact: { control: 2 }, next: "control_entry" },
      { id: "conflict", label: "Nuestras discusiones me desgastan o confunden", impact: { conflict: 1 }, next: "conflict_style" },
      { id: "fear", label: "A veces siento miedo, presión o no puedo decir que no", impact: { safety: 3 }, next: "safety_check" },
      { id: "healthy", label: "Quiero confirmar si lo que vivimos es saludable", impact: { healthy: 1 }, next: "trust" },
    ],
  },
  control_entry: {
    id: "control_entry",
    theme: "Control",
    text: "¿Dónde notas más ese control?",
    detail: "El control puede aparecer de maneras distintas, incluso sin gritos.",
    answers: [
      { id: "phone", label: "En mi celular, redes, ubicación o contraseñas", impact: { digital: 2, control: 1 }, next: "digital_privacy" },
      { id: "people", label: "En las personas con quienes hablo o paso tiempo", impact: { isolation: 2, control: 1 }, next: "isolation" },
      { id: "money", label: "En mi dinero, estudios o trabajo", impact: { financial: 2, control: 1 }, next: "financial_control" },
      { id: "choices", label: "En cómo visto, salgo o tomo decisiones", impact: { autonomy: 2, control: 1 }, next: "autonomy" },
    ],
  },
  digital_privacy: {
    id: "digital_privacy",
    theme: "Privacidad digital",
    text: "¿Qué ocurre con tu celular o tus cuentas?",
    detail: "Compartir algo por elección no es lo mismo que tener que demostrar inocencia.",
    answers: [
      { id: "respects_no", label: "Puede preguntar, pero acepta cuando digo que no", impact: { healthy: 2 }, next: "boundaries" },
      { id: "passwords", label: "Insiste en tener mis contraseñas o revisar conversaciones", impact: { digital: 3, control: 2 }, next: "frequency" },
      { id: "secret_access", label: "Ha entrado sin permiso o instalado formas de vigilarme", impact: { digital: 4, control: 3, safety: 1 }, flags: ["stalking"], next: "safety_check" },
      { id: "mutual_choice", label: "La transparencia es voluntaria y la privacidad se respeta", impact: { healthy: 3 }, next: "individuality" },
    ],
  },
  isolation: {
    id: "isolation",
    theme: "Red de apoyo",
    text: "¿Cómo reacciona cuando compartes tiempo con otras personas?",
    detail: "Una relación sana permite conservar vínculos propios.",
    answers: [
      { id: "supports", label: "Lo apoya aunque a veces extrañe pasar tiempo conmigo", impact: { healthy: 3 }, next: "individuality" },
      { id: "complains", label: "Se molesta o hace comentarios para que me sienta culpable", impact: { isolation: 2, emotional: 1 }, next: "frequency" },
      { id: "forbids", label: "Me prohíbe verles o genera peleas cada vez que lo intento", impact: { isolation: 4, control: 3 }, next: "safety_check" },
      { id: "lost_contacts", label: "He dejado de ver a casi todos para evitar problemas", impact: { isolation: 4, safety: 1 }, next: "impact" },
    ],
  },
  financial_control: {
    id: "financial_control",
    theme: "Autonomía económica",
    text: "¿Qué nivel de libertad tienes con dinero, estudio o trabajo?",
    detail: "Los acuerdos económicos saludables son conversados y recíprocos.",
    answers: [
      { id: "agreements", label: "Tenemos acuerdos claros y ambos podemos decidir", impact: { healthy: 3 }, next: "decisions" },
      { id: "questions", label: "Debo explicar cada gasto aunque la regla no sea igual para ambos", impact: { financial: 2, control: 1 }, next: "frequency" },
      { id: "withholds", label: "Me quita dinero, genera deudas o limita acceso a recursos", impact: { financial: 4, control: 3 }, next: "impact" },
      { id: "blocks_work", label: "Ha intentado impedir que estudie, trabaje o progrese", impact: { financial: 4, isolation: 2, control: 2 }, next: "safety_check" },
    ],
  },
  autonomy: {
    id: "autonomy",
    theme: "Autonomía",
    text: "Cuando tomas una decisión personal, ¿qué suele pasar?",
    detail: "Una pareja puede opinar sin convertir su opinión en una orden.",
    answers: [
      { id: "respects", label: "Podemos discrepar y aun así respeta mi decisión", impact: { healthy: 2, autonomy: 0 }, next: "decisions" },
      { id: "coldness", label: "Se distancia o castiga hasta que cambio de opinión", impact: { autonomy: 2, emotional: 2 }, next: "frequency" },
      { id: "commands", label: "Decide por mí y espera que pida permiso", impact: { autonomy: 4, control: 3 }, next: "impact" },
      { id: "afraid_choice", label: "Evito decidir por miedo a cómo reaccionará", impact: { autonomy: 4, safety: 3 }, next: "safety_check" },
    ],
  },
  conflict_style: {
    id: "conflict_style",
    theme: "Conflicto",
    text: "Cuando intentas hablar de un problema, ¿qué patrón aparece más?",
    detail: "Tener conflictos es normal; importa cómo se atraviesan.",
    answers: [
      { id: "contempt", label: "Sarcasmo, insultos, burlas o desprecio", impact: { emotional: 3, conflict: 2 }, next: "contempt" },
      { id: "blame", label: "Todo termina siendo mi culpa", impact: { emotional: 2, conflict: 2 }, next: "blame" },
      { id: "shutdown", label: "Se cierra, desaparece o deja de hablar por mucho tiempo", impact: { conflict: 2, repair: 1 }, next: "stonewalling" },
      { id: "listen", label: "Nos alteramos, pero podemos pausar y escucharnos", impact: { healthy: 2, repair: 1 }, next: "repair" },
    ],
  },
  contempt: {
    id: "contempt",
    theme: "Trato emocional",
    text: "¿Cómo te deja ese trato?",
    detail: "La crítica a una conducta no es lo mismo que atacar el valor de una persona.",
    answers: [
      { id: "specific", label: "Fue puntual, lo reconoció y no volvió a repetirse", impact: { conflict: 1, healthy: 1 }, next: "accountability" },
      { id: "small", label: "Me siento pequeño/a o dudo de mi propio criterio", impact: { emotional: 3 }, next: "impact" },
      { id: "public", label: "También me humilla frente a otras personas", impact: { emotional: 4, isolation: 1 }, next: "frequency" },
      { id: "threatening", label: "Los insultos vienen con amenazas o rompe cosas", impact: { emotional: 4, safety: 4 }, flags: ["threats"], next: "safety_check" },
    ],
  },
  blame: {
    id: "blame",
    theme: "Responsabilidad",
    text: "¿Puede reconocer su parte en lo ocurrido?",
    detail: "Responsabilizarse incluye escuchar el impacto y cambiar, no solo pedir perdón.",
    answers: [
      { id: "owns", label: "Sí, ambos podemos reconocer errores sin atacarnos", impact: { healthy: 2, repair: 1 }, next: "repair" },
      { id: "apology_only", label: "Pide perdón, pero pronto ocurre exactamente lo mismo", impact: { repair: 2, emotional: 1 }, next: "frequency" },
      { id: "reverses", label: "Termino disculpándome yo por haber mencionado el problema", impact: { emotional: 3, control: 1 }, next: "impact" },
      { id: "justifies_harm", label: "Dice que sus gritos o agresiones son culpa mía", impact: { emotional: 4, safety: 3 }, next: "safety_check" },
    ],
  },
  stonewalling: {
    id: "stonewalling",
    theme: "Distancia",
    text: "¿La pausa sirve para calmarse o para castigarte?",
    detail: "Una pausa saludable incluye avisar y retomar la conversación.",
    answers: [
      { id: "returns", label: "Acordamos un tiempo y luego retomamos con más calma", impact: { healthy: 2, repair: 1 }, next: "repair" },
      { id: "unclear", label: "No sé cuándo volveremos a hablar y quedo en incertidumbre", impact: { conflict: 2, repair: 1 }, next: "impact" },
      { id: "punishment", label: "Me ignora para castigarme o lograr que ceda", impact: { emotional: 3, control: 2 }, next: "frequency" },
      { id: "abandons", label: "Desaparece durante días y vuelve como si nada", impact: { emotional: 2, repair: 3 }, next: "accountability" },
    ],
  },
  repair: {
    id: "repair",
    theme: "Reparación",
    text: "Después de una discusión, ¿cómo intentan reparar?",
    detail: "Reparar significa bajar la tensión, comprender y actuar distinto.",
    answers: [
      { id: "mutual", label: "Ambos escuchamos, asumimos una parte y buscamos una solución", impact: { healthy: 3, repair: 0 }, next: "support" },
      { id: "one_sided", label: "Casi siempre soy yo quien busca arreglar las cosas", impact: { repair: 2, conflict: 1 }, next: "accountability" },
      { id: "gifts", label: "Hay cariño o regalos, pero no hablamos de lo que pasó", impact: { repair: 2 }, next: "frequency" },
      { id: "no_repair", label: "No hay reparación; solo esperamos hasta que se pase", impact: { repair: 3, conflict: 1 }, next: "impact" },
    ],
  },
  accountability: {
    id: "accountability",
    theme: "Cambio real",
    text: "Cuando promete cambiar, ¿qué muestran los hechos?",
    detail: "El cambio sostenible se observa en conductas, no únicamente en palabras.",
    answers: [
      { id: "sustained", label: "Hay cambios concretos que se mantienen con el tiempo", impact: { healthy: 2, repair: 0 }, next: "trust" },
      { id: "short", label: "Cambia unos días y luego vuelve el mismo patrón", impact: { repair: 3 }, next: "frequency" },
      { id: "excuses", label: "Da explicaciones, pero evita asumir responsabilidad", impact: { repair: 2, emotional: 1 }, next: "impact" },
      { id: "retaliates", label: "Se enfurece o me castiga por pedir un cambio", impact: { safety: 2, control: 2, repair: 3 }, next: "safety_check" },
    ],
  },
  frequency: {
    id: "frequency",
    theme: "Frecuencia",
    text: "¿Con qué frecuencia ocurre este patrón?",
    detail: "La repetición y la escalada ayudan a diferenciar un error de un patrón.",
    answers: [
      { id: "once", label: "Ocurrió una vez, se habló y no se repitió", impact: { healthy: 1 }, next: "accountability" },
      { id: "occasional", label: "Ocurre en momentos puntuales de tensión", impact: { conflict: 1 }, next: "impact" },
      { id: "weekly", label: "Se repite varias veces al mes o por semana", impact: { emotional: 2, control: 1 }, next: "impact" },
      { id: "escalating", label: "Cada vez ocurre más o se está volviendo más intenso", impact: { safety: 3, control: 2 }, next: "safety_check" },
    ],
  },
  impact: {
    id: "impact",
    theme: "Impacto",
    text: "¿Cómo ha cambiado tu forma de estar en la relación?",
    detail: "Tu experiencia importa, aunque la otra persona minimice lo ocurrido.",
    answers: [
      { id: "safe_self", label: "Puedo ser yo y expresar desacuerdo con seguridad", impact: { healthy: 3 }, next: "boundaries" },
      { id: "careful", label: "Mido mucho mis palabras para evitar una reacción", impact: { safety: 2, emotional: 2 }, next: "safety_check" },
      { id: "doubt", label: "Dudo de lo que recuerdo, siento o considero razonable", impact: { emotional: 3, autonomy: 1 }, next: "support" },
      { id: "changed_life", label: "He cambiado amistades, ropa, trabajo o planes para evitar conflictos", impact: { control: 3, isolation: 2, autonomy: 2 }, next: "safety_check" },
    ],
  },
  boundaries: {
    id: "boundaries",
    theme: "Límites",
    text: "¿Qué pasa cuando estableces un límite claro?",
    detail: "Un límite no necesita gustarle a la otra persona para ser respetado.",
    answers: [
      { id: "respected", label: "Lo escucha y lo respeta, aunque necesitemos conversar", impact: { healthy: 3 }, next: "consent" },
      { id: "negotiates", label: "Insiste bastante, pero finalmente lo acepta", impact: { autonomy: 1 }, next: "consent" },
      { id: "guilt", label: "Me acusa de no amarle o me hace sentir culpable", impact: { emotional: 2, autonomy: 2 }, next: "frequency" },
      { id: "retaliation", label: "Amenaza, castiga o cruza el límite de todos modos", impact: { safety: 4, control: 3, autonomy: 3 }, flags: ["threats"], next: "safety_check" },
    ],
  },
  consent: {
    id: "consent",
    theme: "Consentimiento",
    text: "En la intimidad, ¿puedes cambiar de opinión o decir que no?",
    detail: "El consentimiento debe ser libre, reversible y respetado cada vez.",
    answers: [
      { id: "free", label: "Sí, puedo decirlo y se respeta sin reproches", impact: { healthy: 4 }, next: "decisions" },
      { id: "sulks", label: "Lo respeta, pero después se muestra frío/a o molesto/a", impact: { sexual: 1, emotional: 1 }, next: "impact" },
      { id: "pressure", label: "Insiste, manipula o cedo para que deje de presionar", impact: { sexual: 4, safety: 2 }, flags: ["sexual_coercion"], next: "safety_check" },
      { id: "forced", label: "Ha continuado o me ha obligado después de que dije que no", impact: { sexual: 6, safety: 6 }, flags: ["sexual_coercion", "immediate_danger"] },
    ],
  },
  decisions: {
    id: "decisions",
    theme: "Equidad",
    text: "¿Cómo toman decisiones que afectan a ambos?",
    detail: "La equidad no exige pensar igual; sí que ambas voces tengan peso.",
    answers: [
      { id: "shared", label: "Buscamos un acuerdo y ambos podemos influir", impact: { healthy: 4 }, next: "support" },
      { id: "roles", label: "Cada uno decide ciertas cosas y nos funciona a ambos", impact: { healthy: 2 }, next: "support" },
      { id: "one_decides", label: "Su preferencia casi siempre termina imponiéndose", impact: { control: 2, autonomy: 2 }, next: "impact" },
      { id: "permission", label: "Necesito permiso para decisiones personales", impact: { control: 4, autonomy: 4 }, next: "safety_check" },
    ],
  },
  trust: {
    id: "trust",
    theme: "Confianza",
    text: "¿Cómo se vive la confianza entre ustedes?",
    detail: "Confiar no significa renunciar a la privacidad o demostrar inocencia constantemente.",
    answers: [
      { id: "secure", label: "Hay honestidad y también espacio privado", impact: { healthy: 4 }, next: "individuality" },
      { id: "questions", label: "Hay inseguridad, pero podemos hablarla sin acusaciones", impact: { conflict: 1, healthy: 1 }, next: "repair" },
      { id: "accusations", label: "Hay acusaciones frecuentes de engaño sin evidencia", impact: { trust: 2, emotional: 2, control: 1 }, next: "jealousy" },
      { id: "proof", label: "Debo enviar fotos, ubicación o pruebas de dónde estoy", impact: { digital: 3, control: 3, trust: 2 }, next: "digital_privacy" },
    ],
  },
  jealousy: {
    id: "jealousy",
    theme: "Celos",
    text: "¿Qué hace con sus celos o inseguridad?",
    detail: "Sentir celos puede ocurrir; usarlos para controlar es otra cosa.",
    answers: [
      { id: "owns_feeling", label: "Reconoce que es una emoción propia y la comunica", impact: { healthy: 2, repair: 0 }, next: "boundaries" },
      { id: "reassurance", label: "Necesita mucha tranquilidad, pero no limita mis acciones", impact: { conflict: 1 }, next: "support" },
      { id: "interrogates", label: "Me interroga, acusa o revisa para calmarse", impact: { control: 2, digital: 2, emotional: 1 }, next: "frequency" },
      { id: "punishes", label: "Me impide salir o me amenaza por hablar con alguien", impact: { control: 4, isolation: 3, safety: 3 }, next: "safety_check" },
    ],
  },
  support: {
    id: "support",
    theme: "Apoyo",
    text: "¿Cómo responde a tus metas, emociones y logros?",
    detail: "El apoyo saludable no exige que reduzcas tu brillo para proteger el ego de alguien.",
    answers: [
      { id: "celebrates", label: "Se alegra, se interesa y también puedo apoyarle", impact: { healthy: 4 }, next: "affection" },
      { id: "neutral", label: "No siempre lo entiende, pero intenta escuchar", impact: { healthy: 1 }, next: "affection" },
      { id: "minimizes", label: "Minimiza lo que siento o compite con mis logros", impact: { emotional: 2 }, next: "impact" },
      { id: "sabotages", label: "Sabotea oportunidades o crea crisis cuando avanzo", impact: { control: 3, financial: 2, emotional: 2 }, next: "safety_check" },
    ],
  },
  individuality: {
    id: "individuality",
    theme: "Vida propia",
    text: "¿Pueden tener intereses y tiempo por separado?",
    detail: "La cercanía y la individualidad pueden coexistir.",
    answers: [
      { id: "enjoy", label: "Sí, lo vemos como algo normal y valioso", impact: { healthy: 4 }, next: "support" },
      { id: "learning", label: "Nos cuesta un poco, pero lo conversamos", impact: { healthy: 1, conflict: 1 }, next: "boundaries" },
      { id: "guilt", label: "Hay culpa o discusiones cuando hago algo sin la pareja", impact: { isolation: 2, autonomy: 1 }, next: "frequency" },
      { id: "none", label: "Prácticamente no tengo actividades o vínculos propios", impact: { isolation: 3, autonomy: 2 }, next: "impact" },
    ],
  },
  affection: {
    id: "affection",
    theme: "Conexión",
    text: "En los momentos cotidianos, ¿cómo se siente el vínculo?",
    detail: "No se trata de estar bien siempre, sino de que exista respeto y seguridad de base.",
    answers: [
      { id: "warm", label: "Hay cariño, interés, humor y respeto con frecuencia", impact: { healthy: 5 } },
      { id: "distant", label: "Estamos distantes, pero podemos hablarlo sin hacernos daño", impact: { conflict: 1, healthy: 1 } },
      { id: "conditional", label: "El cariño aparece solo cuando hago lo que espera", impact: { control: 2, emotional: 2 } },
      { id: "cycle", label: "Tras hacerme daño hay una etapa muy intensa de cariño y promesas", impact: { repair: 2, safety: 2 }, next: "frequency" },
    ],
  },
  safety_check: {
    id: "safety_check",
    theme: "Seguridad",
    text: "Ahora mismo, ¿temes que pueda hacerte daño o tomar represalias?",
    detail: "Puedes responder pensando en daño físico, sexual, económico, digital o hacia alguien que quieres.",
    answers: [
      { id: "no", label: "No; puedo poner límites sin temer por mi seguridad", impact: { healthy: 1 }, next: "impact" },
      { id: "uncertain", label: "No estoy seguro/a, pero cambio mi conducta para evitar reacciones", impact: { safety: 3, control: 2 }, next: "escalation" },
      { id: "yes", label: "Sí, temo su reacción o lo que pueda hacer", impact: { safety: 5 }, flags: ["threats"], next: "immediate_danger" },
      { id: "now", label: "Sí, estoy en peligro en este momento", impact: { safety: 8 }, flags: ["immediate_danger"] },
    ],
  },
  escalation: {
    id: "escalation",
    theme: "Escalada",
    text: "¿Has notado que las conductas están aumentando?",
    detail: "La escalada puede ser más frecuencia, más intensidad o nuevas formas de control.",
    answers: [
      { id: "stable_low", label: "No; fue puntual y hubo un cambio sostenido", impact: { healthy: 1 }, next: "accountability" },
      { id: "same", label: "Se repite de forma parecida", impact: { safety: 1, repair: 2 }, next: "impact" },
      { id: "worse", label: "Sí, cada vez hay más control, miedo o humillación", impact: { safety: 4, control: 2 }, flags: ["threats"], next: "immediate_danger" },
      { id: "after_breakup", label: "Empeoró cuando intenté alejarme o terminar", impact: { safety: 5, control: 3 }, flags: ["stalking", "threats"], next: "immediate_danger" },
    ],
  },
  immediate_danger: {
    id: "immediate_danger",
    theme: "Riesgo inmediato",
    text: "¿Ha ocurrido alguna de estas situaciones?",
    detail: "No necesitas esperar a que vuelva a pasar para buscar apoyo.",
    answers: [
      { id: "physical", label: "Golpes, empujones, estrangulamiento o uso de objetos para herir", impact: { safety: 8 }, flags: ["physical_violence", "immediate_danger"] },
      { id: "weapon", label: "Amenazas de muerte, armas o daño a personas/animales", impact: { safety: 8 }, flags: ["threats", "immediate_danger"] },
      { id: "forced_sex", label: "Contacto sexual forzado o por miedo a su reacción", impact: { sexual: 7, safety: 7 }, flags: ["sexual_coercion", "immediate_danger"] },
      { id: "none", label: "Ninguna, pero igualmente siento miedo o presión", impact: { safety: 4, control: 2 } },
    ],
  },
};

export function addImpact(scores: Scores, impact: Impact): Scores {
  const next = { ...scores };
  for (const [key, value] of Object.entries(impact) as [Dimension, number][]) next[key] += value;
  return next;
}

export function calculateState(history: HistoryEntry[]) {
  let scores = { ...EMPTY_SCORES };
  const flags = new Set<RiskFlag>();
  for (const entry of history) {
    scores = addImpact(scores, entry.impact);
    entry.flags.forEach((flag) => flags.add(flag));
  }
  return { scores, flags };
}

export function shouldFinish(nextQuestion: string | undefined, scores: Scores, flags: Set<RiskFlag>, answerCount: number) {
  if (flags.has("immediate_danger")) return true;
  if (!nextQuestion) return true;
  if (answerCount >= 10) return true;
  const severe = scores.safety * 2 + scores.sexual * 2 + scores.control + scores.isolation;
  if (answerCount >= 4 && severe >= 18) return true;
  const risk = riskTotal(scores);
  if (answerCount >= 7 && (risk >= 18 || (scores.healthy >= 9 && risk <= 7))) return true;
  return false;
}

function riskTotal(scores: Scores) {
  return scores.safety * 1.8 + scores.sexual * 1.7 + scores.control * 1.25 + scores.isolation * 1.2 + scores.financial * 1.1 + scores.digital + scores.emotional + scores.autonomy + scores.repair * 0.8 + scores.conflict * 0.65 + scores.trust * 0.6;
}

export function buildResult(scores: Scores, flags: Set<RiskFlag>): AssessmentResult {
  const urgent = flags.has("immediate_danger") || scores.safety >= 8 || scores.sexual >= 7;
  const rawRisk = riskTotal(scores);
  const score = Math.max(0, Math.min(10, Math.round(rawRisk / 4.2 - scores.healthy * 0.18)));
  let level: AssessmentLevel;
  if (urgent) level = "Urgente";
  else if (score >= 7 || scores.control + scores.isolation >= 10) level = "Alto";
  else if (score >= 3 || scores.emotional + scores.conflict + scores.repair >= 7) level = "Atención";
  else level = "Fortalezas";

  const copy: Record<AssessmentLevel, Pick<AssessmentResult, "title" | "description" | "actions">> = {
    Fortalezas: {
      title: "Aparecen bases saludables",
      description: "Tus respuestas muestran respeto, autonomía y capacidad de reparar. Esto no significa perfección: las fortalezas se cuidan con conversaciones y acuerdos continuos.",
      actions: ["Mantengan espacio para hablar con honestidad", "Protejan la autonomía de ambos", "Sigan reparando después de los conflictos"],
    },
    Atención: {
      title: "Hay patrones que conviene observar",
      description: "Aparecen dinámicas que pueden desgastar la relación si se repiten. Mira cambios sostenidos, reciprocidad y respeto a tus límites, no solo intenciones.",
      actions: ["Nombra una conducta concreta y su impacto", "Define qué límite necesitas", "Observa si existe un cambio estable y voluntario"],
    },
    Alto: {
      title: "Se repiten señales de control o daño",
      description: "Tus respuestas muestran una combinación relevante de control, aislamiento, invalidación o falta de reparación. No necesitas resolver esto sin apoyo.",
      actions: ["Cuéntaselo a una persona de confianza", "Registra patrones solo si hacerlo es seguro", "Busca orientación profesional individual"],
    },
    Urgente: {
      title: "Tu seguridad merece atención inmediata",
      description: "Aparecen señales de miedo, coerción, amenazas o violencia. Nada de esto es tu culpa. Prioriza ponerte a salvo y pedir ayuda desde un dispositivo seguro.",
      actions: ["Si hay peligro inmediato en Ecuador, llama al 911", "También puedes llamar al 1800 DELITO (335486)", "Evita confrontar o avisar tus planes si eso aumenta el riesgo"],
    },
  };

  const riskDimensions = (Object.keys(DIMENSION_COPY) as Dimension[])
    .filter((key) => !["healthy"].includes(key) && scores[key] > 0)
    .sort((a, b) => scores[b] - scores[a]);
  const patterns: Pattern[] = riskDimensions.slice(0, 3).map((key) => ({
    key,
    ...DIMENSION_COPY[key],
    value: scores[key],
    tone: scores[key] >= 5 ? "risk" : "watch",
  }));
  if (scores.healthy >= 3) patterns.push({ key: "healthy", ...DIMENSION_COPY.healthy, value: scores.healthy, tone: "positive" });

  const sourceIds = new Set<string>(["relationship-spectrum"]);
  if (scores.control || scores.isolation || scores.financial || scores.digital) sourceIds.add("power-control");
  if (scores.safety || scores.sexual || urgent) sourceIds.add("who-ipv");
  if (scores.conflict || scores.repair || scores.emotional) sourceIds.add("gottman-repair");
  if (level === "Fortalezas") sourceIds.add("seven-principles");
  if (urgent || level === "Alto") sourceIds.add("ecuador-help");

  return { level, score: urgent ? Math.max(score, 9) : score, ...copy[level], patterns, sourceIds: [...sourceIds], urgent };
}

export const TOTAL_ANSWER_OPTIONS = Object.values(QUESTIONS).reduce((total, question) => total + question.answers.length, 0);
