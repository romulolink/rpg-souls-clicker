let coins = 0;
let playerLevel = 1;
let xp = 0;
let xpRequired = 100;
let levelPoints = 0;
let startTime = Date.now();
let totalPlayTime = 0;
let currentPlanet = 1;
let unlockedPlanets = [1];
let isSessionActive = true;
let sessionStartTime = Date.now();
let sessionDurationBase = 10; // Base session duration in seconds
let clickAreaBase = 10; // Base click area size
let upgrades = {
  dropRate: { value: 1, level: 0 },
  multiplier: { value: 1, level: 0 },
  particleEffect: { value: 10, level: 0 },
  autoCollector: { value: 0, level: 0 },
  triangleChance: { value: 0, level: 0 },
  squareChance: { value: 0, level: 0 },
  pentagonChance: { value: 0, level: 0 },
  hexagonChance: { value: 0, level: 0 },
  heptagonChance: { value: 0, level: 0 },
  octagonChance: { value: 0, level: 0 },
  starChance: { value: 0, level: 0 },
  autoClicker: { value: 0, level: 0 },
  clickArea: { value: 1, level: 0 },
  sessionDuration: { value: 0, level: 0 }
};
let objects = [];
let particles = [];
let collectors = [];
let clickEffects = [];
let spawnEffects = [];
let damageEffects = [];
let coinEffects = [];

const shapeTypes = [
  { type: 'circle', sizeRange: [5, 30], healthRange: [1, 5], coinRange: [1, 5], baseChance: 50, color: '#00FF00' },
  { type: 'triangle', sizeRange: [15, 35], healthRange: [10, 20], coinRange: [10, 20], baseChance: 2, color: '#00FFFF' },
  { type: 'square', sizeRange: [20, 40], healthRange: [20, 40], coinRange: [20, 40], baseChance: 1, color: '#FF0000' },
  { type: 'pentagon', sizeRange: [25, 45], healthRange: [50, 100], coinRange: [50, 100], baseChance: 0.5, color: '#FF9900' }
];

const shapeTypesPlanet2 = [
  { type: 'hexagon', sizeRange: [30, 50], healthRange: [100, 200], coinRange: [150, 300], baseChance: 20, color: '#9900FF' },
  { type: 'heptagon', sizeRange: [35, 55], healthRange: [200, 400], coinRange: [300, 600], baseChance: 5, color: '#FF00FF' },
  { type: 'octagon', sizeRange: [40, 60], healthRange: [400, 800], coinRange: [600, 1200], baseChance: 2, color: '#FF0066' },
  { type: 'star', sizeRange: [45, 65], healthRange: [800, 1600], coinRange: [1200, 2400], baseChance: 1, color: '#00FFFF' }
];

function setup() {
  let canvas = createCanvas(windowWidth - 420, windowHeight);
  canvas.parent('game-container');
  background(20, 20, 30, 255);
  let savedState = localStorage.getItem('dopamineGameSave');
  if (savedState) {
    let gameState = JSON.parse(savedState);
    totalPlayTime = gameState.totalPlayTime || 0;
    currentPlanet = gameState.currentPlanet || 1;
    unlockedPlanets = gameState.unlockedPlanets || [1];
    playerLevel = gameState.playerLevel || 1;
    xp = gameState.xp || 0;
    xpRequired = gameState.xpRequired || 100 * playerLevel;
    levelPoints = gameState.levelPoints || 0;
  }
  updateStats();
  updatePlanetUI();
  loadGame();
  startAutoSave();
  GameAnalytics("setEnabledInfoLog", true);
  GameAnalytics("initialize", "59e28319882515cd0b7a00c0fa7bdbd3", "4753424e89922ada37e553eace0400d4872beb5b");

}

function toggleUpgradesWindow() {
  const upgradesWindow = document.getElementById('upgrades-window');
  const modal = document.getElementById('session-end-modal');
  upgradesWindow.style.display = upgradesWindow.style.display === 'block' ? 'none' : 'block';
  if (upgradesWindow.style.display === 'block') {
    GameAnalytics("addDesignEvent", "View:UpgradesWindow");
    modal.style.display = 'none';
  }
}

function showSessionEndModal() {
  const modal = document.getElementById('session-end-modal');
  modal.style.display = 'block';
  isSessionActive = false;
}

function formatTimeWithMillis(ms) {
  let milliseconds = Math.floor(ms % 1000);
  let seconds = Math.floor(ms / 1000);
  seconds %= 3600;
  let minutes = Math.floor(seconds / 60);
  seconds %= 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
}

function startSession() {

  objects = [];
  particles = [];
  clickEffects = [];
  spawnEffects = [];
  damageEffects = [];
  coinEffects = [];
  collectors = upgrades.autoCollector.level > 0 ? Array(upgrades.autoCollector.level).fill().map(() => ({
    x: width / 2,
    y: height / 2,
    vx: random(-2, 2),
    vy: random(-2, 2)
  })) : [];
  sessionStartTime = Date.now();
  isSessionActive = true;
  document.getElementById('session-end-modal').style.display = 'none';
  updateStats();
  showToast('Session started!');

}

function restartSession() {

  startSession();
  toggleUpgradesWindow();
  showToast('Session restarted!');
}

function goToUpgrades() {
  document.getElementById('session-end-modal').style.display = 'none';
  document.getElementById('upgrades-window').style.display = 'block';
  GameAnalytics("addDesignEvent", "View:UpgradesWindow");
}

function formatTime(ms) {
  let seconds = Math.floor(ms / 1000);
  let hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  let minutes = Math.floor(seconds / 60);
  seconds %= 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function getCurrentShapeTypes() {
  return currentPlanet === 1 ? shapeTypes : shapeTypesPlanet2;
}

function getDropChance(shapeType) {
  let shapeTypesCurrent = getCurrentShapeTypes();
  let totalChance = shapeTypesCurrent.reduce((sum, shape) => {
    return sum + (shape.type === 'circle' || shape.type === 'hexagon' ? shape.baseChance : shape.baseChance + upgrades[shape.type + 'Chance'].value);
  }, 0);
  let shape = shapeTypesCurrent.find(s => s.type === shapeType);
  let chance = shape.type === 'circle' || shape.type === 'hexagon' ? shape.baseChance : shape.baseChance + upgrades[shape.type + 'Chance'].value;
  return (chance / totalChance * 100).toFixed(2);
}

function checkLevelUp() {
  while (xp >= xpRequired) {
    xp -= xpRequired;
    playerLevel += 1;
    levelPoints += 1;
    xpRequired = 100 * playerLevel;
    showToast(`Level Up! Reached Level ${playerLevel}. Gained 1 Level Point!`);
    GameAnalytics("addProgressionEvent", "Complete", `LevelUp:Level${playerLevel}`);
  }
  updateStats();
}

function draw() {
  background(20, 20, 30, 255);
  totalPlayTime += deltaTime;
  document.getElementById('play-time').innerText = formatTime(totalPlayTime);

  if (isSessionActive) {
    let elapsed = (Date.now() - sessionStartTime) / 1000;
    if (elapsed >= (sessionDurationBase * Math.pow(1.25, upgrades.sessionDuration.value))) {
      showSessionEndModal();
      return;
    }

    let sessionTimer = Date.now() - sessionStartTime;
    let remaining = Math.max(0, (sessionDurationBase * Math.pow(1.25, upgrades.sessionDuration.value))  * 1000 - sessionTimer);
    document.getElementById('session-time').innerText = formatTimeWithMillis(remaining);

    let margim = 150;

    if (frameCount % max(1, floor(60 / upgrades.dropRate.value)) === 0) {
      let objData = getRandomObject();
      let obj = {
        x: random(margim, width - margim),
        y: random(margim, height - margim),
        size: objData.size,
        coinValue: objData.coinValue,
        health: objData.health,
        maxHealth: objData.health,
        color: color(objData.color),
        collected: false,
        spawnScale: 0,
        showHealthBar: false,
        healthBarTimer: 0,
        shapeType: objData.shapeType,
        pulsePhase: random(TWO_PI)
      };
      objects.push(obj);
      spawnEffects.push({ x: obj.x, y: obj.y, life: 20, size: obj.size });
    }

    for (let i = spawnEffects.length - 1; i >= 0; i--) {
      let effect = spawnEffects[i];
      effect.life -= 1;
      let scale = map(effect.life, 0, 20, 1, 0);
      noFill();
      stroke(255, 255, 255, map(effect.life, 0, 20, 0, 200));
      strokeWeight(3);
      ellipse(effect.x, effect.y, effect.size * scale);
      if (effect.life <= 0) spawnEffects.splice(i, 1);
    }

    for (let i = objects.length - 1; i >= 0; i--) {
      let obj = objects[i];
      if (!obj.collected) {
        obj.spawnScale = min(obj.spawnScale + 0.1, 1);
        obj.pulsePhase += 0.05;
        let healthRatio = obj.health / obj.maxHealth;
        fill(obj.color.levels[0], obj.color.levels[1] * healthRatio, obj.color.levels[2] * healthRatio, 255);
        stroke(obj.color.levels[0], obj.color.levels[1], obj.color.levels[2], 200);
        strokeWeight(3);
        drawShape(obj);
        if (obj.showHealthBar && obj.healthBarTimer > 0) {
          obj.healthBarTimer -= 1;
          fill(255, 0, 0, 255);
          stroke(255, 0, 0, 200);
          strokeWeight(2);
          let pulseScale = 0.9 + 0.2 * sin(obj.pulsePhase);
          rect(obj.x - (obj.size * pulseScale) / 2, obj.y - (obj.size * pulseScale) / 2 - 10, obj.size * pulseScale * healthRatio, 5);
          if (obj.healthBarTimer <= 0) obj.showHealthBar = false;
        }
      }
    }

    for (let collector of collectors) {
      collector.x += collector.vx;
      collector.y += collector.vy;
      if (random() < 0.05) {
        collector.vx = random(-2, 2);
        collector.vy = random(-2, 2);
      }
      collector.x = constrain(collector.x, 0, width);
      collector.y = constrain(collector.y, 0, height);
      fill(255, 255, 0, 255);
      stroke(255, 255, 0, 200);
      strokeWeight(30);
      rect(collector.x - 15, collector.y - 15, 30, 30);
      for (let i = objects.length - 1; i >= 0; i--) {
        let obj = objects[i];
        if (!obj.collected && dist(collector.x, collector.y, obj.x, obj.y) < obj.size + 15) {
          let baseDamage = (1 + upgrades.clickArea.value * Math.pow(1.25,clickAreaBase)) / 10;
          let damage = obj.maxHealth > 100 ? baseDamage / (obj.maxHealth / 100) : baseDamage;
          obj.health -= damage;
          obj.showHealthBar = true;
          obj.healthBarTimer = 120;
          damageEffects.push({
            x: obj.x,
            y: obj.y - 10,
            text: `-${damage.toFixed(1)}`,
            life: 30,
            vy: -1
          });
          if (obj.health <= 0) {
            obj.collected = true;
            let coinGain = Math.round(obj.coinValue * upgrades.multiplier.value);
            let xpGain = Math.round(obj.maxHealth * 0.5);
            coins += coinGain;
            xp += xpGain;
            coinEffects.push({
              x: obj.x,
              y: obj.y,
              text: `+${coinGain}`,
              life: 30,
              vy: -1
            });
            checkLevelUp();
            updateStats();
            createParticleExplosion(obj.x, obj.y, obj.color);
            objects.splice(i, 1);
            GameAnalytics("addProgressionEvent", "Complete", `Destroy:${obj.shapeType}:Planet${currentPlanet}`);
          }
        }
      }
    }

    if (upgrades.autoClicker.value > 0 && frameCount % max(1, floor(60 / upgrades.autoClicker.value)) === 0) {
      let target = objects.find(obj => !obj.collected);
      if (target) {
        simulateClick(target.x, target.y);
      }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (!p.noGravity) p.vy += 0.1;
      p.life -= 1;
      fill(p.color.levels[0], p.color.levels[1], p.color.levels[2], p.life);
      stroke(p.color.levels[0], p.color.levels[1], p.color.levels[2], 150);
      strokeWeight(2);
      ellipse(p.x, p.y, p.size);
      if (p.life <= 0) particles.splice(i, 1);
    }

    for (let i = clickEffects.length - 1; i >= 0; i--) {
      let effect = clickEffects[i];
      effect.life -= 1;
      let alpha = map(effect.life, 0, 30, 0, 150);
      noFill();
      stroke(255, 255, 0, alpha);
      strokeWeight(3);
      rectMode(CENTER);
      rect(effect.x, effect.y, effect.size * (30 - effect.life) / 30, effect.size * (30 - effect.life) / 30);
      rectMode(CORNER);
      if (effect.life <= 0) clickEffects.splice(i, 1);
    }

    for (let i = damageEffects.length - 1; i >= 0; i--) {
      let effect = damageEffects[i];
      effect.y += effect.vy;
      effect.life -= 1;
      fill(255, 0, 0, map(effect.life, 0, 30, 0, 255));
      stroke(255, 0, 0, map(effect.life, 0, 30, 0, 150));
      strokeWeight(1);
      textSize(14);
      textAlign(CENTER);
      text(effect.text, effect.x, effect.y);
      if (effect.life <= 0) damageEffects.splice(i, 1);
    }

    for (let i = coinEffects.length - 1; i >= 0; i--) {
      let effect = coinEffects[i];
      effect.y += effect.vy - 1;
      effect.life -= 1;
      fill(255, 255, 0, map(effect.life, 0, 30, 0, 255));
      stroke(255, 255, 0, map(effect.life, 0, 30, 0, 150));
      strokeWeight(1);
      textSize(20);
      textStyle(BOLD);
      textAlign(CENTER);
      text(effect.text, effect.x, effect.y);
      if (effect.life <= 0) coinEffects.splice(i, 1);
    }

    if (particles.length > 200) particles.splice(0, particles.length - 200);
    if (damageEffects.length > 50) damageEffects.splice(0, damageEffects.length - 50);
    if (coinEffects.length > 50) coinEffects.splice(0, coinEffects.length - 50);
  }
}

function drawShape(obj) {
  push();
  translate(obj.x, obj.y);
  let pulseScale = 0.9 + 0.2 * sin(obj.pulsePhase);
  scale(obj.spawnScale * pulseScale);
  if (obj.shapeType === 'circle') {
    ellipse(0, 0, obj.size);
  } else if (obj.shapeType === 'triangle') {
    triangle(0, -obj.size / 2, obj.size / 2, obj.size / 2, -obj.size / 2, obj.size / 2);
  } else if (obj.shapeType === 'square') {
    rectMode(CENTER);
    rect(0, 0, obj.size, obj.size);
    rectMode(CORNER);
  } else if (obj.shapeType === 'pentagon') {
    beginShape();
    for (let i = 0; i < 5; i++) {
      let angle = TWO_PI / 5 * i;
      vertex(obj.size / 2 * cos(angle), obj.size / 2 * sin(angle));
    }
    endShape(CLOSE);
  } else if (obj.shapeType === 'hexagon') {
    beginShape();
    for (let i = 0; i < 6; i++) {
      let angle = TWO_PI / 6 * i;
      vertex(obj.size / 2 * cos(angle), obj.size / 2 * sin(angle));
    }
    endShape(CLOSE);
  } else if (obj.shapeType === 'heptagon') {
    beginShape();
    for (let i = 0; i < 7; i++) {
      let angle = TWO_PI / 7 * i;
      vertex(obj.size / 2 * cos(angle), obj.size / 2 * sin(angle));
    }
    endShape(CLOSE);
  } else if (obj.shapeType === 'octagon') {
    beginShape();
    for (let i = 0; i < 8; i++) {
      let angle = TWO_PI / 8 * i;
      vertex(obj.size / 2 * cos(angle), obj.size / 2 * sin(angle));
    }
    endShape(CLOSE);
  } else if (obj.shapeType === 'star') {
    beginShape();
    for (let i = 0; i < 10; i++) {
      let angle = TWO_PI / 10 * i;
      let radius = i % 2 === 0 ? obj.size / 2 : obj.size / 4;
      vertex(radius * cos(angle), radius * sin(angle));
    }
    endShape(CLOSE);
  }
  pop();
}

function getRandomObject() {
  let shapeTypesCurrent = getCurrentShapeTypes();
  let totalChance = shapeTypesCurrent.reduce((sum, shape) => {
    return sum + (shape.type === 'circle' || shape.type === 'hexagon' ? shape.baseChance : shape.baseChance + upgrades[shape.type + 'Chance'].value);
  }, 0);
  let rand = random(totalChance);
  let cumulative = 0;
  let selectedShape = shapeTypesCurrent[0];
  for (let shape of shapeTypesCurrent) {
    let shapeChance = shape.type === 'circle' || shape.type === 'hexagon' ? shape.baseChance : shape.baseChance + upgrades[shape.type + 'Chance'].value;
    cumulative += shapeChance;
    if (rand < cumulative) {
      selectedShape = shape;
      break;
    }
  }
  let size = random(selectedShape.sizeRange[0], selectedShape.sizeRange[1]);
  let health = random(selectedShape.healthRange[0], selectedShape.healthRange[1]);
  let coinValue = random(selectedShape.coinRange[0], selectedShape.coinRange[1]);
  return { size, health, coinValue, shapeType: selectedShape.type, color: selectedShape.color };
}

function calculateCoinValue(size) {
  if (size <= 10) return 1;
  if (size <= 20) return 3;
  return 10;
}

function calculateHealth(size) {
  if (size <= 10) return 10;
  if (size <= 20) return 20;
  return 30;
}

function simulateClick(x, y) {
  if (!isSessionActive) return;
  let hit = false;
  let damage = (1 + upgrades.clickArea.value * Math.pow(1.25,clickAreaBase)) / 10;
  for (let i = objects.length - 1; i >= 0; i--) {
    let obj = objects[i];
    if (!obj.collected && dist(x, y, obj.x, obj.y) < obj.size + upgrades.clickArea.value * 7) {
      obj.health -= damage;
      obj.showHealthBar = true;
      obj.healthBarTimer = 120;
      damageEffects.push({
        x: obj.x,
        y: obj.y - 10,
        text: `-${damage.toFixed(1)}`,
        life: 30,
        vy: -1
      });
      if (obj.health <= 0) {
        obj.collected = true;
        let coinGain = Math.round(obj.coinValue * upgrades.multiplier.value);
        let xpGain = Math.round(obj.maxHealth * 0.5);
        coins += coinGain;
        xp += xpGain;
        coinEffects.push({
          x: obj.x,
          y: obj.y,
          text: `+${coinGain}`,
          life: 30,
          vy: -1
        });
        checkLevelUp();
        updateStats();
        createParticleExplosion(obj.x, obj.y, obj.color);
        GameAnalytics("addProgressionEvent", "Complete", `Destroy:${obj.shapeType}:Planet${currentPlanet}`);
      }
      hit = true;
    }
  }
  clickEffects.push({ x: x, y: y, size: upgrades.clickArea.value * 2 * 7, life: 30 });
  return hit;
}

function mousePressed() {
  simulateClick(mouseX, mouseY);
}

function createParticleExplosion(x, y, baseColor) {
  let particleCount = upgrades.particleEffect.value;
  const neonColors = ['#00FF00', '#00FFFF', '#FF00FF', '#FF9900'];
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: x,
      y: y,
      vx: random(-3, 3),
      vy: random(-3, 3),
      size: random(3, 8),
      color: color(random(neonColors)),
      life: random(20, 60),
      noGravity: true
    });
  }
}

function buyUpgrade(type, baseCost, costMultiplier, increment, levelPointCost = 0) {
  let level = upgrades[type].level;
  if (level >= 99) {
    showToast('Upgrade reached maximum level (99)!');
    return;
  }
  let cost = Math.round(baseCost * (1 + level * costMultiplier));
  let button = document.getElementById(type + 'Btn');
  let dependency = button ? button.getAttribute('data-dependency') : null;
  if (dependency && upgrades[dependency].level === 0) {
    showToast(`Requires ${dependency} level 1!`);
    return;
  }
  let purchased = false;
  if (levelPointCost > 0 && levelPoints >= levelPointCost) {
    levelPoints -= levelPointCost;
    purchased = true;
    showToast(`Purchased ${type} with 1 Level Point!`);
    GameAnalytics("addResourceEvent", "Sink", "LevelPoints", type, "Upgrade", levelPointCost);
  } else if (coins >= cost) {
    coins -= cost;
    purchased = true;
    showToast(`Purchased ${type} with ${formatLargeNumber(cost)} coins!`);
    GameAnalytics("addResourceEvent", "Sink", "Coins", type, "Upgrade", cost);
  } else {
    showToast(`Not enough ${levelPointCost > 0 ? 'level points or coins' : 'coins'}! Cost: ${formatLargeNumber(cost)} coins or ${levelPointCost} LP`);
    return;
  }
  if (purchased) {
    upgrades[type].level += 1;
    if (type === 'dropRate') upgrades.dropRate.value += increment;
    else if (type === 'multiplier') upgrades.multiplier.value += increment;
    else if (type === 'particleEffect') upgrades.particleEffect.value += increment;
    else if (type === 'autoCollector') {
      collectors.push({ x: width / 2, y: height / 2, vx: random(-2, 2), vy: random(-2, 2) });
      upgrades.autoCollector.value += increment;
    }
    else if (type === 'triangleChance' || type === 'squareChance' || type === 'pentagonChance' ||
             type === 'hexagonChance' || type === 'heptagonChance' || type === 'octagonChance' || type === 'starChance') {
      upgrades[type].value += increment;
      showToast(`${type.replace('Chance', '')} chance increased!`);
    }
    else if (type === 'autoClicker') upgrades.autoClicker.value += increment;
    else if (type === 'clickArea') upgrades.clickArea.value += increment;
    else if (type === 'sessionDuration') upgrades.sessionDuration.value += increment;
    updateStats();
    createUpgradeParticles();

    GameAnalytics("addDesignEvent", type + ":" + upgrades[type].value + ":" + Math.floor(totalPlayTime / 60000));
  }
}

function unlockPlanet(planet) {
  if (planet === 2 && !unlockedPlanets.includes(2)) {
    if (coins >= 10000) {
      coins -= 10000;
      unlockedPlanets.push(2);
      switchPlanet(2);
      updateStats();
      showToast('Planet 2 unlocked!');
      GameAnalytics("addProgressionEvent", "Complete", "Unlock:Planet2");
    } else {
      showToast('Not enough coins! Cost: 10K');
    }
  } else {
    switchPlanet(planet);
  }
}

function switchPlanet(planet) {
  if (unlockedPlanets.includes(planet) && currentPlanet !== planet) {
    currentPlanet = planet;
    objects = [];
    updatePlanetUI();
    updateStats();
    showToast(`Switched to Planet ${planet}`);
    GameAnalytics("addDesignEvent", `Switch:Planet${planet}`);
  }
}

function updatePlanetUI() {
  document.getElementById('planet1Btn').classList.toggle('active', currentPlanet === 1);
  document.getElementById('planet2Btn').classList.toggle('active', currentPlanet === 2);
  document.getElementById('planet2Btn').innerText = unlockedPlanets.includes(2) ? 'Planet 2' : 'Planet 2 (Cost: 10K)';
  document.getElementById('planet2Btn').disabled = !unlockedPlanets.includes(2) && coins < 10000;
  document.getElementById('planet1Shapes').style.display = currentPlanet === 1 ? 'block' : 'none';
  document.getElementById('planet2Shapes').style.display = currentPlanet === 2 ? 'block' : 'none';
  document.getElementById('triangleChanceBtn').style.display = currentPlanet === 1 ? 'block' : 'none';
  document.getElementById('squareChanceBtn').style.display = currentPlanet === 1 ? 'block' : 'none';
  document.getElementById('pentagonChanceBtn').style.display = currentPlanet === 1 ? 'block' : 'none';
  document.getElementById('hexagonChanceBtn').style.display = currentPlanet === 2 ? 'block' : 'none';
  document.getElementById('heptagonChanceBtn').style.display = currentPlanet === 2 ? 'block' : 'none';
  document.getElementById('octagonChanceBtn').style.display = currentPlanet === 2 ? 'block' : 'none';
  document.getElementById('starChanceBtn').style.display = currentPlanet === 2 ? 'block' : 'none';
}

function createUpgradeParticles() {
  const neonColors = ['#00FF00', '#00FFFF', '#FF00FF', '#FF9900'];
  for (let i = 0;  i < 50; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-5, 5),
      vy: random(-5, 5),
      size: random(5, 10),
      color: color(random(neonColors)),
      life: random(30, 80)
    });
  }
}

function updateStats() {
  document.getElementById('coins').innerText = formatLargeNumber(coins);
  document.getElementById('player-level').innerText = playerLevel;
  document.getElementById('xp').innerText = formatLargeNumber(xp);
  document.getElementById('xp-required').innerText = formatLargeNumber(xpRequired);
  document.getElementById('level-points').innerText = levelPoints;
  document.getElementById('xp-bar-fill').style.width = `${(xp / xpRequired) * 100}%`;
  document.getElementById('drop-rate').innerText = upgrades.dropRate.value.toFixed(1);
  document.getElementById('session-duration').innerText = upgrades.sessionDuration.value.toFixed(0);

  document.getElementById('player-level').innerText = playerLevel;
  document.getElementById('xp').innerText = formatLargeNumber(xp);
  document.getElementById('xp-required').innerText = formatLargeNumber(xpRequired);
  document.getElementById('xp-bar-fill').style.width = `${(xp / xpRequired) * 100}%`;

  const upgradeDetails = {
  dropRate: { 
    name: 'Increase Drop Rate: Increases the spawn frequency of objects.', 
    baseCost: 50, 
    costMultiplier: 2, 
    levelPointCost: 1, 
    increment: 1, 
    format: 1 
  },
  multiplier: { 
    name: 'Coin Multiplier: Increases coin gain per destroyed object.', 
    baseCost: 200, 
    costMultiplier: 2.5, 
    levelPointCost: 1, 
    increment: 0.5, 
    format: 1 
  },
  particleEffect: { 
    name: 'Improve Particles: Increases the number of particles in explosions.', 
    baseCost: 150, 
    costMultiplier: 1.8, 
    levelPointCost: 1, 
    increment: 5, 
    format: 0 
  },
  autoCollector: { 
    name: 'Add Collector: Adds automatic collectors that destroy objects.', 
    baseCost: 500, 
    costMultiplier: 2.5, 
    levelPointCost: 1, 
    increment: 1, 
    format: 1 
  },
  triangleChance: { 
    name: 'Triangle Chance: Increases the spawn chance of triangles.', 
    baseCost: 300, 
    costMultiplier: 2.3, 
    levelPointCost: 1, 
    increment: 1, 
    format: 1 
  },
  squareChance: { 
    name: 'Square Chance: Increases the spawn chance of squares.', 
    baseCost: 300, 
    costMultiplier: 2.3, 
    levelPointCost: 1, 
    increment: 1, 
    format: 1 
  },
  pentagonChance: { 
    name: 'Pentagon Chance: Increases the spawn chance of pentagons.', 
    baseCost: 300, 
    costMultiplier: 2.3, 
    levelPointCost: 1, 
    increment: 1, 
    format: 1 
  },
  hexagonChance: { 
    name: 'Hexagon Chance: Increases the spawn chance of hexagons.', 
    baseCost: 500, 
    costMultiplier: 2.5, 
    levelPointCost: 1, 
    increment: 1, 
    format: 1 
  },
  heptagonChance: { 
    name: 'Heptagon Chance: Increases the spawn chance of heptagons.', 
    baseCost: 500, 
    costMultiplier: 2.5, 
    levelPointCost: 1, 
    increment: 1, 
    format: 1 
  },
  octagonChance: { 
    name: 'Octagon Chance: Increases the spawn chance of octagons.', 
    baseCost: 500, 
    costMultiplier: 2.5, 
    levelPointCost: 1, 
    increment: 1, 
    format: 1 
  },
  starChance: { 
    name: 'Star Chance: Increases the spawn chance of stars.', 
    baseCost: 500, 
    costMultiplier: 2.5, 
    levelPointCost: 1, 
    increment: 1, 
    format: 1 
  },
  autoClicker: { 
    name: 'Auto-Clicker Rate: Increases the frequency of automatic clicks.', 
    baseCost: 150, 
    costMultiplier: 2, 
    levelPointCost: 0, 
    increment: 0.1, 
    format: 1 
  },
  clickArea: { 
    name: 'Increase Click Area: Increases the effect area of clicks.', 
    baseCost: 200, 
    costMultiplier: 2.2, 
    levelPointCost: 0, 
    increment: 1, 
    format: 0 
  },
  sessionDuration: { 
    name: 'Session Duration: Increases the length of each game session.', 
    baseCost: 100, 
    costMultiplier: 2, 
    levelPointCost: 1, 
    increment: 1, 
    format: 0 
  }
};

  Object.keys(upgradeDetails).forEach(type => {
    let baseCost = upgradeDetails[type].baseCost;
    let costMultiplier = upgradeDetails[type].costMultiplier;
    let levelPointCost = upgradeDetails[type].levelPointCost || 0;
    let cost = Math.round(baseCost * (1 + upgrades[type].level * costMultiplier));
    let button = document.getElementById(type + 'Btn');
    if (button) {
      let costText = levelPointCost > 0 ? `${formatLargeNumber(cost)} coins or ${levelPointCost} LP` : `${formatLargeNumber(cost)} coins`;

      let currentValue = upgrades[type].value.toFixed(upgradeDetails[type].format);
      
      let nextValue = (upgrades[type].value + upgradeDetails[type].increment).toFixed(upgradeDetails[type].format);
      let valueText = type.includes('Chance') ? `Chance: ${currentValue}% → ${nextValue}%` : `Value: ${currentValue} → ${nextValue}`;


      if(type === 'clickArea') {

           currentValue = upgrades[type].value.toFixed(upgradeDetails[type].format);

           nextValue = (upgrades[type].value + upgradeDetails[type].increment).toFixed(upgradeDetails[type].format);
           valueText = `Dmg: ${ ((1 + currentValue * Math.pow(1.25,clickAreaBase)) / 10).toFixed(2) } → ${((1 + nextValue * Math.pow(1.25,clickAreaBase)) / 10).toFixed(2)} Area: ${currentValue} → ${nextValue}`; 

      }

      if(type === 'sessionDuration') {

         nextValue = (upgrades[type].value + upgradeDetails[type].increment).toFixed(upgradeDetails[type].format);
         valueText = `Value: ${ (sessionDurationBase * Math.pow(1.25,currentValue)).toFixed(2)} → ${ (
          sessionDurationBase * Math.pow(1.25,nextValue)).toFixed(2)}`;
      }

      button.setAttribute('data-tooltip', `${upgradeDetails[type].name} ${valueText} | Cost: ${costText} | Level: ${upgrades[type].level}/99`);
      let dependency = button.getAttribute('data-dependency');
      button.disabled = (dependency && upgrades[dependency].level === 0) || (coins < cost && levelPoints < levelPointCost) || upgrades[type].level >= 99;
    }
  });

  let shapeTypesCurrent = getCurrentShapeTypes();
  shapeTypesCurrent.forEach(shape => {
    document.getElementById(`${shape.type}Chance`).innerText = `${getDropChance(shape.type)}%`;
  });
}

function startAutoSave() {
  setInterval(() => {
    saveGame();
    showToast('Game saved automatically!');
  }, 30000);
}

function saveGame() {
  let gameState = {
    coins: coins,
    playerLevel: playerLevel,
    xp: xp,
    xpRequired: xpRequired,
    levelPoints: levelPoints,
    upgrades: upgrades,
    collectors: collectors.map(c => ({ x: c.x, y: c.y, vx: c.vx, vy: c.vy })),
    totalPlayTime: totalPlayTime,
    currentPlanet: currentPlanet,
    unlockedPlanets: unlockedPlanets,
    objects: objects.map(o => ({
      x: o.x,
      y: o.y,
      size: o.size,
      coinValue: o.coinValue,
      health: o.health,
      maxHealth: o.maxHealth,
      color: o.color.levels,
      collected: o.collected,
      spawnScale: o.spawnScale,
      showHealthBar: o.showHealthBar,
      healthBarTimer: o.healthBarTimer,
      shapeType: o.shapeType,
      pulsePhase: o.pulsePhase
    }))
  };
  localStorage.setItem('dopamineGameSave', JSON.stringify(gameState));
  showToast('Game saved successfully!');
}

function loadGame() {
  let savedState = localStorage.getItem('dopamineGameSave');
  if (savedState) {
    let gameState = JSON.parse(savedState);
    coins = gameState.coins || 0;
    playerLevel = gameState.playerLevel || 1;
    xp = gameState.xp || 0;
    xpRequired = gameState.xpRequired || 100 * playerLevel;
    levelPoints = gameState.levelPoints || 0;
    upgrades = gameState.upgrades || {
      dropRate: { value: 1, level: 0 },
      multiplier: { value: 1, level: 0 },
      particleEffect: { value: 10, level: 0 },
      autoCollector: { value: 0, level: 0 },
      triangleChance: { value: 0, level: 0 },
      squareChance: { value: 0, level: 0 },
      pentagonChance: { value: 0, level: 0 },
      hexagonChance: { value: 0, level: 0 },
      heptagonChance: { value: 0, level: 0 },
      octagonChance: { value: 0, level: 0 },
      starChance: { value: 0, level: 0 },
      autoClicker: { value: 0, level: 0 },
      clickArea: { value: 1, level: 0 },
      sessionDuration: { value: 0, level: 0 }
    };
    if (gameState.upgrades && gameState.upgrades.largeObjectChance) {
      upgrades.triangleChance = { value: gameState.upgrades.largeObjectChance.value / 3, level: Math.floor(gameState.upgrades.largeObjectChance.level / 3) };
      upgrades.squareChance = { value: gameState.upgrades.largeObjectChance.value / 3, level: Math.floor(gameState.upgrades.largeObjectChance.level / 3) };
      upgrades.pentagonChance = { value: gameState.upgrades.largeObjectChance.value / 3, level: Math.floor(gameState.upgrades.largeObjectChance.level / 3) };
    }
    collectors = gameState.collectors ? gameState.collectors.map(c => ({
      x: c.x,
      y: c.y,
      vx: c.vx,
      vy: c.vy
    })) : [];
    objects = gameState.objects ? gameState.objects.map(o => ({
      x: o.x,
      y: o.y,
      size: o.size,
      coinValue: o.coinValue,
      health: o.health || calculateHealth(o.size),
      maxHealth: o.maxHealth || calculateHealth(o.size),
      color: color(o.color[0], o.color[1], o.color[2]),
      collected: o.collected,
      spawnScale: o.spawnScale,
      showHealthBar: o.showHealthBar || false,
      healthBarTimer: o.healthBarTimer || 0,
      shapeType: o.shapeType || 'circle',
      pulsePhase: o.pulsePhase || random(TWO_PI)
    })).filter(o => {
      let validShapes = currentPlanet === 1 ? shapeTypes : shapeTypesPlanet2;
      return validShapes.some(shape => shape.type === o.shapeType);
    }) : [];
    totalPlayTime = gameState.totalPlayTime || 0;
    currentPlanet = gameState.currentPlanet || 1;
    unlockedPlanets = gameState.unlockedPlanets || [1];
    updatePlanetUI();
    updateStats();
    showToast(`Game loaded successfully! Total time: ${formatTime(totalPlayTime)}`);
  } else {
    showToast('No saved game found.');
  }
}

function clearSaves() {
  localStorage.removeItem('dopamineGameSave');
  coins = 0;
  playerLevel = 1;
  xp = 0;
  xpRequired = 100;
  levelPoints = 0;
  upgrades = {
    dropRate: { value: 1, level: 0 },
    multiplier: { value: 1, level: 0 },
    particleEffect: { value: 10, level: 0 },
    autoCollector: { value: 0, level: 0 },
    triangleChance: { value: 0, level: 0 },
    squareChance: { value: 0, level: 0 },
    pentagonChance: { value: 0, level: 0 },
    hexagonChance: { value: 0, level: 0 },
    heptagonChance: { value: 0, level: 0 },
    octagonChance: { value: 0, level: 0 },
    starChance: { value: 0, level: 0 },
    autoClicker: { value: 0, level: 0 },
    clickArea: { value: 1, level: 0 },
    sessionDuration: { value: 0, level: 0 }
  };
  collectors = [];
  objects = [];
  particles = [];
  clickEffects = [];
  spawnEffects = [];
  damageEffects = [];
  coinEffects = [];
  totalPlayTime = 0;
  currentPlanet = 1;
  unlockedPlanets = [1];
  sessionStartTime = Date.now();
  isSessionActive = true;
  updatePlanetUI();
  updateStats();
  showToast('All saves have been cleared!');
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function formatLargeNumber(number, locale = navigator.language) {
  try {
    if (isNaN(number) || number === null) return "0";
    const suffixes = [
      { threshold: 1e12, suffix: "T" },
      { threshold: 1e9, suffix: "B" },
      { threshold: 1e6, suffix: "M" },
      { threshold: 1e3, suffix: "K" },
      { threshold: 1, suffix: "" }
    ];
    const tier = suffixes.find(t => Math.abs(number) >= t.threshold) || suffixes[suffixes.length - 1];
    const scaled = number / tier.threshold;
    const formatter = new Intl.NumberFormat(locale, {
      maximumFractionDigits: scaled >= 10 ? 0 : 1,
      minimumFractionDigits: 0
    });
    return `${formatter.format(scaled)}${tier.suffix}`;
  } catch (error) {
    console.error("Error formatting number:", error);
    return number.toString();
  }
}

function windowResized() {
  resizeCanvas(windowWidth - 420, windowHeight);
}