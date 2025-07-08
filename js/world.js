/* -------------------------------------------------------------
 *  Phaser 3 – Mapa Tiled com vários tilesets + árvores animadas
 * ----------------------------------------------------------- */

const CONFIG = {
  type   : Phaser.AUTO,
  width  : 960,           // tamanho inicial da view (pode ser o que quiser)
  height : 640,
  zoom   : 1,             // aproxima em 2× sem perder pixel-art
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

/* ---- PRELOAD ---- */
function preload() {
  // mapa JSON exportado do Tiled
  this.load.tilemapTiledJSON("map", MAP_JSON);

  // as chaves ('ground', 'trees') DEVEM ser iguais às usadas no .tsx / Tiled
  this.load.image("ground", TILESET_GROUND);
  this.load.image("trees",  TILESET_TREES);
  this.load.image("props",  TILESET_PROPS);
}

/* ---- CREATE ---- */
function create() {
  /* -- Mapa -- */
  const map = this.make.tilemap({ key: "map" });

  /* -- Associa tilesets -- */
  const groundSet = map.addTilesetImage("ground", "ground");
  const treeSet   = map.addTilesetImage("trees",  "trees");
  const propsSet   = map.addTilesetImage("props",  "props");

  /* -- Cria camadas de tiles (ordem importa) -- */
  map.createLayer("ground", groundSet, 0, 0);
  map.createLayer("trees",  treeSet,   0, 0);
  map.createLayer("props",  propsSet,   0, 0);


  /* -- Converte Object-Layer 'trees' em sprites balançando -- */
  const objects = map.getObjectLayer("trees")?.objects || [];
  objects.forEach(obj => {

    const sprite = this.add
      .sprite(obj.x - obj.width/2, obj.y + obj.height/2, "trees", 0)
     // .setOrigin(obj.x, obj.y)                 // pivô na base do tronco
      .setCrop(96, 0, obj.width, obj.height)
      .setInteractive({ pixelPerfect: true, useHandCursor: true });
      
    sprite.on("pointerdown", () => {
    
    openCombat(1);

  });

  this.cameras.main.setZoom(2); 
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

  /* -- Ajusta câmera para mostrar o mapa todo -- */
  this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  this.cameras.main.centerOn(map.widthInPixels/2, map.heightInPixels/2);

  /* -- Controles opcionais (seta/WASD para passear) -- */
  const cursors = this.input.keyboard.createCursorKeys();
  const speed = 200;
  this.events.on("update", (_, dt) => {
    const cam = this.cameras.main;
    if (cursors.left.isDown)  cam.scrollX -= speed * dt/1000;
    if (cursors.right.isDown) cam.scrollX += speed * dt/1000;
    if (cursors.up.isDown)    cam.scrollY -= speed * dt/1000;
    if (cursors.down.isDown)  cam.scrollY += speed * dt/1000;
  });
}