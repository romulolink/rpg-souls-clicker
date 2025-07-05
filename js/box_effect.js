  let counter = 0;
  let box;

  function addBox(element, item, icon_path) {
    const container = element; 

    if (counter < 5) {
     
      let domItem = createDomItem(icon_path, 'box', true, resource[item].clickIncrement);

      container.appendChild(domItem);

      setTimeout(() => {
        fadeOutAndDestroy(domItem);
      }, 500);
      

      counter++;
    }
  }

    

    function resetButtonListener(item_slug){

      var old_element = document.getElementById("use-item-btn");
      var new_element = old_element.cloneNode(true);
      old_element.parentNode.replaceChild(new_element, old_element);  
    }


    function addCaption(element, item, isMarket = true) {

        const container = element;
        
        const item_elem = document.getElementById(item.slug + '-caption'); 

        const text = item_elem.innerHTML;

        box = document.createElement('div');
        box.className = 'caption';

        const name = document.createElement('span');
        const br = document.createElement('br');

        name.textContent = text;

        const h6 = document.createElement('h6');

        const coinSpan = document.createElement('span');

        if(item.cost !== undefined){

          let sellingPrice = item.cost.coin / 2;

          sellingPrice = parseInt(sellingPrice);

          if(isMarket)
            sellingPrice = item.cost.coin;
          
          coinSpan.textContent = 'Selling price:  ' + sellingPrice;
        
          const iconImage = document.createElement('img');
          iconImage.className = 'icon';
          iconImage.src = 'img/images/IconPack_26.png';
          iconImage.style.display = 'inline-block';

          name.appendChild(br);
          name.appendChild(coinSpan);
          name.appendChild(iconImage);

        }

        box.appendChild(name);

        container.appendChild(box);
        
  
    }

    function addSimpleCaption(element, _name, message) {

        const container = element;

        box = document.createElement('div');
        box.className = 'caption';
        const name = document.createElement('span');
        const br = document.createElement('br');

        name.textContent = message;

        const h6 = document.createElement('h6');

        h6.textContent = _name;

        const coinSpan = document.createElement('span');

        box.appendChild(h6);
        box.appendChild(name);

        container.appendChild(box);
        
    }

    let tmpClassName = ''

    function activateContentCaption(element_id) {

        let element = document.getElementById(element_id);
        tmpClassName =  element.className;
        element.className = 'caption2';
        
    }



    function deactivateContentCaption(element_id) {

        let element = document.getElementById(element_id);
        element.className = '';
        element.className = 'hidden';
        
    }




    function fadeIn(element) {
      let opacity = 0;
      let top = 0;
      const interval = setInterval(() => {
        opacity += 0.1;
        element.style.opacity = opacity;

        if (opacity >= 1) {
          clearInterval(interval);
          counter--;
          repositionBoxes();
        }
      }, 20);
    }




      function addTooltipListener(element){


            element.addEventListener('mouseover', function() {

              addTooltip(element);
          
            });

      }



      function removeTooltipListener(element){


            element.removeEventListener('mouseover', function() {

              addTooltip(element);
          
            });

      }

     function addTooltip(element) {


      if (counter < 1) {

          const container = element; 

          const box = document.createElement('div');
          box.className = 'tooltip';

         // const icon = document.createElement('img');
         // icon.className = 'icon'; // substitua 'fa-icon' pelo nome da classe do ícone desejado
         // icon.src = icon_path;

          const name = document.createElement('span');
          name.textContent = 'You need a storage to farm this item';

         // box.appendChild(icon);
          box.appendChild(name);

          container.parentNode.appendChild(box);

          setTimeout(() => {
            fadeOutAndDestroy(box);
          }, 500);


            counter++;
            console.log("ativando tooltip");

        }


    }

    function fadeOutAndDestroyCaption(){

      //fadeOutAndDestroy(box);
      if(box)
        box.remove();

    }


    function fadeOutAndDestroy(element) {
      let opacity = 1;
      let top = 0;
      const interval = setInterval(() => {
        opacity -= 0.1;
        element.style.opacity = opacity;

        if (opacity <= 0) {
          clearInterval(interval);
          element.remove();
          counter--;
        }
      }, 20);
    }

    function repositionBoxes() {
      const boxes = document.getElementsByClassName('box');
      let top = 0;

      for (let i = 0; i < boxes.length; i++) {
        boxes[i].style.top = top + 'px';
        top += 0;
      }
    }