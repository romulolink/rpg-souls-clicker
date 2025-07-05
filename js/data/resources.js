const PLACE_IDS = {
  FOREST: 1,                            // 1
  CAVE: 1 << 1,                         // 2
  FARM: 1 | (1 << 1),                   // 3
  CITY: 1 << 2,                         // 4
  INVENTORY: 1 | (1 << 2),              // 5
  RIVER: (1 << 2) | (1 << 1) | (1 << 0),  // 6
  CAVE2: 1 | (1 << 2) | (1 << 1) | 1,   // 7
  MOUNTAIN: 1 << 3,                     // 8
  DESERT: 1 | (1 << 3),                 // 9 
};


var resource = {
    wood: {
        slug: 'wood',
        name: 'Wood',
        description: 'Brown stuff that grows on trees.',
        action: 'Chop',
        total: 0,
        clickIncrement: 1,
        autoIncrement: 0,
        chanceIncrement: 1,
        icon_path: 'img/images/IconPack_01.png',
        icon_resource: 'img/images/IconPack_11.png',
        max: 500,
        places: [
            1,
            5,
        ],
        storage: {
            total: 1,
            max: 500,
            cost: {
                wood: 50,
                stone: 50
            },
            costIncrease: 1.01
        }
    },
    stone: {
        slug: 'stone',
        name: 'Stone',
        description: 'Hard stuff.',
        action: 'Mine',
        total: 0,
        clickIncrement: 1,
        autoIncrement: 0,
        chanceIncrement: 1,
        icon_path: 'img/images/IconPack_10.png',
        icon_resource: 'img/images/IconPack_10.png',
        max: 500,
        places: [
            2,
            5,
        ],
        storage: {
            total: 1,
            max: 500,
            cost: {
                wood: 50,
                stone: 50
            },
            costIncrease: 1.01
        },
        chance: {
            // Percent
            rune_essence: 30,
        }
    },
    brick: {
        slug: 'brick',
        name: 'Brick',
        description: 'Like rocks but square.',
        action: 'Make',
        total: 0,
        clickIncrement: 1,
        icon_path: 'img/images/IconPack_05.png',
        icon_resource: 'img/images/IconPack_05.png',
        autoIncrement: 0,
        max: 500,
        places: [
            4,
            5,
        ],
        cost: {
            stone: 2
        },
        storage: {
            total: 1,
            max: 100,
            cost: {
                wood: 100
            },
            costIncrease: 1.01
        }
    },
    iron: {
        slug: 'iron',
        name: 'Iron',
        description: 'Even harder stuff. Bit rusty.',
        total: 0,
        action: 'Mine',
        clickIncrement: 1,
        autoIncrement: 0,
        chanceIncrement: 1,
        max: 500,
        places: [
            2,
            5,
        ],
        icon_path: 'img/images/IconPack_02.png',
        icon_resource: 'img/images/iron-ore.png',
        storage: {
            total: 1,
            max: 100,
            cost: {
                wood: 100,
                stone: 100
            },
            costIncrease: 1.01
        }
    },
    silver: {
        slug: 'silver',
        name: 'Silver',
        description: 'Shiney...',
        total: 0,
        action: 'Mine',
        clickIncrement: 1,
        autoIncrement: 0,
        chanceIncrement: 1,
        max: 500,
        places: [
            7,
            5,
        ],
        icon_path: 'img/images/IconPack_03.png',
        icon_resource: 'img/images/silver-ore.png',
        storage: {
            total: 1,
            max: 100,
            cost: {
                wood: 300,
                iron: 500,
                gold: 10
            },
            costIncrease: 1.2
        }
    },
    gold: {
        slug: 'gold',
        name: 'Gold',
        description: 'Fancy!',
        total: 0,
        action: 'Mine',
        clickIncrement: 1,
        autoIncrement: 0,
        chanceIncrement: 1,
        max: 1000,
        places: [
            7,
            5,
        ],
        icon_path: 'img/images/IconPack_04.png',
        icon_resource: 'img/images/golden-ore.png',
        storage: {
            total: 1,
            max: 3000,
            cost: {
                wood: 350,
                iron: 600,
                gold: 20
            },
            costIncrease: 1.3
        }
    },
    rune_essence: {
        slug: 'rune_essence',
        name: 'Rune Essence',
        description: 'A stone with a hidden power!',
        total: 0,
        autoIncrement: 0,
        chanceIncrement: 1,
        max: 500,
        places: [
            2,
            5,
        ],
        icon_path: 'img/images/rune-essence.png',
        icon_resource: 'img/images/rune-essence.png',
        storage: {
            total: 1,
            max: 100,
            cost: {
                wood: 350,
                iron: 200,
                gold: 200
            },
            costIncrease: 1.3
        }
    },
    rune_fire: {
        slug: 'rune_fire',
        name: 'Fire Rune',
        description: 'A rune with power of fire.',
        action: 'Craft',
        total: 0,
        clickIncrement: 1,
        icon_path: 'img/images/rune-fire.png',
        icon_resource: 'img/images/rune-fire.png',
        autoIncrement: 0,
        max: 500,
        places: [
            4,
            5,
        ],
        cost: {
            rune_essence: 1,
            fire_essence: 1
        },
        storage: {
            total: 1,
            max: 100,
            cost: {
                wood: 100
            },
            costIncrease: 1.1
        }
    },
    rune_plant: {
        slug: 'rune_plant',
        name: 'Plant Rune',
        description: 'A rune with power of plant.',
        action: 'Craft',
        total: 0,
        clickIncrement: 1,
        icon_path: 'img/images/rune-plant.png',
        icon_resource: 'img/images/rune-plant.png',
        autoIncrement: 0,
        max: 500,
        places: [
            4,
            5,
        ],
        cost: {
            rune_essence: 1,
            plant_essence: 1
        },
        storage: {
            total: 1,
            max: 100,
            cost: {
                wood: 100
            },
            costIncrease: 1.1
        }
    },
     rune_earth: {
        slug: 'rune_earth',
        name: 'Earth Rune',
        description: 'A rune with power of Earth.',
        action: 'Craft',
        total: 0,
        clickIncrement: 1,
        icon_path: 'img/images/rune-earth.png',
        icon_resource: 'img/images/rune-earth.png',
        autoIncrement: 0,
        max: 500,
        places: [
            4,
            5,
        ],
        cost: {
            rune_essence: 1,
            earth_essence: 1
        },
        storage: {
            total: 1,
            max: 100,
            cost: {
                wood: 100
            },
            costIncrease: 1.1
        }
    },
    rune_water: {
        slug: 'rune_water',
        name: 'Water Rune',
        description: 'A rune with power of Water.',
        action: 'Craft',
        total: 0,
        clickIncrement: 1,
        icon_path: 'img/images/rune-water.png',
        icon_resource: 'img/images/rune-water.png',
        autoIncrement: 0,
        max: 500,
        places: [
            4,
            5,
        ],
        cost: {
            rune_essence: 1,
            water_essence: 1
        },
        storage: {
            total: 1,
            max: 100,
            cost: {
                wood: 100
            },
            costIncrease: 1.1
        }
    },              
    goldenBar: {
        slug: 'goldenBar',
        name: 'Golden Bar',
        description: 'a golden bar',
        action: 'Smelt',
        total: 0,
        places: [
            4,
            5,
        ],
        clickIncrement: 1,
        icon_path: 'img/images/IconPack_25.png',
        icon_resource: 'img/images/IconPack_25.png',
        autoIncrement: 0,
        max: 500,
        cost: {
            gold: 4,
        },
        storage: {
            total: 1,
            max: 100,
            cost: {
                wood: 50,
                stone: 50
            },
            costIncrease: 1.1
        }
    },
    coin: {
        slug: 'coin',
        name: 'Coin',
        description: 'a coin',
        action: 'Craft',
        total: 0,
        place: 4,
        clickIncrement: 1,
        icon_path: 'img/images/IconPack_26.png',
        icon_resource: 'img/images/IconPack_26.png',
        autoIncrement: 0,
        max: 10000,
        cost: {
            goldenBar: 1,
        },
        storage: {
            total: 1,
            max: 10000,
            cost: {
                wood: 50,
                stone: 50
            },
            costIncrease: 1.1
        }
    },


};