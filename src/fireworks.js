// Import states
import bootState from './states/boot';
import loadState from './states/load';
import menuState from './states/menu';
import playState from './states/play';

// Set up game area
window.game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

// Set up states
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);


// Start game
game.state.start('boot');