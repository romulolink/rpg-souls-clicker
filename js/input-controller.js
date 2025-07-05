
let isInventoryKeyPressed = false;

$(document).ready(function () {


  // Adicionar um ouvinte de eventos ao documento para o evento "keydown" (quando uma tecla é pressionada)
 document.addEventListener("keydown", handleKeyPress);

 document.addEventListener('keydown', (event) => {
    if (event.key === 'i' && !isInventoryKeyPressed) {
      isInventoryKeyPressed = true;
      openInventory();
    }
  });


  document.addEventListener('keyup', (event) => {
    if (event.key === 'i') {
      isInventoryKeyPressed = false;
      closeModal('inventory-modal')
    }
  });


}); // End document.ready()


function simulateKeyPress(dom, key) {

    console.log('simulateKeyPress %o and key: ' + key, dom);
    const event = new KeyboardEvent('keydown', { key });
    dom.dispatchEvent(event);
  }


function handleKeyPress(event) {

    if(isDev === false)
      return;

    if (event.key === "x") {

        StatsController.AddXp(50);
        showNotification("Adding 50 xp points");

    }

    if (event.key === "w") {

        resource['wood'].total+=50;
        showNotification("Adding 50 woods to inventory");

    }

    if (event.key === "a") {

        resource['wood'].total+=100;
        resource['stone'].total+=100;
        resource['brick'].total+=100;
        resource['iron'].total+=100;
        resource['gold'].total+=100;
        resource['silver'].total+=100;
        resource['goldenBar'].total+=100;
        resource['coin'].total+=100;
        resource['rune_essence'].total+=100;
        resource['rune_plant'].total+=100;
        resource['rune_fire'].total+=100;
        resource['rune_earth'].total+=100;
        resource['rune_water'].total+=100;
        inventory['simple_potion'].total+=100;
        inventory['common_box'].total+=100;
        inventory['rare_box'].total+=100;
        inventory['epic_box'].total+=100;
        inventory['legendary_box'].total+=100;
        inventory['fire_essence'].total+=100;
        inventory['water_essence'].total+=100;
        inventory['plant_essence'].total+=100;
        inventory['earth_essence'].total+=100;
        inventory['plant_lotus'].total+=100;
        inventory['fire_lotus'].total+=100;
        inventory['earth_lotus'].total+=100;
        inventory['water_lotus'].total+=100;
        inventory['plant_lotus_seed'].total+=100;
        inventory['earth_lotus_seed'].total+=100;
        inventory['fire_lotus_seed'].total+=100;
        inventory['water_lotus_seed'].total+=100;
        inventory['super_plant_lotus'].total+=100;
        inventory['super_earth_lotus'].total+=100;
        inventory['super_fire_lotus'].total+=100;
        inventory['super_water_lotus'].total+=100;


        showNotification("Adding 50 woods to inventory");

    }


    if (event.key === "s") {

        resource['stone'].total+=50;
        showNotification("Adding 50 stones to inventory");

    }


    if (event.key === "c") {

        giveCoin(100);
        coinEffect('notificationBox');
        showNotification("giving 100 Coin");

    }



}
