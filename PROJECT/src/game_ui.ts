/**
 * This class is used to display stats on the game canvas.
 * @xAdjust - the value that will translate the UI to keep it on screen, and not move off the canvas.
 * @yAdjust - the value that will translate the UI to keep it on screen, and not move off the canvas.
 */
class GameUserInterface {
  private canvas: Canvas;
  private hero: Hero;
  private xAdjust: number = 0;
  private yAdjust: number = 0;
  constructor(canvas: Canvas, hero: Hero) {
    this.canvas = canvas;
    this.hero = hero;
  }

  /**
   * This draws the UI. It is called every frame so it does not get coverd up by the game's drawings.
   */
  public update(
    health: number,
    cureCount: number,
    damage: number,
    instaCureRate: number,
  ): void {
    this.edgeToEdgeCaseHandler();

    //health
    this.createText(
      "Health: " +
        health +
        "   Cured: " +
        cureCount +
        "   Buffs:  Damage: " +
        damage +
        "  Insta-Cure: " +
        instaCureRate +
        "%",
      -this.canvas.width / 2 + this.xAdjust + 400, //adding extra pixles to correct position on canvas
      -this.canvas.height / 2 + this.yAdjust + 80,
    );
  }
  private createText(text: string, x: number, y: number): void {
    this.canvas.context.font = "30px Times New Roman";
    this.canvas.context.textAlign = "center";
    this.canvas.context.fillStyle = "white";
    this.canvas.context.fillText(text, x, y);
  }

  private edgeToEdgeCaseHandler(): void {
    this.xAdjust = this.hero.x; //if there is no edge to edge, this will not get overrided.
    this.yAdjust = this.hero.y;

    // if there is edge to edge, Adjusts by finding difference of hero position on map and half the canvas' dimentions on the corrisponding axis.
    if (this.hero.x + Hero.heroSize / 2 < this.canvas.width / 2) {
      this.xAdjust -= this.hero.x - this.canvas.width / 2 + Hero.heroSize / 2; //will work for leaving and appraching boarder, since its Adjusting by opposite of canvas and hero difference.
    }
    if (this.hero.y + Hero.heroSize / 2 < this.canvas.height / 2) {
      this.yAdjust -= this.hero.y - this.canvas.height / 2 + Hero.heroSize / 2;
    }
    if (
      this.hero.y + Hero.heroSize / 2 >
      GameMap.height - this.canvas.height / 2
    ) {
      this.yAdjust -=
        this.hero.y -
        (GameMap.height - this.canvas.height / 2) +
        Hero.heroSize / 2;
    }
    if (
      this.hero.x + Hero.heroSize / 2 >
      GameMap.width - this.canvas.width / 2
    ) {
      this.xAdjust -=
        this.hero.x -
        (GameMap.width - this.canvas.width / 2) +
        Hero.heroSize / 2;
    }
  }
}
