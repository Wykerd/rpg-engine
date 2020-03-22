import { DrawPosition } from "./types";

export abstract class RendererBase {
    public readonly ctx : CanvasRenderingContext2D;

    constructor (ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }
}

export abstract class DynamicRenderer extends RendererBase {
    abstract draw(delta: number, position: DrawPosition) : any;
}

export abstract class StaticRenderer extends RendererBase {
    abstract draw(position: DrawPosition) : any;
}