import { DynamicRenderer } from "../../core/renderer";
import { DialogueRenderer } from "../dialogue";
import { BubbleRenderer } from "../bubble";
import { DrawPosition } from "../../core/types";
import { DialogueBubbleOptions } from "./types";
import { DialogueAnimationLoopType } from "../dialogue/types";

export default class DialogueBubbleRenderer extends DynamicRenderer {
    public readonly dialogue : DialogueRenderer;
    public readonly bubble : BubbleRenderer;
    public readonly options : DialogueBubbleOptions;
    private frameDuration : number = -1;
    private index : number = 0;
    private startDelta : number = -1;

    constructor (ctx: CanvasRenderingContext2D, options: DialogueBubbleOptions, dialogue: DialogueRenderer, bubble: BubbleRenderer) {
        super(ctx);
        this.dialogue = dialogue;
        this.bubble = bubble;
        this.options = options;
        this.dialogue.animation.loop = DialogueAnimationLoopType.pause;
    }

    public draw(delta: number, position: DrawPosition) : void {
        const ms = delta - this.startDelta;
        // If first render startDelta is -1 so set to first frame
        if (this.startDelta === -1) {
            this.startDelta = delta;
            return this.draw(delta, position);
        }
        // init loop length
        if (this.frameDuration === -1) {
            this.frameDuration = this.dialogue.calculateFrameDuration();
        }
        // get actual render dimensions of current frame
        const pos = this.dialogue.getDimensions({
            x: position.x + this.options.padding,
            y: position.y + this.options.padding,
            height: position.height - (this.options.padding * 2),
            width: position.width - (this.options.padding * 2) 
        });
        // is last loop?
        const last = this.dialogue.animation.keyframes.length - 1 === this.dialogue.getLastFrame();
        // if frame not completed
        if (ms <= (this.frameDuration + this.options.pause)) {
            this.bubble.draw(delta, {
                x: position.x,
                y: position.y,
                height: pos.height + (this.options.padding * 2),
                width: pos.width + (this.options.padding * 2)
            });
            this.dialogue.draw(delta, pos);
        } else if (last) {
            // last frame not implimented :-)
            this.startDelta = delta;
            this.dialogue.goto(0);
            return this.draw(delta, position);
        } else if (ms <= (this.frameDuration + this.options.pause + this.options.transition)) {
            // how far is translation progressed
            const transitionPersentage = (ms - this.frameDuration - this.options.pause) / this.options.transition;
            // next frame dimensions
            const nextPos = this.dialogue.getDimensions({
                x: position.x + this.options.padding,
                y: position.y + this.options.padding,
                height: position.height - (this.options.padding * 2),
                width: position.width - (this.options.padding * 2) 
            }, this.dialogue.animation.keyframes[this.dialogue.getLastFrame() + 1]);
            // get difference
            const h_diff = (pos.height - nextPos.height) * transitionPersentage;
            const w_diff = (pos.width - nextPos.width) * transitionPersentage;
            // get current dimensions
            const currBubblePos = {
                x: position.x,
                y: position.y,
                height: pos.height + (this.options.padding * 2) - h_diff,
                width: pos.width + (this.options.padding * 2) - w_diff
            };
            // render the bubble
            this.bubble.draw(delta, currBubblePos);
        } else {
            // move on to the next frame
            this.startDelta = delta;
            this.dialogue.goto(this.dialogue.getLastFrame() + 1);
            return this.draw(delta, position);
        }
    }
}