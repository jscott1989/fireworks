/**
 * Game state
 */
 import audio from "../audio";
 import graphics from "../graphics";
 import drawing from "../uis/drawing";
 import text from "../uis/text";
 import save from "../uis/save";
 import setTileCollision from '../lib/set-tile-collision';

var interactions = {};
var interactionGroup;
var playersGroup;

var walkSpeed = 50;
var jumpHeight = 0;


const spriteChanged = (self, p, oldPlayer) => {
    game.physics.enable(self.player, Phaser.Physics.ARCADE);
    self.player.body.gravity.y = 300;
    if (p["new-sprite"] == "walking-baby") {
        self.player.body.setSize(30, 64, 12, 10);
    } else if (p["new-sprite"] == "child") {
        self.player.body.setSize(30, 80, 12, 10);
    }
    self.player.anchor.setTo(.5, 1);
    oldPlayer.destroy();

    game.camera.follow(self.player);

    walkSpeed = 75;
    jumpHeight = 200;}


const interactionTypes = {
    changeSprite(self, p) {
        var oldPlayer = self.player;
        if (p["new-sprite"] == "walking-baby") {
            self.player = playersGroup.create(oldPlayer.position.x, oldPlayer.position.y, "walking-baby");
            var walk = self.player.animations.add('walk', [0, 1, 2, 3], 4);
            var jump = self.player.animations.add('jump', [4, 5], 4);
            spriteChanged(self, p, oldPlayer);
        } else if (p["new-sprite"] == "child") {
            graphics.createSprite([
                    ['/s/assets/child.png', [[0, 0]]],
                    [data.image.hair, [[0, 0], [51, 0], [102, 0], [153, 0]]]],
                    51, 90, 4, (id) => {
                self.player = playersGroup.create(oldPlayer.position.x, oldPlayer.position.y, id);
                var walk = self.player.animations.add('walk', [0, 1, 2, 3], 4);
                spriteChanged(self, p, oldPlayer);
            });
        } else if (p["new-sprite"] == "university-student") {
            graphics.createSprite([
                    ['/s/assets/university-student.png', [[0, 0]]],
                    [data.image.hair, [[0, 0], [64, 0], [128, 0], [192, 0]]]],
                    64, 128, 4, (id) => {
                self.player = playersGroup.create(oldPlayer.position.x, oldPlayer.position.y, id);
                var walk = self.player.animations.add('walk', [0, 1, 2, 3], 4);
                spriteChanged(self, p, oldPlayer);
            });
        }
    },

    script(self, p) {
        var scripts = JSON.parse(p.script);

        var parseScript = (scripts) => {
            if (scripts.length > 0) {
                var script = scripts.shift();
                if (script.type == "narrate") {
                    audio.narrate(script.data, () => {
                        parseScript(scripts);
                    });
                } else if (script.type == "text") {
                    text.getOrAsk(script.key, script.title, script.instruction, () => {
                        parseScript(scripts);
                    });
                } else if (script.type == "audio") {
                    audio.promptForSound(script.key, script.title, script.instruction, () => {
                        parseScript(scripts);
                    });
                } else if (script.type == "image") {
                    drawing.open(script.key, script.title, script.instruction, script.width, script.height, script.guide, () => {
                        parseScript(scripts);
                    });
                }
            }
        }

        parseScript(scripts);
    },

    save(self, p) {
        save.open(() => {
            console.log("SHOW FINAL SCENE");
        })
    }
}

const interact = (self, i) => {
    const properties = interactions[i.position.x + "," + i.position.y];
    interactionTypes[properties.type](self, properties);
    i.destroy();
}

module.exports = {
    createInteractionPoint(x, y, properties) {
        // Because of the way tiled edits objects - we just knock 64 off the y value
        y -= 64;
        var s = interactionGroup.create(x, y, "interaction");
        game.physics.enable(s, Phaser.Physics.ARCADE);
        interactions[x + "," + y] = properties;
    },

    createObject(obj) {
        if (obj.type == "interaction") {
            this.createInteractionPoint(obj.x, obj.y, obj.properties)
        } else if (obj.type == "player") {
            // Baby
            this.player = playersGroup.create(obj.x + 32, obj.y, "baby");

            var walk = this.player.animations.add('walk');

            game.physics.enable(this.player, Phaser.Physics.ARCADE);
            this.player.body.gravity.y = 300;
            this.player.anchor.setTo(.5, 1);
        }
    },

    create() {
        this.keyboard = game.input.keyboard;
        interactionGroup = game.add.group();

        // this.win = game.add.sprite(256, 256, "tile");
        // game.physics.enable(this.win, Phaser.Physics.ARCADE);

        window.level1 = game.add.tilemap('level1');
        level1.addTilesetImage('level1-tiles', 'level1-tiles');
        graphics.modifyTilesheet([
            [data.image.wallpaper, 64, 0]
        ]);

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

        playersGroup = game.add.group();

        _.each(level1.objects.objects, (obj) => {
            this.createObject(obj);
        });

        const front = level1.createLayer('front');

        game.camera.follow(this.player);

        // Set up special platforms
        setTileCollision(this.level1_level, [137], {top: true, bottom: false, left: false, right: false});
    },

    update() {
        // game.debug.body(this.player);
        game.physics.arcade.collide(this.player, this.level1_level);

        game.physics.arcade.overlap(this.player, interactionGroup, (a, b) => {
            interact(this, b);
        });

        if (this.keyboard.isDown(Phaser.Keyboard.A)) {
            this.player.body.velocity.x = 0 - walkSpeed;
            this.player.scale.x = -1;
            if (this.player.body.onFloor() && !this.player.animations.currentAnim.isPlaying) {
                this.player.animations.play('walk', 4);
            }
        } else if (this.keyboard.isDown(Phaser.Keyboard.D)) {
            this.player.body.velocity.x = walkSpeed;
            this.player.scale.x = 1;
            if (this.player.body.onFloor() && !this.player.animations.currentAnim.isPlaying) {
                this.player.animations.play('walk', 4);
            }
        } else {
            this.player.body.velocity.x = 0;
            this.player.animations.stop();
        }

        if (this.keyboard.isDown(Phaser.Keyboard.W) && this.player.body.onFloor()) {
            // Jump
            if (jumpHeight > 0) {
                this.player.animations.play('jump', 4);
                this.player.body.velocity.y = 0 - jumpHeight;
            }
        }
    }
}