/**
 * This class is used for the powerups that are picked up from the ground. Each subclass of powerup gives different buffs.
 */
abstract class Buff extends Picture {
  protected hero: Hero;
  protected game: Game;
  static readonly buffSize: number = 50;
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    image: HTMLCanvasElement,
    canvas: Canvas,
    hero: Hero,
    game: Game,
  ) {
    super(x, y, width, height, image, canvas);
    this.hero = hero;
    this.game = game;
  }
  abstract giveBuff(): void;
}
class DmgBuff extends Buff {
  private dmgBuff: number = 1;
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    image: HTMLCanvasElement,
    canvas: Canvas,
    hero: Hero,
    game: Game,
  ) {
    super(x, y, width, height, image, canvas, hero, game);
  }
  public giveBuff(): void {
    this.hero.changeDamage(this.dmgBuff);
  }
}
class InstaCureBuff extends Buff {
  private instaCureRateBuff: number = 2;
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    image: HTMLCanvasElement,
    canvas: Canvas,
    hero: Hero,
    game: Game,
  ) {
    super(x, y, width, height, image, canvas, hero, game);
  }
  public giveBuff(): void {
    this.hero.changeInstaCureRate(this.instaCureRateBuff);
  }
}
class HpBuff extends Buff {
  private hpBuff: number = 1;
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    image: HTMLCanvasElement,
    canvas: Canvas,
    hero: Hero,
    game: Game,
  ) {
    super(x, y, width, height, image, canvas, hero, game);
  }
  public giveBuff(): void {
    this.hero.changeHp(-this.hpBuff);
  }
}
