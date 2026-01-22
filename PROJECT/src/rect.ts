/**
 * This class is used to create every rectangle/square in the game.
 * Many other classes extend this to reduce lines of code.
 */
class Rect {
  constructor(
    protected _x: number,
    protected _y: number,
    protected _width: number,
    protected _height: number,
    protected colour: string,
    protected _canvas: Canvas,
  ) {}

  public draw(): void {
    this.canvas.context.fillStyle = this.colour;

    this.canvas.context.beginPath();
    this.canvas.context.rect(this._x, this._y, this._width, this._height);
    this.canvas.context.fill();
  }
  public get width(): number {
    return this._width;
  }
  public get height(): number {
    return this._height;
  }
  public get x(): number {
    return this._x;
  }
  public get y(): number {
    return this._y;
  }
  public set x(value: number) {
    this._x = value;
  }
  public set y(value: number) {
    this._y = value;
  }
  public get canvas(): Canvas {
    return this._canvas;
  }
}

/**
 * This class creates a rectangle that will have a picure filling the center rather than a solid colour. This is used for every image seen in the game.
 * @image - The image to be used. All the images are stored in the html as a hidden image, and the image is chosen when a new instance is created.
 */
class Picture extends Rect {
  private _image: HTMLCanvasElement;
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    image: HTMLCanvasElement,
    canvas: Canvas,
  ) {
    super(x, y, width, height, "black", canvas);
    this._image = image;
  }

  /**
   * Changes it so you put an image rather than filling it with a colour
   */
  public override draw(): void {
    this.canvas.context.drawImage(
      this._image,
      this.x,
      this.y,
      this._width,
      this._height,
    );

    this.canvas.context.beginPath();
    this.canvas.context.rect(this.x, this.y, this._width, this._height);
  }

  public get image(): HTMLCanvasElement {
    return this._image;
  }
  public get x(): number {
    return this._x;
  }
  public get y(): number {
    return this._y;
  }
  public set x(value: number) {
    this._x = value;
  }
  public set y(value: number) {
    this._y = value;
  }
}
