var workers = {
    cut: {
        slug: 'cut',
        name: 'Cut',
        description: 'A strong skill to chop wood automatically.',
        resource: 'wood',
        total: 0,
        icon_path: 'img/cut.png',
        autoIncrement: 1,
        cost: {
            rune_plant: 10
        },
        costIncrease: 1.1
    },
    drill: {
        slug: 'drill',
        name: 'Drill',
        description: 'You can dig a little bit and get ore automatically.',
        resource: 'stone',
        total: 0,
        icon_path: 'img/drill.png',
        autoIncrement: 1,
        cost: {
            rune_earth: 10
        },
        costIncrease: 1.1
    },
    plant: {
        slug: 'plant',
        name: 'Plant',
        description: 'Makes all faming work for you. If you have seeds of course.',
        resource: 'wheat',
        total: 0,
        autoIncrement: 2,
        icon_path: 'img/farm.png',
        cost: {
            rune_plant: 15,
        },
        costIncrease: 1.2
    },
    ironDrill: {
        slug: 'ironDrill',
        name: 'Iron Drill',
        description: 'You can dig deeper and deeper and get ore automatically',
        resource: 'iron',
        total: 0,
        autoIncrement: 1,
        icon_path: 'img/super_drill.png',
        cost: {
            iron: 100
        },
        costIncrease: 1.7
    },
    hammer: {
        slug: 'hammer',
        name: 'Hammer',
        description: 'Smelt golden ore into bars automatically',
        resource: 'goldenBar',
        total: 0,
        autoIncrement: 1,
        icon_path: 'img/hammer.png',
        cost: {
            iron: 100
        },
        costIncrease: 1.1
    },
    mintmaster: {
        slug: 'mintmaster',
        name: 'MintMaster',
        description: 'Produces coin from Golden Bars automatically',
        resource: 'coin',
        total: 0,
        autoIncrement: 1,
        icon_path: 'img/furnace.png',
        cost: {
            gold: 50
        },
        costIncrease: 1.1
    },
    goldDrill: {
        slug: 'goldDrill',
        name: 'Golden Drill',
        description: 'You can dig deeper and deeper and deeper and get gold automatically',
        resource: 'gold',
        total: 0,
        autoIncrement: 1,
        icon_path: 'img/mega_drill.png',
        cost: {
            gold: 100
        },
        costIncrease: 1.3
    },
    fire_lotus_seed_master: {
        slug: 'fire_lotus_seed_master',
        name: 'Fire lotus master',
        description: 'Produces Fire Lotus Seed Automatically',
        resource: 'fire_lotus_seed',
        total: 0,
        autoIncrement: 1,
        icon_path: 'img/seed_red.png',
        cost: {
            fire_lotus: 100
        },
        costIncrease: 2.1
    },
    water_lotus_seed_master: {
        slug: 'water_lotus_seed_master',
        name: 'Water lotus master',
        description: 'Produces Water Lotus Seed Automatically',
        resource: 'water_lotus_seed',
        total: 0,
        autoIncrement: 1,
        icon_path: 'img/seed_blue.png',
        cost: {
            water_lotus: 100
        },
        costIncrease: 2.1
    },
    plant_lotus_seed_master: {
        slug: 'plant_lotus_seed_master',
        name: 'Plant lotus master',
        description: 'Produces Plant Lotus Seed Automatically',
        resource: 'plant_lotus_seed',
        total: 0,
        autoIncrement: 1,
        icon_path: 'img/seed.png',
        cost: {
            plant_lotus: 100
        },
        costIncrease: 2.1
    },
    earth_lotus_seed_master: {
        slug: 'earth_lotus_seed_master',
        name: 'Earth lotus master',
        description: 'Produces Earth Lotus Seed Automatically',
        resource: 'earth_lotus_seed',
        total: 0,
        autoIncrement: 1,
        icon_path: 'img/seed_orange.png',
        cost: {
            earth_lotus: 100
        },
        costIncrease: 2.1
    },
    fire_rune_master: {
        slug: 'fire_rune_master',
        name: 'Fire Rune Master',
        description: 'Produces Fire Rune Automatically',
        resource: 'rune_fire',
        total: 0,
        autoIncrement: 1,
        icon_path: 'img/images/rune-fire.png',
        cost: {
            rune_fire: 100
        },
        costIncrease: 2.1
    },
    water_rune_master: {
        slug: 'water_rune_master',
        name: 'Water Rune Master',
        description: 'Produces Water Rune Automatically',
        resource: 'rune_water',
        total: 0,
        autoIncrement: 1,
        icon_path: 'img/images/rune-water.png',
        cost: {
            rune_water: 100
        },
        costIncrease: 2.1
    },
    plant_rune_master: {
        slug: 'plant_rune_master',
        name: 'Plant Rune Master',
        description: 'Produces Plant Rune Automatically',
        resource: 'rune_plant',
        total: 0,
        autoIncrement: 1,
        icon_path: 'img/images/rune-plant.png',
        cost: {
            rune_plant: 100
        },
        costIncrease: 2.1
    },
    earth_rune_master: {
        slug: 'earth_rune_master',
        name: 'Earth Rune Master',
        description: 'Produces Earth Rune Automatically',
        resource: 'rune_earth',
        total: 0,
        autoIncrement: 1,
        icon_path: 'img/images/rune-earth.png',
        cost: {
            rune_earth: 100
        },
        costIncrease: 2.1
    },
    super_fire_lotus_master: {
        slug: 'super_fire_lotus_master',
        name: 'Super Fire Lotus Master',
        description: 'Produces Super Fire Lotus Automatically',
        resource: 'super_fire_lotus',
        total: 0,
        autoIncrement: 1,
        icon_path: 'img/super-lotus-fire.png',
        cost: {
            super_fire_lotus: 100
        },
        costIncrease: 2.1
    },
    super_water_lotus_master: {
        slug: 'super_water_lotus_master',
        name: 'Super Water Lotus Master',
        description: 'Produces Super Water Lotus Automatically',
        resource: 'super_water_lotus',
        total: 0,
        autoIncrement: 1,
        icon_path: 'img/super-lotus-water.png',
        cost: {
            super_water_lotus: 100
        },
        costIncrease: 2.1
    },
    super_plant_lotus_master: {
        slug: 'super_plant_lotus_master',
        name: 'Super Plant Lotus Master',
        description: 'Produces Super Plant Lotus Automatically',
        resource: 'super_plant_lotus',
        total: 0,
        autoIncrement: 1,
        icon_path: 'img/super-lotus-plant.png',
        cost: {
            super_plant_lotus: 100
        },
        costIncrease: 2.1
    },
    super_earth_lotus_master: {
        slug: 'super_earth_lotus_master',
        name: 'Super Earth Lotus Master',
        description: 'Produces Super Earth Lotus Automatically',
        resource: 'super_earth_lotus',
        total: 0,
        autoIncrement: 1,
        icon_path: 'img/super-lotus-earth.png',
        cost: {
            super_earth_lotus: 100
        },
        costIncrease: 2.1
    },
    giga_fire_lotus_master: {
        slug: 'giga_fire_lotus_master',
        name: 'Giga Fire Lotus Master',
        description: 'Produces Giga Fire Lotus Automatically',
        resource: 'giga_fire_lotus',
        total: 0,
        autoIncrement: 1,
        icon_path: 'img/giga-lotus-fire.png',
        cost: {
            super_fire_lotus: 500
        },
        costIncrease: 2.1
    },
    giga_water_lotus_master: {
        slug: 'giga_water_lotus_master',
        name: 'Giga Water Lotus Master',
        description: 'Produces Giga Water Lotus Automatically',
        resource: 'giga_water_lotus',
        total: 0,
        autoIncrement: 1,
        icon_path: 'img/giga-lotus-water.png',
        cost: {
            super_water_lotus: 500
        },
        costIncrease: 2.1
    },
    giga_plant_lotus_master: {
        slug: 'giga_plant_lotus_master',
        name: 'Giga Plant Lotus Master',
        description: 'Produces Giga Plant Lotus Automatically',
        resource: 'giga_plant_lotus',
        total: 0,
        autoIncrement: 1,
        icon_path: 'img/giga-lotus-plant.png',
        cost: {
            super_plant_lotus: 500
        },
        costIncrease: 2.1
    },
    giga_earth_lotus_master: {
        slug: 'giga_earth_lotus_master',
        name: 'Giga Earth Lotus Master',
        description: 'Produces Giga Earth Lotus Automatically',
        resource: 'giga_earth_lotus',
        total: 0,
        autoIncrement: 1,
        icon_path: 'img/giga-lotus-earth.png',
        cost: {
            super_earth_lotus: 500
        },
        costIncrease: 2.1
    },
    
};
