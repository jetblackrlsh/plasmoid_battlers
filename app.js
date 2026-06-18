const SAVE_KEY = "plasmoid-battlers-save-v1";
const W = 1280;
const H = 720;

const TYPES = {
  Solar: { color: "#ffd447", dark: "#ff7b00", strong: "Volt" },
  Volt: { color: "#00d9ff", dark: "#1749ff", strong: "Toxic" },
  Toxic: { color: "#98ff45", dark: "#009a72", strong: "Lunar" },
  Lunar: { color: "#7c4dff", dark: "#2516a8", strong: "Solar" },
  Flare: { color: "#ff4fd8", dark: "#c4007d", strong: "Frost" },
  Frost: { color: "#9effff", dark: "#1389ff", strong: "Flare" },
};

const TYPE_NAMES = Object.keys(TYPES);
const MUSIC = {
  home: "Music/Plasmoid%20Battlers%20Home.mp3",
  battle: "Music/Plasmoid%20Battle%20Anthem.mp3",
  gacha: "Music/Summoning%20the%20Plasmoids.mp3",
  manage: "Music/Plasmoid%20Management%20Mode.mp3",
  profile: "Music/Battler%20Profile%20Hub.mp3",
  victory: "Music/Plasmoid%20Victory!.mp3",
  defeat: "Music/Plasmoid%20Defeat.mp3",
};

const ART = {
  home: "assets/art/home.png",
  gacha: "assets/art/summon.png",
  victory: "assets/art/victory.png",
  defeat: "assets/art/defeat.png",
};

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const ui = {
  title: document.getElementById("screen-title"),
  gold: document.getElementById("gold-count"),
  tabs: [...document.querySelectorAll(".mode-tab")],
  panels: [...document.querySelectorAll(".panel")],
  toast: document.getElementById("toast"),
  soundToggle: document.getElementById("sound-toggle"),
  fullscreen: document.getElementById("fullscreen-btn"),
  homeSummary: document.getElementById("home-summary"),
  newBattle: document.getElementById("new-battle-btn"),
  battleSetup: document.getElementById("battle-setup"),
  battleActions: document.getElementById("battle-actions"),
  attack: document.getElementById("attack-btn"),
  switchButtons: document.getElementById("switch-buttons"),
  battleLog: document.getElementById("battle-log"),
  summon: document.getElementById("summon-btn"),
  summonResult: document.getElementById("summon-result"),
  teamSlots: document.getElementById("team-slots"),
  vatList: document.getElementById("vat-list"),
  profileGrid: document.getElementById("profile-grid"),
  newGame: document.getElementById("new-game-btn"),
  modal: document.getElementById("battle-summary-modal"),
  summaryTitle: document.getElementById("battle-summary-title"),
  summaryArt: document.getElementById("battle-summary-art"),
  summaryStats: document.getElementById("battle-summary-stats"),
  closeSummary: document.getElementById("close-summary-btn"),
};

const images = {};
let save = loadSave();
let mode = "home";
let t = 0;
let toastTimer = 0;
let currentMusic = null;
let audioUnlocked = false;
let soundEnabled = true;
let audioCtx = null;
let battle = null;
let lastFrame = performance.now();
let selectedVatId = null;
const fx = [];

function makeStarterSave() {
  const starters = [
    createPlasmoid({ type: "Solar", name: "Helio Pop", rank: "Starter", seed: 11 }),
    createPlasmoid({ type: "Volt", name: "Neon Zapp", rank: "Starter", seed: 22 }),
    createPlasmoid({ type: "Toxic", name: "Lime Wisp", rank: "Starter", seed: 33 }),
  ];
  return {
    gold: 3,
    vat: starters,
    team: starters.map((p) => p.id),
    profile: {
      battles: 0,
      wins: 0,
      losses: 0,
      plasmoidsDefeated: 0,
      goldEarned: 0,
      attacks: 0,
      damageDealt: 0,
      damageTaken: 0,
      summons: 0,
      switches: 0,
      teamAdds: 0,
      longestBattleMs: 0,
    },
  };
}

function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return makeStarterSave();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.vat) || parsed.vat.length < 3) return makeStarterSave();
    return parsed;
  } catch {
    return makeStarterSave();
  }
}

function persist() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(save));
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

function randomEnemyTeam() {
  return [createPlasmoid(), createPlasmoid(), createPlasmoid()].map(cloneForBattle);
}

function typeMultiplier(attacker, defender) {
  if (TYPES[attacker.type].strong === defender.type) return 2;
  if (TYPES[defender.type].strong === attacker.type) return 0.5;
  return 1;
}

function calculateDamage(attacker, defender) {
  const base = Math.max(4, attacker.attack - Math.floor(defender.defense * 0.55));
  const variance = 0.88 + Math.random() * 0.26;
  return Math.max(1, Math.round(base * typeMultiplier(attacker, defender) * variance));
}

function startBattle() {
  const team = teamPlasmoids();
  if (team.length !== 3) {
    notify("Pick a team of three Plasmoids first.");
    setMode("manage");
    return;
  }
  battle = {
    player: team.map(cloneForBattle),
    enemy: randomEnemyTeam(),
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
    },
    finished: false,
    result: null,
  };
  pushLog("A rival battler flashes three Plasmoids into the arena.");
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

function resolveAttack(side) {
  const attacker = active(side);
  const target = side === "player" ? active("enemy") : active("player");
  if (!attacker || !target || attacker.defeated || target.defeated) return;
  const damage = calculateDamage(attacker, target);
  target.hp = Math.max(0, target.hp - damage);
  fx.push({ type: "attack", side, timer: 0, damage, x: side === "player" ? 790 : 380, y: 300 });
  if (side === "player") {
    battle.stats.damageDealt += damage;
    save.profile.damageDealt += damage;
  } else {
    battle.stats.damageTaken += damage;
    save.profile.damageTaken += damage;
  }
  const edge = typeMultiplier(attacker, target);
  pushLog(`${attacker.name} hits ${target.name} for ${damage}${edge > 1 ? " with type advantage" : edge < 1 ? " through resistance" : ""}.`);
  if (target.hp <= 0) defeatPlasmoid(side === "player" ? "enemy" : "player");
}

function defeatPlasmoid(side) {
  const target = active(side);
  target.defeated = true;
  pushLog(`${target.name} collapses into a sparkle puddle.`);
  if (side === "enemy") {
    battle.stats.defeated += 1;
    battle.stats.goldEarned += 1;
    save.gold += 1;
    save.profile.plasmoidsDefeated += 1;
    save.profile.goldEarned += 1;
    playSfx("gold");
    fx.push({ type: "gold", timer: 0, x: 835, y: 215 });
    const next = firstLiving(battle.enemy);
    if (next >= 0) {
      battle.activeEnemy = next;
      pushLog(`Rival sends out ${active("enemy").name}.`);
    }
  } else {
    const next = firstLiving(battle.player);
    if (next >= 0) {
      battle.activePlayer = next;
      pushLog(`${active("player").name} jumps in for your team.`);
    }
  }
  checkBattleEnd();
}

function checkBattleEnd() {
  const enemyLeft = firstLiving(battle.enemy) >= 0;
  const playerLeft = firstLiving(battle.player) >= 0;
  if (enemyLeft && playerLeft) return;
  battle.finished = true;
  battle.result = playerLeft ? "win" : "loss";
  const elapsed = Math.max(1, Math.round(performance.now() - battle.startedAt));
  battle.stats.elapsedMs = elapsed;
  save.profile.battles += 1;
  save.profile[battle.result === "win" ? "wins" : "losses"] += 1;
  save.profile.longestBattleMs = Math.max(save.profile.longestBattleMs, elapsed);
  persist();
  ui.battleActions.classList.add("hidden");
  ui.battleSetup.classList.remove("hidden");
  ui.newBattle.textContent = "Find Rival Team";
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
  playSfx("switch");
  fx.push({ type: "switch", timer: 0, x: 390, y: 332 });
  pushLog(`You switch to ${target.name}.`);
  if (Math.random() < 0.88) resolveAttack("enemy");
  persist();
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
    ["Battle Time", formatTime(stats.elapsedMs)],
  ].map(([label, value]) => `<div><strong>${value}</strong>${label}</div>`).join("");
  ui.modal.classList.remove("hidden");
  renderAll();
}

function summonPlasmoid() {
  if (save.gold < 3) {
    notify("You need 3 gold for the UAP Dogwhistle.");
    playSfx("blocked");
    return;
  }
  save.gold -= 3;
  const summoned = createPlasmoid();
  save.vat.push(summoned);
  save.profile.summons += 1;
  selectedVatId = summoned.id;
  persist();
  playSfx("summon");
  fx.push({ type: "summon", timer: 0, x: 640, y: 330 });
  ui.summonResult.classList.remove("hidden");
  ui.summonResult.innerHTML = plasmoidSummaryHtml(summoned, "New Plasmoid Joined Your Vat");
  notify(`${summoned.name} answered the dogwhistle.`);
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
  if (next === "battle" && !battle) ui.newBattle.textContent = "Find Rival Team";
  renderAll();
}

function titleForMode(value) {
  return {
    home: "Home",
    battle: "Battle Mode",
    gacha: "Gacha Mode",
    manage: "Management Mode",
    profile: "Player Profile",
  }[value];
}

function renderAll() {
  ui.gold.textContent = save.gold;
  ui.summon.disabled = save.gold < 3;
  renderHome();
  renderBattleControls();
  renderManagement();
  renderProfile();
  render();
}

function renderHome() {
  const team = teamPlasmoids();
  ui.homeSummary.innerHTML = [
    `<div><strong>Team:</strong> ${team.map((p) => p.name).join(", ")}</div>`,
    `<div><strong>Vat:</strong> ${save.vat.length} Plasmoids collected</div>`,
    `<div><strong>Record:</strong> ${save.profile.wins}W / ${save.profile.losses}L</div>`,
  ].join("");
}

function renderBattleControls() {
  if (!battle || battle.finished) {
    ui.battleSetup.classList.remove("hidden");
    ui.battleActions.classList.add("hidden");
    ui.switchButtons.innerHTML = "";
    return;
  }
  ui.battleSetup.classList.add("hidden");
  ui.battleActions.classList.remove("hidden");
  ui.switchButtons.innerHTML = battle.player.map((p, index) => {
    const disabled = p.defeated || index === battle.activePlayer ? "disabled" : "";
    return `<button class="mini-btn" type="button" data-switch="${index}" ${disabled}>Switch: ${escapeHtml(p.name)}</button>`;
  }).join("");
  [...ui.switchButtons.querySelectorAll("[data-switch]")].forEach((button) => {
    button.addEventListener("click", () => playerSwitch(Number(button.dataset.switch)));
  });
}

function renderManagement() {
  const team = teamPlasmoids();
  ui.teamSlots.innerHTML = [0, 1, 2].map((index) => {
    const p = team[index];
    return `<div class="slot-card">${p ? `${escapeHtml(p.name)}<br>${p.type}` : "Empty Slot"}</div>`;
  }).join("");
  ui.vatList.innerHTML = save.vat.map((p) => {
    const inTeam = save.team.includes(p.id);
    const selected = selectedVatId === p.id ? "outline: 3px solid #ff4fd8;" : "";
    return `
      <article class="plasmoid-card" style="${selected}">
        <div class="plasmoid-chip" style="color:${TYPES[p.type].color}; background:${plasmoidGradient(p)}"></div>
        <div>
          <div class="plasmoid-name">${escapeHtml(p.name)} ${inTeam ? "★" : ""}</div>
          <div class="plasmoid-meta">${p.rank} ${p.type}<br>HP ${p.maxHp} · ATK ${p.attack} · DEF ${p.defense} · SPD ${p.speed}</div>
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
    ["Battles", p.battles],
    ["Wins", p.wins],
    ["Win Rate", winRate],
    ["Plasmoids Defeated", p.plasmoidsDefeated],
    ["Gold Earned", p.goldEarned],
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

function plasmoidSummaryHtml(p, title) {
  return `
    <h2>${escapeHtml(title)}</h2>
    <article class="plasmoid-card">
      <div class="plasmoid-chip" style="color:${TYPES[p.type].color}; background:${plasmoidGradient(p)}"></div>
      <div>
        <div class="plasmoid-name">${escapeHtml(p.name)}</div>
        <div class="plasmoid-meta">${p.rank} ${p.type}<br>HP ${p.maxHp} · ATK ${p.attack} · DEF ${p.defense} · SPD ${p.speed}</div>
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
  else if (mode === "gacha") renderGachaScene();
  else if (mode === "manage") renderVatScene();
  else if (mode === "profile") renderProfileScene();
  else renderHomeScene();
  drawFx();
}

function renderHomeScene() {
  drawBackground("home");
  drawTitle("Plasmoid Battlers", "Collect • Manage • Battle");
  teamPlasmoids().forEach((p, i) => drawPlasmoid(p, 420 + i * 210, 450 + Math.sin(t * 2 + i) * 14, 72, true));
}

function renderGachaScene() {
  drawBackground("gacha");
  drawTitle("UAP Dogwhistle", save.gold >= 3 ? "A summon costs 3 gold" : "Win battles to earn more gold");
  const pulse = 1 + Math.sin(t * 5) * 0.08;
  ctx.save();
  ctx.translate(640, 360);
  ctx.rotate(Math.sin(t * 2.2) * 0.1);
  ctx.scale(pulse, pulse);
  drawDogwhistle(0, 0);
  ctx.restore();
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
  drawMedal(640, 390);
}

function renderBattleScene() {
  drawArena();
  if (!battle) {
    drawTitle("Battle Mode", "Find a rival team to begin");
    teamPlasmoids().forEach((p, i) => drawPlasmoid(p, 430 + i * 210, 438, 64, true));
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
  drawTitle(battle.finished ? (battle.result === "win" ? "Victory!" : "Defeat") : "Battle Mode", battle.finished ? "Review your battle results" : "Attack or switch your active Plasmoid");
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
  ctx.fillStyle = "rgba(23,21,44,0.5)";
  roundRect(360, 34, 560, 112, 8, true);
  ctx.fillStyle = "#fff";
  ctx.font = "900 54px Inter, sans-serif";
  ctx.fillText(title, 640, 86);
  ctx.font = "800 22px Inter, sans-serif";
  ctx.fillText(subtitle, 640, 122);
  ctx.restore();
}

function drawPlasmoid(p, x, y, radius, featured) {
  const type = TYPES[p.type];
  ctx.save();
  ctx.translate(x, y);
  const wobble = 1 + Math.sin(t * 3 + p.seed) * 0.04;
  ctx.scale(wobble, 1 / wobble);
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
  ctx.fillText(`${p.type} ${Math.max(0, p.hp)}/${p.maxHp}`, labelX, y + 5);
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

function drawDogwhistle(x, y) {
  ctx.save();
  ctx.translate(x, y);
  ctx.shadowColor = "#fff";
  ctx.shadowBlur = 20;
  ctx.fillStyle = "#fff";
  roundRect(-140, -28, 220, 56, 28, true);
  ctx.fillStyle = "#ffd447";
  ctx.beginPath();
  ctx.moveTo(70, -35);
  ctx.lineTo(154, -54);
  ctx.lineTo(154, 54);
  ctx.lineTo(70, 35);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "#17152c";
  ctx.lineWidth = 10;
  roundRect(-140, -28, 220, 56, 28, false, true);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(70, -35);
  ctx.lineTo(154, -54);
  ctx.lineTo(154, 54);
  ctx.lineTo(70, 35);
  ctx.closePath();
  ctx.stroke();
  ctx.fillStyle = "#ff4fd8";
  ctx.beginPath();
  ctx.arc(-96, 0, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawMedal(x, y) {
  ctx.save();
  ctx.translate(x, y);
  ctx.shadowBlur = 34;
  ctx.shadowColor = "#ffd447";
  ctx.fillStyle = "#ffd447";
  ctx.beginPath();
  for (let i = 0; i < 16; i++) {
    const r = i % 2 === 0 ? 118 : 82;
    const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
    ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#ff4fd8";
  ctx.beginPath();
  ctx.arc(0, 0, 68, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "900 74px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("★", 0, 4);
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
    } else if (effect.type === "gold") {
      ctx.fillStyle = "#ffd447";
      ctx.font = "900 64px Inter, sans-serif";
      ctx.fillText("+1", effect.x, effect.y - life * 110);
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
  const type = TYPES[p.type];
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
  currentMusic.loop = ["home", "battle", "gacha", "manage", "profile"].includes(track);
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
    addTeam: [64, 69, 76],
    removeTeam: [76, 69, 64],
    blocked: [44, 43],
    battleStart: [55, 67, 74],
    reset: [84, 72, 60, 48],
  };
  const notes = motifs[name] || motifs.nav;
  const start = audioCtx.currentTime;
  notes.forEach((midi, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = i % 2 ? "square" : "triangle";
    osc.frequency.value = 440 * 2 ** ((midi - 69) / 12);
    gain.gain.setValueAtTime(0, start + i * 0.055);
    gain.gain.linearRampToValueAtTime(0.13, start + i * 0.055 + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.001, start + i * 0.055 + 0.16);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(start + i * 0.055);
    osc.stop(start + i * 0.055 + 0.18);
  });
}

function resetGame() {
  if (!confirm("Start a new game and erase local Plasmoid progress?")) return;
  save = makeStarterSave();
  battle = null;
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
  ui.tabs.forEach((tab) => tab.addEventListener("click", () => setMode(tab.dataset.mode)));
  document.querySelectorAll("[data-mode]").forEach((button) => {
    if (button.classList.contains("mode-tab")) return;
    button.addEventListener("click", () => setMode(button.dataset.mode));
  });
  ui.newBattle.addEventListener("click", startBattle);
  ui.attack.addEventListener("click", playerAttack);
  ui.summon.addEventListener("click", summonPlasmoid);
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
}

function gameText() {
  const payload = {
    coordinateSystem: "Canvas 1280x720, origin top-left, x right, y down.",
    mode,
    gold: save.gold,
    vatCount: save.vat.length,
    team: teamPlasmoids().map((p) => ({ name: p.name, type: p.type, hp: p.maxHp, attack: p.attack, defense: p.defense, speed: p.speed })),
    battle: battle ? {
      activePlayer: active("player") ? { name: active("player").name, type: active("player").type, hp: active("player").hp, maxHp: active("player").maxHp } : null,
      activeEnemy: active("enemy") ? { name: active("enemy").name, type: active("enemy").type, hp: active("enemy").hp, maxHp: active("enemy").maxHp } : null,
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
