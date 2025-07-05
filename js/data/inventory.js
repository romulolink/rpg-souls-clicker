var inventory = {

    common_box: {
        slug: 'common_box',
        name: 'Common Box',
        description: 'A box to capture a common monster.',
        total: 0,
        icon_path: 'img/images/common_box.png',
        max: 100,
        cost: {
            coin: 100
        },
        monster_chance: {

            hopslicer: 50,
            spinneret: 50

        }
    },
    rare_box: {
        slug: 'rare_box',
        name: 'Rare Box',
        description: 'A box to capture a rare monster.',
        total: 0,
        icon_path: 'img/images/rare_box.png',
        max: 100,
        cost: {
            coin: 1000
        },
        monster_chance: {

            // Percent
            leafstricke: 50,
            blazercraw: 30,
            ripplebun: 20,
            gloomglop: 20,
            oakheart: 20,


        }
    },
    epic_box: {
        slug: 'epic_box',
        name: 'Epic Box',
        description: 'A box to capture an epic monster.',
        total: 0,
        icon_path: 'img/images/epic_box.png',
        max: 100,
        cost: {
            coin: 5000
        },
        monster_chance: {

            // Percent
            thornshade: 20,
            croakspike: 20,
            venomwing: 20,


        }
    },
    legendary_box: {
        slug: 'legendary_box',
        name: 'Legendary Box',
        description: 'A box to capture a legendary monster.',
        total: 0,
        icon_path: 'img/images/legendary_box.png',
        max: 100,
        cost: {
            coin: 10000
        },
        monster_chance: {
            // Percent
            myst_leaf: 50,

        }
    },
    simple_potion: {
        slug: 'simple_potion',
        name: 'Simple Potion',
        description: 'A simple potion to restore 10 life points from any monster.',
        total: 0,
        icon_path: 'img/images/potion.png',
        max: 100,
        cost: {
            coin: 10
        },
    },
    fire_essence: {
        slug: 'fire_essence',
        name: 'Fire Essence',
        description: 'A fire essence with energy',
        total: 0,
        icon_path: 'img/images/ball-fire.png',
        max: 100,
        cost: {
            coin: 10
        },
    },
    water_essence: {
        slug: 'water_essence',
        name: 'Water Essence',
        description: 'A water essence with energy',
        total: 0,
        icon_path: 'img/images/ball-water.png',
        max: 100,
        cost: {
            coin: 10
        },
    },
    plant_essence: {
        slug: 'plant_essence',
        name: 'Plant Essence',
        description: 'A plant essence with energy',
        total: 0,
        icon_path: 'img/images/ball-plant.png',
        max: 100,
        cost: {
            coin: 10
        },
    },
    earth_essence: {
        slug: 'earth_essence',
        name: 'Earth Essence',
        description: 'An earth essence with energy',
        total: 0,
        icon_path: 'img/images/ball-earth.png',
        max: 100,
        cost: {
            coin: 10
        },
    },
    fire_lotus: {
        slug: 'fire_lotus',
        name: 'Fire lotus',
        description: 'A fire lotus to auto-recover 20hp of fire monsters energy',
        total: 0,
        icon_path: 'img/images/lotus-fire.png',
        max: 100,
        cost: {
            coin: 30
        },
    },
    water_lotus: {
        slug: 'water_lotus',
        name: 'Water lotus',
        description: 'A water lotus to auto-recover 20hp from any water monsters energy',
        total: 0,
        icon_path: 'img/images/lotus-water.png',
        max: 100,
        cost: {
            coin: 30
        },
    },
    plant_lotus: {
        slug: 'plant_lotus',
        name: 'Plant lotus',
        description: 'A plant lotus to auto-recover 20hp from any plant monsters energy',
        total: 0,
        icon_path: 'img/images/lotus-plant.png',
        max: 100,
        cost: {
            coin: 30
        },
    },
    earth_lotus: {
        slug: 'earth_lotus',
        name: 'Earth lotus',
        description: 'A earth lotus to auto-recover 20hp from any earth monsters energy',
        total: 0,
        icon_path: 'img/images/lotus-earth.png',
        max: 100,
        cost: {
            coin: 30
        },
    },
    fire_lotus_seed: {
        slug: 'fire_lotus_seed',
        name: 'Fire lotus seed',
        description: 'A fire lotus seed to plant a fire lots flower',
        total: 0,
        icon_path: 'img/seed_red.png',
        max: 100,
        autoIncrement: 0,
        results: {

            fire_lotus: 1
        },
        cost: {
            coin: 10
        },
    },
    water_lotus_seed: {
        slug: 'water_lotus_seed',
        name: 'Water lotus seed',
        description: 'A water lotus seed to plant a water lotus flower',
        total: 0,
        icon_path: 'img/seed_blue.png',
        max: 100,
        autoIncrement: 0,
        results: {
            water_lotus: 1
        },
        cost: {
            coin: 10
        },
    },
    plant_lotus_seed: {
        slug: 'plant_lotus_seed',
        name: 'Plant lotus seed',
        description: 'A plant lotus seed to plant a lotus plant flower',
        total: 0,
        icon_path: 'img/seed.png',
        max: 100,
        autoIncrement: 0,
        results: {
            plant_lotus: 1
        },
        cost: {
            coin: 10
        },
    },
    earth_lotus_seed: {
        slug: 'earth_lotus_seed',
        name: 'Earth lotus seed',
        description: 'A earth lotus seed to plant a earth lotus flower',
        total: 0,
        icon_path: 'img/seed_orange.png',
        max: 100,
        autoIncrement: 0,
        results: {
            earth_lotus: 1
        },
        cost: {
            coin: 10
        },
    },
    
    super_fire_lotus: {
        slug: 'super_fire_lotus',
        name: 'Super Fire lotus',
        description: 'A super fire lotus to auto-recover 100hp from any fire monsters energy',
        total: 0,
        icon_path: 'img/super-lotus-fire.png',
        max: 100000,
        autoIncrement: 0,
        clickIncrement: 1,
        cost: {
            coin:100,
            fire_lotus: 10
        },
    },
    super_water_lotus: {
        slug: 'super_water_lotus',
        name: 'Super Water lotus',
        description: 'A super water lotus to auto-recover 100hp from any water monsters energy',
        total: 0,
        icon_path: 'img/super-lotus-water.png',
        max: 100000,
        autoIncrement: 0,
        clickIncrement: 1,
        cost: {
            coin:100,
            water_lotus: 10
        },
    },
    super_plant_lotus: {
        slug: 'super_plant_lotus',
        name: 'Super Plant lotus',
        description: 'A super plant lotus to auto-recover 100hp from any plant monsters energy',
        total: 0,
        icon_path: 'img/super-lotus-plant.png',
        max: 100000,
        autoIncrement: 0,
        clickIncrement: 1,
        cost: {
            coin:100,
            plant_lotus: 10
        },
    },
    super_earth_lotus: {
        slug: 'super_earth_lotus',
        name: 'Super Earth lotus',
        description: 'A super earth lotus to auto-recover 100hp from any earth monsters energy',
        total: 0,
        icon_path: 'img/super-lotus-earth.png',
        max: 100000,
        autoIncrement: 0,
        clickIncrement: 1,
        cost: {
            coin:100,
            earth_lotus: 10
        },
    },
    giga_fire_lotus: {
        slug: 'giga_fire_lotus',
        name: 'Giga Fire lotus',
        description: 'A giga fire lotus to auto-recover 300hp from any fire monsters energy',
        total: 0,
        icon_path: 'img/giga-lotus-fire.png',
        max: 100000,
        autoIncrement: 0,
        clickIncrement: 1,
        cost: {
            coin:100,
            super_fire_lotus: 10
        },
    },
    giga_water_lotus: {
        slug: 'giga_water_lotus',
        name: 'Giga Water lotus',
        description: 'A giga water lotus to auto-recover 300hp from any water monsters energy',
        total: 0,
        icon_path: 'img/giga-lotus-water.png',
        max: 100000,
        autoIncrement: 0,
        clickIncrement: 1,
        cost: {
            coin:100,
            super_water_lotus: 10
        },
    },
    giga_plant_lotus: {
        slug: 'giga_plant_lotus',
        name: 'Giga Plant lotus',
        description: 'A giga plant lotus to auto-recover 300hp from any plant monsters energy',
        total: 0,
        icon_path: 'img/giga-lotus-plant.png',
        max: 100000,
        autoIncrement: 0,
        clickIncrement: 1,
        cost: {
            coin:100,
            super_plant_lotus: 10
        },
    },
    giga_earth_lotus: {
        slug: 'giga_earth_lotus',
        name: 'Giga Earth lotus',
        description: 'A giga earth lotus to auto-recover 300hp from any earth monsters energy',
        total: 0,
        icon_path: 'img/giga-lotus-earth.png',
        max: 100000,
        autoIncrement: 0,
        clickIncrement: 1,
        cost: {
            coin:100,
            super_earth_lotus: 10
        },
    },

}    
