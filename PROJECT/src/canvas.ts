/** 
* This is the class that creates the actual screen of the game for the players, the size listed here is also the size of the start and end menu and overall this determines the size of the actual game
*/
class Canvas {
  private _clientX: number;
  private _clientY: number;
  private _height: number = 900;
  private _width: number = 1800;
  private _element: HTMLCanvasElement;
  private _context: CanvasRenderingContext2D;
  private _game: Game;
  private _controller: Controller;
  private _gameMap: GameMap;
  constructor() {
    this._element = document.getElementById("screen") as HTMLCanvasElement;
    this._element.height = this._height;
    this._element.width = this._width;
    const boundingRect = this.element.getBoundingClientRect();
    // gets the x and y position of the canvas
    this._clientX = boundingRect.x;
    this._clientY = boundingRect.y;

    this._controller = new Controller(this);

    this._context = this._element.getContext("2d");
  }

  /**
   * Starts the game by creating the nessecary classes.
   * The rest of the starting process is done in the classes.
   */
  public runGame(system: System): void {
    this._game = new Game(this, system);
    this._gameMap = new GameMap(this);
  }

  public get gameMap(): GameMap {
    return this._gameMap;
  }
  public get game(): Game {
    return this._game;
  }
  public get height(): number {
    return this._height;
  }

  public get width(): number {
    return this._width;
  }

  public get controller(): Controller {
    return this._controller;
  }

  public get clientX(): number {
    return this._clientX;
  }

  public get clientY(): number {
    return this._clientY;
  }

  public get element(): HTMLCanvasElement {
    return this._element;
  }

  public get context(): CanvasRenderingContext2D {
    return this._context;
  }
}
