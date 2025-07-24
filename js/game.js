var selectedSeedElement;
let selectedSeed = null;
var coinCount = 100000;
var activeIsland = 13;
var totalIslands = 25;
var timePlayed = 0;
var ocean;
var isDev = false;
let isSteam = true;
var progress = { canProgress: true };
const progressBarMap = new Map();

// Declaração global das variáveis electron e ipcRenderer
let electron, ipcRenderer;

try {
  electron = require('electron');
  ipcRenderer = electron.ipcRenderer;
} catch (error) {
  console.log('Erro ao requerer o módulo electron.');
}


// Some data that will be sent to the main process
let Data = {
    message: "Hi",
    someData: "Let's go"
};



/*
 * On Window Load
 */
window.onload = function() {
    setInterval(updateDisplay, meta.fps);
    setInterval(tick, meta.tick);
    setInterval(tickFive, 5000);
    setInterval(saveGame, meta.saveGameInterval);
    loadGame();
    initDisplay();
    initTerrainSlots();
    generateIslands();
    updateIslandAvailability(activeIsland);
    updateValues();
    UI_Lazy_Init();


    // Get town and mayor names and display them.
    // $('#modalClose').click( InitNames('click') );

    function Timer(){
        if(timer > 0){
           timer--;
           updateValues();
       } else{
           lastSave = new Date().toLocaleString();
           timer = 10;
           updateValues();
       }
   }


    setInterval(Timer,1000);

    setInterval(function () { saveGame(); }, 10000);

    //setInterval(createMultipleWaves, 1000);

    enableIslands();

    // Obter a resolução do monitor e definir o tamanho da janela
    var width = window.screen.availWidth;
    var height = window.screen.availHeight;

    const windowWidth = Math.floor(width); // Por exemplo, 80% da largura do monitor
    const windowHeight = Math.floor(height); // Por exemplo, 80% da altura do monitor


   // ipcRenderer.send('initializeWindow', { width: windowWidth, height: windowHeight });


   
    if(isDev)
      document.getElementById("is-dev").innerHTML = "Dev.Version"

    
    calcStorageCost();


};


function calcStorageCost(){

    for(x in resource){
    for(res in resource[x].storage.cost){
        
        resource[x].storage.cost[res] = Math.round(resource[x].storage.cost[res] * resource[x].storage.costIncrease * resource[x].storage.total);


    }
    }


}


function InitNames(){
  
    player_data.townName = document.getElementById('town').value;
    player_data.mayorName = document.getElementById('mayor').value;

    document.getElementById("townName").innerHTML = player_data.townName;
    document.getElementById("mayorName").innerHTML = player_data.mayorName;
    document.getElementById("tutorial-adventurer-name").innerHTML = player_data.mayorName;

    openModal('', '','tutorial');
}


function LoadNames() 
{
    document.getElementById("townName").innerHTML = player_data.townName;
    document.getElementById("mayorName").innerHTML = player_data.mayorName;
    document.getElementById("tutorial-adventurer-name").innerHTML = player_data.mayorName;
}

function tickFive() {

    // running every five seconds
    updateMuseumData();
}

/*
 * Increments Resources
 */
function tick() {

    for (r in resource) {
        autoIncrementResource(eval(resource[r]));
        updateResourcesProgressBar(eval(resource[r]));
    }


    for (i in inventory) {
        autoIncrementInventoryItem(eval(inventory[i]));
    }



    for (w in workers) {

        let obj = eval(workers[w]);

        if(obj.slug == 'brickmaker')
            continue;

        if (obj.chance) {

            increaseChanceResourcesFromWorker(eval(workers[w]));
        }
    }


    timePlayed++;

    CheckQuestCompletion(getCurrentQuestId());

    plantSeedAuto();

    if(resource.coin.total >= 100){

        achievements.IMRAchievement3.enabled = true;

        activateAchievement('IMRAchievement3');
    }


    if(resource.coin.total >= 1000){

        achievements.IMRAchievement4.enabled = true;

       activateAchievement('IMRAchievement4');
    }


    if(resource.coin.total >= 10000){

        achievements.IMRAchievement10.enabled = true;

       activateAchievement('IMRAchievement10');
    }


    if(resource.coin.total >= 100000){

        achievements.IMRAchievement11.enabled = true;

       activateAchievement('IMRAchievement11');
    }


    if(resource.coin.total >= 1000000){

        achievements.IMRAchievement12.enabled = true;

       activateAchievement('IMRAchievement12');
    }


    if(resource.coin.total >= 10000000){

        achievements.IMRAchievement13.enabled = true;

       activateAchievement('IMRAchievement13');
    }


    if(resource.wood.total >= 100){

        achievements.IMRAchievement5.enabled = true;

        activateAchievement('IMRAchievement5');
    }


    
          
    for (var i = 1; i <= totalIslands; i++) {

        var buyButton = document.getElementById("buyButton-island-" + i);
        
        if(buyButton)
            generateBuyButtonContent(buyButton, i);

    }


}


function activateAchievement(achi_id){


     let Data = {
                achi_id: achi_id,
     };

    // Send information to the main process
    // if a listener has been set, then the main process
    // will react to the request !
     if(isSteam && ipcRenderer)
        ipcRenderer.send('activate-achievement', Data);
}


function forceUpdateSave(){

    lastSave = new Date().toLocaleString();
    timer = 0;
}



function calculateDowngradeCost(currentCost, increment) {
    if ((currentCost / increment) <= 0) {
        return currentCost;
    }

    return Math.ceil(currentCost / increment);
}

// Display the correct values.
function updateValues() {
    
    let autoSaveUI = document.getElementById("autosave");

    if(autoSaveUI)
        autoSaveUI.innerHTML = "<h4>Total Time Played: " + calculatePlayTime(timePlayed) + " min ("+ calculatePlayTime(timePlayed,'h') + "h)<br/></h4><h4>Auto-Saving in " + timer + " Last Save: " + lastSave + '</h4>';
}



 function selectCurrentMonsterBtn(monster){

    selectCurrentMonster(monster);
 }


function recoveryLifePoints(_item, points = 2){

    currentMonster.current_life += points;

      if(currentMonster.current_life >= currentMonster.getLifeTotal()){

        showNotification('Your monsters life points is already full');

        currentMonster.current_life = parseInt(currentMonster.getLifeTotal());
        return;
      }


      if(_item.total > 0)
        _item.total--;

      showNotification("The life points of the monster <b>" + currentMonster.name + "</b> was restored to <b>" + currentMonster.current_life + "</b>");
}

function isDefeatedMonster(monster_slug){


    for (let i = 0; i < defeatedEnemiesData.length; i++) {

        var monster = findMonsterById(defeatedEnemiesData[i]);

        if(monster.slug === monster_slug)
            return true;

    }

    return false;
}


function sellItem(_item, _amount){

    if(_item.total >= _amount){
        
        _item.total -= _amount;

        if(isNaN(resource.coin.total) || resource.coin.total == null || resource.coin.total == undefined){
            alert('check coin null')
            resource.coin.total = 0;
        }

        if(_item.cost.coin == null)
            return;
    
        let newCoinTotal = resource.coin.total + (_amount * (_item.cost.coin * 0.5));

        if(newCoinTotal != null)
            resource.coin.total += (_amount * (_item.cost.coin * 0.5));
         

         showNotification("You sold the item <b>" + _item.name + "</b> for " + (_amount * _item.cost.coin * 0.5) + "</b>");


        if(_item.total <= 0){
            
            resetItemDetail();
        }


        var itemData = { itemSlug: _item.slug, amount: _amount };

        addSoldItemData(itemData);

    }
    else{
      resource.coin.total += (_item.total * (_item.cost.coin * 0.5));
      _item.total = 0;  
      resetItemDetail();
    }


}


function discardResource(_resource, amount = 1){

    if(isAInventoryItem(_resource.slug)){

        showNotification('You can not sell this item from here');

        return;
    }


    if (_resource.total >= amount) {

      _resource.total = _resource.total - amount;

      resource.coin.total+= amount;
    
      if(resource.coin.total >= resource.coin.max)
        resource.coin.total = resource.coin.max;

        var itemData = { itemSlug: _resource.slug, amount: amount };

        addSoldItemData(itemData);


    }else{

       resource.coin.total += (parseInt(_resource.total) * 1);
       _resource.total = 0;

        var itemData = { itemSlug: _resource.slug, amount: _resource.total };

        addSoldItemData(itemData);

    }
    
}

 function collectedMonsters(monster_slug){

        if(myMonstersData)
        for(let m in myMonstersData){

            if(myMonstersData[m].slug === monster_slug){

                return true;

            }

        }

        return false;
    
}

 function selectCurrentMonster(monster){


        for(m in myMonstersData){

            if(myMonstersData[m].slug === monster){

                currentMonster = myMonstersData[m];

                setCustomMethods(currentMonster);

                showNotification("The monster <b>" + currentMonster.name + "</b> was selected");

                player_data.current_monster_slug = monster;

                return;
            }


        }
    
    }


    function selectCurrentClass(monster){

        for(m in myClassData){

            if(myClassData[m].slug === monster){

                currentMonster = myClassData[m];

                setCustomMethods(currentMonster);

                showNotification("The Class <b>" + currentMonster.name + "</b> was selected");

                player_data.current_monster_slug = monster;

                return;
            }


        }
    
    }

/*
 * Calculation Functions
 */
Calc = {
    /*
     * Spend Multiple Resources
     * arr - array = Array of arrays. Each contains the resource object slug and the amount to spend of that resource.
     *
     * Returns true if all resource has been spent.
     * Returns false if one resource cannot be spent. It will not spend any resources if one cannot be spent.
     */
    spendResources: function(arr) {
        var shortages = [];

        for (a in arr) {
            let objSlug = arr[a][0];
            let obj = eval(resource[objSlug]);

            if(!obj){
                obj = eval(inventory[objSlug]);
            }

            let i = arr[a][1];
            let newValue = obj.total - i;

            if (newValue < 0) {
                shortages.push(obj.name);
            }
        }

        if (shortages.length === 0) {
            for (a in arr) {
                let objSlug = arr[a][0];
                let obj = eval(resource[objSlug]);

                if(!obj){
                    obj = eval(inventory[objSlug]);
                }

                let i = arr[a][1];
                obj.total -= i;
            }
            return true;
        } else {
            return false;
        }
    },

    /*
     * Takes an object of expenses and puts them into an array of arrays.
     * x - object = The cost object.
     * Returns an array or arrays [[the resource slug, the amount to spend], [...]]
     */
    expensesArray: function(x, mp = 1) {
        expenses = [];
        for (i in x) {
            let costValue = x[i] * mp;
            expenses.push([i, costValue]);
        }
        return expenses;
    }
};

/* TODO: REWRITE THIS FUNCTION TO RETURN TRUE OR FALSE & PUT IT IN Calc
 * Increase a Resource Total
 * x - object = The resource object.
 * i - number = The amount to increase the total by.
 */
function increaseResourceTotalEffect(ui_element, x, i) {
    
    newValue = x.total + i;

    let elmAmountProgressBar = document.getElementById(`${x.slug}-amount-progressBar`);

     var canProgress = true;

    amountProgressBar(elmAmountProgressBar, newValue, x.max);

     if(hasStorage(x, i)){

            // Check if the resource has a cost and manage that.
            if(checkResourceCost(ui_element,x,i)){

                x.total += i;

                if(x.total >= x.max){

                    x.total = x.max;
                }

                removeTooltipListener(ui_element);

                addBox(ui_element.parentNode, x.slug, x.icon_resource == null ? x.icon_path : x.icon_resource);

                playSound(x.slug);

                increaseChanceResources(x, i);

                if(x.slug == "super_fire_lotus"){

                    achievements.IMRAchievement20.enabled = true;

                    activateAchievement('IMRAchievement20');

                }


            }
            else{


                console.log("requirements not met");
            }

           

        }else{


            addTooltipListener(ui_element);

            console.log("unable collect resource");
    }
}





   function selectSeed(dom) {

    selectedSeed = dom.getAttribute('id');

    selectedSeedElement = document.getElementById(selectedSeed);

    const price = parseInt(selectedSeedElement.getAttribute('data-price'));

     if (inventory[selectedSeed].total > 0) {

        showNotification('Click on a ground slot to plant it');

     }else{

        showNotification('You need to buy a ' + inventory[selectedSeed].name + ' to plant it');

     }

    }; 




function addSeedToSlot(_slot, seed) {
  const seedImage = seed.cloneNode(true);
  _slot.append(seedImage);

  const reward = parseInt(seed.getAttribute('data-reward'));
  setTimeout(() => {
    seedImage.remove();
    resource.coin.total += reward;
  }, 3000);
}



function addTerrainSlot(id){

    $('#grid').append('<div onmousedown="plantSeed(this)" id="'+ id +'-terrain-slot" class="slot btn btn-outline-secondary"></div>');

}


function initTerrainSlots(){

    for(i = 0; i < terrainSlots; i++){
        addTerrainSlot(i);
    }


}


function buyTerrainSlot(){


    if (resource.coin.total >= 5) {
      
      resource.coin.total -= 5;

      terrainSlots++;
      addTerrainSlot(terrainSlots - 1);
      

    }else{

        openModal("More coin needed!", "", 'default');
    }

}

let stopPlanting = false;
let plantSkillCounter = 0;

function plantSeedAuto(){

    let seedTypes = [];
    seedTypes.push('plant_lotus_seed');
    seedTypes.push('fire_lotus_seed');
    seedTypes.push('water_lotus_seed');
    seedTypes.push('earth_lotus_seed');

    let plantSkillTotal = workers['plant'].total;

    if(plantSkillCounter < plantSkillTotal)
        stopPlanting = false;
    
    if(stopPlanting == false)
    for(let i = 0; i < seedTypes.length; i++){

        for(let j = 0; j  < terrainSlots; j++){

        let seed_name = seedTypes[i];

        let selectedSeedElement = document.getElementById(seed_name);

        if(getItemAmount(seed_name) > 0){

               dom = document.getElementById(j+'-terrain-slot');

               selectedSeedItem = inventory[seed_name];

               if (selectedSeedItem.total > 0) {

                 const slot = dom;

                 if(!slot)
                    break;

                 
   
                 if (slot.firstChild) {
                       
                      continue;
                 }


                 if(plantSkillCounter >= plantSkillTotal){

                    stopPlanting = true;
                    break;

                 }else{

                     plantSkillCounter++;
                 }

                 selectedSeedItem.total--;
                 
                 const reward = parseInt(selectedSeedElement.getAttribute('data-reward'));

                   slot.append(selectedSeedElement.cloneNode(true));
                   

                   setTimeout(function() {

                     removeAllDomChilds(slot);

                     for(let result in inventory[seed_name].results)
                           addItemNoNotification(result);

                      plantSkillCounter--;
                      stopPlanting = false;

                   }, 3000);

                   break;
                 
               }

       }else{
           // console.log('não há sementes para ser plantadas');
        }

    }
    
    }
 }



 function plantSeed(dom){

    selectedSeedItem = inventory[selectedSeed];

    if (selectedSeedItem.total > 0) {

      const slot = dom;

      if (slot.firstChild) {
            
            showNotification('This slot is already in use');
            return;
      }

      selectedSeedItem.total--;
      
      const reward = parseInt(selectedSeedElement.getAttribute('data-reward'));

        slot.append(selectedSeedElement.cloneNode(true));
        

        setTimeout(function() {

          removeAllDomChilds(slot);

          for(let result in inventory[selectedSeed].results)
                addItem(result);

        }, 3000);
      
    }else{

        showNotification("You need a " + inventory[selectedSeed].name + " to plant in this slot");

    }
  }


function openInventory(){

    openModal('','','inventory')

}


function removeAllDomChilds(node){

    while (node.firstChild) {

        node.removeChild(node.firstChild);
    }
}


function checkResourceCost(ui_element, x, i) {
  if (typeof x.cost !== 'undefined') {
    for (let c in x.cost) {
      let obj = eval(resource[c]);
      
      if (typeof obj === 'undefined') {
       
         obj = eval(inventory[c]);

      }
      
      let costNum = eval(x.cost[c]);
      let newValueOfCost = obj.total - costNum;
      
      if (newValueOfCost < 0) {
        showNotification("requirements not met");
        return false; // Retorna falso se o custo não puder ser atendido
      }
      
      obj.total -= costNum;
    }
    
    showNotification("Crafting new item");

    return true; // Retorna verdadeiro se todos os custos forem atendidos
  } else {
    return true; // Retorna verdadeiro se não houver custo definido
  }
}


function setCustomMethods(monster) {
    monster.getLifeTotal = function() {
        return this.basic_stats.life;// + this.extra_stats.extra_life;
    };

    monster.calculateTotalAttack = function() {
        return this.basic_stats.strength;// + this.extra_stats.extra_attack;
    }; 
}



function hasStorage(x, i){

    if (newValue <= x.max) {
       
        return true;

    } else {

        return false;
    }

}


function fireWorker(x) {

    if(x.total > 0){
        x.total--;
        meta.population--;

        let res = eval(resource[x.resource]);

        if(!res)
            res = eval(inventory[x.resource]);
        
        if(res){
            res.autoIncrement--;
        
            if(res.autoIncrement <= 0)
                res.autoIncrement = 0;
        }
        
        for(let item in x.cost){

          x.cost[item] = calculateDowngradeCost(x.cost[item], x.costIncrease);

        }


    }

}

function addAutomation(x) {

    if(x.autoIncrement >= 0){

        let res = eval(x);


        if(res.autoIncrement == getMaxAutomationTotal(res))
            return;

        res.autoIncrement++;

        if(res.autoIncrement >= getMaxAutomationTotal(res))
           res.autoIncrement = getMaxAutomationTotal(res);
       
    }

}



function removeAutomation(x) {

    if(x.autoIncrement > 0){

        let res = eval(x);
        res.autoIncrement--;

        if(res.autoIncrement <= 0)
           res.autoIncrement = 0;
       
    }

}


function increaseResourceTotal(x, i) {
    
     newValue = x.total + i;
                
     let elmProgressBar = document.getElementById(`${x.slug}-progressBar`);

     let elmAmountProgressBar = document.getElementById(`${x.slug}-amount-progressBar`);

    amountProgressBar(elmAmountProgressBar, newValue, x.max);

        if (checkResouceRequirements(x, newValue, i)) {
            x.total += i;

            if(x.total >= x.max){

                x.total = x.max;       
            }

            progressBar(elmProgressBar,x,i,10);               

            increaseChanceResources(x, i);

            return true;

        } else {
            //x.total = x.max;
            return false;
        }
    
}


function increaseInventoryItemTotal(x, i) {
        
     x.total += i;

     if(x.slug == "super_fire_lotus"){

        achievements.IMRAchievement20.enabled = true;
        activateAchievement('IMRAchievement20');
    }


}


function checkResouceRequirements(x, newValue = 0, i = 1){

    // Check if the resource has a cost and manage that.
    for(let m = 0; m < i; m++)
    if (typeof x.cost !== 'undefined') {
        for (c in x.cost) {

            let obj = eval(resource[c]);
            let costNum = eval(x.cost[c]);


            if(!obj){

                obj = eval(inventory[c]);
            }

       
         
            let newValueOfCost = obj.total - (costNum * i);


            if(obj.slug == 'gold'){

                console.log('(i: ' + i + ' * costNum:' + costNum + ') - obj.total: ' + obj.total + ' = ' + newValueOfCost)

            }

            if (newValueOfCost >= 0) {

               let islandName = /island/;

               if(hasStorage(x) || islandName.test(x.slug)){

                    if(islandName.test(x.slug) == false){

                        obj.total -= (costNum * i);
                        return true;
                    }
                }
               else{
                
                return;

               }
               
            } else {

                return;
            }
        }
    }

     if (newValue <= x.max)
         return true

}


function removeResouceRequirements(x, newValue = 0, i = 1){

    // Check if the resource has a cost and manage that.
    for(let m = 0; m < i; m++)
    if (typeof x.cost !== 'undefined') {
        for (c in x.cost) {

            let obj = eval(resource[c]);
            let costNum = eval(x.cost[c]);


            if(!obj){

                obj = eval(inventory[c]);
            }


            let newValueOfCost = obj.total - costNum;
            if (newValueOfCost >= 0) {

               let islandName = /island/;

               if(hasStorage(x) || islandName.test(x.slug)){

                    if(islandName.test(x.slug)){

                        obj.total -= costNum;
                    }
                }
               else{
                
                return;

               }
               
            } else {

                return;
            }
        }
    }

     if (newValue <= x.max)
         return true

}

function progressBar(element, x, i, widthIncrement = 1) {

     if (!progressBarMap.has(element)) {

        const progressBar = new ProgressBar(element);
        progressBar.start(i, x, widthIncrement);
        progressBarMap.set(element, progressBar);

      }else{

        const progressBar = progressBarMap.get(element);
        progressBar.start(i, x, widthIncrement);    
        progressBarMap.set(element, progressBar);

      }

}



function progressLifeBar(element, x) {

    width = (x.current_life / x.getLifeTotal()) * 100;

    element.style.width = width + "%";
  
}



function progressXpBar(element, x) {

    width = (x.current_xp / StatsController.GetNextXp(x.level) ) * 100;

    width = Math.round(width);

    element.style.width = width + "%";

    if(width >= 100){
       width = 1;
    }
  
}



function amountProgressBar(element, x, i) {

    if(element)
        element.style.width = ((x / i) * 100) + "%";
}

/*
 * Increment Resource from a Click
 * Initiated from the DOM
 * x - object = The resource object.
 */
function clickIncrement(ui_element,x) {

    if (x.autoIncrement == 0){
        // nestes casos há um bug por conta de usarem dois itens para serem craftados 
        if(x.slug !== 'rune_fire' &&
            x.slug !== 'rune_water' && 
              x.slug !== 'rune_plant' &&
                x.slug !== 'rune_earth' &&
                  x.slug !== 'super_fire_lotus' &&
                   x.slug !== 'super_water_lotus' && 
                    x.slug !== 'super_plant_lotus' &&
                     x.slug !== 'super_earth_lotus' &&
                     x.slug !== 'giga_fire_lotus' &&
                      x.slug !== 'giga_water_lotus' && 
                       x.slug !== 'giga_plant_lotus' &&
                        x.slug !== 'giga_earth_lotus'){

                x.autoIncrement = 1;
        }
        
    }

    increaseResourceTotalEffect(ui_element,x, x.clickIncrement);  
}

/*
 * Increment Resource Automatically
 * x - object = The resource object.
 */
function autoIncrementResource(x) {

    if (x.autoIncrement > 0) {      
        increaseResourceTotal(x, x.autoIncrement);
    }
}


function autoIncrementInventoryItem(x) {

    if (x.autoIncrement > 0) {        

        increaseInventoryItemTotal(x, x.autoIncrement);
    }
}

/* AWFULLY WET
 * Increment Resource in the Chance Object of the Passed Resource
 * x - object = The resource object. (Which contains the `chance` object.)
 * i - number = The number of times the chance check should run.
 */
function increaseChanceResources(x, i) {
    if (typeof x.chance !== 'undefined') {
        for (c in x.chance) {
            var counter = 0;
            while (counter < i) {
                let num = x.chance[c];
                let rand = Math.floor(Math.random() * 101);
                if (rand <= num) {
                    let obj = eval(resource[c]);

                    if(!obj)
                        obj = eval(inventory[c]);

                    increaseResourceTotal(obj, obj.chanceIncrement);



                }
                counter++;
            }
        }
    }
}


/* AWFULLY WET
 * Increment Resource in the Chance Object of the Passed Resource
 * x - object = The resource object. (Which contains the `chance` object.)
 * i - number = The number of times the chance check should run.
 */
function getRandomLoot(x, i) {
    if (typeof x.loot_chance !== 'undefined') {
        for (c in x.loot_chance) {
            var counter = 0;
            while (counter < i) {
                let num = x.loot_chance[c];
                let rand = Math.floor(Math.random() * 101);
                if (rand <= num) {
                    let obj = eval(resource[c]);
                    increaseResourceTotal(obj, obj.chanceIncrement);
                }
                counter++;
            }
        }
    }
}


function activateMonstersAchievements(enemy){


    if(enemy.monster_type === 'water' && enemy.evolutions > 1 && enemy.level > 19){

        achievements.IMRAchievement16.enabled = true;

        activateAchievement('IMRAchievement16');

    }

    if(enemy.monster_type === 'plant' && enemy.evolutions > 1 && enemy.level > 19){

        achievements.IMRAchievement17.enabled = true;

        activateAchievement('IMRAchievement17');

    }

    if(enemy.monster_type === 'earth' && enemy.evolutions > 1 && enemy.level > 19){

        achievements.IMRAchievement18.enabled = true;

        activateAchievement('IMRAchievement18');

    }

    if(enemy.monster_type === 'fire' && enemy.evolutions > 1 && enemy.level > 19){

        achievements.IMRAchievement19.enabled = true;

        activateAchievement('IMRAchievement19');

    }


    if(enemy.rarity == 'legendary'){

        achievements.IMRAchievement14.enabled = true;  
        activateAchievement('IMRAchievement14');
         
    }


}

function getMonsterByBox(x) {

   let repeated = hasMonsterStored(monsters[x.slug]);

   let boxName = x.rarity + '_box';

   let hasBox  = getItemAmount(boxName) > 0;


   if(repeated === false && hasBox){

        addMonster(monsters[x.slug]);
        inventory[boxName].total--;
        
   }

   return;

}


/* AWFULLY WET
 * Increment Resource in the Chance Object of the Passed Resource
 * x - object = The resource object. (Which contains the `chance` object.)
 * i - number = The number of times the chance check should run.
 */
function getRandomMonster(x, i) {

    let found = false;

    if (typeof x.monster_chance !== 'undefined') {

        for (c in x.monster_chance) {


            var counter = 0;
            while (counter < i) {
                let num = x.monster_chance[c];

                let rand = Math.floor(Math.random() * 101);

                if (rand <= num) {

                    let obj = eval(monsters[c]);

                    found = true;

                }
                counter++;
            }

            if(found){

                  if(myMonstersData.length == 0){

                    addMonster(monsters[c]);
                    return;             

                  }

                  let repeated = hasMonsterStored(monsters[c]);

                      if(repeated == false){

                        addMonster(monsters[c]);

                        break;

                      }else{

                         return getRandomMonster(x, i);
                         found = false;
                         break;

                      }
                    
            }
        }
    }
}


function getNewMonster(x, i) {
  if (typeof x.monster_chance !== 'undefined') {
    for (let c in x.monster_chance) {
      let counter = 0;
      while (counter < i) {
        let num = x.monster_chance[c];
        let rand = Math.floor(Math.random() * 101);

        if (rand <= num) {
          let monster = monsters[c];
          if (!hasMonsterStored(monster)) {
            addMonster(monster);
            return;
          }
        }
        counter++;
      }
    }
  }

  // Se nenhum monstro novo for encontrado, continue procurando até encontrar um não obtido
  console.log("Procurando outro monstro...");


  if(myMonstersData.length >= Object.keys(monsters).length){

        showNotification("You've already gotten all monsters available for this box");
        return;
  }

  getNewMonster(x, i);
}


function findMonsterById(monster_id) {

   for(m in monsters){

        if(monsters[m].monster_id == monster_id){
                    
            return monsters[m];

        }
     
    }


    return null;
}




  function createMultipleWaves(){

     for (var i = 0; i < 10; i++) {
        createWave();
      }          

  }

  function createWave() {
    var wave = document.createElement("div");
     ocean = document.getElementById("tab-explore");
    wave.className = "wave";
    wave.style.left = getRandomPosition() + "px";
    wave.style.top = getRandomPosition() + "px";
    ocean.appendChild(wave);

    waitForSeconds(removeElement,wave, 2);
  }


  function getRandomPosition() {
    var min = 0;
    var max = window.innerWidth;
    return Math.random() * (max - min) + min;
  }



// Send a query to the browser process.
function sendMessage() {

window.cefQuery({
    request: 'BindingTest:' + ' checando integração',
    onSuccess: function(response) {
      document.getElementById('result').value = 'Response: '+response;
  },
  onFailure: function(error_code, error_message) {}
});
}



function checkMonstersAchievements(){

    for(mm in myMonstersData){

        activateMonstersAchievements(myMonstersData[mm]);
       
    }


}



function hasMonsterStored(monster) {

   for(mm in myMonstersData){

        if(myMonstersData[mm].slug == monster.slug){
            
            return true;

        }
     
    }


    return false;
}

/* AWFULLY WET
 * Increment Resource in the Chance Object or the Passed Worker
 * x - object = The worker object. (Which contains the `chance` object.)
 */
function increaseChanceResourcesFromWorker(x) {
    for (c in x.chance) {
        let obj = eval(resource[c]);
        i = obj.chanceIncrement;
        var counter = 0;
        while (counter < i) {
            var secondCounter = 0;
            while (secondCounter < x.total) {
                let num = x.chance[c];
                let rand = Math.floor(Math.random() * 101);
                if (rand <= num) {
                    let obj = eval(resource[c]);
                    increaseResourceTotal(obj, i);
                }
                secondCounter++;
            }
            counter++;
        }
    }
}

/*
 * Add Storage to a Resource
 * Initiated from the DOM
 * x - object = The resource object.
 */
function addStorage(x) {

    if (Calc.spendResources(Calc.expensesArray(x.storage.cost))) {
        x.max += x.storage.max;
        x.storage.total++;

        for (iii in x.storage.cost) {
            let obj = eval(x.storage.cost[iii]);
            x.storage.cost[iii] = Math.floor(obj * x.storage.costIncrease);
        }
    }
}

/*
 * Buy a Residential Building
 * Initiated from the DOM
 * x - object = The buildings object.
 */
function buyBuilding(x) {
    if (Calc.spendResources(Calc.expensesArray(x.cost))) {
        x.total++;
        meta.maxPopulation += x.residents;

        for (iii in x.cost) {
            let obj = eval(x.cost[iii]);
            x.cost[iii] = Math.floor(obj * x.costIncrease);
        }
    }
}

function adjustAutomations(){

    for(let worker in workers){

        let res = eval(resource[workers[worker].resource]);

        if(!res)
            res = eval(inventory[workers[worker].resource]);

        if(res){
            res.autoIncrement = workers[worker].total;  
        }

    }

}


function getMaxAutomationTotal(_resource){

    for(let worker in workers){

        let res = eval(resource[workers[worker].resource]);

        if(res)
        if(res.slug == _resource.slug){

            return workers[worker].total;
            
        }

    }

    return 0;

}


function adjustStorages(){

    for(let r in resource){

        let res = eval(resource[r]);

        if(res){
            res.max = res.storage.max * res.storage.total;  
        }

    }

}

/*
 * Add a Worker
 * Initiated from the DOM
 * x - object = The worker object.
 */
function buyWorker(ui_element, x) {
    // Stop the function if there isn't enough population capacity.
    //if (meta.population >= meta.maxPopulation) {
    //    return;
    //}

    if (Calc.spendResources(Calc.expensesArray(x.cost))) {
        x.total++;
      //  meta.population++;

        try{
        addBox(ui_element, x.slug, x.icon_resource == null ? x.icon_path : x.icon_resource);  
        }catch(e){

            console.log('erro buy worker %o', e);

        }


        let res = eval(resource[x.resource]);

        if(!res)
            res = eval(inventory[x.resource]);

        if(res){

            let excludedResources = ['fire_lotus_seed','water_lotus_seed','earth_lotus_seed','plant_lotus_seed',
            'rune_fire','rune_water','rune_earth','rune_plant','super_fire_lotus','super_water_lotus','super_earth_lotus'
            ,'super_plant_lotus','giga_fire_lotus','giga_water_lotus','giga_earth_lotus','giga_plant_lotus'];

            if(x.total == 1 && excludedResources.includes(x.resource) == false){
                x.total++;
            }
        
            res.autoIncrement = x.total;  
        }

        for (iii in x.cost) {
            let obj = eval(x.cost[iii]);
            x.cost[iii] = Math.floor(obj * x.costIncrease);
        }
    }
}



/*
 * Purchase an item from Market
 * Initiated from the DOM
 * x - object = The item object.
 */
function buyItem(x, amount) {

    
    var multiplier = amount;
   
    if (Calc.spendResources(Calc.expensesArray(x.cost, multiplier))) {

        for (i in inventory){

            let item = eval(inventory[i]);
            
            if(item.slug === x.slug){
                
                item.total = item.total + (1 * multiplier);

                showNotification("You just bought the item: x" + multiplier + " "  + item.name);

                   var itemData = { itemSlug: item.slug, amount: multiplier };

                   console.log("buy item %o", itemData);

                   addBoughtItemData(itemData);

            }

        } 
    
    }else{

        showNotification("You can't buy this item");
    }
}


function setEvolutionProfile(player, playerImage){

    playerImage.src = player.icon_path;

    if(player.evolutions > 1 && player.level > 19){

        playerImage.src = player.icon_path.replace(/(\.png)$/, '-' + '2' + '$1');
    }

    if(player.evolutions > 2 && player.level > 29){

        playerImage.src = player.icon_path.replace(/(\.png)$/, '-' + '3' + '$1');
    }

}


function getEvolutionProfileIcon(player, playerImage){

    playerImage.src = player.icon_path;

    if(player.evolutions > 1 && player.level > 19){

        return player.icon_path.replace(/(\.png)$/, '-' + '2' + '$1');
    }

    if(player.evolutions > 2 && player.level > 29){

        return player.icon_path.replace(/(\.png)$/, '-' + '3' + '$1');
    }


    return player.icon_path;

}



function addBoughtItemData(itemData){

    var itemExists = false;
    for (var i = 0; i < boughtItems.length; i++) {
      if (boughtItems[i].itemSlug === itemData.itemSlug) {
        // Item já existe, então somamos o valor de amount
        boughtItems[i].amount += itemData.amount;
        itemExists = true;
        break;
      }
    }

    // Se o item não existir, adiciona-o ao array
    if (!itemExists) {
      boughtItems.push(itemData);
    }
}


function addSoldItemData(itemData){

    var itemExists = false;
    for (var i = 0; i < soldItems.length; i++) {
      if (soldItems[i].itemSlug === itemData.itemSlug) {
        // Item já existe, então somamos o valor de amount
        soldItems[i].amount += itemData.amount;
        itemExists = true;
        break;
      }
    }

    // Se o item não existir, adiciona-o ao array
    if (!itemExists) {
      soldItems.push(itemData);
    }
}


function addMonster(x) {

    for (m in monsters){

        let monster = eval(monsters[m]);

        monster = JSON.parse(JSON.stringify(monster));
        
        if(monster.slug === x.slug){
            
            monster.total++;          

            myMonstersData.push(monster);

            let message = "the character " + monster.name + " has just been acquired!";

            openModal("New Character!", message, 'default');

            updateMuseumData();

            showNotification(message);

            var monstersCount = Object.keys(monsters).length;
 
            if(myMonstersData.length >= monstersCount){
                setTimeout(function(){

                    openModal("Congratulations", 'You have successfully finished the Game! If you enjoyed playing the game consider writting a review recommending it! It will help me a lot!', 'default');

                },3000);

                achievements.IMRAchievement15.enabled = true;
                activateAchievement('IMRAchievement15');
            }


            achievements.IMRAchievement2.enabled = true;

            activateAchievement('IMRAchievement2');

            break;
        }

    } 
    
}


function checkAllMonstersAchievement(){

    var monstersCount = Object.keys(monsters).length;
 
    if(myMonstersData.length >= monstersCount){

        achievements.IMRAchievement15.enabled = true;
        activateAchievement('IMRAchievement15');
    }

}


function selectInitialClasss(class_slug){

    selectClassByName(class_slug, false);

    $('#onLoadModal').modal('hide');

    if(myClassData.length > 0){

      currentMonster = myClassData[0];

      selectCurrentClass(currentMonster.slug);

    }

    try {

        achievements.IMRAchievement1.enabled = true;

        activateAchievement('IMRAchievement1');

    }
    catch(err) {
       console.log("error_" + err);
    }



    InitNames();

}


function selectInitialMonster(monster_slug){

    addMonsterByName(monster_slug, false);

    $('#onLoadModal').modal('hide');

    if(myMonstersData.length > 0){
      currentMonster = myMonstersData[0];
      selectCurrentMonster(currentMonster.slug);
    }

    try {

        achievements.IMRAchievement1.enabled = true;

        activateAchievement('IMRAchievement1');

    }
    catch(err) {
       console.log("error_" + err);
    }



    InitNames();

}


function selectClassByName(class_slug, showNotification = true) {

    for (m in classes){

        let player_char = JSON.parse(JSON.stringify(classes[m]));
        
        if(player_char.slug === class_slug){
            
            player_char.total++;          

            myClassData.push(player_char);

            let message = "the monster " + player_char.name + " has just been acquired!";

            if(showNotification){

                openModal("Congratulations! New Character!", message, 'default');
                
              //  showNotification(message);
            }

            break;
        }

    } 
    
}


function addMonsterByName(monster_slug, showNotification = true) {

    for (m in monsters){

        let monster = JSON.parse(JSON.stringify(monsters[m]));
        
        if(monster.slug === monster_slug){
            
            monster.total++;          

            myMonstersData.push(monster);

            let message = "the class " + monster.name + " has just been selected!";

            if(showNotification){

                openModal("Congratulations! New Character!", message, 'default');
                
                showNotification(message);
            }

            break;
        }

    } 
    
}


function addItem(item_slug, amount = 1) {

    for (i in inventory){

        let item = eval(inventory[i]);
        
        if(item.slug === item_slug){
            
            item.total+=amount;          

            // myMonstersData.push(monster);

            let message = "the item " + item.name + " has just been acquired!";

            showNotification(message);

            break;
        }

    } 
    
}


function addItemNoNotification(item_slug) {

    for (i in inventory){

        let item = eval(inventory[i]);
        
        if(item.slug === item_slug){
            
            item.total++;          

            break;
        }

    } 
    
}





function canCollectMaterial(element){


    if (typeof element.cost !== 'undefined') {

        for (c in element.cost) {

            let obj = eval(resource[c]);
            
            let costNum = eval(element.cost[c]);

            let newValueOfCost = obj.total - costNum;

            if (newValueOfCost >= 0) {
               
               if(canStore(element))             
                    return true;
               else
                    return false;

            } else {

                return false;
            }
        }

    } else{


        return canStore(element);

    }

    
}



function canStore(element){

    return !(element.total >= element.max);
}


function calculatePlayTime(playTime, format = 'm'){

  var minutes = Math.floor(playTime / 60);

  if(format == 'm')
    return minutes;
  else
    return Math.floor(minutes / 60);


}

// Calculate game time in minutes or hours
function calculatePlayTimeByDate(playTime, format = 'm') {
  var startTime = playTime;
  var currentTime = new Date().getTime();
  var elapsedTime = currentTime - startTime;

  var minutes = Math.floor(elapsedTime / (1000 * 60));

  if(format == 'm')
    return minutes;
  else
    return Math.floor(minutes / 60);
}



    function generateIslands() {
      var grid = document.getElementById("islandGrid");

      for (var i = 1; i <= totalIslands; i++) {

        var islandDiv = document.createElement("div");
        islandDiv.id = "island-" + i;
        islandDiv.className = "island";

        var img = document.createElement("img");
        img.src = "img/land-" + i + ".png";
        img.alt = "Island " + i;
        img.className = "island-bg";

        var buyButton = document.createElement("button");
        buyButton.className = "buyButton btn btn-warning";
        buyButton.id = 'buyButton-island-' + i;
        buyButton.style.position = 'relative'; // Certifique-se de que o elemento tenha uma posição definida (por exemplo, relative)
        buyButton.style.zIndex = '999'; // Defina um valor alto para o z-index do buyButton
       
        generateBuyButtonContent(buyButton,i);


        islandDiv.appendChild(img);
       
        islandDiv.appendChild(buyButton);

      
        for (let place in buildings['island_' + i].places) {
          
            createIslandPlace(place, 0, islandDiv, true);  
        }

        grid.appendChild(islandDiv);


      }

      
      // Ativar apenas a primeira ilha
      var firstIsland = document.getElementById("island-" + activeIsland);
      firstIsland.classList.add("active");

      const number = 13;

      islandsEnabled.push(number);

      firstIsland.onclick = function () {

          buyIsland(parseInt(this.id.split("-")[1]));
      
      };


    }


    function generateBuyButtonContent(buyButton,i){

        buyButton.innerHTML = " ";

        if(isDev)
            buyButton.textContent = '#' + i + " requirements:";
        else
            buyButton.textContent = '# Requirements:';

        for (var rsc in buildings['island_' + i].cost) {
          
            var requirement = document.createElement("p");
            var requirement_icon = document.createElement("img");

            requirement.style = "0.7vw";
            requirement_icon.className = "icon-16";

            requirement_icon.src = resource[rsc].icon_resource;

            var hasResource = resource[rsc].total >= buildings['island_' + i].cost[rsc];
            var color = hasResource ? "green" : "red";
            
            requirement.innerHTML = resource[rsc].name + ":" + formatNumber(buildings['island_' + i].cost[rsc]) + "/<span style='color:" + color + "'>" + formatNumber(resource[rsc].total) + "</span>";
            
            requirement.appendChild(requirement_icon);

            buyButton.appendChild(requirement);

        }

      }

    function getMonsterDrops(monster, appendParent){

        appendParent.innerHTML = '';

        if(monster.drops.length <=0 )
            return;

        for (var drop in monster.drops) {
          
            var requirement = document.createElement("p");
            var requirement_icon = document.createElement("img");

            requirement.style = "0.7vw";
            requirement_icon.className = "icon-16";

            console.log('inventory[drop] : %o', drop);

            requirement_icon.src = inventory[drop].icon_path;

            requirement.textContent = inventory[drop].name;
            
            requirement.appendChild(requirement_icon);

            appendParent.appendChild(requirement);

        }

    }


    function createIslandPlace(name,tabID, islandDiv, isModal = false){

            var placeLink = document.createElement("a");
            var marketId;

            if (name.includes("market")) {

             var [market_name, market_id] = name.split('_');

              name = 'market';
              marketId = market_id;

            }

            if(isModal == false)
                placeLink.onclick = function () { openTab('tab' + tabID) };
            else
                placeLink.onclick = function () { 

                    updateMarket(marketId);
                    fillEnemiesListForPlace(name);
                    openModal('', '', name);
                     
                };

            placeLink.href = "#";
            placeLink.onmouseover = function(){

            if(places[name])
                addSimpleCaption(placeLink, places[name].name, places[name].description);


            };

            placeLink.onmouseout= function(){ 

                fadeOutAndDestroyCaption() 

            };

            var place = document.createElement("img");
            place.src = "img/" + name + ".png";
            place.alt = name;
            place.className = "island-place";

            var caption = document.createElement("div");
            caption.id = "place_caption_" + name;
            caption.className = "hidden";
            caption.innerHTML = '';

            placeLink.appendChild(place);
            placeLink.appendChild(caption);
            islandDiv.appendChild(placeLink);
            

            fillEnemiesListForPlace(name);

    }


    function enableIslands() {

    
        for(island in islandsEnabled){


            let activeElement = document.getElementById("island-" + islandsEnabled[island]);


            if(activeElement){

                activeElement.classList.remove("available");
                activeElement.classList.add("active");
                updateIslandAvailability(islandsEnabled[island]);

            }


        }
    }


    function updateIslandAvailability(_activeIsland) {


      var islands = document.getElementsByClassName("island");


      var activeElement = document.getElementById("island-" + _activeIsland);

      blockedIsland = parseInt(_activeIsland);

      if(blockedIsland == 23 || // blockedIsland == 8 || blockedIsland == 14 || blockedIsland == 18 ||
            blockedIsland == 7 || blockedIsland == 9 || blockedIsland == 17 || blockedIsland == 19 || blockedIsland == 15)
            return;

      var adjacentIds = getAdjacentIslandIds(_activeIsland);

      for (var j = 0; j < adjacentIds.length; j++) {
        var adjacentElement = document.getElementById("island-" + adjacentIds[j]);

        if(adjacentIds[j] == 23 || adjacentIds[j] == 11 || adjacentIds[j] == 3)
            continue;

        if (!adjacentElement.classList.contains("active")) {

          adjacentElement.classList.add("available");
        }
        
        adjacentElement.onclick = function () {
          buyIsland(this.id.split("-")[1]);
        };


      }
    }


    function getAdjacentIslandIds(islandId) {

        var adjacentIds = [];

        var row = Math.floor((islandId - 1) / 5);
        var col = (islandId - 1) % 5;

        // Verificar ilha acima
        if (row > 0) {
          var aboveId = (row - 1) * 5 + col + 1;
          adjacentIds.push(aboveId);
        }

        // Verificar ilha abaixo
        if (row < 4) {
          var belowId = (row + 1) * 5 + col + 1;
          adjacentIds.push(belowId);
        }

        // Verificar ilha à esquerda
        if (col > 0) {
          var leftId = row * 5 + col;
          adjacentIds.push(leftId);
        }

        // Verificar ilha à direita
        if (col < 4) {
          var rightId = row * 5 + col + 2;
          adjacentIds.push(rightId);
        }

        return adjacentIds;
    }

    function giveCoin(amount = 10) {
        
        resource.coin.total += amount;
    }

    function isIslandEnabled(islandId){

        for(isld in islandsEnabled){

            if(islandsEnabled[isld] == islandId)
                return true;
        }


        return false;
    }

    function buyIsland(islandId) {

      if (isIslandEnabled(islandId)) {

         // do if click on island

      } else {

        var islandElement = document.getElementById("island-" + islandId);
        var coinCountElement = document.getElementById("coinCount");

        if (checkResouceRequirements(buildings['island_' + islandId])) {

          removeResouceRequirements(buildings['island_' + islandId]);

          islandsEnabled.push(parseInt(islandId));

          var itemData = { itemSlug: "island-" + islandId, amount: 1 };

          addBoughtItemData(itemData);

          islandElement.classList.add("active");
          islandElement.classList.remove("available");
          activeIsland = islandId;
          updateIslandAvailability(activeIsland);

          achievements.IMRAchievement6.enabled = true;

          activateAchievement('IMRAchievement6');


        } else {

          showNotification("Requirements not met to buy this island: collect the remaining resources",5000);

        }
      }
    }



