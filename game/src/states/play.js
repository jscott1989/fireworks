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
 import end from '../uis/end';


var stopParentsFollowing = false;

var spriteInteractions = {};
var interactions = {};
var interactionGroup;
var childInteractionGroup;
var interactableSpriteGroup;
var itemsGroup;
var charactersGroup;
var doorsGroup;

var walkSpeed = 50;
var jumpHeight = 0;

var currentSprite = "baby";
var canMove = true;
window.globalPlayer = null;
var lazyNPCs = [];
var doors = {};

var hairKey = "<%parent_hair%>";
var findingPartner = false;

var partner;
var child;
var isKissing = false;
var fallingSounds = false;


var tilesheetModifications = [
    ["<%wallpaper%>", 0, 3],
    ["<%blackboard%>", 7, 21],
    ["<%friends_gravestone1%>", 9, 2],
    ["<%friends_gravestone2%>", 9, 3],
    ["<%partner_gravestone%>", 9, 4]
];


const instantiateNPC = (obj) => {
    
        var skin_color = _.sample(["#8d5524", "#c68642", "#e0ac69", "#f1c27d", "#ffdbac"]);
    var eye_color = _.sample(["#1907ba", "#776536", "#76c4ae", "#6ca580"]);
    var clothes_color = _.sample(["#2BACBB", "#E4266F", "#151928", "#E2BC03", "#89B8FF"]);
    var eye_number = _.random(0, 4);
    var ear_number = _.random(0, 4);
    var nose_number = _.random(0, 4);
    var mouth_number = _.random(0, 4);
    var accessories_number = _.random(0, 4);
    var hair = "/s/assets/demo/hair/boy1.png"
    
    if (obj.properties.data) {
        var l = JSON.parse(obj.properties.data);
        skin_color = data.text[l[0]];
        eye_color = data.text[l[1]];
        clothes_color = data.text[l[2]];
        eye_number = data.text[l[3]];
        ear_number = data.text[l[4]];
        nose_number = data.text[l[5]];
        mouth_number = data.text[l[6]];
        accessories_number = data.text[l[7]];
        hair = data.image[l[8]];
    }

    if (obj.properties.type == "school-student" && text.get("uniform") != null) {
        clothes_color = text.get("uniform");
    }

            createCharacter(obj.properties.type, obj.x + 32, obj.y,
    skin_color,
    eye_color,
    clothes_color,
    eye_number,
    ear_number,
    nose_number,
    mouth_number,
    accessories_number, hair, (character) => {
        character.npc = AITypes[obj.properties.AI](character, obj.properties);
        character.properties = obj.properties;
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
    self.player.position.x = oldPlayer.position.x;
    self.player.position.y = oldPlayer.position.y;
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
    hair,
    callback) => {

    const done = (player, x, y, width, height) => {
        game.physics.enable(player, Phaser.Physics.ARCADE);
        player.body.gravity.y = 300;
        if (x != undefined) {
            player.body.setSize(width, height, x, y);
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
                done(player, 0, 0, 57, 64);
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
            done(player, 12, 10, 30, 64);
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
                [202, 0, eyeNumber * 51, 0, 51, 45],
                [253, 0, eyeNumber * 51, 0, 51, 45],
                [304, 0, eyeNumber * 51, 0, 51, 45],
                [355, 0, eyeNumber * 51, 0, 51, 45],

                // Ear
                [-2, 0, earNumber * 51, 45, 51, 45],
                [49, 0, earNumber * 51, 45, 51, 45],
                [100, 0, earNumber * 51, 45, 51, 45],
                [151, 0, earNumber * 51, 45, 51, 45],
                [202, 0, earNumber * 51, 45, 51, 45],
                [253, 0, earNumber * 51, 45, 51, 45],
                [304, 0, earNumber * 51, 45, 51, 45],
                [355, 0, earNumber * 51, 45, 51, 45],

                // Nose
                [-2, 0, noseNumber * 51, 90, 51, 45],
                [49, 0, noseNumber * 51, 90, 51, 45],
                [100, 0, noseNumber * 51, 90, 51, 45],
                [151, 0, noseNumber * 51, 90, 51, 45],
                [202, 0, noseNumber * 51, 90, 51, 45],
                [253, 0, noseNumber * 51, 90, 51, 45],
                [304, 0, noseNumber * 51, 90, 51, 45],
                [355, 0, noseNumber * 51, 90, 51, 45],

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
                [202, 0, accessoriesNumber * 51, 180, 51, 45],
                [253, 0, accessoriesNumber * 51, 180, 51, 45],
                [304, 0, accessoriesNumber * 51, 180, 51, 45],
                [355, 0, accessoriesNumber * 51, 180, 51, 45],
            ]]
            ],
            [
                ["#FF0000", skinColor],
                ["#00FF00", eyeColor],
                ["#FF0066", clothesColor],
                ["#FFFF00", graphics.shadeColor(clothesColor, -0.5)],
                ["#0000FF", graphics.complementColor(clothesColor)]
            ],
            [[hair, [[0, 0], [51, 0], [102, 0], [153, 0], [204, 0], [255, 0], [306, 0], [357, 0]]]],
            51, 90, 8, (id) => {
                var player = charactersGroup.create(x, y, id);
                player.animations.add('walk', [0, 1, 2, 3], 4);
                player.animations.add('kiss', [4, 5, 6, 7], 4);
                done(player, 9, 0, 35, 90);
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
                    [[hair, [[0, 0], [51, 0], [102, 0], [153, 0], [204, 0], [255, 0], [306, 1]]],
                    ["<#tie#>", [[24, 47], [75, 47], [126, 47], [177, 47], [228, 47], [279, 47], [330, 48]]]],
                    51, 90, 7, (id) => {
                        var player = charactersGroup.create(x, y, id);
                        player.animations.add('walk', [0, 1, 2, 1], 4);
                        player.animations.add('jump', [3, 4], 4);
                        player.animations.add('dance', [5, 6], 4);
                        done(player, 9, 0, 35, 90);
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
                    [[hair, [[1, 6], [65, 6], [129, 6], [193, 6], [257, 6], [321, 6]]]],
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
                    [[hair, [[1, 6], [65, 6], [129, 6], [193, 6], [257, 6], [321, 6]]]],
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
                    [[hair, [[4, 13], [68, 13]]]],
                    64, 120, 2, (id) => {
                    var player = charactersGroup.create(x, y, id);
                    player.animations.add('walk', [0, 1, 2, 3], 4);
                    player.animations.add('jump', [4, 5], 4);
                    done(player);
            });
        }
}

const selectPartner = (character) => {
    text.setMass({
        "partner_pk": data.text["friend" + character.properties.friend_id + "_pk"],
        "partner_name": data.text["friend" + character.properties.friend_id + "_name"],
        "partner_skin_color": data.text["friend" + character.properties.friend_id + "_skin_color"],
        "partner_eye_color": data.text["friend" + character.properties.friend_id + "_eye_color"],
        "partner_clothes_color": data.text["friend" + character.properties.friend_id + "_clothes_color"],
        "partner_eye_number": data.text["friend" + character.properties.friend_id + "_eye_number"],
        "partner_ear_number": data.text["friend" + character.properties.friend_id + "_ear_number"],
        "partner_nose_number": data.text["friend" + character.properties.friend_id + "_nose_number"],
        "partner_mouth_number": data.text["friend" + character.properties.friend_id + "_mouth_number"],
        "partner_accessories_number": data.text["friend" + character.properties.friend_id + "_accessories_number"]
    }, () => {
        drawing.setURL("partner_hair", data.image["friend" + character.properties.friend_id + "_hair"], () => {
            audio.setMass({
                "partner_name": data.sound["friend" + character.properties.friend_id + "_name"],
                "partner_kiss": data.sound["friend" + character.properties.friend_id + "_kiss"],
                "partner_cry": data.sound["friend" + character.properties.friend_id + "_cry"],
                "partner_bump": data.sound["friend" + character.properties.friend_id + "_bump"],
                "partner_greeting": data.sound["friend" + character.properties.friend_id + "_greeting"]
            });
        });
    });

    findingPartner = false;
    character.npc = AITypes["partner_follow"](character);

    // TODO: Record the partner's details in the text/images/etc 
    partner = character;

    audio.narrate([
        ["As they clumsily bumped into one another", ["/s/assets/narration/astheyclumsily.mp3"]],
        ["<i>bump</i>", ["<#bump#>", "<#partner_bump#>"]],
        ["They didn't yet realise the importance of this moment", ["/s/assets/narration/theydidntyet.mp3"]],
        ["<i>Hi</i>", ["<#partner_greeting#>"]],
        ["Said <#partner_name#>, and <%name%> replied", ["/s/assets/narration/said.mp3", "<#partner_name#>", "/s/assets/narration/and.mp3", "<%name%>", "/s/assets/narration/replied.mp3"]],
    ], () => {
        audio.promptForSound("greeting", "Greet", "Respond to <#partner_name#>'s greeting", () => {
            audio.narrate([
                ["<i>Hello</i>", ["<#greeting#>"]],
                ["Exactly", ["/s/assets/narration/exactly.mp3"]],
                ["<%name%> and <#partner_name#> spent the rest of the dance moving awkwardly", ["<%name%>", "/s/assets/narration/and.mp3", "<#partner_name#>", "/s/assets/narration/spenttherest.mp3"]],
                ["before leaving together", ["/s/assets/narration/beforeleaving.mp3"]]
            ]);
        });
    })
}

const kiss = () => {

    isKissing = false;
    partner.body.setSize(35, 90, 9, 0);
    globalPlayer.frame = 1;
    audio.narrate([
        ["<i>They kiss</i>", ["<#kiss#>", "<#partner_kiss#>"]],
        ["How beautiful.", ["/s/assets/narration/howbeautiful.mp3"]],
        ["<%name%> and <#partner_name#> continued on their journey together.", ["<%name%>", "/s/assets/narration/and.mp3", "<#partner_name#>", "/s/assets/narration/continuedon.mp3"]]
    ]);

    var door = doors["kiss"];
    door.body.enable = false;
    door.visible = false;
    doorsGroup.remove(door);
}

const AITypes = {
    "run-away": (character, properties) => {
        return () => {
            character.body.velocity.x = 75;
            if (!character.animations.currentAnim.isPlaying) {
                character.animations.play('walk', 4);
            }
        }
    },

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

    "child_follow": (character) => {
        var movingTowards = partner.position.x - 40;

        return () => {
            movingTowards = partner.position.x - 60;

            if (movingTowards < character.body.position.x + 5 && movingTowards > character.body.position.x - 5) {
                character.body.velocity.x = 0;
                character.animations.stop();
            } else if (movingTowards < character.body.position.x - 10) {
                character.body.velocity.x = -75;
                character.scale.x = -1;
                if (!character.animations.currentAnim.isPlaying) {
                    character.animations.play('walk', 4);
                }
            } else if (movingTowards > character.body.position.x + 10) {
                character.body.velocity.x = 75;
                character.scale.x = 1;
                if (!character.animations.currentAnim.isPlaying) {
                    character.animations.play('walk', 4);
                }
            }
        }
    },

    "partner_follow": (character) => {
        var movingTowards = globalPlayer.position.x - 60;

        return () => {

            if (isKissing) {
                if (globalPlayer.position.x < character.body.position.x) {
                    character.scale.x = -1;
                } else {
                    character.scale.x = 1;
                }
                character.body.velocity.x = 0;
                character.animations.stop();
                character.frame = 4;


                game.physics.arcade.overlap(globalPlayer, character, (a, b) => {
                    // If we overlap - Kiss
                    kiss();
                });
            } else {
                movingTowards = globalPlayer.position.x - 60;

                if (movingTowards < character.body.position.x + 5 && movingTowards > character.body.position.x - 5) {
                    character.body.velocity.x = 0;
                    character.animations.stop();
                } else if (movingTowards < character.body.position.x - 10) {
                    character.body.velocity.x = -75;
                    character.scale.x = -1;
                    if (!character.animations.currentAnim.isPlaying) {
                        character.animations.play('walk', 4);
                    }
                } else if (movingTowards > character.body.position.x + 10) {
                    character.body.velocity.x = 75;
                    character.scale.x = 1;
                    if (!character.animations.currentAnim.isPlaying) {
                        character.animations.play('walk', 4);
                    }
                }
            }
        }
    },

    "dance": (character, properties) => {
        var startingX = character.body.position.x;
        var movingTowards = startingX;

        return () => {

            if (findingPartner) {
                if (globalPlayer.body.position.x < character.body.position.x) {
                    character.scale.x = -1;
                } else {
                    character.scale.x = 1;
                }

                character.body.velocity.x = 0;
                character.animations.stop();

                game.physics.arcade.overlap(globalPlayer, character, (a, b) => {
                    // If we overlap - we're now the partner
                    selectPartner(character);
                });


            } else {
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


}


const interactionTypes = {

    kiss(self, i) {
        audio.playOriginal("kiss");
    },

    partner_kiss(self, i) {
        audio.playOriginal("partner_kiss");
    },

    closeDoor(self, i) {
        var door = doors[i.door];
        door.visible = true;
        game.physics.enable(door, Phaser.Physics.ARCADE);
        door.body.enable = true;
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

        graphics.createSprite([
            ['<%friend1_favouritetoy%>', [[0, 0]]]],
            [],[],
            32, 32, 1, (id) => {
                itemsGroup.create(i.x + 20, i.y + 96, id);
            }
        );

        graphics.createSprite([
            ['<%friend2_favouritetoy%>', [[0, 0]]]],
            [],[],
            32, 32, 1, (id) => {
                itemsGroup.create(i.x + 80, i.y + 96, id);
            }
        );

        audio.narrate([
            ["As <%name%> opened the toybox, many toys spilled out.", ["/s/assets/narration/as.mp3", "<%name%>", "/s/assets/narration/openedthe.mp3"]],
            ["There was even <%name%>'s favourite toy", ["/s/assets/narration/therewaseven.mp3", "<%name%>", "/s/assets/narration/favouritetoy.mp3"]]
        ], () => {
            drawing.open("favouritetoy", "<%name%>'s favourite toy", "Draw <%name%>'s favourite toy", 32, 32, null, null, null, () => {
                graphics.createSprite([
                    ['<#favouritetoy#>', [[0, 0]]]],
                    [],[],
                    32, 32, 1, (id) => {
                        itemsGroup.create(i.x - 40, i.y + 96, id);
                    }
                );
            });
        });
    },

    childStopRunning(self, p) {
        canMove = true;
        child.destroy();
        child = null;

        audio.narrate([
            ["content that <#name#> was settled, <%name%> and <#partner_name#> continued onwards together", ["/s/assets/narration/contentthat.mp3", "<#name#>", "/s/assets/narration/wassettled.mp3", "<%name%>", "/s/assets/narration/and.mp3", "<#partner_name#>", "/s/assets/narration/continuedonwards.mp3"]]
        ]);
    },

    changeChildSprite(self, p) {
        var oldChild = child;

        var clothes = text.get("clothes_color");

        if (p["new-sprite"] == "school-student") {
            clothes = text.get("uniform");
        }

        createCharacter(p["new-sprite"], oldChild.position.x, oldChild.position.y, text.get("partner_skin_color"),
        text.get("partner_eye_color"),
        clothes,
        text.get("child_eye_number"),
        text.get("child_ear_number"),
        text.get("child_nose_number"),
        text.get("child_mouth_number"),
        text.get("child_accessories_number"), hairKey, (character) => {
            child = character
            game.physics.enable(child, Phaser.Physics.ARCADE);

            currentSprite = p["new-sprite"];
            child.body.velocity = oldChild.body.velocity;
            child.position.x = child.position.x;
            child.position.y = child.position.y;
            child.npc = AITypes["child_follow"](child);
            oldChild.destroy();
        });
    },

    changeSprite(self, p) {
        var oldPlayer = self.player;

        var clothes = data.text["clothes_color"];

        if (p["new-sprite"] == "school-student") {
            clothes = text.get("uniform");
        }

        createCharacter(p["new-sprite"], oldPlayer.position.x, oldPlayer.position.y, data.text["skin_color"],
    data.text["eye_color"],
    clothes,
    data.text["eye_number"],
    data.text["ear_number"],
    data.text["nose_number"],
    data.text["mouth_number"],
    data.text["accessories_number"], hairKey, (player) => {
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
                    tilesheetModifications = tilesheetModifications.concat(script.data);
                    graphics.modifyTilesheet(tilesheetModifications);
                    parseScript(scripts);
                } else if (script.type == "useOwnHair") {
                    hairKey = "<#hair#>";
                    // Now reload the character
                    interactionTypes["changeSprite"](self, {"new-sprite": "school-student"});
                    parseScript(scripts);
                } else if (script.type == "refreshChild") {
                    createCharacter("baby", child.x, child.y, text.get("partner_skin_color"),
                        text.get("partner_eye_color"),
                        text.get("clothes_color"),
                        text.get("child_eye_number"),
                        text.get("child_ear_number"),
                        text.get("child_nose_number"),
                        text.get("child_mouth_number"),
                        text.get("child_accessories_number"), hairKey, (character) => {
                            var oldChild = child;
                            child = character;
                            game.physics.enable(child, Phaser.Physics.ARCADE);
                            charactersGroup.add(child);
                            child.npc = AITypes["child_follow"](child);
                            child.body.velocity = oldChild.body.velocity;
                            child.position.x = oldChild.position.x;
                            child.position.y = oldChild.position.y;
                            oldChild.destroy();
                            parseScript(scripts);
                        }
                    );
                } else if (script.type == "findPartner") {
                    findingPartner = true;
                    parseScript(scripts);
                } else if (script.type == "changeOutOfSchoolClothes") {
                    interactionTypes["changeSprite"](self, {"new-sprite": "child"});
                    createCharacter("child", partner.position.x, partner.position.y, text.get("partner_skin_color"),
                        text.get("partner_eye_color"),
                        text.get("partner_clothes_color"),
                        text.get("partner_eye_number"),
                        text.get("partner_ear_number"),
                        text.get("partner_nose_number"),
                        text.get("partner_mouth_number"),
                        text.get("partner_accessories_number"), drawing.get("partner_hair"), (character) => {
                            var oldPartner = partner;
                            partner = character;
                            charactersGroup.add(partner);
                            partner.npc = AITypes["partner_follow"](partner);
                            partner.body.velocity = oldPartner.body.velocity;
                            partner.position.x = oldPartner.position.x;
                            partner.position.y = oldPartner.position.y;
                            oldPartner.destroy();
                            parseScript(scripts);
                        }
                    );
                } else if (script.type == "growOld") {
                    interactionTypes["changeSprite"](self, {"new-sprite": "old"});
                    createCharacter("old", partner.position.x, partner.position.y, text.get("partner_skin_color"),
                        text.get("partner_eye_color"),
                        text.get("partner_clothes_color"),
                        text.get("partner_eye_number"),
                        text.get("partner_ear_number"),
                        text.get("partner_nose_number"),
                        text.get("partner_mouth_number"),
                        text.get("partner_accessories_number"), drawing.get("partner_hair"), (character) => {
                            var oldPartner = partner;
                            partner = character;
                            charactersGroup.add(partner);
                            partner.npc = AITypes["partner_follow"](partner);
                            partner.body.velocity = oldPartner.body.velocity;
                            partner.position.x = oldPartner.position.x;
                            partner.position.y = oldPartner.position.y;
                            oldPartner.destroy();
                            parseScript(scripts);
                        }
                    );
                } else if (script.type == "partnerDie") {
                    partner.destroy();
                    partner = null;
                    parseScript(scripts);
                } else if (script.type == "die") {
                    // TODO: die
                    self.player.destroy();
                    self.player = null;
                    parseScript(scripts);
                } else if (script.type == "endGame") {
                    upload.complete(() => {
                        end.open();
                        parseScript(scripts);
                    });
                } else if (script.type == "prepareKiss") {
                    // Not allowed to jump any more, the AI should stop following and instead is watching
                    // and both get frames with their lips ready
                    isKissing = true;

                    globalPlayer.frame = 4;

                    // MAke their body smaller so they can kiss
                    partner.body.setSize(20, 90, 9, 0);

                    parseScript(scripts);
                } else if (script.type == "growUp") {
                    interactionTypes["changeSprite"](self, {"new-sprite": "university-student"});

                    createCharacter("university-student", partner.position.x, partner.position.y, text.get("partner_skin_color"),
                        text.get("partner_eye_color"),
                        text.get("partner_clothes_color"),
                        text.get("partner_eye_number"),
                        text.get("partner_ear_number"),
                        text.get("partner_nose_number"),
                        text.get("partner_mouth_number"),
                        text.get("partner_accessories_number"), drawing.get("partner_hair"), (character) => {
                            var oldPartner = partner;
                            partner = character;
                            charactersGroup.add(partner);
                            partner.npc = AITypes["partner_follow"](partner);
                            partner.body.velocity = oldPartner.body.velocity;
                            partner.position.x = oldPartner.position.x;
                            partner.position.y = oldPartner.position.y;
                            oldPartner.destroy();
                        }
                    );

                    // Generate baby
                    // TODO: This is random for now - make it so that it's mostly coming from the parents
                    text.set("child_eye_number", _.random(0, 4));
                    text.set("child_ear_number", _.random(0, 4));
                    text.set("child_nose_number", _.random(0, 4));
                    text.set("child_mouth_number", _.random(0, 4));
                    text.set("child_accessories_number", _.random(0, 4));


                    createCharacter("baby", partner.position.x - 64, partner.position.y, text.get("partner_skin_color"),
                        text.get("partner_eye_color"),
                        data.text["clothes_color"],
                        text.get("child_eye_number"),
                        text.get("child_ear_number"),
                        text.get("child_nose_number"),
                        text.get("child_mouth_number"),
                        text.get("child_accessories_number"), hairKey, (character) => {
                            child = character;
                            charactersGroup.add(child);
                            child.npc = AITypes["child_follow"](child);
                        }
                    );
                    parseScript(scripts);
                } else if (script.type == "childRunAway") {
                    canMove = false;
                    child.npc = AITypes["run-away"](child);
                } else if (script.type == "startFallSounds") {
                    fallingSounds = true;
                } else if (script.type == "stopFallSounds") {
                    fallingSounds = false;
                }
            }
        }

        parseScript(scripts);
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
    createChildInteractionPoint(x, y, properties) {
        // Because of the way tiled edits objects - we just knock 64 off the y value
        y -= 64;
        var s = childInteractionGroup.create(x, y, "interaction");
        game.physics.enable(s, Phaser.Physics.ARCADE);
        interactions[x + "," + y] = properties;
    },

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
        var offset = JSON.parse(properties.offset);
        x += offset[0];
        y += offset[1];
        var s = interactableSpriteGroup.create(x, y, properties.sprite);
        game.physics.enable(s, Phaser.Physics.ARCADE);
        spriteInteractions[x + "," + y] = properties;
        s.body.offset.setTo(0 - offset[0], 0 -offset[1]);
    },

    createObject(obj) {
        if (obj.type == "interaction") {
            this.createInteractionPoint(obj.x, obj.y, obj.properties);
        } else if (obj.type == "child-interaction") {
            this.createChildInteractionPoint(obj.x, obj.y, obj.properties);
        } else if (obj.type == "interactable-sprite") {
            this.createInteractableSprite(obj.x, obj.y, obj.properties);
        } else if (obj.type == "door") {
            doors[obj.properties.id] = game.add.sprite(obj.x, obj.y, obj.properties.sprite);
            if (!obj.properties.closed) {
                doors[obj.properties.id].visible = false;
            } else {
                game.physics.enable(doors[obj.properties.id], Phaser.Physics.ARCADE);
                doors[obj.properties.id].body.immovable = true;
                doorsGroup.add(doors[obj.properties.id]);
            }
        } else if (obj.type == "player") {
            var self = this;
            createCharacter("baby", obj.x + 32, obj.y, data.text["skin_color"],
    data.text["eye_color"],
    data.text["clothes_color"],
    data.text["eye_number"],
    data.text["ear_number"],
    data.text["nose_number"],
    data.text["mouth_number"],
    data.text["accessories_number"], hairKey, (player) => {
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
        childInteractionGroup = game.add.group();

        // this.win = game.add.sprite(256, 256, "tile");
        // game.physics.enable(this.win, Phaser.Physics.ARCADE);

        window.level1 = game.add.tilemap('level1');
        level1.addTilesetImage('level1-tiles', 'level1-tiles');
        graphics.modifyTilesheet(tilesheetModifications);

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

        doorsGroup = game.add.group();

        _.each(level1.objects.objects, (obj) => {
            this.createObject(obj);
        });

        const front = level1.createLayer('front');

        // Set up special platforms
        setTileCollision(this.level1_level, [137], {top: true, bottom: false, left: false, right: false});

        game.world.bringToTop(doorsGroup);

        upload.init({
                "my_skin_color": data.text["skin_color"],
                "my_eye_color": data.text["eye_color"],
                "my_clothes_color": data.text["clothes_color"],
                "my_eye_number": data.text["eye_number"],
                "my_ear_number": data.text["ear_number"],
                "my_nose_number": data.text["nose_number"],
                "my_mouth_number": data.text["mouth_number"],
                "my_accessories_number": data.text["accessories_number"],
                "my_name": data.text["name"]
            }, {"my_name": data.sound["name"]}, () => {
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


        if (fallingSounds) {
            var lastPartnerVelocity = partner.body.velocity.y;
        }

        // game.debug.body(this.player);
        // if (partner != null) {
        //     game.debug.body(partner);
        //     window.partner = partner;
        // }

        game.physics.arcade.collide(charactersGroup, this.level1_level);
        game.physics.arcade.collide(charactersGroup, doorsGroup);

        if (child != null) {
            game.physics.arcade.overlap(child, childInteractionGroup, (a, b) => {
                interact(this, b);
            });
        }

        game.physics.arcade.overlap(this.player, interactionGroup, (a, b) => {
            interact(this, b);
        });

        game.physics.arcade.overlap(this.player, interactableSpriteGroup, (a, b) => {
            interactSprite(this, b);
        });

        if (this.player == null) {
            return; // Wait until the player is loaded
        }

        var velocityChange = lastYVelocity - this.player.body.velocity.y;

        if (velocityChange > 200) {
            // Big bump
                if (currentSprite == "baby" || currentSprite == "walking-baby" || (velocityChange > 270 && fallingSounds)) {
                    canMove = false;
                    game.camera.flash(0x000000, 500);
                    audio.playOriginal("bump", null, null, () => {
                        if (!(_.has(audio.all(), "cry"))) {
                        audio.narrate([
                            ["That was quite a fall. <%name%> reacted in the way that children often do, by crying.", ["/s/assets/narration/thatwasquite.mp3", "<%name%>", "/s/assets/narration/reacted.mp3"]]], () => {
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
        } else if ((velocityChange > 180 && currentSprite == "baby") || velocityChange > 230 && currentSprite == "walking-baby" || (velocityChange > 190 && fallingSounds)) {
            // Small bump
            if (!(_.has(audio.all(), "bump"))) {
                audio.narrate([
                        ["<%parent_name%> and <%partner_name%> could always tell when <%name%> was coming", ["<%parent_name%>", "/s/assets/narration/and.mp3", "<%partner_name%>", "/s/assets/narration/couldalwaystell.mp3", "<%name%>", "/s/assets/narration/wascoming.mp3"]],
                        ["That was because of the distinctive sound that <%name%> made", ["/s/assets/narration/thatwasbecause.mp3", "<%name%>", "/s/assets/narration/made.mp3"]],
                        ["I can't actually remember what that sound is though. Help me out?", ["/s/assets/narration/icantactually.mp3"]]], () => {
                    audio.playOriginal("bump", "Bump", "Record the sound that the child makes when hitting the step");
                });
            } else {
                audio.playOriginal("bump");
            }
        }

        if (fallingSounds) {
            // We also care about the velocity of the partner
            var partnerVelocityChange = lastPartnerVelocity - partner.body.velocity.y;
            if (partnerVelocityChange > 200) {
                audio.playOriginal("partner_cry");
            } else if (partnerVelocityChange > 190) {
                audio.playOriginal("partner_bump");
            }

        }

        if (canMove && this.keyboard.isDown(Phaser.Keyboard.A)) {
            this.player.body.velocity.x = 0 - walkSpeed;
            this.player.scale.x = -1;
            if (this.player.body.onFloor() && !this.player.animations.currentAnim.isPlaying) {
                if (isKissing) {
                    this.player.animations.play('kiss', 4);
                } else {
                    this.player.animations.play('walk', 4);
                }
            }
        } else if (canMove && this.keyboard.isDown(Phaser.Keyboard.D)) {
            this.player.body.velocity.x = walkSpeed;
            this.player.scale.x = 1;
            if (this.player.body.onFloor() && !this.player.animations.currentAnim.isPlaying) {
                if (isKissing) {
                    this.player.animations.play('kiss', 4);
                } else {
                    this.player.animations.play('walk', 4);
                }
            }
        } else {
            this.player.body.velocity.x = 0;
            this.player.animations.stop();
        }

        if (canMove && this.keyboard.isDown(Phaser.Keyboard.W) && this.player.body.onFloor()) {
            // Jump
            if (jumpHeight > 0 && !isKissing) {
                this.player.animations.play('jump', 4);
                this.player.body.velocity.y = 0 - jumpHeight;
            }
        }
    }
}