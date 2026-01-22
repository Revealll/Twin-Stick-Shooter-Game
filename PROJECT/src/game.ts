/**
 * This is the class that stores the actual game thats being played. This runs the actual game and contains all the proprties and displays the stats that are shown on the game after you press start on the start menu. Most of the propertys are stored in this class and belong to the actual game.
 * @ DeltaTime- we need to calculate the time between the last frame and the new frame in order for everything to scale with the fps
 * @ PreviousTime- This is needed in order to calculate the delta time, we need to store the previous time to see the difference in time between the previous and current frame
 * @spawnTimer- the amount in seconds between each spawn of a new zombie and buff
 * @spawnCounter- to keep track of how long has it been since the last spawn
 * @_zombieTypes- This stores the names of the types of zombies that can spawn, we use this in order to easily reference the array of the current zombie type we want
 * @_zombieTypes- This stores the names of the types of buffs that can spawn, we use this in order to easily reference the array of the current buff type we want
 */
class Game {
  private canvas: Canvas;
  private ui: GameUserInterface;
  private system: System;
  private hero: Hero;
  private fps: number = 100;
  private timeInterval: number = 1000 / this.fps;
  private deltaTime: number = 0;
  private previousTime: number = 0;
  private gameInterval: NodeJS.Timeout;
  private gameMap: GameMap;
  private spawnCounter: number = 0;
  private _zombiesT1: ZombieT1[] = [];
  private _zombiesT2: ZombieT2[] = [];
  private _zombiesT3: ZombieT3[] = [];
  private _zombiesT4: ZombieT4[] = [];
  private _zombieTypes: string[] = [
    "zombiesT1",
    "zombiesT2",
    "zombiesT3",
    "zombiesT4",
  ];
  private _projectiles: Projectile[] = [];
  private _dmgBuff: DmgBuff[] = [];
  private _hpBuff: HpBuff[] = [];
  private _instaCureBuff: InstaCureBuff[] = [];
  private buffTypes: string[] = ["dmgBuff", "hpBuff", "instaCureBuff"];
  private _cureCount: number = 0;
  static readonly spawnTimer: number = 5;
  constructor(canvas: Canvas, system: System) {
    this.canvas = canvas;
    this.system = system;
    this.gameMap = new GameMap(this.canvas);
    this.hero = new Hero(
      // hero starts spawning from the top left so we keep that in mind to make sure its in the center of the center
      this.canvas.width / 2 - Hero.heroSize / 2,
      this.canvas.height / 2 - Hero.heroSize / 2,
      Hero.heroSize,
      Hero.heroSize,
      document.getElementById("player") as HTMLCanvasElement,
      this.canvas,
      this.canvas.controller,
      this.gameMap,
      this,
    );
    this.ui = new GameUserInterface(this.canvas, this.hero);
    // Gets the current position of the canvas relative to the game map it is set to be where the hero first spawns because everything is based on where the hero is
    this.gameMap.deltaX = this.canvas.width / 2 - this.hero.width / 2;
    this.gameMap.deltaY = this.canvas.height / 2 - this.hero.height / 2;
    this.gameInterval = setInterval(() => {
      this.updateEverything();

      //clears the map with 10px just in case
      this.canvas.context.clearRect(
        -10,
        -10,
        GameMap.width + 10,
        GameMap.height + 10,
      );
      this.drawEverything();
      this.ui.update(
        this.hero.hp,
        this.cureCount,
        this.hero.damage,
        this.hero.instaCureRate,
      );
      this.gameOverCheck();
    }, this.timeInterval);
  }
  private checkCollisions(): void {
    this.checkBallBounds();
    this.dectectHeroBounds();
    this.detectBallZombieCollision();
    this.checkZombieHeroCollision();
    this.checkHeroBuffCollision();
  }
  private getDeltaTime(): void {
    const currentTime = performance.now();
    this.deltaTime = (currentTime - this.previousTime) / 1000;
    this.previousTime = currentTime;
  }
  private updateEverything(): void {
    this.getDeltaTime();
    // Keeps track of when the user clicks so the projectile can be shot
    if (this.canvas.controller.isClicked == true) {
      this.hero.shootProjectile();
      this.canvas.controller.isClicked = false;
    }
    this.checkCollisions();
    this.zombieMovement();
    this.hero.handleMovement(this.deltaTime);
    this.checkSpawn();
    this.spawnCounter++;
  }
  private checkSpawn(): void {
    // Spawns a zombie and a buff every 5 seconds no matter the frames
    if (this.spawnCounter == Math.floor(Game.spawnTimer * this.fps)) {
      this.randomZombie();
      this.randomBuff();
      this.spawnCounter = 0;
    }
  }
  /**
   * We make sure the hero does not go outisde of the game map, if it does, we make the hero bounce of the walls as a cool feature
   */
  private dectectHeroBounds(): void {
    if (this.hero.x + this.hero.width > GameMap.width) {
      //right
      this.hero.x = GameMap.width - this.hero.width - 1;
      this.hero.velocityX = -this.hero.velocityX;
      this.hero.distX = 0;
    }
    if (this.hero.x < 0) {
      //left
      this.hero.x = 1;
      this.hero.velocityX = -this.hero.velocityX;
      this.hero.distX = 0;
    }
    if (this.hero.y + this.hero.height > GameMap.height) {
      //bottom
      this.hero.y = GameMap.height - this.hero.height - 1;
      this.hero.velocityY = -this.hero.velocityY;
      this.hero.distY = 0;
    }
    if (this.hero.y < 0) {
      //top
      this.hero.y = 1;
      this.hero.velocityY = -this.hero.velocityY;
      this.hero.distY = 0;
    }
  }
  private zombieMovement(): void {
    // goes through every array of zombies and moves it towards the player, we go through the array of zombie types so we can instantly reference that zombie type array to make the code less dry
    for (let i = 0; i < this.zombieTypes.length; i++) {
      for (let j = 0; j < this[this.zombieTypes[i]].length; j++) {
        this[this.zombieTypes[i]][j].moveToPlayer(this.deltaTime);
      }
    }
  }
  /**
   * factory method that picks which zombie to spawn, the parameters are all random and are obtained from the randomZombie method
   */
  private zombieFactory(zombieType: string, xCoord: number, yCoord: number,): void {
    switch (zombieType) {
      case "zombiesT1": {
        const zombie = new ZombieT1(
          xCoord,
          yCoord,
          Zombie.zombieSize,
          Zombie.zombieSize,
          document.getElementById("zombie1") as HTMLCanvasElement,
          this.canvas,
          this.hero,
          this,
        );
        this.zombiesT1.push(zombie);
        break;
      }
      case "zombiesT2": {
        const zombie = new ZombieT2(
          xCoord,
          yCoord,
          Zombie.zombieSize,
          Zombie.zombieSize,
          document.getElementById("zombie2") as HTMLCanvasElement,
          this.canvas,
          this.hero,
          this,
        );
        this.zombiesT2.push(zombie);
        break;
      }
      case "zombiesT3": {
        const zombie = new ZombieT3(
          xCoord,
          yCoord,
          Zombie.zombieSize,
          Zombie.zombieSize,
          document.getElementById("zombie3") as HTMLCanvasElement,
          this.canvas,
          this.hero,
          this,
        );
        this.zombiesT3.push(zombie);
        break;
      }
      case "zombiesT4": {
        const zombie = new ZombieT4(
          xCoord,
          yCoord,
          Zombie.zombieSize,
          Zombie.zombieSize,
          document.getElementById("zombie4") as HTMLCanvasElement,
          this.canvas,
          this.hero,
          this,
        );
        this.zombiesT4.push(zombie);
        break;
      }
    }
  }
  /**
   * factory method that picks which buff to spawn, the parameters are all random and are obtained from the randomZombie method
   */
  private buffFactory(buffType: string, xCoord: number, yCoord: number): void {
    switch (buffType) {
      case "dmgBuff": {
        const buff = new DmgBuff(
          xCoord,
          yCoord,
          Buff.buffSize,
          Buff.buffSize,
          document.getElementById("dmgBuff") as HTMLCanvasElement,
          this.canvas,
          this.hero,
          this,
        );
        this.dmgBuff.push(buff);
        break;
      }
      case "hpBuff": {
        const buff = new HpBuff(
          xCoord,
          yCoord,
          Buff.buffSize,
          Buff.buffSize,
          document.getElementById("hpBuff") as HTMLCanvasElement,
          this.canvas,
          this.hero,
          this,
        );
        this.hpBuff.push(buff);
        break;
      }
      case "instaCureBuff": {
        const buff = new InstaCureBuff(
          xCoord,
          yCoord,
          Buff.buffSize,
          Buff.buffSize,
          document.getElementById("cureBuff") as HTMLCanvasElement,
          this.canvas,
          this.hero,
          this,
        );
        this.instaCureBuff.push(buff);
        break;
      }
    }
  }
  private randomBuff(): void {
    const randomBuff = Math.floor(Math.random() * this.buffTypes.length);
    // Spawns a random x and y value, we subtract the buffSize so it does not spawn a bit outside of the border since it starts spawning from the top left
    const randomX = Math.floor(Math.random() * (GameMap.width - Buff.buffSize));
    // makes sure it cant spawn halfway out the border
    const randomY = Math.floor(
      Math.random() * (GameMap.height - Buff.buffSize),
    );
    // Makes a buff and the type is based on the random number we got which gets picked from the array of buff types
    this.buffFactory(this.buffTypes[randomBuff], randomX, randomY);
  }

  private randomZombie(): void {
    const randomZombie = Math.floor(Math.random() * this.zombieTypes.length);
    // Creates a random x and y value for the zombie, we subtract the zombie size so it does not spawn a bit outside of the border since it starts spawning from the top left
    const randomX = Math.floor(
      Math.random() * GameMap.width - Zombie.zombieSize,
    );
    const randomY = Math.floor(
      Math.random() * GameMap.height - Zombie.zombieSize,
    );
    // Makes a zombie and the type is based on the random number we got which gets picked from the array of zombie types
    this.zombieFactory(this.zombieTypes[randomZombie], randomX, randomY);
  }
  /**
   * @ isHit- we keep track of when a projectile hits a zombie so we do not have to check if that current projectile has hit other zombies since we know it has already hit one and will dissapear
   */
  private detectBallZombieCollision(): void {
    let isHit: boolean = false;
    // we check every single projectile and compare it to every single zombie to see if any projectiles has hit any zombies
    for (let i = 0; i < this.projectiles.length; i++) {
      // we go through the array of zombie types so we can instantly reference the current zombie type array to make the code less dry
      for (let j = 0; j < this.zombieTypes.length; j++) {
        for (let z = 0; z < this[this.zombieTypes[j]].length; z++) {
          // makes sure if any part of the projectile has touched any part of the zombie, so it has a proper hitbox
          if (
            this.projectiles[i].x >= this[this.zombieTypes[j]][z].x &&
            this.projectiles[i].x <=
              this[this.zombieTypes[j]][z].x +
                this[this.zombieTypes[j]][z].width &&
            this.projectiles[i].y >= this[this.zombieTypes[j]][z].y &&
            this.projectiles[i].y <=
              this[this.zombieTypes[j]][z].y +
                this[this.zombieTypes[j]][z].height
          ) {
            if (this.hero.instaCure() == true) {
              // Gets rid of all the health the zombie has which makes the health 0
              this[this.zombieTypes[j]][z].handleHealth(
                this[this.zombieTypes[j]][z].health,
              );
            } else {
              this[this.zombieTypes[j]][z].handleHealth(this.hero.damage); 
            }
            this.projectiles.splice(i, 1);
            this[this.zombieTypes[j]][z].checkDeath(j, z);
            isHit = true;
            break;
          }
        }
        // we break out of the zombie for loops since the projectile is now not there anymore so we will move on to the next projectile
        if (isHit == true) {
          isHit = false;
          break;
        }
      }
    }
  }
  /**
   * This draws every property that will be shown inside of the game, this is used as we need to redraw everytime as everything is always getting updated
   */
  private drawEverything(): void {
    this.gameMap.background.draw();
    this.hero.draw();
    this.hero.rotateWand();

    for (let i = 0; i < this.zombieTypes.length; i++) {
      for (let j = 0; j < this[this.zombieTypes[i]].length; j++) {
        this[this.zombieTypes[i]][j].draw();
      }
    }
    for (let i = 0; i < this.projectiles.length; i++) {
      this.projectiles[i].draw(this.deltaTime);
    }

    for (let i = 0; i < this.buffTypes.length; i++) {
      for (let j = 0; j < this[this.buffTypes[i]].length; j++) {
        this[this.buffTypes[i]][j].draw();
      }
    }
  }

  public get zombiesT1(): ZombieT1[] {
    return this._zombiesT1;
  }
  public get zombiesT2(): ZombieT2[] {
    return this._zombiesT2;
  }
  public get zombiesT3(): ZombieT3[] {
    return this._zombiesT3;
  }
  public get zombiesT4(): ZombieT4[] {
    return this._zombiesT4;
  }
  public get projectiles(): Projectile[] {
    return this._projectiles;
  }
  public get dmgBuff(): DmgBuff[] {
    return this._dmgBuff;
  }
  public get hpBuff(): HpBuff[] {
    return this._hpBuff;
  }
  public get instaCureBuff(): InstaCureBuff[] {
    return this._instaCureBuff;
  }
  public get zombieTypes(): string[] {
    return this._zombieTypes;
  }
  public set cureCount(value: number) {
    this._cureCount = value;
  }
  public get cureCount(): number {
    return this._cureCount;
  }

  private checkHeroBuffCollision(): void {
    // we go through the array of buff types so we can instantly reference the current buff type array to make the code less dry
    for (let i = 0; i < this.buffTypes.length; i++) {
      for (let j = 0; j < this[this.buffTypes[i]].length; j++) {
        // checks if any part of the hero has touched any part of the current buff, so it has a proper hitbox
        if (
          this[this.buffTypes[i]][j].x < this.hero.x + this.hero.width &&
          this[this.buffTypes[i]][j].x + this[this.buffTypes[i]][j].width >
            this.hero.x &&
          this[this.buffTypes[i]][j].y < this.hero.y + this.hero.height &&
          this[this.buffTypes[i]][j].y + this[this.buffTypes[i]][j].height >
            this.hero.y
        ) {
          this[this.buffTypes[i]][j].giveBuff();
          this[this.buffTypes[i]].splice(j, 1);
        }
      }
    }
  }
  private checkZombieHeroCollision(): void {
    // we go through the array of zombie types so we can instantly reference the current zombie type array to make the code less dry
    for (let i = 0; i < this.zombieTypes.length; i++) {
      for (let j = 0; j < this[this.zombieTypes[i]].length; j++) {
        // checks if any part of the zombie has touched any part of the hero, so it has a proper hitbox
        if (
          this.hero.x <
            this[this.zombieTypes[i]][j].x +
              this[this.zombieTypes[i]][j].width &&
          this.hero.x + this.hero.width > this[this.zombieTypes[i]][j].x &&
          this.hero.y <
            this[this.zombieTypes[i]][j].y +
              this[this.zombieTypes[i]][j].height &&
          this.hero.y + this.hero.height > this[this.zombieTypes[i]][j].y
        ) {
          this[this.zombieTypes[i]][j].dealDamage();
          this[this.zombieTypes[i]].splice(j, 1);
        }
      }
    }
  }
  /**
   * We check if any part of the ball is outside of the border, since the projectile goes on even outside of the game screen, we need to make sure it gets removed once it goes outside of the map
   */
  private checkBallBounds(): void {
    for (let i = 0; i < this.projectiles.length; i++) {
      if (
        this.projectiles[i].x > GameMap.width ||
        this.projectiles[i].x < 0 ||
        this.projectiles[i].y > GameMap.height ||
        this.projectiles[i].y < 0
      ) {
        this.projectiles.splice(i, 1);
      }
    }
  }
  private gameOverCheck(): void {
    if (this.hero.hp <= 0) {
      clearInterval(this.gameInterval);
      this.system.endGame(this._cureCount);
    }
  }
}
