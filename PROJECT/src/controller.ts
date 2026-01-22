/**
 * This class is used to detect inputs from the user.
 * @_mouseXMove - Used to store the x-coordinate of the mouse for moving event. A different variable is needed for this because the buttons will auto-click when cursor hovers over them.
 * @_mouseYMove - Used to store the y-coordinate of the mouse for moving event. A different variable is needed for this because the buttons will auto-click when cursor hovers over them.
 */

class Controller {
  private _A: boolean = false;
  private _D: boolean = false;
  private _S: boolean = false;
  private _W: boolean = false;
  private _mouseX: number;
  private _mouseY: number;
  private _mouseXMove: number;
  private _mouseYMove: number;
  private _isClicked: boolean = false;
  constructor(private canvas: Canvas) {
    //mouse
    document.addEventListener("click", (event) => this.handleMouseClick(event));
    document.addEventListener("mousemove", (e: MouseEvent) => this.cursor(e));
    //keyboards
    document.addEventListener("keydown", (event) => this.handleKeyDown(event));
    document.addEventListener("keyup", (event) => this.handleKeyUp(event));
  }

  private handleMouseClick(event: MouseEvent): void {
    //set it to true so hero can shoot since based on frames
    this._isClicked = true;
    this._mouseX = event.clientX;
    this._mouseY = event.clientY;
  }

  private cursor(e: MouseEvent): void {
    const rect = document.getElementById("screen").getBoundingClientRect();
    //updates mouse position
    this._mouseXMove = e.clientX - rect.left;
    this._mouseYMove = e.clientY - rect.top;
  }
  private handleKeyDown(event: KeyboardEvent): void {
    if (event.key === "a") {
      this._A = true;
    }
    if (event.key === "d") {
      this._D = true;
    }
    if (event.key === "s") {
      this._S = true;
    }
    if (event.key === "w") {
      this._W = true;
    }
  }

  private handleKeyUp(event: KeyboardEvent): void {
    if (event.key === "a") {
      this._A = false;
    }
    if (event.key === "d") {
      this._D = false;
    }
    if (event.key === "w") {
      this._W = false;
    }
    if (event.key === "s") {
      this._S = false;
    }
  }

  public get A(): boolean {
    return this._A;
  }

  public get isClicked(): boolean {
    return this._isClicked;
  }
  public get D(): boolean {
    return this._D;
  }
  public get S(): boolean {
    return this._S;
  }

  public get W(): boolean {
    return this._W;
  }

  public get mouseX(): number {
    return this._mouseX;
  }

  public get mouseY(): number {
    return this._mouseY;
  }

  public get mouseXMove(): number {
    return this._mouseXMove;
  }

  public get mouseYMove(): number {
    return this._mouseYMove;
  }

  public set isClicked(bool: boolean) {
    this._isClicked = bool;
  }
}
