var imageContainer;
var images;
var resultMessage;
var resultImage;
var resultIndex;
var activeImage;

var forestParent;
var caveParent;
var farmParent;
var cityParent;
var resourceParent;
var resourceInventoryParent;
var hasMonsterSearchStarted = false



function UI_Lazy_Init(){

    setTimeout(InitEnemiesImageContainer, 1000);

    if(isDev){

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'js/vendor/console-log-viewer.js';    

        document.head.appendChild(script);

    }

};


function InitEnemiesImageContainer(_place = "forest"){

    let oldImageContainer = imageContainer;
    imageContainer = document.getElementById(_place + "-monsters");

    if(imageContainer === null){
        imageContainer = oldImageContainer;
        return;
    }

    images = Array.from(imageContainer.getElementsByTagName("img"));
    resultMessage = document.getElementById("result-message"); 


    openCity(event, 'Adventurer');


    
  
}


function openCity(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    if(document.getElementById(cityName)){
        document.getElementById(cityName).style.display = "block";
        evt.currentTarget.className += " active";
    }
  }


function resetItemDetail() {
 
    var item_icon_dom = document.getElementById("selected-item-icon");
    var item_name_dom = document.getElementById("selected-item-name");
    var item_desc_dom = document.getElementById("selected-item-stats");

    item_icon_dom.src = 'img/UI/blank.png';
    item_name_dom.innerHTML = "Click on an item to select it";
    item_desc_dom.innerHTML = "Stats";


}

function selectItem(item_slug){

      var old_element = document.getElementById("use-item-btn");
      var old_sell_element = document.getElementById("sell-item-btn");
      var item_icon_dom = document.getElementById("selected-item-icon");
      var item_name_dom = document.getElementById("selected-item-name");
      var item_desc_dom = document.getElementById("selected-item-stats");
      var sell_x_amount = document.getElementById("sell-x-amount");

      item_icon_dom.src = item_slug.icon_path;
      item_name_dom.innerHTML = item_slug.name;
      item_desc_dom.innerHTML = item_slug.description;

      var new_element = old_element.cloneNode(true);
      old_element.parentNode.replaceChild(new_element, old_element);

      var new_sell_element = old_sell_element.cloneNode(true);
      old_sell_element.parentNode.replaceChild(new_sell_element, old_sell_element);

      new_element.addEventListener('mousedown', handleClick);
      new_sell_element.addEventListener('mousedown', handleSellClick);   

      function handleClick() {

          useItem(item_slug);
        
      }  



      function handleSellClick() {


          sellItem(item_slug, sell_x_amount.value);
        
      }  

}



function selectMarketItem(item_slug){

      var old_buy_element = document.getElementById("buy-item-btn");
      var old_market_sell_element = document.getElementById("market-sell-item-btn");
      var item_icon_dom = document.getElementById("market-selected-item-icon");
      var item_name_dom = document.getElementById("market-selected-item-name");
      var item_desc_dom = document.getElementById("market-selected-item-stats");
      var buy_x_amount = document.getElementById("buy-x-amount");

      item_icon_dom.src = item_slug.icon_path;

      if(item_slug.slug === 'wood')
        item_icon_dom.src = item_slug.icon_resource;


      item_name_dom.innerHTML = item_slug.name;
      item_desc_dom.innerHTML = item_slug.description;


      var new_buy_element = old_buy_element.cloneNode(true);
      old_buy_element.parentNode.replaceChild(new_buy_element, old_buy_element);

      var new_market_sell_element = old_market_sell_element.cloneNode(true);
      old_market_sell_element.parentNode.replaceChild(new_market_sell_element, old_market_sell_element);

      new_buy_element.addEventListener('mousedown', handleBuyClick);
      new_market_sell_element.addEventListener('mousedown', handleSellClick); 

      function handleClick() {

          useItem(item_slug);
        
      }  



      function handleSellClick() {

          discardResource(item_slug, parseInt(buy_x_amount.value));
        
      } 


      function handleBuyClick() {


          buyItem(item_slug, buy_x_amount.value);
        
      } 


}




function fillEnemiesListForPlace(place) {

  var placeElement = document.getElementById(place + "-monsters");
  var defeatedMonstersPlaceElement = document.getElementById(place + "-defeated-monsters");
  var missingMonstersPlaceElement = document.getElementById(place + "-missing-monsters");

  if(placeElement == null || defeatedMonstersPlaceElement == null || missingMonstersPlaceElement == null)
    return;

  placeElement.innerHTML = " ";
  defeatedMonstersPlaceElement.innerHTML = " ";
  missingMonstersPlaceElement.innerHTML = " ";

  var isFirst = true;

  for (var monsterKey in monsters) {
    var monster = monsters[monsterKey];
    var chanceField = place + "_chance";

    if (monster["places_chance"][chanceField] !== undefined) {
      var imageElement = document.createElement('img');
      var buttonElement = document.createElement('button');
      var monsterElement = document.createElement('div');
    
      imageElement.classList.add('icon-80');
      buttonElement.classList.add('btn');
      buttonElement.classList.add('btn-danger');
      buttonElement.innerHTML = 'Fight';

      if (isFirst) {
        imageElement.classList.add('active');
        isFirst = false;
      }
      
      imageElement.src = monster.icon_path;
      imageElement.alt = monster.name;
      imageElement.dataset.probability = monster["places_chance"][chanceField];
      imageElement.dataset.monsterId = monster['monster_id'];
      var imageElementClone = imageElement.cloneNode();
      var imageElementClone2 = imageElement.cloneNode();

      if (placeElement !== null)
        placeElement.appendChild(imageElement);
  
      if(defeatedMonstersPlaceElement != null && missingMonstersPlaceElement != null){

        monsterElement.appendChild(imageElementClone);
        
        // using closures
        if(isDefeatedMonster(monster['slug']))
        (function(monster_id){
            
            buttonElement.addEventListener("click", function() {

                openCombat(monster_id);
   
            })
        })(monster['monster_id'])

        monsterElement.appendChild(buttonElement);

        if(isDefeatedMonster(monster['slug']))
            defeatedMonstersPlaceElement.appendChild(monsterElement);

        
        if(collectedMonsters(monster['slug']) == false)
        {
            imageElementClone2.classList.add("silhouette");
            missingMonstersPlaceElement.appendChild(imageElementClone2);
        }
     }
    }
  }
}

function hasItemInInventory(item_slug){

    for (r in inventory) {
        let obj = eval(inventory[r]);

        if(obj.slug === item_slug){

            if(obj.total > 0)
             return true;

        }
    }

    return false;
}


function isAInventoryItem(item_slug){

 
    let obj = eval(inventory[item_slug]);

    if(obj)
        return true;
    else
        return false;

}


function getItemAmount(item_slug){

    var total = 0;

    for (r in inventory) {
        let obj = eval(inventory[r]);

        if(obj.slug === item_slug){

            total = obj.total;

        }
    }

    for (r in resource) {
        let obj = eval(resource[r]);

        if(obj.slug === item_slug){

            total =+ obj.total;

        }
    }

    return total;
}

function discardItem(item_slug, amount = 1){

    var total = 0;

    for (r in inventory) {
        let obj = eval(inventory[r]);

        if(obj.slug === item_slug){

            if(amount > obj.total)
                obj.total = 0;
            else
                obj.total -= amount;

        }
    }

    for (r in resource) {
        let obj = eval(resource[r]);

        if(obj.slug === item_slug){

            if(amount > obj.total)
                obj.total = 0;
            else
                obj.total -= amount;

        }
    }

}


function startRandomMonsterAnimation() {

      if(hasMonsterSearchStarted)
         return;

      intervalId = setInterval(function() {

          hasMonsterSearchStarted = true;

          activeImage = imageContainer.querySelector(".active");
          var nextIndex = (images.indexOf(activeImage) + 1) % images.length;

          activeImage.classList.remove("active");
          images[nextIndex].classList.add("active");

          if (intervalId && nextIndex === 0) {
            clearInterval(intervalId);
            activeImage = imageContainer.querySelector(".active");
            resultImage = getRandomImage();

            let selectedMonsterID; 

            if(resultImage)
                selectedMonsterID = parseFloat(resultImage.getAttribute("data-monster-id"));

            showResult(selectedMonsterID);
          }

    }, 300);
}



  function getRandomImage() {
    var totalProbability = images.reduce((total, image) => total + parseFloat(image.getAttribute("data-probability")), 0);
    var randomNumber = Math.random() * totalProbability;
    var cumulativeProbability = 0;

    for (var i = 0; i < images.length; i++) {
      var image = images[i];

      var probability = parseFloat(image.getAttribute("data-probability"));

      cumulativeProbability += probability;

      if (randomNumber <= cumulativeProbability) {

        resultIndex = i;
        return image;
      }
    }

    return null;
  }


function showResult(_monsterID) {

    setTimeout(function() {

        openCombat(_monsterID);
        hasMonsterSearchStarted = false;

        }, 1000)

    if(activeImage == null)
        return;

    resultMessage.textContent = "You found a monster!"; //+ (resultIndex + 1);
    activeImage.classList.remove("active");
    images[resultIndex].classList.add("choosen");

}

function resetEnemyRoulette() {

    if(activeImage == null)
        return;

    activeImage.classList.add("active");
    images[resultIndex].classList.remove("choosen");
}

function saveGameUI(){

    saveGame();
    showNotification("The game was successfully saved");
}

function useItem(_item){


    if(_item.slug === "common_box" ){        

      showNotification('this item is used when you defeat a common monster');

    }


    if(_item.slug === "rare_box" ){        

       showNotification('this item is used when you defeat a rare monster');

    }



    if(_item.slug === "epic_box" ){        

      showNotification('this item is used when you defeat a epic monster');

    }



    if(_item.slug === "legendary_box" ){        

       showNotification('this item is used when you defeat a legendary monster');

    }


    if(_item.slug === "giga_fire_lotus" || 
    _item.slug === "giga_water_lotus" || 
    _item.slug === "giga_plant_lotus" || 
    _item.slug === "giga_earth_lotus" ){  

        
        if('giga_' + currentMonster.monster_type + '_lotus' === _item.slug){

            recoveryLifePoints(_item, 300);

        }else{

            showNotification('You can not use this item on this monster');
        }
    }

    if(_item.slug === "super_fire_lotus" || 
    _item.slug === "super_water_lotus" || 
    _item.slug === "super_plant_lotus" || 
    _item.slug === "super_earth_lotus" ){  


        if('super_' + currentMonster.monster_type + '_lotus' === _item.slug){

            recoveryLifePoints(_item, 100);

        }else{

            showNotification('You can not use this item on this monster');
        }
    }



    if(_item.slug === "fire_lotus" || 
        _item.slug === "water_lotus" || 
        _item.slug === "plant_lotus" || 
        _item.slug === "earth_lotus" ){  


         if(currentMonster.monster_type + '_lotus' === _item.slug){

             recoveryLifePoints(_item, 20);

         }else{

            showNotification('You can not use this item on this monster');
         }
    }

    if(_item.slug === "simple_potion" ){        

       recoveryLifePoints(_item, 10);
    }


    if(_item.total <= 0){

        resetItemDetail();
    }

}



/*
 * Update the DOM Values when it Loads
 */
function initDisplay() {

    /*
    for (u in upgrades) {
        if (eval(upgrades[u]).visible === false) {
            let obj = eval(upgrades[u]);
            let id = 'upgrade-' + obj.name.replace(' ', '-').toLowerCase();
            document.getElementById(id).classList.add('hidden');
        }
    }*/

    // Add resources and storage buttons to DOM
    for (r in resource) {
        let obj = eval(resource[r]);

        if(obj.slug == 'brick' || obj.slug == 'silver')
            continue;

        if (obj.clickIncrement) {
            var clickHTML = `
              
                
                <button id="${obj.slug}-btn" style="height:35px" class="btn btn-block" onmouseover="activateContentCaption('${obj.slug}-cost-caption')" onmouseout="deactivateContentCaption('${obj.slug}-cost-caption')" onmousedown="clickIncrement(this,resource.${obj.slug})">

                <image class="icon" src="${obj.icon_path}" /> ${obj.action} <span id="${obj.slug}-click-increment"></span> ${obj.name} </button>

                <div class="progress">
                  <div id="${obj.slug}-progressBar" class="progress-bar rounded progress-bar-green" role="progressbar" style="width: 0%;"
                    aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                </div>


                `;
        } else {
            var clickHTML = `
               
                <button style="height:35px" class="btn btn-default btn-block disabled"><image class="icon" src="${obj.icon_path}" /> ${obj.name}</button>

                 <div class="progress">
                  <div id="${obj.slug}-progressBar" class="progress-bar rounded bg-danger" role="progressbar" style="width: 0%;"
                    aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                </div>

                `;
        }


        var clickHTMLShort = `
       
        <button style="" class="btn btn-default btn-block disabled"><image class="icon" src="${obj.icon_resource}" />
          <span class="${obj.slug}-total number-circle" id="${obj.slug}-total">1</span><br/><span>${obj.name}</span></button>
        `;

        if (resource[r].cost !== 'undefined') {
            var resourceCostStr = '';
            for (c in resource[r].cost) {
                resourceCostStr += `<div class="resource-cost-caption"><span>-</span><span id="${obj.slug}-${c}-cost"></span> ${c}</div>`;
            }
        }

        let resourceStr = `
        <div class="row">
            <div class="col-xs-4">
                ${clickHTML}
            </div>
            <div class="col-xs-3">
                
                <button class="btn btn-default btn-block disabled">
                    <span class="${obj.slug}-total" id="${obj.slug}-total"></span> /
                    <span id="${obj.slug}-max"></span>
                </button>
                
                <div class="progress">
                  <div id="${obj.slug}-amount-progressBar" class="progress-bar progress-bar-red rounded bg-danger" role="progressbar" style="width: 0%;"
                    aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                </div>

            </div>
            <div class="col-xs-2">
                
                <span class="btn btn-default btn-block disabled">
                    <span id="${obj.slug}-auto-increment"></span>
                    <span>/ ${meta.tick / 1000}s</span>
                </span>
                <div class="filler-12"></div>
            </div>
            <div class="col-xs-2">
                    <div class="col-xs-4" style="padding-right:5px; padding-left:5px">
                        <button style="height:40px" class="btn btn-success" onmousedown="addAutomation(resource.${obj.slug})"> +1 </button>
                    </div>
                    <div class="col-xs-4" style="margin-left:15px; padding-right:5px; padding-left:5px">
                        <button style="height:40px" class="btn btn-danger" onmousedown="removeAutomation(resource.${obj.slug})"> -1 </button>
                    </div>
            </div>
            <div id="${ typeof obj.cost === 'object' && Object.keys(obj.cost).length > 0 ? obj.slug : '' }-cost-caption" class="col-xs-3 hidden">
                ${resourceCostStr}
            </div>
        </div>
        `;



        let resourceStrShort = `
        <div class="">
            <div class="col-xs-2">
                ${clickHTMLShort}  
            </div>
        </div>
        `;

        forestParent = document.getElementById('forest');
        caveParent = document.getElementById('cave');
        caveTwoParent = document.getElementById('icecave');
        farmParent = document.getElementById('farm');
        cityParent = document.getElementById('city');
        resourceParent = document.getElementById('resources');
        resourceInventoryParent = document.getElementById('resources-inventory');


        if(obj.place === undefined){


            obj.places.forEach(function(value) {

                   setPlaces(value, resourceStr, resourceStrShort);

            });

        

        }else{


            setPlaces(obj.place, resourceStr);


        }
      

        



        var costStr = '';
        for (c in resource[r].storage.cost) {
            costStr += `<span id="${obj.slug}-` + c + `-storage-cost"></span> ` + c + ` | `;
        }

        let storageStr = `
        <div class="row">
            <div class="col-xs-5">
                <button style="height:40px" class="btn btn-danger btn-block" onmousedown="addStorage(resource.${obj.slug})">Build ${obj.name} Storage</button>
            </div>
            <div class="col-xs-3">
                <button style="height:40px" id="${obj.slug}-storage-total" class="btn btn-default btn-block disabled">0</button>
            </div>
            <div class="col-xs-4">
                <h6>| ${costStr}<h6>+${obj.storage.max} ${obj.name} Storage</h6>
            </div>
        </div>
        `;

        let storageParent = document.getElementById('storage-buttons');
        storageParent.innerHTML += storageStr;
    }

    // Add workers buttons to the DOM
    for (w in workers) {
        let obj = eval(workers[w]);

        if(obj.slug == 'brickmaker')
           continue;

        var costStr = '';
        for (c in workers[w].cost) {
            costStr += `<span id="${obj.slug}-` + c + `-cost"></span> ` + c.replace("_", " ") + ` | `;
        }

        let workerStr = `
        <div class="row">
            <div class="col-xs-4">
                <button style="height:40px" id="${obj.slug}-btn" class="btn btn-block btn-hover" onmouseover="activateContentCaption('${obj.slug}-worker-caption')" onmouseout="deactivateContentCaption('${obj.slug}-worker-caption')" onmousedown="buyWorker(this, workers.${obj.slug})"><image class="icon" src="${obj.icon_path}" />  Buy ${obj.name} Skill</button>
            </div>
            <div class="col-xs-2" style="padding-right:5px; padding-left:5px">
                <button style="height:40px" id="${obj.slug}-total" class="btn btn-block btn-default disabled"></button>           
            </div>
            <div class="col-xs-1" style="padding-right:5px; padding-left:5px">
                <button style="height:40px" class="btn btn-danger" onmousedown="fireWorker(workers.${obj.slug})"> Fire</button>
            </div>
            <div class="col-xs-3">
                <h6>| ${costStr} </h6>
                <h6>+1 ${obj.name}</h6>
            </div>
            <div id="${obj.slug}-worker-caption" class="hidden">
                <h5>${obj.description}</h5>
            </div>
        </div>
        `;

        let workerParent = document.getElementById('workers');
        workerParent.innerHTML += workerStr;
    }

    // Add buildings to DOM
    for (b in buildings) {
        let obj = eval(buildings[b]);

        var costStr = '';
        for (c in buildings[b].cost) {
            costStr += `<span id="${obj.slug}-${c}-cost"></span> ${c} | `;
        }

        var buildingStr = `
        <div class="row">
            <div class="col-xs-4">
                <button id="${obj.slug}-build" style="height:40px" class="btn btn-danger btn-block" onmousedown="buyBuilding(buildings.${obj.slug})"><image class="icon" src="${obj.icon_path}" /> Build ${obj.name}</button>
            </div>
            <div class="col-xs-4">
                <button id="${obj.slug}-total" style="height:40px" class="btn btn-default btn-block disabled"></button>
            </div>
            <div class="col-xs-4">
                <h6>${costStr}</h6>
                <h6>+<span id="${obj.slug}-residents"></span> Population</h6>
            </div>
        </div>
        `;
        let buildingParent = document.getElementById('buildings');
        buildingParent.innerHTML += buildingStr;
    }


    updateMuseumData();


    let slotCounter = 0;

    // Add inventory to DOM
    for (i in inventory) {

        let obj = eval(inventory[i]);

        if(obj.total <= 0)
            continue;

        var statStr = '';
        // Add achievements to DOM

        /*
        for (c in inventory[i].basic_stats) {
            statStr += `<span id="${obj.slug}-${c}-cost"></span> ${c} | `;
        }*/

         AddInventorySlot(obj);

         slotCounter++;

    }


    completeSlots(slotCounter);


    // Add market to DOM
    updateMarket();



    
    for (a in achievements) {
        let obj = eval(achievements[a]);

        var achievementsStr = '';

        if(obj.enabled){

                achievementsStr = `
                    <div class="row">
                        <div class="col-xs-12">
                            <button id="${obj.slug}-achievement" style="height:120px" class="btn btn-success btn-block"><image class="icon-64" src="${obj.icon_path}" /> <br/>${obj.name}</button>
                        </div>
                    </div>
                    `;

                let achievementsParent = document.getElementById('achievements');
                achievementsParent.innerHTML += achievementsStr;

        }else{

                  achievementsStr = `
                    <div class="row">
                        <div class="col-xs-12">
                            <button id="${obj.slug}-achievement" style="height:120px" class="btn btn-block"><image class="icon-64" src="${obj.icon_path}" /> <br/> ${obj.name}</button>
                        </div>
                    </div>
                    `;


            let achievementsParent = document.getElementById('achievements');
            achievementsParent.innerHTML += achievementsStr;
        }


        if (meta.devmode === true) {
            document.getElementById('dev-buttons').classList.remove('hidden');
        }
    }

     document.getElementById('version-number').innerHTML = versionNumber;
     document.getElementById('version-number-options').innerHTML = versionNumber;
}


function updateMuseumData(){

    let allMonstersParent = document.getElementById('all-monsters');

    allMonstersParent.innerHTML = '';

     // Add monster to DOM
    for (m in monsters) {
        let obj = eval(monsters[m]);

        addAllMonsterSlot(obj);

        if(obj.total <= 0){

            continue;
        }

        var statStr = '';
        // Add achievements to DOM

        for (c in monsters[m].basic_stats) {
            statStr += `<span id="${obj.slug}-${c}-cost"></span> ${c} | `;
        }

    }
}


function updateMarket(id = 1) {

       let marketParent = document.getElementById('market');
       let resourcesToSellParent = document.getElementById('resources-to-sell');

       marketParent.innerHTML = '';
       resourcesToSellParent.innerHTML = '';
    
        for (re in resource) {

             let _re = eval(resource[re]);

             if(_re.slug == 'brick' || _re.slug == 'silver')
                continue;

             var marketResourceStr = `
             <div class="col-xs-2">
                 <button id="dicard-${_re.slug}-name" class="btn btn-danger btn-block" onmousedown="selectMarketItem(resource.${_re.slug})"  onmousedown="discardResource(resrouce.${_re.slug})"><img class="icon" src="${_re.icon_resource}"><span class="number-circle ${_re.slug}-total"></span></button>
             </div>
             `;

             if(id == 13){

                if(_re.slug === 'wood' || _re.slug === 'stone')
                   resourcesToSellParent.innerHTML += marketResourceStr;
             }

             if(id == 14){

                if(_re.slug === 'iron' || _re.slug === 'rune_essence')
                    resourcesToSellParent.innerHTML += marketResourceStr;

             }

             if(id == 12){

                if(_re.slug === 'gold')
                    resourcesToSellParent.innerHTML += marketResourceStr;
             }


        }

       for (ma in market) {
        let obj = eval(market[ma]);

        var statStr = '';
        
        var marketStr = `
        <div class="row item">
            <div class="col-xs-10" onmouseover="addCaption(this,market.${obj.slug})" onmouseout="fadeOutAndDestroyCaption()">
                <button id="${obj.slug}-build" style="height:40px" class="btn btn-info btn-block" onmousedown="selectMarketItem(market.${obj.slug})" onmousedown="buyItem(market.${obj.slug})"><image class="icon" src="${obj.icon_path}" /></button>
            </div>
            <div class="col-xs-10">
                
                <h6>${formatNumber(obj.cost.coin)}<image style="display:inline-block" class="icon" src="img/images/IconPack_26.png" /></h6>
                <h6 id="${obj.slug}-caption" class="hidden">${obj.description}</h6> 

            </div>
        </div>
        `;

        
        if(obj.place == id){

            marketParent.innerHTML += marketStr;
           
        }



    }

}


function completeSlots(_slotCounter){

    for (let i = 0; i < inventorySlots - _slotCounter; i++)
       AddInventoryEmptySlot();
}


function setPlaces(_place, resourceStr, resourceStrShort = null){

        if(_place == PLACE_IDS.INVENTORY){

            resourceParent = resourceInventoryParent;

            resourceParent.innerHTML += resourceStrShort;

        }else{


            if(_place == PLACE_IDS.FOREST){

            resourceParent = forestParent;
            }


            if(_place == PLACE_IDS.CAVE){


                resourceParent = caveParent;
            }


            if(_place == PLACE_IDS.CAVE2){


                resourceParent = caveTwoParent;
            }


            if(_place == PLACE_IDS.FARM){

                resourceParent = farmParent;
            }


            if(_place == PLACE_IDS.CITY){

                resourceParent = cityParent;
            }

            resourceParent.innerHTML += resourceStr;


        }

        
}


function removeEmptySlots(){

    // Obtém o elemento com ID "inventory"
    var inventoryElement = document.getElementById("inventory");

    // Obtém todas as divs dentro do elemento "inventory"
    var divs = inventoryElement.getElementsByClassName("emptySlot");

    while (divs.length > 0) 
        divs[0].remove();

}

function randomInRange(min, max) {
    
    return Math.random() * (max - min) + min;
}

function fireworksAnimation(_duration = 3){

        const duration = _duration * 1000,
        animationEnd = Date.now() + duration,
        defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 999 };

        const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);

                // since particles fall down, start a bit higher than random
                confetti(
                    Object.assign({}, defaults, {
                    particleCount,
                    origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                    })
                );
                confetti(
                    Object.assign({}, defaults, {
                    particleCount,
                    origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                    })
                );
                
        }, 250);

}

function removeOneEmptySlot(){

    // Obtém o elemento com ID "inventory"
    var inventoryElement = document.getElementById("inventory");

    // Obtém todas as divs dentro do elemento "inventory"
    var divs = inventoryElement.getElementsByClassName("emptySlot");

    let totalSlots = divs.length;

    // Percorre cada div
    for (var i = 0; i < totalSlots; i++) {
      var div = divs[i];

       slotCounter--;
       div.remove(); 
       break;
      
    }
}

function AddInventorySlot(_item){

    var inventoryStr = `
        <div class="row item" id="${_item.slug}-inventory-row">
            <div class="" onmouseout="fadeOutAndDestroyCaption()" onmouseover="addCaption(this,inventory.${_item.slug}, false)" onmousedown="selectItem(inventory.${_item.slug})">

                <button id="${_item.slug}-inventory" style="" class="btn btn-brown2 btn-block"><image class="icon" src="${_item.icon_path}" /><span class="number-circle" id="${_item.slug}-item-amount"> </span>
                </button>

            </div>
        
            <div class="col-xs-4">
                    <h6 id="${_item.slug}-caption" class="hidden">${_item.description}</h6>                  
                </div>
        </div>
        `;

        let inventoryParent = document.getElementById('inventory');
        inventoryParent.innerHTML += inventoryStr;

}


function AddInventoryEmptySlot(){

    var inventoryStr = `
        <div class="row item emptySlot" id="#">
            <div class="">

                <button id="#" style="" class="btn btn-brown2 btn-block">
                </button>

            </div>
        
            <div class="col-xs-4">
                    <h6 id="#" class="hidden">-</h6>                  
                </div>
        </div>
        `;


        let inventoryParent = document.getElementById('inventory');
        inventoryParent.innerHTML += inventoryStr;

}



function AddMonsterSlot(_monster){

    let monster_icon_path = _monster.icon_path;
    let monster_name = _monster.name;

    setEvolutionProfile(_monster, monster_icon_path);

    let monsters_icon_path = getEvolutionProfileIcon(_monster, monster_icon_path);

    var monsterStr = `
        <div class="row">
            <div class="col-xs-12">
                <button id="${_monster.slug}-monster" onclick="selectCurrentMonsterBtn('${_monster.slug}')" style="height:120px" class="btn btn-cyan btn-block"><image class="icon-64" src="${monsters_icon_path}" /><br/> ${monster_name} <br/><span class="number-circle-lg" id="${_monster.slug}-level"></span></button>

                 <div class="progress">
                    <div id="${_monster.slug}-lifeBar" class="progress-bar rounded progress-bar-red" role="progressbar" style="width: 0%;"aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                 </div>

                 <div class="progress">
                    <div id="${_monster.slug}-xpBar" class="progress-bar rounded progress-bar-purple" role="progressbar" style="width: 0%;"aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                 </div>
            </div>

            <!-- div class="col-xs-1" style="padding-right:5px; padding-left:5px">
                    <button style="height:40px" class="btn btn-brown" onmousedown="openInventory()"><image class="icon" src="img/inventory.png" /></button>
            </div -->
        
            <div class="col-xs-12">
                <h6>${_monster.description}</h6>
                <h6><image class="icon-16" src="img/icons/heart.png" />&nbsp;&nbsp;<span id="${_monster.slug}-stats-life">${_monster.current_life} / ${_monster.getLifeTotal()}</span>
                </h6>
                <h6><image class="icon-16" src="img/icons/sword.png" />&nbsp;&nbsp;<span id="${_monster.slug}-stats">${_monster.calculateTotalAttack()}</span></h6>
            </div>
        </div>
        `;
        
        let monstersParent = document.getElementById('monsters');

        monstersParent.innerHTML += monsterStr;

}


function addAllMonsterSlot(_monster){

    let silhueta = 'silhueta';
    let monster_name = '?????'

    if(isDefeatedMonster(_monster.slug) || collectedMonsters(_monster.slug)){

        silhueta = '';
        monster_name = _monster.name;
    }

    var monsterStr = `
        <div class="row">
            <div class="col-xs-12">
                <button id="${_monster.slug}-all-monster" style="height:100px" class="btn btn-brown btn-block"><image class="icon-64 ${silhueta}" src="${_monster.icon_path}" /><p> ${monster_name} </p> </button>

                <br/>
                <h6>${_monster.description}</h6>
                <h6><span id="${_monster.slug}-residents"></span></h6>
            </div>
        </div>
        `;
        
        let allMonstersParent = document.getElementById('all-monsters');

        allMonstersParent.innerHTML += monsterStr;

}


function toggleFullscreen() {
  const docElement = document.documentElement;

  if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
    // Sai do modo de tela cheia se já estiver em tela cheia
    if (docElement.exitFullscreen) {
      docElement.exitFullscreen();
    } else if (docElement.webkitExitFullscreen) {
      docElement.webkitExitFullscreen();
    } else if (docElement.mozCancelFullScreen) {
      docElement.mozCancelFullScreen();
    } else if (docElement.msExitFullscreen) {
      docElement.msExitFullscreen();
    }
  } else {
    // Entra no modo de tela cheia se não estiver em tela cheia
    if (docElement.requestFullscreen) {
      docElement.requestFullscreen();
    } else if (docElement.webkitRequestFullscreen) {
      docElement.webkitRequestFullscreen();
    } else if (docElement.mozRequestFullScreen) {
      docElement.mozRequestFullScreen();
    } else if (docElement.msRequestFullscreen) {
      docElement.msRequestFullscreen();
    }
  }
}


/*
 * Colours Text Based on if the Player can Afford it.
 */
function colorText(cost, resource, elem) {
    if (cost > resource) {
        elem.style.color = 'red';
    } else {
        elem.style.color = '#8fde8f';
    }
}


function formatNumber(num) {
  
  if (num != undefined && num < 1000) {
    return num.toString();
  }

  const suffixes = ['', 'k', 'M', 'Bi', 'Tri'];
  const suffixIndex = Math.floor(Math.log10(num) / 3);

  const scaledNum = num / Math.pow(10, suffixIndex * 3);
  const roundedNum = scaledNum.toFixed(1);

  return roundedNum + suffixes[suffixIndex];
}


function createDomItem(icon_path, className, includeAmount = true, amount = 1){

  const box = document.createElement('div');
  box.className = className;
  box.style.cssText='pointer-events:none';

  const icon = document.createElement('img');
  icon.className = 'icon'; // substitua 'fa-icon' pelo nome da classe do ícone desejado
  icon.src = icon_path;
  
  if(includeAmount){

      const name = document.createElement('span');
      name.textContent = '+' + amount.toString();
      box.appendChild(name);

  }

  box.appendChild(icon);
 

  return box;

}

function coinEffect(anchorName){

    const coinDom = createDomItem('img/images/IconPack_26.png', 'coin-effect', false);

    var anchor = document.getElementById(anchorName);

   // anchor.appendChild(coinDom);

    anchor.insertBefore(coinDom, anchor.firstChild);

    moveToPlace(coinDom);

}

function moveToPlace(element) {
  // Obtenha a referência do elemento da imagem e do destino
  const myImage = element;
  const destination = document.getElementById('coin-hud');

  // Obtenha as coordenadas de origem
  const originRect = myImage.getBoundingClientRect();
  const originX = originRect.left;
  const originY = originRect.top;


  // Obtenha as coordenadas de destino
  const destinationRect = destination.getBoundingClientRect();
  const destinationX = destinationRect.left;
  const destinationY = destinationRect.top;


  // Calcule o deslocamento (offset) entre o destino e a origem
  const offsetX = destinationX - originX;
  const offsetY = destinationY - originY;


  // Defina as variáveis CSS personalizadas para o destino
  myImage.style.setProperty('--offset-x', offsetX + 'px');
  myImage.style.setProperty('--offset-y', offsetY + 'px');

  // Adicione a classe de animação para iniciar a animação
  myImage.classList.add('move-animation');

  // Remova o elemento após a animação
  waitForSeconds(removeElement, element, 0.4);
}



function removeElement(element){


    element.remove();
}


function waitForSeconds(functionName, param, duration) {

     setTimeout(function() {

        functionName(param);

    }, duration * 1000)
    

}


var confirmFunction;
 var modal = document.getElementById("confirmationModal");

function openConfirmationModal(confirmCallback) {
  confirmFunction = confirmCallback;
  modal.style.display = "block";
}

function closeConfirmationModal() {
  modal.style.display = "none";
}

function executeFunction() {
  if (typeof confirmFunction === "function") {
    confirmFunction();
  }
  closeConfirmationModal();
}

function confirmFunction() {
  // Função a ser executada quando o jogador escolher "Sim"
  console.log("Função executada!");
}



function openModal(title, message, modalName) {


    var modal = document.getElementById(modalName + '-modal');
    var modalContent = document.getElementById('modal-content');
    var modalTitle = document.getElementById('modal-title');

    modal.style.display = 'block';

    modalContent.innerHTML = message;
    modalTitle.innerHTML = title;

    InitEnemiesImageContainer(modalName);
}


function openTab(tabId,isInCombat = true) {
                  // Esconder todas as abas
  var tabContents = document.getElementsByClassName('tab-content');
  for (var i = 0; i < tabContents.length; i++) {
    tabContents[i].classList.remove('show');
    }

                      // Exibir a aba selecionada
    var selectedTab = document.getElementById(tabId);

    if(selectedTab)
        selectedTab.classList.add('show');

    if(tabId === "tab7")
        simulateCombat();
    
    if(tabId === "tab-explore"){

        closeCombat(isInCombat);

    }


}

function closeCombat(_stopCombat = true) {

    if(_stopCombat){
        stopCombat();
        closeMiniCombat();
    }
    else{       
        openMiniCombat();
    }

    closeModal('combat-modal');
}

function openCombatModal(){

    var modal = document.getElementById('combat-modal');

    modal.style.display = 'block';

    closeMiniCombat();

}

function openMiniCombat(){

    var modal = document.getElementById('mini-combat');

    modal.style.display = 'block';
  

}

function closeMiniCombat(){

    var modal = document.getElementById('mini-combat');

    modal.style.display = 'none';
}

function openCombat(monster_id = 0) {


    if(_startCombat){

        showNotification("You need to stop your current battle to start a new one");
        return;

    }


    var modal = document.getElementById('combat-modal');

    simulateCombat(monster_id);

    modal.style.display = 'block';

    resetEnemyRoulette();
}


function closeModal(modalId = 'modal') {
    var modal = document.getElementById(modalId);
    modal.style.display = 'none';
}



function showNotification(message, duration = 2) {

    var notificationBox = document.getElementById('notificationBox');
    var notificationBoxContent = document.getElementById('notificationBoxContent');
    
    notificationBoxContent.innerHTML = message;
    notificationBox.style.display = 'block';

    setTimeout(function() {
        notificationBox.style.display = 'none';
    }, duration * 1000);
}


class ProgressBar {

  constructor(element) {
    this.elem = element;
    this.width = 0;
    this.intervalId = null;
    this.canProgress = true;
  }

  start(i, x, widthIncrement = 1) {
    if (this.canProgress) {
      this.canProgress = false;
      this.width = 0;
      this.intervalId = setInterval(() => this.frame(i, x, widthIncrement), 1);
    }
  }

  frame(i, x, widthIncrement) {
    this.width += (i*widthIncrement) ;
    this.elem.style.width = this.width + "%";

    if (this.width >= 100) {
      clearInterval(this.intervalId);
      this.canProgress = true;
      //x.total += (i);
    }
  }

}


