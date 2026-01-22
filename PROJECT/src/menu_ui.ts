/**
 * This class handles the drawing on the canvas needed for the system to work.
 */
class MenuUserInterface {
  private canvas: Canvas;
  private system: System;
  private _quitButton: Picture;
  private _startButton: Picture;
  private _restartButton: Picture;
  private background: Picture;
  readonly buttonHeight: number = 50; //used for every button
  readonly buttonWidth: number = 200;

  constructor(canvas: Canvas, system: System) {
    this.canvas = canvas;
    this.system = system;

    //creates buttons
    this._quitButton = new Picture(
      this.canvas.width / 2 - this.buttonWidth / 2,
      this.canvas.height / 2 + 2, //adding 2 for padding
      this.buttonWidth,
      this.buttonHeight,
      document.getElementById("button") as HTMLCanvasElement,
      this.canvas,
    );

    this._startButton = new Picture(
      this.canvas.width / 2 - this.buttonWidth / 2,
      this.canvas.height / 2 - this.buttonHeight,
      this.buttonWidth,
      this.buttonHeight,
      document.getElementById("button") as HTMLCanvasElement,
      this.canvas,
    );

    this._restartButton = new Picture(
      this.canvas.width / 2 - this.buttonWidth / 2,
      this.canvas.height / 2 - this.buttonHeight,
      this.buttonWidth,
      this.buttonHeight,
      document.getElementById("button") as HTMLCanvasElement,
      this.canvas,
    );

    this.background = new Picture(
      0,
      0,
      this.canvas.width,
      this.canvas.height,
      document.getElementById("startBackground") as HTMLCanvasElement,
      this.canvas,
    );
  }

  /**
   * These fucntions draws elements based on the positions of the buttons. Some of the padding is hard coded to make the buttons look nice.
   */
  private drawStartButton(text: string): void {
    this.canvas.context.font = "60px Times New Roman";
    this.canvas.context.textAlign = "center";
    this.canvas.context.fillStyle = "white";
    this.canvas.context.fillText(
      text,
      this.startButton.x + this.startButton.width / 2,
      this.startButton.y - 10,
    );
    this.startButton.draw();
    this.canvas.context.font = "30px Times New Roman";
    this.canvas.context.textAlign = "center";
    this.canvas.context.fillStyle = "white";
    this.canvas.context.fillText(
      "Start",
      this.startButton.x + this.startButton.width / 2,
      this.startButton.y + this.startButton.height / 2 + 8,
    );
  }

  private drawRestartButton(text: string): void {
    this.canvas.context.font = "60px Times New Roman";
    this.canvas.context.textAlign = "center";
    this.canvas.context.fillStyle = "white";
    this.canvas.context.fillText(
      text,
      this.restartButton.x + this.restartButton.width / 2,
      this.restartButton.y - 10,
    );
    this.restartButton.draw();
    this.canvas.context.font = "30px Times New Roman";
    this.canvas.context.textAlign = "center";
    this.canvas.context.fillStyle = "white";
    this.canvas.context.fillText(
      "Restart?",
      this.restartButton.x + this.restartButton.width / 2,
      this.restartButton.y + this.restartButton.height / 2 + 8,
    );
  }

  private drawQuitButton(): void {
    this.quitButton.draw();
    this.canvas.context.font = "30px Times New Roman";
    this.canvas.context.textAlign = "center";
    this.canvas.context.fillStyle = "white";
    this.canvas.context.fillText(
      "Quit?",
      this.quitButton.x + this.quitButton.width / 2,
      this.quitButton.y + this.quitButton.height / 2 + 8,
    );
  }

  public drawStartMenu(): void {
    this.background.draw();
    this.drawStartButton("Welcome To Zombie Cure Game!");

    //description on the start menu
    this.canvas.context.font = "20px Times New Roman";
    this.canvas.context.textAlign = "center";
    this.canvas.context.fillStyle = "white";
    this.canvas.context.fillText(
      "Zombies are all around the world, your task is to save the zombies and cure them back into humans!",
      this.startButton.x + this.startButton.width / 2,
      this.startButton.y + this.startButton.height + 20,
    );
  }

  public drawEndMenu(totalCured: number): void {
    this.background.draw();
    this.drawRestartButton("YOU BECAME A ZOMBIE!");

    this.drawQuitButton();
    this.canvas.context.font = "40px Times New Roman";
    this.canvas.context.textAlign = "center";
    this.canvas.context.fillStyle = "white";
    this.canvas.context.fillText(
      "You saved " + totalCured + " Zombies.",
      this.quitButton.x + this.quitButton.width / 2,
      this.quitButton.y + this.quitButton.height + 40,
    );
  }

  public get quitButton(): Picture {
    return this._quitButton;
  }
  public get restartButton(): Picture {
    return this._restartButton;
  }
  public get startButton(): Picture {
    return this._startButton;
  }
}
