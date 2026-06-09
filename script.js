const ACTIVE_SLOT = 1;
const MAX_PACTS = 3;
const STARTING_HAND = 3;
const DECK_SIZE = 15;
const MAX_MANA = 10;
const BOT_DELAY = 520;
const CLICK_DELAY = 180;

const ICON_ASSETS = {
  vida: "assets/icons/vida.jpeg",
  mana: "assets/icons/mana.jpeg",
  loucura: "assets/icons/abismo.jpeg",
  ataque: "assets/icons/ataque.jpeg",
  vida_pacto: "assets/icons/vida_pacto.jpeg",
  deck: "assets/icons/deck.jpeg"
};

const TYPE_LABELS = {
  hero: "Herói",
  pact: "Pacto",
  primordial: "Pacto Primordial",
  realm: "Reino",
  spell: "Magia",
  equipment: "Equipamento",
  event: "Evento"
};

const ELEMENT_LABELS = {
  fire: "Fogo",
  water: "Água",
  neutral: "Neutro"
};

const THEME_CLASSES = ["theme-fire", "theme-water"];
const ELEMENT_CLASSES = ["element-fire", "element-water", "element-neutral"];

let nextCardId = 1;
let clickTimer = null;

function withFallbacks(primary, fallbacks = []) {
  return [primary, ...fallbacks].filter(Boolean);
}

const CARD_DEFS = {
  cinzamor: {
    key: "cinzamor",
    name: "Cinzamor",
    type: "pact",
    element: "fire",
    image: "assets/pacts/fire/cinzamor.jpeg",
    imageFallbacks: ["assets/pacts/fire/cinzamor.png", "cards/fire/cinzamor.jpeg", "cards/fire/cinzamor.png"],
    health: 12,
    attack: 5,
    passiveName: "Fúria Ardente",
    passive: "Enquanto ativo recebe +1 Ataque.",
    abilities: [
      { name: "Mordida Incandescente", cost: { mana: 2 }, text: "Cause 3 de dano.", action: "damage3", target: "enemyAny" },
      { name: "Explosão de Brasas", cost: { mana: 4 }, text: "Cause 2 de dano.", action: "damage2", target: "enemyAny" },
      { name: "Fornalha Interior", cost: { madness: 2 }, text: "Recebe +3 Ataque neste turno.", action: "selfAttack3" }
    ]
  },
  varkhan: {
    key: "varkhan",
    name: "Varkhan",
    type: "pact",
    element: "fire",
    image: "assets/pacts/fire/varkhan.jpeg",
    imageFallbacks: ["assets/pacts/fire/varkhan.png", "cards/fire/varkhan.jpeg", "cards/fire/varkhan.png"],
    health: 18,
    attack: 3,
    passiveName: "Couraça Vulcânica",
    passive: "Recebe 1 dano a menos.",
    abilities: [
      { name: "Muralha de Lava", cost: { mana: 2 }, text: "Recebe +4 Vida temporária.", action: "selfTempHealth4" },
      { name: "Terra Escaldante", cost: { mana: 5 }, text: "Cause 2 de dano a todos os Pactos inimigos.", action: "enemyPactsDamage2" },
      { name: "Provocação Ancestral", cost: { mana: 1 }, text: "Todos os ataques devem atingir Varkhan até o próximo turno.", action: "taunt" }
    ]
  },
  ignivar: {
    key: "ignivar",
    name: "Ignivar",
    type: "pact",
    element: "fire",
    image: "assets/pacts/fire/ignivar.jpeg",
    imageFallbacks: ["assets/pacts/fire/ignivar.png", "cards/fire/ignivar.jpeg", "cards/fire/ignivar.png"],
    health: 14,
    attack: 4,
    passiveName: "Chama Compartilhada",
    passive: "Pacto Ativo recebe +1 Ataque.",
    abilities: [
      { name: "Transferência de Brasas", cost: { mana: 2 }, text: "Aliado recebe +2 Ataque.", action: "allyAttack2", target: "allyPact" },
      { name: "Ritual das Cinzas", cost: { mana: 3 }, text: "Compre 1 carta.", action: "draw1" },
      { name: "Sacrifício Flamejante", cost: { blood: 2 }, text: "Cause 5 de dano.", action: "damage5", target: "enemyAny" }
    ]
  },
  thalora: {
    key: "thalora",
    name: "Thalora",
    type: "pact",
    element: "water",
    image: "assets/pacts/water/thalora.png",
    imageFallbacks: ["assets/pacts/water/thalora.jpeg", "cards/water/thalora.png", "cards/water/thalora.jpeg"],
    health: 11,
    attack: 5,
    passiveName: "Correntes Marinhas",
    passive: "Enquanto ativo recebe +1 Ataque.",
    abilities: [
      { name: "Investida Abissal", cost: { mana: 2 }, text: "Cause 3 de dano.", action: "damage3", target: "enemyAny" },
      { name: "Maremoto Repentino", cost: { mana: 4 }, text: "Cause 2 de dano a todos os Pactos inimigos.", action: "enemyPactsDamage2" },
      { name: "Cauda Oceânica", cost: { madness: 2 }, text: "Recebe +3 Ataque neste turno.", action: "selfAttack3" }
    ]
  },
  lysora: {
    key: "lysora",
    name: "Lysora",
    type: "pact",
    element: "water",
    image: "assets/pacts/water/lysora.jpeg",
    imageFallbacks: ["assets/pacts/water/lysora.png", "cards/water/lysora.jpeg", "cards/water/lysora.png"],
    health: 18,
    attack: 3,
    passiveName: "Armadura Coralina",
    passive: "Recebe 1 dano a menos.",
    abilities: [
      { name: "Muralha de Conchas", cost: { mana: 2 }, text: "Recebe +4 Vida temporária.", action: "selfTempHealth4" },
      { name: "Recifes Cortantes", cost: { mana: 5 }, text: "Cause 2 de dano a todos os Pactos inimigos.", action: "enemyPactsDamage2" },
      { name: "Proteção das Marés", cost: { mana: 1 }, text: "Todos os ataques devem atingir Lysora até o próximo turno.", action: "taunt" }
    ]
  },
  nauren: {
    key: "nauren",
    name: "Nauren",
    type: "pact",
    element: "water",
    image: "assets/pacts/water/nauren.jpeg",
    imageFallbacks: ["assets/pacts/water/nauren.png", "cards/water/nauren.jpeg", "cards/water/nauren.png"],
    health: 14,
    attack: 4,
    passiveName: "Canção da Maré",
    passive: "Pacto Ativo recebe +1 Ataque.",
    abilities: [
      { name: "Benção Oceânica", cost: { mana: 2 }, text: "Aliado recebe +2 Ataque.", action: "allyAttack2", target: "allyPact" },
      { name: "Voz das Profundezas", cost: { mana: 3 }, text: "Compre 1 carta.", action: "draw1" },
      { name: "Cura das Águas Eternas", cost: { blood: 2 }, text: "Cure 5 de Vida de um aliado.", action: "heal5", target: "allyPact" }
    ]
  },
  fornalhaEterna: {
    key: "fornalhaEterna",
    name: "Fornalha Eterna",
    type: "realm",
    element: "fire",
    cost: 3,
    image: "assets/realms/fornalha_eterna.jpeg",
    imageFallbacks: ["assets/realms/fornalha_eterna.png", "cards/realms/fornalha_eterna.jpeg", "cards/realms/fornalha_eterna.png"],
    permanent: [
      "Pactos de Fogo recebem +1 Ataque.",
      "Sempre que um Pacto de Fogo destruir um Pacto inimigo, recupere 1 Mana."
    ],
    enter: "Cause 1 de dano a todos os Pactos inimigos.",
    effect: "Pactos de Fogo recebem +1 Ataque. Ao entrar, causa 1 de dano a todos os Pactos inimigos.",
    action: "realmFornalha"
  },
  tronoVulcanico: {
    key: "tronoVulcanico",
    name: "Trono Vulcânico",
    type: "realm",
    element: "fire",
    cost: 3,
    image: "assets/realms/trono_vulcanico.jpeg",
    imageFallbacks: ["assets/realms/trono_vulcanico.png", "cards/realms/trono_vulcanico.jpeg"],
    permanent: [
      "A primeira habilidade de Fogo usada a cada turno custa 1 Mana a menos.",
      "Pactos de Fogo recebem +2 Vida."
    ],
    enter: "Escolha um Pacto aliado. Ele recebe +2 Ataque neste turno.",
    effect: "Reduz a primeira habilidade de Fogo em 1 Mana e fortalece Pactos de Fogo.",
    action: "realmTrono",
    target: "allyPactOptional"
  },
  mareProfunda: {
    key: "mareProfunda",
    name: "Maré Profunda",
    type: "realm",
    element: "water",
    cost: 3,
    image: "assets/realms/mare_profunda.jpeg",
    imageFallbacks: ["assets/realms/mare_profunda.png", "cards/realms/mare_profunda.jpeg", "cards/realms/mare_profunda.png"],
    permanent: [
      "Pactos de Água recebem +2 Vida.",
      "Sempre que você curar um aliado, compre 1 carta. Limite de 1 vez por turno."
    ],
    enter: "Cure 3 de Vida de um Pacto aliado.",
    effect: "Pactos de Água recebem +2 Vida. Ao entrar, cura um Pacto aliado.",
    action: "realmMare",
    target: "allyPactOptional"
  },
  abismoSilencioso: {
    key: "abismoSilencioso",
    name: "Abismo Silencioso",
    type: "realm",
    element: "water",
    cost: 3,
    image: "assets/realms/abismo_silencioso.jpeg",
    imageFallbacks: ["assets/realms/abismo_silencioso.png", "cards/realms/abismo_silencioso.jpeg"],
    permanent: [
      "A primeira habilidade de Água usada a cada turno custa 1 Mana a menos.",
      "Pactos inimigos recebem -1 Ataque."
    ],
    enter: "Escolha um Pacto inimigo. Ele não pode usar habilidades até o próximo turno do controlador.",
    effect: "Reduz a primeira habilidade de Água em 1 Mana e enfraquece Pactos inimigos.",
    action: "realmAbismo",
    target: "enemyPactOptional"
  },
  reiChamas: {
    key: "reiChamas",
    name: "O Trono da Sétima Chama",
    type: "primordial",
    element: "fire",
    cost: 10,
    attack: 10,
    health: 16,
    exclusive: "Kael Drakar",
    image: "assets/primordials/o_trono_da_setima_chama.jpeg",
    imageFallbacks: ["assets/primordials/o_trono_da_setima_chama.png", "cards/primordials/o_trono_da_setima_chama.jpeg", "cards/primordials/rei_das_chamas.png"],
    effect: "Ao ser invocado, cause 3 de dano a todos os Pactos inimigos.",
    abilities: [
      { name: "Chamas Devoradoras", text: "Sempre que destruir um Pacto inimigo, recebe +1 Ataque permanentemente." },
      { name: "Julgamento Ardente", text: "Uma vez por turno, cause 2 de dano a qualquer alvo.", action: "primordialDamage2", target: "enemyAny" }
    ]
  },
  tronoAbissal: {
    key: "tronoAbissal",
    name: "O Trono Abissal",
    type: "primordial",
    element: "water",
    cost: 10,
    attack: 8,
    health: 20,
    exclusive: "Nereia Val'Kora",
    image: "assets/primordials/o_trono_abissal.jpeg",
    imageFallbacks: ["assets/primordials/o_trono_abissal.png", "cards/primordials/o_trono_abissal.jpeg", "cards/primordials/mae_das_profundezas.png"],
    effect: "Ao ser invocado, congele um Pacto inimigo até o próximo turno.",
    abilities: [
      { name: "Marés Eternas", text: "Enquanto permanecer em campo, Pactos de Água aliados recebem +2 Vida." },
      { name: "Canção das Profundezas", text: "Uma vez por turno, cure 2 de Vida do seu Herói.", action: "primordialHealHero2" }
    ]
  },
  chuvaBrasas: {
    key: "chuvaBrasas",
    name: "Chuva de Brasas",
    type: "spell",
    element: "fire",
    cost: 2,
    image: "assets/spells/fire/chuva_de_brasas.png",
    imageFallbacks: ["assets/spells/fire/chuva_de_brasas.jpeg", "cards/spells/fire/chuva_de_brasas.png"],
    effect: "Cause 2 de dano a um alvo inimigo.",
    action: "spellDamage2",
    target: "enemyAny"
  },
  furiaVulcanica: {
    key: "furiaVulcanica",
    name: "Fúria Vulcânica",
    type: "spell",
    element: "fire",
    cost: 3,
    image: "assets/spells/fire/furia_vulcanica.png",
    imageFallbacks: ["assets/spells/fire/furia_vulcanica.jpeg", "cards/spells/fire/furia_vulcanica.png"],
    effect: "Um Pacto aliado recebe +3 Ataque neste turno.",
    action: "spellAllyAttack3",
    target: "allyPact"
  },
  ritualSetimaChama: {
    key: "ritualSetimaChama",
    name: "Ritual da Sétima Chama",
    type: "spell",
    element: "fire",
    cost: 4,
    image: "assets/spells/fire/ritual_da_setima_chama.png",
    imageFallbacks: ["assets/spells/fire/ritual_da_setima_chama.jpeg", "cards/spells/fire/ritual_da_setima_chama.png"],
    effect: "Compre 2 cartas e ganhe 1 Loucura.",
    action: "draw2Madness1"
  },
  fornalhaInsaciavel: {
    key: "fornalhaInsaciavel",
    name: "Fornalha Insaciável",
    type: "spell",
    element: "fire",
    cost: 4,
    image: "assets/spells/fire/fornalha_insaciavel.png",
    imageFallbacks: ["assets/spells/fire/fornalha_insaciavel.jpeg", "cards/spells/fire/fornalha_insaciavel.png"],
    effect: "Destrua um Pacto aliado. Receba 3 Mana.",
    action: "destroyAllyGainMana3",
    target: "allyPact"
  },
  apocalipseCarmesim: {
    key: "apocalipseCarmesim",
    name: "Apocalipse Carmesim",
    type: "spell",
    element: "fire",
    cost: 6,
    image: "assets/spells/fire/apocalipse_carmesim.png",
    imageFallbacks: ["assets/spells/fire/apocalipse_carmesim.jpeg", "cards/spells/fire/apocalipse_carmesim.png"],
    effect: "Cause 3 de dano a todos os Pactos inimigos.",
    action: "enemyPactsDamage3"
  },
  mareRestauradora: {
    key: "mareRestauradora",
    name: "Maré Restauradora",
    type: "spell",
    element: "water",
    cost: 2,
    image: "assets/spells/water/mare_restauradora.png",
    imageFallbacks: ["assets/spells/water/mare_restauradora.jpeg", "cards/spells/water/mare_restauradora.png"],
    effect: "Cure 3 de Vida de um Pacto aliado.",
    action: "spellHeal3",
    target: "allyPact"
  },
  correnteRetorno: {
    key: "correnteRetorno",
    name: "Corrente de Retorno",
    type: "spell",
    element: "water",
    cost: 3,
    image: "assets/spells/water/corrente_de_retorno.png",
    imageFallbacks: ["assets/spells/water/corrente_de_retorno.jpeg", "cards/spells/water/corrente_de_retorno.png"],
    effect: "Congele um Pacto inimigo até o próximo turno do controlador.",
    action: "freezeEnemy",
    target: "enemyPact"
  },
  cancaoAbissal: {
    key: "cancaoAbissal",
    name: "Canção Abissal",
    type: "spell",
    element: "water",
    cost: 3,
    image: "assets/spells/water/cancao_abissal.png",
    imageFallbacks: ["assets/spells/water/cancao_abissal.jpeg", "cards/spells/water/cancao_abissal.png"],
    effect: "Compre 2 cartas.",
    action: "draw2"
  },
  escudoMares: {
    key: "escudoMares",
    name: "Escudo das Marés",
    type: "spell",
    element: "water",
    cost: 4,
    image: "assets/spells/water/escudo_das_mares.png",
    imageFallbacks: ["assets/spells/water/escudo_das_mares.jpeg", "cards/spells/water/escudo_das_mares.png"],
    effect: "Um Pacto aliado recebe +3 Vida temporária.",
    action: "spellTempHealth3",
    target: "allyPact"
  },
  julgamentoLeviata: {
    key: "julgamentoLeviata",
    name: "Julgamento do Leviatã",
    type: "spell",
    element: "water",
    cost: 6,
    image: "assets/spells/water/julgamento_do_leviata.png",
    imageFallbacks: ["assets/spells/water/julgamento_do_leviata.jpeg", "cards/spells/water/julgamento_do_leviata.png"],
    effect: "Cause 4 de dano a um alvo inimigo.",
    action: "spellDamage4",
    target: "enemyAny"
  },
  coroaCinzas: {
    key: "coroaCinzas",
    name: "Coroa de Cinzas",
    type: "equipment",
    element: "fire",
    cost: 2,
    effect: "Equipe um Pacto aliado. Ele recebe +1 Ataque permanentemente.",
    action: "equipAttack1",
    target: "allyPact"
  },
  pressagioCaldeira: {
    key: "pressagioCaldeira",
    name: "Presságio da Caldeira",
    type: "event",
    element: "fire",
    cost: 1,
    effect: "Ganhe 1 Loucura e compre 1 carta.",
    action: "madness1Draw1"
  },
  perolaAbissal: {
    key: "perolaAbissal",
    name: "Pérola Abissal",
    type: "equipment",
    element: "water",
    cost: 2,
    effect: "Equipe um Pacto aliado. Ele recebe +1 Vida permanente e cura 2.",
    action: "equipHealth1Heal2",
    target: "allyPact"
  },
  pressagioMare: {
    key: "pressagioMare",
    name: "Presságio da Maré",
    type: "event",
    element: "water",
    cost: 1,
    effect: "Cure 2 de Vida do seu Herói e compre 1 carta.",
    action: "healHero2Draw1"
  }
};

const HEROES = {
  fire: {
    key: "kael",
    heroName: "Kael Drakar",
    title: "Rei das Chamas Eternas",
    element: "fire",
    elementLabel: "Fogo",
    style: "Agressão, dano e sacrifício",
    maxLife: 25,
    image: "assets/heroes/kael.jpeg",
    imageFallbacks: ["assets/heroes/kael.png", "cards/heroes/kael.jpeg", "cards/heroes/Kael.png"],
    passiveName: "Chama do Conquistador",
    passive: "Sempre que um Pacto de Fogo aliado destruir um Pacto inimigo, ele recebe +1 Ataque permanentemente.",
    pacts: ["cinzamor", "varkhan", "ignivar"],
    primordial: "reiChamas"
  },
  water: {
    key: "nereia",
    heroName: "Nereia Val'Kora",
    title: "Mãe das Profundezas",
    element: "water",
    elementLabel: "Água",
    style: "Cura, controle e resistência",
    maxLife: 25,
    image: "assets/heroes/nereia.jpeg",
    imageFallbacks: ["assets/heroes/nereia.png", "cards/heroes/nereia.jpeg", "cards/heroes/nereia.png"],
    passiveName: "Marés Eternas",
    passive: "A primeira vez que você curar um aliado a cada turno, cure também 1 de Vida do seu Herói.",
    pacts: ["thalora", "lysora", "nauren"],
    primordial: "tronoAbissal"
  }
};

const DECK_RECIPES = {
  fire: [
    ["fornalhaEterna", 2],
    ["tronoVulcanico", 2],
    ["chuvaBrasas", 2],
    ["furiaVulcanica", 2],
    ["ritualSetimaChama", 2],
    ["fornalhaInsaciavel", 2],
    ["apocalipseCarmesim", 1],
    ["coroaCinzas", 1],
    ["pressagioCaldeira", 1]
  ],
  water: [
    ["mareProfunda", 2],
    ["abismoSilencioso", 2],
    ["mareRestauradora", 2],
    ["julgamentoLeviata", 2],
    ["escudoMares", 2],
    ["correnteRetorno", 2],
    ["cancaoAbissal", 1],
    ["perolaAbissal", 1],
    ["pressagioMare", 1]
  ]
};

const state = {
  screen: "menu",
  humanElement: null,
  players: [],
  activePlayerIndex: 0,
  selectedAttackerId: null,
  pendingTarget: null,
  botThinking: false,
  gameOver: false,
  winnerIndex: null,
  statusMessage: "",
  log: [],
  battleId: 0,
  floatingPanel: null,
  swapFlash: null,
  activeGlow: null
};

const screens = {
  menu: document.getElementById("menuScreen"),
  hero: document.getElementById("heroScreen"),
  decks: document.getElementById("decksScreen"),
  collection: document.getElementById("collectionScreen"),
  settings: document.getElementById("settingsScreen"),
  credits: document.getElementById("creditsScreen"),
  howto: document.getElementById("howToScreen"),
  battle: document.getElementById("battleScreen"),
  result: document.getElementById("resultScreen")
};

const botArea = document.getElementById("botArea");
const humanArea = document.getElementById("humanArea");
const statusText = document.getElementById("statusText");
const turnTitle = document.getElementById("turnTitle");
const turnSplash = document.getElementById("turnSplash");
const gameLog = document.getElementById("gameLog");
const logDrawer = document.getElementById("logDrawer");
const rulesDrawer = document.getElementById("rulesDrawer");
const deckLists = document.getElementById("deckLists");
const resultTitle = document.getElementById("resultTitle");
const resultText = document.getElementById("resultText");
const endTurnButton = document.getElementById("endTurnButton");
const toggleLogButton = document.getElementById("toggleLogButton");
const toggleRulesButton = document.getElementById("toggleRulesButton");
const soundToggleButton = document.getElementById("soundToggleButton");
const volumeSlider = document.getElementById("volumeSlider");
const modal = document.getElementById("cardModal");
const modalBody = document.getElementById("cardModalBody");
const modalClose = document.getElementById("cardModalClose");

function createCard(cardKey) {
  const definition = typeof cardKey === "string" ? CARD_DEFS[cardKey] : cardKey;

  return {
    id: `${definition.key}-${nextCardId++}`,
    key: definition.key,
    name: definition.name,
    type: definition.type,
    element: definition.element || "neutral",
    cost: definition.cost || 0,
    image: definition.image || "",
    imageFallbacks: definition.imageFallbacks || [],
    effect: definition.effect || "",
    action: definition.action || "",
    target: definition.target || "",
    passiveName: definition.passiveName || "",
    passive: definition.passive || "",
    permanent: definition.permanent ? [...definition.permanent] : [],
    enter: definition.enter || "",
    exclusive: definition.exclusive || "",
    abilities: definition.abilities ? definition.abilities.map((ability) => ({ ...ability, cost: { ...(ability.cost || {}) } })) : [],
    baseAttack: definition.attack || 0,
    baseHealth: definition.health || 0,
    currentHealth: definition.health || 0,
    ownerIndex: null,
    slot: null,
    hasAttacked: false,
    abilityUsedTurn: 0,
    primordialAbilityUsedTurn: 0,
    permanentAttack: 0,
    permanentHealth: 0,
    temporaryAttack: 0,
    temporaryHealth: 0,
    tauntExpiresTurn: 0,
    frozenUntilTurn: 0,
    abilitiesBlockedUntilTurn: 0
  };
}

function createHeroCard(player) {
  const hero = HEROES[player.element];

  return {
    key: hero.key,
    name: hero.heroName,
    type: "hero",
    element: hero.element,
    title: hero.title,
    image: hero.image,
    imageFallbacks: hero.imageFallbacks,
    baseHealth: hero.maxLife,
    currentHealth: player.life,
    passiveName: hero.passiveName,
    passive: hero.passive,
    effect: hero.passive
  };
}

function createDeck(element) {
  const deck = [];

  DECK_RECIPES[element].forEach(([cardKey, copies]) => {
    for (let copy = 0; copy < copies; copy += 1) {
      deck.push(createCard(cardKey));
    }
  });

  return shuffleDeck(deck);
}

function shuffleDeck(deck) {
  const shuffled = [...deck];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
}

function startGame() {
  state.battleId += 1;
  state.screen = "menu";
  state.players = [];
  state.activePlayerIndex = 0;
  state.selectedAttackerId = null;
  state.pendingTarget = null;
  state.botThinking = false;
  state.gameOver = false;
  state.winnerIndex = null;
  state.statusMessage = "";
  state.log = [];
  state.floatingPanel = null;
  state.swapFlash = null;
  state.activeGlow = null;
  closeCardModal();
  updateUI();
}

function selectHero(element) {
  state.humanElement = element;
  startBattle();
}

function startBattle() {
  const humanElement = state.humanElement || "fire";
  const botElement = humanElement === "fire" ? "water" : "fire";

  state.battleId += 1;
  nextCardId = 1;
  state.screen = "battle";
  state.players = [
    buildPlayer(0, "human", humanElement),
    buildPlayer(1, "bot", botElement)
  ];
  state.activePlayerIndex = 0;
  state.selectedAttackerId = null;
  state.pendingTarget = null;
  state.botThinking = false;
  state.gameOver = false;
  state.winnerIndex = null;
  state.statusMessage = "";
  state.log = [];
  state.floatingPanel = null;
  state.swapFlash = null;
  state.activeGlow = null;
  closeCardModal();

  state.players.forEach((player) => {
    drawCard(player, STARTING_HAND, { silent: true });
    logAction(`${player.heroName} comprou ${STARTING_HAND} cartas iniciais.`);
  });

  logAction(`Você escolheu ${state.players[0].heroName}. O oponente usa ${state.players[1].heroName}.`);
  beginTurn(0);
}

function buildPlayer(index, role, element) {
  const hero = HEROES[element];
  const deck = createDeck(element);
  const pacts = hero.pacts.map((pactKey, slot) => {
    const card = createCard(pactKey);
    card.ownerIndex = index;
    card.slot = slot;
    card.currentHealth = getBaseCardHealth(card);
    return card;
  });
  const primordial = createCard(hero.primordial);
  primordial.ownerIndex = index;

  deck.forEach((card) => {
    card.ownerIndex = index;
  });

  return {
    index,
    role,
    label: role === "human" ? "Jogador" : "Oponente",
    element,
    elementLabel: hero.elementLabel,
    deckStyle: hero.style,
    heroName: hero.heroName,
    heroTitle: hero.title,
    heroImage: hero.image,
    heroImageFallbacks: hero.imageFallbacks,
    passiveName: hero.passiveName,
    passive: hero.passive,
    life: hero.maxLife,
    maxLife: hero.maxLife,
    manaMax: 0,
    mana: 0,
    madness: 0,
    turnsTaken: 0,
    deck,
    hand: [],
    discard: [],
    pacts,
    destroyedPacts: 0,
    realm: null,
    primordial,
    primordialInvoked: false,
    primordialDestroyed: false,
    swappedThisTurn: false,
    healedAllyThisTurn: false,
    realmHealDrawnThisTurn: false,
    discountsUsed: { fire: false, water: false }
  };
}

function updateUI() {
  applyVisualTheme();

  Object.entries(screens).forEach(([key, screen]) => {
    if (screen) {
      screen.classList.toggle("active", state.screen === key);
    }
  });

  renderDeckLists();
  renderFloatingPanels();

  if (state.players.length > 0) {
    renderBattle();
  }

  if (state.screen === "result") {
    renderResult();
  }
}

function applyVisualTheme() {
  document.body.classList.remove(...THEME_CLASSES);
  document.body.classList.add(`theme-${state.humanElement || "fire"}`);
}

function renderBattle() {
  const human = state.players.find((player) => player.role === "human");
  const bot = state.players.find((player) => player.role === "bot");
  const activePlayer = state.players[state.activePlayerIndex];

  if (!human || !bot) {
    return;
  }

  botArea.innerHTML = renderPlayerBoard(bot, true);
  humanArea.innerHTML = renderPlayerBoard(human, false);

  turnTitle.textContent = activePlayer.role === "human" ? "Seu Turno" : "Turno do Oponente";
  statusText.textContent = state.pendingTarget ? state.pendingTarget.message : (state.statusMessage || "Duelo em andamento.");
  endTurnButton.disabled = !canHumanAct() || Boolean(state.pendingTarget);
  endTurnButton.textContent = state.pendingTarget ? "Escolha um alvo" : "Encerrar Turno";
}

function renderPlayerBoard(player, isOpponent) {
  const sideClass = isOpponent ? "opponent-board" : "human-board";
  const active = player.index === state.activePlayerIndex ? "active-board" : "";
  const hand = isOpponent ? renderOpponentHand(player) : renderHand(player);

  return `
    <section class="duel-side ${sideClass} ${active} element-${player.element}" aria-label="${escapeHtml(player.label)}">
      <div class="player-topline">
        <strong>${escapeHtml(player.heroName)}</strong>
        <span>${escapeHtml(player.heroTitle)}</span>
      </div>
      <div class="duel-grid">
        ${renderHeroSlot(player)}
        <div class="pact-lane" aria-label="Pactos de ${escapeHtml(player.heroName)}">
          ${player.pacts.map((card, slot) => renderPactSlot(player, card, slot)).join("")}
        </div>
        ${renderRealmSlot(player)}
        ${renderPrimordialSlot(player)}
      </div>
      ${hand}
    </section>
  `;
}

function renderHeroSlot(player) {
  const heroCard = createHeroCard(player);
  const targetable = isTargetable({ type: "hero", playerIndex: player.index, player });
  const directTarget = canHeroReceiveAttack(player);

  return `
    <button type="button" class="board-slot hero-slot ${targetable ? "targetable" : ""} ${directTarget ? "attack-target" : ""}"
      data-hero-index="${player.index}" data-detail-type="hero" data-detail-player-index="${player.index}">
      <div class="slot-label">Herói</div>
      ${renderCardArt(heroCard, "hero-art")}
      <div class="slot-card-copy">
        <strong>${escapeHtml(player.heroName)}</strong>
        <span>${renderIconStat("vida", `${player.life}/${player.maxLife}`, "Vida")}</span>
        <span>${renderIconStat("mana", `${player.mana}/${player.manaMax}`, "Mana")}</span>
        <span>${renderIconStat("loucura", player.madness, "Loucura")}</span>
      </div>
    </button>
  `;
}

function renderPactSlot(player, card, slot) {
  const isActive = slot === ACTIVE_SLOT;
  const flash = state.swapFlash && state.swapFlash.playerIndex === player.index && state.swapFlash.slot === slot ? "swap-flash" : "";
  const activeGlow = state.activeGlow && state.activeGlow.playerIndex === player.index && state.activeGlow.slot === slot ? "active-glow" : "";
  const canSwap = canHumanSwap(player, slot);

  if (!card) {
    return `
      <div class="board-slot pact-slot empty-pact ${isActive ? "active-pact-slot" : "bench-pact-slot"} ${flash} ${activeGlow}"
        data-field-index="${player.index}" data-field-slot="${slot}">
        <div class="slot-label">${isActive ? "Pacto Ativo" : "Banco"}</div>
        <span class="empty-slot-text">Destruído</span>
      </div>
    `;
  }

  const selected = state.selectedAttackerId === card.id;
  const targetable = isTargetable({ type: "pact", playerIndex: player.index, slot, card });
  const canCardAttack = canAttack(card);
  const blocked = isAbilityBlocked(card);
  const frozen = isFrozen(card);
  const taunt = isTaunting(card);

  return `
    <div class="board-slot pact-slot ${isActive ? "active-pact-slot" : "bench-pact-slot"} ${flash} ${activeGlow} ${targetable ? "targetable" : ""}"
      data-field-index="${player.index}" data-field-slot="${slot}">
      <div class="slot-label">${isActive ? "Pacto Ativo" : "Banco"}</div>
      <button type="button" class="battle-card pact-card element-${card.element} ${canCardAttack ? "can-attack" : ""} ${selected ? "selected" : ""} ${frozen ? "frozen" : ""}"
        data-field-index="${player.index}" data-field-slot="${slot}" data-detail-type="card" data-detail-card-id="${card.id}">
        ${renderCardArt(card, "pact-art")}
        <span class="card-name">${escapeHtml(card.name)}</span>
        <span class="card-stats">
          ${renderIconStat("ataque", getAttack(card), "Ataque")}
          ${renderIconStat("vida_pacto", `${card.currentHealth}/${getMaxHealth(card)}`, "Vida")}
        </span>
        <span class="card-tags">
          ${isActive ? "<span>Ativo</span>" : "<span>Banco</span>"}
          ${frozen ? "<span>Congelado</span>" : ""}
          ${blocked ? "<span>Sem habilidades</span>" : ""}
          ${taunt ? "<span>Provocação</span>" : ""}
        </span>
      </button>
      ${canSwap ? `<button type="button" class="slot-action swap-action" data-swap-slot="${slot}">Trocar</button>` : ""}
      ${renderAbilityBar(player, card, isActive)}
    </div>
  `;
}

function renderAbilityBar(player, card, isActive) {
  if (!card || player.role !== "human") {
    return "";
  }

  const buttons = card.abilities.map((ability, index) => {
    const usable = canUsePactAbility(player, card, ability);
    const cost = formatCost(getDiscountedCost(player, card, ability));
    return `
      <button type="button" class="ability-button" data-ability-card-id="${card.id}" data-ability-index="${index}" ${usable ? "" : "disabled"}>
        <span>${escapeHtml(ability.name)}</span>
        <small>${escapeHtml(cost)}</small>
      </button>
    `;
  }).join("");

  return `
    <div class="ability-bar ${isActive ? "active-ability-lock" : ""}">
      ${isActive ? "<span class=\"ability-lock\">Ativo: não usa habilidades</span>" : buttons}
    </div>
  `;
}

function renderRealmSlot(player) {
  const realm = player.realm;

  if (!realm) {
    return `
      <div class="board-slot realm-slot empty-support">
        <div class="slot-label">Reino</div>
        <span class="empty-slot-text">Sem Reino</span>
      </div>
    `;
  }

  return `
    <button type="button" class="board-slot realm-slot element-${realm.element}" data-detail-type="realm" data-detail-player-index="${player.index}">
      <div class="slot-label">Reino</div>
      ${renderCardArt(realm, "realm-art")}
      <div class="slot-card-copy">
        <strong>${escapeHtml(realm.name)}</strong>
        <span>${escapeHtml(realm.enter || realm.effect)}</span>
      </div>
    </button>
  `;
}

function renderPrimordialSlot(player) {
  const primordial = player.primordial;
  const stateInfo = getPrimordialState(player);
  const canInvoke = canHumanAct() && player.index === 0 && canInvokePrimordial(player);
  const invoked = player.primordialInvoked;

  return `
    <button type="button" class="board-slot primordial-slot element-${primordial.element} ${stateInfo.className}"
      data-primordial-index="${player.index}" data-detail-type="primordial" data-detail-player-index="${player.index}">
      <div class="slot-label">Primordial</div>
      ${renderCardArt(primordial, "primordial-art")}
      <div class="slot-card-copy">
        <strong>${escapeHtml(primordial.name)}</strong>
        <span class="primordial-state">${escapeHtml(stateInfo.label)}</span>
        <span class="card-stats">
          ${renderIconStat("mana", primordial.cost, "Mana")}
          ${renderIconStat("ataque", primordial.baseAttack, "Ataque")}
          ${renderIconStat("vida_pacto", invoked ? `${primordial.currentHealth}/${getMaxHealth(primordial)}` : primordial.baseHealth, "Vida")}
        </span>
      </div>
      ${canInvoke ? "<span class=\"primordial-call\">Invocar</span>" : ""}
      ${renderPrimordialAbility(player)}
    </button>
  `;
}

function renderPrimordialAbility(player) {
  if (player.role !== "human" || !player.primordialInvoked) {
    return "";
  }

  const ability = getPlayablePrimordialAbility(player.primordial);
  if (!ability) {
    return "";
  }

  const used = player.primordial.primordialAbilityUsedTurn === player.turnsTaken;
  const disabled = !canHumanAct() || used || Boolean(state.pendingTarget);

  return `
    <span class="primordial-actions">
      <span class="primordial-ability ${disabled ? "disabled" : ""}" data-primordial-ability-player-index="${player.index}">
        ${escapeHtml(ability.name)}
      </span>
    </span>
  `;
}

function renderOpponentHand(player) {
  return `
    <div class="opponent-hand">
      <span>${renderIconStat("deck", player.deck.length, "Deck")}</span>
      <span>Mão ${player.hand.length}</span>
      <span>Descarte ${player.discard.length}</span>
    </div>
  `;
}

function renderHand(player) {
  const cards = player.hand.map((card, index) => {
    const playable = canPlayCard(player, card);

    return `
      <button type="button" class="battle-card hand-card element-${card.element} ${playable ? "playable" : ""}"
        data-hand-index="${index}" data-detail-type="card-key" data-detail-card-key="${card.key}">
        ${renderCardArt(card, "hand-art")}
        <span class="card-name">${escapeHtml(card.name)}</span>
        <span class="card-type">${escapeHtml(TYPE_LABELS[card.type])}</span>
        <span class="card-stats">
          ${renderIconStat("mana", card.cost, "Custo")}
          ${card.baseAttack ? renderIconStat("ataque", card.baseAttack, "Ataque") : ""}
          ${card.baseHealth ? renderIconStat("vida_pacto", card.baseHealth, "Vida") : ""}
        </span>
      </button>
    `;
  }).join("");

  return `
    <div class="hand-zone">
      <div class="hand-topline">
        <span>Sua Mão (${player.hand.length})</span>
        <span>${renderIconStat("deck", player.deck.length, "Deck")} Descarte ${player.discard.length}</span>
      </div>
      <div class="hand-row">${cards || "<span class=\"empty-slot-text\">Sem cartas na mão</span>"}</div>
    </div>
  `;
}

function renderDeckLists() {
  if (!deckLists) {
    return;
  }

  deckLists.innerHTML = Object.entries(DECK_RECIPES).map(([element, recipe]) => {
    const hero = HEROES[element];
    const rows = recipe.map(([cardKey, copies]) => {
      const card = CARD_DEFS[cardKey];
      return `
        <button type="button" class="deck-row" data-detail-type="card-key" data-detail-card-key="${card.key}">
          ${renderCardArt(card, "deck-row-art")}
          <span>
            <strong>${escapeHtml(card.name)}</strong>
            <span>${escapeHtml(TYPE_LABELS[card.type])} · ${escapeHtml(ELEMENT_LABELS[card.element])} · ${renderPlainCost(card.cost)}</span>
          </span>
          <strong class="copy-count">x${copies}</strong>
        </button>
      `;
    }).join("");

    return `
      <article class="deck-column element-${element}">
        <h3>${escapeHtml(hero.heroName)}</h3>
        <p>${DECK_SIZE} cartas · sem Heróis, Pactos ou Primordiais · até 2 cópias.</p>
        <div class="deck-list">${rows}</div>
      </article>
    `;
  }).join("");
}

function renderCardArt(card, className = "") {
  const candidates = withFallbacks(card.image, card.imageFallbacks);

  if (candidates.length === 0) {
    return `<span class="card-art ${className} generated-art element-${card.element}">${escapeHtml(card.name)}</span>`;
  }

  const [src, ...fallbacks] = candidates;
  return `
    <span class="card-art ${className}">
      <img src="${escapeHtml(src)}" data-fallbacks="${escapeHtml(fallbacks.join("|"))}" alt="${escapeHtml(card.name)}" onerror="fallbackImage(this)">
    </span>
  `;
}

function renderIconStat(icon, value, label) {
  const src = ICON_ASSETS[icon];
  return `
    <span class="icon-stat" title="${escapeHtml(label)}">
      ${src ? `<img src="${escapeHtml(src)}" alt="">` : ""}
      <strong>${escapeHtml(value)}</strong>
    </span>
  `;
}

function renderPlainCost(cost) {
  return cost ? `${cost} Mana` : "0 Mana";
}

function fallbackImage(image) {
  const fallbacks = image.dataset.fallbacks ? image.dataset.fallbacks.split("|").filter(Boolean) : [];

  if (fallbacks.length === 0) {
    const art = image.closest(".card-art");
    if (art) {
      art.classList.add("missing-art");
      art.textContent = image.alt || "Arte";
    }
    image.remove();
    return;
  }

  const [next, ...rest] = fallbacks;
  image.dataset.fallbacks = rest.join("|");
  image.src = next;
}

window.fallbackImage = fallbackImage;

function beginTurn(playerIndex) {
  if (state.gameOver) {
    return;
  }

  const player = state.players[playerIndex];
  state.activePlayerIndex = playerIndex;
  state.selectedAttackerId = null;
  state.pendingTarget = null;
  player.turnsTaken += 1;
  player.manaMax = Math.min(MAX_MANA, player.manaMax + 1);
  player.mana = player.manaMax;
  player.swappedThisTurn = false;
  player.healedAllyThisTurn = false;
  player.realmHealDrawnThisTurn = false;
  player.discountsUsed = { fire: false, water: false };
  expireStartOfTurnEffects(player);

  player.pacts.forEach((card) => {
    if (!card) {
      return;
    }
    card.hasAttacked = false;
    card.abilityUsedTurn = 0;
  });

  if (player.primordialInvoked) {
    player.primordial.primordialAbilityUsedTurn = 0;
  }

  if (player.turnsTaken > 1) {
    drawCard(player, 1);
  }
  logAction(`Começou o turno de ${player.heroName}. Mana ${player.mana}/${player.manaMax}.`);
  state.statusMessage = player.role === "human" ? `Seu turno com ${player.heroName}.` : "O oponente está pensando...";
  updateUI();
  flashTurnSplash(player.role === "human" ? "Seu Turno" : "Turno do Oponente");

  if (player.role === "bot") {
    const battleId = state.battleId;
    window.setTimeout(() => botTurn(battleId), BOT_DELAY);
  }
}

function expireStartOfTurnEffects(player) {
  player.pacts.forEach((card) => {
    if (!card) {
      return;
    }
    card.temporaryAttack = 0;
    if (card.temporaryHealth > 0) {
      card.currentHealth = Math.max(1, card.currentHealth - Math.min(card.temporaryHealth, card.currentHealth - 1));
      card.temporaryHealth = 0;
    }
    if (card.tauntExpiresTurn && card.tauntExpiresTurn <= player.turnsTaken) {
      card.tauntExpiresTurn = 0;
    }
  });
  clampPacts(player);
}

function expireEndOfTurnEffects(player) {
  player.pacts.forEach((card) => {
    if (!card) {
      return;
    }
    card.temporaryAttack = 0;
    if (card.frozenUntilTurn && card.frozenUntilTurn <= player.turnsTaken) {
      card.frozenUntilTurn = 0;
    }
    if (card.abilitiesBlockedUntilTurn && card.abilitiesBlockedUntilTurn <= player.turnsTaken) {
      card.abilitiesBlockedUntilTurn = 0;
    }
  });
  clampPacts(player);
}

function drawCard(player, amount = 1, options = {}) {
  let drawn = 0;

  for (let count = 0; count < amount; count += 1) {
    if (player.deck.length === 0) {
      if (!options.silent) {
        logAction(`${player.heroName} tentou comprar, mas o deck está vazio.`);
      }
      break;
    }

    const card = player.deck.shift();
    card.ownerIndex = player.index;
    player.hand.push(card);
    drawn += 1;
  }

  if (drawn > 0 && !options.silent) {
    logAction(`${player.heroName} comprou ${drawn} ${drawn === 1 ? "carta" : "cartas"}.`);
  }

  return drawn;
}

function playCard(handIndex) {
  if (!canHumanAct()) {
    return;
  }

  const player = state.players[0];
  const card = player.hand[handIndex];

  if (!card || !canPlayCard(player, card)) {
    showMessage("Essa carta não pode ser jogada agora.");
    return;
  }

  const targetRule = getCardTargetRule(card);
  if (targetRule && hasValidTargets(player, targetRule)) {
    requestTarget({
      message: `Escolha o alvo para ${card.name}.`,
      validTarget: (target) => isValidTargetForRule(player, targetRule, target),
      resolve: (target) => {
        const currentIndex = player.hand.findIndex((handCard) => handCard.id === card.id);
        if (currentIndex !== -1) {
          playCardWithTarget(player, currentIndex, target);
        }
      }
    });
    return;
  }

  playCardWithTarget(player, handIndex, null);
}

function playCardWithTarget(player, handIndex, target) {
  const card = player.hand[handIndex];

  if (!card || player.mana < card.cost) {
    showMessage("Mana insuficiente.");
    return;
  }

  player.mana -= card.cost;
  player.hand.splice(handIndex, 1);
  player.discard.push(card);
  logAction(`${player.heroName} jogou ${card.name}.`);
  resolvePlayedCard(player, card, target);
  checkGameOver();
  updateUI();
}

function resolvePlayedCard(player, card, target) {
  switch (card.action) {
    case "realmFornalha":
      setRealm(player, card);
      damageAllEnemyPacts(player, 1, card);
      break;
    case "realmTrono":
      setRealm(player, card);
      if (target && target.card) {
        addTemporaryAttack(target.card, 2);
        logAction(`${target.card.name} recebeu +2 Ataque neste turno.`);
      }
      break;
    case "realmMare":
      setRealm(player, card);
      if (target && target.card) {
        healPact(target.card, 3, player);
      }
      break;
    case "realmAbismo":
      setRealm(player, card);
      if (target && target.card) {
        const owner = state.players[target.playerIndex];
        target.card.abilitiesBlockedUntilTurn = owner.turnsTaken + 1;
        logAction(`${target.card.name} não poderá usar habilidades no próximo turno.`);
      }
      break;
    case "spellDamage2":
      dealDamageToTarget(target, 2, card);
      break;
    case "spellDamage4":
      dealDamageToTarget(target, 4, card);
      break;
    case "spellAllyAttack3":
      addTemporaryAttack(target.card, 3);
      logAction(`${target.card.name} recebeu +3 Ataque neste turno.`);
      break;
    case "draw2Madness1":
      player.madness += 1;
      drawCard(player, 2);
      logAction(`${player.heroName} ganhou 1 Loucura.`);
      break;
    case "draw2":
      drawCard(player, 2);
      break;
    case "destroyAllyGainMana3":
      destroyPact(target.card, card, { sacrifice: true });
      player.mana = Math.min(player.manaMax, player.mana + 3);
      logAction(`${player.heroName} recuperou 3 Mana.`);
      break;
    case "enemyPactsDamage3":
      damageAllEnemyPacts(player, 3, card);
      break;
    case "spellHeal3":
      healPact(target.card, 3, player);
      break;
    case "freezeEnemy":
      freezePact(target.card);
      break;
    case "spellTempHealth3":
      addTemporaryHealth(target.card, 3);
      break;
    case "equipAttack1":
      target.card.permanentAttack += 1;
      logAction(`${target.card.name} recebeu +1 Ataque permanente.`);
      break;
    case "madness1Draw1":
      player.madness += 1;
      drawCard(player, 1);
      logAction(`${player.heroName} ganhou 1 Loucura.`);
      break;
    case "equipHealth1Heal2":
      target.card.permanentHealth += 1;
      healPact(target.card, 2, player);
      logAction(`${target.card.name} recebeu +1 Vida permanente.`);
      break;
    case "healHero2Draw1":
      healHero(player, 2);
      drawCard(player, 1);
      break;
    default:
      break;
  }
}

function setRealm(player, card) {
  const realm = createCard(card.key);
  realm.ownerIndex = player.index;
  player.realm = realm;
  logAction(`${player.heroName} ativou o Reino ${realm.name}.`);
  clampAllPacts();
}

function canPlayCard(player, card) {
  return Boolean(
    canHumanAct() &&
    !state.pendingTarget &&
    card &&
    card.type !== "pact" &&
    card.type !== "hero" &&
    card.type !== "primordial" &&
    player.mana >= card.cost
  );
}

function getCardTargetRule(card) {
  return card.target || null;
}

function usePactAbility(cardId, abilityIndex) {
  if (!canHumanAct()) {
    return;
  }

  const location = getPactLocation(cardId);
  if (!location || location.playerIndex !== 0) {
    return;
  }

  const player = state.players[location.playerIndex];
  const card = location.card;
  const ability = card.abilities[abilityIndex];

  if (!ability || !canUsePactAbility(player, card, ability)) {
    showMessage("Essa habilidade não pode ser usada agora.");
    return;
  }

  if (ability.target && hasValidTargets(player, ability.target)) {
    requestTarget({
      message: `Escolha o alvo para ${ability.name}.`,
      validTarget: (target) => isValidTargetForRule(player, ability.target, target),
      resolve: (target) => resolvePactAbility(player, card, ability, target)
    });
    return;
  }

  resolvePactAbility(player, card, ability, null);
}

function resolvePactAbility(player, card, ability, target) {
  if (!payAbilityCost(player, card, ability)) {
    showMessage("Recursos insuficientes.");
    return;
  }

  card.abilityUsedTurn = player.turnsTaken;
  logAction(`${card.name} usou ${ability.name}.`);

  switch (ability.action) {
    case "damage3":
      dealDamageToTarget(target, 3, card);
      break;
    case "damage2":
      dealDamageToTarget(target, 2, card);
      break;
    case "damage5":
      dealDamageToTarget(target, 5, card);
      break;
    case "selfAttack3":
      addTemporaryAttack(card, 3);
      break;
    case "selfTempHealth4":
      addTemporaryHealth(card, 4);
      break;
    case "enemyPactsDamage2":
      damageAllEnemyPacts(player, 2, card);
      break;
    case "taunt":
      card.tauntExpiresTurn = player.turnsTaken + 1;
      break;
    case "allyAttack2":
      addTemporaryAttack(target.card, 2);
      break;
    case "draw1":
      drawCard(player, 1);
      break;
    case "heal5":
      healPact(target.card, 5, player);
      break;
    default:
      break;
  }

  checkGameOver();
  updateUI();
}

function canUsePactAbility(player, card, ability) {
  const location = getPactLocation(card.id);

  if (!location) {
    return false;
  }

  return Boolean(
    canHumanAct() &&
    location.playerIndex === player.index &&
    location.slot !== ACTIVE_SLOT &&
    card.abilityUsedTurn !== player.turnsTaken &&
    !state.pendingTarget &&
    !isAbilityBlocked(card) &&
    hasResources(player, getDiscountedCost(player, card, ability))
  );
}

function getDiscountedCost(player, card, ability) {
  const cost = { ...(ability.cost || {}) };
  const realmKey = player.realm ? player.realm.key : "";
  const canDiscountFire = realmKey === "tronoVulcanico" && card.element === "fire" && !player.discountsUsed.fire;
  const canDiscountWater = realmKey === "abismoSilencioso" && card.element === "water" && !player.discountsUsed.water;

  if ((canDiscountFire || canDiscountWater) && cost.mana) {
    cost.mana = Math.max(0, cost.mana - 1);
  }

  return cost;
}

function payAbilityCost(player, card, ability) {
  const cost = getDiscountedCost(player, card, ability);

  if (!hasResources(player, cost)) {
    return false;
  }

  player.mana -= cost.mana || 0;
  player.madness -= cost.madness || 0;
  player.life -= cost.blood || 0;

  if (ability.cost && ability.cost.mana && cost.mana < ability.cost.mana) {
    player.discountsUsed[card.element] = true;
  }

  return true;
}

function hasResources(player, cost) {
  return (
    player.mana >= (cost.mana || 0) &&
    player.madness >= (cost.madness || 0) &&
    player.life > (cost.blood || 0)
  );
}

function formatCost(cost) {
  const parts = [];
  if (cost.mana) {
    parts.push(`${cost.mana} Mana`);
  }
  if (cost.madness) {
    parts.push(`${cost.madness} Loucura`);
  }
  if (cost.blood) {
    parts.push(`${cost.blood} Sangue`);
  }
  return parts.join(" · ") || "0";
}

function attack(attackerRef, defenderRef) {
  const attackerLocation = getPactLocation(attackerRef.cardId);

  if (!attackerLocation) {
    return;
  }

  const attacker = attackerLocation.card;
  const owner = state.players[attacker.ownerIndex];

  if (!canAttack(attacker)) {
    showMessage(`${attacker.name} não pode atacar agora.`);
    return;
  }

  const opponent = getOpponent(owner.index);
  const tauntTarget = getTauntTarget(opponent);
  if (tauntTarget && defenderRef.cardId !== tauntTarget.id) {
    showMessage(`Provocação obriga o ataque contra ${tauntTarget.name}.`);
    return;
  }

  attacker.hasAttacked = true;

  if (defenderRef.type === "hero") {
    const defender = state.players[defenderRef.playerIndex];
    damageHero(defender, getAttack(attacker), attacker);
    logAction(`${attacker.name} atacou ${defender.heroName}.`);
  } else {
    const defenderLocation = getPactLocation(defenderRef.cardId);
    if (!defenderLocation) {
      return;
    }

    const defender = defenderLocation.card;
    const defenderAttack = getAttack(defender);
    damagePact(defender, getAttack(attacker), attacker);

    if (getPactLocation(defender.id) && defenderAttack > 0) {
      damagePact(attacker, defenderAttack, defender);
    }

    logAction(`${attacker.name} atacou ${defender.name}.`);
  }

  state.selectedAttackerId = null;
  checkGameOver();
  updateUI();
}

function canAttack(card) {
  const location = card ? getPactLocation(card.id) : null;

  return Boolean(
    card &&
    location &&
    location.slot === ACTIVE_SLOT &&
    card.ownerIndex === state.activePlayerIndex &&
    !card.hasAttacked &&
    !state.pendingTarget &&
    !isFrozen(card) &&
    !state.gameOver &&
    (state.players[state.activePlayerIndex].role === "human" || state.botThinking)
  );
}

function canHeroReceiveAttack(player) {
  return Boolean(
    state.selectedAttackerId &&
    player.index !== state.activePlayerIndex &&
    !getTauntTarget(player)
  );
}

function canHeroBeDirectTarget(player) {
  return canHeroReceiveAttack(player);
}

function canHumanSwap(player, slot) {
  return Boolean(
    canHumanAct() &&
    player.index === 0 &&
    slot !== ACTIVE_SLOT &&
    !player.swappedThisTurn &&
    player.pacts[slot] &&
    !state.pendingTarget
  );
}

function swapPact(player, slot) {
  if (!canHumanSwap(player, slot)) {
    showMessage("Você já trocou de Pacto neste turno ou esse slot está vazio.");
    return;
  }

  [player.pacts[ACTIVE_SLOT], player.pacts[slot]] = [player.pacts[slot], player.pacts[ACTIVE_SLOT]];
  refreshPactSlots(player);
  player.swappedThisTurn = true;
  state.swapFlash = { playerIndex: player.index, slot };
  state.activeGlow = { playerIndex: player.index, slot: ACTIVE_SLOT };
  logAction(`${player.heroName} trocou o Pacto Ativo.`);
  showMessage(`${player.pacts[ACTIVE_SLOT].name} é o novo Pacto Ativo.`);
  window.setTimeout(() => {
    state.swapFlash = null;
    state.activeGlow = null;
    updateUI();
  }, 900);
  updateUI();
}

function botSwapIfUseful(bot) {
  if (bot.swappedThisTurn) {
    return false;
  }

  const active = bot.pacts[ACTIVE_SLOT];
  const candidates = [0, 2].filter((slot) => bot.pacts[slot]);

  if (candidates.length === 0) {
    return false;
  }

  let chosenSlot = -1;

  if (!active) {
    chosenSlot = candidates.sort((a, b) => getAttack(bot.pacts[b]) - getAttack(bot.pacts[a]))[0];
  } else if (active.currentHealth <= 3) {
    chosenSlot = candidates.sort((a, b) => bot.pacts[b].currentHealth - bot.pacts[a].currentHealth)[0];
  }

  if (chosenSlot === -1) {
    return false;
  }

  [bot.pacts[ACTIVE_SLOT], bot.pacts[chosenSlot]] = [bot.pacts[chosenSlot], bot.pacts[ACTIVE_SLOT]];
  refreshPactSlots(bot);
  bot.swappedThisTurn = true;
  logAction(`${bot.heroName} trocou o Pacto Ativo.`);
  return true;
}

function handleFieldClick(playerIndex, slot) {
  const player = state.players[playerIndex];
  const card = player ? player.pacts[slot] : null;

  if (!card) {
    return;
  }

  const target = { type: "pact", playerIndex, slot, card };

  if (state.pendingTarget) {
    resolvePendingTarget(target);
    return;
  }

  if (!canHumanAct()) {
    return;
  }

  if (playerIndex === 0) {
    if (slot !== ACTIVE_SLOT) {
      showMessage("Somente o Pacto do meio pode atacar. Pactos no banco usam habilidades.");
      return;
    }

    if (!canAttack(card)) {
      showMessage(`${card.name} não pode atacar agora.`);
      return;
    }

    state.selectedAttackerId = card.id;
    showMessage(`${card.name} foi selecionado para atacar.`);
    updateUI();
    return;
  }

  if (!state.selectedAttackerId) {
    showMessage("Selecione seu Pacto Ativo para atacar.");
    return;
  }

  attack({ cardId: state.selectedAttackerId }, { type: "pact", cardId: card.id });
}

function handleHeroClick(playerIndex) {
  const player = state.players[playerIndex];

  if (!player) {
    return;
  }

  if (state.pendingTarget) {
    resolvePendingTarget({ type: "hero", playerIndex, player });
    return;
  }

  if (!canHumanAct() || !state.selectedAttackerId || playerIndex === 0) {
    return;
  }

  if (!canHeroBeDirectTarget(player)) {
    showMessage("Há uma Provocação impedindo esse ataque.");
    return;
  }

  attack({ cardId: state.selectedAttackerId }, { type: "hero", playerIndex });
}

function handlePrimordialClick(playerIndex) {
  const player = state.players[playerIndex];

  if (!player) {
    return;
  }

  if (state.pendingTarget) {
    return;
  }

  if (!canHumanAct() || playerIndex !== 0) {
    return;
  }

  if (!canInvokePrimordial(player)) {
    showMessage(getPrimordialState(player).label);
    return;
  }

  invokePrimordial(player);
}

function invokePrimordial(player, target = null) {
  if (!canInvokePrimordial(player)) {
    return false;
  }

  if (player.primordial.key === "tronoAbissal" && !target && hasValidTargets(player, "enemyPact")) {
    requestTarget({
      message: "Escolha um Pacto inimigo para congelar.",
      validTarget: (candidate) => isValidTargetForRule(player, "enemyPact", candidate),
      resolve: (candidate) => invokePrimordial(player, candidate)
    });
    return true;
  }

  player.mana -= player.primordial.cost;
  player.primordialInvoked = true;
  player.primordial.currentHealth = getMaxHealth(player.primordial);
  logAction(`${player.heroName} invocou ${player.primordial.name}.`);
  flashTurnSplash("Primordial Invocado");

  if (player.primordial.key === "reiChamas") {
    damageAllEnemyPacts(player, 3, player.primordial);
  }

  if (player.primordial.key === "tronoAbissal" && target && target.card) {
    freezePact(target.card);
  }

  clampAllPacts();
  checkGameOver();
  updateUI();
  return true;
}

function usePrimordialAbility(playerIndex) {
  if (!canHumanAct()) {
    return;
  }

  const player = state.players[playerIndex];
  const ability = player ? getPlayablePrimordialAbility(player.primordial) : null;

  if (!player || player.index !== 0 || !player.primordialInvoked || !ability) {
    return;
  }

  if (player.primordial.primordialAbilityUsedTurn === player.turnsTaken) {
    showMessage("O Primordial já usou sua habilidade neste turno.");
    return;
  }

  if (ability.target && hasValidTargets(player, ability.target)) {
    requestTarget({
      message: `Escolha o alvo para ${ability.name}.`,
      validTarget: (target) => isValidTargetForRule(player, ability.target, target),
      resolve: (target) => resolvePrimordialAbility(player, ability, target)
    });
    return;
  }

  resolvePrimordialAbility(player, ability, null);
}

function resolvePrimordialAbility(player, ability, target) {
  player.primordial.primordialAbilityUsedTurn = player.turnsTaken;
  logAction(`${player.primordial.name} usou ${ability.name}.`);

  if (ability.action === "primordialDamage2") {
    dealDamageToTarget(target, 2, player.primordial);
  }

  if (ability.action === "primordialHealHero2") {
    healHero(player, 2);
  }

  checkGameOver();
  updateUI();
}

function getPlayablePrimordialAbility(primordial) {
  return primordial.abilities.find((ability) => ability.action) || null;
}

function canInvokePrimordial(player) {
  return Boolean(
    player &&
    !player.primordialInvoked &&
    !player.primordialDestroyed &&
    player.mana >= player.primordial.cost
  );
}

function getPrimordialState(player) {
  if (player.primordialDestroyed) {
    return { label: "Destruído", className: "spent" };
  }

  if (player.primordialInvoked) {
    return { label: "Invocado", className: "invoked" };
  }

  if (player.mana >= player.primordial.cost) {
    return { label: "Disponível", className: "available" };
  }

  return { label: `Bloqueado ${player.mana}/${player.primordial.cost} Mana`, className: "locked" };
}

function requestTarget(config) {
  state.pendingTarget = config;
  state.selectedAttackerId = null;
  showMessage(config.message);
}

function resolvePendingTarget(target) {
  if (!state.pendingTarget) {
    return;
  }

  const pending = state.pendingTarget;

  if (!pending.validTarget(target)) {
    showMessage("Esse alvo não é válido.");
    return;
  }

  state.pendingTarget = null;
  pending.resolve(target);
}

function isTargetable(target) {
  return Boolean(state.pendingTarget && state.pendingTarget.validTarget(target));
}

function hasValidTargets(player, rule) {
  return getAllTargets().some((target) => isValidTargetForRule(player, rule, target));
}

function isValidTargetForRule(player, rule, target) {
  const opponent = getOpponent(player.index);

  switch (rule) {
    case "enemyAny":
      return target.playerIndex === opponent.index && (target.type === "pact" || target.type === "hero");
    case "enemyPact":
    case "enemyPactOptional":
      return target.playerIndex === opponent.index && target.type === "pact" && Boolean(target.card);
    case "allyPact":
    case "allyPactOptional":
      return target.playerIndex === player.index && target.type === "pact" && Boolean(target.card);
    default:
      return false;
  }
}

function getAllTargets() {
  const targets = [];

  state.players.forEach((player) => {
    targets.push({ type: "hero", playerIndex: player.index, player });
    player.pacts.forEach((card, slot) => {
      if (card) {
        targets.push({ type: "pact", playerIndex: player.index, slot, card });
      }
    });
  });

  return targets;
}

function dealDamageToTarget(target, amount, source) {
  if (!target) {
    return;
  }

  if (target.type === "hero") {
    damageHero(state.players[target.playerIndex], amount, source);
  }

  if (target.type === "pact") {
    damagePact(target.card, amount, source);
  }
}

function damageAllEnemyPacts(player, amount, source) {
  const opponent = getOpponent(player.index);
  const targetIds = opponent.pacts.filter(Boolean).map((card) => card.id);

  targetIds.forEach((cardId) => {
    const location = getPactLocation(cardId);
    if (location) {
      damagePact(location.card, amount, source);
    }
  });
}

function damagePact(card, amount, source) {
  const location = getPactLocation(card.id);
  if (!location) {
    return 0;
  }

  const reduction = card.key === "varkhan" || card.key === "lysora" ? 1 : 0;
  const finalDamage = Math.max(0, amount - reduction);
  card.currentHealth -= finalDamage;
  logAction(`${card.name} recebeu ${finalDamage} de dano${reduction ? " após redução" : ""}.`);

  if (card.currentHealth <= 0) {
    destroyPact(card, source);
  }

  return finalDamage;
}

function destroyPact(card, source, options = {}) {
  const location = getPactLocation(card.id);
  if (!location) {
    return;
  }

  const owner = state.players[location.playerIndex];
  owner.pacts[location.slot] = null;
  owner.destroyedPacts += 1;
  logAction(`${card.name} foi destruído.`);

  const sourceOwner = source && typeof source.ownerIndex === "number" ? state.players[source.ownerIndex] : null;

  if (!options.sacrifice && sourceOwner && sourceOwner.index !== owner.index && source && source.type === "pact" && source.element === "fire") {
    source.permanentAttack += 1;
    logAction(`${source.name} recebeu +1 Ataque permanente pela Chama do Conquistador.`);
  }

  if (!options.sacrifice && sourceOwner && sourceOwner.realm && sourceOwner.realm.key === "fornalhaEterna" && source && source.type === "pact" && source.element === "fire") {
    sourceOwner.mana = Math.min(sourceOwner.manaMax, sourceOwner.mana + 1);
    logAction("Fornalha Eterna recuperou 1 Mana.");
  }

  if (source && source.type === "primordial" && source.key === "reiChamas" && sourceOwner && sourceOwner.index !== owner.index) {
    source.permanentAttack += 1;
    logAction(`${source.name} recebeu +1 Ataque permanente.`);
  }

  checkGameOver();
}

function healPact(card, amount, healer) {
  const location = getPactLocation(card.id);
  if (!location) {
    return 0;
  }

  const maxHealth = getMaxHealth(card);
  const before = card.currentHealth;
  card.currentHealth = Math.min(maxHealth, card.currentHealth + amount);
  const healed = card.currentHealth - before;

  if (healed > 0) {
    logAction(`${card.name} curou ${healed} de Vida.`);
    handleAllyHealed(state.players[location.playerIndex], healer);
  }

  return healed;
}

function handleAllyHealed(owner, healer) {
  if (owner.element === "water" && !owner.healedAllyThisTurn) {
    owner.healedAllyThisTurn = true;
    healHero(owner, 1);
    logAction("Marés Eternas curou 1 de Vida do Herói.");
  }

  if (owner.realm && owner.realm.key === "mareProfunda" && !owner.realmHealDrawnThisTurn) {
    owner.realmHealDrawnThisTurn = true;
    drawCard(owner, 1);
    logAction("Maré Profunda comprou 1 carta pela cura.");
  }
}

function healHero(player, amount) {
  const before = player.life;
  player.life = Math.min(player.maxLife, player.life + amount);
  const healed = player.life - before;
  if (healed > 0) {
    logAction(`${player.heroName} curou ${healed} de Vida.`);
  }
  return healed;
}

function damageHero(player, amount, source) {
  player.life = Math.max(0, player.life - amount);
  logAction(`${player.heroName} recebeu ${amount} de dano.`);
  checkGameOver();
}

function freezePact(card) {
  const location = getPactLocation(card.id);
  if (!location) {
    return;
  }
  const owner = state.players[location.playerIndex];
  card.frozenUntilTurn = owner.turnsTaken + 1;
  logAction(`${card.name} foi congelado até o próximo turno.`);
}

function addTemporaryAttack(card, amount) {
  card.temporaryAttack += amount;
  logAction(`${card.name} recebeu +${amount} Ataque neste turno.`);
}

function addTemporaryHealth(card, amount) {
  card.temporaryHealth += amount;
  card.currentHealth += amount;
  logAction(`${card.name} recebeu +${amount} Vida temporária.`);
}

function getAttack(card) {
  if (!card) {
    return 0;
  }

  const owner = state.players[card.ownerIndex];
  const opponent = owner ? getOpponent(owner.index) : null;
  const location = card.type === "pact" ? getPactLocation(card.id) : null;
  let attack = card.baseAttack + card.permanentAttack + card.temporaryAttack;

  if (card.type === "pact" && location && location.slot === ACTIVE_SLOT && (card.key === "cinzamor" || card.key === "thalora")) {
    attack += 1;
  }

  if (card.type === "pact" && location && location.slot === ACTIVE_SLOT && owner && owner.pacts.some((ally) => ally && (ally.key === "ignivar" || ally.key === "nauren"))) {
    attack += 1;
  }

  if (owner && owner.realm && owner.realm.key === "fornalhaEterna" && card.element === "fire") {
    attack += 1;
  }

  if (opponent && opponent.realm && opponent.realm.key === "abismoSilencioso" && card.type === "pact") {
    attack -= 1;
  }

  return Math.max(0, attack);
}

function getMaxHealth(card) {
  if (!card) {
    return 0;
  }

  const owner = state.players[card.ownerIndex];
  let health = getBaseCardHealth(card) + card.permanentHealth + card.temporaryHealth;

  if (owner && owner.realm && owner.realm.key === "tronoVulcanico" && card.element === "fire") {
    health += 2;
  }

  if (owner && owner.realm && owner.realm.key === "mareProfunda" && card.element === "water") {
    health += 2;
  }

  if (owner && owner.primordialInvoked && owner.primordial.key === "tronoAbissal" && card.type === "pact" && card.element === "water") {
    health += 2;
  }

  return Math.max(1, health);
}

function getBaseCardHealth(card) {
  return card.baseHealth || CARD_DEFS[card.key].health || 1;
}

function clampPacts(player) {
  player.pacts.forEach((card) => {
    if (card) {
      card.currentHealth = Math.min(card.currentHealth, getMaxHealth(card));
    }
  });
}

function clampAllPacts() {
  state.players.forEach(clampPacts);
}

function isFrozen(card) {
  const owner = state.players[card.ownerIndex];
  return Boolean(card.frozenUntilTurn && owner && owner.turnsTaken <= card.frozenUntilTurn);
}

function isAbilityBlocked(card) {
  const owner = state.players[card.ownerIndex];
  return Boolean(card.abilitiesBlockedUntilTurn && owner && owner.turnsTaken <= card.abilitiesBlockedUntilTurn);
}

function isTaunting(card) {
  const owner = state.players[card.ownerIndex];
  return Boolean(card.tauntExpiresTurn && owner && owner.turnsTaken < card.tauntExpiresTurn);
}

function getTauntTarget(player) {
  return player.pacts.find((card) => card && isTaunting(card)) || null;
}

function getPactLocation(cardId) {
  for (const player of state.players) {
    const slot = player.pacts.findIndex((card) => card && card.id === cardId);
    if (slot !== -1) {
      return { playerIndex: player.index, slot, card: player.pacts[slot] };
    }
  }
  return null;
}

function refreshPactSlots(player) {
  player.pacts.forEach((card, slot) => {
    if (card) {
      card.slot = slot;
    }
  });
}

function getOpponent(playerIndex) {
  return state.players.find((player) => player.index !== playerIndex);
}

function canHumanAct() {
  return Boolean(
    state.players.length > 0 &&
    !state.gameOver &&
    !state.botThinking &&
    state.activePlayerIndex === 0 &&
    state.players[0].role === "human"
  );
}

function endTurn() {
  if (!canHumanAct() || state.pendingTarget) {
    return;
  }

  const player = state.players[state.activePlayerIndex];
  expireEndOfTurnEffects(player);
  state.selectedAttackerId = null;
  logAction(`${player.heroName} encerrou o turno.`);
  beginTurn(getOpponent(player.index).index);
}

async function botTurn(battleId = state.battleId) {
  const bot = state.players[state.activePlayerIndex];

  if (!bot || bot.role !== "bot" || state.gameOver) {
    return;
  }

  state.botThinking = true;
  updateUI();
  await sleep(BOT_DELAY);

  if (!isSameBotTurn(bot, battleId)) {
    state.botThinking = false;
    return;
  }

  botSwapIfUseful(bot);
  await sleep(260);
  playBotCards(bot);
  await sleep(260);
  useBotBenchAbility(bot);
  await sleep(260);

  if (canInvokePrimordial(bot)) {
    const target = chooseTargetForRule(bot, "enemyPact");
    invokePrimordial(bot, target);
    await sleep(260);
  }

  const primordialAbility = getPlayablePrimordialAbility(bot.primordial);
  if (bot.primordialInvoked && primordialAbility && bot.primordial.primordialAbilityUsedTurn !== bot.turnsTaken) {
    const target = primordialAbility.target ? chooseTargetForRule(bot, primordialAbility.target) : null;
    resolvePrimordialAbility(bot, primordialAbility, target);
    await sleep(260);
  }

  const attacker = bot.pacts[ACTIVE_SLOT];
  if (attacker && canAttack(attacker)) {
    const target = chooseBotAttackTarget(bot, attacker);
    if (target) {
      attack({ cardId: attacker.id }, target);
      await sleep(260);
    }
  }

  state.botThinking = false;

  if (!state.gameOver && isSameBotTurn(bot, battleId)) {
    expireEndOfTurnEffects(bot);
    logAction(`${bot.heroName} encerrou o turno.`);
    beginTurn(0);
  }
}

function playBotCards(bot) {
  let played = true;
  let guard = 0;

  while (played && guard < 4) {
    guard += 1;
    played = false;

    const index = chooseBotCard(bot);
    if (index === -1) {
      continue;
    }

    const card = bot.hand[index];
    const targetRule = getCardTargetRule(card);
    const target = targetRule ? chooseTargetForRule(bot, targetRule) : null;

    if (targetRule && !target && !targetRule.endsWith("Optional")) {
      continue;
    }

    bot.mana -= card.cost;
    bot.hand.splice(index, 1);
    bot.discard.push(card);
    logAction(`${bot.heroName} jogou ${card.name}.`);
    resolvePlayedCard(bot, card, target);
    played = true;
  }
}

function chooseBotCard(bot) {
  let bestIndex = -1;
  let bestScore = -1;

  bot.hand.forEach((card, index) => {
    if (card.cost > bot.mana) {
      return;
    }

    const targetRule = getCardTargetRule(card);
    const target = targetRule ? chooseTargetForRule(bot, targetRule) : null;
    if (targetRule && !target && !targetRule.endsWith("Optional")) {
      return;
    }

    const score = getBotCardScore(bot, card, target);
    if (score > bestScore) {
      bestIndex = index;
      bestScore = score;
    }
  });

  return bestIndex;
}

function getBotCardScore(bot, card, target) {
  const opponent = getOpponent(bot.index);
  const enemyLow = opponent.pacts.some((pact) => pact && pact.currentHealth <= 3);

  const scores = {
    realm: bot.realm ? 24 : 60,
    spell: 38,
    equipment: 34,
    event: 30
  };

  let score = scores[card.type] || 0;
  if (card.action && card.action.includes("Damage") && enemyLow) {
    score += 24;
  }
  if (target && target.card) {
    score += getAttack(target.card) + Math.max(0, getMaxHealth(target.card) - target.card.currentHealth);
  }
  return score - card.cost;
}

function useBotBenchAbility(bot) {
  const bench = [0, 2].map((slot) => bot.pacts[slot]).filter(Boolean);

  for (const card of bench) {
    const ability = chooseBotAbility(bot, card);
    if (!ability) {
      continue;
    }
    const target = ability.target ? chooseTargetForRule(bot, ability.target) : null;
    if (ability.target && !target) {
      continue;
    }
    resolvePactAbility(bot, card, ability, target);
    return true;
  }

  return false;
}

function chooseBotAbility(bot, card) {
  return card.abilities.find((ability) => {
    const location = getPactLocation(card.id);
    return (
      location &&
      location.slot !== ACTIVE_SLOT &&
      card.abilityUsedTurn !== bot.turnsTaken &&
      !isAbilityBlocked(card) &&
      hasResources(bot, getDiscountedCost(bot, card, ability))
    );
  }) || null;
}

function chooseBotAttackTarget(bot, attacker) {
  const opponent = getOpponent(bot.index);
  const taunt = getTauntTarget(opponent);
  if (taunt) {
    return { type: "pact", cardId: taunt.id };
  }

  const enemies = opponent.pacts.filter(Boolean);
  if (enemies.length === 0 || opponent.life <= getAttack(attacker)) {
    return { type: "hero", playerIndex: opponent.index };
  }

  const killable = enemies
    .filter((card) => card.currentHealth <= getAttack(attacker))
    .sort((a, b) => getAttack(b) - getAttack(a))[0];

  const target = killable || enemies.sort((a, b) => getAttack(b) - getAttack(a))[0];
  return target ? { type: "pact", cardId: target.id } : { type: "hero", playerIndex: opponent.index };
}

function chooseTargetForRule(player, rule) {
  const targets = getAllTargets().filter((target) => isValidTargetForRule(player, rule, target));

  if (targets.length === 0) {
    return null;
  }

  if (rule.includes("ally")) {
    return targets.sort((a, b) => {
      const aMissing = getMaxHealth(a.card) - a.card.currentHealth;
      const bMissing = getMaxHealth(b.card) - b.card.currentHealth;
      return bMissing - aMissing;
    })[0];
  }

  if (rule === "enemyAny") {
    const opponent = getOpponent(player.index);
    if (opponent.life <= 5) {
      return { type: "hero", playerIndex: opponent.index, player: opponent };
    }
  }

  return targets
    .filter((target) => target.type === "pact")
    .sort((a, b) => getAttack(b.card) - getAttack(a.card))[0] || targets[0];
}

function isSameBotTurn(bot, battleId) {
  return Boolean(
    battleId === state.battleId &&
    !state.gameOver &&
    state.players[state.activePlayerIndex] &&
    state.players[state.activePlayerIndex].index === bot.index &&
    bot.role === "bot"
  );
}

function checkGameOver() {
  if (state.gameOver || state.players.length < 2) {
    return;
  }

  const defeated = state.players.find((player) => player.life <= 0 || player.destroyedPacts >= MAX_PACTS);

  if (!defeated) {
    return;
  }

  const winner = getOpponent(defeated.index);
  state.gameOver = true;
  state.winnerIndex = winner.index;
  state.screen = "result";

  if (defeated.life <= 0) {
    state.statusMessage = `${defeated.heroName} ficou sem Vida.`;
  } else {
    state.statusMessage = `${defeated.heroName} perdeu seus 3 Pactos.`;
  }

  logAction(state.statusMessage);
  updateUI();
}

function renderResult() {
  const winner = state.players[state.winnerIndex];
  const humanWon = winner && winner.role === "human";

  resultTitle.textContent = humanWon ? "Vitória" : "Derrota";
  resultText.textContent = state.statusMessage || (humanWon ? "Você venceu o duelo." : "O oponente venceu o duelo.");
}

function logAction(message) {
  state.log.unshift(message);
  state.log = state.log.slice(0, 80);

  if (gameLog) {
    gameLog.innerHTML = state.log.map((entry) => `<p class="log-entry">${escapeHtml(entry)}</p>`).join("");
  }
}

function showMessage(message) {
  state.statusMessage = message;
  updateUI();
}

function flashTurnSplash(message) {
  if (!turnSplash) {
    return;
  }

  turnSplash.textContent = message;
  turnSplash.classList.remove("show");
  void turnSplash.offsetWidth;
  turnSplash.classList.add("show");
}

function toggleBattlePanel(panel) {
  state.floatingPanel = state.floatingPanel === panel ? null : panel;
  renderFloatingPanels();
}

function renderFloatingPanels() {
  if (!logDrawer || !rulesDrawer) {
    return;
  }

  logDrawer.hidden = state.floatingPanel !== "log";
  rulesDrawer.hidden = state.floatingPanel !== "rules";
  logDrawer.classList.toggle("is-open", state.floatingPanel === "log");
  rulesDrawer.classList.toggle("is-open", state.floatingPanel === "rules");
  toggleLogButton.classList.toggle("active-toggle", state.floatingPanel === "log");
  toggleRulesButton.classList.toggle("active-toggle", state.floatingPanel === "rules");
  toggleLogButton.setAttribute("aria-expanded", String(state.floatingPanel === "log"));
  toggleRulesButton.setAttribute("aria-expanded", String(state.floatingPanel === "rules"));
}

function openCardModal(detail) {
  if (!modal || !modalBody || !detail) {
    return;
  }

  modalBody.innerHTML = renderModalDetail(detail);
  modal.hidden = false;
  modal.classList.add("is-open");
  document.body.classList.add("modal-open");
}

function closeCardModal() {
  if (!modal) {
    return;
  }

  modal.hidden = true;
  modal.classList.remove("is-open");
  document.body.classList.remove("modal-open");
}

function renderModalDetail(card) {
  const abilities = card.abilities && card.abilities.length ? `
    <div class="modal-section">
      <h3>Habilidades</h3>
      ${card.abilities.map((ability) => `
        <p><strong>${escapeHtml(ability.name)}</strong>${ability.cost ? ` <span>${escapeHtml(formatCost(ability.cost))}</span>` : ""}<br>${escapeHtml(ability.text || "")}</p>
      `).join("")}
    </div>
  ` : "";
  const permanent = card.permanent && card.permanent.length ? `
    <div class="modal-section">
      <h3>Efeitos Permanentes</h3>
      ${card.permanent.map((effect) => `<p>${escapeHtml(effect)}</p>`).join("")}
    </div>
  ` : "";

  return `
    <div class="modal-card-art">${renderCardArt(card, "modal-art")}</div>
    <div class="modal-card-copy">
      <p class="eyebrow">${escapeHtml(TYPE_LABELS[card.type] || "Carta")} · ${escapeHtml(ELEMENT_LABELS[card.element] || "Neutro")}</p>
      <h2>${escapeHtml(card.name)}</h2>
      ${card.title ? `<p class="detail-subtitle">${escapeHtml(card.title)}</p>` : ""}
      <div class="modal-statline">
        ${card.cost ? renderIconStat("mana", card.cost, "Custo") : ""}
        ${card.baseAttack ? renderIconStat("ataque", card.baseAttack, "Ataque") : ""}
        ${card.baseHealth ? renderIconStat("vida_pacto", card.baseHealth, "Vida") : ""}
      </div>
      ${card.passive ? `
        <div class="modal-section">
          <h3>${escapeHtml(card.passiveName || "Passiva")}</h3>
          <p>${escapeHtml(card.passive)}</p>
        </div>
      ` : ""}
      ${permanent}
      ${card.enter ? `
        <div class="modal-section">
          <h3>Ao Entrar</h3>
          <p>${escapeHtml(card.enter)}</p>
        </div>
      ` : ""}
      ${abilities}
      ${card.effect ? `
        <div class="modal-section">
          <h3>Descrição</h3>
          <p>${escapeHtml(card.effect)}</p>
        </div>
      ` : ""}
      ${card.exclusive ? `<p class="detail-subtitle">Exclusivo de ${escapeHtml(card.exclusive)}</p>` : ""}
    </div>
  `;
}

function buildDetailFromElement(element) {
  const type = element.dataset.detailType;

  if (type === "card-key") {
    return createCard(element.dataset.detailCardKey);
  }

  if (type === "card") {
    const card = findCardById(element.dataset.detailCardId);
    return card ? { ...card } : null;
  }

  if (type === "hero") {
    const player = state.players[Number(element.dataset.detailPlayerIndex)];
    return player ? createHeroCard(player) : null;
  }

  if (type === "realm") {
    const player = state.players[Number(element.dataset.detailPlayerIndex)];
    return player && player.realm ? player.realm : null;
  }

  if (type === "primordial") {
    const player = state.players[Number(element.dataset.detailPlayerIndex)];
    return player ? player.primordial : null;
  }

  return null;
}

function findCardById(cardId) {
  for (const player of state.players) {
    const fieldCard = player.pacts.find((card) => card && card.id === cardId);
    if (fieldCard) {
      return fieldCard;
    }
    if (player.primordial && player.primordial.id === cardId) {
      return player.primordial;
    }
    const handCard = player.hand.find((card) => card.id === cardId);
    if (handCard) {
      return handCard;
    }
  }
  return null;
}

function handleDoubleClick(event) {
  const detailElement = event.target.closest("[data-detail-type]");
  if (!detailElement) {
    return;
  }

  window.clearTimeout(clickTimer);
  clickTimer = null;
  event.preventDefault();
  event.stopPropagation();
  openCardModal(buildDetailFromElement(detailElement));
}

function handleClick(event) {
  if (event.target.closest(".modal-close")) {
    closeCardModal();
    return;
  }

  if (event.target === modal) {
    closeCardModal();
    return;
  }

  if (event.detail > 1) {
    window.clearTimeout(clickTimer);
    clickTimer = null;
    return;
  }

  const target = event.target;
  window.clearTimeout(clickTimer);
  clickTimer = window.setTimeout(() => {
    processClick(target);
  }, CLICK_DELAY);
}

function processClick(target) {
  const screenButton = target.closest("[data-screen]");
  if (screenButton) {
    state.screen = screenButton.dataset.screen;
    updateUI();
    return;
  }

  const heroChoice = target.closest("[data-select-hero]");
  if (heroChoice) {
    selectHero(heroChoice.dataset.selectHero);
    return;
  }

  const handCard = target.closest("[data-hand-index]");
  if (handCard) {
    playCard(Number(handCard.dataset.handIndex));
    return;
  }

  const swapButton = target.closest("[data-swap-slot]");
  if (swapButton) {
    swapPact(state.players[0], Number(swapButton.dataset.swapSlot));
    return;
  }

  const abilityButton = target.closest("[data-ability-card-id]");
  if (abilityButton) {
    usePactAbility(abilityButton.dataset.abilityCardId, Number(abilityButton.dataset.abilityIndex));
    return;
  }

  const primordialAbility = target.closest("[data-primordial-ability-player-index]");
  if (primordialAbility && !primordialAbility.classList.contains("disabled")) {
    usePrimordialAbility(Number(primordialAbility.dataset.primordialAbilityPlayerIndex));
    return;
  }

  const fieldCard = target.closest("[data-field-index][data-field-slot]");
  if (fieldCard) {
    handleFieldClick(Number(fieldCard.dataset.fieldIndex), Number(fieldCard.dataset.fieldSlot));
    return;
  }

  const hero = target.closest("[data-hero-index]");
  if (hero) {
    handleHeroClick(Number(hero.dataset.heroIndex));
    return;
  }

  const primordial = target.closest("[data-primordial-index]");
  if (primordial) {
    handlePrimordialClick(Number(primordial.dataset.primordialIndex));
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function sleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

document.addEventListener("click", handleClick);
document.addEventListener("dblclick", handleDoubleClick);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (state.pendingTarget) {
      state.pendingTarget = null;
      showMessage("Alvo cancelado.");
      return;
    }
    closeCardModal();
  }
});

document.getElementById("startMenuButton").addEventListener("click", () => {
  state.screen = "hero";
  updateUI();
});
document.getElementById("decksMenuButton").addEventListener("click", () => {
  state.screen = "decks";
  updateUI();
});
document.getElementById("collectionMenuButton").addEventListener("click", () => {
  state.screen = "collection";
  updateUI();
});
document.getElementById("settingsMenuButton").addEventListener("click", () => {
  state.screen = "settings";
  updateUI();
});
document.getElementById("creditsMenuButton").addEventListener("click", () => {
  state.screen = "credits";
  updateUI();
});
document.getElementById("howToMenuButton").addEventListener("click", () => {
  state.screen = "howto";
  updateUI();
});

endTurnButton.addEventListener("click", endTurn);
toggleLogButton.addEventListener("click", () => toggleBattlePanel("log"));
toggleRulesButton.addEventListener("click", () => toggleBattlePanel("rules"));
document.getElementById("backToMenuButton").addEventListener("click", startGame);
document.getElementById("resultRestartButton").addEventListener("click", startBattle);
document.getElementById("resultMenuButton").addEventListener("click", startGame);

if (modalClose) {
  modalClose.addEventListener("click", closeCardModal);
}

if (soundToggleButton) {
  soundToggleButton.addEventListener("click", () => {
    soundToggleButton.setAttribute("aria-pressed", soundToggleButton.getAttribute("aria-pressed") !== "true");
    soundToggleButton.textContent = soundToggleButton.getAttribute("aria-pressed") === "true" ? "Som: ligado" : "Som: desligado";
  });
}

if (volumeSlider) {
  volumeSlider.addEventListener("input", () => {});
}

startGame();
