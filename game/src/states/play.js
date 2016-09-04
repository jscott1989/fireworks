/**
 * Game state
 */
 import audio from "../audio";
 import graphics from "../graphics";
 import drawing from "../uis/drawing";
 import text from "../uis/text";
 import colour from "../uis/colour";
 import setTileCollision from '../lib/set-tile-collision';
 import upload from '..//upload';
 import _ from 'lodash';


var stopParentsFollowing = false;

var spriteInteractions = {};
var interactions = {};
var interactionGroup;
var interactableSpriteGroup;
var itemsGroup;
var charactersGroup;
var doorsGroup;

var walkSpeed = 50;
var jumpHeight = 0;

var skinColor = _.sample(["#8d5524", "#c68642", "#e0ac69", "#f1c27d", "#ffdbac"]);
var eyeColor = _.sample(["#1907ba", "#776536", "#76c4ae", "#6ca580"]);
var clothesColor = _.sample(["#2BACBB", "#E4266F", "#151928", "#E2BC03", "#89B8FF"]);
var eyeNumber =  _.random(0, 4);
var earNumber =  _.random(0, 4);
var noseNumber =  _.random(0, 4);
var mouthNumber =  _.random(0, 4);
var accessoriesNumber = _.random(0, 4);

const testNum = 0;

var eyeNumber = testNum;
var earNumber = testNum;
var noseNumber = testNum;
var mouthNumber = testNum;
var accessoriesNumber = testNum;

var currentSprite = "baby";
var canMove = true;
var globalPlayer;
var lazyNPCs = [];
var doors = {};

var hairKey = "<%hair%>";


const instantiateNPC = (obj) => {
    var clothes = _.sample(["#2BACBB", "#E4266F", "#151928", "#E2BC03", "#89B8FF"]);

    if (obj.properties.type == "school-student" && text.get("uniform") != null) {
        clothes = text.get("uniform");
    }

            createCharacter(obj.properties.type, obj.x + 32, obj.y,
    _.sample(["#8d5524", "#c68642", "#e0ac69", "#f1c27d", "#ffdbac"]),
    _.sample(["#1907ba", "#776536", "#76c4ae", "#6ca580"]),
    clothes,
    _.random(0, 4),
    _.random(0, 4),
    _.random(0, 4),
    _.random(0, 4),
    _.random(0, 4), (character) => {
        character.npc = AITypes[obj.properties.AI](character, obj.properties);
    });
}

const spriteChanged = (self, p, oldPlayer) => {
    
    currentSprite = p["new-sprite"];
    self.player.body.velocity = oldPlayer.body.velocity;
    
    if (p["new-sprite"] == "old" || p["new-sprite"] == "baby") {
        walkSpeed = 50;
        jumpHeight = 0;
    } else {
        walkSpeed = 75;
        jumpHeight = 200;
    }
    oldPlayer.destroy();

    game.camera.follow(self.player);
}


const createCharacter = (type, x, y, 
    skinColor,
    eyeColor,
    clothesColor,
    eyeNumber,
    earNumber,
    noseNumber,
    mouthNumber,
    accessoriesNumber,


    callback) => {

    const done = (player, x, y, width, height) => {
        game.physics.enable(player, Phaser.Physics.ARCADE);
        player.body.gravity.y = 300;
        if (x != undefined) {
            player.body.setSize(x, y, width, height);
        }
        player.anchor.setTo(.5, 1);
        callback(player);
    };

    if (type == "baby") {
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
                var player = charactersGroup.create(x, y, id);
                player.animations.add('walk');
                done(player);
            });
    } else if (type == "walking-baby") {
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
            var player = charactersGroup.create(x, y, id);
            player.animations.add('walk', [0, 1, 2, 3], 4);
            player.animations.add('jump', [4, 5], 4);
            done(player, 30, 64, 12, 10);
        });
    } else if (type == "child") {
        graphics.createSprite([
            ['/s/assets/child.png', [[0, 0]]],
            ['/s/assets/child-features.png', [
                // Eyes
                [-2, 0, eyeNumber * 51, 0, 51, 45],
                [49, 0, eyeNumber * 51, 0, 51, 45],
                [100, 0, eyeNumber * 51, 0, 51, 45],
                [151, 0, eyeNumber * 51, 0, 51, 45],

                // Ear
                [-2, 0, earNumber * 51, 45, 51, 45],
                [49, 0, earNumber * 51, 45, 51, 45],
                [100, 0, earNumber * 51, 45, 51, 45],
                [151, 0, earNumber * 51, 45, 51, 45],

                // Nose
                [-2, 0, noseNumber * 51, 90, 51, 45],
                [49, 0, noseNumber * 51, 90, 51, 45],
                [100, 0, noseNumber * 51, 90, 51, 45],
                [151, 0, noseNumber * 51, 90, 51, 45],

                // Mouth
                [-2, 0, mouthNumber * 51, 135, 51, 45],
                [49, 0, mouthNumber * 51, 135, 51, 45],
                [100, 0, mouthNumber * 51, 135, 51, 45],
                [151, 0, mouthNumber * 51, 135, 51, 45],

                // Accessories
                [-2, 0, accessoriesNumber * 51, 180, 51, 45],
                [49, 0, accessoriesNumber * 51, 180, 51, 45],
                [100, 0, accessoriesNumber * 51, 180, 51, 45],
                [151, 0, accessoriesNumber * 51, 180, 51, 45],
            ]]
            ],
            [
                ["#FF0000", skinColor],
                ["#00FF00", eyeColor]
            ],
            [[hairKey, [[0, 0], [51, 0], [102, 0], [153, 0]]]],
            51, 90, 4, (id) => {
                var player = charactersGroup.create(x, y, id);
                player.animations.add('walk', [0, 1, 2, 3], 4);
                done(player, 30, 80, 12, 10);
        });
    } else if (type == "school-student") {
            graphics.createSprite([
                    ['/s/assets/school-student.png', [[0, 0]]],
                    ['/s/assets/child-features.png', [
                        // Eyes
                        [0, 0, eyeNumber * 51, 0, 51, 45],
                        [51, 0, eyeNumber * 51, 0, 51, 45],
                        [102, 0, eyeNumber * 51, 0, 51, 45],
                        [153, 0, eyeNumber * 51, 0, 51, 45],
                        [204, 0, eyeNumber * 51, 0, 51, 45],
                        [255, 0, eyeNumber * 51, 0, 51, 45],
                        [306, 1, eyeNumber * 51, 0, 51, 45],

                        // Ear
                        [0, 0, earNumber * 51, 45, 51, 45],
                        [51, 0, earNumber * 51, 45, 51, 45],
                        [102, 0, earNumber * 51, 45, 51, 45],
                        [153, 0, earNumber * 51, 45, 51, 45],
                        [204, 0, earNumber * 51, 45, 51, 45],
                        [255, 0, earNumber * 51, 45, 51, 45],
                        [306, 1, earNumber * 51, 45, 51, 45],

                        // Nose
                        [0, 0, noseNumber * 51, 90, 51, 45],
                        [51, 0, noseNumber * 51, 90, 51, 45],
                        [102, 0, noseNumber * 51, 90, 51, 45],
                        [153, 0, noseNumber * 51, 90, 51, 45],
                        [204, 0, noseNumber * 51, 90, 51, 45],
                        [255, 0, noseNumber * 51, 90, 51, 45],
                        [306, 1, noseNumber * 51, 90, 51, 45],

                        // Mouth
                        [0, 0, mouthNumber * 51, 135, 51, 45],
                        [51, 0, mouthNumber * 51, 135, 51, 45],
                        [102, 0, mouthNumber * 51, 135, 51, 45],
                        [153, 0, mouthNumber * 51, 135, 51, 45],
                        [204, 0, mouthNumber * 51, 135, 51, 45],
                        [255, 0, mouthNumber * 51, 135, 51, 45],
                        [306, 1, mouthNumber * 51, 135, 51, 45],

                        // Accessories
                        [0, 0, accessoriesNumber * 51, 180, 51, 45],
                        [51, 0, accessoriesNumber * 51, 180, 51, 45],
                        [102, 0, accessoriesNumber * 51, 180, 51, 45],
                        [153, 0, accessoriesNumber * 51, 180, 51, 45],
                        [204, 0, accessoriesNumber * 51, 180, 51, 45],
                        [255, 0, accessoriesNumber * 51, 180, 51, 45],
                        [306, 1, accessoriesNumber * 51, 180, 51, 45],
                    ]]
                    ],
                    [
                        ["#FF0000", skinColor],
                        ["#00FF00", eyeColor],
                        ["#FF0066", clothesColor],
                        ["#FFFF00", graphics.shadeColor(clothesColor, -0.5)]
                    ],
                    [[hairKey, [[0, 0], [51, 0], [102, 0], [153, 0], [204, 0], [255, 0], [306, 1]]],
                    ["<#tie#>", [[24, 47], [75, 47], [126, 47], [177, 47], [228, 47], [279, 47], [330, 48]]]],
                    51, 90, 7, (id) => {
                        var player = charactersGroup.create(x, y, id);
                        player.animations.add('walk', [0, 1, 2, 1], 4);
                        player.animations.add('jump', [3, 4], 4);
                        player.animations.add('dance', [5, 6], 4);
                        done(player);
            });
        } else if (type == "university-student") {
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
                        ["#00FF00", eyeColor],
                        ["#FF0066", clothesColor],
                        ["#FFFF00", graphics.shadeColor(clothesColor, -0.5)],
                    ],
                    [[hairKey, [[1, 6], [65, 6], [129, 6], [193, 6], [257, 6], [321, 6]]]],
                    64, 128, 6, (id) => {
                        var player = charactersGroup.create(x, y, id);
                        player.animations.add('walk', [0, 1, 2, 3], 4);
                        player.animations.add('jump', [4, 5], 4);
                        done(player);
            });
        } else if (type == "worker") {
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
                    [[hairKey, [[1, 6], [65, 6], [129, 6], [193, 6], [257, 6], [321, 6]]]],
                    64, 128, 6, (id) => {
                        var player = charactersGroup.create(x, y, id);
                        player.animations.add('walk', [0, 1, 2, 3], 4);
                        player.animations.add('jump', [4, 5], 4);
                        done(player);
            });
        } else if (type == "old") {
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
                    [[hairKey, [[4, 13], [68, 13]]]],
                    64, 120, 2, (id) => {
                    var player = charactersGroup.create(x, y, id);
                    player.animations.add('walk', [0, 1, 2, 3], 4);
                    player.animations.add('jump', [4, 5], 4);
                    done(player);
            });
        }
}


const AITypes = {
    "parent-follow": (character, properties) => {
        var activated = false;

        var startingX = character.body.position.x;
        var movingTowards = startingX;
        var movingTimeout;

        return () => {
            if (stopParentsFollowing) {
                character.body.velocity.x = 0;
                character.animations.stop();
                return;
            }
            if (!activated) {
                // Check if the player is to our right, if so, activate
                if (globalPlayer != null && globalPlayer.body.position.x > character.body.position.x) {
                    activated = true;
                } else {
                    // Move randomly
                    if (movingTimeout == null && movingTowards < character.body.position.x + 5 && movingTowards > character.body.position.x - 5) {
                        // We're there - wait some time then pick a new target
                        character.body.velocity.x = 0;
                        character.animations.stop();

                        movingTimeout = setTimeout(() => {
                            movingTowards = startingX + _.random(-200, 200);
                            movingTimeout = null;
                        }, _.random(0, 5000));
                    } else if (movingTowards < character.body.position.x - 10) {
                        character.body.velocity.x = -60;
                        character.scale.x = -1;
                        if (!character.animations.currentAnim.isPlaying) {
                            character.animations.play('walk', 4);
                        }
                    } else if (movingTowards > character.body.position.x + 10) {
                        character.body.velocity.x = 60;
                        character.scale.x = 1;
                        if (!character.animations.currentAnim.isPlaying) {
                            character.animations.play('walk', 4);
                        }
                    }
                }
            } else {
                if (character.body.position.x < globalPlayer.body.position.x - properties.followOffset) {
                    // Move right
                    character.body.velocity.x = 75;
                    character.scale.x = 1;
                    if (!character.animations.currentAnim.isPlaying) {
                        character.animations.play('walk', 4);
                    }
                } else {
                    character.body.velocity.x = 0;
                    character.animations.stop();
                }
            }
        }
    },

    "baby": (character, properties) => {
        // Babies will wander around the place they spawn
        // TODO: They should make noise sometimes

        var startingX = character.body.position.x;
        var movingTowards = startingX;
        var movingTimeout;

        return () => {
            if (movingTimeout == null && movingTowards < character.body.position.x + 5 && movingTowards > character.body.position.x - 5) {
                // We're there - wait some time then pick a new target
                character.body.velocity.x = 0;
                character.animations.stop();

                movingTimeout = setTimeout(() => {
                    movingTowards = startingX + _.random(-200, 200);
                    movingTimeout = null;
                }, _.random(0, 5000));
            } else if (movingTowards < character.body.position.x - 10) {
                character.body.velocity.x = -60;
                character.scale.x = -1;
                if (!character.animations.currentAnim.isPlaying) {
                    character.animations.play('walk', 4);
                }
            } else if (movingTowards > character.body.position.x + 10) {
                character.body.velocity.x = 60;
                character.scale.x = 1;
                if (!character.animations.currentAnim.isPlaying) {
                    character.animations.play('walk', 4);
                }
            }
        }
    },

    "dance": (character, properties) => {
        var startingX = character.body.position.x;
        var movingTowards = startingX;

        return () => {

            if (movingTowards < character.body.position.x + 5 && movingTowards > character.body.position.x - 5) {
                // We're there - wait some time then pick a new target
                character.body.velocity.x = 0;
                movingTowards = startingX + _.random(-100, 100);
            } else if (movingTowards < character.body.position.x - 10) {
                character.body.velocity.x = -60;
                character.scale.x = -1;
                if (!character.animations.currentAnim.isPlaying) {
                    character.animations.play('dance', 4);
                }
            } else if (movingTowards > character.body.position.x + 10) {
                character.body.velocity.x = 60;
                character.scale.x = 1;
                if (!character.animations.currentAnim.isPlaying) {
                    character.animations.play('dance', 4);
                }
            }

        }
    }


}


const interactionTypes = {

    closeDoor(self, i) {
        var door = doors[i.door];
        door.visible = true;
        game.physics.enable(door, Phaser.Physics.ARCADE);
        door.body.immovable = true;
        doorsGroup.add(door);

        // Destroy any AIs to the left of the door
        _.each(charactersGroup.children, (c) => {
            if (c && c.position.x < door.position.x) {
                c.destroy();
            }
        })
    },

    stopFollowing(self, i) {
        stopParentsFollowing = true;
    },

    openToybox(self, i, p) {
        // TODO: Create the favourite toys from the two friends
        // use i.x + 64, i.x + 80, etc.
        i.frame = 1;

        // graphics.createSprite([
        //     ['<%toy1%>', [[0, 0]]]],
        //     [],[],
        //     32, 32, 1, (id) => {
        //         itemsGroup.create(i.x + 64, i.y + 32, id);
        //     }
        // );

        // graphics.createSprite([
        //     ['<%toy2%>', [[0, 0]]]],
        //     [],[],
        //     32, 32, 1, (id) => {
        //         itemsGroup.create(i.x + 80, i.y + 32, id);
        //     }
        // );

        audio.narrate([
            ["As <%name%> opened the toybox, many toys spilled out.", []],
            ["There was <%toy1%> and <%toy2%>.", []],
            ["There was even <%name%>'s favourite toy", []]
        ], () => {
            drawing.open("favouritetoy", "<%name%>'s favourite toy", "Draw <%name%>'s favourite toy", 32, 32, null, null, null, () => {
                text.getOrAsk("favouritetoy", "<%name%>'s favourite toy", "Name <%name%>'s favourite toy", () => {
                    audio.promptForSound("favourite", "<%name%>'s favourite toy", "How do you pronounce <#favouritetoy#>?", () => {
                        audio.narrate([
                            ["Oh yes a <#favouritetoy#>! There it is", []]], () => {

                                graphics.createSprite([
                                    ['<#favouritetoy#>', [[0, 0]]]],
                                    [],[],
                                    32, 32, 1, (id) => {
                                        itemsGroup.create(i.x - 40, i.y + 32, id);
                                    }
                                );
                        });
                    });
                });
            });
        });
    },

    changeSprite(self, p) {
        var oldPlayer = self.player;

        var clothes = clothesColor;

        if (p["new-sprite"] == "school-student") {
            clothes = text.get("uniform");
        }

        createCharacter(p["new-sprite"], oldPlayer.position.x, oldPlayer.position.y, skinColor,
    eyeColor,
    clothes,
    eyeNumber,
    earNumber,
    noseNumber,
    mouthNumber,
    accessoriesNumber, (player) => {
            self.player = player;
            spriteChanged(self, p, oldPlayer);
        });
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
                    drawing.open(script.key, script.title, script.instruction, script.width, script.height, script.guide, script.background, script.tiled, () => {
                        parseScript(scripts);
                    });
                } else if (script.type == "colour") {
                    colour.open(script.key, script.title, script.instruction, () => {
                        parseScript(scripts);
                    })
                } else if (script.type == "insantiateLazyNPC") {
                    lazyNPCs = _.reject(lazyNPCs, (npc) => {
                        if (npc.properties.tag == script.tag) {
                            instantiateNPC(npc);
                            return true;
                        }
                        return false;
                    })
                    parseScript(scripts);
                } else if (script.type == "modifyTilesheet") {
                    graphics.modifyTilesheet(script.data);
                    parseScript(scripts);
                } else if (script.type == "useOwnHair") {
                    hairKey = "<#hair#>";
                    // Now reload the character
                    interactionTypes["changeSprite"](self, {"new-sprite": "school-student"});
                    parseScript(scripts);
                }
            }
        }

        parseScript(scripts);
    },

    save(self, p) {
        upload.complete(() => {
            console.log("SHOW FINAL SCENE");
        });
    }
}

const interact = (self, i) => {
    const properties = interactions[i.position.x + "," + i.position.y];
    interactionTypes[properties.type](self, properties);
    i.destroy();
}

const interactSprite = (self, i) => {
    if (!i.hasInteracted) {
        const properties = spriteInteractions[i.position.x + "," + i.position.y];
        interactionTypes[properties.type](self, i, properties);
        i.hasInteracted = true;
    }
}

module.exports = {
    createInteractionPoint(x, y, properties) {
        // Because of the way tiled edits objects - we just knock 64 off the y value
        y -= 64;
        var s = interactionGroup.create(x, y, "interaction");
        game.physics.enable(s, Phaser.Physics.ARCADE);
        interactions[x + "," + y] = properties;
    },

    createInteractableSprite(x, y, properties) {
        // Because of the way tiled edits objects - we just knock 64 off the y value
        y -= 64;
        var s = interactableSpriteGroup.create(x, y, properties.sprite);
        game.physics.enable(s, Phaser.Physics.ARCADE);
        spriteInteractions[x + "," + y] = properties;
    },

    createObject(obj) {
        if (obj.type == "interaction") {
            this.createInteractionPoint(obj.x, obj.y, obj.properties);
        } else if (obj.type == "interactable-sprite") {
            this.createInteractableSprite(obj.x, obj.y, obj.properties);
        } else if (obj.type == "door") {
            doors[obj.properties.id] = game.add.sprite(obj.x, obj.y, obj.properties.sprite);
            doors[obj.properties.id].visible = false;
        } else if (obj.type == "player") {
            var self = this;
            createCharacter("baby", obj.x + 32, obj.y, skinColor,
    eyeColor,
    clothesColor,
    eyeNumber,
    earNumber,
    noseNumber,
    mouthNumber,
    accessoriesNumber, (player) => {
                self.player = player
                game.physics.enable(self.player, Phaser.Physics.ARCADE);
                self.player.body.gravity.y = 300;
                self.player.anchor.setTo(.5, 1);
                game.camera.follow(self.player);
            });
        } else if (obj.type == "NPC") {
            instantiateNPC(obj);
        } else if (obj.type == "LazyNPC") {
            lazyNPCs.push(obj);
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
            ["<%wallpaper%>", 0, 3],
            ["<%wallpaper%>", 7, 21] // TODO: This should be the blackboard image 
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

        interactableSpriteGroup = game.add.group();
        itemsGroup = game.add.group();

        charactersGroup = game.add.group();

        _.each(level1.objects.objects, (obj) => {
            this.createObject(obj);
        });

        const front = level1.createLayer('front');

        doorsGroup = game.add.group();

        // Set up special platforms
        setTileCollision(this.level1_level, [137], {top: true, bottom: false, left: false, right: false});

        upload.init(() => {
        });
    },

    update() {
        if (this.player == null) {
            return; // Wait until the player is loaded
        }

        globalPlayer = this.player;

        _.each(charactersGroup.children, (c) => {
            if (c && c.npc != null) {
                c.npc();
            }
        });

        var lastYVelocity = this.player.body.velocity.y;

        // game.debug.body(this.player);
        game.physics.arcade.collide(charactersGroup, this.level1_level);
        game.physics.arcade.collide(charactersGroup, doorsGroup);

        game.physics.arcade.overlap(this.player, interactionGroup, (a, b) => {
            interact(this, b);
        });

        game.physics.arcade.overlap(this.player, interactableSpriteGroup, (a, b) => {
            interactSprite(this, b);
        });

        // UNCOMMENTWHENDONE

        var velocityChange = lastYVelocity - this.player.body.velocity.y;

        if (velocityChange > 200) {
            // Big bump
                if (currentSprite == "baby" || currentSprite == "walking-baby") {
                    canMove = false;
                    game.camera.flash(0x000000, 500);
                    audio.playOriginal("bump", null, null, () => {
                        if (!(_.has(audio.all(), "cry"))) {
                        audio.narrate([
                            ["That was quite a fall. <%name%> reacted in the way that children often do, by crying.", []]], () => {
                                audio.playOriginal("cry", "Cry", "Record the sound of crying", () => {
                                    canMove = true;
                                });
                            });
                        } else {
                            audio.playOriginal("cry", null, null, () => {
                                canMove = true;
                            });
                        }
                    });
                }
        } else if ((velocityChange > 180 && currentSprite == "baby") || velocityChange > 230 && currentSprite == "walking-baby") {
            // Small bump
            if (!(_.has(audio.all(), "bump"))) {
                audio.narrate([
                        ["<%parent_name%> and <%partner_name%> could always tell when <%name%> was coming", []],
                        ["That was because of the distinctive sound that <%name%> made", []],
                        ["I can't actually remember what that sound is though. Help me out?", []]], () => {
                    audio.playOriginal("bump", "Bump", "Record the sound that the child makes when hitting the step");
                });
            } else {
                audio.playOriginal("bump");
            }
        }

        if (canMove && this.keyboard.isDown(Phaser.Keyboard.A)) {
            this.player.body.velocity.x = 0 - walkSpeed;
            this.player.scale.x = -1;
            if (this.player.body.onFloor() && !this.player.animations.currentAnim.isPlaying) {
                this.player.animations.play('walk', 4);
            }
        } else if (canMove && this.keyboard.isDown(Phaser.Keyboard.D)) {
            this.player.body.velocity.x = walkSpeed;
            this.player.scale.x = 1;
            if (this.player.body.onFloor() && !this.player.animations.currentAnim.isPlaying) {
                this.player.animations.play('walk', 4);
            }
        } else {
            this.player.body.velocity.x = 0;
            this.player.animations.stop();
        }

        if (canMove && this.keyboard.isDown(Phaser.Keyboard.W) && this.player.body.onFloor()) {
            // Jump
            if (jumpHeight > 0) {
                this.player.animations.play('jump', 4);
                this.player.body.velocity.y = 0 - jumpHeight;
            }
        }
    }
}