/**
 * Load assets then move to menu state
 */

module.exports = {
    preload() {
        // Show a loading label
        const loadingLabel = game.add.text(80, 150, "Loading...", {"font": "30px Courier", "fill": "#ffffff"})

        // Load assets
        game.load.image("character", "s/assets/character.png");
        game.load.image("tile", "s/assets/tile.png");

        // Maps
        game.load.image('level1-tiles', 's/assets/level1-tiles.png');
        game.load.tilemap('level1', 's/assets/level1.json', null, Phaser.Tilemap.TILED_JSON);
    },

    create() {
        // Move on to menu state
        game.state.start('menu');
    }
}