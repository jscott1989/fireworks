/**
 * Load assets then move to menu state
 */

module.exports = {
    preload() {
        // Show a loading label
        const loadingLabel = game.add.text(80, 150, "Loading...", {"font": "30px Courier", "fill": "#ffffff"})

        game.load.crossOrigin = "anonymous";

        // Load assets
        game.load.image("interaction", "s/assets/interaction.png");
        game.load.image("school-door", "s/assets/school-door.png");
        game.load.image("house-door", "s/assets/house-door.png");

        // Maps
        game.load.image('level1-tiles', 's/assets/level1-tiles.png');
        game.load.tilemap('level1', 's/assets/level1.json', null, Phaser.Tilemap.TILED_JSON);

        // Spritesheets
        game.load.spritesheet('toybox', 's/assets/toybox.png', 128, 64, 2);
    },

    create() {
        // Move on to menu state
        game.state.start('menu');
    }
}