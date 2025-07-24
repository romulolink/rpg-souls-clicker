"use strict";
let player = {};
let enemy = {};

let progressCombatPlayer = { canProgress: true };
let progressCombatEnemy = { canProgress: true };
let fps = meta.fps;
let playerAttackInterval;
let enemyAttackInverval;
let playerSpeedProgress = { value: 0 };
let enemySpeedProgress = { value: 0 };
let newCombatTimeout;
let _startCombat = false;
var useElementalRune = true;
const baseVigorInterval = 1000;
const baseAttackSpeed = 5; // Adjusted to match the original code's logic
let enableIdleCombat = false; // Set to true if you want to enable idle combat
let currentEnemyID = ''; 


var MONSTERS_TYPES = {
  "water": 0,
  "fire": 1,
  "earth": 2,
  "eletric": 3,
  "plant":4
};


let additionalDamages = [
  [1, 1.3, 1.3, 0.7, 0.7], // WATER
  [0.7, 1, 0.7, 1.3, 1.5], // FIRE
  [0.7, 1.3, 1, 1.3, 0.7], // EARTH
  [1.5, 1.3, 0.3, 1, 0.7], // ELETRIC
  [1.5, 0.3, 1.5, 0.7, 1], // GRASS
];


setInterval(updateDisplayCombat, fps);
function updateProgressBarCombat(barId, value, text = '') {
    const progressBarCombat = document.getElementById(barId);
    if (progressBarCombat) {
        progressBarCombat.style.width = value + '%';
        progressBarCombat.textContent = text;
    }
}

function updateProgressBarCombatText(barId, text = '') {
    const progressBarCombat = document.getElementById(barId);
    if (progressBarCombat) {
        progressBarCombat.textContent = progressBarCombat.style.width;
    }
}

function updateDisplayCombat() {

    if(_startCombat == false)
       return;


    const playerImage = document.getElementById('player-image');
    const enemyImage = document.getElementById('enemy-image');
    const playerImageMiniCombat = document.getElementById('player-image-mini-combat');
    const enemyImageMiniCombat = document.getElementById('enemy-image-mini-combat');

    if(!player || !enemy)
        return;


    
    setCustomMethods(player);
    setCustomMethods(enemy);

    if(!playerImage || !enemyImage)
        return;
    
    setEvolutionProfile(player, playerImage);

    setEvolutionProfile(player, playerImageMiniCombat);

    enemyImage.src = enemy.icon_path;
    enemyImageMiniCombat.src = enemy.icon_path;
    
    updateProgressBarCombat('player-health-bar', (player.current_life / player.getLifeTotal()) * 100, player.current_life + '/' + player.getLifeTotal());

      updateProgressBarCombat('player-damage-bar', (player.current_life / player.getLifeTotal()) * 100, player.current_life + '/' + player.getLifeTotal());

    updateProgressBarCombat('current-monster-mini-combat-lifeBar', (player.current_life / player.getLifeTotal()) * 100, player.current_life + '/' + player.getLifeTotal());
    updateProgressBarCombat('player-attack-speed-bar', playerSpeedProgress.value, playerSpeedProgress.value);
    document.getElementById('player-health').textContent = player.getLifeTotal().toString();
    document.getElementById('player-attack-speed').textContent = player.basic_stats.stamina.toString();
    document.getElementById('player-level').textContent = "Lv. " + player.level;
    document.getElementById('player-level-mini-combat').textContent = "Lv. " + player.level;
    let playerXpBarCombat = document.getElementById('player-xpBar-combat');
    let playerXpBarCombatMiniCombat = document.getElementById('current-monster-mini-combat-xpBar');
    progressXpBar(playerXpBarCombat, player);
    progressXpBar(playerXpBarCombatMiniCombat, player);
    document.getElementById('player-monster-name').textContent = player.name;
    document.getElementById('current-monster-mini-combat-name').textContent = player.name;
    document.getElementById('player-monster-rarity').textContent = ' ' + player.rarity;
    document.getElementById('player-monster-rarity').classList = '';
    document.getElementById('player-monster-rarity').classList.add(player.rarity);
    document.getElementById('player-attack').textContent = player.calculateTotalAttack();

    updateProgressBarCombat('enemy-health-bar', (enemy.current_life / enemy.getLifeTotal()) * 100, enemy.current_life + '/' + enemy.basic_stats.life);

      updateProgressBarCombat('enemy-damage-bar', (enemy.current_life / enemy.getLifeTotal()) * 100, enemy.current_life + '/' + enemy.basic_stats.life);

    updateProgressBarCombat('enemy-monster-mini-combat-lifeBar', (enemy.current_life / enemy.getLifeTotal()) * 100, enemy.current_life + '/' + enemy.basic_stats.life);
    updateProgressBarCombat('enemy-attack-speed-bar', enemySpeedProgress.value, enemySpeedProgress.value);
    document.getElementById('enemy-health').textContent = enemy.getLifeTotal().toString();
    document.getElementById('enemy-attack-speed').textContent = enemy.basic_stats.stamina.toString();
    document.getElementById('enemy-level').textContent = "Lv. " + enemy.level;
    document.getElementById('enemy-level-mini-combat').textContent = "Lv. " + enemy.level;
    document.getElementById('enemy-monster-name').textContent = enemy.name;
    document.getElementById('enemy-monster-monster-mini-name').textContent = enemy.name;
    document.getElementById('enemy-monster-rarity').textContent = ' ' + enemy.rarity;
    document.getElementById('enemy-monster-rarity').classList = '';
    document.getElementById('enemy-monster-rarity').classList.add(enemy.rarity);
    document.getElementById('enemy-attack').textContent = enemy.calculateTotalAttack();

}

function startCombat() {
    // Iniciar o combate
    simulateCombat();
}
// Função para simular o combate
function simulateCombat(monster_id = 0, enemyID = '', scene) {

    currentEnemyID = enemyID;

    if(monster_id >= 0){

        enemy = findMonsterById(monster_id);

        let monsterDropHTML = document.getElementById('monster-drops');
        getMonsterDrops(enemy, monsterDropHTML);
    }

    player = currentMonster;

  
    setCustomMethods(player);
    setCustomMethods(enemy);

    if(player.current_life <= 0){
        
        setTimeout(closeCombat, 2000);
        openModal("Battle", "You need to recover you monster life or select another one", 'default');
        return;
    }


    _startCombat = true;

    let playerAdditionalDamage = 1; //additionalDamages[MONSTERS_TYPES[player.monster_type]][MONSTERS_TYPES[enemy.monster_type]];
    let opponentAdditionalDamage = 1; //additionalDamages[MONSTERS_TYPES[enemy.monster_type]][MONSTERS_TYPES[player.monster_type]];

 
    playerAttackInterval = setInterval(function () {


    if(getItemAmount('rune_' + player.monster_type) <= 0 || useElementalRune == false){

        removeAllElementarPowerClass();

        if(playerAdditionalDamage > 1)
           playerAdditionalDamage = 1;


    }else{

        changeElementarPowerClass(player.monster_type);
        discardItem('rune_' + player.monster_type);
    }


    progressBarCombat(playerSpeedProgress, progressCombatPlayer, enemy, player, playerAdditionalDamage);

    if (enemy.current_life <= 0) {

        clearInterval(playerAttackInterval);
        clearInterval(enemyAttackInverval);

        if(enableIdleCombat == true){

            setTimeout(resetEnemyStats, 3000);

            newCombatTimeout = setTimeout(function() {
                simulateCombat(enemy.monster_id,enemyID,scene);
                }, 3000);
        }else{

            setTimeout(resetEnemyStats, 3000);
            removeEnemy(scene,enemyID);

            openTab('tab-explore');
        }

        enemy.current_life = 0;
        StatsController.AddXp(enemy.basic_stats.life);
        GiveMonsterDrops(enemy);
        defeatedEnemiesData.push(enemy.monster_id);

        getMonsterByBox(enemy);

        if(enemy.monster_type === 'plant'){

            achievements.IMRAchievement7.enabled = true;

            activateAchievement('IMRAchievement7');

        }


        if(enemy.monster_type === 'fire'){

           achievements.IMRAchievement8.enabled = true;

           activateAchievement('IMRAchievement8');
         
        }


        if(defeatedEnemiesData.length >= 10){

            achievements.IMRAchievement9.enabled = true;

            activateAchievement('IMRAchievement9');
           

        }

        
        checkMonstersAchievements(enemy);


            return;
        }
    }, baseVigorInterval - player.basic_stats.stamina * baseAttackSpeed);


    enemyAttackInverval = setInterval(function () {
        progressBarCombat(enemySpeedProgress, progressCombatEnemy, player, enemy, opponentAdditionalDamage);

        if (player.current_life <= 0) {   
            openModal("Battle", "You were defeated", 'default');
            stopCombat();
            player.current_life = 0;
            resetPlayerStats();
            resetEnemyStats();
            openTab('tab-explore');

            return;
        }


        if (player.current_life <= parseInt(player.getLifeTotal() * 0.3)){

            autoConsumeFood(player.monster_type);

        }
        
    }, baseVigorInterval - enemy.basic_stats.stamina * baseAttackSpeed);
}


function enableElementalRuneInCombat(value){

    useElementalRune = !value.checked;
}


function stopCombat() {
    _startCombat = false;
    clearInterval(playerAttackInterval);
    clearInterval(enemyAttackInverval);
    clearTimeout(newCombatTimeout);
}

function changeElementarPowerClass(newClass){

    removeAllElementarPowerClass();
    var elementarPowerIcon = document.getElementById('elementar-power-icon');
    elementarPowerIcon.className = newClass + '-power-animation' + ' icon-left';

}

function autoConsumeFood(food_type) {
    
    let super_food_name = 'super_' + food_type + '_lotus';
    let giga_food_name = 'giga_' + food_type + '_lotus';

    if(getItemAmount(giga_food_name) > 0){

        useItem(inventory[giga_food_name]);

    }
    else if(getItemAmount(super_food_name) > 0){

        useItem(inventory[super_food_name]);
        
    }else{

        let food_name = food_type + '_lotus';

        if(getItemAmount(food_name) > 0){

            useItem(inventory[food_name]);
        }

    }


}


function removeAllElementarPowerClass(){

    var elementarPowerIcon = document.getElementById('elementar-power-icon');
    elementarPowerIcon.className = '';

}

function GiveMonsterDrops(enemy){

    for(let d in enemy.drops){

        let num = enemy.drops[d];

        let rand = Math.floor(Math.random() * 101); // generate a number between 0 and 100
        
        if (rand <= num) {
        
            let obj = eval(inventory[d]);

            addItem(obj.slug, 3);
        }     
    }

}


function resetEnemyStats() {
    enemy.current_life = enemy.basic_stats.life;
}
function resetPlayerStats() {
    player.current_life = player.basic_stats.life;
}
function progressBarCombat(elementProgress, ProgressCharacter, character, attacker, attackMultiplier = 1) {

    if (ProgressCharacter.canProgress) {
        ProgressCharacter.canProgress = false;
        var width = 0;
        var id = setInterval(frame, 1);
        function frame() {
            if (width >= 100) {
                clearInterval(id);
                ProgressCharacter.canProgress = true;
                character.current_life -= (attacker.calculateTotalAttack() * attackMultiplier);
                character.current_life = parseInt(character.current_life);
                if (character.current_life < 0)
                    character.current_life = 0;
          
            }
            else {
                width+=10;
                elementProgress.value = width;
            }
        }
    }
}
