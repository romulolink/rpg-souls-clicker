/* -------------------------------------------------------------
 *  Phaser 3 – Mapa Tiled com vários tilesets + árvores animadas
 * ----------------------------------------------------------- */


  class Config {
    static MAP_JSON          = "../js/data/world.json";
    static TILESET_GROUND    = "../img/tileset/FarmRPG16x16-TinyAssetPack/Tileset/tileset.png";
    static TILESET_TREES     = "../img/tileset/FarmRPG16x16-TinyAssetPack/Objects/trees.png";
    static TILESET_PROPS     = "../img/tileset/FarmRPG16x16-TinyAssetPack/Objects/props.png";
    static TILESET_GRAVEYARD = "../img/tileset/graveyard-top-down/graveyard-tileset.png";
    static TILESET_ANIMALS   = "../img/tileset/animals.png";
    static BOAR              = "../img/sprites/boar.png";
  }


  class MainScene extends Phaser.Scene {
    
      constructor() {
          super('MainScene');
      }
      preload() {
          this.load.spritesheet('player', 'https://rpg-souls-clicker.vercel.app/img/sprites/dude.png', { frameWidth: 32, frameHeight: 32 });
      }
      create() {
          const biomes = [
              { id: 'biome1', tileset: 'https://rpg-souls-clicker.vercel.app/experimentos/tileset.png', startPos: { x: 50, y: 50 } },
              { id: 'biome2', tileset: 'https://rpg-souls-clicker.vercel.app/experimentos/tileset.png', startPos: { x: 5, y: 5 } },
          ];
          this.scene.start('BiomeScene', biomes[0]);
      }
  }


  
        class BiomeScene extends Phaser.Scene {
            constructor() {
                super('BiomeScene');
            }
            init(data) {
                this.biomeId = data.id;
                this.tilesetUrl = data.tileset;
                this.startPos = data.startPos;
            }
            preload() {

                this.load.image(`tiles_${this.biomeId}`, this.tilesetUrl);

                // mapa JSON exportado do Tiled
                this.load.tilemapTiledJSON("map", Config.MAP_JSON);

                // as chaves ('ground', 'trees') DEVEM ser iguais às usadas no .tsx / Tiled
                this.load.image("ground", Config.TILESET_GROUND);
                this.load.image("trees",  Config.TILESET_TREES);
                this.load.image("props",  Config.TILESET_PROPS);
                this.load.image("animals",  Config.TILESET_ANIMALS);
                this.load.image("graveyard",  Config.TILESET_GRAVEYARD);

                this.load.spritesheet('boar', Config.BOAR, {
                    frameWidth: 32,
                    frameHeight: 32
                  });

  
            }
            create() {
                const tileSize = 32;
                const mapWidth = 100;
                const mapHeight = 100;
                const fogRadius = 6;
                const fadeDuration = 300;
                const gradientRadius = fogRadius + 2;
                const minAlpha = 0.2;
                const maxAlpha = 0.95;
                const moveDuration = 200;
                const moveCooldownDuration = 200;
                const impassableTiles = [0, 1, 2, 10];
                const teleportTiles = [
                    { x: 95, y: 95, targetBiome: 'biome2', targetPos: { x: 5, y: 5 } },
                ];


                const map = this.make.tilemap({ key: "map" });

                this.enemies      = [];  // central enemy list
                this.enemyCounter = 0;   // simple id generator

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
                map.createLayer("graveyard",  graveyardSet,   0, 0).setDepth(100);


                const mapData = Array(mapHeight).fill().map((_, y) => 
                    Array(mapWidth).fill().map((_, x) => {
                        if (x === 0 || x === mapWidth - 1 || y === 0 || y === mapHeight - 1) {
                            return 10;
                        }
                        return Phaser.Math.Between(0, 9);
                    })
                );
                this.tilemap = this.make.tilemap({ 
                    data: mapData,
                    tileWidth: tileSize, 
                    tileHeight: tileSize 
                });
                
                const tileset = this.tilemap.addTilesetImage(`tiles_${this.biomeId}`, `tiles_${this.biomeId}`, tileSize, 
                                    
                tileSize, 0, 0);
                const layer = this.tilemap.createLayer(0, tileset, 0, 0).setScale(1).setDepth(0);

                this.tilemap.setCollision(10);

                this.fogMap = Array(mapHeight).fill().map(() => Array(mapWidth).fill(0));
                this.loadFogState();

                const solidGraphics = this.add.graphics();
                solidGraphics.fillStyle(0x000000, maxAlpha);
                solidGraphics.fillRect(0, 0, tileSize, tileSize);
                solidGraphics.generateTexture('fogSolid', tileSize, tileSize);
                solidGraphics.destroy();

                this.fogSprites = this.add.group();
                for (let y = 0; y < mapHeight; y++) {
                    for (let x = 0; x < mapWidth; x++) {
                        const sprite = this.add.sprite(x * tileSize, y * tileSize, 'fogSolid');
                        sprite.setOrigin(0);
                        sprite.setDepth(100); // Aumentar profundidade para garantir visibilidade
                        sprite.setAlpha(this.fogMap[y][x] === 0 ? maxAlpha : 0);
                        this.fogSprites.add(sprite);
                    }
                }

                this.player = this.physics.add.sprite(this.startPos.x * tileSize, this.startPos.y * tileSize, 'player', 4);
                this.player.setOrigin(0, 0);
                this.player.setPosition(
                    Math.floor(this.startPos.x) * tileSize,
                    Math.floor(this.startPos.y) * tileSize
                );
                this.player.setDepth(50); // Profundidade menor que a névoa

                this.physics.add.collider(this.player, layer);

                this.cameras.main.startFollow(this.player);
                this.cameras.main.setBounds(0, 0, mapWidth * tileSize, mapHeight * tileSize);

                this.anims.create({
                    key: 'left',
                    frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
                    frameRate: 10,
                    repeat: -1
                });
                this.anims.create({
                    key: 'right',
                    frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
                    frameRate: 10,
                    repeat: -1
                });
                this.anims.create({
                    key: 'up',
                    frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
                    frameRate: 10,
                    repeat: -1
                });
                this.anims.create({
                    key: 'down',
                    frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
                    frameRate: 10,
                    repeat: -1
                });
                this.anims.create({
                    key: 'idle',
                    frames: [{ key: 'player', frame: 4 }],
                    frameRate: 20
                });

                this.cursors = this.input.keyboard.createCursorKeys();
                this.moveQueue = [];
                this.isMoving = false;
                this.moveCooldown = 0;
                this.tileSize = tileSize;
                this.mapWidth = mapWidth;
                this.mapHeight = mapHeight;
                this.fogRadius = fogRadius;
                this.fadeDuration = fadeDuration;
                this.gradientRadius = gradientRadius;
                this.minAlpha = minAlpha;
                this.maxAlpha = maxAlpha;
                this.moveDuration = moveDuration;
                this.moveCooldownDuration = moveCooldownDuration;
                this.impassableTiles = impassableTiles;
                this.teleportTiles = teleportTiles;

                this.input.on('pointerdown', (pointer) => {
                    const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
                    const targetTileX = Math.floor(worldPoint.x / tileSize);
                    const targetTileY = Math.floor(worldPoint.y / tileSize);

                    if (targetTileX >= 0 && targetTileX < mapWidth && targetTileY >= 0 && targetTileY < mapHeight) {
                        const tile = this.tilemap.getTileAt(targetTileX, targetTileY);
                        if (!tile || !impassableTiles.includes(tile.index)) {
                            this.moveQueue = this.findPath(
                                Math.floor(this.player.x / tileSize),
                                Math.floor(this.player.y / tileSize),
                                targetTileX,
                                targetTileY
                            );
                        }
                    }
                });
            }
            update(time, delta) {
                if (this.moveCooldown > 0) {
                    this.moveCooldown -= delta;
                    if (this.moveCooldown < 0) this.moveCooldown = 0;
                }

                if (this.isMoving || this.moveCooldown > 0) {
                    return;
                }

                let targetX = this.player.x;
                let targetY = this.player.y;
                let animation = 'idle';

                if (this.moveQueue.length > 0) {
                    const nextMove = this.moveQueue.shift();
                    targetX = nextMove.x * this.tileSize;
                    targetY = nextMove.y * this.tileSize;
                    animation = nextMove.anim;
                } else {
                    let targetTileX = Math.floor(this.player.x / this.tileSize);
                    let targetTileY = Math.floor(this.player.y / this.tileSize);

                    if (this.cursors.left.isDown) {
                        targetTileX -= 1;
                        animation = 'left';
                    } else if (this.cursors.right.isDown) {
                        targetTileX += 1;
                        animation = 'right';
                    } else if (this.cursors.up.isDown) {
                        targetTileY -= 1;
                        animation = 'up';
                    } else if (this.cursors.down.isDown) {
                        targetTileY += 1;
                        animation = 'down';
                    }

                    if (targetTileX !== Math.floor(this.player.x / this.tileSize) || targetTileY !== Math.floor(this.player.y / this.tileSize)) {
                        this.moveQueue = this.findPath(
                            Math.floor(this.player.x / this.tileSize),
                            Math.floor(this.player.y / this.tileSize),
                            targetTileX,
                            targetTileY
                        );
                        if (this.moveQueue.length > 0) {
                            const nextMove = this.moveQueue.shift();
                            targetX = nextMove.x * this.tileSize;
                            targetY = nextMove.y * this.tileSize;
                            animation = nextMove.anim;
                        }
                    }
                }

                if (targetX !== this.player.x || targetY !== this.player.y) {
                    const tileX = Math.floor(targetX / this.tileSize);
                    const tileY = Math.floor(targetY / this.tileSize);
                    const tile = this.tilemap.getTileAt(tileX, tileY);

                    const teleport = this.teleportTiles.find(t => t.x === tileX && t.y === tileY);
                    if (teleport) {
                        this.saveFogState();
                        this.textures.remove(`tiles_${this.biomeId}`);
                        this.scene.start('BiomeScene', {
                            id: teleport.targetBiome,
                            tileset: 'https://rpg-souls-clicker.vercel.app/experimentos/tileset.png',
                            startPos: teleport.targetPos
                        });
                        return;
                    }

                    if (!tile || !this.impassableTiles.includes(tile.index)) {
                        this.isMoving = true;
                        this.player.anims.play(animation, true);

                        this.tweens.add({
                            targets: this.player,
                            x: targetX,
                            y: targetY,
                            duration: this.moveDuration,
                            ease: 'Linear',
                            onStart: () => {
                                this.tweens.add({
                                    targets: this.player,
                                    scaleX: 1.2,
                                    scaleY: 1.2,
                                    duration: this.moveDuration / 2,
                                    ease: 'Sine.easeOut',
                                    yoyo: true
                                });
                            },
                            onComplete: () => {
                                this.isMoving = false;
                                this.moveCooldown = this.moveCooldownDuration;
                                this.player.anims.play('idle', true);
                                this.player.setPosition(
                                    tileX * this.tileSize,
                                    tileY * this.tileSize
                                );
                            }
                        });
                    } else {
                        this.moveQueue = [];
                    }
                } else {
                    this.player.anims.play('idle', true);
                }

                const tileX = Math.floor(this.player.x / this.tileSize);
                const tileY = Math.floor(this.player.y / this.tileSize);
                this.updateFogOfWar(tileX, tileY);
            }
            findPath(startX, startY, targetX, targetY) {
                const queue = [{ x: startX, y: startY, path: [] }];
                const visited = new Set();
                visited.add(`${startX},${startY}`);
                const directions = [
                    { dx: 0, dy: -1, anim: 'up' },
                    { dx: 0, dy: 1, anim: 'down' },
                    { dx: -1, dy: 0, anim: 'left' },
                    { dx: 1, dy: 0, anim: 'right' }
                ];

                while (queue.length > 0) {
                    const { x, y, path } = queue.shift();
                    if (x === targetX && y === targetY) {
                        return path;
                    }

                    for (const { dx, dy, anim } of directions) {
                        const newX = x + dx;
                        const newY = y + dy;
                        const key = `${newX},${newY}`;

                        if (
                            newX >= 0 && newX < this.mapWidth &&
                            newY >= 0 && newY < this.mapHeight &&
                            !visited.has(key)
                        ) {
                            const tile = this.tilemap.getTileAt(newX, newY);
                            if (!tile || !this.impassableTiles.includes(tile.index)) {
                                visited.add(key);
                                queue.push({
                                    x: newX,
                                    y: newY,
                                    path: [...path, { x: newX, y: newY, anim }]
                                });
                            }
                        }
                    }
                }

                return [];
            }
            updateFogOfWar(centerX, centerY) {
                if (!this.fogMap || !this.fogSprites) {
                    console.warn('fogMap ou fogSprites não estão definidos');
                    return;
                }

                let updated = false;
                const sprites = this.fogSprites.getChildren();

                const minY = Math.max(0, centerY - this.gradientRadius);
                const maxY = Math.min(this.mapHeight - 1, centerY + this.gradientRadius);
                const minX = Math.max(0, centerX - this.gradientRadius);
                const maxX = Math.min(this.mapWidth - 1, centerX + this.gradientRadius);

                for (let y = minY; y <= maxY; y++) {
                    for (let x = minX; x <= maxX; x++) {
                        const spriteIndex = y * this.mapWidth + x;
                        const sprite = sprites[spriteIndex];
                        if (!sprite || !sprite.active) {
                            continue; // Pular sprites não inicializados
                        }

                        const distance = Phaser.Math.Distance.Between(x, y, centerX, centerY);

                        if (distance <= this.fogRadius && this.fogMap[y] && this.fogMap[y][x] === 0) {
                            this.fogMap[y][x] = 1;
                            updated = true;

                            if (!this.tweens.isTweening(sprite)) {
                                this.tweens.add({
                                    targets: sprite,
                                    alpha: 0,
                                    duration: this.fadeDuration,
                                    ease: 'Linear',
                                    onComplete: () => {
                                        if (sprite && sprite.active) {
                                            sprite.setAlpha(0);
                                        }
                                    }
                                });
                            } else {
                                sprite.setAlpha(0);
                            }
                        } else if (this.fogMap[y] && this.fogMap[y][x] === 0) {
                            let alpha;
                            if (distance <= this.gradientRadius) {
                                const normalizedDistance = (distance - this.fogRadius) / (this.gradientRadius - this.fogRadius);
                                alpha = Phaser.Math.Linear(this.minAlpha, this.maxAlpha, normalizedDistance);
                            } else {
                                alpha = this.maxAlpha;
                            }
                            if (!this.tweens.isTweening(sprite)) {
                                sprite.setAlpha(alpha);
                            }
                        }
                    }
                }

                if (updated) {
                    this.saveFogState();
                }
            }
            saveFogState() {
                try {
                    localStorage.setItem(`fogMap_${this.biomeId}`, JSON.stringify(this.fogMap));
                } catch (e) {
                    console.error('Erro ao salvar fogMap no localStorage:', e);
                }
            }
            loadFogState() {
                try {
                    const savedFogMap = localStorage.getItem(`fogMap_${this.biomeId}`);
                    if (savedFogMap) {
                        const parsedFogMap = JSON.parse(savedFogMap);
                        if (Array.isArray(parsedFogMap) && parsedFogMap.length === this.mapHeight && parsedFogMap.every(row => Array.isArray(row) && row.length === this.mapWidth)) {
                            this.fogMap = parsedFogMap;
                        }
                    }
                } catch (e) {
                    console.error('Erro ao carregar fogMap do localStorage:', e);
                }
            }
        }


 const config = {
        type: Phaser.AUTO,
        width  : window.innerWidth,
        height: 640,
        zoom: 1,
        pixelArt: true,
        backgroundColor: '#87ceeb',
        parent : "gameCanvas",  // id do elemento HTML onde o canvas será inserido
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: false
            }
        },
        scene: [MainScene, BiomeScene],
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
        }
    };

const game = new Phaser.Game(config);



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

      sprite.on('pointerover', () => {
          sprite.setTint(0x999999); // muda a cor do sprite

      });

      sprite.on('pointerout', () => {

        sprite.clearTint(); // muda a cor do sprite

      });

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


    if(getItemAmount("plant_essence") > 0){

      showNotification("New Location discovered: Building 1", 2000);
    }else{
      showNotification("You need to find a key to open this door.");
    }


  });
} else {
  console.warn('building1 não encontrado na camada "building".');
}


}