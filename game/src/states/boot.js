/**
 * Set up initial game settings.
 */

module.exports = {
    create() {
        // Enable physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Move on to load state
        game.state.start('load');
    }
}