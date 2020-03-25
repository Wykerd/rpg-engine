export namespace BubbleTerminators {
    export const fill = (style : string | CanvasGradient | CanvasPattern) => (ctx: CanvasRenderingContext2D) => {
        ctx.fillStyle = style;
        ctx.fill();
    }
    
    export const stroke = (style : string | CanvasGradient | CanvasPattern) => (ctx: CanvasRenderingContext2D) => {
        ctx.strokeStyle = style;
        ctx.stroke();
    }
}
