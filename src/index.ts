import P5, { Color, Image } from "p5";

function getColor(p5: P5, image: Image, x: number, y: number): Color {
    let index = (x + y * image.width) * 4;
    let red = image.pixels[index];
    let green = image.pixels[index + 1];
    let blue = image.pixels[index + 2];
    return p5.color(red, green, blue);
}

function setColor(p5: P5, image: Image, x: number, y: number, color: Color) {
    let index = (x + y * image.width) * 4;
    image.pixels[index] = p5.red(color);
    image.pixels[index + 1] = p5.green(color);
    image.pixels[index + 2] = p5.blue(color);
}

function applyError(p5: P5, color: Color, errorR: number, errorG: number, errorB: number): Color {
    return p5.color(
        p5.red(color) * errorR,
        p5.green(color) * errorG,
        p5.blue(color) * errorB,
    )
}

function quantizeColorPart(color: number): number {
    let colors = 1;
    return Math.round(colors * color / 255) * (255 / colors);
}

function quantizeColor(p5: P5, color: Color) {
    let red = p5.red(color);
    let green = p5.green(color);
    let blue = p5.blue(color);
    return p5.color(
        quantizeColorPart(red),
        quantizeColorPart(green),
        quantizeColorPart(blue),
    )
}

function quantizeColorBW(p5: P5, color: Color) {
    let red = p5.red(color);
    let green = p5.green(color);
    let blue = p5.blue(color);
    let avg = (red + green + blue) / 3;
    return p5.color(avg);
}

function computeQuantError(p5: P5, oldColor: Color, newColor: Color): Error {
    return new Error(
        p5.red(oldColor) - p5.red(newColor),
        p5.green(oldColor) - p5.green(newColor),
        p5.blue(oldColor) - p5.blue(newColor),
    )
}

function applyQuantError(p5: P5, color: Color, quantError: Error, fraction: number): Color {
    return p5.color(
        p5.red(color) + quantError.r * fraction,
        p5.green(color) + quantError.g * fraction,
        p5.blue(color) + quantError.b * fraction,
    )
}

// Creating the sketch itself
const sketch = (p5: P5) => {
    // The sketch setup method
    let original: Image
  //  let originaldithered: Image
    p5.preload = () => {
        original = p5.loadImage('bernie.png');
    }

    p5.setup = () => {
        p5.createCanvas(2 * original.width, original.height);
      //  original.filter(p5.GRAY);
        p5.image(original, 0, 0);
    };

    // The sketch draw method
    p5.draw = () => {
       // original.copy(dithered, 0, 0, dithered.width, dithered.height,0, 0, dithered.width, dithered.height);
       original.filter(p5.GRAY);
        original.loadPixels();
        for (let x = 0; x < original.width; x++) {
            for (let y = 0; y < original.height; y++) {
                let color = getColor(p5, original, x, y);
                let newColor = quantizeColor(p5, color);
                setColor(p5, original, x, y, newColor);
                let quantError = computeQuantError(p5, color, newColor);
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

new P5(sketch);

class Error {
    r: number;
    g: number;
    b: number;

    constructor(r: number, g: number, b: number) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
}