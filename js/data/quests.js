 var quests = [
      {
        id: "mainQuest1",
        title: "Explore the forest",
        description: "Click in the forest icon, get 10 woods and make your first battle",
        isMainQuest: true,
        sequence: 1,
        isCompleted: false,
        isActive: true,
        conditions: [
          { type: 'collect', item: 'wood', amount: 10 },
          { type: 'defeat', enemy: 'any' }
        ],
        reward: {
          experience: 100,
          gold: 50
        }
      },
      {
        id: "sideQuest1",
        title: "Side Quest 1",
        description: "Collect 10 woods and defeat one enemy.",
        isMainQuest: false,
        sequence: 1,
        isCompleted: false,
        isActive: false,
        conditions: [
          { type: 'collect', item: 'wood', amount: 10 },
          { type: 'defeat', enemy: 'any' }
        ],
        reward: {
          experience: 100,
          gold: 50
        }
      },
      {
        id: "mainQuest2",
        title: "Buy Island",
        description: "Sell 100 woods in the local market from the first Island and buy the island on the right",
        isMainQuest: true,
        sequence: 2,
        isCompleted: false,
        isActive: false,
        conditions: [
          { type: 'sell', item: 'wood', amount: 100 },
          { type: 'buy', item: 'island-14', amount: 1 }
        ],
        reward: {
          experience: 100,
          gold: 50
        }
      },
      {
        id: "mainQuest3",
        title: "Buy Island",
        description: "Collect 30 rune-essences by mining stones in the second island and craft 10 plant runes using rune-essence + plant essence dropped from plant monsters",
        isMainQuest: true,
        sequence: 3,
        isCompleted: false,
        isActive: false,
        conditions: [
          { type: 'collect', item: 'rune_essence', amount: 30 },
          { type: 'collect', item: 'rune_plant', amount: 10 }
        ],
        reward: {
          experience: 100,
          gold: 50
        }
      },
      {
        id: "mainQuest4",
        title: "Plant Lotus Flowers",
        description: "Plant 10 Lotus of Fire using fire lotus seed from the market. They recovery automatically fire monsters life in combat",
        isMainQuest: true,
        sequence:4,
        isCompleted: false,
        isActive: false,
        conditions: [
          { type: 'collect', item: 'fire_lotus', amount: 10 }
        ],
        reward: {
          experience: 100,
          gold: 50
        }
      },
      {
        id: "mainQuest5",
        title: "Capture all monsters",
        description: "Defeat and capture all monsters from Arkcadius",
        isMainQuest: true,
        sequence:5,
        isCompleted: false,
        isActive: false,
        conditions: [
          { type: 'collect', item: 'fire_lotus', amount: 10000000 }
        ],
        reward: {
          experience: 100,
          gold: 50
        }
      },

    ];
