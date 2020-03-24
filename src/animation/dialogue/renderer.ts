import { DynamicRenderer } from "../../core/renderer";
import { DialogueAnimationSequence, DialogueAnimationText } from "./types";
import { DrawPosition, Point } from "../../core/types";
import debug from "../../core/debug";
import { AnimationLoopType } from "../types";

export default class DialogueRenderer extends DynamicRenderer {
    public readonly animation : DialogueAnimationSequence;
    private startDelta : number = -1;
    private currentFrame : number = 0;

    constructor(ctx: CanvasRenderingContext2D, animation: DialogueAnimationSequence) {
        super(ctx);
        this.animation = animation;
    }

    public calculateFrameDuration(frame = this.animation.keyframes[this.currentFrame]) : number {
        let duration = 0;
        frame.content.forEach(text => {
            duration += 
                (text.speed ?? frame.speed ?? this.animation.speed) * 
                text.text.length + 
                (text.pause ?? frame.pause ?? this.animation.pause ?? 0);
        });
        return duration;
    }

    public draw(delta: number, position: DrawPosition) : void {
        let ms = delta - this.startDelta;
        // If first render startDelta is -1 so set to first frame
        if (this.startDelta === -1) {
            this.startDelta = delta;
            return this.draw(delta, position);
        }
        // get frame
        const frame = this.animation.keyframes[this.currentFrame];
        // get duration of frame
        const frameDuration = this.calculateFrameDuration();
        // check if done
        if (ms > frameDuration) {
            // move to next frame
            // TODO
            const nextFrameIndex = this.currentFrame + 1; 
            if (this.animation.keyframes.length - 1 < nextFrameIndex) {
                // last frame
                if (this.animation.loop === AnimationLoopType.once) {
                    // hold on final frame
                    ms = frameDuration;
                } else {
                    this.startDelta = delta;
                    this.currentFrame = 0;
                    return this.draw(delta, position);
                }
            } else {
                // continue to next frame
                this.startDelta = delta;
                this.currentFrame = nextFrameIndex;
                return this.draw(delta, position);
            }
        }
        // Get the all the text to render
        let passed = 0;
        const completeText = frame.content.filter(txt => {
            if (passed >= ms) return false;
            passed += 
                (txt.speed ?? frame.speed ?? this.animation.speed) * 
                txt.text.length + 
                (txt.pause ?? frame.pause ?? this.animation.pause ?? 0);
            return true;
        });
        const lastText = completeText.pop();
        // time till last text complete
        const ttc = passed - ms;
        // calculate string of last completed
        let finalStr = lastText?.text || '';
        finalStr = finalStr.substr(0, finalStr.length - ((ttc - (lastText?.pause || 0)) / (lastText?.speed ?? frame.speed ?? this.animation.speed)));
        // get the last word in full
        const finalWord = (lastText?.text || '').split(' ')[finalStr.split(' ').length - 1];
        // final text
        const finalText : DialogueAnimationText = {
            speed: lastText?.speed,
            text: finalStr,
            font: lastText?.font,
            prerender: lastText?.prerender,
            pause: lastText?.pause
        };
        // cursor tells us where to render next text
        const cursor : Point = {
            x: 0,
            y: 0
        }
        // indexes + contexts
        let charIndex = 0;
        let preHeight = 0;
        // set context text baseline
        this.ctx.textBaseline = 'top';
        // space width
        // render the completed text
        const render = [...completeText, finalText];
        const lastIndex = render.length - 1;

        render.forEach((txt, txtIndex) => {
            const words = txt.text.split(' ');

            // Load the font
            this.setFont(Object.assign({}, this.animation.font, frame.font, txt.font) || {});

            words.forEach((str, strIndex) => {
                const length = this.ctx.measureText(str.split('\n').shift() || '').width;
                // move down a line if cant fit
                if ((length > (position.width - cursor.x)) && (cursor.x > 0)) {
                    cursor.y += preHeight;
                    cursor.x = 0;
                };
                // check if final word fits
                if (txtIndex === lastIndex) {
                    if (words.length - 1 === strIndex) {
                        if ((this.ctx.measureText(finalWord.split('\n').shift() || '').width > (position.width - cursor.x)) && (cursor.x > 0)) {
                            cursor.y += preHeight;
                            cursor.x = 0;
                        }
                    }
                }
                // render it
                str.split('').forEach((char, subStrCharIndex) => {
                    if (char === '\n') {
                        cursor.x = 0;
                        cursor.y += txt.font?.height || frame.font?.height || this.animation.font?.height || 12;
                        return;
                    }
                    const charWidth = this.ctx.measureText(char).width;
                    const calculatedPos : DrawPosition = {
                        x: cursor.x,
                        y: cursor.y,
                        width: charWidth,
                        height: txt.font?.height || frame.font?.height || this.animation.font?.height || 12
                    };
                    let finalPos : DrawPosition = calculatedPos;
                    
                    if (txt.prerender instanceof Function) finalPos = txt.prerender({
                        position: calculatedPos, 
                        index: charIndex, 
                        ms: delta - this.startDelta, 
                        ctx: this.ctx, 
                        boundries: position
                    });
                    
                    this.ctx.fillText(char, finalPos.x + position.x, finalPos.y + position.y, position.width);

                    // move the cursor
                    cursor.x += finalPos.width;
                    charIndex++;
                });
                // add space after word
                cursor.x += this.ctx.measureText(' ').width;
                preHeight = txt.font?.height || frame.font?.height || this.animation.font?.height || 12;
            });
            cursor.x -= this.ctx.measureText(' ').width;
        })
    }

    public getLastFrame() {
        return this.currentFrame;
    }

    public goto(frame: number) {
        if (this.animation.keyframes.length < frame) {
            const err = new Error('Attemted to goto frame out of range!')
            debug.error(err);
            throw err;
        }
        this.currentFrame = frame;
        // init state
        this.startDelta = -1;
    };
}