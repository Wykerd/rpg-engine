import { SpriteAnimation } from ".";
import { DrawPosition } from "../../core/types";
import { DynamicRenderer } from "../../core/renderer";
import { SpriteStore, Sprite } from '../../sprites';
import { AnimationLoopType } from "../types";

export default class AnimatedSpriteRenderer extends DynamicRenderer {
    public readonly animation : SpriteAnimation;
    private startDelta : number = -1;
    public reverse : boolean = false;

    constructor (ctx: CanvasRenderingContext2D, animation : SpriteAnimation) {
        super(ctx)
        this.animation = animation;
        this.animation.keyframes = this.animation.keyframes.sort((a, b)=> a.frame - b.frame);
    }

    public draw(delta: number, position: DrawPosition) : Sprite[] {
        const ms = delta - this.startDelta;
        // Get current frame number
        let frame = ms * (this.animation.fps / 1000);
        // If first render startDelta is -1 so set to first frame
        if (this.startDelta === -1) {
            this.startDelta = delta;
            return this.draw(delta, position);
        }
        // Check if animation is completed
        if (frame > this.animation.frames) {
            // Reverse animation if oscillate
            if (this.animation.loop === AnimationLoopType.oscillate) this.reverse = !this.reverse;
            if (this.animation.loop !== AnimationLoopType.once) {
                // loop the animation if not set to cycle once only
                this.startDelta = delta;
                return this.draw(delta, position);
            }
            // Keep on last frame if not looping
            frame = this.animation.frames; 
        };
        // Reverse the frames if spesified
        if (this.reverse) frame = this.animation.frames - frame;
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