/**
 * Game state
 */
 import audio from "../audio";
 import graphics from "../graphics";
 import drawing from "../uis/drawing";
 import text from "../uis/text";
 import save from "../uis/save";
 import colour from "../uis/colour";
 import setTileCollision from '../lib/set-tile-collision';
 import _ from 'lodash';

var interactions = {};
var interactionGroup;
var playersGroup;

var walkSpeed = 50;
var jumpHeight = 0;

var skinColor = _.sample(["#8d5524", "#c68642", "#e0ac69", "#f1c27d", "#ffdbac"]);
var eyeColor = _.sample(["#1907ba", "#776536", "#76c4ae", "#6ca580"]);
var clothesColor = _.sample(["#2BACBB", "#E4266F", "#151928", "#E2BC03", "#89B8FF"]);
// var eyeNumber =  _.random(0, 2);
// var earNumber =  _.random(0, 2);
// var noseNumber =  _.random(0, 2);
// var mouthNumber =  _.random(0, 2);
// var accessoriesNumber = _.random(0, 2);

var eyeNumber = 0;
var earNumber = 0;
var noseNumber = 0;
var mouthNumber = 0;
var accessoriesNumber = 0;

const spriteChanged = (self, p, oldPlayer) => {
    game.physics.enable(self.player, Phaser.Physics.ARCADE);
    self.player.body.gravity.y = 300;
    if (p["new-sprite"] == "walking-baby") {
        self.player.body.setSize(30, 64, 12, 10);
        walkSpeed = 75;
        jumpHeight = 200;
    } else if (p["new-sprite"] == "child") {
        self.player.body.setSize(30, 80, 12, 10);
    } else if (p["new-sprite"] == "old") {
        walkSpeed = 50;
        jumpHeight = 0;
    }
    self.player.anchor.setTo(.5, 1);
    oldPlayer.destroy();

    game.camera.follow(self.player);
}


const interactionTypes = {
    changeSprite(self, p) {
        var oldPlayer = self.player;
        if (p["new-sprite"] == "walking-baby") {
            graphics.createSprite([
                    ['/s/assets/walking-baby.png', [[0, 0]]],
                    ['/s/assets/walking-baby-features.png', [
                        // Eyes
                        [0, 0, eyeNumber * 47, 0, 47, 36],
                        [48, -1, eyeNumber * 47, 0, 47, 36],
                        [94, 0, eyeNumber * 47, 0, 47, 36],
                        [142, -1, eyeNumber * 47, 0, 47, 36],

                        // Jumping Eyes
                        [187, 1, eyeNumber * 47, 36, 47, 36],
                        [235, 0, eyeNumber * 47, 36, 47, 36],

                        // Ear
                        [0, 0, earNumber * 47, 72, 47, 36],
                        [48, -1, earNumber * 47, 72, 47, 36],
                        [94, 0, earNumber * 47, 72, 47, 36],
                        [142, -1, earNumber * 47, 72, 47, 36],
                        [188, 0, earNumber * 47, 72, 47, 36],
                        [236, -1, earNumber * 47, 72, 47, 36],

                        // Nose
                        [0, 0, noseNumber * 47, 108, 47, 36],
                        [48, -1, noseNumber * 47, 108, 47, 36],
                        [94, 0, noseNumber * 47, 108, 47, 36],
                        [142, -1, noseNumber * 47, 108, 47, 36],
                        [188, 0, noseNumber * 47, 108, 47, 36],
                        [236, -1, noseNumber * 47, 108, 47, 36],

                        // Mouth
                        [0, 0, mouthNumber * 47, 144, 47, 36],
                        [48, -1, mouthNumber * 47, 144, 47, 36],
                        [94, 0, mouthNumber * 47, 144, 47, 36],
                        [142, -1, mouthNumber * 47, 144, 47, 36],

                        // Jumping Mouth
                        [187, 1, mouthNumber * 47, 180, 47, 36],
                        [235, 0, mouthNumber * 47, 180, 47, 36],

                        // Accessories
                        [0, 0, accessoriesNumber * 47, 216, 47, 36],
                        [48, -1, accessoriesNumber * 47, 216, 47, 36],
                        [94, 0, accessoriesNumber * 47, 216, 47, 36],
                        [142, -1, accessoriesNumber * 47, 216, 47, 36],
                        [188, 0, accessoriesNumber * 47, 216, 47, 36],
                        [236, -1, accessoriesNumber * 47, 216, 47, 36],

                    ]]
                    ],
                    [
                        ["#FF0000", skinColor],
                        ["#00FF00", eyeColor],
                        ["#FF0066", clothesColor],
                        ["#FFFF00", graphics.shadeColor(clothesColor, -0.5)],
                    ],
                    [],
                    47, 74, 6, (id) => {
                self.player = playersGroup.create(oldPlayer.position.x, oldPlayer.position.y, id);
                var walk = self.player.animations.add('walk', [0, 1, 2, 3], 4);
                var jump = self.player.animations.add('jump', [4, 5], 4);
                spriteChanged(self, p, oldPlayer);
            });
        } else if (p["new-sprite"] == "child") {
            graphics.createSprite([
                    ['/s/assets/child.png', [[0, 0]]],
                    ['/s/assets/child-features.png', [
                        // Eyes
                        [0, 0, eyeNumber * 51, 0, 51, 45],
                        [51, 0, eyeNumber * 51, 0, 51, 45],
                        [102, 0, eyeNumber * 51, 0, 51, 45],
                        [153, 0, eyeNumber * 51, 0, 51, 45],

                        // Ear
                        [0, 0, earNumber * 51, 45, 51, 45],
                        [51, 0, earNumber * 51, 45, 51, 45],
                        [102, 0, earNumber * 51, 45, 51, 45],
                        [153, 0, earNumber * 51, 45, 51, 45],

                        // Nose
                        [0, 0, noseNumber * 51, 90, 51, 45],
                        [51, 0, noseNumber * 51, 90, 51, 45],
                        [102, 0, noseNumber * 51, 90, 51, 45],
                        [153, 0, noseNumber * 51, 90, 51, 45],

                        // Mouth
                        [0, 0, mouthNumber * 51, 135, 51, 45],
                        [51, 0, mouthNumber * 51, 135, 51, 45],
                        [102, 0, mouthNumber * 51, 135, 51, 45],
                        [153, 0, mouthNumber * 51, 135, 51, 45],

                        // Accessories
                        [0, 0, accessoriesNumber * 51, 180, 51, 45],
                        [51, 0, accessoriesNumber * 51, 180, 51, 45],
                        [102, 0, accessoriesNumber * 51, 180, 51, 45],
                        [153, 0, accessoriesNumber * 51, 180, 51, 45],
                    ]]
                    ],
                    [
                        ["#FF0000", skinColor],
                        ["#00FF00", eyeColor]
                    ],
                    [["<%hair%>", [[0, 0], [51, 0], [102, 0], [153, 0]]]],
                    51, 90, 4, (id) => {
                self.player = playersGroup.create(oldPlayer.position.x, oldPlayer.position.y, id);
                var walk = self.player.animations.add('walk', [0, 1, 2, 3], 4);
                spriteChanged(self, p, oldPlayer);
            });
        } else if (p["new-sprite"] == "school-student") {
            graphics.createSprite([
                    ['/s/assets/school-student.png', [[0, 0]]],
                    ['/s/assets/child-features.png', [
                        // Eyes
                        [0, 0, eyeNumber * 51, 0, 51, 45],
                        [51, 0, eyeNumber * 51, 0, 51, 45],
                        [102, 0, eyeNumber * 51, 0, 51, 45],
                        [153, 0, eyeNumber * 51, 0, 51, 45],

                        // Ear
                        [0, 0, earNumber * 51, 45, 51, 45],
                        [51, 0, earNumber * 51, 45, 51, 45],
                        [102, 0, earNumber * 51, 45, 51, 45],
                        [153, 0, earNumber * 51, 45, 51, 45],

                        // Nose
                        [0, 0, noseNumber * 51, 90, 51, 45],
                        [51, 0, noseNumber * 51, 90, 51, 45],
                        [102, 0, noseNumber * 51, 90, 51, 45],
                        [153, 0, noseNumber * 51, 90, 51, 45],

                        // Mouth
                        [0, 0, mouthNumber * 51, 135, 51, 45],
                        [51, 0, mouthNumber * 51, 135, 51, 45],
                        [102, 0, mouthNumber * 51, 135, 51, 45],
                        [153, 0, mouthNumber * 51, 135, 51, 45],

                        // Accessories
                        [0, 0, accessoriesNumber * 51, 180, 51, 45],
                        [51, 0, accessoriesNumber * 51, 180, 51, 45],
                        [102, 0, accessoriesNumber * 51, 180, 51, 45],
                        [153, 0, accessoriesNumber * 51, 180, 51, 45],
                    ]]
                    ],
                    [
                        ["#FF0000", skinColor],
                        ["#00FF00", eyeColor]
                    ],
                    [["<%hair%>", [[0, 0], [51, 0], [102, 0], [153, 0]]]],
                    51, 90, 4, (id) => {
                self.player = playersGroup.create(oldPlayer.position.x, oldPlayer.position.y, id);
                var walk = self.player.animations.add('walk', [0, 1, 2, 3], 4);
                spriteChanged(self, p, oldPlayer);
            });
        } else if (p["new-sprite"] == "university-student") {
            graphics.createSprite([
                    ['/s/assets/university-student.png', [[0, 0]]],
                    ['/s/assets/university-student-features.png', [
                        // Eyes
                        [0, 0, eyeNumber * 64, 0, 64, 53],
                        [64, 0, eyeNumber * 64, 0, 64, 53],
                        [128, 0, eyeNumber * 64, 0, 64, 53],
                        [192, 0, eyeNumber * 64, 0, 64, 53],
                        [256, 0, eyeNumber * 64, 0, 64, 53],
                        [320, 0, eyeNumber * 64, 0, 64, 53],
                        

                        // Ear
                        [0, 0, earNumber * 64, 53, 64, 53],
                        [64, 0, earNumber * 64, 53, 64, 53],
                        [128, 0, earNumber * 64, 53, 64, 53],
                        [192, 0, earNumber * 64, 53, 64, 53],
                        [256, 0, earNumber * 64, 53, 64, 53],
                        [320, 0, earNumber * 64, 53, 64, 53],
                        

                        // Nose
                        [0, 0, noseNumber * 64, 106, 64, 53],
                        [64, 0, noseNumber * 64, 106, 64, 53],
                        [128, 0, noseNumber * 64, 106, 64, 53],
                        [192, 0, noseNumber * 64, 106, 64, 53],
                        [256, 0, noseNumber * 64, 106, 64, 53],
                        [320, 0, noseNumber * 64, 106, 64, 53],

                        // Mouth
                        [0, 0, mouthNumber * 64, 159, 64, 53],
                        [64, 0, mouthNumber * 64, 159, 64, 53],
                        [128, 0, mouthNumber * 64, 159, 64, 53],
                        [192, 0, mouthNumber * 64, 159, 64, 53],
                        [256, 0, mouthNumber * 64, 159, 64, 53],
                        [320, 0, mouthNumber * 64, 159, 64, 53],
                        

                        // Accessories
                        [0, 0, accessoriesNumber * 64, 212, 64, 53],
                        [64, 0, accessoriesNumber * 64, 212, 64, 53],
                        [128, 0, accessoriesNumber * 64, 212, 64, 53],
                        [192, 0, accessoriesNumber * 64, 212, 64, 53],
                        [256, 0, accessoriesNumber * 64, 212, 64, 53],
                        [320, 0, accessoriesNumber * 64, 212, 64, 53],
                        
                    ]]
                    ],
                    [
                        ["#FF0000", skinColor],
                        ["#00FF00", eyeColor]
                    ],
                    [["<%hair%>", [[0, 0], [64, 0], [128, 0], [192, 0], [256, 0], [320, 0], [384, 0], [448, 0], [512, 0]]]],
                    64, 128, 6, (id) => {
                self.player = playersGroup.create(oldPlayer.position.x, oldPlayer.position.y, id);
                var walk = self.player.animations.add('walk', [0, 1, 2, 3], 4);
                var jump = self.player.animations.add('jump', [4, 5], 4);
                spriteChanged(self, p, oldPlayer);
            });
        } else if (p["new-sprite"] == "worker") {
            graphics.createSprite([
                    ['/s/assets/worker.png', [[0, 0]]],
                    ['/s/assets/university-student-features.png', [
                        // Eyes
                        [0, 0, eyeNumber * 64, 0, 64, 53],
                        [64, 0, eyeNumber * 64, 0, 64, 53],
                        [128, 0, eyeNumber * 64, 0, 64, 53],
                        [192, 0, eyeNumber * 64, 0, 64, 53],
                        [256, 0, eyeNumber * 64, 0, 64, 53],
                        [320, 0, eyeNumber * 64, 0, 64, 53],
                        

                        // Ear
                        [0, 0, earNumber * 64, 53, 64, 53],
                        [64, 0, earNumber * 64, 53, 64, 53],
                        [128, 0, earNumber * 64, 53, 64, 53],
                        [192, 0, earNumber * 64, 53, 64, 53],
                        [256, 0, earNumber * 64, 53, 64, 53],
                        [320, 0, earNumber * 64, 53, 64, 53],
                        

                        // Nose
                        [0, 0, noseNumber * 64, 106, 64, 53],
                        [64, 0, noseNumber * 64, 106, 64, 53],
                        [128, 0, noseNumber * 64, 106, 64, 53],
                        [192, 0, noseNumber * 64, 106, 64, 53],
                        [256, 0, noseNumber * 64, 106, 64, 53],
                        [320, 0, noseNumber * 64, 106, 64, 53],

                        // Mouth
                        [0, 0, mouthNumber * 64, 159, 64, 53],
                        [64, 0, mouthNumber * 64, 159, 64, 53],
                        [128, 0, mouthNumber * 64, 159, 64, 53],
                        [192, 0, mouthNumber * 64, 159, 64, 53],
                        [256, 0, mouthNumber * 64, 159, 64, 53],
                        [320, 0, mouthNumber * 64, 159, 64, 53],
                        

                        // Accessories
                        [0, 0, accessoriesNumber * 64, 212, 64, 53],
                        [64, 0, accessoriesNumber * 64, 212, 64, 53],
                        [128, 0, accessoriesNumber * 64, 212, 64, 53],
                        [192, 0, accessoriesNumber * 64, 212, 64, 53],
                        [256, 0, accessoriesNumber * 64, 212, 64, 53],
                        [320, 0, accessoriesNumber * 64, 212, 64, 53],
                        
                    ]]
                    ],
                    [
                        ["#FF0000", skinColor],
                        ["#00FF00", eyeColor],
                        ["#FF0066", clothesColor],
                    ],
                    [["<%hair%>", [[0, 0], [64, 0], [128, 0], [192, 0], [256, 0], [320, 0]]]],
                    64, 128, 6, (id) => {
                self.player = playersGroup.create(oldPlayer.position.x, oldPlayer.position.y, id);
                var walk = self.player.animations.add('walk', [0, 1, 2, 3], 4);
                var jump = self.player.animations.add('jump', [4, 5], 4);
                spriteChanged(self, p, oldPlayer);
            });
        } else if (p["new-sprite"] == "old") {
            graphics.createSprite([
                    ['/s/assets/old.png', [[0, 0]]],
                    ['/s/assets/old-features.png', [
                        // Eyes
                        [0, 0, eyeNumber * 64, 0, 64, 60],
                        [64, 0, eyeNumber * 64, 0, 64, 60],

                        // Ear
                        [0, 0, earNumber * 64, 60, 64, 60],
                        [64, 0, earNumber * 64, 60, 64, 60],

                        // Nose
                        [0, 0, noseNumber * 64, 120, 64, 60],
                        [64, 0, noseNumber * 64, 120, 64, 60],

                        // Mouth
                        [0, 0, mouthNumber * 64, 180, 64, 60],
                        [64, 0, mouthNumber * 64, 180, 64, 60],

                        // Accessories
                        [0, 0, accessoriesNumber * 64, 240, 64, 60],
                        [64, 0, accessoriesNumber * 64, 240, 64, 60],
                    ]]
                    ],
                    [
                        ["#FF0000", skinColor],
                        ["#00FF00", eyeColor],
                        ["#FF0066", clothesColor],
                    ],
                    [["<%hair%>", [[2, 6], [66, 6]]]],
                    64, 120, 2, (id) => {
                self.player = playersGroup.create(oldPlayer.position.x, oldPlayer.position.y, id);
                var walk = self.player.animations.add('walk', [0, 1, 2, 3], 4);
                var jump = self.player.animations.add('jump', [4, 5], 4);
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
                } else if (script.type == "colour") {
                    colour.open(script.key, script.title, script.instruction, () => {
                        parseScript(scripts);
                    })
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
            graphics.createSprite([
                    ['/s/assets/baby.png', [[0, 0]]],
                    ['/s/assets/baby-features.png', [
                        // Eyes
                        [24, 0, eyeNumber * 33, 0, 33, 41],
                        [87, 0, eyeNumber * 33, 0, 33, 41],

                        // Ear
                        [24, 0, earNumber * 33, 41, 33, 41],
                        [87, 0, earNumber * 33, 41, 33, 41],

                        // Nose
                        [24, 0, noseNumber * 33, 82, 33, 41],
                        [87, 0, noseNumber * 33, 82, 33, 41],

                        // Mouth
                        [24, 0, mouthNumber * 33, 123, 33, 41],
                        [87, 0, mouthNumber * 33, 123, 33, 41],

                        // Accessories
                        [24, 0, accessoriesNumber * 33, 164, 33, 41],
                        [87, 0, accessoriesNumber * 33, 164, 33, 41],
                    ]],
                    ],
                    [
                        ["#FF0000", skinColor],
                        ["#00FF00", eyeColor],
                        ["#FF0066", clothesColor],
                        ["#FFFF00", graphics.shadeColor(clothesColor, -0.5)],
                    ],
                    [],
                    64, 64, 2, (id) => {
                        this.player = playersGroup.create(obj.x + 32, obj.y, id);

                        var walk = this.player.animations.add('walk');

                        game.physics.enable(this.player, Phaser.Physics.ARCADE);
                        this.player.body.gravity.y = 300;
                        this.player.anchor.setTo(.5, 1);
                        game.camera.follow(this.player);
            });
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
            ["<%wallpaper%>", 64, 0]
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

        // Set up special platforms
        setTileCollision(this.level1_level, [137], {top: true, bottom: false, left: false, right: false});
    },

    update() {
        if (this.player == null) {
            return; // Wait until the player is loaded
        }
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