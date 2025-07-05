"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsController = void 0;
class StatsController {
    constructor() {
        this.xpMultiply = 1;
        this.xpFirstLevel = 100;
        this.difficultFactor = 1.5;
        this.statsIncreasePointsBase = 2;
    }
    static get instance() {
        if (StatsController._instance == null) {
            StatsController._instance = new StatsController();
        }
        return StatsController._instance;
    }
    static AddXp(xpAdd) {
        let newXp = (StatsController.GetCurrentXp() + xpAdd) * StatsController.instance.xpMultiply;
        while (newXp >= StatsController.GetNextXp(StatsController.GetCurrentLevel())) {

            newXp -= StatsController.GetNextXp(StatsController.GetCurrentLevel());
            StatsController.instance.CurrentXpUIValue = 0;
            StatsController.AddLevel();
        }
        
        currentMonster.current_xp = newXp;

        StatsController.instance.CurrentXpUIValue = (StatsController.GetCurrentXp() / StatsController.GetNextXp());
    }
    XpToUI() {
        return (currentMonster.level) + "/" + StatsController.GetNextXp();
    }
    static GetCurrentXp() {
        return currentMonster.current_xp;
    }
    static GetCurrentLevel() {
        return currentMonster.level;
    }
    static SetCurrentXp(currentXp, XpUIValue) {
        StatsController._instance.CurrentXP = currentXp;
        StatsController._instance.CurrentXpUIValue = XpUIValue;
    }
    static SetCurrentLevel(currentLevel) {
        StatsController._instance.CurrentLevel = currentLevel;
    }
    static AddLevel() {
        let newLevel = StatsController.GetCurrentLevel() + 1;
        StatsController.IncreaseStats();
        currentMonster.level = newLevel;
        fireworksAnimation();
        playSound('success');
    }
    static IncreaseStats() {
        if (StatsController._instance) {
            // Player.instance.IncreasePoints(StatsController._instance.statsIncreasePointsBase);
            currentMonster.extra_stats.extra_life += 4;
            currentMonster.extra_stats.extra_attack += 2;
        }
        else {
            //  Player.instance.IncreasePoints();
            currentMonster.extra_stats.extra_life += 4;
            currentMonster.extra_stats.extra_attack += 2;
        }
    }
    static GetNextXp(currentLevel) {

      // console.log('GetNextXp: currentLevel:  ' + currentLevel + '    dfcFactor: ' + StatsController.instance.difficultFactor + ' xpFirstLevel :' + StatsController.instance.xpFirstLevel);

        let result = StatsController.instance.xpFirstLevel * (currentLevel + 1) * StatsController.instance.difficultFactor;

        return result;
    }
}
exports.StatsController = StatsController;
