/**
 * This is the abstract zombie class that will be extended to all of the zombie tiers, it contains all the properties a zombie would have and the sub classes of the tiers only have different stats
 * @deltaX- This is the difference in the x axis between the zombie and the player, in pixels
 * @deltaY- This is the difference in the y axis between the zombie and the player, in pixels
 * @actualSpd- This is the actual speed of the zombie that is calculated using the movement speed and then the delta time
 */
abstract class Zombie extends Picture {
  protected health: number;
  protected moveSpd: number;
  protected actualSpd: number;
  protected damage: number;
  protected hero: Hero;
  protected game: Game;
  protected xDist: number = 0; // x value of how much they are moving
  protected yDist: number = 0; // y value of how uch they are moving
  protected deltaX: number; // x distance between zombie and player
  protected deltaY: number; // y distance between zombie and player
  static readonly zombieSize: number = 100;
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
  public handleHealth(dmg: number): void {
    this.health -= dmg;
  }
  /**
   * This checks if the zombie is very close to the same path of the x axis as the player
   */
  private checkHeroPathX(): void {
    // This checks if the sign of the distance between the player and the zombie has changed after the movement, we will put set it equal to the same x axis path as the hero if it is true
    if (
      (this.deltaX > 0 && Math.sign(this.deltaX - this.xDist) == -1) ||
      (this.deltaX < 0 && Math.sign(this.deltaX - this.xDist) == 1)
    ) {
      this.x = this.hero.x;
      this.xDist = 0;
    }
  }
  /**
   * This checks if the zombie is very close to the same path of the y axis as the player
   */
  private checkHeroPathY(): void {
    // This checks if the sign of the distance between the player and the zombie has changed after the movement, we will put set it equal to the same y axis path as the hero if it is true
    if (
      (this.deltaY > 0 && Math.sign(this.deltaY - this.yDist) == -1) ||
      (this.deltaY < 0 && Math.sign(this.deltaY - this.yDist) == 1)
    ) {
      this.y = this.hero.y;
      this.yDist = 0;
    }
  }
  public moveToPlayer(dt): void {
    // Make sure the speed is the same not dependant of the frames
    this.actualSpd = dt * this.moveSpd;
    this.deltaX = this.hero.x - this.x;
    this.deltaY = this.hero.y - this.y;
    // add the right movement speed per frame depending on if the deltas are positive or negaitve
    this.xDist += this.actualSpd * Math.sign(this.deltaX);
    this.yDist += this.actualSpd * Math.sign(this.deltaY);
    this.checkHeroPathX();
    this.checkHeroPathY();
    // For the diagonal movement, so it is the same speed as the normal movement
    if (this.yDist != 0 && this.xDist != 0) {
      this.x += this.xDist / Math.sqrt(2);
      this.y += this.yDist / Math.sqrt(2);
    } else {
      this.x += this.xDist;
      this.y += this.yDist;
    }
    // resets everything for next movement
    this.xDist = 0;
    this.yDist = 0;
  }
  /**
   * The zombie checks if his health is under 0, if it is, he is cured and is removed
   * @zombieType- We remember the zombie type of the current zombie it is checking itseslf so we can remove them if their hp is under 0
   * @place - we remember the place of where the zombie is from the array so we can remove the right zombie that gets cured
   */
  public checkDeath(zombieType: number, place: number): void {
    if (this.health <= 0) {
      // we remove the zombie from their corresponding array by remembering their type so we can instantly reference that zombie type array
      this.game[this.game.zombieTypes[zombieType]].splice(place, 1);
      this.game.cureCount++;
    }
  }
  public dealDamage(): void {
    this.hero.changeHp(this.damage);
  }
}
class ZombieT1 extends Zombie {
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
    this.health = 10;
    this.moveSpd = 50;
    this.damage = 1;
  }
}
class ZombieT2 extends Zombie {
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
    this.health = 20;
    this.moveSpd = 75;
    this.damage = 2;
  }
}
class ZombieT3 extends Zombie {
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
    this.health = 30;
    this.moveSpd = 100;
    this.damage = 3;
  }
}
class ZombieT4 extends Zombie {
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
    this.health = 50;
    this.moveSpd = 125;
    this.damage = 5;
  }
}
