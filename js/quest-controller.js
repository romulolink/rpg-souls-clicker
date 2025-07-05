
var questContainer;
var currentQuestId = 1;
var currentSideQuestId;

$(document).ready(function () {


  setTimeout(initQuestController,2000);


}); // End document.ready()




function initQuestController(){

  
  questContainer = document.getElementById("questContainer");
  
    // Ordena as quests pela sequência das main quests
    quests.sort(function(a, b) {
      if (a.isMainQuest && b.isMainQuest) {
        return a.sequence - b.sequence;
      } else if (a.isMainQuest) {
        return -1;
      } else if (b.isMainQuest) {
        return 1;
      } else {
        return 0;
      }
    });

 
  UpdateQuestList();

}


function checkQuestConditions(_quest) {

  let quest = getQuestInfoById(_quest.id);

  for (let condition of quest.conditions) {

   

    if (condition.type === 'collect') {
      const collectedAmount = getCollectedAmount(condition.item);
      if (collectedAmount < condition.amount) {

        return false; // Condição não atendida
      }
    } else if (condition.type === 'defeat') {
      const defeatedEnemy = hasDefeatedEnemy(condition.enemy);
      if (!defeatedEnemy) {

        return false; // Condição não atendida
      }
    } else if (condition.type === 'sell') {
      const collectedAmount = getSoldAmount(condition.item);


      if (collectedAmount < condition.amount) {

        return false; // Condição não atendida
      }
    } else if (condition.type === 'buy') {

      const collectedAmount = getBoughtAmount(condition.item);
      if (collectedAmount < condition.amount) {

        return false; // Condição não atendida
      }
    }
  }


  return true; // Todas as condições foram atendidas
}


function hasDefeatedEnemy(enemy_id){

    if(enemy_id === 'any'){

       if(defeatedEnemiesData.length > 0)
        return true;

    }

    return defeatedEnemiesData.includes(enemy_id);
}

function getSoldAmount(item_slug) 
{

   for (var i = 0; i < soldItems.length; i++) {

    if (soldItems[i].itemSlug === item_slug) {
      
      return soldItems[i].amount;

    }
  }

  return 0;

}


function getBoughtAmount(item_slug) 
{

   for (var i = 0; i < boughtItems.length; i++) {
    
    if (boughtItems[i].itemSlug === item_slug) {
      
      return boughtItems[i].amount;

    }
  }

  return 0;

}


function getCollectedAmount(item_slug) 
{


    return getItemAmount(item_slug);

}

function CheckQuestCompletion(questID) {
  
  let quest = getQuestBySequence(questID);

  if(quest)
  if(quest.isActive){

    if(quest.sequence === questID){

        if(checkQuestConditions(quest))
           completeQuest(quest);

    }

  }


}

function getCurrentQuestId(){

    let questId = 0;


    for (let i = 0; i < questsData.length; i++) {

      if(questsData[i].isActive === true && questsData[i].isMainQuest){
        
          let questInfo = getQuestInfoById(questsData[i].id);

          questId = questInfo.sequence;
          break;
      }

    
    }

    return questId;

}

function UpdateQuestList(){

   if(!questContainer)
    return;

   questContainer.innerHTML = "";

   // Cria e exibe as quests na página
    questsData.forEach(function(_quest) {

      let quest = getQuestInfoById(_quest.id);

      var questElement = document.createElement("div");
      questElement.id = _quest.id;
      questElement.className = "quest" + (_quest.isCompleted ? " hidden" : "");

      var questTitle = document.createElement("h3");
      questTitle.innerText = quest.title;

      var questDescription = document.createElement("p");
      questDescription.innerText = quest.description;

      var questButton = document.createElement("button");
      questButton.innerText = "In Progress";
      questButton.className = "btn btn-success";
      questButton.addEventListener("click", function() {
        completeQuest(quest);
      });

      questElement.appendChild(questTitle);
      questElement.appendChild(questDescription);


      if(_quest.isActive)
        questContainer.appendChild(questElement);

    });


}


    function setCurrentQuest(questID){

        for (let i = 0; i < questsData.length; i++) {

          if(questsData[i].sequence === questID && questsData[i].isMainQuest){
            
            questsData[i].isActive = true;
          
            UpdateQuestList();
          }
        
        }

    }    



    function getQuestInfoById(questID){

      var selectedQuest;

      for (var i = 0; i < quests.length; i++) {
        var quest = quests[i];
          
        if (quest.id === questID) {
          selectedQuest = quest;
          break;
        }
      }


      return selectedQuest;


    }




    function getQuestBySequence(questID){

      var selectedQuest;

      for (var i = 0; i < questsData.length; i++) {
        var quest = questsData[i];
          
        if (quest.isMainQuest && quest.sequence === questID) {
          selectedQuest = quest;

          break;
        }
      }


      return selectedQuest;


    }



    function completeQuest(quest) {

      var questElement = document.getElementById(quest.id);

      questElement.classList.add("hidden");
      
      currentQuestId = getCurrentQuestId();

      let nextQuestId = currentQuestId + 1;

      quest.isCompleted = true;

      quest.isActive = false;

      setCurrentQuest(nextQuestId);

      let message = "you successfuly completed the quest!";

      openModal("Congratulations!", message, 'default');
    
    }