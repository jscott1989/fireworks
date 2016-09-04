/**
 * Set up initial game settings.
 */

 import chrome from '../uis/chrome';

module.exports = {
    create() {
        // Enable physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        if(window.chrome != undefined && window.chrome != null) {
            // Move on to load state
            game.state.start('load');
        } else {
            // We need to show the error to get people to run it in chrome
            chrome.open();
        }
    }
}