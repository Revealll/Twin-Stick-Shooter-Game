/** 
* This class contains the actual map of the whole entire game, where you cannot go outside of the map and everything in the game will be played inside these boundarys
@ _deltaX- The position on the x axis of the canvas relative to the game map, it is counted starting based on the top left of the game map
@ _deltaY- The position on the y axis of the canvas relative to the game map, it is counted starting based on the top left of the game map
*/
class GameMap {
  static readonly height: number = 2500;
  static readonly width: number = 4000;
  private _deltaX: number; 
  private _deltaY: number;
  private _background: Rect; 
  private canvas: Canvas;
  constructor(canvas: Canvas) {
    this.canvas = canvas;
    this._background = new Picture(
      0,
      0,
      GameMap.width,
      GameMap.height,
      document.getElementById("map") as HTMLCanvasElement,
      this.canvas,
    );
  }
  public get deltaY(): number {
    return this._deltaY;
  }

  public get deltaX(): number {
    return this._deltaX;
  }
  public get background(): Rect {
    return this._background;
  }
  public set deltaX(value: number) {
    this._deltaX = value;
  }
  public set deltaY(value: number) {
    this._deltaY = value;
  }
}
