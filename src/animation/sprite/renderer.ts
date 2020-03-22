import { SpriteAnimation } from ".";
import { DrawPosition } from "../../core/types";
import { DynamicRenderer } from "../../core/renderer";
import { SpriteStore, Sprite } from '../../sprites';

export default class AnimatedSpriteRenderer extends DynamicRenderer {
    public readonly animation : SpriteAnimation;
    private startDelta : number = -1;

    constructor (ctx: CanvasRenderingContext2D, animation : SpriteAnimation) {
        super(ctx)
        this.animation = animation;
        this.animation.keyframes = this.animation.keyframes.sort((a, b)=> a.frame - b.frame);
    }

    public draw(delta: number, position: DrawPosition) : Sprite[] {
        const ms = delta - this.startDelta;
        // Get current frame number
        const frame = ms * (this.animation.fps / 1000);
        // Check if animation is completed
        if (frame > this.animation.frames) {
            this.startDelta = delta;
            return this.draw(delta, position);
        }
        // Get current keyframe
        const keyframe = this.animation.keyframes.filter(k => k.frame <= frame).pop();
        // If no frames exit;
        if (!keyframe) return [];
        // Now render the layers
        const { layers } = keyframe;
        // render each sprite in order of the array
        for (const layer of layers) {
            SpriteStore.getInstance().get(layer.rendererId).draw(layer.id, position);
        }
        // return the rendered layers
        return layers;
    }
}