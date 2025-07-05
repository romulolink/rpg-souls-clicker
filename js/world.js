(function(){
  const MAP_SIZE     = 2000;
  const GRID         = 64;
  const ISLAND_COLOR = '#64be53';
  const GRID_COLOR   = '#9df18b';

  const snap = v => Math.floor(v/GRID)*GRID + GRID/2;

  function generateTrees(count){
    return Array.from({length:count}, () => ({
      x: snap(Math.random()*MAP_SIZE),
      y: snap(Math.random()*MAP_SIZE)
    }));
  }

  function draw(ctx, cam, trees){
    /* island */
    ctx.fillStyle = ISLAND_COLOR;
    ctx.fillRect(-cam.x, -cam.y, MAP_SIZE, MAP_SIZE);

    /* grid */
    ctx.strokeStyle = GRID_COLOR;
    ctx.lineWidth   = 1;
    ctx.beginPath();
    for(let x=0;x<=MAP_SIZE;x+=GRID){
      ctx.moveTo(x-cam.x, -cam.y); ctx.lineTo(x-cam.x, MAP_SIZE-cam.y);}
    for(let y=0;y<=MAP_SIZE;y+=GRID){
      ctx.moveTo(-cam.x, y-cam.y); ctx.lineTo(MAP_SIZE-cam.x, y-cam.y);}
    ctx.stroke();

    /* trees */
    ctx.fillStyle = '#206020';
    const half = GRID*0.4;
    trees.forEach(t=>{
      ctx.fillRect(t.x-half-cam.x, t.y-half-cam.y, half*2, half*2);
    });
  }

  window.World = { MAP_SIZE, GRID, ISLAND_COLOR, GRID_COLOR, generateTrees, draw };
})();
