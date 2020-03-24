import { AnimationLoopType } from "../types";
import { DrawPosition, TextFont } from "../../core/types";

export interface DialogueRenderContext {
    position: DrawPosition, 
    boundries: DrawPosition, 
    index: number, 
    ms: number, 
    ctx: CanvasRenderingContext2D
}

export interface DialogueAnimationText {
    speed?: number, // individual dialog speed override
    text: string,
    font?: TextFont, // override to default
    prerender?: (context: DialogueRenderContext) => DrawPosition;
    // override letter positions for more complex animations
    pause?: number // pause between dialogs
}

export interface DialogueAnimation {
    speed?: number, // individual dialog speed override
    content: DialogueAnimationText[],
    font?: TextFont, // override to default
    pause?: number // pause between dialogs
}

export interface DialogueAnimationSequence {
    keyframes: DialogueAnimation[],
    loop: AnimationLoopType,
    speed: number, // global speed
    pause?: number, // global pause default 0
    font?: TextFont, // canvas font string
    id: string
}