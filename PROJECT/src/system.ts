/** 
* This is the class where it starts as soon as the website loads, and takes control of everything in the very beginning it is in charge of making the canvas which will then make everything else
*/
class System {
  private canvas = new Canvas();
  private interval: NodeJS.Timeout;
  private controller: Controller;
  private ui: MenuUserInterface;
  static readonly fps: number = 60;

  constructor() {
    this.startSystem();
  }

  private checkClicksStart(): void {
    // checks if the user clicks on the start button
    if (
      this.controller.mouseX >= this.ui.startButton.x &&
      this.controller.mouseX <=
        this.ui.startButton.x + this.ui.startButton.width &&
      this.controller.mouseY >= this.ui.startButton.y &&
      this.controller.mouseY <=
        this.ui.startButton.y + this.ui.startButton.height &&
      this.controller.isClicked == true
    ) {
      clearInterval(this.interval);
      this.canvas.runGame(this);
    }
  }

  private checkClicksEnd(): void {
    // checks if the user clicks on the end buttons
    if (
      this.controller.mouseX >= this.ui.restartButton.x &&
      this.controller.mouseX <=
        this.ui.restartButton.x + this.ui.restartButton.width &&
      this.controller.mouseY >= this.ui.restartButton.y &&
      this.controller.mouseY <=
        this.ui.restartButton.y + this.ui.restartButton.height &&
      this.controller.isClicked == true
    ) {
      clearInterval(this.interval);
      this.canvas.runGame(this);
    }
    
    if (
      this.controller.mouseX >= this.ui.quitButton.x &&
      this.controller.mouseX <=
        this.ui.quitButton.x + this.ui.quitButton.width &&
      this.controller.mouseY >= this.ui.quitButton.y &&
      this.controller.mouseY <=
        this.ui.quitButton.y + this.ui.quitButton.height &&
      this.controller.isClicked == true
    ) {
      // if you quit the game, you would go back to the start menu
      this.startSystem();
    }
  }

  private startSystem(): void {
    this.controller = new Controller(this.canvas);
    this.ui = new MenuUserInterface(this.canvas, this);
    clearInterval(this.interval);
    this.ui.drawStartMenu();
    this.interval = setInterval(
      () => {
        this.checkClicksStart();
      },
      Math.floor(1000 / System.fps),
    );
  }

  public endGame(totalCured: number): void {
    this.canvas = new Canvas();
    this.controller = new Controller(this.canvas);
    this.ui.drawEndMenu(totalCured);
    this.interval = setInterval(
      () => {
        this.checkClicksEnd();
      },
      Math.floor(1000 / System.fps),
    );
  }
}

new System();
