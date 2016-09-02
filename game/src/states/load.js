/**
 * Load assets then move to menu state
 */

module.exports = {
    preload() {
        // Show a loading label
        const loadingLabel = game.add.text(80, 150, "Loading...", {"font": "30px Courier", "fill": "#ffffff"})

        // Load assets
        game.load.image("interaction", "s/assets/interaction.png");

        // Maps
        game.load.image('level1-tiles', 's/assets/level1-tiles.png');
        game.load.tilemap('level1', 's/assets/level1.json', null, Phaser.Tilemap.TILED_JSON);

        // Spritesheets
        // game.load.spritesheet('baby', 's/assets/baby.png', 64, 64, 2);
        // game.load.spritesheet('walking-baby', 's/assets/walking-baby.png', 64, 74, 6);
        // game.load.spritesheet('child', 's/assets/child.png', 51, 90, 4);
        // game.load.spritesheet('university-student', 's/assets/university-student.png', 64, 128, 4);

    },

    create() {
        // Move on to menu state
        game.state.start('menu');
    }
}