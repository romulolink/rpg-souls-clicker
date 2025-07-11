(function(){
  const ANIMAL_SPEED  = 0.1;
  const ANIMAL_RADIUS = 10;                  // raio usado p/ colisão
  const ANIMAL_SIZE   = 24;                  // largura/altura sprite

  /* --------- sprite do animal --------- */
  const animalImg = new Image();
  animalImg.src   = 'img/sprites/boar.png'; // seu PNG aqui
  const MAP_SIZE      = window.World.MAP_SIZE;
  const GRID          = window.World.GRID;
  const TREE_HALF     = GRID*0.4;
  const rs   = () => Math.random() < .5 ? -1 : 1;
  const snap = v => Math.floor(v/GRID)*GRID + GRID/2;

  function createAnimals(count){
    return Array.from({length:count}, () => ({
      x : snap(Math.random()*MAP_SIZE),
      y : snap(Math.random()*MAP_SIZE),
      vx: ANIMAL_SPEED*rs()*Math.random(),
      vy: ANIMAL_SPEED*rs()*Math.random()
    }));
  }

  /* collision circle – square */
  function hitTree(a, t){
    const dx = Math.abs(a.x - t.x);
    const dy = Math.abs(a.y - t.y);
    const nearestX = Math.max(dx - TREE_HALF, 0);
    const nearestY = Math.max(dy - TREE_HALF, 0);
    return Math.hypot(nearestX, nearestY) < ANIMAL_RADIUS;
  }

  function updateAnimals(arr, trees){
    arr.forEach(a=>{
      const px=a.x, py=a.y;
      a.x += a.vx; a.y += a.vy;

      /* world bounds */
      if(a.x<0||a.x>MAP_SIZE){a.vx*=-1;a.x=Math.max(0,Math.min(MAP_SIZE,a.x));}
      if(a.y<0||a.y>MAP_SIZE){a.vy*=-1;a.y=Math.max(0,Math.min(MAP_SIZE,a.y));}

      /* collide with any tree */
      if(trees.some(t=>hitTree(a,t))){
        a.x = px; a.y = py;
        a.vx *= -1; a.vy *= -1;
      }

      /* random wander */
      if(Math.random()<0.005){
        a.vx = ANIMAL_SPEED*rs()*Math.random();
        a.vy = ANIMAL_SPEED*rs()*Math.random();
      }
    });
  }

  function drawAnimals(ctx, cam, arr){
    if (!animalImg.complete) return;          // aguarda carregar
    const half = ANIMAL_SIZE / 2;
    arr.forEach(a => {
      ctx.drawImage(animalImg,
        a.x - half - cam.x,
        a.y - half - cam.y,
        ANIMAL_SIZE, ANIMAL_SIZE);
    });
  }

  window.Mobs = { createAnimals, updateAnimals, drawAnimals };
})();
