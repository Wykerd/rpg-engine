import { DynamicRenderer } from "../../core/renderer";
import { DialogueAnimation, DialogueRenderState } from "./types";
import { DrawPosition, Point } from "../../core/types";
import debug from "../../core/debug";

export default class DialogueRenderer extends DynamicRenderer {
    public readonly animation : DialogueAnimation;
    private startDelta : number = -1;
    private preRenderState: DialogueRenderState = {
        frame: 0,
        text: [''],
        delta: 0
    };
    public reverse : boolean = false;

    constructor(ctx: CanvasRenderingContext2D, animation: DialogueAnimation) {
        super(ctx);
        this.animation = animation;
    }

    public draw(delta: number, position: DrawPosition) : DialogueRenderState {
        let ms = delta - this.startDelta;
        // If first render startDelta is -1 so set to first frame
        if (this.startDelta === -1) {
            this.startDelta = delta;
            return this.draw(delta, position);
        }
        // get frame
        const frame = this.animation.keyframes[this.preRenderState.frame];
        // get duration of frame
        const frameDuration = (frame.speed ?? this.animation.speed) * frame.text.length + (frame.pause ?? this.animation.pause ?? 0);
        // check if done
        if (ms > frameDuration) {
            // move to next frame
            // TODO
            ms = frameDuration;
        }
        // set font
        this.ctx.font = frame.font || this.animation.font || '10px sans-serif';
        // word wrap
        const words = frame.text.split(' ');
        
        const render : string[][] = [[]];

        let line = 0;
        let totalWidth = 0;
        const fontMetrics = this.ctx.measureText(' ');
        const spaceLength = fontMetrics.width;
        
        words.forEach(word => {
            const width = this.ctx.measureText(word).width;
            if (width + totalWidth > position.width) {
                if (render[line].length === 0) {
                    render[line].push(word);
                    line++;
                } else {
                    line++;
                    totalWidth = width + spaceLength;
                    render[line] = [word];
                }
            } else {
                totalWidth += width + spaceLength;
                render[line].push(word);
            }
        });
        // end word wrap
        // get character index
        let index = Math.floor(ms / (frame.speed ?? this.animation.speed));
        // pause
        if (index > frame.text.length) index = frame.text.length;
        // get string
        const renderText = frame.text.substr(0, index).split(' ');
        // find position in render
        const pt : Point = {
            x: -1,
            y: 0
        };

        for (let i = 0; i < renderText.length; i++) {
            pt.x++;
            if (render[pt.y].length - 1 < pt.x) {
                pt.x = 0;
                pt.y++;
            }
        }
        // get length of last word
        const finalIndexLength = renderText[renderText.length - 1].length;
        // vars for render
        let characterIndex = 0;
        const fontHeight = fontMetrics.fontBoundingBoxAscent + fontMetrics.fontBoundingBoxDescent;
        // finally render
        for (let y = 0; y <= pt.y; y++) {
            let width = 0;
            const xl = y === pt.y ? pt.x + 1 : render[y].length;
            for (let x = 0; x < xl; x++) {
                let str = render[y][x];
                if ((x === pt.x) && (y === pt.y)) str = str.substr(0, finalIndexLength);
                const word = str.split('');
                for (let i = 0; i < word.length; i++) {
                    const char = word[i];
                    characterIndex ++;
                    const charLength = this.ctx.measureText(char).width;
                    // calculate the character position
                    const calcPos : DrawPosition = {
                        x: width,
                        y: 100 * (y + 1),
                        width: charLength,
                        height: 10
                    };
                    // get mutated position
                    let finalPos : DrawPosition = calcPos;
                    if (frame.position instanceof Function) {
                        finalPos = frame.position(calcPos, characterIndex, ms);
                    };
                    width += finalPos.width;
                    // draw the dang character
                    this.ctx.fillText(char, finalPos.x, finalPos.y);
                }
                // add space
                width += spaceLength;
            }
        }

        this.preRenderState = {
            frame: this.preRenderState.frame,
            text: renderText,
            delta: ms
        };

        return this.preRenderState;
    }

    public getPreviousRenderState() {
        return this.preRenderState;
    }

    public goto(frame: number) {
        if (this.animation.keyframes.length < frame) {
            const err = new Error('Attemted to goto frame out of range!')
            debug.error(err);
            throw err;
        }
        this.preRenderState = {
            frame,
            text: [''],
            delta: 0
        }
    };
}