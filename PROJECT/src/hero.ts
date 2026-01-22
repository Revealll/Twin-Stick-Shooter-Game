/**
 * This is the hero class that represents the player we are playing inside the game. This is made after the game has started and everything in the game is usually based off the player.
 * @_instaCureRate- a special ability where the hero has a chance to cure a zombie off one hit. The percentage starts at 0 and you pick up the corresponding buff to make it higher.
 */
class Hero extends Picture {
  private _wand: Picture;
  private _velocityX: number = 0;
  private _velocityY: number = 0;
  private heroSpd: number = 150;
  private _distX: number;
  private _distY: number;
  private controller: Controller;
  private gameMap: GameMap;
  private _hp: number = 20;
  private _damage: number = 1;
  private game: Game;
  private _instaCureRate: number = 0;
  private cursorPositionOnMapX: number;
  private cursorPositionOnMapY: number;
  readonly maxSpd: number = this.heroSpd * 2;
  readonly friction: number = 0.95;
  readonly acceleration: number = 0.1;
  static readonly heroSize: number = 100;
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    image: HTMLCanvasElement,
    canvas: Canvas,
    controller: Controller,
    gameMap: GameMap,
    game: Game,
  ) {
    super(x, y, width, height, image, canvas);
    this.controller = controller;
    this.gameMap = gameMap;
    this.game = game;
    this._wand = new Picture(
      this._x,
      this._y,
      Hero.heroSize,
      Hero.heroSize,
      document.getElementById("wand") as HTMLCanvasElement,
      this.canvas,
    );
  }
  public changeHp(value: number): void {
    this._hp -= value;
  }
  /**
   * This applies friction onto the hero only after the player decides to stop moving, otherwise, there would be no friction if you continue to press the movement keys
   */
  private applyFriction(dt: number): void {
    if (
      this.canvas.controller.A == false &&
      this.canvas.controller.D == false &&
      this.distX != 0
    ) {
      // applying friction that also scales with the frames using the delta time between each frame
      this.velocityX -= this.velocityX * this.friction * dt;
    }
    if (
      this.canvas.controller.W == false &&
      this.canvas.controller.S == false &&
      this.distY != 0
    ) {
      // applying friction that also scales with the frames using the delta time between each frame
      this.velocityY -= this.velocityY * this.friction * dt;
    }
  }

  private capSpeed(): void {
    // Caps the speed of the x value and checks both left and right and cap it at the max speed in that direction
    if (this.velocityX > this.maxSpd || this.velocityX < -this.maxSpd) {
      if (Math.sign(this.velocityX) == -1) {
        this.velocityX = -this.maxSpd;
      } else {
        this.velocityX = this.maxSpd;
      }
    }
    // Caps the speed of the y value and checks both up and down and cap it at the max speed in that direction
    if (this.velocityY > this.maxSpd || this.velocityY < -this.maxSpd) {
      if (Math.sign(this.velocityY) == -1) {
        this.velocityY = -this.maxSpd;
      } else {
        this.velocityY = this.maxSpd;
      }
    }
  }
  /**
   * This handles all of the movement from the hero, this handles the acceleration and the friction that is applied on the hero
   */
  public handleMovement(dt: number): void {
    if (this.canvas.controller.A) {
      this.velocityX += this.heroSpd * -this.acceleration;
    }
    if (this.canvas.controller.W) {
      this.velocityY += this.heroSpd * -this.acceleration;
    }
    if (this.canvas.controller.D) {
      this.velocityX += this.heroSpd * this.acceleration;
    }
    if (this.canvas.controller.S) {
      this.velocityY += this.heroSpd * this.acceleration;
    }

    this.applyFriction(dt);
    // We set a boundary of one and negative one so that if the hero speed is that small, it will just become zero because since we are multiplying by friction, the speed will actually never become 0 and it will just get smaller and smaller
    if (this.velocityX < 1 && this.velocityX > -1) {
      this.velocityX = 0;
    }
    if (this.velocityY < 1 && this.velocityY > -1) {
      this.velocityY = 0;
    }

    this.capSpeed();
    // We apply the delta time to make sure it scales with the frames
    this.distX = this.velocityX * dt;
    this.distY = this.velocityY * dt;

    //makes it so the hero moves at the same speed regardless of direction.
    if (this.distX != 0 && this.distY != 0) {
      const angle = Math.atan2(this.distY, this.distX); //calculate angle the player is moving

      //Since atan2 returns angles that give positive numbers only, we must check the sign of the velocity to make it move in the correct direction.
      if (this.distX < 0) {
        this.distX *= -1;
      }
      if (this.distY < 0) {
        this.distY *= -1;
      }
      //apply the angle to the velocity
      this.distX = this.distX * Math.cos(angle);
      this.distY = this.distY * Math.sin(angle);

      // We update the difference between the current position of the canvas and the game map
      this.gameMap.deltaX += this.distX;
      this.gameMap.deltaY += this.distY;
    }

    //the canvas is not translated when edge to edge is true
    if (this.edgeToEdgeX() == false) {
      // we only translate the x value if the hero is not touching near the edge of the map and is within the boundarys, we translate the negative value since it is all in reference to the hero moving
      this.canvas.context.translate(-this.distX, 0);
    }
    if (this.edgeToEdgeY() == false) {
      // we only translate the y value if the hero is not touching near the edge of the map and is within the boundaries, we translate the negative value since it is all in reference to the hero moving
      this.canvas.context.translate(0, -this.distY);
    }
    //the canvas is not translated when edge to edge is true

    //move the hero on the map
    this.x += this.distX;
    this.y += this.distY;

    //move the wand with the hero
    this._wand.x += this.distX;
    this._wand.y += this.distY;
  }

  private edgeToEdgeX(): boolean {
    // We make a boundary for the left and right side of the screen for when a part of the canvas would be outside of the game map, and we would return false if it is inside of the boundarys which means that the canvas would translate perfectly with the heros steps we put a boundry of 10 pixels on each side so the hero wont go out of the map due to the frames per second
    if (
      this.x >= this.canvas.width / 2 - this.width / 2 &&
      this.x <= GameMap.width - this.canvas.width / 2 - this.width / 2
    ) {
      return false;
    }
    return true;
  }
  private edgeToEdgeY(): boolean {
    // We make a boundary for the up and down side of the screen for when a part of the canvas would be outside of the game map, and we would return false if it is inside of the boundarys which means that the canvas would translate perfectly with the heros steps we put a boundry of 10 pixels on each side so the hero wont go out of the map due to the frames per second
    if (
      this.y > this.canvas.height / 2 - this.height / 2 &&
      this.y <= GameMap.height - this.canvas.height / 2 - this.height / 2
    ) {
      return false;
    }
    return true;
  }
  public instaCure(): boolean {
    const random = Math.floor(Math.random() * 100);
    // If the random number is lower than the percentage, then the heros special ability insta cure, will activate
    if (random < this.instaCureRate) {
      return true;
    }
    return false;
  }

  public shootProjectile(): void {
    // The projectile is created based off where the hero is currently, since its the hero shooting the projectile
    const x = this.x + this.width / 2;
    const y = this.y + this.height / 2;

    this.game.projectiles.push(
      new Projectile(
        x,
        y,
        this.calculateAngle(),
        this.canvas,
        this.game,
        this.gameMap,
      ),
    );
    this.canvas.context.fillStyle = "white";
    this.canvas.context.fillRect(0, 0, 500, 500);
  }

  /**
   * Calculates the angle of the projectile based off of where the hero is on the map, and where the cursor is clicked on the map. This works by taking the x and y coordinates of the hero, and subtracting the x and y coords of the cursor.
   */
  public calculateAngle(): number {
    //these two if else statements are used to find the location of the cursor on the map.
    if (GameMap.width - this.canvas.width / 2 - this.width / 2 < this.x) {
      //Runs when edge to edge right.
      //Assumes canvas is at the right side of the map by using the width of the map.
      this.cursorPositionOnMapX =
        GameMap.width - this.canvas.width + this.controller.mouseXMove;
    } else if (this.canvas.width / 2 - this.width / 2 > this.x) {
      //Runs when edge to edge left.
      //Assumes canvas is at the left side of the map by using 0.
      this.cursorPositionOnMapX = this.controller.mouseXMove;
    } else {
      this.cursorPositionOnMapX =
        this.x +
        this.controller.mouseXMove -
        (this.canvas.width / 2 - this.width / 2);
    }

    //Do same for y axis
    if (GameMap.height - this.canvas.height / 2 - this.height / 2 < this.y) {
      //Runs when edge to edge bottom.
      this.cursorPositionOnMapY =
        GameMap.height - this.canvas.height + this.controller.mouseYMove;
    } else if (this.canvas.height / 2 - this.height / 2 > this.y) {
      //Runs when edge to edge top.
      this.cursorPositionOnMapY = this.controller.mouseYMove;
    } else {
      this.cursorPositionOnMapY =
        this.y +
        this.controller.mouseYMove -
        (this.canvas.height / 2 - this.height / 2);
    }

    // Calculate the angle between the hero and the cursor
    return Math.atan2(
      //difference between cursor position and hero position
      this.cursorPositionOnMapY - (this.y + this.width / 2),
      this.cursorPositionOnMapX - (this.x + this.width / 2),
    );
  }

  /**
   * This function is used to draw the hero wand on the canvas.
   */
  public rotateWand(): void {
    this.canvas.context.save();
    this.canvas.context.translate(
      this.wand.x + this.wand.width / 2,
      this.wand.y + this.wand.height / 2,
    );

    //Rotations
    this.canvas.context.rotate(this.calculateAngle() + Math.PI / 4); //original images was already rotated by 45 degrees
    this.canvas.context.translate(
      -this.wand.x - this.wand.width / 2,
      -this.wand.y - this.wand.height / 2,
    );

    //Drawing the actual wand
    this.wand.draw();
    this.canvas.context.restore();
  }

  public changeDamage(value: number): void {
    this._damage += value;
  }
  public changeInstaCureRate(value: number): void {
    this._instaCureRate += value;
  }

  public get wand(): Picture {
    return this._wand;
  }
  public get distX(): number {
    return this._distX;
  }
  public get distY(): number {
    return this._distY;
  }
  public get velocityX(): number {
    return this._velocityX;
  }
  public get velocityY(): number {
    return this._velocityY;
  }
  public set distX(value: number) {
    this._distX = value;
  }
  public set distY(value: number) {
    this._distY = value;
  }
  public set velocityX(value: number) {
    this._velocityX = value;
  }
  public set velocityY(value: number) {
    this._velocityY = value;
  }

  public get width(): number {
    return this._width;
  }
  public get height(): number {
    return this._height;
  }
  public get hp(): number {
    return this._hp;
  }
  public get instaCureRate(): number {
    return this._instaCureRate;
  }
  public get damage(): number {
    return this._damage;
  }
}
