const SAVE_KEY = "plasmoid-battlers-save-v1";
const W = 1280;
const H = 720;

const BASE_TYPE_CONFIGS = {
  Solar: { color: "#ffd447", dark: "#ff7b00", strong: "Volt" },
  Volt: { color: "#00d9ff", dark: "#1749ff", strong: "Toxic" },
  Toxic: { color: "#98ff45", dark: "#009a72", strong: "Lunar" },
  Lunar: { color: "#7c4dff", dark: "#2516a8", strong: "Solar" },
  Flare: { color: "#ff4fd8", dark: "#c4007d", strong: "Frost" },
  Frost: { color: "#9effff", dark: "#1389ff", strong: "Flare" },
};

const BASE_TYPES = Object.fromEntries(Object.entries(BASE_TYPE_CONFIGS).map(([name, config]) => [
  name,
  { ...config, label: name, parts: [name], slug: name.toLowerCase() },
]));
const BASE_TYPE_NAMES = Object.keys(BASE_TYPES);
const HYBRID_TYPES = {};

for (let i = 0; i < BASE_TYPE_NAMES.length; i++) {
  for (let j = i + 1; j < BASE_TYPE_NAMES.length; j++) {
    const first = BASE_TYPE_NAMES[i];
    const second = BASE_TYPE_NAMES[j];
    const key = `${first}-${second}`;
    HYBRID_TYPES[key] = {
      label: `${first}/${second}`,
      parts: [first, second],
      slug: `${first.toLowerCase()}-${second.toLowerCase()}`,
      color: mixHexColors([BASE_TYPES[first].color, BASE_TYPES[second].color], 0.62),
      dark: mixHexColors([BASE_TYPES[first].dark, BASE_TYPES[second].dark], 0.45),
    };
  }
}

const TYPES = { ...BASE_TYPES, ...HYBRID_TYPES };
const TYPE_NAMES = Object.keys(TYPES);
const HYBRID_TYPE_NAMES = Object.keys(HYBRID_TYPES);
const POWER_EFFECTS = {
  Solar: { name: "Solar Flare", bonus: 8, color: "#ffd447", text: "sears for bonus damage" },
  Volt: { name: "Volt Surge", bonus: 6, color: "#00d9ff", text: "jolts defense down" },
  Toxic: { name: "Toxic Bloom", bonus: 5, color: "#98ff45", text: "melts defense down" },
  Lunar: { name: "Lunar Drain", bonus: 5, color: "#7c4dff", text: "drains health back" },
  Flare: { name: "Flare Break", bonus: 9, color: "#ff4fd8", text: "erupts for bonus damage" },
  Frost: { name: "Frost Lock", bonus: 5, color: "#9effff", text: "slows the target" },
};
const MISSION_DEFS = [
  {
    type: "complete_battles",
    title: "Battle Circuit",
    description: "Complete 2 battles of any kind.",
    stat: "battles",
    target: 2,
    reward: 2,
  },
  {
    type: "win_battle",
    title: "Victory Spark",
    description: "Win 1 battle.",
    stat: "wins",
    target: 1,
    reward: 3,
  },
  {
    type: "defeat_plasmoids",
    title: "Rival Cleanup",
    description: "Defeat 3 rival Plasmoids.",
    stat: "defeats",
    target: 3,
    reward: 3,
  },
  {
    type: "attack_times",
    title: "Pressure Combo",
    description: "Use Attack 5 times.",
    stat: "attacks",
    target: 5,
    reward: 2,
  },
  {
    type: "deal_damage",
    title: "Glow Burst",
    description: "Deal 150 total damage.",
    stat: "damageDealt",
    target: 150,
    reward: 3,
  },
  {
    type: "switch_plasmoids",
    title: "Smart Swaps",
    description: "Switch Plasmoids 2 times during battle.",
    stat: "switches",
    target: 2,
    reward: 2,
  },
  {
    type: "planned_battle",
    title: "Scout Route",
    description: "Complete 1 Planned Battle.",
    stat: "plannedBattles",
    target: 1,
    reward: 2,
  },
  {
    type: "ranked_battle",
    title: "Ladder Check",
    description: "Complete 1 Ranked Battle.",
    stat: "rankedBattles",
    target: 1,
    reward: 3,
  },
  {
    type: "summon_plasmoid",
    title: "Aurora Call",
    description: "Summon 1 Plasmoid with the UAP Dogwhistle.",
    stat: "summons",
    target: 1,
    reward: 2,
  },
];

const MUSIC = {
  home: "Music/Plasmoid%20Battlers%20Home.mp3",
  daily: "Music/Daily%20Gold%20Rush.mp3",
  missions: "Music/Plasmoid%20Mission%20Briefing.mp3",
  battle: "Music/Plasmoid%20Battle%20Anthem.mp3",
  gacha: "Music/Summoning%20the%20Plasmoids.mp3",
  manage: "Music/Plasmoid%20Management%20Mode.mp3",
  profile: "Music/Battler%20Profile%20Hub.mp3",
  howto: "Music/Plasmoid%20Battlers%20Home.mp3",
  victory: "Music/Plasmoid%20Victory!.mp3",
  defeat: "Music/Plasmoid%20Defeat.mp3",
};

const ART = {
  home: "assets/art/home.png",
  daily: "assets/art/daily-gold.png",
  missions: "assets/art/daily-missions.png",
  gacha: "assets/art/summon.png",
  victory: "assets/art/victory.png",
  defeat: "assets/art/defeat.png",
  typeChart: "assets/art/type-chart.png",
};

const SPRITES = {
  Solar: "assets/art/sprite-solar.png",
  Volt: "assets/art/sprite-volt.png",
  Toxic: "assets/art/sprite-toxic.png",
  Lunar: "assets/art/sprite-lunar.png",
  Flare: "assets/art/sprite-flare.png",
  Frost: "assets/art/sprite-frost.png",
  "Solar-Volt": "assets/art/sprite-solar-volt.png",
  "Solar-Toxic": "assets/art/sprite-solar-toxic.png",
  "Solar-Lunar": "assets/art/sprite-solar-lunar.png",
  "Solar-Flare": "assets/art/sprite-solar-flare.png",
  "Solar-Frost": "assets/art/sprite-solar-frost.png",
  "Volt-Toxic": "assets/art/sprite-volt-toxic.png",
  "Volt-Lunar": "assets/art/sprite-volt-lunar.png",
  "Volt-Flare": "assets/art/sprite-volt-flare.png",
  "Volt-Frost": "assets/art/sprite-volt-frost.png",
  "Toxic-Lunar": "assets/art/sprite-toxic-lunar.png",
  "Toxic-Flare": "assets/art/sprite-toxic-flare.png",
  "Toxic-Frost": "assets/art/sprite-toxic-frost.png",
  "Lunar-Flare": "assets/art/sprite-lunar-flare.png",
  "Lunar-Frost": "assets/art/sprite-lunar-frost.png",
  "Flare-Frost": "assets/art/sprite-flare-frost.png",
};

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const ui = {
  title: document.getElementById("screen-title"),
  gold: document.getElementById("gold-count"),
  rank: document.getElementById("rank-level"),
  tabs: [...document.querySelectorAll(".mode-tab")],
  panels: [...document.querySelectorAll(".panel")],
  toast: document.getElementById("toast"),
  soundToggle: document.getElementById("sound-toggle"),
  fullscreen: document.getElementById("fullscreen-btn"),
  homeSummary: document.getElementById("home-summary"),
  dailyStatus: document.getElementById("daily-status"),
  dailyClaim: document.getElementById("daily-claim-btn"),
  missionSummary: document.getElementById("mission-summary"),
  missionList: document.getElementById("mission-list"),
  blindBattle: document.getElementById("blind-battle-btn"),
  blindRanked: document.getElementById("blind-ranked-btn"),
  plannedBattle: document.getElementById("planned-battle-btn"),
  plannedRanked: document.getElementById("planned-ranked-btn"),
  riskToggle: document.getElementById("risk-toggle"),
  riskStatus: document.getElementById("risk-status"),
  powerToggle: document.getElementById("power-toggle"),
  powerStatus: document.getElementById("power-status"),
  setupChart: document.getElementById("setup-chart-btn"),
  battleChart: document.getElementById("battle-chart-btn"),
  battlePowerSummary: document.getElementById("battle-power-summary"),
  plannedSetup: document.getElementById("planned-setup"),
  plannedEnemyList: document.getElementById("planned-enemy-list"),
  plannedTeamSlots: document.getElementById("planned-team-slots"),
  plannedVatList: document.getElementById("planned-vat-list"),
  plannedPowerSummary: document.getElementById("planned-power-summary"),
  startPlannedBattle: document.getElementById("start-planned-battle-btn"),
  battleSetup: document.getElementById("battle-setup"),
  battleActions: document.getElementById("battle-actions"),
  attack: document.getElementById("attack-btn"),
  forfeit: document.getElementById("forfeit-btn"),
  switchButtons: document.getElementById("switch-buttons"),
  battleLog: document.getElementById("battle-log"),
  summon: document.getElementById("summon-btn"),
  twinTone: document.getElementById("twin-tone-btn"),
  summonResult: document.getElementById("summon-result"),
  teamSlots: document.getElementById("team-slots"),
  teamPowerSummary: document.getElementById("team-power-summary"),
  vatList: document.getElementById("vat-list"),
  typeChart: document.getElementById("type-chart"),
  modalTypeChart: document.getElementById("modal-type-chart"),
  profileGrid: document.getElementById("profile-grid"),
  newGame: document.getElementById("new-game-btn"),
  modal: document.getElementById("battle-summary-modal"),
  summaryTitle: document.getElementById("battle-summary-title"),
  summaryArt: document.getElementById("battle-summary-art"),
  summaryStats: document.getElementById("battle-summary-stats"),
  closeSummary: document.getElementById("close-summary-btn"),
  typeChartModal: document.getElementById("type-chart-modal"),
  closeTypeChart: document.getElementById("close-type-chart-btn"),
};

const images = {};
const sprites = {};
let save = loadSave();
let mode = "home";
let t = 0;
let toastTimer = 0;
let currentMusic = null;
let audioUnlocked = false;
let soundEnabled = true;
let audioCtx = null;
let battle = null;
let plannedBattle = null;
let lastFrame = performance.now();
let selectedVatId = null;
let pointer = { x: -9999, y: -9999 };
const fx = [];

function defaultProfile() {
  return {
    battles: 0,
    blindBattles: 0,
    plannedBattles: 0,
    rankedBattles: 0,
    rankedWins: 0,
    rankedLosses: 0,
    riskBattles: 0,
    riskCaptures: 0,
    riskLosses: 0,
    powerBattles: 0,
    powerHits: 0,
    wins: 0,
    losses: 0,
    plasmoidsDefeated: 0,
    goldEarned: 0,
    dailyClaims: 0,
    missionClaims: 0,
    attacks: 0,
    damageDealt: 0,
    damageTaken: 0,
    summons: 0,
    switches: 0,
    teamAdds: 0,
    longestBattleMs: 0,
  };
}

function makeStarterSave() {
  const starters = [
    createPlasmoid({ type: "Solar", name: "Helio Pop", rank: "Starter", seed: 11 }),
    createPlasmoid({ type: "Volt", name: "Neon Zapp", rank: "Starter", seed: 22 }),
    createPlasmoid({ type: "Toxic", name: "Lime Wisp", rank: "Starter", seed: 33 }),
  ];
  return {
    gold: 3,
    rankLevel: 100,
    vat: starters,
    team: starters.map((p) => p.id),
    lastDailyGoldDate: "",
    dailyMissions: createDailyMissions(todayKey(), starters[0].seed),
    profile: defaultProfile(),
  };
}

function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return makeStarterSave();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.vat) || parsed.vat.length < 3) return makeStarterSave();
    parsed.rankLevel = Number.isFinite(parsed.rankLevel) ? parsed.rankLevel : 100;
    parsed.gold = Number.isFinite(parsed.gold) ? parsed.gold : 0;
    parsed.lastDailyGoldDate = typeof parsed.lastDailyGoldDate === "string" ? parsed.lastDailyGoldDate : "";
    parsed.dailyMissions = normalizeDailyMissions(parsed.dailyMissions, parsed.vat[0]?.seed);
    parsed.profile = { ...defaultProfile(), ...(parsed.profile || {}) };
    parsed.team = Array.isArray(parsed.team)
      ? parsed.team.filter((id) => parsed.vat.some((p) => p.id === id)).slice(0, 3)
      : parsed.vat.slice(0, 3).map((p) => p.id);
    if (!parsed.team.length) parsed.team = parsed.vat.slice(0, 3).map((p) => p.id);
    return parsed;
  } catch {
    return makeStarterSave();
  }
}

function persist() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(save));
}

function mixHexColors(colors, brightness = 0.5) {
  const channels = colors.map((color) => color.replace("#", "").match(/.{2}/g).map((part) => parseInt(part, 16)));
  const mixed = [0, 1, 2].map((index) => {
    const average = channels.reduce((total, channel) => total + channel[index], 0) / channels.length;
    const lifted = average + (255 - average) * brightness;
    return Math.max(0, Math.min(255, Math.round(lifted))).toString(16).padStart(2, "0");
  });
  return `#${mixed.join("")}`;
}

function typeInfo(type) {
  return TYPES[type] || BASE_TYPES.Solar;
}

function typeLabel(type) {
  return typeInfo(type).label;
}

function typeParts(type) {
  return typeInfo(type).parts || [type];
}

function strongTypes(type) {
  return [...new Set(typeParts(type).map((part) => BASE_TYPES[part]?.strong).filter(Boolean))];
}

function strongLabel(type) {
  return strongTypes(type).join(", ");
}

function todayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function nextDailyResetLabel(now = new Date()) {
  const reset = new Date(now);
  reset.setHours(24, 0, 0, 0);
  const minutes = Math.max(1, Math.ceil((reset - now) / 60000));
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours <= 0) return `${mins}m`;
  return `${hours}h ${mins}m`;
}

function dailyGoldReady() {
  return save.lastDailyGoldDate !== todayKey();
}

function defaultDailyMissionStats() {
  return {
    battles: 0,
    wins: 0,
    defeats: 0,
    attacks: 0,
    damageDealt: 0,
    switches: 0,
    plannedBattles: 0,
    rankedBattles: 0,
    summons: 0,
  };
}

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash || 1;
}

function missionDefinition(type) {
  return MISSION_DEFS.find((mission) => mission.type === type) || MISSION_DEFS[0];
}

function knownMissionType(type) {
  return MISSION_DEFS.some((mission) => mission.type === type);
}

function seededMissionShuffle(seed) {
  const pool = MISSION_DEFS.slice();
  for (let i = pool.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool;
}

function createDailyMissions(date = todayKey(), seedBase = 17) {
  const seed = hashString(`${date}-${seedBase}`);
  return {
    date,
    stats: defaultDailyMissionStats(),
    missions: seededMissionShuffle(seed).slice(0, 3).map((mission) => ({
      type: mission.type,
      claimed: false,
    })),
  };
}

function normalizeDailyMissions(dailyMissions, seedBase = 17) {
  const today = todayKey();
  if (!dailyMissions || dailyMissions.date !== today || !Array.isArray(dailyMissions.missions)) {
    return createDailyMissions(today, seedBase);
  }
  const seen = new Set();
  const missions = dailyMissions.missions
    .filter((mission) => knownMissionType(mission.type) && !seen.has(mission.type) && seen.add(mission.type))
    .slice(0, 3)
    .map((mission) => ({ type: mission.type, claimed: Boolean(mission.claimed) }));
  if (missions.length !== 3) return createDailyMissions(today, seedBase);
  return {
    date: today,
    stats: { ...defaultDailyMissionStats(), ...(dailyMissions.stats || {}) },
    missions,
  };
}

function ensureDailyMissions() {
  const before = save.dailyMissions?.date;
  save.dailyMissions = normalizeDailyMissions(save.dailyMissions, save.vat?.[0]?.seed);
  if (save.dailyMissions.date !== before) persist();
  return save.dailyMissions;
}

function missionProgress(mission) {
  const def = missionDefinition(mission.type);
  const stats = ensureDailyMissions().stats;
  return Math.min(def.target, Math.max(0, stats[def.stat] || 0));
}

function missionProgressForStats(mission, stats) {
  const def = missionDefinition(mission.type);
  return Math.min(def.target, Math.max(0, stats[def.stat] || 0));
}

function missionCompleted(mission) {
  return missionProgress(mission) >= missionDefinition(mission.type).target;
}

function addMissionProgress(stat, amount = 1) {
  const daily = ensureDailyMissions();
  const beforeReady = daily.missions.filter((mission) => !mission.claimed && missionProgressForStats(mission, daily.stats) >= missionDefinition(mission.type).target).length;
  daily.stats[stat] = Math.max(0, (daily.stats[stat] || 0) + amount);
  const afterReady = daily.missions.filter((mission) => !mission.claimed && missionProgressForStats(mission, daily.stats) >= missionDefinition(mission.type).target).length;
  if (afterReady > beforeReady) notify("Daily mission complete. Claim your gold.");
}

function claimMission(index) {
  const daily = ensureDailyMissions();
  const mission = daily.missions[index];
  if (!mission) return;
  const def = missionDefinition(mission.type);
  const complete = missionProgressForStats(mission, daily.stats) >= def.target;
  if (mission.claimed) {
    notify("Mission reward already claimed.");
    playSfx("blocked");
    return;
  }
  if (!complete) {
    notify("Complete the mission before claiming its gold.");
    playSfx("blocked");
    return;
  }
  mission.claimed = true;
  save.gold += def.reward;
  save.profile.goldEarned += def.reward;
  save.profile.missionClaims += 1;
  persist();
  playSfx("gold");
  fx.push({ type: "missionGold", timer: 0, x: 640, y: 340, amount: def.reward });
  notify(`Claimed ${def.reward} mission gold.`);
  renderAll();
}

function seeded(seed) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createPlasmoid(options = {}) {
  const type = options.type || TYPE_NAMES[randInt(0, TYPE_NAMES.length - 1)];
  const id = options.id || `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const seed = options.seed || randInt(1000, 999999);
  const rank = options.rank || rollRank();
  const bonus = rank === "Prismatic" ? 14 : rank === "Rare" ? 8 : rank === "Starter" ? 0 : 3;
  const prefixes = ["Astra", "Nova", "Pulse", "Chroma", "Comet", "Ion", "Flux", "Vivid", "Prism", "Quasar"];
  const suffixes = ["Blob", "Wisp", "Burst", "Pop", "Flare", "Zap", "Muse", "Core", "Drift", "Spark"];
  const name = options.name || `${prefixes[Math.floor(seeded(seed) * prefixes.length)]} ${suffixes[Math.floor(seeded(seed + 7) * suffixes.length)]}`;
  return {
    id,
    name,
    type,
    rank,
    hue: seeded(seed + 3),
    maxHp: options.maxHp || randInt(82, 126) + bonus,
    attack: options.attack || randInt(18, 35) + Math.floor(bonus / 2),
    defense: options.defense || randInt(8, 22) + Math.floor(bonus / 3),
    speed: options.speed || randInt(15, 42) + Math.floor(bonus / 2),
    seed,
  };
}

function rollRank() {
  const r = Math.random();
  if (r > 0.92) return "Prismatic";
  if (r > 0.7) return "Rare";
  return "Common";
}

function teamPlasmoids() {
  return save.team.map((id) => save.vat.find((p) => p.id === id)).filter(Boolean);
}

function cloneForBattle(plasmoid) {
  return { ...plasmoid, hp: plasmoid.maxHp, defeated: false };
}

function plasmoidPower(p) {
  return p.maxHp + p.attack * 3.2 + p.defense * 2.2 + p.speed * 2;
}

function teamPower(team) {
  return team.reduce((total, p) => total + plasmoidPower(p), 0);
}

function rankDeltaForPower(power) {
  return Math.max(1, Math.round(power / 100));
}

function battleLabel(source = battle) {
  if (!source) return "Battle";
  const ladder = source.ranked ? "Ranked" : "Unranked";
  const risk = source.risk ? " Risk" : "";
  const power = source.power ? " Power" : "";
  const modeName = source.kind === "planned" ? "Planned" : "Blind";
  return `${ladder}${risk}${power} ${modeName} Battle`;
}

function sanitizeCapturedPlasmoid(p) {
  return {
    id: `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    name: p.name,
    type: p.type,
    rank: p.rank,
    hue: p.hue,
    maxHp: p.maxHp,
    attack: p.attack,
    defense: p.defense,
    speed: p.speed,
    seed: p.seed,
  };
}

function normalizeTeamAfterVatChange() {
  const available = new Set(save.vat.map((p) => p.id));
  save.team = save.team.filter((id) => available.has(id)).slice(0, 3);
  save.vat.forEach((p) => {
    if (save.team.length < 3 && !save.team.includes(p.id)) save.team.push(p.id);
  });
}

function tuneEnemyStats(enemy, ratio) {
  return {
    ...enemy,
    maxHp: Math.max(70, Math.round(enemy.maxHp * ratio)),
    attack: Math.max(14, Math.round(enemy.attack * ratio)),
    defense: Math.max(6, Math.round(enemy.defense * ratio)),
    speed: Math.max(10, Math.round(enemy.speed * ratio)),
  };
}

function randomEnemyTeam(playerTeam = teamPlasmoids()) {
  const target = Math.max(1, teamPower(playerTeam));
  let best = null;
  let bestGap = Infinity;
  for (let i = 0; i < 36; i++) {
    const candidate = [createPlasmoid(), createPlasmoid(), createPlasmoid()];
    const power = teamPower(candidate);
    const gap = Math.abs(power - target);
    if (gap < bestGap) {
      best = candidate;
      bestGap = gap;
    }
  }
  const current = teamPower(best);
  const desired = target * (0.94 + Math.random() * 0.12);
  const ratio = Math.max(0.82, Math.min(1.12, desired / Math.max(1, current)));
  return best.map((p) => cloneForBattle(tuneEnemyStats(p, ratio)));
}

function battleReadyEnemyTeam(enemyTeam) {
  return enemyTeam.map((p) => cloneForBattle(p));
}

function typeMultiplier(attacker, defender) {
  const attackerParts = typeParts(attacker.type);
  const defenderParts = typeParts(defender.type);
  let multiplier = 1;
  attackerParts.forEach((attackType) => {
    defenderParts.forEach((defendType) => {
      if (BASE_TYPES[attackType]?.strong === defendType) multiplier *= 2;
      if (BASE_TYPES[defendType]?.strong === attackType) multiplier *= 0.5;
    });
  });
  return multiplier;
}

function calculateDamage(attacker, defender) {
  const base = Math.max(4, attacker.attack - Math.floor(defender.defense * 0.55));
  const variance = 0.88 + Math.random() * 0.26;
  return Math.max(1, Math.round(base * typeMultiplier(attacker, defender) * variance));
}

function riskSelected() {
  return Boolean(ui.riskToggle?.checked && save.vat.length >= 6);
}

function powerSelected() {
  return Boolean(ui.powerToggle?.checked);
}

function startBlindBattle(ranked = false) {
  plannedBattle = null;
  startBattle({ kind: "blind", ranked, risk: riskSelected(), power: powerSelected() });
}

function beginPlannedBattle(ranked = false) {
  const currentTeam = teamPlasmoids();
  if (!currentTeam.length) {
    notify("Add Plasmoids to your team first.");
    setMode("manage");
    return;
  }
  plannedBattle = {
    kind: "planned",
    enemy: randomEnemyTeam(currentTeam),
    selection: save.team.slice(0, 3),
    ranked,
    risk: riskSelected(),
    power: powerSelected(),
  };
  while (plannedBattle.selection.length < 3) {
    const next = save.vat.find((p) => !plannedBattle.selection.includes(p.id));
    if (!next) break;
    plannedBattle.selection.push(next.id);
  }
  battle = null;
  ui.battleLog.innerHTML = "";
  playSfx("battleStart");
  notify(`${battleLabel(plannedBattle)} scouted. Build your squad.`);
  setMode("battle");
}

function startPlannedBattle() {
  if (!plannedBattle) {
    beginPlannedBattle();
    return;
  }
  if (plannedBattle.selection.length !== 3) {
    notify("Choose exactly three Plasmoids for this planned battle.");
    playSfx("blocked");
    return;
  }
  startBattle({
    kind: "planned",
    ranked: plannedBattle.ranked,
    risk: plannedBattle.risk,
    power: plannedBattle.power,
    teamIds: plannedBattle.selection,
    enemyTeam: plannedBattle.enemy,
  });
  plannedBattle = null;
}

function startBattle({ kind = "blind", ranked = false, risk = false, power = false, teamIds = save.team, enemyTeam = null } = {}) {
  const team = teamIds.map((id) => save.vat.find((p) => p.id === id)).filter(Boolean);
  if (team.length !== 3) {
    notify("Pick a team of three Plasmoids first.");
    setMode("manage");
    return;
  }
  if (risk && save.vat.length < 6) {
    notify("Risk Battles require at least six Plasmoids in your vat.");
    playSfx("blocked");
    return;
  }
  const enemy = enemyTeam ? battleReadyEnemyTeam(enemyTeam) : randomEnemyTeam(team);
  battle = {
    kind,
    ranked,
    risk,
    power,
    playerIds: teamIds.slice(0, 3),
    playerBasePower: teamPower(team),
    enemyBasePower: teamPower(enemy),
    player: team.map(cloneForBattle),
    enemy,
    activePlayer: 0,
    activeEnemy: 0,
    turn: "player",
    log: [],
    startedAt: performance.now(),
    stats: {
      defeated: 0,
      goldEarned: 0,
      attacks: 0,
      damageDealt: 0,
      damageTaken: 0,
      switches: 0,
      forfeited: false,
      rankDelta: 0,
      riskCaptured: 0,
      riskLost: 0,
      powerHits: 0,
    },
    finished: false,
    result: null,
    rewardsApplied: false,
    riskCaptured: [],
    riskLostIds: [],
  };
  pushLog(`${battleLabel()} begins. Enemy power ${Math.round(battle.enemyBasePower)}.`);
  ui.battleSetup.classList.add("hidden");
  ui.battleActions.classList.remove("hidden");
  playSfx("battleStart");
  playMusic("battle");
  renderBattleControls();
  renderAll();
}

function active(side) {
  return battle[side][battle[side === "player" ? "activePlayer" : "activeEnemy"]];
}

function livingIndexes(team) {
  return team.map((p, i) => (p.defeated ? -1 : i)).filter((i) => i >= 0);
}

function firstLiving(team) {
  return livingIndexes(team)[0] ?? -1;
}

function pushLog(message) {
  if (!battle) return;
  battle.log.unshift(message);
  battle.log = battle.log.slice(0, 18);
  ui.battleLog.innerHTML = battle.log.map((line) => `<p>${escapeHtml(line)}</p>`).join("");
}

function playerAttack() {
  if (!battle || battle.finished) return;
  playSfx("attack");
  battle.stats.attacks += 1;
  save.profile.attacks += 1;
  addMissionProgress("attacks", 1);
  const enemyWillSwitch = shouldEnemySwitch();
  const player = active("player");
  const enemy = active("enemy");
  if (enemyWillSwitch && enemy.speed >= player.speed) enemySwitch();
  resolveAttack("player");
  if (!battle || battle.finished) return;
  if (enemyWillSwitch && active("enemy").id === enemy.id) enemySwitch();
  if (!battle || battle.finished) return;
  if (!active("enemy").defeated) resolveAttack("enemy");
  persist();
  renderBattleControls();
  renderAll();
}

function rollPowerEffect(attacker) {
  if (!battle?.power || Math.random() >= 0.5) return null;
  const parts = typeParts(attacker.type);
  const powerType = parts[randInt(0, parts.length - 1)];
  return { type: powerType, ...POWER_EFFECTS[powerType] };
}

function applyPowerEffect(effect, attacker, target) {
  if (!effect) return "";
  if (effect.type === "Volt") {
    target.defense = Math.max(1, target.defense - 1);
    return " and lowers defense";
  }
  if (effect.type === "Toxic") {
    target.defense = Math.max(1, target.defense - 2);
    return " and corrodes defense";
  }
  if (effect.type === "Lunar") {
    const recovered = Math.min(8, attacker.maxHp - attacker.hp);
    attacker.hp += recovered;
    return recovered ? ` and drains ${recovered} HP` : " and surges with lunar energy";
  }
  if (effect.type === "Frost") {
    target.speed = Math.max(1, target.speed - 3);
    return " and slows speed";
  }
  return ` and ${effect.text}`;
}

function resolveAttack(side) {
  const attacker = active(side);
  const target = side === "player" ? active("enemy") : active("player");
  if (!attacker || !target || attacker.defeated || target.defeated) return;
  const powerEffect = rollPowerEffect(attacker);
  const powerBonus = powerEffect ? powerEffect.bonus : 0;
  const damage = calculateDamage(attacker, target) + powerBonus;
  target.hp = Math.max(0, target.hp - damage);
  const powerText = powerEffect ? applyPowerEffect(powerEffect, attacker, target) : "";
  fx.push({ type: "attack", side, timer: 0, damage, x: side === "player" ? 790 : 380, y: 300 });
  if (powerEffect) {
    battle.stats.powerHits += 1;
    save.profile.powerHits += 1;
    fx.push({
      type: "power",
      side,
      timer: 0,
      damage,
      powerType: powerEffect.type,
      label: powerEffect.name,
      color: powerEffect.color,
      x: side === "player" ? 790 : 380,
      y: 300,
    });
    playSfx(`power${powerEffect.type}`);
  }
  if (side === "player") {
    battle.stats.damageDealt += damage;
    save.profile.damageDealt += damage;
    addMissionProgress("damageDealt", damage);
  } else {
    battle.stats.damageTaken += damage;
    save.profile.damageTaken += damage;
  }
  const edge = typeMultiplier(attacker, target);
  const matchupText = edge > 1 ? " with type advantage" : edge < 1 ? " through resistance" : "";
  const powerLog = powerEffect ? `. ${powerEffect.name} triggers${powerText}` : "";
  pushLog(`${attacker.name} hits ${target.name} for ${damage}${matchupText}${powerLog}.`);
  if (target.hp <= 0) defeatPlasmoid(side === "player" ? "enemy" : "player");
}

function defeatPlasmoid(side) {
  const target = active(side);
  target.defeated = true;
  pushLog(`${target.name} collapses into a sparkle puddle.`);
  if (side === "enemy") {
    battle.stats.defeated += 1;
    battle.stats.goldEarned += 1;
    if (battle.risk) battle.riskCaptured.push(sanitizeCapturedPlasmoid(target));
    save.gold += 1;
    save.profile.plasmoidsDefeated += 1;
    save.profile.goldEarned += 1;
    addMissionProgress("defeats", 1);
    playSfx("gold");
    fx.push({ type: "gold", timer: 0, x: 835, y: 215 });
    const next = firstLiving(battle.enemy);
    if (next >= 0) {
      battle.activeEnemy = next;
      pushLog(`Rival sends out ${active("enemy").name}.`);
    }
  } else {
    if (battle.risk) battle.riskLostIds.push(target.id);
    const next = firstLiving(battle.player);
    if (next >= 0) {
      battle.activePlayer = next;
      pushLog(`${active("player").name} jumps in for your team.`);
    }
  }
  checkBattleEnd();
}

function applyBattleConsequences() {
  if (!battle || battle.rewardsApplied) return;
  battle.rewardsApplied = true;
  if (battle.ranked) {
    const delta = rankDeltaForPower(battle.enemyBasePower);
    const signed = battle.result === "win" ? delta : -delta;
    save.rankLevel = Math.max(0, save.rankLevel + signed);
    battle.stats.rankDelta = signed;
    save.profile.rankedBattles += 1;
    save.profile[battle.result === "win" ? "rankedWins" : "rankedLosses"] += 1;
  }
  if (battle.risk) {
    const lostIds = [...new Set(battle.riskLostIds)];
    save.vat = save.vat.filter((p) => !lostIds.includes(p.id));
    battle.riskCaptured.forEach((p) => save.vat.push(p));
    battle.stats.riskCaptured = battle.riskCaptured.length;
    battle.stats.riskLost = lostIds.length;
    save.profile.riskBattles += 1;
    save.profile.riskCaptures += battle.riskCaptured.length;
    save.profile.riskLosses += lostIds.length;
    normalizeTeamAfterVatChange();
  }
  if (battle.power) save.profile.powerBattles += 1;
}

function checkBattleEnd() {
  const enemyLeft = firstLiving(battle.enemy) >= 0;
  const playerLeft = firstLiving(battle.player) >= 0;
  if (enemyLeft && playerLeft) return;
  battle.finished = true;
  battle.result = playerLeft ? "win" : "loss";
  const elapsed = Math.max(1, Math.round(performance.now() - battle.startedAt));
  battle.stats.elapsedMs = elapsed;
  applyBattleConsequences();
  save.profile.battles += 1;
  save.profile[battle.kind === "planned" ? "plannedBattles" : "blindBattles"] += 1;
  save.profile[battle.result === "win" ? "wins" : "losses"] += 1;
  addMissionProgress("battles", 1);
  if (battle.result === "win") addMissionProgress("wins", 1);
  if (battle.kind === "planned") addMissionProgress("plannedBattles", 1);
  if (battle.ranked) addMissionProgress("rankedBattles", 1);
  save.profile.longestBattleMs = Math.max(save.profile.longestBattleMs, elapsed);
  persist();
  ui.battleActions.classList.add("hidden");
  ui.battleSetup.classList.remove("hidden");
  playMusic(battle.result === "win" ? "victory" : "defeat");
  setTimeout(() => showBattleSummary(), 450);
}

function shouldEnemySwitch() {
  const enemy = active("enemy");
  const player = active("player");
  const weak = typeMultiplier(player, enemy) > 1 && enemy.hp < enemy.maxHp * 0.7;
  return livingIndexes(battle.enemy).length > 1 && (weak ? Math.random() < 0.45 : Math.random() < 0.12);
}

function enemySwitch() {
  const current = battle.activeEnemy;
  const options = livingIndexes(battle.enemy).filter((i) => i !== current);
  if (!options.length) return;
  battle.activeEnemy = options[randInt(0, options.length - 1)];
  playSfx("enemySwitch");
  fx.push({ type: "switch", timer: 0, x: 840, y: 332 });
  pushLog(`Rival switches to ${active("enemy").name}.`);
}

function playerSwitch(index) {
  if (!battle || battle.finished || index === battle.activePlayer) return;
  const target = battle.player[index];
  if (!target || target.defeated) return;
  battle.activePlayer = index;
  battle.stats.switches += 1;
  save.profile.switches += 1;
  addMissionProgress("switches", 1);
  playSfx("switch");
  fx.push({ type: "switch", timer: 0, x: 390, y: 332 });
  pushLog(`You switch to ${target.name}.`);
  if (Math.random() < 0.88) resolveAttack("enemy");
  persist();
  renderBattleControls();
  renderAll();
}

function forfeitBattle() {
  if (!battle || battle.finished) return;
  battle.stats.forfeited = true;
  battle.player.forEach((p) => {
    p.hp = 0;
    p.defeated = true;
    if (battle.risk) battle.riskLostIds.push(p.id);
  });
  playSfx("forfeit");
  pushLog("You forfeit the battle and recall your team.");
  checkBattleEnd();
  renderBattleControls();
  renderAll();
}

function showBattleSummary() {
  if (!battle) return;
  ui.summaryTitle.textContent = battle.result === "win" ? "Victory!" : "Defeat";
  ui.summaryArt.className = `summary-art ${battle.result === "win" ? "win" : "loss"}`;
  const stats = battle.stats;
  ui.summaryStats.innerHTML = [
    ["Defeated", stats.defeated],
    ["Gold Earned", stats.goldEarned],
    ["Attacks", stats.attacks],
    ["Damage Dealt", stats.damageDealt],
    ["Damage Taken", stats.damageTaken],
    ["Rank Change", stats.rankDelta > 0 ? `+${stats.rankDelta}` : stats.rankDelta],
    ["Risk Captures", stats.riskCaptured],
    ["Risk Losses", stats.riskLost],
    ["Power Hits", stats.powerHits],
    ["Forfeited", stats.forfeited ? "Yes" : "No"],
    ["Battle Time", formatTime(stats.elapsedMs)],
  ].map(([label, value]) => `<div><strong>${value}</strong>${label}</div>`).join("");
  ui.modal.classList.remove("hidden");
  renderAll();
}

function summonPlasmoid(options = {}) {
  const {
    cost = 3,
    whistleName = "UAP Dogwhistle",
    hybridOnly = false,
    resultTitle = "New Plasmoid Joined Your Vat",
  } = options;
  if (save.gold < cost) {
    notify(`You need ${cost} gold for the ${whistleName}.`);
    playSfx("blocked");
    return;
  }
  save.gold -= cost;
  const type = hybridOnly ? HYBRID_TYPE_NAMES[randInt(0, HYBRID_TYPE_NAMES.length - 1)] : undefined;
  const summoned = createPlasmoid({ type });
  save.vat.push(summoned);
  save.profile.summons += 1;
  addMissionProgress("summons", 1);
  selectedVatId = summoned.id;
  persist();
  playSfx("summon");
  fx.push({ type: "summon", timer: 0, x: 640, y: 330 });
  ui.summonResult.classList.remove("hidden");
  ui.summonResult.innerHTML = plasmoidSummaryHtml(summoned, resultTitle);
  notify(`${summoned.name} answered the ${whistleName}.`);
  renderAll();
}

function summonTwinTonePlasmoid() {
  summonPlasmoid({
    cost: 6,
    whistleName: "Twin Tone Whistle",
    hybridOnly: true,
    resultTitle: "Hybrid Plasmoid Joined Your Vat",
  });
}

function claimDailyGold() {
  if (!dailyGoldReady()) {
    notify(`Daily gold refreshes in ${nextDailyResetLabel()}.`);
    playSfx("blocked");
    renderDaily();
    return;
  }
  save.gold += 3;
  save.lastDailyGoldDate = todayKey();
  save.profile.goldEarned += 3;
  save.profile.dailyClaims += 1;
  persist();
  playSfx("gold");
  fx.push({ type: "dailyGold", timer: 0, x: 640, y: 340 });
  notify("Claimed 3 free daily gold.");
  renderAll();
}

function toggleTeam(id) {
  const exists = save.team.includes(id);
  if (exists) {
    if (save.team.length <= 1) {
      notify("Your team needs at least one Plasmoid.");
      return;
    }
    save.team = save.team.filter((teamId) => teamId !== id);
    playSfx("removeTeam");
  } else {
    if (save.team.length >= 3) {
      notify("Your team already has three Plasmoids.");
      playSfx("blocked");
      return;
    }
    save.team.push(id);
    save.profile.teamAdds += 1;
    playSfx("addTeam");
    fx.push({ type: "team", timer: 0, x: 640, y: 360 });
  }
  selectedVatId = id;
  persist();
  renderAll();
}

function setMode(next) {
  mode = next;
  ui.title.textContent = titleForMode(next);
  ui.tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.mode === next));
  ui.panels.forEach((panel) => panel.classList.toggle("active", panel.id === `panel-${next}`));
  playSfx("nav");
  playMusic(next);
  renderAll();
}

function titleForMode(value) {
  return {
    home: "Home",
    daily: "Daily Gold",
    missions: "Daily Missions",
    battle: "Battle Mode",
    gacha: "Gacha Mode",
    manage: "Management Mode",
    profile: "Player Profile",
    howto: "How To Play",
  }[value];
}

function renderAll() {
  ui.gold.textContent = save.gold;
  ui.rank.textContent = save.rankLevel;
  ui.summon.disabled = save.gold < 3;
  if (ui.twinTone) ui.twinTone.disabled = save.gold < 6;
  renderHome();
  renderDaily();
  renderMissions();
  renderRiskOptions();
  renderPowerOptions();
  renderBattleControls();
  renderPlannedSetup();
  renderManagement();
  renderProfile();
  renderHowTo();
  render();
}

function renderDaily() {
  if (!ui.dailyStatus || !ui.dailyClaim) return;
  const ready = dailyGoldReady();
  ui.dailyClaim.disabled = !ready;
  ui.dailyClaim.textContent = ready ? "Claim 3 Free Gold" : "Claimed Today";
  ui.dailyStatus.innerHTML = ready
    ? `<strong>Reward ready now</strong><span>Claim today for +3 gold, enough for one UAP Dogwhistle summon.</span>`
    : `<strong>Today's reward claimed</strong><span>Next free gold in ${nextDailyResetLabel()}.</span>`;
}

function renderHome() {
  const team = teamPlasmoids();
  const daily = ensureDailyMissions();
  const readyMissions = daily.missions.filter((mission) => !mission.claimed && missionCompleted(mission)).length;
  const claimedMissions = daily.missions.filter((mission) => mission.claimed).length;
  ui.homeSummary.innerHTML = [
    `<div><strong>Daily Gold:</strong> ${dailyGoldReady() ? "Ready to claim" : `Claimed today - ${nextDailyResetLabel()} until reset`}</div>`,
    `<div><strong>Daily Missions:</strong> ${readyMissions ? `${readyMissions} reward${readyMissions === 1 ? "" : "s"} ready` : `${claimedMissions}/3 rewards claimed`}</div>`,
    `<div><strong>Team:</strong> ${team.map((p) => p.name).join(", ")}</div>`,
    `<div><strong>Team Power:</strong> ${Math.round(teamPower(team))}</div>`,
    `<div><strong>Rank Level:</strong> ${save.rankLevel}</div>`,
    `<div><strong>Vat:</strong> ${save.vat.length} Plasmoids collected</div>`,
    `<div><strong>Record:</strong> ${save.profile.wins}W / ${save.profile.losses}L</div>`,
  ].join("");
}

function renderMissions() {
  if (!ui.missionSummary || !ui.missionList) return;
  const daily = ensureDailyMissions();
  const completed = daily.missions.filter(missionCompleted).length;
  const claimed = daily.missions.filter((mission) => mission.claimed).length;
  const availableGold = daily.missions.reduce((total, mission) => {
    const def = missionDefinition(mission.type);
    return total + (!mission.claimed && missionCompleted(mission) ? def.reward : 0);
  }, 0);
  ui.missionSummary.innerHTML = [
    `<strong>${completed}/3 complete · ${claimed}/3 claimed</strong>`,
    `<span>${availableGold ? `${availableGold} gold waiting to claim` : `New missions in ${nextDailyResetLabel()}`}</span>`,
  ].join("");
  ui.missionList.innerHTML = daily.missions.map((mission, index) => {
    const def = missionDefinition(mission.type);
    const progress = missionProgress(mission);
    const complete = progress >= def.target;
    const pct = Math.round((progress / def.target) * 100);
    const state = mission.claimed ? "claimed" : complete ? "complete" : "";
    const buttonText = mission.claimed ? "Claimed" : complete ? `Claim ${def.reward} Gold` : `${progress}/${def.target}`;
    return `
      <article class="mission-card ${state}">
        <div class="mission-card-top">
          <div>
            <h3>${escapeHtml(def.title)}</h3>
            <p>${escapeHtml(def.description)}</p>
          </div>
          <span class="mission-reward">+${def.reward}</span>
        </div>
        <div class="mission-progress" aria-label="${escapeHtml(def.title)} progress">
          <span style="width:${pct}%"></span>
        </div>
        <div class="mission-card-bottom">
          <span>${progress}/${def.target}</span>
          <button class="mini-btn mission-claim-btn" type="button" data-mission-claim="${index}" ${complete && !mission.claimed ? "" : "disabled"}>${buttonText}</button>
        </div>
      </article>`;
  }).join("");
  [...ui.missionList.querySelectorAll("[data-mission-claim]")].forEach((button) => {
    button.addEventListener("click", () => claimMission(Number(button.dataset.missionClaim)));
  });
}

function renderRiskOptions() {
  if (!ui.riskToggle) return;
  if (plannedBattle && !battle) {
    ui.riskToggle.disabled = true;
    ui.riskToggle.checked = plannedBattle.risk;
    ui.riskStatus.textContent = plannedBattle.risk
      ? "Risk rules locked for this scouted battle."
      : "Standard rules locked for this scouted battle.";
    return;
  }
  const allowed = save.vat.length >= 6 && !battle;
  ui.riskToggle.disabled = !allowed;
  if (!allowed) ui.riskToggle.checked = false;
  ui.riskStatus.textContent = allowed
    ? "Capture defeated rivals, lose defeated teammates."
    : `Requires 6+ Plasmoids (${save.vat.length}/6).`;
}

function renderPowerOptions() {
  if (!ui.powerToggle) return;
  if (plannedBattle && !battle) {
    ui.powerToggle.disabled = true;
    ui.powerToggle.checked = plannedBattle.power;
    ui.powerStatus.textContent = plannedBattle.power
      ? "Power rules locked for this scouted battle."
      : "Standard power rules locked for this scouted battle.";
    return;
  }
  ui.powerToggle.disabled = Boolean(battle);
  ui.powerStatus.textContent = battle
    ? "Power rules are locked while a battle is active."
    : "Each attack has a 50% chance to trigger a type power.";
}

function renderBattleControls() {
  ui.attack.classList.remove("attack-advantage", "attack-disadvantage");
  if (!battle || battle.finished) {
    ui.battleSetup.classList.remove("hidden");
    ui.battleActions.classList.add("hidden");
    ui.battleLog.classList.add("hidden");
    ui.battlePowerSummary.classList.toggle("hidden", !plannedBattle);
    ui.battlePowerSummary.innerHTML = plannedBattle
      ? `<strong>${battleLabel(plannedBattle)}</strong><span>Enemy Power ${Math.round(teamPower(plannedBattle.enemy))}</span>`
      : "";
    ui.switchButtons.innerHTML = "";
    return;
  }
  ui.battleSetup.classList.add("hidden");
  ui.battleActions.classList.remove("hidden");
  ui.battleLog.classList.remove("hidden");
  ui.battlePowerSummary.classList.remove("hidden");
  const matchup = typeMultiplier(active("player"), active("enemy"));
  ui.attack.classList.toggle("attack-advantage", matchup > 1);
  ui.attack.classList.toggle("attack-disadvantage", matchup < 1);
  ui.battlePowerSummary.innerHTML = `<strong>${battleLabel()}</strong><span>Your Power ${Math.round(battle.playerBasePower)}</span><span>Enemy Power ${Math.round(battle.enemyBasePower)}</span>`;
  ui.switchButtons.innerHTML = battle.player.map((p, index) => {
    const disabled = p.defeated || index === battle.activePlayer ? "disabled" : "";
    return `<button class="mini-btn" type="button" data-switch="${index}" ${disabled}>Switch: ${escapeHtml(p.name)}</button>`;
  }).join("");
  [...ui.switchButtons.querySelectorAll("[data-switch]")].forEach((button) => {
    button.addEventListener("click", () => playerSwitch(Number(button.dataset.switch)));
  });
}

function renderPlannedSetup() {
  if (!ui.plannedSetup) return;
  const visible = mode === "battle" && !battle && plannedBattle;
  ui.plannedSetup.classList.toggle("hidden", !visible);
  if (!plannedBattle) {
    ui.plannedEnemyList.innerHTML = "";
    ui.plannedTeamSlots.innerHTML = "";
    ui.plannedVatList.innerHTML = "";
    return;
  }
  ui.plannedEnemyList.innerHTML = plannedBattle.enemy.map((p) => plasmoidCardHtml(p, {
    showButton: false,
    mark: `${strongLabel(p.type)} target`,
  })).join("");
  const selected = plannedBattle.selection
    .map((id) => save.vat.find((p) => p.id === id))
    .filter(Boolean);
  ui.plannedPowerSummary.innerHTML = [
    `<strong>${battleLabel(plannedBattle)}</strong>`,
    `<span>Enemy Power ${Math.round(teamPower(plannedBattle.enemy))}</span>`,
    `<span>Your Planned Power ${Math.round(teamPower(selected))}</span>`,
  ].join("");
  ui.plannedTeamSlots.innerHTML = [0, 1, 2].map((index) => {
    const p = selected[index];
    return `<div class="slot-card">${p ? `${escapeHtml(p.name)}<br>${typeLabel(p.type)}` : "Open Slot"}</div>`;
  }).join("");
  ui.plannedVatList.innerHTML = save.vat.map((p) => {
    const inPlan = plannedBattle.selection.includes(p.id);
    return plasmoidCardHtml(p, {
      selected: inPlan,
      buttonLabel: inPlan ? "Remove" : "Add",
      buttonAttr: `data-plan-team="${p.id}"`,
      mark: inPlan ? "planned" : "",
    });
  }).join("");
  ui.startPlannedBattle.disabled = selected.length !== 3;
  ui.startPlannedBattle.textContent = `Start ${battleLabel(plannedBattle)}`;
  [...ui.plannedVatList.querySelectorAll("[data-plan-team]")].forEach((button) => {
    button.addEventListener("click", () => togglePlannedTeam(button.dataset.planTeam));
  });
}

function togglePlannedTeam(id) {
  if (!plannedBattle) return;
  const exists = plannedBattle.selection.includes(id);
  if (exists) {
    if (plannedBattle.selection.length <= 1) {
      notify("A planned battle team needs at least one Plasmoid.");
      playSfx("blocked");
      return;
    }
    plannedBattle.selection = plannedBattle.selection.filter((teamId) => teamId !== id);
    playSfx("removeTeam");
  } else {
    if (plannedBattle.selection.length >= 3) {
      notify("Planned teams can only have three Plasmoids.");
      playSfx("blocked");
      return;
    }
    plannedBattle.selection.push(id);
    playSfx("addTeam");
    fx.push({ type: "team", timer: 0, x: 640, y: 360 });
  }
  renderAll();
}

function renderManagement() {
  const team = teamPlasmoids();
  ui.teamPowerSummary.innerHTML = `<strong>Team Power ${Math.round(teamPower(team))}</strong><span>HP, attack, defense, and speed all contribute.</span>`;
  ui.teamSlots.innerHTML = [0, 1, 2].map((index) => {
    const p = team[index];
    return `<div class="slot-card">${p ? `${escapeHtml(p.name)}<br>${typeLabel(p.type)}` : "Empty Slot"}</div>`;
  }).join("");
  ui.vatList.innerHTML = save.vat.map((p) => {
    const inTeam = save.team.includes(p.id);
    const selected = selectedVatId === p.id ? "outline: 3px solid #ff4fd8;" : "";
    return `
      <article class="plasmoid-card" style="${selected}">
        <div class="plasmoid-chip" style="color:${typeInfo(p.type).color}; background:${plasmoidGradient(p)}"></div>
        <div>
          <div class="plasmoid-name">${escapeHtml(p.name)} ${inTeam ? "★" : ""}</div>
          <div class="plasmoid-meta">${p.rank} ${typeLabel(p.type)}<br>HP ${p.maxHp} · ATK ${p.attack} · DEF ${p.defense} · SPD ${p.speed}</div>
        </div>
        <button class="mini-btn" type="button" data-team="${p.id}">${inTeam ? "Remove" : "Add"}</button>
      </article>`;
  }).join("");
  [...ui.vatList.querySelectorAll("[data-team]")].forEach((button) => {
    button.addEventListener("click", () => toggleTeam(button.dataset.team));
  });
}

function renderProfile() {
  const p = save.profile;
  const winRate = p.battles ? `${Math.round((p.wins / p.battles) * 100)}%` : "0%";
  const rows = [
    ["Rank Level", save.rankLevel],
    ["Battles", p.battles],
    ["Blind Battles", p.blindBattles],
    ["Planned Battles", p.plannedBattles],
    ["Ranked Battles", p.rankedBattles],
    ["Ranked Wins", p.rankedWins],
    ["Ranked Losses", p.rankedLosses],
    ["Risk Battles", p.riskBattles],
    ["Risk Captures", p.riskCaptures],
    ["Risk Losses", p.riskLosses],
    ["Power Battles", p.powerBattles],
    ["Power Hits", p.powerHits],
    ["Wins", p.wins],
    ["Win Rate", winRate],
    ["Plasmoids Defeated", p.plasmoidsDefeated],
    ["Gold Earned", p.goldEarned],
    ["Daily Claims", p.dailyClaims],
    ["Mission Claims", p.missionClaims],
    ["Summons", p.summons],
    ["Attacks", p.attacks],
    ["Switches", p.switches],
    ["Damage Dealt", p.damageDealt],
    ["Damage Taken", p.damageTaken],
    ["Team Adds", p.teamAdds],
    ["Longest Battle", formatTime(p.longestBattleMs)],
  ];
  ui.profileGrid.innerHTML = rows.map(([label, value]) => `<div class="profile-stat"><strong>${value}</strong>${label}</div>`).join("");
}

function renderHowTo() {
  if (!ui.typeChart) return;
  const chartHtml = BASE_TYPE_NAMES.map((type) => {
    const strong = BASE_TYPES[type].strong;
    return `
      <div class="type-row">
        <span class="type-swatch" style="background:${BASE_TYPES[type].color}; box-shadow:0 0 14px ${BASE_TYPES[type].color}"></span>
        <strong>${type}</strong>
        <span>deals double damage to ${strong} and takes half damage back from ${strong}.</span>
      </div>`;
  }).join("");
  ui.typeChart.innerHTML = chartHtml;
  if (ui.modalTypeChart) ui.modalTypeChart.innerHTML = chartHtml;
}

function plasmoidCardHtml(p, options = {}) {
  const selected = options.selected ? "outline: 3px solid #ff4fd8;" : "";
  const marker = options.mark ? `<span class="card-marker">${escapeHtml(options.mark)}</span>` : "";
  const button = options.showButton === false
    ? ""
    : `<button class="mini-btn" type="button" ${options.buttonAttr || ""}>${escapeHtml(options.buttonLabel || "Select")}</button>`;
  return `
    <article class="plasmoid-card" style="${selected}">
      <div class="plasmoid-chip" style="color:${typeInfo(p.type).color}; background:${plasmoidGradient(p)}"></div>
      <div>
        <div class="plasmoid-name">${escapeHtml(p.name)} ${marker}</div>
        <div class="plasmoid-meta">${p.rank} ${typeLabel(p.type)}<br>HP ${p.maxHp} - ATK ${p.attack} - DEF ${p.defense} - SPD ${p.speed}</div>
      </div>
      ${button}
    </article>`;
}

function plasmoidSummaryHtml(p, title) {
  return `
    <h2>${escapeHtml(title)}</h2>
    <article class="plasmoid-card">
      <div class="plasmoid-chip" style="color:${typeInfo(p.type).color}; background:${plasmoidGradient(p)}"></div>
      <div>
        <div class="plasmoid-name">${escapeHtml(p.name)}</div>
        <div class="plasmoid-meta">${p.rank} ${typeLabel(p.type)}<br>HP ${p.maxHp} · ATK ${p.attack} · DEF ${p.defense} · SPD ${p.speed}</div>
      </div>
    </article>`;
}

function drawBackground(kind) {
  const image = images[kind];
  if (image?.complete) {
    ctx.drawImage(image, 0, 0, W, H);
  } else {
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, "#ffea52");
    grad.addColorStop(0.35, "#ff4fd8");
    grad.addColorStop(0.7, "#00d9ff");
    grad.addColorStop(1, "#151128");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }
  ctx.fillStyle = "rgba(21,17,40,0.2)";
  ctx.fillRect(0, 0, W, H);
}

function render() {
  ctx.clearRect(0, 0, W, H);
  if (mode === "battle") renderBattleScene();
  else if (mode === "daily") renderDailyScene();
  else if (mode === "missions") renderMissionsScene();
  else if (mode === "gacha") renderGachaScene();
  else if (mode === "manage") renderVatScene();
  else if (mode === "profile") renderProfileScene();
  else if (mode === "howto") renderHowToScene();
  else renderHomeScene();
  drawFx();
}

function renderHomeScene() {
  drawBackground("home");
  drawTitle("Plasmoid Battlers", "Collect • Manage • Battle");
  teamPlasmoids().forEach((p, i) => drawPlasmoid(p, 420 + i * 210, 450 + Math.sin(t * 2 + i) * 14, 72, true));
}

function renderDailyScene() {
  drawBackground("daily");
  drawTitle("Daily Gold", dailyGoldReady() ? "Claim 3 free gold today" : `Reward claimed - resets in ${nextDailyResetLabel()}`);
}

function renderMissionsScene() {
  drawBackground("missions");
  const daily = ensureDailyMissions();
  const completed = daily.missions.filter(missionCompleted).length;
  drawTitle("Daily Missions", `${completed}/3 complete - resets in ${nextDailyResetLabel()}`);
}

function renderGachaScene() {
  drawBackground("gacha");
  const subtitle = save.gold >= 6
    ? "Twin Tone guarantees a hybrid for 6 gold"
    : save.gold >= 3
      ? "UAP Dogwhistle costs 3 gold"
      : "Win battles to earn more gold";
  drawTitle("Aurora Whistles", subtitle);
}

function renderVatScene() {
  drawBackground("home");
  drawTitle("Plasmoid Vat", `${save.vat.length} collected • ${save.team.length}/3 on team`);
  const shown = save.vat.slice(-7);
  shown.forEach((p, i) => {
    const angle = (i / shown.length) * Math.PI * 2 + t * 0.25;
    const x = 640 + Math.cos(angle) * 285;
    const y = 400 + Math.sin(angle) * 105;
    drawPlasmoid(p, x, y, save.team.includes(p.id) ? 60 : 46, save.team.includes(p.id));
  });
}

function renderProfileScene() {
  drawBackground("victory");
  drawTitle("Battler Profile", `${save.profile.wins} victories • ${save.profile.plasmoidsDefeated} rival Plasmoids defeated`);
}

function renderHowToScene() {
  drawBackground("home");
  drawTitle("How To Play", "Build for hybrids, power rules, speed, and smart switches");
  const cards = [
    ["Hybrids", "Two type matchups"],
    ["Power", "50% type bursts"],
    ["Rewards", "Daily gold missions"],
  ];
  ctx.save();
  ctx.textAlign = "center";
  cards.forEach(([head, text], i) => {
    const x = 210 + i * 330;
    ctx.fillStyle = "rgba(255,255,255,0.84)";
    roundRect(x, 438, 260, 86, 8, true);
    ctx.fillStyle = ["#ff4fd8", "#00d9ff", "#98ff45"][i];
    ctx.font = "900 30px Inter, sans-serif";
    ctx.fillText(head, x + 130, 475);
    ctx.fillStyle = "#17152c";
    ctx.font = "800 19px Inter, sans-serif";
    ctx.fillText(text, x + 130, 505);
  });
  ctx.restore();
}

function renderBattleScene() {
  drawArena();
  if (!battle) {
    const title = plannedBattle ? battleLabel(plannedBattle) : "Battle Mode";
    const subtitle = plannedBattle ? "Scout complete - choose your team" : "Choose Blind Battle or Planned Battle";
    drawTitle(title, subtitle);
    if (plannedBattle) {
      plannedBattle.enemy.forEach((p, i) => drawPlasmoid(p, 360 + i * 150, 300, 50, true));
      plannedBattle.selection
        .map((id) => save.vat.find((p) => p.id === id))
        .filter(Boolean)
        .forEach((p, i) => drawPlasmoid(p, 360 + i * 150, 505, 58, true));
    } else {
      teamPlasmoids().forEach((p, i) => drawPlasmoid(p, 430 + i * 210, 438, 64, true));
    }
    return;
  }
  const player = active("player");
  const enemy = active("enemy");
  battle.player.forEach((p, i) => drawBench(p, 95, 150 + i * 94, i === battle.activePlayer));
  battle.enemy.forEach((p, i) => drawBench(p, 1185, 150 + i * 94, i === battle.activeEnemy, true));
  if (player) {
    const offset = fx.some((f) => f.type === "attack" && f.side === "player") ? Math.sin(t * 38) * 18 : 0;
    drawPlasmoid(player, 395 + offset, 390, 112, true);
    drawHealthBar(250, 510, 300, player.hp, player.maxHp, player.name);
  }
  if (enemy) {
    const offset = fx.some((f) => f.type === "attack" && f.side === "enemy") ? Math.sin(t * 38) * 18 : 0;
    drawPlasmoid(enemy, 888 - offset, 320, 112, true);
    drawHealthBar(735, 160, 300, enemy.hp, enemy.maxHp, enemy.name);
  }
  drawTitle(battle.finished ? (battle.result === "win" ? "Victory!" : "Defeat") : battleLabel(), battle.finished ? "Review your battle results" : "Attack or switch your active Plasmoid");
  drawBattleHoverTooltip();
}

function drawArena() {
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, "#161238");
  grad.addColorStop(0.28, "#233cc7");
  grad.addColorStop(0.56, "#ff4fd8");
  grad.addColorStop(1, "#ffd447");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "rgba(255,255,255,0.16)";
  for (let i = 0; i < 7; i++) {
    ctx.beginPath();
    ctx.ellipse(640, 520, 180 + i * 80, 42 + i * 22, 0, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255,255,255,${0.16 - i * 0.015})`;
    ctx.lineWidth = 4;
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(23,21,44,0.36)";
  ctx.fillRect(0, 0, W, H);
}

function drawTitle(title, subtitle) {
  ctx.save();
  ctx.textAlign = "center";
  ctx.font = "900 54px Inter, sans-serif";
  let titleSize = 54;
  const maxTitleWidth = 780;
  const measured = ctx.measureText(title).width;
  if (measured > maxTitleWidth) titleSize = Math.max(36, Math.floor((maxTitleWidth / measured) * 54));
  ctx.font = `900 ${titleSize}px Inter, sans-serif`;
  const cardWidth = Math.min(900, Math.max(560, ctx.measureText(title).width + 90));
  const cardX = (W - cardWidth) / 2;
  ctx.fillStyle = "rgba(23,21,44,0.5)";
  roundRect(cardX, 34, cardWidth, 112, 8, true);
  ctx.fillStyle = "#fff";
  ctx.fillText(title, 640, 86);
  ctx.font = "800 22px Inter, sans-serif";
  ctx.fillText(subtitle, 640, 122);
  ctx.restore();
}

function pointerNear(x, y, radius) {
  return Math.hypot(pointer.x - x, pointer.y - y) <= radius;
}

function activeHoverTarget() {
  if (!battle || battle.finished || mode !== "battle") return null;
  if (active("player") && pointerNear(395, 390, 120)) return { p: active("player"), side: "Your Active" };
  if (active("enemy") && pointerNear(888, 320, 120)) return { p: active("enemy"), side: "Rival Active" };
  return null;
}

function drawBattleHoverTooltip() {
  const target = activeHoverTarget();
  if (!target) return;
  const { p, side } = target;
  const lines = [
    side,
    `${p.name}`,
    `Type: ${typeLabel(p.type)}`,
    `Speed: ${p.speed}`,
    `Strong vs ${strongLabel(p.type)}`,
  ];
  const width = 230;
  const height = 128;
  const x = Math.min(W - width - 18, Math.max(18, pointer.x + 22));
  const y = Math.min(H - height - 18, Math.max(18, pointer.y - 34));
  ctx.save();
  ctx.fillStyle = "rgba(23,21,44,0.9)";
  ctx.shadowBlur = 22;
  ctx.shadowColor = typeInfo(p.type).color;
  roundRect(x, y, width, height, 8, true);
  ctx.shadowBlur = 0;
  ctx.textAlign = "left";
  ctx.fillStyle = typeInfo(p.type).color;
  ctx.font = "900 18px Inter, sans-serif";
  ctx.fillText(lines[0], x + 14, y + 27);
  ctx.fillStyle = "#fff";
  ctx.font = "900 20px Inter, sans-serif";
  ctx.fillText(lines[1], x + 14, y + 54);
  ctx.font = "800 16px Inter, sans-serif";
  lines.slice(2).forEach((line, i) => ctx.fillText(line, x + 14, y + 80 + i * 19));
  ctx.restore();
}

function wrapText(text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  words.forEach((word) => {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      line = word;
      y += lineHeight;
    } else {
      line = test;
    }
  });
  if (line) ctx.fillText(line, x, y);
}

function drawPlasmoid(p, x, y, radius, featured) {
  const type = typeInfo(p.type);
  ctx.save();
  ctx.translate(x, y);
  const wobble = 1 + Math.sin(t * 3 + p.seed) * 0.04;
  ctx.scale(wobble, 1 / wobble);
  const sprite = sprites[p.type];
  if (sprite?.complete && sprite.naturalWidth > 0) {
    const size = radius * (featured ? 3.15 : 2.75);
    ctx.shadowBlur = featured ? 30 : 16;
    ctx.shadowColor = type.color;
    ctx.drawImage(sprite, -size / 2, -size / 2, size, size);
    ctx.restore();
    return;
  }
  const glow = ctx.createRadialGradient(-radius * 0.25, -radius * 0.28, radius * 0.05, 0, 0, radius);
  glow.addColorStop(0, "#fff");
  glow.addColorStop(0.22, type.color);
  glow.addColorStop(0.72, type.dark);
  glow.addColorStop(1, "#17152c");
  ctx.shadowBlur = featured ? 34 : 20;
  ctx.shadowColor = type.color;
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(255,255,255,0.88)";
  ctx.beginPath();
  ctx.arc(-radius * 0.34, -radius * 0.1, radius * 0.11, 0, Math.PI * 2);
  ctx.arc(radius * 0.34, -radius * 0.1, radius * 0.11, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = Math.max(4, radius * 0.08);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(0, radius * 0.05, radius * 0.42, 0.2, Math.PI - 0.2, false);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,0.45)";
  ctx.lineWidth = Math.max(3, radius * 0.045);
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(0, 0, radius * (0.58 + i * 0.16), t * (0.8 + i * 0.2) + i, t * (0.8 + i * 0.2) + i + Math.PI * 0.8);
    ctx.stroke();
  }
  ctx.restore();
}

function drawBench(p, x, y, selected, mirror = false) {
  ctx.save();
  ctx.globalAlpha = p.defeated ? 0.35 : 1;
  drawPlasmoid(p, x, y, selected ? 36 : 26, selected);
  ctx.textAlign = mirror ? "right" : "left";
  ctx.fillStyle = "#fff";
  ctx.font = "800 15px Inter, sans-serif";
  const labelX = mirror ? x - 46 : x + 46;
  ctx.fillText(`${typeLabel(p.type)} ${Math.max(0, p.hp)}/${p.maxHp}`, labelX, y + 5);
  ctx.restore();
}

function drawHealthBar(x, y, width, hp, maxHp, name) {
  ctx.save();
  ctx.fillStyle = "rgba(23,21,44,0.68)";
  roundRect(x, y, width, 64, 8, true);
  ctx.fillStyle = "#fff";
  ctx.font = "900 20px Inter, sans-serif";
  ctx.fillText(name, x + 14, y + 25);
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  roundRect(x + 14, y + 38, width - 28, 14, 7, true);
  const pct = Math.max(0, hp / maxHp);
  ctx.fillStyle = pct > 0.55 ? "#98ff45" : pct > 0.25 ? "#ffd447" : "#ff3864";
  roundRect(x + 14, y + 38, (width - 28) * pct, 14, 7, true);
  ctx.restore();
}

function drawPowerEffect(effect, life) {
  const x = effect.x;
  const y = effect.y;
  const pulse = 1 + life * 1.8;
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = effect.color;
  ctx.fillStyle = effect.color;
  ctx.shadowBlur = 26;
  ctx.shadowColor = effect.color;
  ctx.lineWidth = Math.max(2, 8 * (1 - life));
  if (effect.powerType === "Solar") {
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2 + t * 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 24 * pulse, Math.sin(a) * 24 * pulse);
      ctx.lineTo(Math.cos(a) * 86 * pulse, Math.sin(a) * 86 * pulse);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(0, 0, 52 * pulse, 0, Math.PI * 2);
    ctx.stroke();
  } else if (effect.powerType === "Volt") {
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(-80 + i * 36, -70);
      ctx.lineTo(-40 + i * 32, -12 + Math.sin(t * 20 + i) * 14);
      ctx.lineTo(-74 + i * 36, 58);
      ctx.stroke();
    }
  } else if (effect.powerType === "Toxic") {
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2 + t;
      const r = 22 + i * 5 + life * 65;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * r, Math.sin(a) * r, 9 + (i % 3) * 5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (effect.powerType === "Lunar") {
    ctx.lineCap = "round";
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(0, 0, 48 + i * 18 + life * 54, -1.1 + i * 0.28, 1.25 + i * 0.24);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(20, -10, 42 * pulse, -1.2, 1.8);
    ctx.stroke();
  } else if (effect.powerType === "Flare") {
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2 - life * 2.5;
      ctx.beginPath();
      ctx.ellipse(Math.cos(a) * 46 * pulse, Math.sin(a) * 30 * pulse, 14, 46, a, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (effect.powerType === "Frost") {
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a) * 90 * pulse, Math.sin(a) * 90 * pulse);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 54 * pulse, Math.sin(a) * 54 * pulse);
      ctx.lineTo(Math.cos(a + 0.28) * 70 * pulse, Math.sin(a + 0.28) * 70 * pulse);
      ctx.stroke();
    }
  }
  ctx.restore();
  ctx.save();
  ctx.fillStyle = "#fff";
  ctx.shadowBlur = 16;
  ctx.shadowColor = effect.color;
  ctx.font = "900 28px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(effect.label, x, y - 112 - life * 52);
  ctx.restore();
}

function drawFx() {
  for (const effect of fx) {
    const life = Math.min(1, effect.timer / 0.8);
    ctx.save();
    ctx.globalAlpha = 1 - life;
    if (effect.type === "attack") {
      ctx.strokeStyle = effect.side === "player" ? "#ffd447" : "#ff3864";
      ctx.lineWidth = 12 * (1 - life);
      ctx.beginPath();
      ctx.moveTo(effect.side === "player" ? 480 : 800, effect.side === "player" ? 360 : 330);
      ctx.lineTo(effect.x + life * 55, effect.y - life * 40);
      ctx.stroke();
      ctx.fillStyle = "#fff";
      ctx.font = "900 42px Inter, sans-serif";
      ctx.fillText(`-${effect.damage}`, effect.x, effect.y - life * 90);
    } else if (effect.type === "power") {
      drawPowerEffect(effect, life);
    } else if (effect.type === "gold" || effect.type === "dailyGold" || effect.type === "missionGold") {
      ctx.fillStyle = "#ffd447";
      ctx.font = "900 64px Inter, sans-serif";
      ctx.fillText(effect.type === "gold" ? "+1" : `+${effect.amount || 3}`, effect.x, effect.y - life * 110);
    } else if (effect.type === "summon") {
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(effect.x, effect.y, 40 + life * 220, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.strokeStyle = effect.type === "team" ? "#98ff45" : "#00d9ff";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(effect.x, effect.y, 30 + life * 140, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }
}

function update(dt) {
  t += dt;
  for (let i = fx.length - 1; i >= 0; i--) {
    fx[i].timer += dt;
    if (fx[i].timer > 0.9) fx.splice(i, 1);
  }
}

function loop(now) {
  const dt = Math.min(0.05, (now - lastFrame) / 1000);
  lastFrame = now;
  update(dt);
  render();
  requestAnimationFrame(loop);
}

function roundRect(x, y, w, h, r, fill, stroke) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

function plasmoidGradient(p) {
  const type = typeInfo(p.type);
  return `radial-gradient(circle at 35% 28%, #fff 0 12%, ${type.color} 24%, ${type.dark} 70%, #17152c 100%)`;
}

function formatTime(ms) {
  const seconds = Math.round(ms / 1000);
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[char]));
}

function notify(message) {
  ui.toast.textContent = message;
  ui.toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => ui.toast.classList.remove("show"), 2200);
}

function unlockAudio() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume();
  playMusic(mode);
}

function playMusic(track) {
  if (!soundEnabled || !audioUnlocked) return;
  const url = MUSIC[track] || MUSIC.home;
  if (currentMusic?.dataset.url === url) return;
  if (currentMusic) {
    currentMusic.pause();
    currentMusic.currentTime = 0;
  }
  currentMusic = new Audio(url);
  currentMusic.dataset.url = url;
  currentMusic.loop = ["home", "daily", "missions", "battle", "gacha", "manage", "profile", "howto"].includes(track);
  currentMusic.volume = 0.38;
  currentMusic.play().catch(() => {});
}

function playSfx(name) {
  if (!soundEnabled) return;
  if (!audioCtx) return;
  const motifs = {
    nav: [72, 76],
    attack: [52, 64, 79],
    switch: [60, 67, 72, 79],
    enemySwitch: [48, 55, 60],
    summon: [67, 72, 79, 84, 91],
    gold: [84, 88, 91],
    forfeit: [52, 47, 43],
    addTeam: [64, 69, 76],
    removeTeam: [76, 69, 64],
    blocked: [44, 43],
    battleStart: [55, 67, 74],
    reset: [84, 72, 60, 48],
    powerSolar: [79, 84, 91, 96],
    powerVolt: [88, 76, 91, 79, 96],
    powerToxic: [50, 53, 57, 62],
    powerLunar: [67, 74, 79, 86],
    powerFlare: [72, 84, 88, 91],
    powerFrost: [91, 86, 79, 74],
  };
  const notes = motifs[name] || motifs.nav;
  const start = audioCtx.currentTime;
  const power = name.startsWith("power");
  notes.forEach((midi, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = power ? (i % 2 ? "sawtooth" : "square") : i % 2 ? "square" : "triangle";
    osc.frequency.value = 440 * 2 ** ((midi - 69) / 12);
    gain.gain.setValueAtTime(0, start + i * 0.055);
    gain.gain.linearRampToValueAtTime(power ? 0.17 : 0.13, start + i * 0.055 + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.001, start + i * 0.055 + (power ? 0.24 : 0.16));
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(start + i * 0.055);
    osc.stop(start + i * 0.055 + (power ? 0.28 : 0.18));
  });
}

function resetGame() {
  if (!confirm("Start a new game and erase local Plasmoid progress?")) return;
  save = makeStarterSave();
  battle = null;
  plannedBattle = null;
  selectedVatId = null;
  localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  playSfx("reset");
  notify("New game started.");
  setMode("home");
}

function installEvents() {
  document.addEventListener("pointerdown", unlockAudio, { once: true });
  document.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === "f") toggleFullscreen();
  });
  canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer = {
      x: ((event.clientX - rect.left) / rect.width) * W,
      y: ((event.clientY - rect.top) / rect.height) * H,
    };
    render();
  });
  canvas.addEventListener("mouseleave", () => {
    pointer = { x: -9999, y: -9999 };
    render();
  });
  ui.tabs.forEach((tab) => tab.addEventListener("click", () => setMode(tab.dataset.mode)));
  document.querySelectorAll("[data-mode]").forEach((button) => {
    if (button.classList.contains("mode-tab")) return;
    button.addEventListener("click", () => {
      setMode(button.dataset.mode);
      if (button.dataset.battleShortcut === "blind") startBlindBattle(false);
      if (button.dataset.battleShortcut === "planned") beginPlannedBattle(false);
    });
  });
  ui.blindBattle.addEventListener("click", () => startBlindBattle(false));
  ui.blindRanked.addEventListener("click", () => startBlindBattle(true));
  ui.plannedBattle.addEventListener("click", () => beginPlannedBattle(false));
  ui.plannedRanked.addEventListener("click", () => beginPlannedBattle(true));
  ui.startPlannedBattle.addEventListener("click", startPlannedBattle);
  ui.attack.addEventListener("click", playerAttack);
  ui.forfeit.addEventListener("click", forfeitBattle);
  ui.summon.addEventListener("click", summonPlasmoid);
  ui.twinTone.addEventListener("click", summonTwinTonePlasmoid);
  ui.dailyClaim.addEventListener("click", claimDailyGold);
  ui.newGame.addEventListener("click", resetGame);
  ui.closeSummary.addEventListener("click", () => {
    ui.modal.classList.add("hidden");
    battle = null;
    setMode("battle");
  });
  ui.soundToggle.addEventListener("click", () => {
    unlockAudio();
    soundEnabled = !soundEnabled;
    ui.soundToggle.textContent = soundEnabled ? "♪" : "×";
    if (!soundEnabled && currentMusic) currentMusic.pause();
    if (soundEnabled) playMusic(mode);
  });
  ui.fullscreen.addEventListener("click", toggleFullscreen);
  ui.setupChart.addEventListener("click", openTypeChart);
  ui.battleChart.addEventListener("click", openTypeChart);
  ui.closeTypeChart.addEventListener("click", closeTypeChart);
}

function openTypeChart() {
  ui.typeChartModal.classList.remove("hidden");
  playSfx("nav");
}

function closeTypeChart() {
  ui.typeChartModal.classList.add("hidden");
  playSfx("nav");
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.();
  } else {
    document.exitFullscreen?.();
  }
}

function preload() {
  Object.entries(ART).forEach(([key, src]) => {
    const img = new Image();
    img.src = src;
    images[key] = img;
  });
  Object.entries(SPRITES).forEach(([key, src]) => {
    const img = new Image();
    img.src = src;
    sprites[key] = img;
  });
}

function gameText() {
  const payload = {
    coordinateSystem: "Canvas 1280x720, origin top-left, x right, y down.",
    mode,
    gold: save.gold,
    dailyGoldReady: dailyGoldReady(),
    lastDailyGoldDate: save.lastDailyGoldDate,
    dailyMissions: ensureDailyMissions(),
    rankLevel: save.rankLevel,
    vatCount: save.vat.length,
    typeCount: TYPE_NAMES.length,
    hybridTypes: TYPE_NAMES.filter((type) => typeParts(type).length === 2).map(typeLabel),
    team: teamPlasmoids().map((p) => ({ name: p.name, type: p.type, label: typeLabel(p.type), hp: p.maxHp, attack: p.attack, defense: p.defense, speed: p.speed })),
    teamPower: Math.round(teamPower(teamPlasmoids())),
    plannedBattle: plannedBattle ? {
      ranked: plannedBattle.ranked,
      risk: plannedBattle.risk,
      power: plannedBattle.power,
      enemy: plannedBattle.enemy.map((p) => ({ name: p.name, type: p.type, label: typeLabel(p.type), hp: p.maxHp, attack: p.attack, defense: p.defense, speed: p.speed })),
      enemyPower: Math.round(teamPower(plannedBattle.enemy)),
      selection: plannedBattle.selection
        .map((id) => save.vat.find((p) => p.id === id))
        .filter(Boolean)
        .map((p) => ({ name: p.name, type: p.type, label: typeLabel(p.type), hp: p.maxHp, attack: p.attack, defense: p.defense, speed: p.speed })),
    } : null,
    battle: battle ? {
      kind: battle.kind,
      ranked: battle.ranked,
      risk: battle.risk,
      power: battle.power,
      label: battleLabel(),
      activePlayer: active("player") ? { name: active("player").name, type: active("player").type, label: typeLabel(active("player").type), hp: active("player").hp, maxHp: active("player").maxHp } : null,
      activeEnemy: active("enemy") ? { name: active("enemy").name, type: active("enemy").type, label: typeLabel(active("enemy").type), hp: active("enemy").hp, maxHp: active("enemy").maxHp } : null,
      playerPower: Math.round(teamPower(battle.player)),
      enemyPower: Math.round(teamPower(battle.enemy)),
      playerRemaining: livingIndexes(battle.player).length,
      enemyRemaining: livingIndexes(battle.enemy).length,
      finished: battle.finished,
      result: battle.result,
      stats: battle.stats,
      latestLog: battle.log.slice(0, 4),
    } : null,
  };
  return JSON.stringify(payload);
}

window.render_game_to_text = gameText;
window.advanceTime = (ms) => {
  const steps = Math.max(1, Math.round(ms / (1000 / 60)));
  for (let i = 0; i < steps; i++) update(1 / 60);
  render();
};

preload();
installEvents();
renderAll();
requestAnimationFrame(loop);
