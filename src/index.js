"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var p5_1 = __importDefault(require("p5"));
function getColor(p5, image, x, y) {
    var index = (x + y * image.width) * 4;
    var red = image.pixels[index];
    var green = image.pixels[index + 1];
    var blue = image.pixels[index + 2];
    return p5.color(red, green, blue);
}
function setColor(p5, image, x, y, color) {
    var index = (x + y * image.width) * 4;
    image.pixels[index] = p5.red(color);
    image.pixels[index + 1] = p5.green(color);
    image.pixels[index + 2] = p5.blue(color);
}
function applyError(p5, color, errorR, errorG, errorB) {
    return p5.color(p5.red(color) * errorR, p5.green(color) * errorG, p5.blue(color) * errorB);
}
function quantizeColorPart(color) {
    var colors = 1;
    return Math.round(colors * color / 255) * (255 / colors);
}
function quantizeColor(p5, color) {
    var red = p5.red(color);
    var green = p5.green(color);
    var blue = p5.blue(color);
    return p5.color(quantizeColorPart(red), quantizeColorPart(green), quantizeColorPart(blue));
}
function quantizeColorBW(p5, color) {
    var red = p5.red(color);
    var green = p5.green(color);
    var blue = p5.blue(color);
    var avg = (red + green + blue) / 3;
    return p5.color(avg);
}
function computeQuantError(p5, oldColor, newColor) {
    return new Error(p5.red(oldColor) - p5.red(newColor), p5.green(oldColor) - p5.green(newColor), p5.blue(oldColor) - p5.blue(newColor));
}
function applyQuantError(p5, color, quantError, fraction) {
    return p5.color(p5.red(color) + quantError.r * fraction, p5.green(color) + quantError.g * fraction, p5.blue(color) + quantError.b * fraction);
}
// Creating the sketch itself
var sketch = function (p5) {
    // The sketch setup method
    var original;
    //  let originaldithered: Image
    p5.preload = function () {
        original = p5.loadImage('assets/ev.png');
        // dithered = p5.loadImage('ev.png');
    };
    p5.setup = function () {
        p5.createCanvas(2 * original.width, original.height);
        //  original.filter(p5.GRAY);
        p5.image(original, 0, 0);
    };
    // The sketch draw method
    p5.draw = function () {
        // original.copy(dithered, 0, 0, dithered.width, dithered.height,0, 0, dithered.width, dithered.height);
        original.filter(p5.GRAY);
        original.loadPixels();
        for (var x = 0; x < original.width; x++) {
            for (var y = 0; y < original.height; y++) {
                var color = getColor(p5, original, x, y);
                var newColor = quantizeColor(p5, color);
                setColor(p5, original, x, y, newColor);
                var quantError = computeQuantError(p5, color, newColor);
                if (x + 1 < original.width) {
                    setColor(p5, original, x + 1, y, applyQuantError(p5, getColor(p5, original, x + 1, y), quantError, 7 / 16));
                }
                if (x - 1 >= 0 && y + 1 < original.height) {
                    setColor(p5, original, x - 1, y + 1, applyQuantError(p5, getColor(p5, original, x - 1, y + 1), quantError, 3 / 16));
                }
                if (y + 1 < original.height) {
                    setColor(p5, original, x, y + 1, applyQuantError(p5, getColor(p5, original, x, y + 1), quantError, 5 / 16));
                }
                if (x + 1 < original.width && y + 1 < original.height) {
                    setColor(p5, original, x + 1, y + 1, applyQuantError(p5, getColor(p5, original, x + 1, y + 1), quantError, 1 / 16));
                }
            }
        }
        original.updatePixels();
        p5.image(original, original.width, 0);
        p5.noLoop();
    };
};
new p5_1.default(sketch);
var Error = /** @class */ (function () {
    function Error(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    return Error;
}());
//# sourceMappingURL=index.js.map