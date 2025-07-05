var timer = 10;
var lastSave;

var meta = {
    devmode: false,
    versionNumber: 'v1.1.22',
    fps: 1000/120, // 60 Frame per second,
    tick: 1000,
    saveGameInterval: 30000,
    maxPopulation: 0,
    population: 0,
    startPlayingTime: new Date('0000-00-01T00:00:00').getTime(),
    isMute: false
};

const versionNumber = meta.versionNumber;