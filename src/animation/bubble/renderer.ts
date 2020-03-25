import { DynamicRenderer } from "../../core/renderer";
import { DrawPosition, HorizontalEgde, VericalEdge, Point } from "../../core/types";
import { BubbleAnimation } from "./types";

export default class BubbleRenderer extends DynamicRenderer {
    public readonly animation : BubbleAnimation;
    private startDelta: number = -1;

    constructor (ctx: CanvasRenderingContext2D, animation: BubbleAnimation) {
        super(ctx);
        this.animation = animation;
    }

    public draw (delta: number, position: DrawPosition) : void {
        let ms = delta - this.startDelta;
        // If first render startDelta is -1 so set to first frame
        if (this.startDelta === -1) {
            this.startDelta = delta;
            return this.draw(delta, position);
        }
        // now render the bubble
        // get the corner radii
        const rad_tl = this.animation.corner([HorizontalEgde.top, VericalEdge.left], ms);
        const rad_tr = this.animation.corner([HorizontalEgde.top, VericalEdge.right], ms);
        const rad_bl = this.animation.corner([HorizontalEgde.bottom, VericalEdge.left], ms);
        const rad_br = this.animation.corner([HorizontalEgde.bottom, VericalEdge.right], ms);
        
        // get the lengths
        const len_t = position.width - rad_tl - rad_tr;
        const len_b = position.width - rad_bl - rad_br;
        const len_r = position.height - rad_tr - rad_br;
        const len_l = position.height - rad_tl - rad_bl;

        this.ctx.beginPath();

        let nextPoint : Point;
        let lastPoint : Point = {
            x: 0,
            y: 0
        };
        
        // draw top
        for (let i = 0; i < len_t; i++) {
            const pos = this.animation.horizontal({x: i, y: 0}, ms, len_t, HorizontalEgde.top);
            this.ctx.lineTo(pos.x + rad_tl + position.x, pos.y + position.y);
            lastPoint = pos;
        }

        // next point
        nextPoint = this.animation.vertical({ x: position.width, y: 0 }, ms, len_r, VericalEdge.right);

        // draw tr corner
        this.ctx.quadraticCurveTo(
            nextPoint.x + position.x, lastPoint.y + position.y, 
            nextPoint.x + position.x, nextPoint.y + rad_tr + position.y
        );

        // draw right
        for (let i = 0; i < len_r; i++) {
            const pos = this.animation.vertical({ x: position.width, y: i }, ms, len_r, VericalEdge.right);
            this.ctx.lineTo(pos.x + position.x, pos.y + rad_tr + position.y);
            lastPoint = pos;
        }

        // get next point
        nextPoint = this.animation.horizontal({x: len_b - 1, y: position.height}, ms, len_b, HorizontalEgde.bottom);

        // draw br corner
        this.ctx.quadraticCurveTo(
            lastPoint.x + position.x, nextPoint.y + position.y,
            nextPoint.x + rad_bl + position.x, nextPoint.y + position.y
        );

        // draw bottom
        for (let i = len_b - 1; i >= 0; i--) {
            const pos = this.animation.horizontal({x: i, y: position.height}, ms, len_b, HorizontalEgde.bottom);
            this.ctx.lineTo(pos.x + rad_bl + position.x, pos.y + position.y);
            lastPoint = pos;
        }

        // get next point
        nextPoint = this.animation.vertical({ x: 0, y: len_l - 1 }, ms, len_r, VericalEdge.left);

        // draw bl corner
        this.ctx.quadraticCurveTo(
            nextPoint.x + position.x, lastPoint.y + position.y,
            nextPoint.x + position.x, nextPoint.y + rad_tl + position.y
        );

        // draw left
        for (let i = len_l - 1; i >= 0; i--) {
            const pos = this.animation.vertical({ x: 0, y: i }, ms, len_r, VericalEdge.left);
            this.ctx.lineTo(pos.x + position.x, pos.y + rad_tl + position.y);
            lastPoint = pos;
        }

        // next point is first point!
        nextPoint = this.animation.horizontal({x: 0, y: 0}, ms, len_t, HorizontalEgde.top)

        // draw tl corner
        this.ctx.quadraticCurveTo(
            lastPoint.x + position.x, nextPoint.y + position.y,
            nextPoint.x + rad_tl + position.x, nextPoint.y + position.y
        );

        // terminate and done
        this.animation.terminator(this.ctx, ms);
    }
}