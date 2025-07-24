/*
 * Save the Game to Local Storage
 */
function saveGame() {

    localStorage['rpg_save[meta]'] = btoa(JSON.stringify(meta));
    localStorage['rpg_save[resource]'] = btoa(JSON.stringify(resource));
    localStorage['rpg_save[workers]'] = btoa(JSON.stringify(workers));
    localStorage['rpg_save[buildings]'] = btoa(JSON.stringify(buildings));
    localStorage['rpg_save[upgrades]'] = btoa(JSON.stringify(upgrades));
    localStorage['rpg_save[achievements]'] = btoa(JSON.stringify(achievements));
    localStorage['rpg_save[inventory]'] = btoa(JSON.stringify(inventory));
    localStorage['rpg_save[monsters]'] = btoa(JSON.stringify(monsters));
    localStorage['rpg_save[myMonstersData]'] = btoa(JSON.stringify(myMonstersData));
    localStorage['rpg_save[myClassData]'] = btoa(JSON.stringify(myClassData));
    localStorage['rpg_save[defeatedEnemiesData]'] = btoa(JSON.stringify(defeatedEnemiesData));
    localStorage['rpg_save[player_data]'] = btoa(JSON.stringify(player_data));
    localStorage['rpg_save[terrainSlots]'] = btoa(terrainSlots);
    localStorage['rpg_save[islandsEnabled]'] = btoa(JSON.stringify(islandsEnabled));
    localStorage['rpg_save[timePlayed]'] = btoa(timePlayed);
    localStorage['rpg_save[currentQuestId]'] = btoa(currentQuestId);
    localStorage['rpg_save[questsData]'] = btoa(JSON.stringify(questsData));
    localStorage['rpg_save[soldItems]'] = btoa(JSON.stringify(soldItems));
    localStorage['rpg_save[boughtItems]'] = btoa(JSON.stringify(boughtItems));

    
    forceUpdateSave();

    checkAllMonstersAchievement();

}

/*
 * Load the Game from Local Storage
 */
function loadGame() {
    if (!localStorage['rpg_save[meta]']) {
        message('No Saved Game - Starting Fresh', 'info');

        // questsData = JSON.parse(JSON.stringify(quests));
         questsData = quests.map(quest => ({
              id: quest.id,
              isMainQuest: quest.isMainQuest,
              sequence: quest.sequence,
              isCompleted: quest.isCompleted,
              isActive: quest.isActive,
         }));

         $('#onLoadModal').modal({backdrop: 'static', keyboard: false});

        meta.startPlayingTime = new Date().getTime();

        return;
    } else {
        message('Loading Saved Game', 'info');
    }
 
    verifySaveStructure(meta,localStorage['rpg_save[meta]']);    
    
    const resourceSerialized = atob(localStorage['rpg_save[resource]']);
    const parsedResource = JSON.parse(resourceSerialized);

    if(isNaN(resource.coin.total))
        resource.coin.total = 0

    resource = updateFields(parsedResource, resource, ['autoIncrement','places'],['max','cost','costIncrease']);

    const workersSerialized = atob(localStorage['rpg_save[workers]']);
    const parsedWorkers = JSON.parse(workersSerialized);

    workers = updateFields(parsedWorkers, workers, ['description', 'costIncrease','name'],[]);

    verifySaveStructure(upgrades,localStorage['rpg_save[upgrades]'], true);
    verifySaveStructure(achievements,localStorage['rpg_save[achievements]'], true);

    const inventorySerialized = atob(localStorage['rpg_save[inventory]']);
    const parsedInventory = JSON.parse(inventorySerialized);
     
    inventory = updateFields(parsedInventory, inventory, ['autoIncrement','description','max','cost'],[]);

    // these databases are read-only
    // verifySaveStructure(resource,localStorage['rpg_save[resource]'], true);
    // verifySaveStructure(inventory,localStorage['rpg_save[inventory]'], true);
    // verifySaveStructure(questsData,localStorage['rpg_save[questsData]'], true);
    // verifySaveStructure(buildings,localStorage['rpg_save[buildings]'], true);
    // verifySaveStructure(monsters,localStorage['rpg_save[monsters]'], true);
  
    terrainSlots = atob(localStorage['rpg_save[terrainSlots]']);
    timePlayed = atob(localStorage['rpg_save[timePlayed]']);
    currentQuestId = atob(localStorage['rpg_save[currentQuestId]']);

    questsData = JSON.parse(atob(localStorage['rpg_save[questsData]']));
    myMonstersData = JSON.parse(atob(localStorage['rpg_save[myMonstersData]']));
    myClassData = JSON.parse(atob(localStorage['rpg_save[myClassData]']));
    defeatedEnemiesData = JSON.parse(atob(localStorage['rpg_save[defeatedEnemiesData]']));
    islandsEnabled = JSON.parse(atob(localStorage['rpg_save[islandsEnabled]']));
    soldItems = JSON.parse(atob(localStorage['rpg_save[soldItems]']));
    boughtItems = JSON.parse(atob(localStorage['rpg_save[boughtItems]']));

    verifySaveStructure(player_data,localStorage['rpg_save[player_data]'], false);

    /*
    if(myMonstersData.length > 0){
      currentMonster = myMonstersData[0];
      selectCurrentMonster(currentMonster.slug);
    }*/

    if(myClassData.length > 0){
      
        currentClass = myClassData[0];
        selectCurrentClass(currentClass.slug);

    }

     LoadNames();
     setCurrentQuest(getCurrentQuestId());
     adjustAutomations();
     adjustStorages();
     checkMonstersAchievements();
}


// parsedData: data coming from save file
// newData: data coming from static file
function updateFields(parsedData, newData, fieldToUpdate, subFieldsToUpdate) {

    // Delete the fieldToUpdate to keep it updated
    for (const key in parsedData) {

        for(const field in fieldToUpdate){       
            const item = parsedData[key];
            delete item[fieldToUpdate[field]];
        }

        
        for(const subField in subFieldsToUpdate){

            for(const _subField in parsedData[key]){

                const subItemToUpdate = parsedData[key][_subField][subFieldsToUpdate[subField]];
                
                if(subItemToUpdate){

                    delete parsedData[key][_subField][subFieldsToUpdate[subField]];
                }

            }   
        }
    }

    for (const key in newData) {

        // If field does not exists create it
        if (parsedData[key]) {
            // add the new fieldToUpdate

            for(const field in fieldToUpdate){
                if (!parsedData[key][fieldToUpdate[field]]) {
                    parsedData[key][fieldToUpdate[field]] = newData[key][fieldToUpdate[field]];
                
                }
            }

            for(const subField in subFieldsToUpdate){

                for(const _subField in newData[key]){
    
                    const subItemToUpdate = newData[key][_subField][subFieldsToUpdate[subField]];
                    
                    if(subItemToUpdate){
                    
                      if(!parsedData[key][_subField][subFieldsToUpdate[subField]])
                        parsedData[key][_subField][subFieldsToUpdate[subField]] = newData[key][_subField][subFieldsToUpdate[subField]];
                    }
    
                }   
            }

            if (resource && resource[newData[key].resource]) {
                resource[newData[key].resource].autoIncrement = parsedData[key].total;
            }


        } else {
            parsedData[key] = newData[key];
        }
    }

    return parsedData;
}

/*
 * Process savefiles to avoid braking it after an update
 * basically it stores the save to an temp_var, iterate in every property 
 * from the save structure and check if the current save structure has it
 * if so, it migrates the property to the new structure and removes the old save
 * structure

 */
function verifySaveStructure(saveEntry,localStorageData,checkSubEntries = false){

    data_old = JSON.parse(atob(localStorageData));

    // Migrate date from old structure to a new structure without break the save file
      for (const prop in data_old) {
        if (saveEntry.hasOwnProperty(prop)) {

            if(checkSubEntries){
                verifySavePropStructure(saveEntry[prop], data_old[prop]);
            }
            else
                saveEntry[prop] = data_old[prop];
        }
      }

    // Remove the old save structure
    data_old = undefined;
          
    //  Store data to a new local store structure 
    localStorageData = btoa(JSON.stringify(saveEntry));
      
}


function verifySavePropStructure(currentPropEntry,oldPropEntry){

    data_old_prop = oldPropEntry;

    // Migrate date from old structure to a new structure without break the save file
      for (const prop in data_old_prop) {
        if (currentPropEntry.hasOwnProperty(prop)) {

           currentPropEntry[prop] = data_old_prop[prop];
        }
      }

    // Remove the old save structure
    data_old_prop = undefined;
          
    //  Store data to a new local store structure 
    oldPropEntry = currentPropEntry;
      
}



// Import from a base64 file
function importSaveFile(fileInput) {
  var file = fileInput.files[0];
  var reader = new FileReader();
  reader.onload = function(e) {
    var saveFileContent = e.target.result;
    var saveData = JSON.parse(saveFileContent);
    
    // Decodificar os dados do save game
    meta = JSON.parse(atob(saveData.meta));
    resource = JSON.parse(atob(saveData.resource));
    workers = JSON.parse(atob(saveData.workers));
    buildings = JSON.parse(atob(saveData.buildings));
    upgrades = JSON.parse(atob(saveData.upgrades));
    achievements = JSON.parse(atob(saveData.achievements));
    inventory = JSON.parse(atob(saveData.inventory));
    monsters = JSON.parse(atob(saveData.monsters));
    myMonstersData = JSON.parse(atob(saveData.myMonstersData));
    defeatedEnemiesData = JSON.parse(atob(saveData.defeatedEnemiesData));
    player_data = JSON.parse(atob(saveData.player_data));
    terrainSlots = JSON.parse(atob(saveData.terrainSlots));
    islandsEnabled = JSON.parse(atob(saveData.islandsEnabled));
    timePlayed = JSON.parse(atob(saveData.timePlayed));
    currentQuestId = JSON.parse(atob(saveData.currentQuestId));
    questsData = JSON.parse(atob(saveData.questsData));
    soldItems = JSON.parse(atob(saveData.soldItems));
    boughtItems = JSON.parse(atob(saveData.boughtItems));
    questsData = JSON.parse(atob(saveData.questsData));
    
    // Outras ações necessárias após importar o save game
    // ...
    
    openModal('Loading...','Reloading game in 5 seconds','default');
    setTimeout( function(){

        saveGame();
        window.location.reload();

    },5000);
    

  };
  
  reader.readAsText(file);
}



// export to a base64 file
function exportSaveFile() {
  var saveData = {
    meta: btoa(JSON.stringify(meta)),
    resource: btoa(JSON.stringify(resource)),
    workers: btoa(JSON.stringify(workers)),
    buildings: btoa(JSON.stringify(buildings)),
    upgrades: btoa(JSON.stringify(upgrades)),
    achievements: btoa(JSON.stringify(achievements)),
    inventory: btoa(JSON.stringify(inventory)),
    monsters: btoa(JSON.stringify(monsters)),
    myMonstersData: btoa(JSON.stringify(myMonstersData)),
    defeatedEnemiesData: btoa(JSON.stringify(defeatedEnemiesData)),
    player_data: btoa(JSON.stringify(player_data)),
    terrainSlots: btoa(JSON.stringify(terrainSlots)),
    islandsEnabled: btoa(JSON.stringify(islandsEnabled)),
    timePlayed: btoa(JSON.stringify(timePlayed)),
    currentQuestId: btoa(JSON.stringify(currentQuestId)),
    questsData: btoa(JSON.stringify(questsData)),
    soldItems: btoa(JSON.stringify(soldItems)),
    boughtItems: btoa(JSON.stringify(boughtItems)),
    questsData: btoa(JSON.stringify(questsData))
  };

  var saveFileContent = JSON.stringify(saveData);
  var saveFileName = "monsters_idle_rpg_savefile_" + meta.versionNumber + "_" + Date.now() + ".sav";
  
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(saveFileContent));
  element.setAttribute('download', saveFileName);
  
  element.style.display = 'none';
  document.body.appendChild(element);
  
  element.click();
  
  document.body.removeChild(element);
}


function clearLocalStorage() {
    localStorage.clear();
    window.location.reload();
}

function maxEverything() {
    for (r in resource) {
        let obj = eval(resource[r]);
        obj.total = obj.max;
    }
}

function upStorage() {
    for (r in resource) {
        let obj = eval(resource[r]);
        obj.max *= 2;
    }
}

function dev() {
    upStorage();
    maxEverything();
}

function clear() {
    clearLocalStorage();
}



// Export to a clear Json file
function exportSaveJson() {
    var saveData = {
        meta: meta,
        resource: resource,
        workers: workers,
        buildings: buildings,
        upgrades: upgrades
    };

    var saveString = JSON.stringify(saveData);
    var saveBase64 = btoa(saveString);

    var downloadLink = document.createElement('a');
    downloadLink.href = 'data:application/octet-stream;base64,' + saveBase64;
    downloadLink.download = 'save.txt';
    downloadLink.click();
}

// Import from a clear Json save file
function importSaveJson(event) {
    var file = event.target.files[0];
    var reader = new FileReader();

    reader.onload = function (e) {
        var saveBase64 = e.target.result.split(',')[1];
        var saveString = atob(saveBase64);
        var saveData = JSON.parse(saveString);

        meta = saveData.meta;
        resource = saveData.resource;
        workers = saveData.workers;
        buildings = saveData.buildings;
        upgrades = saveData.upgrades;

        // Atualizar o save na memória local
        localStorage['rpg_save[meta]'] = btoa(JSON.stringify(meta));
        localStorage['rpg_save[resource]'] = btoa(JSON.stringify(resource));
        localStorage['rpg_save[workers]'] = btoa(JSON.stringify(workers));
        localStorage['rpg_save[buildings]'] = btoa(JSON.stringify(buildings));
        localStorage['rpg_save[upgrades]'] = btoa(JSON.stringify(upgrades));

        forceUpdateSave();
    };

    reader.readAsDataURL(file);
}


