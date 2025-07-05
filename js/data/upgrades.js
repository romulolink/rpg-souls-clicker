var upgrades = {
    twoAxes: {
        name: 'Two Axes',
        description: 'Two wood per click.',
        cost: {
            wood: 200,
            stone: 100
        },
        live: false,
        visible: true,
        nextTier: 'fiveAxes'
    },
    fiveAxes: {
        name: 'Five Axes',
        description: 'Five wood per click.',
        cost: {
            wood: 800,
            stone: 400
        },
        live: false,
        visible: false,
        nextTier: 'tenAxes'
    },
    tenAxes: {
        name: 'Ten Axes',
        description: 'Ten wood per click.',
        cost: {
            wood: 2000,
            stone: 1000
        },
        live: false,
        visible: false
    },
    twoPickaxes: {
        name: 'Two Pickaxes',
        description: 'Two stone per click.',
        cost: {
            wood: 100,
            stone: 200
        },
        live: false,
        visible: true,
        nextTier: 'fivePickaxes'
    },
    fivePickaxes: {
        name: 'Five Pickaxes',
        description: 'Five stone per click.',
        cost: {
            wood: 400,
            stone: 800
        },
        live: false,
        visible: false,
        nextTier: 'tenPickaxes'
    },
    tenPickaxes: {
        name: 'Ten Pickaxes',
        description: 'Ten stone per click.',
        cost: {
            wood: 1000,
            stone: 2000
            // bread: 100
        },
        live: false,
        visible: false
    },
    twoArrows: {
        name: 'Two Arrows',
        description: 'Two meat per click.',
        cost: {
            wood: 100,
            stone: 100
        },
        live: false,
        visible: true,
        nextTier: 'fiveArrows'
    },
    fiveArrows: {
        name: 'Five Arrows',
        description: 'Five meat per click.',
        cost: {
            wood: 400,
            stone: 400
        },
        live: false,
        visible: false,
        nextTier: 'tenArrows'
    },
    tenArrows: {
        name: 'Ten Arrows',
        description: 'Ten meat per click.',
        cost: {
            wood: 1000,
            stone: 1000
        },
        live: false,
        visible: false
    },

    biggerTents: {
        name: 'Bigger Tents',
        description: 'Tents built from now on can hold three people.',
        cost: {
            wood: 100,
            stone: 30,
            iron: 20
        },
        live: false,
        visible: true
    }
};
