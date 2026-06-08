const MAX_FIELD = 3;
const MAX_HAND = 7;
const BOT_DELAY = 520;
const ICON_ASSETS = {
  vida: "../assets/icons/vida.jpeg",
  mana: "../assets/icons/mana.jpeg",
  sanidade: "../assets/icons/sanidade.jpeg",
  ataque: "../assets/icons/ataque.jpeg",
  vida_pacto: "../assets/icons/vida_pacto.jpeg",
  fragmento_alma: "../assets/icons/fragmento_alma.jpeg",
  deck: "../assets/icons/deck.jpeg",
  abismo: "../assets/icons/abismo.jpeg"
};
const AUDIO_ASSETS = {
  menu: "../assets/audio/menu_theme.mp3",
  battle: "../assets/audio/battle_ambient.mp3",
  draw: "../assets/audio/draw.wav",
  summon: "../assets/audio/summon.wav",
  attack: "../assets/audio/attack.wav",
  damage: "../assets/audio/damage.wav",
  heal: "../assets/audio/heal.wav",
  destroy: "../assets/audio/destroy.wav",
  endTurn: "../assets/audio/end_turn.wav",
  victory: "../assets/audio/victory.wav",
  defeat: "../assets/audio/defeat.wav"
};
const THEME_CLASSES = [
  "theme-fire",
  "theme-water",
  "theme-nature",
  "theme-wind",
  "theme-light",
  "theme-dark"
];

let nextCardId = 1;

const CARD_DEFS = {
  cinzamor: {
    key: "cinzamor",
    name: "Cinzamor",
    type: "pact",
    element: "fire",
    cost: 1,
    attack: 2,
    health: 1,
    image: "../cards/fire/cinzamor.png",
    effect: "Quando entra em campo, cause 1 de dano a um Pacto inimigo."
  },
  ignivar: {
    key: "ignivar",
    name: "Ignivar",
    type: "pact",
    element: "fire",
    cost: 2,
    attack: 3,
    health: 2,
    image: "../cards/fire/ignivar.png",
    effect: "Quando destruir outro Pacto em combate, receba 1 Mana."
  },
  braseon: {
    key: "braseon",
    name: "Braseon, A Coroa Ardente",
    type: "pact",
    element: "fire",
    cost: 3,
    attack: 4,
    health: 4,
    image: "../cards/fire/braseon.png",
    effect: "Enquanto estiver em campo, outros Pactos de Fogo aliados recebem +1 Ataque."
  },
  rubrakar: {
    key: "rubrakar",
    name: "Rubrakar, O Vigia das Fornalhas",
    type: "pact",
    element: "fire",
    cost: 4,
    attack: 4,
    health: 6,
    image: "../cards/fire/rubrakar.png",
    effect: "A primeira vez que outro Pacto de Fogo aliado seria destruído a cada turno, ele sobrevive com 1 Vida."
  },
  varkhan: {
    key: "varkhan",
    name: "Varkhan",
    type: "pact",
    element: "fire",
    cost: 4,
    attack: 6,
    health: 4,
    image: "../cards/fire/varkhan.png",
    effect: "Sempre que atacar, recebe +1 Ataque até o final do turno para cada outro Pacto de Fogo aliado."
  },
  solferro: {
    key: "solferro",
    name: "Solferro, A Sétima Chama",
    type: "pact",
    element: "fire",
    cost: 5,
    attack: 7,
    health: 5,
    image: "../cards/fire/solferro.png",
    effect: "Quando entrar em campo, cause 2 de dano a todos os Pactos inimigos."
  },
  devorabrasa: {
    key: "devorabrasa",
    name: "A Devorabrasa",
    type: "pact",
    element: "fire",
    cost: 6,
    attack: 8,
    health: 7,
    image: "../cards/fire/devorabrasa.png",
    effect: "Quando entrar em campo, destrua um Pacto inimigo com 3 de Vida ou menos."
  },
  chuvaBrasas: {
    key: "chuvaBrasas",
    name: "Chuva de Brasas",
    type: "spell",
    element: "fire",
    cost: 2,
    image: "../cards/spells/fire/chuva_de_brasas.png",
    effect: "Cause 2 de dano a um Pacto inimigo."
  },
  furiaVulcanica: {
    key: "furiaVulcanica",
    name: "Fúria Vulcânica",
    type: "spell",
    element: "fire",
    cost: 3,
    image: "../cards/spells/fire/furia_vulcanica.png",
    effect: "Um Pacto de Fogo aliado recebe +3 Ataque até o final do turno."
  },
  ritualSetimaChama: {
    key: "ritualSetimaChama",
    name: "Ritual da Sétima Chama",
    type: "spell",
    element: "fire",
    cost: 4,
    image: "../cards/spells/fire/ritual_da_setima_chama.png",
    effect: "Compre 2 cartas. Depois ganhe 1 de Sanidade."
  },
  fornalhaInsaciavel: {
    key: "fornalhaInsaciavel",
    name: "Fornalha Insaciável",
    type: "spell",
    element: "fire",
    cost: 4,
    image: "../cards/spells/fire/fornalha_insaciavel.png",
    effect: "Destrua um Pacto aliado. Receba 3 Mana."
  },
  apocalipseCarmesim: {
    key: "apocalipseCarmesim",
    name: "Apocalipse Carmesim",
    type: "spell",
    element: "fire",
    cost: 6,
    image: "../cards/spells/fire/apocalipse_carmesim.png",
    effect: "Cause 3 de dano a todos os Pactos inimigos."
  },
  thalora: {
    key: "thalora",
    name: "Thalora",
    type: "pact",
    element: "water",
    cost: 1,
    attack: 1,
    health: 3,
    image: "../cards/water/thalora.png",
    effect: "Quando entrar em campo, cure 1 de Vida de um Pacto aliado."
  },
  nauren: {
    key: "nauren",
    name: "Nauren",
    type: "pact",
    element: "water",
    cost: 2,
    attack: 2,
    health: 3,
    image: "../cards/water/nauren.png",
    effect: "Quando entrar em campo, compre 1 carta."
  },
  marem: {
    key: "marem",
    name: "Marem",
    type: "pact",
    element: "water",
    cost: 2,
    attack: 3,
    health: 2,
    image: "../cards/water/marem.png",
    effect: "Sempre que atacar, recebe +1 Vida até o início do próximo turno do dono."
  },
  lysora: {
    key: "lysora",
    name: "Lysora",
    type: "pact",
    element: "water",
    cost: 3,
    attack: 3,
    health: 5,
    image: "../cards/water/lysora.png",
    effect: "Enquanto estiver em campo, outros Pactos de Água aliados recebem +1 Vida."
  },
  nereth: {
    key: "nereth",
    name: "Nereth",
    type: "pact",
    element: "water",
    cost: 4,
    attack: 4,
    health: 5,
    image: "../cards/water/nereth.png",
    effect: "Quando entrar em campo, devolva um Pacto inimigo com custo 2 ou menos para a mão do dono."
  },
  velkaris: {
    key: "velkaris",
    name: "Velkaris",
    type: "pact",
    element: "water",
    cost: 5,
    attack: 5,
    health: 7,
    image: "../cards/water/velkaris.png",
    effect: "Quando entrar em campo, um Pacto inimigo recebe -2 Ataque até o final do próximo turno do oponente."
  },
  umbraMar: {
    key: "umbraMar",
    name: "Umbra-Mar",
    type: "pact",
    element: "water",
    cost: 4,
    attack: 5,
    health: 4,
    image: "../cards/water/umbra_mar.png",
    effect: "Sempre que causar dano a um Pacto inimigo, cure 1 de Vida do Herói aliado."
  },
  mareRestauradora: {
    key: "mareRestauradora",
    name: "Maré Restauradora",
    type: "spell",
    element: "water",
    cost: 2,
    image: "../cards/spells/water/mare_restauradora.png",
    effect: "Cure 3 de Vida de um Pacto aliado."
  },
  correnteRetorno: {
    key: "correnteRetorno",
    name: "Corrente de Retorno",
    type: "spell",
    element: "water",
    cost: 3,
    image: "../cards/spells/water/corrente_de_retorno.png",
    effect: "Devolva um Pacto inimigo para a mão do dono."
  },
  cancaoAbissal: {
    key: "cancaoAbissal",
    name: "Canção Abissal",
    type: "spell",
    element: "water",
    cost: 3,
    image: "../cards/spells/water/cancao_abissal.png",
    effect: "Compre 2 cartas."
  },
  escudoMares: {
    key: "escudoMares",
    name: "Escudo das Marés",
    type: "spell",
    element: "water",
    cost: 4,
    image: "../cards/spells/water/escudo_das_mares.png",
    effect: "Um Pacto aliado recebe +3 Vida até o final do próximo turno."
  },
  julgamentoLeviata: {
    key: "julgamentoLeviata",
    name: "Julgamento do Leviatã",
    type: "spell",
    element: "water",
    cost: 6,
    image: "../cards/spells/water/julgamento_do_leviata.png",
    effect: "Cause 4 de dano a um Pacto inimigo."
  },
  reiChamas: {
    key: "reiChamas",
    name: "Rei das Chamas Eternas",
    type: "primordial",
    element: "fire",
    cost: 7,
    attack: 5,
    health: 10,
    image: "../cards/primordials/rei_das_chamas.png",
    effect: "Quando destruir um Pacto inimigo, cure 1 de Vida do Herói aliado."
  },
  maeProfundezas: {
    key: "maeProfundezas",
    name: "A Mãe das Profundezas",
    type: "primordial",
    element: "water",
    cost: 7,
    attack: 4,
    health: 13,
    image: "../cards/primordials/mae_das_profundezas.png",
    effect: "No início do turno do dono, cure 1 de Vida de todos os Pactos aliados."
  }
};

const HEROES = {
  fire: {
    heroName: "Kael Drakar",
    title: "Kael Drakar, o Rei das Chamas Eternas",
    elementLabel: "Fogo",
    style: "Agressão, dano e sacrifício",
    heroImage: "../cards/heroes/Kael.png",
    realm: {
      name: "Fornalha Eterna",
      image: "../cards/realms/fornalha_eterna.png",
      effect: "Pactos de Fogo aliados recebem +1 Ataque."
    },
    primordialKey: "reiChamas"
  },
  water: {
    heroName: "Nereia Val'Kora",
    title: "Nereia Val'Kora, A Mãe das Profundezas",
    elementLabel: "Água",
    style: "Cura, controle e resistência",
    heroImage: "../cards/heroes/nereia.png",
    realm: {
      name: "Maré Profunda",
      image: "../cards/realms/mare_profunda.png",
      effect: "Pactos de Água aliados recebem +1 Vida máxima."
    },
    primordialKey: "maeProfundezas"
  }
};

const DECK_RECIPES = {
  fire: [
    ["cinzamor", 3],
    ["ignivar", 3],
    ["braseon", 3],
    ["rubrakar", 3],
    ["varkhan", 3],
    ["solferro", 2],
    ["devorabrasa", 2],
    ["chuvaBrasas", 3],
    ["furiaVulcanica", 3],
    ["ritualSetimaChama", 2],
    ["fornalhaInsaciavel", 2],
    ["apocalipseCarmesim", 2]
  ],
  water: [
    ["thalora", 3],
    ["nauren", 3],
    ["marem", 3],
    ["lysora", 3],
    ["nereth", 3],
    ["velkaris", 2],
    ["umbraMar", 2],
    ["mareRestauradora", 3],
    ["correnteRetorno", 3],
    ["cancaoAbissal", 2],
    ["escudoMares", 2],
    ["julgamentoLeviata", 2]
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
  audioEnabled: false,
  audioVolume: 0.55,
  primordialReadyNotified: false
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
const sideTurnTitle = document.getElementById("sideTurnTitle");
const cardDetailPanel = document.getElementById("cardDetailPanel");
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
const audioCache = {};

function createCard(cardKey) {
  const definition = typeof cardKey === "string" ? CARD_DEFS[cardKey] : cardKey;

  return {
    id: `${definition.key}-${nextCardId++}`,
    key: definition.key,
    name: definition.name,
    type: definition.type,
    element: definition.element,
    cost: definition.cost,
    image: definition.image,
    effect: definition.effect,
    baseAttack: definition.attack || 0,
    baseHealth: definition.health || 0,
    currentHealth: definition.health || 0,
    ownerIndex: null,
    summonedOnTurn: 0,
    hasAttacked: false,
    attackModifiers: [],
    healthModifiers: []
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
  state.primordialReadyNotified = false;
  renderEmptyCardDetail();
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
  state.primordialReadyNotified = false;
  renderEmptyCardDetail();

  state.players.forEach((player) => {
    drawCard(player, 3, { silent: true });
    logAction(`${player.heroName} comprou 3 cartas iniciais.`);
  });

  logAction(`Você escolheu ${state.players[0].heroName}. O bot joga com ${state.players[1].heroName}.`);
  beginTurn(state.activePlayerIndex);
}

function buildPlayer(index, role, element) {
  const hero = HEROES[element];
  const deck = createDeck(element);
  const primordial = createCard(hero.primordialKey);
  const player = {
    index,
    role,
    label: role === "human" ? "Jogador" : "Bot",
    element,
    elementLabel: hero.elementLabel,
    deckStyle: hero.style,
    heroName: hero.heroName,
    heroImage: hero.heroImage,
    realm: hero.realm,
    life: 20,
    maxLife: 20,
    manaMax: 5,
    mana: 5,
    sanity: 0,
    turnsTaken: 0,
    deck,
    hand: [],
    discard: [],
    field: Array(MAX_FIELD).fill(null),
    primordial,
    primordialSummoned: false,
    primordialDestroyed: false,
    rubrakarSaveUsed: false
  };

  deck.forEach((card) => {
    card.ownerIndex = index;
  });
  primordial.ownerIndex = index;

  return player;
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
    const plural = drawn === 1 ? "carta" : "cartas";
    logAction(`${player.heroName} comprou ${drawn} ${plural}.`);
    showBattleFeedback("draw", `+${drawn} ${plural}`);
    playSfx("draw");
  }

  return drawn;
}

function beginTurn(playerIndex) {
  if (state.gameOver) {
    return;
  }

  const player = state.players[playerIndex];
  state.activePlayerIndex = playerIndex;
  state.selectedAttackerId = null;
  state.pendingTarget = null;
  state.players.forEach((currentPlayer) => {
    currentPlayer.rubrakarSaveUsed = false;
  });

  player.turnsTaken += 1;
  expireEffectsFor(player.index, player.turnsTaken, "start");
  player.manaMax += 1;
  player.mana = player.manaMax;

  player.field.forEach((card) => {
    if (!card) {
      return;
    }

    card.hasAttacked = false;
    healPact(card, 1, { silent: true });
  });

  if (hasPact(player, "maeProfundezas")) {
    player.field.forEach((card) => {
      if (card) {
        healPact(card, 1, { silent: true });
      }
    });
    logAction("A Mãe das Profundezas curou 1 de Vida de todos os Pactos aliados.");
  }

  drawCard(player, 1);
  logAction(`Começou o turno de ${player.heroName}.`);
  state.statusMessage = player.role === "bot" ? "O bot está pensando..." : `Seu turno com ${player.heroName}.`;
  updateUI();
  flashTurnSplash(player.role === "bot" ? "Turno do Oponente" : "Seu Turno");

  if (player.role === "bot") {
    const battleId = state.battleId;
    window.setTimeout(() => botTurn(battleId), BOT_DELAY);
  }
}

function updateUI() {
  applyVisualTheme();
  updateAudioControls();

  Object.entries(screens).forEach(([key, screen]) => {
    screen.classList.toggle("active", state.screen === key);
  });

  renderDeckLists();

  if (state.players.length > 0) {
    renderBattle();
  }

  if (state.screen === "result") {
    renderResult();
  }
}

function applyVisualTheme() {
  document.body.classList.remove(...THEME_CLASSES);

  const theme = state.humanElement || "fire";

  if (THEME_CLASSES.includes(`theme-${theme}`)) {
    document.body.classList.add(`theme-${theme}`);
  }
}

function renderBattle() {
  const human = state.players.find((player) => player.role === "human");
  const bot = state.players.find((player) => player.role === "bot");

  botArea.classList.toggle("active", bot.index === state.activePlayerIndex);
  humanArea.classList.toggle("active", human.index === state.activePlayerIndex);
  botArea.innerHTML = renderPlayerBoard(bot, true);
  humanArea.innerHTML = renderPlayerBoard(human, false);

  const activePlayer = state.players[state.activePlayerIndex];
  turnTitle.textContent = activePlayer.role === "bot" ? "Turno do Oponente" : "Seu Turno";
  if (sideTurnTitle) {
    sideTurnTitle.textContent = activePlayer.role === "bot" ? "Turno do Oponente" : "Seu Turno";
  }
  statusText.textContent = state.pendingTarget
    ? state.pendingTarget.message
    : `${activePlayer.heroName} - ${state.statusMessage}`;
  endTurnButton.disabled = state.gameOver || state.botThinking || activePlayer.role !== "human";
  renderFloatingPanels();
  renderLog();
  notifyPrimordialReady();
}

function renderFloatingPanels() {
  const logOpen = state.floatingPanel === "log";
  const rulesOpen = state.floatingPanel === "rules";

  if (logDrawer) {
    logDrawer.hidden = !logOpen;
    logDrawer.classList.toggle("is-open", logOpen);
    if (logOpen) {
      logDrawer.classList.remove("is-closing");
    }
  }

  if (rulesDrawer) {
    rulesDrawer.hidden = !rulesOpen;
    rulesDrawer.classList.toggle("is-open", rulesOpen);
    if (rulesOpen) {
      rulesDrawer.classList.remove("is-closing");
    }
  }

  if (toggleLogButton) {
    toggleLogButton.classList.toggle("active-toggle", logOpen);
    toggleLogButton.setAttribute("aria-expanded", String(logOpen));
  }

  if (toggleRulesButton) {
    toggleRulesButton.classList.toggle("active-toggle", rulesOpen);
    toggleRulesButton.setAttribute("aria-expanded", String(rulesOpen));
  }
}

function notifyPrimordialReady() {
  const human = state.players.find((player) => player.role === "human");
  const ready = Boolean(human && canInvokePrimordial(human));

  if (ready && !state.primordialReadyNotified) {
    state.primordialReadyNotified = true;
    showBattleFeedback("primordial-ready", "Primordial disponível");
    playSfx("summon");
  }

  if (!ready) {
    state.primordialReadyNotified = false;
  }
}

function renderPlayerBoard(player, isBotBoard) {
  const sanity = getSanityState(player.sanity);
  const active = player.index === state.activePlayerIndex;
  const hand = isBotBoard ? renderBotHand(player) : renderHumanHand(player);
  const field = player.field.map((card, slot) => renderFieldSlot(player, card, slot)).join("");
  const primordialState = getPrimordialState(player);
  const directTarget = canHeroBeDirectTarget(player);

  return `
    <div class="player-layout element-${player.element} ${active ? "active-layout" : ""}">
      <button type="button" class="hero-panel element-${player.element} ${directTarget ? "direct-target" : ""}" data-hero-index="${player.index}" data-detail-type="hero" data-detail-player-index="${player.index}">
        <div class="portrait-frame">
          <img src="${escapeHtml(player.heroImage)}" alt="${escapeHtml(player.heroName)}">
        </div>
        <div class="hero-body">
          <p class="eyebrow">${escapeHtml(player.label)} / ${escapeHtml(player.elementLabel)}</p>
          <h3>${escapeHtml(player.heroName)}</h3>
          <div class="stat-grid">
            <div class="stat">
              ${renderInlineStat("vida", `${player.life}/${player.maxLife}`, "Vida")}
            </div>
            <div class="stat">
              ${renderInlineStat("mana", `${player.mana}/${player.manaMax}`, "Mana")}
            </div>
            <div class="stat ${sanity.className}">
              ${renderInlineStat("sanidade", player.sanity, "Sanidade")}
            </div>
            <div class="stat ${sanity.className}">
              <span class="stat-label">Estado</span>
              <strong>${sanity.label}</strong>
            </div>
          </div>
        </div>
      </button>

      <div class="board-zone">
        <div class="field-zone">
          <p class="zone-label">${isBotBoard ? "Campo do Oponente" : "Seu Campo"}</p>
          <div class="field-grid">${field}</div>
        </div>
        <div class="hand-zone ${isBotBoard ? "bot-hand-zone" : "human-hand-zone"}">
          <p class="zone-label">${isBotBoard ? `Mão do Bot (${player.hand.length})` : `Sua Mão (${player.hand.length}/${MAX_HAND})`}</p>
          <div class="hand-row">${hand}</div>
        </div>
      </div>

      <div class="side-panel">
        <article class="asset-card realm-card element-${player.element}" data-detail-type="realm" data-detail-player-index="${player.index}">
          <div class="support-image">
            <img src="${escapeHtml(player.realm.image)}" alt="${escapeHtml(player.realm.name)}">
          </div>
          <div class="asset-body">
            <p class="card-type">Reino Ativo</p>
            <h3>${escapeHtml(player.realm.name)}</h3>
            <p>${escapeHtml(player.realm.effect)}</p>
          </div>
        </article>

        <button type="button" class="primordial-button element-${player.element} ${primordialState.className}" data-primordial-index="${player.index}" data-detail-type="primordial" data-detail-player-index="${player.index}">
          <div class="support-image">
            <img src="${escapeHtml(player.primordial.image)}" alt="${escapeHtml(player.primordial.name)}">
          </div>
          <div class="primordial-body">
            <p class="card-type">Pacto Primordial</p>
            <h3>${escapeHtml(player.primordial.name)}</h3>
            <div class="primordial-stats">
              <span class="primordial-status">${escapeHtml(primordialState.label)}</span>
              ${renderInlineStat("mana", player.primordial.cost, "Mana")}
              ${renderInlineStat("ataque", player.primordial.baseAttack, "Ataque")}
              ${renderInlineStat("vida_pacto", player.primordial.baseHealth, "Vida do Pacto")}
            </div>
            <p>${escapeHtml(player.primordial.effect)}</p>
          </div>
        </button>

        <div class="pile-row">
          <article class="pile-card deck-pile" aria-label="Deck: ${player.deck.length}" data-detail-type="deck" data-detail-player-index="${player.index}">
            <span class="pile-icon">${renderIcon("deck", "Deck")}</span>
            <span class="pile-label">Deck</span>
            <strong>${player.deck.length}</strong>
          </article>
          <article class="pile-card abyss-pile" aria-label="Abismo: ${player.discard.length}" data-detail-type="abismo" data-detail-player-index="${player.index}">
            <span class="pile-icon">${renderIcon("abismo", "Abismo")}</span>
            <span class="pile-label">Abismo</span>
            <strong>${player.discard.length}</strong>
          </article>
        </div>
      </div>
    </div>
  `;
}

function renderHumanHand(player) {
  if (player.hand.length === 0) {
    return "<span class=\"empty-slot\">Sem cartas</span>";
  }

  return player.hand.map((card, index) => {
    const playable = canPlayCard(player, card);

    return `
      <button type="button" class="card image-card hand-card element-${card.element} ${playable ? "playable" : ""}" data-hand-index="${index}" data-detail-type="card" data-detail-card-id="${card.id}" title="${escapeHtml(card.name)}">
        <img class="full-card-image" src="${escapeHtml(card.image)}" alt="${escapeHtml(card.name)}">
      </button>
    `;
  }).join("");
}

function renderBotHand(player) {
  if (player.hand.length === 0) {
    return "<span class=\"empty-slot\">Sem cartas</span>";
  }

  return player.hand.map(() => "<div class=\"card-back\" aria-label=\"Carta do Bot\"><span></span></div>").join("");
}

function renderFieldSlot(player, card, slot) {
  if (!card) {
    const canReceiveSummon = canHumanAct() && player.index === 0 && player.field.some((fieldSlot) => fieldSlot === null);

    return `
      <div class="field-slot ${canReceiveSummon ? "summon-ready-slot" : ""}" data-field-index="${player.index}" data-field-slot="${slot}">
        <span class="empty-slot">Espaço vazio</span>
      </div>
    `;
  }

  const selected = state.selectedAttackerId === card.id;
  const targetable = isTargetable(card);
  const canCardAttack = canAttack(card);

  return `
    <div class="field-slot" data-field-index="${player.index}" data-field-slot="${slot}">
      <button type="button" class="card image-card field-card element-${card.element} ${canCardAttack ? "can-attack" : ""} ${selected ? "selected" : ""} ${targetable ? "targetable" : ""}" data-field-index="${player.index}" data-field-slot="${slot}" data-detail-type="card" data-detail-card-id="${card.id}" title="${escapeHtml(card.name)}">
        <img class="full-card-image" src="${escapeHtml(card.image)}" alt="${escapeHtml(card.name)}">
        <span class="field-card-state">
          ${renderInlineStat("ataque", getAttack(card), "Ataque")}
          ${renderInlineStat("vida_pacto", `${card.currentHealth}/${getMaxHealth(card)}`, "Vida do Pacto")}
        </span>
      </button>
    </div>
  `;
}

function renderCardStats(card) {
  if (card.type === "spell") {
    return "";
  }

  return `
    <div class="card-stats">
      ${renderInlineStat("ataque", card.baseAttack, "Ataque")}
      ${renderInlineStat("vida_pacto", card.baseHealth, "Vida do Pacto")}
    </div>
  `;
}

function renderDeckLists() {
  if (!deckLists || deckLists.dataset.ready === "true") {
    return;
  }

  deckLists.innerHTML = ["fire", "water"].map((element) => {
    const hero = HEROES[element];
    const rows = DECK_RECIPES[element].map(([cardKey, copies]) => {
      const card = CARD_DEFS[cardKey];
      const stats = card.type === "spell"
        ? "<span class=\"deck-card-type\">Magia</span>"
        : `${renderInlineStat("ataque", card.attack, "Ataque")} ${renderInlineStat("vida_pacto", card.health, "Vida do Pacto")}`;

      return `
        <div class="deck-row">
          <img src="${escapeHtml(card.image)}" alt="${escapeHtml(card.name)}">
          <span>
            <strong>${escapeHtml(card.name)}</strong>
            <span class="deck-card-stats">
              ${renderInlineStat("mana", card.cost, "Mana")}
              ${stats}
            </span>
          </span>
          <strong class="copy-count">${copies}x</strong>
        </div>
      `;
    }).join("");

    return `
      <article class="deck-column element-${element}">
        <p class="eyebrow">${escapeHtml(hero.elementLabel)}</p>
        <h3>${escapeHtml(hero.heroName)}</h3>
        <div class="deck-list">${rows}</div>
      </article>
    `;
  }).join("");
  deckLists.dataset.ready = "true";
}

function renderLog() {
  gameLog.innerHTML = state.log
    .slice(-50)
    .reverse()
    .map((entry) => `<p class="log-entry">${escapeHtml(entry)}</p>`)
    .join("");
}

function renderIcon(iconKey, label) {
  const iconLabel = label || getIconLabel(iconKey);
  const iconPath = ICON_ASSETS[iconKey];

  if (!iconPath) {
    return `
      <span class="resource-icon resource-icon-${escapeHtml(iconKey)} icon-missing" aria-label="${escapeHtml(iconLabel)}"></span>
    `;
  }

  return `
    <span class="resource-icon resource-icon-${escapeHtml(iconKey)}" aria-label="${escapeHtml(iconLabel)}">
      <img src="${escapeHtml(iconPath)}" alt="" onerror="this.parentElement.classList.add('icon-missing'); this.removeAttribute('src');">
    </span>
  `;
}

function renderInlineStat(iconKey, value, label, className = "") {
  return `
    <span class="icon-stat ${escapeHtml(className)}">
      ${renderIcon(iconKey, label)}
      <strong>${escapeHtml(value)}</strong>
    </span>
  `;
}

function renderDetailStat(item) {
  if (typeof item === "string") {
    return `<span>${escapeHtml(item)}</span>`;
  }

  return `
    <span class="detail-icon-stat">
      ${renderIcon(item.icon, item.label)}
      <strong>${escapeHtml(item.value)}</strong>
    </span>
  `;
}

function getIconLabel(iconKey) {
  const labels = {
    vida: "Vida",
    mana: "Mana",
    sanidade: "Sanidade",
    ataque: "Ataque",
    vida_pacto: "Vida do Pacto",
    fragmento_alma: "Fragmento de Alma",
    deck: "Deck",
    abismo: "Abismo"
  };

  return labels[iconKey] || iconKey;
}

function getAudio(name) {
  if (!AUDIO_ASSETS[name]) {
    return null;
  }

  if (!audioCache[name]) {
    const audio = new Audio(AUDIO_ASSETS[name]);
    audio.preload = "auto";
    audio.volume = state.audioVolume;
    audioCache[name] = audio;
  }

  return audioCache[name];
}

function playSfx(name) {
  if (!state.audioEnabled) {
    return;
  }

  const audio = getAudio(name);

  if (!audio) {
    return;
  }

  audio.volume = state.audioVolume;
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

function updateAudioControls() {
  if (soundToggleButton) {
    soundToggleButton.textContent = state.audioEnabled ? "Som: ligado" : "Som: desligado";
    soundToggleButton.setAttribute("aria-pressed", String(state.audioEnabled));
    soundToggleButton.classList.toggle("active-toggle", state.audioEnabled);
  }

  if (volumeSlider) {
    volumeSlider.value = Math.round(state.audioVolume * 100);
  }

  Object.values(audioCache).forEach((audio) => {
    audio.volume = state.audioVolume;
  });
}

function toggleAudio() {
  state.audioEnabled = !state.audioEnabled;
  updateAudioControls();
  playSfx("endTurn");
}

function setAudioVolume(value) {
  const parsed = Number(value);
  state.audioVolume = Number.isFinite(parsed) ? Math.max(0, Math.min(1, parsed / 100)) : state.audioVolume;
  updateAudioControls();
}

function flashTurnSplash(text) {
  if (!turnSplash || state.screen !== "battle") {
    return;
  }

  turnSplash.textContent = text;
  turnSplash.classList.add("effect-turn-banner");
  turnSplash.classList.remove("show");
  window.requestAnimationFrame(() => {
    turnSplash.classList.add("show");
  });
  window.setTimeout(() => {
    turnSplash.classList.remove("show");
    turnSplash.classList.remove("effect-turn-banner");
  }, 1450);
}

function showBattleFeedback(type, text) {
  const battleScreen = screens.battle;

  if (!battleScreen) {
    return;
  }

  const feedback = document.createElement("div");
  feedback.className = `battle-feedback effect-${type}`;
  feedback.textContent = text;
  battleScreen.appendChild(feedback);

  window.setTimeout(() => {
    feedback.remove();
  }, 900);
}

function renderResult() {
  const humanWon = state.winnerIndex === 0;
  resultTitle.textContent = humanWon ? "Vitória" : "Derrota";
  resultText.textContent = humanWon
    ? "Você reduziu a Vida do Herói inimigo a 0."
    : "O bot venceu esta partida.";
}

function renderEmptyCardDetail() {
  if (!cardDetailPanel) {
    return;
  }

  cardDetailPanel.innerHTML = `
    <p class="eyebrow">Grimório</p>
    <div class="detail-empty">
      <strong>Arquivo selado</strong>
      <span>Passe o mouse sobre uma carta, Reino, Herói ou Primordial para abrir os registros.</span>
    </div>
  `;
}

function renderCardDetail(detail) {
  if (!cardDetailPanel || !detail) {
    renderEmptyCardDetail();
    return;
  }

  const stats = detail.stats
    ? `<div class="detail-statline">${detail.stats.map((item) => renderDetailStat(item)).join("")}</div>`
    : "";
  const lore = detail.lore ? `<p class="detail-lore">${escapeHtml(detail.lore)}</p>` : "";

  cardDetailPanel.innerHTML = `
    <p class="eyebrow">Grimório</p>
    <div class="detail-image-wrap ${detail.horizontal ? "detail-image-horizontal" : ""}">
      <img class="${detail.fullCard ? "full-card-image" : ""}" src="${escapeHtml(detail.image)}" alt="${escapeHtml(detail.name)}">
    </div>
    <div class="detail-body">
      <h3>${escapeHtml(detail.name)}</h3>
      <p class="detail-subtitle">${escapeHtml(detail.type)}${detail.element ? ` | ${escapeHtml(detail.element)}` : ""}</p>
      ${stats}
      <p>${escapeHtml(detail.effect || "")}</p>
      ${lore}
    </div>
  `;
}

function handleDetailHover(event) {
  const element = event.target.closest("[data-detail-type]");

  if (!element || !document.getElementById("battleScreen").contains(element)) {
    return;
  }

  const detail = getDetailForElement(element);

  if (detail) {
    renderCardDetail(detail);
  }
}

function getDetailForElement(element) {
  const type = element.dataset.detailType;

  if (type === "card") {
    const location = getVisibleCardById(element.dataset.detailCardId);

    if (!location) {
      return null;
    }

    const card = location.card;
    const isField = location.zone === "field";
    const stats = [
      `Raridade ${getRarityLabel(card)}`,
      { icon: "mana", value: card.cost, label: "Mana" }
    ];

    if (card.type !== "spell") {
      stats.push({ icon: "ataque", value: isField ? getAttack(card) : card.baseAttack, label: "Ataque" });
      stats.push({
        icon: "vida_pacto",
        value: isField ? `${card.currentHealth}/${getMaxHealth(card)}` : card.baseHealth,
        label: "Vida do Pacto"
      });
    }

    return {
      image: card.image,
      name: card.name,
      type: getTypeLabel(card.type),
      element: getElementLabel(card.element),
      stats,
      effect: card.effect,
      lore: card.lore || getDefaultLore(card),
      fullCard: true
    };
  }

  const player = state.players[Number(element.dataset.detailPlayerIndex)];

  if (!player) {
    return null;
  }

  if (type === "hero") {
    const sanity = getSanityState(player.sanity);

    return {
      image: player.heroImage,
      name: player.heroName,
      type: "Herói",
      element: player.elementLabel,
      stats: [
        `Raridade Heróica`,
        { icon: "vida", value: `${player.life}/${player.maxLife}`, label: "Vida" },
        { icon: "mana", value: `${player.mana}/${player.manaMax}`, label: "Mana" },
        { icon: "sanidade", value: player.sanity, label: "Sanidade" },
        sanity.label
      ],
      effect: player.deckStyle,
      lore: player.element === "fire"
        ? "Kael governa pela chama: cada vitória custa cinzas, juramentos e sangue antigo."
        : "Nereia conduz as marés profundas, curando aliados enquanto arrasta inimigos para o silêncio."
    };
  }

  if (type === "realm") {
    return {
      image: player.realm.image,
      name: player.realm.name,
      type: "Reino Ativo",
      element: player.elementLabel,
      stats: [`Raridade Única`, `Elemento ${player.elementLabel}`],
      effect: player.realm.effect,
      lore: "Um domínio vivo. Enquanto estiver ativo, o campo inteiro respira a vontade do seu Herói.",
      horizontal: true
    };
  }

  if (type === "deck") {
    return {
      image: ICON_ASSETS.deck,
      name: "Deck",
      type: "Pilha de compra",
      element: player.elementLabel,
      stats: [
        { icon: "deck", value: player.deck.length, label: "Deck" },
        `Cartas na mão ${player.hand.length}/${MAX_HAND}`
      ],
      effect: "Cartas restantes para compra. A cada turno, o jogador ativo compra 1 carta.",
      lore: "O grimório fechado guarda pactos ainda não revelados.",
      fullCard: false
    };
  }

  if (type === "abismo") {
    return {
      image: ICON_ASSETS.abismo,
      name: "Abismo",
      type: "Descarte",
      element: player.elementLabel,
      stats: [
        { icon: "abismo", value: player.discard.length, label: "Abismo" }
      ],
      effect: "Cartas usadas, destruídas ou descartadas repousam aqui.",
      lore: "Tudo que cai no Abismo deixa uma sombra no campo de batalha.",
      fullCard: false
    };
  }

  if (type === "primordial") {
    const primordial = player.primordial;
    const status = getPrimordialState(player).label;

    return {
      image: primordial.image,
      name: primordial.name,
      type: "Pacto Primordial",
      element: getElementLabel(primordial.element),
      stats: [
        `Raridade Lendária`,
        `${status}`,
        { icon: "mana", value: primordial.cost, label: "Mana" },
        { icon: "ataque", value: primordial.baseAttack, label: "Ataque" },
        { icon: "vida_pacto", value: primordial.baseHealth, label: "Vida do Pacto" }
      ],
      effect: primordial.effect,
      lore: primordial.lore || getDefaultLore(primordial),
      fullCard: false
    };
  }

  return null;
}

function getRarityLabel(card) {
  if (card.type === "primordial") {
    return "Lendária";
  }

  if (card.type === "spell") {
    if (card.cost >= 6) {
      return "Épica";
    }

    if (card.cost >= 4) {
      return "Rara";
    }

    return "Comum";
  }

  if (card.cost >= 6) {
    return "Épica";
  }

  if (card.cost >= 4) {
    return "Rara";
  }

  if (card.cost >= 2) {
    return "Incomum";
  }

  return "Comum";
}

function getDefaultLore(card) {
  if (card.type === "primordial") {
    return card.element === "fire"
      ? "Quando sua coroa desperta, antigas fornalhas respondem como tambores de guerra."
      : "Nas profundezas, sua voz é uma maré que transforma medo em devoção.";
  }

  if (card.type === "spell") {
    return card.element === "fire"
      ? "Um encantamento preservado em brasas, escrito para terminar batalhas antes que a fumaça assente."
      : "Uma maré de magia antiga, paciente como o abismo e precisa como lâmina ritual.";
  }

  return card.element === "fire"
    ? "Forjado entre juramentos ardentes, este Pacto prefere glória curta a silêncio eterno."
    : "Nascido sob águas negras, este Pacto vence pela resistência, pelo frio e pela espera.";
}

function getVisibleCardById(cardId) {
  for (const player of state.players) {
    const handCard = player.role === "human" ? player.hand.find((card) => card.id === cardId) : null;

    if (handCard) {
      return { card: handCard, player, zone: "hand" };
    }

    const fieldCard = player.field.find((card) => card && card.id === cardId);

    if (fieldCard) {
      return { card: fieldCard, player, zone: "field" };
    }
  }

  return null;
}

function getTypeLabel(type) {
  const labels = {
    pact: "Pacto",
    primordial: "Pacto Primordial",
    spell: "Magia"
  };

  return labels[type] || type;
}

function getElementLabel(element) {
  const labels = {
    fire: "Fogo",
    water: "Água"
  };

  return labels[element] || element || "";
}

function playCard(handIndex) {
  const player = state.players[0];

  if (!canHumanAct()) {
    return false;
  }

  if (state.pendingTarget) {
    showMessage("Escolha o alvo destacado antes de jogar outra carta.");
    return false;
  }

  const card = player.hand[handIndex];

  if (!card) {
    return false;
  }

  if (card.type === "pact") {
    return summonPact(player, handIndex);
  }

  return castSpell(player, handIndex);
}

function summonPact(player, source, options = {}) {
  if (state.gameOver) {
    return false;
  }

  const fromHand = Number.isInteger(source);
  const sourceCard = fromHand ? player.hand[source] : source;

  if (!sourceCard || (sourceCard.type !== "pact" && sourceCard.type !== "primordial")) {
    return false;
  }

  const emptySlot = player.field.findIndex((slot) => slot === null);

  if (emptySlot === -1) {
    showMessage("O campo está cheio. O limite é de 3 Pactos ativos.");
    return false;
  }

  if (player.mana < sourceCard.cost) {
    showMessage(`Mana insuficiente para invocar ${sourceCard.name}.`);
    return false;
  }

  if (!fromHand && !options.primordial) {
    return false;
  }

  if (options.primordial && !canInvokePrimordial(player)) {
    showMessage("O Pacto Primordial ainda não pode ser invocado.");
    return false;
  }

  player.mana -= sourceCard.cost;

  if (fromHand) {
    player.hand.splice(source, 1);
  }

  const fieldCard = createCard(sourceCard.key);
  fieldCard.ownerIndex = player.index;
  fieldCard.summonedOnTurn = player.turnsTaken;
  player.field[emptySlot] = fieldCard;
  fieldCard.currentHealth = getMaxHealth(fieldCard);

  if (fieldCard.type === "primordial") {
    player.primordialSummoned = true;
  }

  logAction(`${player.heroName} invocou ${fieldCard.name}.`);
  showBattleFeedback("summon", fieldCard.name);
  playSfx(fieldCard.type === "primordial" ? "summon" : "summon");
  handleSummonEffect(fieldCard, { bot: player.role === "bot" });
  clampAllPacts();
  checkVictory();
  updateUI();
  return true;
}

function castSpell(player, handIndex, options = {}) {
  if (state.gameOver) {
    return false;
  }

  const card = player.hand[handIndex];

  if (!card) {
    return false;
  }

  if (player.mana < card.cost) {
    showMessage(`Mana insuficiente para lançar ${card.name}.`);
    return false;
  }

  const targetRule = getSpellTargetRule(card, player);

  if (player.role === "bot") {
    const target = targetRule ? chooseBotSpellTarget(card, player) : null;

    if (targetRule && !target) {
      return false;
    }

    const paidCard = paySpell(player, handIndex);
    resolveSpellEffect(player, paidCard, target);
    return true;
  }

  if (targetRule) {
    const hasTarget = getAllPactTargets().some((target) => targetRule.validTarget(target));

    if (!hasTarget) {
      showMessage(`Não há alvo válido para ${card.name}.`);
      return false;
    }

    requestTarget(targetRule.message, targetRule.validTarget, (target) => {
      const currentIndex = player.hand.findIndex((candidate) => candidate.id === card.id);

      if (currentIndex === -1) {
        showMessage("A carta não está mais na mão.");
        return;
      }

      const paidCard = paySpell(player, currentIndex);
      resolveSpellEffect(player, paidCard, target);
    });
    return true;
  }

  const paidCard = paySpell(player, handIndex);
  resolveSpellEffect(player, paidCard, null);
  return true;
}

function paySpell(player, handIndex) {
  const card = player.hand[handIndex];
  player.mana -= card.cost;
  player.hand.splice(handIndex, 1);
  player.discard.push(card);
  logAction(`${player.heroName} lançou ${card.name}.`);
  showBattleFeedback("spell", card.name);
  playSfx("summon");
  return card;
}

function getSpellTargetRule(card, player) {
  const opponent = getOpponent(player.index);
  const enemyPact = (target) => target.type === "pact" && target.playerIndex === opponent.index && Boolean(target.card);
  const alliedPact = (target) => target.type === "pact" && target.playerIndex === player.index && Boolean(target.card);
  const alliedFire = (target) => alliedPact(target) && target.card.element === "fire";

  const rules = {
    chuvaBrasas: {
      message: "Escolha um Pacto inimigo para receber 2 de dano.",
      validTarget: enemyPact
    },
    furiaVulcanica: {
      message: "Escolha um Pacto de Fogo aliado para receber +3 Ataque.",
      validTarget: alliedFire
    },
    fornalhaInsaciavel: {
      message: "Escolha um Pacto aliado para destruir.",
      validTarget: alliedPact
    },
    mareRestauradora: {
      message: "Escolha um Pacto aliado para curar 3 de Vida.",
      validTarget: alliedPact
    },
    correnteRetorno: {
      message: "Escolha um Pacto inimigo para devolver à mão.",
      validTarget: enemyPact
    },
    escudoMares: {
      message: "Escolha um Pacto aliado para receber +3 Vida.",
      validTarget: alliedPact
    },
    julgamentoLeviata: {
      message: "Escolha um Pacto inimigo para receber 4 de dano.",
      validTarget: enemyPact
    }
  };

  return rules[card.key] || null;
}

function resolveSpellEffect(player, card, target) {
  const opponent = getOpponent(player.index);

  switch (card.key) {
    case "chuvaBrasas":
      damagePact(target.card, 2, card.name);
      break;
    case "furiaVulcanica":
      addAttackModifier(target.card, 3, { phase: "end", ownerIndex: player.index, turn: player.turnsTaken });
      logAction(`${target.card.name} recebeu +3 Ataque até o final do turno.`);
      break;
    case "ritualSetimaChama":
      drawCard(player, 2);
      player.sanity += 1;
      logAction(`${player.heroName} ganhou 1 de Sanidade.`);
      break;
    case "fornalhaInsaciavel":
      destroyPact(target.playerIndex, target.slot, { source: card.name });
      player.mana += 3;
      logAction(`${player.heroName} recebeu 3 Mana.`);
      break;
    case "apocalipseCarmesim":
      logAction("Apocalipse Carmesim causou 3 de dano a todos os Pactos inimigos.");
      damageAllPacts(opponent, 3, card.name);
      break;
    case "mareRestauradora":
      healPact(target.card, 3);
      break;
    case "correnteRetorno":
      returnPactToHand(target.card);
      break;
    case "cancaoAbissal":
      drawCard(player, 2);
      break;
    case "escudoMares":
      addHealthModifier(target.card, 3, { phase: "end", ownerIndex: player.index, turn: player.turnsTaken + 1 });
      logAction(`${target.card.name} recebeu +3 Vida até o final do próximo turno.`);
      break;
    case "julgamentoLeviata":
      damagePact(target.card, 4, card.name);
      break;
    default:
      break;
  }

  clampAllPacts();
  checkVictory();
  updateUI();
}

function handleSummonEffect(card, options = {}) {
  const player = state.players[card.ownerIndex];
  const opponent = getOpponent(player.index);
  const bot = options.bot;

  switch (card.key) {
    case "cinzamor":
      handleTargetedEffect(
        bot,
        "Escolha um Pacto inimigo para receber 1 de dano.",
        (target) => target.playerIndex === opponent.index && Boolean(target.card),
        (target) => damagePact(target.card, 1, card.name),
        () => chooseWeakestPact(opponent)
      );
      break;
    case "solferro":
      logAction("Solferro causou 2 de dano a todos os Pactos inimigos.");
      damageAllPacts(opponent, 2, card.name);
      break;
    case "devorabrasa":
      handleTargetedEffect(
        bot,
        "Escolha um Pacto inimigo com 3 de Vida ou menos para destruir.",
        (target) => target.playerIndex === opponent.index && target.card && target.card.currentHealth <= 3,
        (target) => destroyPact(target.playerIndex, target.slot, { source: card.name }),
        () => chooseWeakestPact(opponent, (target) => target.card.currentHealth <= 3)
      );
      break;
    case "thalora":
      handleTargetedEffect(
        bot,
        "Escolha um Pacto aliado para curar 1 de Vida.",
        (target) => target.playerIndex === player.index && Boolean(target.card),
        (target) => healPact(target.card, 1),
        () => chooseWoundedAlly(player) || firstPactTarget(player)
      );
      break;
    case "nauren":
      drawCard(player, 1);
      break;
    case "nereth":
      handleTargetedEffect(
        bot,
        "Escolha um Pacto inimigo de custo 2 ou menos para devolver à mão.",
        (target) => target.playerIndex === opponent.index && target.card && target.card.cost <= 2,
        (target) => returnPactToHand(target.card),
        () => chooseWeakestPact(opponent, (target) => target.card.cost <= 2)
      );
      break;
    case "velkaris":
      handleTargetedEffect(
        bot,
        "Escolha um Pacto inimigo para receber -2 Ataque.",
        (target) => target.playerIndex === opponent.index && Boolean(target.card),
        (target) => {
          const targetOwner = state.players[target.playerIndex];
          addAttackModifier(target.card, -2, { phase: "end", ownerIndex: targetOwner.index, turn: targetOwner.turnsTaken + 1 });
          logAction(`${target.card.name} recebeu -2 Ataque até o final do próximo turno de ${targetOwner.heroName}.`);
        },
        () => chooseHighestAttackPact(opponent)
      );
      break;
    default:
      break;
  }
}

function handleTargetedEffect(isBot, message, validTarget, onTarget, botChooser) {
  const hasTarget = getAllPactTargets().some((target) => validTarget(target));

  if (!hasTarget) {
    return false;
  }

  if (isBot) {
    const target = botChooser();

    if (target && validTarget(target)) {
      onTarget(target);
    }

    return true;
  }

  requestTarget(message, (target) => target.type === "pact" && validTarget(target), onTarget);
  return true;
}

function requestTarget(message, validTarget, onSelect) {
  state.selectedAttackerId = null;
  state.pendingTarget = {
    message,
    validTarget,
    onSelect
  };
  state.statusMessage = message;
  updateUI();
}

function resolvePendingTarget(target) {
  if (!state.pendingTarget) {
    return false;
  }

  if (!state.pendingTarget.validTarget(target)) {
    showMessage("Esse alvo não é válido.");
    return false;
  }

  const action = state.pendingTarget;
  state.pendingTarget = null;
  action.onSelect(target);
  clampAllPacts();
  checkVictory();
  updateUI();
  return true;
}

function attack(attackerRef, defenderRef) {
  if (state.gameOver) {
    return false;
  }

  const attackerLocation = getPactLocation(attackerRef.cardId);
  const attacker = attackerLocation ? attackerLocation.card : null;

  if (!attacker || attacker.ownerIndex !== state.activePlayerIndex) {
    showMessage("Selecione um Pacto aliado ativo para atacar.");
    return false;
  }

  if (!canAttack(attacker)) {
    showMessage(`${attacker.name} não pode atacar agora.`);
    state.selectedAttackerId = null;
    updateUI();
    return false;
  }

  if (defenderRef.type === "hero") {
    return directAttack(attackerRef, defenderRef.playerIndex);
  }

  const defenderLocation = getPactLocation(defenderRef.cardId);
  const defender = defenderLocation ? defenderLocation.card : null;

  if (!defender || defender.ownerIndex === attacker.ownerIndex) {
    showMessage("Escolha um Pacto inimigo para atacar.");
    return false;
  }

  applyAttackTriggers(attacker);
  const attackValue = getAttack(attacker);
  const defenderHealthBefore = defender.currentHealth;
  attacker.hasAttacked = true;
  state.selectedAttackerId = null;

  logAction(`${attacker.name} atacou ${defender.name}.`);
  showBattleFeedback("attack", `${attacker.name} ataca`);
  playSfx("attack");
  const result = damagePact(defender, attackValue, attacker.name);

  if (attacker.key === "umbraMar" && attackValue > 0) {
    healHero(state.players[attacker.ownerIndex], 1);
    logAction("Umbra-Mar curou 1 de Vida do Herói aliado.");
  }

  if (result.destroyed) {
    const defenderPlayer = state.players[defenderLocation.playerIndex];
    const excess = Math.max(0, attackValue - defenderHealthBefore);
    damageHero(defenderPlayer, excess > 0 ? excess : 1, attacker.name);

    if (attacker.key === "ignivar") {
      state.players[attacker.ownerIndex].mana += 1;
      logAction("Ignivar recebeu 1 Mana por destruir um Pacto em combate.");
    }

    if (attacker.key === "reiChamas") {
      healHero(state.players[attacker.ownerIndex], 1);
      logAction("Rei das Chamas Eternas curou 1 de Vida do Herói aliado.");
    }
  }

  clampAllPacts();
  checkVictory();
  updateUI();
  return true;
}

function directAttack(attackerRef, defenderPlayerIndex) {
  const attackerLocation = getPactLocation(attackerRef.cardId);
  const attacker = attackerLocation ? attackerLocation.card : null;
  const attackerOwner = attacker ? state.players[attacker.ownerIndex] : null;
  const defender = state.players[defenderPlayerIndex];

  if (!attacker || !attackerOwner || !defender) {
    return false;
  }

  if (defender.field.some(Boolean)) {
    showMessage("Ataque direto só é permitido se o oponente não tiver Pactos no campo.");
    return false;
  }

  if (attacker.summonedOnTurn === attackerOwner.turnsTaken) {
    showMessage("Pactos recém-invocados não podem atacar diretamente o Herói.");
    return false;
  }

  applyAttackTriggers(attacker);
  const attackValue = getAttack(attacker);
  attacker.hasAttacked = true;
  state.selectedAttackerId = null;
  damageHero(defender, attackValue, attacker.name);
  logAction(`${attacker.name} atacou diretamente ${defender.heroName}.`);
  showBattleFeedback("attack", `-${attackValue}`);
  playSfx("attack");
  checkVictory();
  updateUI();
  return true;
}

function applyAttackTriggers(attacker) {
  const owner = state.players[attacker.ownerIndex];

  if (attacker.key === "varkhan") {
    const fireAllies = owner.field.filter((ally) => ally && ally.id !== attacker.id && ally.element === "fire").length;

    if (fireAllies > 0) {
      addAttackModifier(attacker, fireAllies, { phase: "end", ownerIndex: owner.index, turn: owner.turnsTaken });
      logAction(`Varkhan recebeu +${fireAllies} Ataque até o final do turno.`);
    }
  }

  if (attacker.key === "marem") {
    addHealthModifier(attacker, 1, { phase: "start", ownerIndex: owner.index, turn: owner.turnsTaken + 1 });
    logAction("Marem recebeu +1 Vida até o início do próximo turno do dono.");
  }
}

function destroyPact(playerIndex, slot, options = {}) {
  const player = state.players[playerIndex];
  const card = player.field[slot];

  if (!card) {
    return { destroyed: false, saved: false };
  }

  if (tryRubrakarSave(player, card)) {
    return { destroyed: false, saved: true };
  }

  player.field[slot] = null;

  if (card.type === "primordial") {
    player.primordialSummoned = false;
    player.primordialDestroyed = true;
  }

  clearTemporaryEffects(card);
  player.discard.push(card);
  logAction(`${card.name} foi destruído${options.source ? ` por ${options.source}` : ""}.`);
  showBattleFeedback("destroy", card.name);
  playSfx("destroy");
  return { destroyed: true, saved: false, card };
}

function endTurn() {
  if (state.gameOver || state.pendingTarget) {
    if (state.pendingTarget) {
      showMessage("Escolha o alvo destacado antes de encerrar o turno.");
    }
    return;
  }

  const player = state.players[state.activePlayerIndex];
  playSfx("endTurn");
  discardDownToLimit(player);
  expireEffectsFor(player.index, player.turnsTaken, "end");
  state.selectedAttackerId = null;
  state.botThinking = false;
  const nextPlayer = getOpponent(player.index);
  beginTurn(nextPlayer.index);
}

async function botTurn(battleId = state.battleId) {
  const bot = state.players[state.activePlayerIndex];

  if (!bot || bot.role !== "bot" || state.gameOver || battleId !== state.battleId) {
    return;
  }

  state.botThinking = true;
  state.statusMessage = "O bot está pensando...";
  updateUI();

  await sleep(BOT_DELAY);
  if (!isSameBotTurn(bot, battleId)) {
    return;
  }

  if (canInvokePrimordial(bot)) {
    summonPact(bot, bot.primordial, { primordial: true });
    await sleep(BOT_DELAY);
  }

  let actions = 0;
  while (actions < 5 && isSameBotTurn(bot, battleId)) {
    const pactIndex = chooseBestPlayablePact(bot);

    if (pactIndex !== -1) {
      summonPact(bot, pactIndex);
      actions += 1;
      await sleep(BOT_DELAY);
      continue;
    }

    const spellIndex = chooseUsefulSpell(bot);

    if (spellIndex !== -1) {
      castSpell(bot, spellIndex, { bot: true });
      actions += 1;
      await sleep(BOT_DELAY);
      continue;
    }

    break;
  }

  const attackerIds = bot.field.filter(Boolean).map((card) => card.id);

  for (const cardId of attackerIds) {
    if (!isSameBotTurn(bot, battleId) || state.gameOver) {
      return;
    }

    const location = getPactLocation(cardId);
    const attacker = location ? location.card : null;

    if (!attacker || !canAttack(attacker)) {
      continue;
    }

    const target = chooseBotAttackTarget(attacker);

    if (target) {
      attack({ cardId: attacker.id }, target);
      await sleep(BOT_DELAY);
    }
  }

  if (isSameBotTurn(bot, battleId) && !state.gameOver) {
    state.botThinking = false;
    endTurn();
  }
}

function checkVictory() {
  if (state.gameOver) {
    return false;
  }

  const defeated = state.players.find((player) => player.life <= 0);

  if (!defeated) {
    return false;
  }

  const winner = getOpponent(defeated.index);
  state.gameOver = true;
  state.winnerIndex = winner.index;
  state.pendingTarget = null;
  state.selectedAttackerId = null;
  state.botThinking = false;
  state.screen = "result";
  logAction(`${winner.heroName} venceu a partida.`);
  playSfx(winner.index === 0 ? "victory" : "defeat");
  updateUI();
  return true;
}

function getSanityState(value) {
  if (value >= 10) {
    return { label: "Louco", className: "sanity-mad" };
  }

  if (value >= 6) {
    return { label: "Perturbado", className: "sanity-disturbed" };
  }

  if (value >= 3) {
    return { label: "Instável", className: "sanity-unstable" };
  }

  return { label: "Normal", className: "sanity-normal" };
}

function logAction(message) {
  state.log.push(message);
  state.statusMessage = message;
}

function damagePact(card, amount, source) {
  const location = getPactLocation(card.id);

  if (!location || amount <= 0) {
    return { destroyed: false, saved: false };
  }

  const liveCard = location.card;
  liveCard.currentHealth -= amount;
  logAction(`${source} causou ${amount} de dano a ${liveCard.name}.`);
  showBattleFeedback("damage", `-${amount}`);
  playSfx("damage");

  if (liveCard.currentHealth <= 0) {
    return destroyPact(location.playerIndex, location.slot, { source });
  }

  return { destroyed: false, saved: false };
}

function damageAllPacts(player, amount, source) {
  const targetIds = player.field.filter(Boolean).map((card) => card.id);

  targetIds.forEach((cardId) => {
    const location = getPactLocation(cardId);

    if (location) {
      damagePact(location.card, amount, source);
    }
  });
}

function healPact(card, amount, options = {}) {
  const location = getPactLocation(card.id);

  if (!location || amount <= 0) {
    return 0;
  }

  const liveCard = location.card;
  const before = liveCard.currentHealth;
  liveCard.currentHealth = Math.min(getMaxHealth(liveCard), liveCard.currentHealth + amount);
  const healed = liveCard.currentHealth - before;

  if (healed > 0 && !options.silent) {
    logAction(`${liveCard.name} curou ${healed} de Vida.`);
    showBattleFeedback("heal", `+${healed}`);
    playSfx("heal");
  }

  return healed;
}

function healHero(player, amount) {
  const before = player.life;
  player.life = Math.min(player.maxLife, player.life + amount);
  return player.life - before;
}

function damageHero(player, amount, source) {
  if (amount <= 0) {
    return;
  }

  player.life -= amount;
  logAction(`${source} causou ${amount} de dano ao Herói ${player.heroName}.`);
  showBattleFeedback("damage", `-${amount}`);
  playSfx("damage");
}

function returnPactToHand(card) {
  const location = getPactLocation(card.id);

  if (!location) {
    return false;
  }

  const owner = state.players[location.playerIndex];
  owner.field[location.slot] = null;

  if (card.type === "primordial") {
    owner.primordialSummoned = false;
    owner.primordialDestroyed = false;
    owner.primordial = createCard(card.key);
    owner.primordial.ownerIndex = owner.index;
    logAction(`${card.name} voltou para o painel Primordial de ${owner.heroName}.`);
    return true;
  }

  const returnedCard = createCard(card.key);
  returnedCard.ownerIndex = owner.index;
  owner.hand.push(returnedCard);
  logAction(`${card.name} voltou para a mão de ${owner.heroName}.`);
  return true;
}

function getAttack(card) {
  const owner = state.players[card.ownerIndex];
  const realmBonus = owner.element === "fire" && card.element === "fire" ? 1 : 0;
  const braseonBonus = owner.field.filter((ally) => (
    ally &&
    ally.key === "braseon" &&
    ally.id !== card.id &&
    card.element === "fire"
  )).length;
  const modifiers = card.attackModifiers.reduce((total, modifier) => total + modifier.amount, 0);

  return Math.max(0, card.baseAttack + realmBonus + braseonBonus + modifiers);
}

function getMaxHealth(card) {
  const owner = state.players[card.ownerIndex];
  const realmBonus = owner.element === "water" && card.element === "water" ? 1 : 0;
  const lysoraBonus = owner.field.filter((ally) => (
    ally &&
    ally.key === "lysora" &&
    ally.id !== card.id &&
    card.element === "water"
  )).length;
  const modifiers = card.healthModifiers.reduce((total, modifier) => total + modifier.amount, 0);

  return Math.max(1, card.baseHealth + realmBonus + lysoraBonus + modifiers);
}

function addAttackModifier(card, amount, expires) {
  const location = getPactLocation(card.id);

  if (!location) {
    return;
  }

  location.card.attackModifiers.push({
    amount,
    expires
  });
}

function addHealthModifier(card, amount, expires) {
  const location = getPactLocation(card.id);

  if (!location) {
    return;
  }

  location.card.healthModifiers.push({
    amount,
    expires
  });
  location.card.currentHealth += amount;
}

function expireEffectsFor(ownerIndex, turn, phase) {
  state.players.forEach((player) => {
    player.field.forEach((card) => {
      if (!card) {
        return;
      }

      card.attackModifiers = card.attackModifiers.filter((modifier) => !effectExpired(modifier.expires, ownerIndex, turn, phase));
      card.healthModifiers = card.healthModifiers.filter((modifier) => !effectExpired(modifier.expires, ownerIndex, turn, phase));
      card.currentHealth = Math.min(card.currentHealth, getMaxHealth(card));
    });
  });
}

function effectExpired(expires, ownerIndex, turn, phase) {
  return Boolean(
    expires &&
    expires.phase === phase &&
    expires.ownerIndex === ownerIndex &&
    expires.turn <= turn
  );
}

function clearTemporaryEffects(card) {
  card.attackModifiers = [];
  card.healthModifiers = [];
}

function discardDownToLimit(player) {
  while (player.hand.length > MAX_HAND) {
    const discarded = player.hand.pop();
    player.discard.push(discarded);
    logAction(`${player.heroName} descartou automaticamente ${discarded.name} por exceder o limite de mão.`);
  }
}

function tryRubrakarSave(player, card) {
  if (
    card.key === "rubrakar" ||
    card.element !== "fire" ||
    player.rubrakarSaveUsed ||
    !hasPact(player, "rubrakar")
  ) {
    return false;
  }

  player.rubrakarSaveUsed = true;
  card.currentHealth = 1;
  logAction(`Rubrakar salvou ${card.name}, que sobreviveu com 1 de Vida.`);
  return true;
}

function canPlayCard(player, card) {
  if (!canHumanAct() || state.pendingTarget || player.mana < card.cost) {
    return false;
  }

  if (card.type === "pact") {
    return player.field.some((slot) => slot === null);
  }

  return true;
}

function canHumanAct() {
  return (
    state.players.length > 0 &&
    !state.gameOver &&
    !state.botThinking &&
    state.activePlayerIndex === 0 &&
    state.players[0].role === "human"
  );
}

function canAttack(card) {
  if (
    !card ||
    state.gameOver ||
    state.pendingTarget ||
    card.hasAttacked ||
    card.ownerIndex !== state.activePlayerIndex
  ) {
    return false;
  }

  if (state.players[state.activePlayerIndex].role === "bot" && !state.botThinking) {
    return false;
  }

  const owner = state.players[card.ownerIndex];
  const opponent = getOpponent(owner.index);
  const opponentHasPacts = opponent.field.some(Boolean);
  const fresh = card.summonedOnTurn === owner.turnsTaken;

  return opponentHasPacts || !fresh;
}

function canHeroBeDirectTarget(player) {
  if (!state.selectedAttackerId || player.index === state.activePlayerIndex || player.field.some(Boolean)) {
    return false;
  }

  const location = getPactLocation(state.selectedAttackerId);
  const attacker = location ? location.card : null;
  const owner = attacker ? state.players[attacker.ownerIndex] : null;

  return Boolean(attacker && owner && attacker.summonedOnTurn !== owner.turnsTaken);
}

function canInvokePrimordial(player) {
  return (
    !player.primordialSummoned &&
    !player.primordialDestroyed &&
    player.turnsTaken >= 3 &&
    player.mana >= player.primordial.cost &&
    player.field.some((slot) => slot === null)
  );
}

function getPrimordialState(player) {
  if (player.primordialDestroyed) {
    return { label: "Destruído", className: "spent" };
  }

  if (player.primordialSummoned) {
    return { label: "Invocado", className: "spent" };
  }

  if (player.turnsTaken < 3) {
    return { label: `Bloqueado: Turno ${player.turnsTaken}/3`, className: "locked" };
  }

  if (canInvokePrimordial(player)) {
    return { label: "Disponível: Pode invocar", className: "available playable effect-primordial-ready" };
  }

  return { label: "Disponível", className: "available" };
}

function isTargetable(card) {
  if (!state.pendingTarget) {
    return false;
  }

  const location = getPactLocation(card.id);

  if (!location) {
    return false;
  }

  return state.pendingTarget.validTarget({
    type: "pact",
    playerIndex: location.playerIndex,
    slot: location.slot,
    card
  });
}

function getAllPactTargets() {
  return state.players.flatMap((player) => (
    player.field
      .map((card, slot) => ({ type: "pact", playerIndex: player.index, slot, card }))
      .filter((target) => Boolean(target.card))
  ));
}

function getPactLocation(cardId) {
  for (const player of state.players) {
    const slot = player.field.findIndex((card) => card && card.id === cardId);

    if (slot !== -1) {
      return { playerIndex: player.index, slot, card: player.field[slot] };
    }
  }

  return null;
}

function getOpponent(playerIndex) {
  return state.players.find((player) => player.index !== playerIndex);
}

function hasPact(player, cardKey) {
  return player.field.some((card) => card && card.key === cardKey);
}

function clampAllPacts() {
  state.players.forEach((player) => {
    player.field.forEach((card) => {
      if (card) {
        card.currentHealth = Math.min(card.currentHealth, getMaxHealth(card));
      }
    });
  });
}

function chooseBestPlayablePact(player) {
  if (!player.field.some((slot) => slot === null)) {
    return -1;
  }

  let bestIndex = -1;
  let bestScore = -1;

  player.hand.forEach((card, index) => {
    if (card.type !== "pact" || card.cost > player.mana) {
      return;
    }

    const score = getBotPactScore(card, player);

    if (score > bestScore) {
      bestIndex = index;
      bestScore = score;
    }
  });

  return bestIndex;
}

function getBotPactScore(card, player) {
  const opponent = getOpponent(player.index);
  const emptySlots = player.field.filter((slot) => slot === null).length;
  const enemyThreat = opponent.field.reduce((total, enemy) => total + (enemy ? getPactThreat(enemy) : 0), 0);
  const baseScore = (card.cost * 9) + (card.baseAttack * 5) + (card.baseHealth * 3);
  const elementBonus = card.element === player.element ? 8 : 0;
  const survivalBonus = enemyThreat > 18 ? card.baseHealth * 2 : 0;
  const finisherBonus = opponent.life <= getAttackPreview(card, player) + 4 ? 10 : 0;
  const scarceSlotPenalty = emptySlots === 1 && card.cost <= 2 ? 8 : 0;
  const effectScores = {
    cinzamor: 12,
    solferro: opponent.field.some(Boolean) ? 24 : 5,
    devorabrasa: opponent.field.some((enemy) => enemy && enemy.currentHealth <= 3) ? 26 : 12,
    thalora: chooseWoundedAlly(player) ? 14 : 6,
    nauren: 14,
    nereth: opponent.field.some((enemy) => enemy && enemy.cost <= 2) ? 20 : 8,
    velkaris: opponent.field.some(Boolean) ? 22 : 10,
    rubrakar: player.field.some((ally) => ally && ally.element === "fire") ? 18 : 8,
    braseon: player.field.some((ally) => ally && ally.element === "fire") ? 20 : 10,
    lysora: player.field.some((ally) => ally && ally.element === "water") ? 20 : 10,
    umbraMar: player.life <= 12 ? 18 : 10
  };

  return baseScore + elementBonus + survivalBonus + finisherBonus + (effectScores[card.key] || 0) - scarceSlotPenalty;
}

function getAttackPreview(card, player) {
  const realmBonus = player.element === "fire" && card.element === "fire" ? 1 : 0;
  const braseonBonus = player.field.filter((ally) => ally && ally.key === "braseon" && card.element === "fire").length;

  return Math.max(0, card.baseAttack + realmBonus + braseonBonus);
}

function chooseUsefulSpell(player) {
  let bestIndex = -1;
  let bestScore = -1;

  player.hand.forEach((card, index) => {
    if (card.type !== "spell" || card.cost > player.mana) {
      return;
    }

    const targetRule = getSpellTargetRule(card, player);
    const target = targetRule ? chooseBotSpellTarget(card, player) : null;

    if (targetRule && !target) {
      return;
    }

    const score = getBotSpellScore(card, player, target);

    if (score > bestScore) {
      bestIndex = index;
      bestScore = score;
    }
  });

  return bestIndex;
}

function getBotSpellScore(card, player, target) {
  const opponent = getOpponent(player.index);
  const opponentThreat = opponent.field.reduce((total, enemy) => total + (enemy ? getPactThreat(enemy) : 0), 0);

  switch (card.key) {
    case "apocalipseCarmesim":
      return opponent.field.some(Boolean) ? 82 + opponent.field.filter(Boolean).length * 8 + Math.min(24, opponentThreat) : 0;
    case "julgamentoLeviata":
      return target ? 78 + getPactThreat(target.card) + (target.card.currentHealth <= 4 ? 14 : 0) : 0;
    case "chuvaBrasas":
      return target ? 66 + getPactThreat(target.card) + (target.card.currentHealth <= 2 ? 14 : 0) : 0;
    case "mareRestauradora":
      return target ? 58 + (getMaxHealth(target.card) - target.card.currentHealth) * 8 + getPactThreat(target.card) : 0;
    case "correnteRetorno":
      return target ? 62 + getPactThreat(target.card) + target.card.cost : 0;
    case "furiaVulcanica":
      return target ? 54 + getPactThreat(target.card) : 0;
    case "escudoMares":
      return target ? 50 + getPactThreat(target.card) : 0;
    case "cancaoAbissal":
    case "ritualSetimaChama":
      return player.hand.length <= 5 ? 55 : 30;
    default:
      return 0;
  }
}

function chooseBotSpellTarget(card, player) {
  const opponent = getOpponent(player.index);

  switch (card.key) {
    case "chuvaBrasas":
      return chooseBestDamageTarget(opponent, 2);
    case "julgamentoLeviata":
      return chooseBestDamageTarget(opponent, 4);
    case "furiaVulcanica":
      return chooseHighestAttackPact(player, (target) => target.card.element === "fire");
    case "fornalhaInsaciavel":
      return chooseWeakestPact(player);
    case "mareRestauradora":
      return chooseWoundedAlly(player);
    case "correnteRetorno":
      return chooseHighestCostPact(opponent);
    case "escudoMares":
      return chooseWeakestPact(player);
    default:
      return null;
  }
}

function chooseBotAttackTarget(attacker) {
  const opponent = getOpponent(attacker.ownerIndex);
  const attackValue = getAttack(attacker);
  const enemyTargets = opponent.field
    .map((card, slot) => ({ type: "pact", playerIndex: opponent.index, slot, card }))
    .filter((target) => Boolean(target.card));

  if (enemyTargets.length === 0) {
    const owner = state.players[attacker.ownerIndex];

    if (attacker.summonedOnTurn !== owner.turnsTaken) {
      return { type: "hero", playerIndex: opponent.index };
    }

    return null;
  }

  const killable = enemyTargets
    .filter((target) => target.card.currentHealth <= attackValue)
    .sort((a, b) => getPactThreat(b.card) - getPactThreat(a.card));

  if (killable.length > 0) {
    return { type: "pact", cardId: killable[0].card.id };
  }

  const dangerous = enemyTargets
    .sort((a, b) => getPactThreat(b.card) - getPactThreat(a.card))[0];

  return { type: "pact", cardId: dangerous.card.id };
}

function chooseBestDamageTarget(player, damage) {
  const targets = getPlayerTargets(player);
  const killable = targets
    .filter((target) => target.card.currentHealth <= damage)
    .sort((a, b) => getPactThreat(b.card) - getPactThreat(a.card));

  if (killable.length > 0) {
    return killable[0];
  }

  return targets.sort((a, b) => getPactThreat(b.card) - getPactThreat(a.card))[0] || null;
}

function getPactThreat(card) {
  return (getAttack(card) * 3) + card.currentHealth + (card.cost * 2);
}

function chooseWeakestPact(player, predicate = () => true) {
  return getPlayerTargets(player)
    .filter(predicate)
    .sort((a, b) => a.card.currentHealth - b.card.currentHealth)[0] || null;
}

function chooseHighestAttackPact(player, predicate = () => true) {
  return getPlayerTargets(player)
    .filter(predicate)
    .sort((a, b) => getAttack(b.card) - getAttack(a.card))[0] || null;
}

function chooseHighestCostPact(player) {
  return getPlayerTargets(player)
    .sort((a, b) => b.card.cost - a.card.cost)[0] || null;
}

function chooseWoundedAlly(player) {
  return getPlayerTargets(player)
    .filter((target) => target.card.currentHealth < getMaxHealth(target.card))
    .sort((a, b) => (getMaxHealth(b.card) - b.card.currentHealth) - (getMaxHealth(a.card) - a.card.currentHealth))[0] || null;
}

function firstPactTarget(player) {
  return getPlayerTargets(player)[0] || null;
}

function getPlayerTargets(player) {
  return player.field
    .map((card, slot) => ({ type: "pact", playerIndex: player.index, slot, card }))
    .filter((target) => Boolean(target.card));
}

function isSameBotTurn(bot, battleId) {
  return (
    battleId === state.battleId &&
    !state.gameOver &&
    state.players[state.activePlayerIndex] &&
    state.players[state.activePlayerIndex].index === bot.index &&
    bot.role === "bot"
  );
}

function sleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function showMessage(message) {
  state.statusMessage = message;
  updateUI();
}

function handleClick(event) {
  const screenButton = event.target.closest("[data-screen]");

  if (screenButton) {
    state.screen = screenButton.dataset.screen;
    updateUI();
    return;
  }

  const heroChoice = event.target.closest("[data-select-hero]");

  if (heroChoice) {
    selectHero(heroChoice.dataset.selectHero);
    return;
  }

  const handCard = event.target.closest("[data-hand-index]");

  if (handCard) {
    playCard(Number(handCard.dataset.handIndex));
    return;
  }

  const fieldCard = event.target.closest("[data-field-index][data-field-slot]");

  if (fieldCard) {
    handleFieldClick(Number(fieldCard.dataset.fieldIndex), Number(fieldCard.dataset.fieldSlot));
    return;
  }

  const hero = event.target.closest("[data-hero-index]");

  if (hero) {
    handleHeroClick(Number(hero.dataset.heroIndex));
    return;
  }

  const primordial = event.target.closest("[data-primordial-index]");

  if (primordial) {
    handlePrimordialClick(Number(primordial.dataset.primordialIndex));
  }
}

function handleFieldClick(playerIndex, slot) {
  if (!state.players.length) {
    return;
  }

  const player = state.players[playerIndex];
  const card = player.field[slot];

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
    showMessage("Selecione um Pacto aliado para atacar primeiro.");
    return;
  }

  attack({ cardId: state.selectedAttackerId }, { type: "pact", cardId: card.id });
}

function handleHeroClick(playerIndex) {
  if (!canHumanAct() || state.pendingTarget || !state.selectedAttackerId) {
    return;
  }

  if (playerIndex === 0) {
    showMessage("Escolha o Herói inimigo como alvo.");
    return;
  }

  attack({ cardId: state.selectedAttackerId }, { type: "hero", playerIndex });
}

function handlePrimordialClick(playerIndex) {
  if (!canHumanAct() || playerIndex !== 0) {
    return;
  }

  if (state.pendingTarget) {
    showMessage("Escolha o alvo destacado antes de invocar o Primordial.");
    return;
  }

  const player = state.players[playerIndex];
  summonPact(player, player.primordial, { primordial: true });
}

function toggleBattlePanel(panel) {
  if (state.floatingPanel === panel) {
    closeFloatingPanel(panel);
    return;
  }

  renderFloatingPanels();
  state.floatingPanel = panel;
  renderFloatingPanels();
}

function closeFloatingPanel(panel) {
  const drawer = panel === "log" ? logDrawer : rulesDrawer;
  state.floatingPanel = null;

  if (!drawer || drawer.hidden) {
    renderFloatingPanels();
    return;
  }

  drawer.classList.remove("is-open");
  drawer.classList.add("is-closing");

  if (toggleLogButton && panel === "log") {
    toggleLogButton.classList.remove("active-toggle");
    toggleLogButton.setAttribute("aria-expanded", "false");
  }

  if (toggleRulesButton && panel === "rules") {
    toggleRulesButton.classList.remove("active-toggle");
    toggleRulesButton.setAttribute("aria-expanded", "false");
  }

  window.setTimeout(() => {
    drawer.classList.remove("is-closing");
    renderFloatingPanels();
  }, 180);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

document.addEventListener("click", handleClick);
document.addEventListener("mouseover", handleDetailHover);
document.getElementById("battleScreen").addEventListener("mouseleave", renderEmptyCardDetail);

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

document.getElementById("endTurnButton").addEventListener("click", endTurn);
document.getElementById("toggleLogButton").addEventListener("click", () => toggleBattlePanel("log"));
document.getElementById("toggleRulesButton").addEventListener("click", () => toggleBattlePanel("rules"));
document.getElementById("backToMenuButton").addEventListener("click", startGame);
document.getElementById("resultRestartButton").addEventListener("click", startBattle);
document.getElementById("resultMenuButton").addEventListener("click", startGame);

if (soundToggleButton) {
  soundToggleButton.addEventListener("click", toggleAudio);
}

if (volumeSlider) {
  volumeSlider.addEventListener("input", (event) => setAudioVolume(event.target.value));
}

startGame();
