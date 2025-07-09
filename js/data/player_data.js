var myMonstersData = [];
var myClassData = [];
var currentMonster;
var currentMonsterObj;
var terrainSlots = 0;
var islandsEnabled = [];
var timePlayed = 0;
var inventorySlots = 14;
var slotCounter = 0;
var deathsCounter = 0;
var defeatedEnemiesData = [];
var soldItems = [];
var boughtItems = [];
var questsData = [];

var player_data = {
        
        level: 1,
        current_xp: 0,
        playerImg: '/img/player.png',
        current_monster_slug:' ',
        townName: ' ',
        mayorName: ' ',
        current_life: 90,
        basic_stats: {
                strength: 10,
                life: 90,
                vigor: 1,
                dexterity: 10,
                intelligence: 10,
                luck: 10,              
        },
}