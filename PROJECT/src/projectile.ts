/**
 * This class is used to create projectiles that are shot by the player.
 * @_x - The x position of the projectile. It is read to check for collisions with other objects. The game is resposible for this.
 * @_y - The y position of the projectile. It is read to check for collisions with other objects. The game is resposible for this.
 */
class Projectile {
  private angle: number;
  private _x: number;
  private _y: number;
  private canvas: Canvas;
  private game: Game;
  private gameMap: GameMap;
  static readonly bulletSpeed: number = 600;
  static readonly size: number = 4;
  constructor(
    x: number,
    y: number,
    angle: number,
    canvas: Canvas,
    game: Game,
    gameMap: GameMap,
  ) {
    this._x = x;
    this._y = y;
    this.angle = angle;
    this.canvas = canvas;
    this.game = game;
    this.gameMap = gameMap;
  }
  public draw(dt: number): void {
    this._x += Math.cos(this.angle) * Projectile.bulletSpeed * dt;
    this._y += Math.sin(this.angle) * Projectile.bulletSpeed * dt;
    this.canvas.context.beginPath();
    this.canvas.context.arc(this._x, this._y, Projectile.size, 0, 2 * Math.PI);
    this.canvas.context.fillStyle = "yellow";
    this.canvas.context.fill();
  }

  public get x(): number {
    return this._x;
  }
  public get y(): number {
    return this._y;
  }
}
