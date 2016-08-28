// Include css
require('../scss/main.scss');

// Import states
import bootState from './states/boot';
import loadState from './states/load';
import menuState from './states/menu';
import playState from './states/play';

document.addEventListener('DOMContentLoaded', () => {
    // Set up game area
    window.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'game');

    // Set up states
    game.state.add('boot', bootState);
    game.state.add('load', loadState);
    game.state.add('menu', menuState);
    game.state.add('play', playState);

    // Start game
    game.state.start('boot');
});
