import { DrawPosition, TextFont } from "./types";

export abstract class RendererBase {
    public readonly ctx : CanvasRenderingContext2D;

    constructor (ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    setFont (font: TextFont) {
        this.ctx.fillStyle = font.fillStyle || '#000';
        this.ctx.font = font.font || '10px sans-serif';
    }
}

export abstract class DynamicRenderer extends RendererBase {
    abstract draw(delta: number, position: DrawPosition) : any;
}

export abstract class StaticRenderer extends RendererBase {
    abstract draw(position: DrawPosition) : any;
}