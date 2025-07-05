var buildings = {
    island_1: {
        slug: 'island_1',
        name: 'Island 1',
        description: 'Just like a house but way smaller and made out of fabric.',
        total: 0,
        residents: 1,
        icon_path: 'img/images/IconPack_17.png',
        max: 1,
        places: {
            empty: 1,
            empty: 1,
            empty: 1,
            empty: 1,
        },
        cost: {
            wood: 30
        },
        costIncrease: 1.1
    },
    island_2: {
        slug: 'island_2',
        name: 'Island 2',
        description: 'Just like a tent but way bigger and not made out of fabric.',
        total: 0,
        residents: 4,
        icon_path: 'img/images/IconPack_18.png',
        max: 1,
        places: {
            empty: 1,
            empty: 1,
            empty: 1,
            empty: 1,
        },
        cost: {
            wood: 75,
            stone: 10,
            iron: 10,
            brick: 50
        },
        costIncrease: 1.1
    },
    island_3: {
        slug: 'island_3',
        name: 'Island 3',
        description: 'A bit like a house but not as nice and not as private.',
        total: 0,
        residents: 10,
        icon_path: 'img/images/IconPack_19.png',
        max: 1,
        places: {
            empty: 1,
            empty: 1,
            empty: 1,
            empty: 1,
        },
        cost: {
            wood: 200,
            stone: 30,
            iron: 30,
            brick: 200
        },
        costIncrease: 1.1
    },
    island_4: {
        slug: 'island_4',
        name: 'Island 4',
        description: 'Just like a house but way smaller and made out of fabric.',
        total: 0,
        residents: 1,
        icon_path: 'img/images/IconPack_17.png',
        max: 1,
        places: {
            empty: 1,
            empty: 1,
            empty: 1,
            empty: 1,
        },
        cost: {
            wood: 30
        },
        costIncrease: 1.1
    },
    island_5: {
        slug: 'island_5',
        name: 'Island 5',
        description: 'Just like a tent but way bigger and not made out of fabric.',
        total: 0,
        residents: 4,
        icon_path: 'img/images/IconPack_18.png',
        max: 1,
        places: {
            empty: 1,
            empty: 1,
            empty: 1,
            empty: 1,
        },
        cost: {
            wood: 75,
            stone: 10,
            iron: 10,
            brick: 50
        },
        costIncrease: 1.1
    },
    island_6: {
        slug: 'island_6',
        name: 'Island 6',
        description: 'A bit like a house but not as nice and not as private.',
        total: 0,
        residents: 10,
        icon_path: 'img/images/IconPack_19.png',
        max: 1,
        places: {
            empty: 1,
            empty: 1,
            empty: 1,
            empty: 1,
        },
        cost: {
            wood: 200,
            stone: 30,
            iron: 30,
            brick: 200
        },
        costIncrease: 1.1
    },
    island_7: {
        slug: 'island_7',
        name: 'Island 7',
        description: 'Just like a tent but way bigger and not made out of fabric.',
        total: 0,
        residents: 4,
        icon_path: 'img/images/IconPack_18.png',
        max: 1,
        places: {
            ghost: 1,
            ghost: 1,
            ghost: 1,
            ghost: 1,
        },
        cost: {
            iron: 3000,
            gold: 2000,
            rune_plant: 1000,
            coin: 50000
        },
        costIncrease: 1.1
    },
    island_8: {
        slug: 'island_8',
        name: 'Island 8',
        description: 'A bit like a house but not as nice and not as private.',
        total: 0,
        residents: 10,
        icon_path: 'img/images/IconPack_19.png',
        max: 1,
        places: {
            sacredwaterfall: 1,
            volcano: 1,
            deepforest: 1,
            sacredcave: 1,
        },
        cost: {
            rune_plant: 500,
            rune_earth: 500,
            rune_fire: 500,
            rune_water: 500,
            coin: 15000
        },
        costIncrease: 1.1
    },
    island_9: {
        slug: 'island_9',
        name: 'Island 9',
        description: 'Just like a tent but way bigger and not made out of fabric.',
        total: 0,
        residents: 4,
        icon_path: 'img/images/IconPack_18.png',
        max: 1,
        places: {
            ancient: 1,
            ancient: 1,
            ancient: 1,
            ancient: 1,
        },
        cost: {
            iron: 5000,
            gold: 3000,
            rune_water: 1000,
            coin: 100000
        },
        costIncrease: 1.1
    },
    island_10: {
        slug: 'island_10',
        name: 'Island 10',
        description: 'A bit like a house but not as nice and not as private.',
        total: 0,
        residents: 10,
        icon_path: 'img/images/IconPack_19.png',
        max: 1,
        places: {
            empty: 1,
            empty: 1,
            empty: 1,
            empty: 1,
        },
        cost: {
            wood: 200,
            stone: 30,
            iron: 30,
            brick: 200
        },
        costIncrease: 1.1
    },
    island_11: {
        slug: 'island_11',
        name: 'Island 11',
        description: 'Just like a tent but way bigger and not made out of fabric.',
        total: 0,
        residents: 4,
        icon_path: 'img/images/IconPack_18.png',
        max: 1,
        places: {
            empty: 1,
            empty: 1,
            empty: 1,
            empty: 1,
        },
        cost: {
            wood: 75,
            stone: 10,
            iron: 10,
            brick: 50
        },
        costIncrease: 1.1
    },
    island_12: {
        slug: 'island_12',
        name: 'Island 12',
        description: 'A bit like a house but not as nice and not as private.',
        total: 0,
        residents: 10,
        icon_path: 'img/images/IconPack_19.png',
        max: 1,
        places: {
            icecave: 1,
            market_12: 1,
            icecave: 1,
            icecave: 1,
        },
        cost: {
            stone: 500,
            rune_essence: 100,
            coin: 1000
        },
        costIncrease: 1.1
    },
    island_13: {
        slug: 'island_13',
        name: 'Island 13',
        description: 'Just like a tent but way bigger and not made out of fabric.',
        total: 0,
        residents: 4,
        icon_path: 'img/images/IconPack_18.png',
        max: 1,
        places: {
            empty: 1,
            empty: 1,
            empty: 1,
            empty: 1,
        },
        places: {
            town: 1,
            farming: 1,
            forest: 1,
            market_13: 1

        },
        cost: {
            wood: 75,
            stone: 10,
            iron: 10,
            brick: 50,
            coin: 100
        },
        costIncrease: 1.1
    },
    island_14: {
        slug: 'island_14',
        name: 'Island 14',
        description: 'A bit like a house but not as nice and not as private.',
        total: 0,
        residents: 10,
        icon_path: 'img/images/IconPack_19.png',
        max: 1,
        places: {
            empty: 1,
            empty: 1,
            empty: 1,
            empty: 1,
        },
        places: {
            cave: 1,
            blacksmith: 1,
            market_14: 1,
            museum: 1

        },
        cost: {
            wood: 100,
            coin: 100
        },
        costIncrease: 1.1
    },
    island_15: {
        slug: 'island_15',
        name: 'Island 15',
        description: 'A bit like a house but not as nice and not as private.',
        total: 0,
        residents: 10,
        icon_path: 'img/images/IconPack_19.png',
        max: 1,
        places: {
            elite: 1,
            elite: 1,
            elite: 1,
            elite: 1,
        },
        cost: {
            iron: 15000,
            gold: 7000,
            rune_plant: 1000,
            rune_fire: 1000,
            rune_earth: 1000,
            rune_water: 1000,
            coin: 10000000
        },
        costIncrease: 1.1
    },
    island_16: {
        slug: 'island_16',
        name: 'Island 16',
        description: 'A bit like a house but not as nice and not as private.',
        total: 0,
        residents: 10,
        icon_path: 'img/images/IconPack_19.png',
        max: 1,
        places: {
            empty: 1,
            empty: 1,
            empty: 1,
            empty: 1,
        },
        cost: {
            wood: 200,
            stone: 30,
            iron: 30,
            brick: 200
        },
        costIncrease: 1.1
    },
    island_17: {
        slug: 'island_17',
        name: 'Island 17',
        description: 'A bit like a house but not as nice and not as private.',
        total: 0,
        residents: 10,
        icon_path: 'img/images/IconPack_19.png',
        max: 1,
        places: {
            underworld: 1,
            underworld: 1,
            underworld: 1,
            underworld: 1,
        },
        cost: {
            iron: 7000,
            gold: 3000,
            rune_earth: 1000,
            coin: 500000
        },
        costIncrease: 1.1
    },
    island_18: {
        slug: 'island_18',
        name: 'Island 18',
        description: 'A bit like a house but not as nice and not as private.',
        total: 0,
        residents: 10,
        icon_path: 'img/images/IconPack_19.png',
        max: 1,
        places: {
            firecave: 1,
            firecave: 1,
            firecave: 1,
            firecave: 1,
        },
        cost: {
            iron: 3000,
            gold: 1000,
            rune_essence: 500,
            coin: 5000
        },
        costIncrease: 1.1
    },
    island_19: {
        slug: 'island_19',
        name: 'Island 19',
        description: 'A bit like a house but not as nice and not as private.',
        total: 0,
        residents: 10,
        icon_path: 'img/images/IconPack_19.png',
        max: 1,
        places: {
            skyworld: 1,
            skyworld: 1,
            skyworld: 1,
            skyworld: 1,
        },
        cost: {
            iron: 10000,
            gold: 5000,
            rune_fire: 1000,
            coin: 1000000
        },
        costIncrease: 1.1
    },
    island_20: {
        slug: 'island_20',
        name: 'Island 20',
        description: 'A bit like a house but not as nice and not as private.',
        total: 0,
        residents: 10,
        icon_path: 'img/images/IconPack_19.png',
        max: 1,
        places: {
            empty: 1,
            empty: 1,
            empty: 1,
            empty: 1,
        },
        cost: {
            wood: 200,
            stone: 30,
            iron: 30,
            brick: 200
        },
        costIncrease: 1.1
    },
    island_21: {
        slug: 'island_21',
        name: 'Island 21',
        description: 'A bit like a house but not as nice and not as private.',
        total: 0,
        residents: 10,
        icon_path: 'img/images/IconPack_19.png',
        max: 1,
        places: {
            empty: 1,
            empty: 1,
            empty: 1,
            empty: 1,
        },
        cost: {
            wood: 200,
            stone: 30,
            iron: 30,
            brick: 200
        },
        costIncrease: 1.1
    },
    island_22: {
        slug: 'island_22',
        name: 'Island 22',
        description: 'A bit like a house but not as nice and not as private.',
        total: 0,
        residents: 10,
        icon_path: 'img/images/IconPack_19.png',
        max: 1,
        places: {
            empty: 1,
            empty: 1,
            empty: 1,
            empty: 1,
        },
        cost: {
            wood: 200,
            stone: 30,
            iron: 30,
            brick: 200
        },
        costIncrease: 1.1
    },
    island_23: {
        slug: 'island_23',
        name: 'Island 23',
        description: 'A bit like a house but not as nice and not as private.',
        total: 0,
        residents: 10,
        icon_path: 'img/images/IconPack_19.png',
        max: 1,
        places: {
            empty: 1,
            empty: 1,
            empty: 1,
            empty: 1,
        },
        cost: {
            wood: 200,
            stone: 30,
            iron: 30,
            brick: 200
        },
        costIncrease: 1.1
    },
    island_24: {
        slug: 'island_24',
        name: 'Island 24',
        description: 'A bit like a house but not as nice and not as private.',
        total: 0,
        residents: 10,
        icon_path: 'img/images/IconPack_19.png',
        max: 1,
        places: {
            empty: 1,
            empty: 1,
            empty: 1,
            empty: 1,
        },
        cost: {
            wood: 200,
            stone: 30,
            iron: 30,
            brick: 200
        },
        costIncrease: 1.1
    },
    island_25: {
        slug: 'island_25',
        name: 'Island 25',
        description: 'A bit like a house but not as nice and not as private.',
        total: 0,
        residents: 10,
        icon_path: 'img/images/IconPack_19.png',
        max: 1,
        places: {
            empty: 1,
            empty: 1,
            empty: 1,
            empty: 1,
        },
        cost: {
            wood: 200,
            stone: 30,
            iron: 30,
            brick: 200
        },
        costIncrease: 1.1
    },
    island_26: {
        slug: 'island_26',
        name: 'Island 26',
        description: 'A bit like a house but not as nice and not as private.',
        total: 0,
        residents: 10,
        icon_path: 'img/images/IconPack_19.png',
        max: 1,
        places: {
            empty: 1,
            empty: 1,
            empty: 1,
            empty: 1,
        },
        cost: {
            wood: 200,
            stone: 30,
            iron: 30,
            brick: 200
        },
        costIncrease: 1.1
    },
    island_27: {
        slug: 'island_27',
        name: 'Island 27',
        description: 'A bit like a house but not as nice and not as private.',
        total: 0,
        residents: 10,
        icon_path: 'img/images/IconPack_19.png',
        max: 1,
        places: {
            empty: 1,
            empty: 1,
            empty: 1,
            empty: 1,
        },
        cost: {
            wood: 200,
            stone: 30,
            iron: 30,
            brick: 200
        },
        costIncrease: 1.1
    },
    island_28: {
        slug: 'island_28',
        name: 'Island 28',
        description: 'A bit like a house but not as nice and not as private.',
        total: 0,
        residents: 10,
        icon_path: 'img/images/IconPack_19.png',
        max: 1,
        places: {
            empty: 1,
            empty: 1,
            empty: 1,
            empty: 1,
        },
        cost: {
            wood: 200,
            stone: 30,
            iron: 30,
            brick: 200
        },
        costIncrease: 1.1
    },
    island_29: {
        slug: 'island_29',
        name: 'Island 29',
        description: 'A bit like a house but not as nice and not as private.',
        total: 0,
        residents: 10,
        icon_path: 'img/images/IconPack_19.png',
        max: 1,
        places: {
            empty: 1,
            empty: 1,
            empty: 1,
            empty: 1,
        },
        cost: {
            wood: 200,
            stone: 30,
            iron: 30,
            brick: 200
        },
        costIncrease: 1.1
    },
    island_30: {
        slug: 'island_30',
        name: 'Island 30',
        description: 'A bit like a house but not as nice and not as private.',
        total: 0,
        residents: 10,
        icon_path: 'img/images/IconPack_19.png',
        max: 1,
        places: {
            empty: 1,
            empty: 1,
            empty: 1,
            empty: 1,
        },
        cost: {
            wood: 200,
            stone: 30,
            iron: 30,
            brick: 200
        },
        costIncrease: 1.1
    },
};