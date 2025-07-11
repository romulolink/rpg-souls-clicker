/* -------------------------------------------------------------
 *  Phaser 3 – Mapa Tiled com vários tilesets + árvores animadas
 * ----------------------------------------------------------- */

const CONFIG = {
  type   : Phaser.AUTO,
  width  : window.innerWidth,           // tamanho inicial da view (pode ser o que quiser)
  height : 640,
  zoom   : 1,             // aproxima em 2× sem perder pixel-art
  scale  : {
    mode: Phaser.Scale.FIT, // ajusta canvas ao tamanho da janela
    autoCenter: Phaser.Scale.CENTER_BOTH // centraliza canvas na tela
  },
  pixelArt: true,         // desativa smoothing
  parent : "gameCanvas",  // id do elemento HTML onde o canvas será inserido
  backgroundColor: "#87ceeb",
  scene  : { preload, create }
};
new Phaser.Game(CONFIG);


/* ---- Caminhos de assets ---- */
const MAP_JSON         = "js/data/world.json";
const TILESET_GROUND   = "img/tileset/FarmRPG16x16-TinyAssetPack/Tileset/tileset.png";
const TILESET_TREES    = "img/tileset/FarmRPG16x16-TinyAssetPack/Objects/trees.png";
const TILESET_PROPS    = "img/tileset/FarmRPG16x16-TinyAssetPack/Objects/props.png";
const TILESET_GRAVEYARD  = "img/tileset/graveyard-top-down/graveyard-tileset.png";
const TILESET_ANIMALS    = "img/tileset/animals.png";
const BOAR    = "img/sprites/boar.png";

/* ---- PRELOAD ---- */
function preload() {
  // mapa JSON exportado do Tiled
  this.load.tilemapTiledJSON("map", MAP_JSON);

  // as chaves ('ground', 'trees') DEVEM ser iguais às usadas no .tsx / Tiled
  this.load.image("ground", TILESET_GROUND);
  this.load.image("trees",  TILESET_TREES);
  this.load.image("props",  TILESET_PROPS);
  this.load.image("animals",  TILESET_ANIMALS);
  this.load.image("graveyard",  TILESET_GRAVEYARD);

  this.load.spritesheet('boar', BOAR, {
      frameWidth: 32,
      frameHeight: 32
    });
}


/* ---------- helper: remove enemy by id ★ ---------- */
function removeEnemy(scene, id) {
  const index = scene.enemies.findIndex(e => e.getData('id') === id);
  if (index !== -1) {
    scene.enemies[index].destroy();   // actually deletes the sprite
    scene.enemies.splice(index, 1);   // keep array in sync
  }
}

/* ---- CREATE ---- */
function create() {
  /* -- Mapa -- */
  const map = this.make.tilemap({ key: "map" });

  this.enemies      = [];  // central enemy list
  this.enemyCounter = 0;   // simple id generator

  this.input.setDefaultCursor('url(../img/icons/cursor-sword.png), auto'); // cursor personalizado

  const TILE  = 16;   // largura/altura reais do tile
  const PAD   = 0;    // padding/spacing que você extraiu

  const groundSet  = map.addTilesetImage('ground',  'ground',  TILE, TILE, PAD, PAD);
  const treeSet    = map.addTilesetImage('trees',   'trees',   TILE, TILE, PAD, PAD);
  const propsSet   = map.addTilesetImage('props',   'props',   TILE, TILE, PAD, PAD);
  const animalsSet = map.addTilesetImage('animals', 'animals', TILE, TILE, PAD, PAD);
  const graveyardSet = map.addTilesetImage('graveyard', 'graveyard', TILE, TILE, PAD, PAD);
  
  /* -- Cria camadas de tiles (ordem importa) -- */
  map.createLayer("ground", groundSet, 0, 0);
  map.createLayer("trees",  treeSet,   0, 0);
  map.createLayer("props",  propsSet,   0, 0);
  map.createLayer("animals",  animalsSet,   0, 0);
  map.createLayer("graveyard",  graveyardSet,   0, 0);


  this.cameras.main.setRoundPixels(true);
  this.game.renderer.config.antialias = false;
  this.game.renderer.config.pixelArt = true;
  

  /* -- Converte Object-Layer 'trees' em sprites balançando -- */
  const objects = map.getObjectLayer("animals")?.objects || [];
  const building = map.getObjectLayer("building")?.objects || [];

  objects.forEach(obj => {


    const enemyId = `enemy-${this.enemyCounter++}`;   // e.g. enemy-0, enemy-1 …

    /* 3.  cria sprite já com o recorte correto */
    const sprite = this.add.sprite(obj.x, obj.y, 'boar', 2)
      .setOrigin(0, 0)
      .setName(enemyId)            // Phaser-side: can fetch later with this.children.getByName(id)
      .setData('id', enemyId)     // extra: retrieve with sprite.getData('id')
      //.setCrop(96, 300, obj.width, obj.height)   // 👈 usa cálculo automático
      .setInteractive({ pixelPerfect: true}); 
        
      this.game.canvas.setAttribute(`data-${enemyId}`, ''); 

      // Track in the local enemy list
      this.enemies.push(sprite);

      sprite.on("pointerdown", () => {

        this.input.setDefaultCursor('url(../img/icons/cursor-sword.png), auto'); // cursor de espada
        openCombat(1,enemyId,this);

    });

    // Tween: brisa suave (x oscila ±2 px)
    this.tweens.add({
      targets: sprite,
      x: sprite.x + 2,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
      delay: Math.random() * 500
    });

  });

// localiza apenas o objeto chamado "building1"
const targetObj = building.find(o => o.name === "building1");

if (targetObj) {

  const { x, y, width, height } = targetObj;

  const zone = this.add.zone(x + width /2, y + height / 2, width, height)
    .setOrigin(0.5)
    .setInteractive({ });

  // DEBUG: contorno da área clicável
  const debug = this.add.graphics();
  debug.lineStyle(2, 0xff0000, 1);          // (espessura, cor, alfa)
  debug.strokeRect(
    x,   // top-left X
    y,   // top-left Y
    width,
    height
  );

  // listener só para esta zone
  zone.on('pointerdown', () => {
    this.input.setDefaultCursor('url(../img/icons/cursor-sword.png), auto'); // cursor de espada
    showNotification("You need to find a key to open this door.");
  });
} else {
  console.warn('building1 não encontrado na camada "building".');
}

  /* -- Ajusta câmera para mostrar o mapa todo -- */
  this.cameras.main.setZoom(2); 
  this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  this.cameras.main.centerOn(map.widthInPixels, map.heightInPixels);

  const cursors = this.input.keyboard.addKeys({
    up   : Phaser.Input.Keyboard.KeyCodes.W,
    down : Phaser.Input.Keyboard.KeyCodes.S,
    left : Phaser.Input.Keyboard.KeyCodes.A,
    right: Phaser.Input.Keyboard.KeyCodes.D
  });

  const speed = 200;
  
  this.events.on("update", (_, dt) => {
    const cam = this.cameras.main;
    if (cursors.left.isDown)  cam.scrollX -= speed * dt/1000;
    if (cursors.right.isDown) cam.scrollX += speed * dt/1000;
    if (cursors.up.isDown)    cam.scrollY -= speed * dt/1000;
    if (cursors.down.isDown)  cam.scrollY += speed * dt/1000;
  });
}