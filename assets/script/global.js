window.g_dhiveClient = null;
window.g_steemLoaded = false;
window.g_axiosLoaded = false;

window.g_resourceLoaded = false;
window.g_assets = {};

window.g_hiveVerified = false;
window.g_nftList = [
    {type: 0, edition: 0, foil: 0},
    {type: 1, edition: 0, foil: 0},
    {type: 2, edition: 0, foil: 0},
    {type: 3, edition: 0, foil: 0},
    {type: 4, edition: 0, foil: 0},
    {type: 5, edition: 0, foil: 0},
    {type: 6, edition: 0, foil: 0},
    {type: 24, edition: 1, foil: 0}
];
window.g_nftsObj = {};
window.g_loadCompleted = false;

window.g_window_resize_slot = null;

window.g_wooAudioID = -1;
window.g_wooTime = 0;

window.g_character = [];
window.g_wrestlers = [];

window.g_rank = 0;
window.g_winner = {};

window.g_speedUp = false;
window.g_skip = false;
/*
foils: {
    regular: silver,
    gold: gold
}
rarity: {
    common: gray,
    rare: blue,
    epic: purple,
    legendary: yellow
}
teams: {
    male,
    female,
    tag team,
    manager
}

"properties": {
    "edition": 0,
    "foil": 0,
    "type": 0
}
*/

window.g_nftTypes = {
    "0": "Arty",
    "1": "Titan",
    "2": "Ryker",
    "3": "Billy",
    "4": "Enrique",
    "5": "Chase",
    "6": "Mad Mike",
    "24": "Perry Saturn",

    "Arty": 0,
    "Billy": 3,
    "Chase": 5,
    "Enrique": 4,
    "Mad Mike": 6,
    "Perry Saturn": 24,
    "Raven": -1,
    "Ryker":2,
    "Titan": 1
};

window.g_elimination_order = [];
window.g_character_stats = [
    {
        name: "Arty", 
        cost: 5, 
        health: 6, 
        damage: 1, 
        speed: 3, 
        style: 'highflying',
        move1: 'norm', 
        move2: 'norm', 
        move3: 'fin',
        rarity: 'gray',
        foils: 'silver'
    },
    {
        name: "Billy", 
        cost: 6, 
        health: 5, 
        damage: 1, 
        speed: 6, 
        style: 'highflying',
        move1: 'norm', 
        move2: 'norm', 
        move3: 'fin',
        rarity: 'blue',
        foils: 'silver'
    },
    {
        name: "Chase", 
        cost: 8, 
        health: 10, 
        damage: 1, 
        speed: 3, 
        style: 'power',
        move1: 'norm', 
        move2: 'sub', 
        move3: 'fin',
        rarity: 'purple',
        foils: 'silver'
    },
    {
        name: "Enrique", 
        cost: 7, 
        health: 8, 
        damage: 1, 
        speed: 3, 
        style: 'tech',
        move1: 'norm', 
        move2: 'norm', 
        move3: 'fin',
        rarity: 'blue',
        foils: 'silver'
    },
    {
        name: "Mad Mike", 
        cost: 7, 
        health: 8, 
        damage: 2, 
        speed: 4, 
        style: 'tech',
        move1: 'norm', 
        move2: 'norm', 
        move3: 'fin',
        rarity: 'yellow',
        foils: 'silver'
    },
    {
        name: "Perry Saturn", 
        cost: 6, 
        health: 8, 
        damage: 1, 
        speed: 3, 
        style: 'tech',
        move1: 'norm', 
        move2: 'norm', 
        move3: 'fin',
        rarity: 'yellow',
        foils: 'silver'
    },
    {
        name: "Raven", 
        cost: 8, 
        health: 9, 
        damage: 2, 
        speed: 2, 
        style: 'power',
        move1: 'norm', 
        move2: 'norm', 
        move3: 'fin',
        rarity: 'yellow',
        foils: 'silver'
    },
    {
        name: "Ryker", 
        cost: 6, 
        health: 5, 
        damage: 1, 
        speed: 3, 
        style: 'tech',
        move1: 'norm', 
        move2: 'sub', 
        move3: 'fin' ,
        rarity: 'gray',
        foils: 'silver'
    },
    {
        name: "Titan",
        cost: 10,
        health: 10,
        damage: 1,
        speed: 1,
        style: 'power',
        move1: 'norm',
        move2: 'sub',
        move3: 'fin',
        rarity: 'gray',
        foils: 'silver'
    }
]
window.g_wrestling_roster = {
    "Arty": {
      name: "Arty", 
      cost: 5, 
      health: 6, 
      damage: 1, 
      speed: 3, 
      style: 'highflying',
      move1: 'norm', 
      move2: 'norm', 
      move3: 'fin'
    },
    "Billy": {
      name: "Billy", 
      cost: 6, 
      health: 5, 
      damage: 1, 
      speed: 6, 
      style: 'highflying',
      move1: 'norm', 
      move2: 'norm', 
      move3: 'fin'
    },
      "Chase": {
          name: "Chase", 
          cost: 8, 
          health: 10, 
          damage: 1, 
          speed: 3, 
      style: 'power',
          move1: 'norm', 
          move2: 'sub', 
          move3: 'fin'
    },
    "Enrique": {
      name: "Enrique", 
      cost: 7, 
      health: 8, 
      damage: 1, 
      speed: 3, 
      style: 'tech',
      move1: 'norm', 
      move2: 'norm', 
      move3: 'fin'
    },
    "Mad Mike": {
      name: "Mad Mike", 
      cost: 7, 
      health: 8, 
      damage: 2, 
      speed: 4, 
      style: 'tech',
      move1: 'norm', 
      move2: 'norm', 
      move3: 'fin'
    },
    "Perry Saturn": {
      name: "Perry Saturn", 
      cost: 6, 
      health: 8, 
      damage: 1, 
      speed: 3, 
      style: 'tech',
      move1: 'norm', 
      move2: 'norm', 
      move3: 'fin'
    },
    "Raven": {
      name: "Raven", 
      cost: 8, 
      health: 9, 
      damage: 2, 
      speed: 2, 
      style: 'power',
      move1: 'norm', 
      move2: 'norm', 
      move3: 'fin'
    },
    "Ryker": {
      name: "Ryker", 
      cost: 6, 
      health: 5, 
      damage: 1, 
      speed: 3, 
      style: 'tech',
      move1: 'norm', 
      move2: 'sub', 
      move3: 'fin'
    },
    "Titan": {
          name: "Titan",
          cost: 10,
          health: 10,
          damage: 1,
          speed: 1,
      style: 'power',
          move1: 'norm',
          move2: 'sub',
          move3: 'fin'
      }
};

window.g_wrestling_api_attack = function (p1, p2) {
    let firstPlayer = p1;
    let secondPlayer = p2;
    let evaCheck;
    if (secondPlayer.speed > firstPlayer.speed) {
        evaCheck = 100 - 10 * (secondPlayer.speed - firstPlayer.speed);
    } else {
        evaCheck = 100;
    }
    let evaRoll = Math.floor(Math.random() * 100);
    if (evaRoll >= evaCheck) {
        return {connected: false};
    } else {
        let finalDamage;
        if (g_wrestling_api_resists(secondPlayer.style, firstPlayer.style)) {
            finalDamage = Math.ceil(firstPlayer.damage / 2.0);
        } else {
            finalDamage = firstPlayer.damage;
        }
        if (secondPlayer.health >= finalDamage) {
            secondPlayer.health -= finalDamage;
        } else {
            secondPlayer.health = 0;
        }
        return {connected: true, damage: finalDamage};
    }
};
  
window.g_wrestling_api_resists = function (style1, style2) {
    if (style1 === 'tech') {
        return style2 === 'highflying';
    } else if (style1 === 'highflying') {
        return style2 === 'power';
    } else if (style1 === 'power') {
        return style2 === 'tech';
    }
    return false;
}