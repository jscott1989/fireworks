/**
 * Game state
 */
 import audio from "../audio";
 import drawing from "../uis/drawing";
 import text from "../uis/text";

module.exports = {
    create() {
        this.keyboard = game.input.keyboard;

        // this.win = game.add.sprite(256, 256, "tile");
        // game.physics.enable(this.win, Phaser.Physics.ARCADE);

        const level1 = game.add.tilemap('level1');
        level1.addTilesetImage('level1-tiles', 'level1-tiles');

        const far1Layer = level1.createLayer('far1');
        far1Layer.resizeWorld();
        far1Layer.scrollFactorX = 0.5;
        far1Layer.scrollFactorY = 0.9;

        const far2Layer = level1.createLayer('far2');
        far2Layer.scrollFactorX = 0.5;
        far2Layer.scrollFactorY = 0.9;

        const near1Layer = level1.createLayer('near1');
        const near2Layer = level1.createLayer('near2');

        // nearLayer.scrollFactorX = 0.8;

        this.level1_level = level1.createLayer('level1');
        level1.setCollisionByExclusion([], true, 'level1');
        game.physics.enable(this.level1_level, Phaser.Physics.ARCADE);

        this.level2_level = level1.createLayer('level2');

        this.player = game.add.sprite(16, 396, "character");
        game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.gravity.y = 300;

        const front = level1.createLayer('front');

        game.camera.follow(this.player);
    },

    update() {
        game.physics.arcade.collide(this.player, this.level1_level);

        if (this.keyboard.isDown(Phaser.Keyboard.A)) {
            this.player.body.velocity.x = -175;
        } else if (this.keyboard.isDown(Phaser.Keyboard.D)) {
            this.player.body.velocity.x = 175;
        } else {
            this.player.body.velocity.x = 0;
        }

        if (this.keyboard.isDown(Phaser.Keyboard.W) && this.player.body.onFloor()) {
            // Jump
            this.player.body.velocity.y = -250;
            audio.playOriginal("jump");
            // drawing.open(32, 16, null, (url) => {
            //     console.log("Got", url);
            // });
            // audio.narrate([
            //     ["Hello", []],
            //     ["1", []],
            //     ["2", []],
            // ]);

            // text.getOrAsk("babyname", "Baby Name", "What is the name of your baby?", (babyname) => {
            //     console.log(babyname);
            // });
        }
    }
}