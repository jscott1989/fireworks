/**
 * Main Menu
 */

module.exports = {
    create() {
        const nameLabel = game.add.text(80, 80, "Fireworks",
                                        { font: "50px Arial", fill: "#ffffff" });
        const startLabel = game.add.text(80, game.world.height - 80, "Press the 'W' key to start",
                                        { font: "25px Arial", fill: "#ffffff" });

        var wkey = game.input.keyboard.addKey(Phaser.Keyboard.W);

        wkey.onDown.addOnce(this.start, this);
        game.state.start("play");
    },

    start() {
        game.state.start("play");
    }
}