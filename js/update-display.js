/*
 * Update all the Values in the DOM
 * Runs every meta.fps milliseconds.
 */
function updateDisplay() {


    let coinHUD = document.getElementById('coin-hud');

    if(coinHUD != null){

        for (r in resource) {

            let obj = eval(resource[r]);

            if(obj.slug == 'brick' || obj.slug == 'silver')
                continue;
            
            if(obj.slug == 'coin'){

              coinHUD.innerHTML = formatNumber(obj.total) + " Coins";
            }


        }
        
    }


    // Resources
    for (r in resource) {
        let obj = eval(resource[r]);

        if(obj.slug == 'brick' || obj.slug == 'silver')
            continue;

        let elements = document.getElementsByClassName(`${r}-total`);


        Array.prototype.forEach.call(elements, function(el) {
            
                 el.innerHTML = formatNumber(obj.total).toLocaleString();

        });

  
        let elmBtn = document.getElementById(`${obj.slug}-btn`);
        
        if(elmBtn){


               if(canCollectMaterial(obj)){

                    elmBtn.classList.add("btn-primary");                         
                
               }else{
                   
                     elmBtn.classList.add("btn-primary");
                
               }

        }
    

        
        document.getElementById(`${r}-max`).innerHTML = formatNumber(obj.max);
        document.getElementById(`${r}-storage-total`).innerHTML = obj.storage.total;
        document.getElementById(`${r}-auto-increment`).innerHTML = obj.autoIncrement;

        if (r.clickIncrement) {
            document.getElementById(`${r}-click-increment`).innerHTML = obj.clickIncrement;
        }

        if (typeof obj.cost !== 'undefined') {
            for (c in obj.cost) {
                document.getElementById(`${r}-${c}-cost`).innerHTML = obj.cost[c];
            }
        }

        for (c in obj.storage.cost) {
            let elem = document.getElementById(`${r}-${c}-storage-cost`);

            elem.innerHTML = Math.round(obj.storage.cost[c]);

            colorText(obj.storage.cost[c], eval(resource[c].total), elem);
        }
    }

    // Buildings
    for (b in buildings) {
        let obj = eval(buildings[b]);

        document.getElementById(`${b}-total`).innerHTML = obj.total;
        document.getElementById(`${b}-residents`).innerHTML = obj.residents;

        for (c in obj.cost) {
            let elem = document.getElementById(`${b}-${c}-cost`);
            elem.innerHTML = obj.cost[c];
            colorText(obj.cost[c], eval(resource[c].total), elem);
        }
    }


    // Inventory
    for (i in inventory) {

        let obj = eval(inventory[i]);
        let elmBtn = document.getElementById(`${obj.slug}-inventory`);
        let elmBtnRow = document.getElementById(`${obj.slug}-inventory-row`);

         if(obj.total <= 0){
            
            if(elmBtnRow){

                elmBtnRow.remove();
                resetButtonListener(obj.slug);
                AddInventoryEmptySlot();
                console.log('elmBtnRow nao localizado');
            }

            continue;
        

        }
      
        
        if(elmBtn){

            let elmAmount = document.getElementById(`${obj.slug}-item-amount`);
            elmAmount.innerHTML = formatNumber(obj.total);

            
        }else{

            var inventoryElement = document.getElementById("inventory");


            removeEmptySlots();
            AddInventorySlot(obj);
          //  removeOneEmptySlot();
            completeSlots(usedInventorySlots());
             
        }
    
    }


 
    if(myMonstersData.length > 0){


        for(m in myMonstersData){

            setCustomMethods(myMonstersData[m]);

            if(myMonstersData[m].slug === player_data.current_monster_slug){

                currentMonsterObj = myMonstersData[m];

                let monsterProfileImage = document.getElementById("current-monster-profile-image");
                let monsterProfileName = document.getElementById("current-monster-profile-name");
                let monsterProfileImageInventory = document.getElementById("current-monster-inventory-image");
                let monsterProfileNameInventory = document.getElementById("current-monster-inventory-name");
                let monsterProfileAttackInventory = document.getElementById("current-monster-inventory-attack");

                monsterProfileImage.src = myMonstersData[m].icon_path;
                monsterProfileName.innerHTML = myMonstersData[m].name;

                monsterProfileImageInventory.src = myMonstersData[m].icon_path;
                monsterProfileNameInventory.innerHTML = monsterProfileName.innerHTML;
                monsterProfileAttackInventory.innerHTML = myMonstersData[m].calculateTotalAttack();

                if(currentMonsterObj.evolutions > 1 && currentMonsterObj.level > 19){

                    monsterProfileImage.src = myMonstersData[m].icon_path.replace(/(\.png)$/, '-' + '2' + '$1');
                    monsterProfileName.innerHTML = 'Super ' + myMonstersData[m].name;

                    monsterProfileImageInventory.src = myMonstersData[m].icon_path.replace(/(\.png)$/, '-' + '2' + '$1');
                    monsterProfileNameInventory.innerHTML = 'Super ' + monsterProfileName.innerHTML;
                }

                if(currentMonsterObj.evolutions > 2 && currentMonsterObj.level > 29){

                    monsterProfileImage.src = myMonstersData[m].icon_path.replace(/(\.png)$/, '-' + '3' + '$1');
                    monsterProfileName.innerHTML = 'Mega ' + myMonstersData[m].name;

                    monsterProfileImageInventory.src = myMonstersData[m].icon_path.replace(/(\.png)$/, '-' + '3' + '$1');
                    monsterProfileNameInventory.innerHTML = ' ' + monsterProfileName.innerHTML;
                }

            }

        }


    }


    // Monsters
    if(myMonstersData.length  > 0){

        for (var m in myMonstersData) {
          if (myMonstersData.hasOwnProperty(m)) {

                let obj = myMonstersData[m];
                setCustomMethods(obj);


                let elmBtn = document.getElementById(`${obj.slug}-monster`);
                let elmAllBtn = document.getElementById(`${obj.slug}-all-monster`);
                let lifeBar = document.getElementById(`${obj.slug}-lifeBar`);
                let lifeBarInventory = document.getElementById(`current-monster-inventory-lifeBar`);
                let xpBar = document.getElementById(`${obj.slug}-xpBar`);
                let xpBarInventory = document.getElementById(`current-monster-inventory-xpBar`);       
                let elmLevel = document.getElementById(`${obj.slug}-level`);
                let elmLevelInventory = document.getElementById(`current-monster-inventory-level`);
                let elmStats = document.getElementById(`${obj.slug}-stats`);
                let elmStatsInventory = document.getElementById(`${obj.slug}-stats`);
                let elmStatsLife = document.getElementById(`current-monster-inventory-stats-life`);
                let elmStatsLifeInventory = document.getElementById(`current-monster-inventory-stats-life`);

                if(elmLevel){

                    elmLevel.innerHTML = " lvl. " + obj.level;
                    elmLevelInventory.innerHTML = currentMonsterObj.level;
                }

                if(elmStats && elmStatsInventory){

                    elmStatsInventory.innerHTML = elmStats.innerHTML;
                }

                if(xpBar){
                    progressXpBar(xpBar, obj);
                    progressXpBar(xpBarInventory, currentMonsterObj);
                }

                if(lifeBar){
                    progressLifeBar(lifeBar,obj);
                    progressLifeBar(lifeBarInventory,currentMonsterObj);
                }

                if(obj.total <= 0){

                    continue;
                }


                if(elmBtn){

                    // Increment item total
                   elmStatsLife.innerHTML = obj.current_life + "/" + obj.getLifeTotal();
                   elmStatsLifeInventory.innerHTML = elmStatsLife.innerHTML;

                }else{

                    AddMonsterSlot(obj);            
                }

          }
        }


    }



      // Achievements
    for (a in achievements) {

        let obj = eval(achievements[a]);

        let elmBtn = document.getElementById(`${obj.slug}-achievement`);
 
        if(elmBtn){

            
            if(obj.enabled == false){

               elmBtn.classList = '';
               elmBtn.classList.add("btn");
               elmBtn.classList.add("disabled");
               elmBtn.classList.add("btn-block");

            }else{

              elmBtn.classList = '';
              elmBtn.classList.add("btn");
              elmBtn.classList.add("btn-success");
              elmBtn.classList.add("btn-block");

            }

        }
    

    }

    // Workers
    for (w in workers) {
        let obj = eval(workers[w]);

        if(obj.slug == 'brickmaker')
            continue;

        document.getElementById(`${w}-total`).innerHTML = obj.total;

        let elmBtn = document.getElementById(`${obj.slug}-btn`);

        for (c in workers[w].cost) {

            if(resource[c])
                canAffordUpgrade(obj.cost[c], eval(resource[c].total), elmBtn);
            else
                canAffordUpgrade(obj.cost[c], eval(inventory[c].total), elmBtn);

            let elem = document.getElementById(`${w}-${c}-cost`);
            elem.innerHTML = obj.cost[c];

            if(resource[c])
                colorText(obj.cost[c], eval(resource[c].total), elem);
            else
                colorText(obj.cost[c], eval(inventory[c].total), elem);

        }
    }

    /* // Upgrades
    for (u in upgrades) {
        let obj = eval(upgrades[u]);
        document.getElementById(`${u}-name`).innerHTML = obj.name;
        document.getElementById(`${u}-description`).innerHTML = obj.description;

        for (c in obj.cost) {
            let elem = document.getElementById(`${u}-${c}-cost`);
            elem.innerHTML = obj.cost[c];
            colorText(obj.cost[c], eval(resource[c].total), elem);
        }
    } */

    document.getElementById('population-max').innerHTML = meta.maxPopulation;
    document.getElementById('population-total').innerHTML = meta.population;

    document.getElementById("water_lotus_seed_total").innerHTML = formatNumber(inventory['water_lotus_seed'].total);
    document.getElementById("fire_lotus_seed_total").innerHTML = formatNumber(inventory['fire_lotus_seed'].total);
    document.getElementById("earth_lotus_seed_total").innerHTML = formatNumber(inventory['earth_lotus_seed'].total);
    document.getElementById("plant_lotus_seed_total").innerHTML = formatNumber(inventory['plant_lotus_seed'].total);

}



function usedInventorySlots(){

    let slotCounter = 0

    for (i in inventory) {

        if(inventory[i].total > 0)
            slotCounter++;

    }

    console.log('usedInventorySlots = ' + slotCounter);

    return slotCounter;


}





function updateResourcesProgressBar(element){

    newValue = element.total;

    let elmProgressBar = document.getElementById(`${element.slug}-progressBar`);

    let elmAmountProgressBar = document.getElementById(`${element.slug}-amount-progressBar`);

    amountProgressBar(elmAmountProgressBar, newValue, element.max);


}



function canAffordUpgrade(cost, resource, element) {

        if(element){

            if (cost > resource) {

                     element.classList.add("btn-success");
                     //element.classList.add("disabled");
                     //element.classList.remove("btn-success")
               
           }else{
    
                    element.classList.add("btn-success");
                    element.classList.remove("disabled");
                    element.classList.remove("btn-default");

            }
    }
     
}