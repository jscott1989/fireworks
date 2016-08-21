/**
 * Game state
 */

module.exports = {
    create() {
        this.keyboard = game.input.keyboard;

        // this.win = game.add.sprite(256, 256, "tile");
        // game.physics.enable(this.win, Phaser.Physics.ARCADE);

        const level1 = game.add.tilemap('level1');
        level1.addTilesetImage('level1-tiles', 'level1-tiles');

        const farLayer = level1.createLayer('far');
        farLayer.resizeWorld();
        farLayer.scrollFactorX = 0.5;

        const nearLayer = level1.createLayer('near');

        // nearLayer.scrollFactorX = 0.8;

        this.level1_level = level1.createLayer('level1');
        level1.setCollisionByExclusion([], true, 'level1');
        game.physics.enable(this.level1_level, Phaser.Physics.ARCADE);

        this.player = game.add.sprite(16, 16, "character");
        game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.gravity.y = 300;

        this.player.body.collideWorldBounds = true;

        game.camera.follow(this.player);
    },

    update() {
        game.physics.arcade.collide(this.player, this.level1_level);
        // game.physics.arcade.overlap(this.player, this.win, () => {
        //     console.log("WIN");
        // }, null, this);

        if (this.keyboard.isDown(Phaser.Keyboard.A)) {
            this.player.body.velocity.x = -175;
        } else if (this.keyboard.isDown(Phaser.Keyboard.D)) {
            this.player.body.velocity.x = 175;
        } else {
            this.player.body.velocity.x = 0;
        }

        if (this.keyboard.isDown(Phaser.Keyboard.W) && this.player.body.onFloor()) {
            this.player.body.velocity.y = -250;
            // jumpTimer = game.time.now + 750;
        }
    }
}