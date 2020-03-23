import { AnimationLoopType } from "../types";
import { DrawPosition } from "../../core/types";

export interface DialogueAnimationFrame {
    speed?: number, // individual dialog speed override
    text: string,
    font?: string, // override to default
    position?: (position: DrawPosition, index: number, ms: number) => DrawPosition
    // override letter positions for more complex animations
    pause?: number // pause between dialogs
}

export interface DialogueAnimation {
    keyframes: DialogueAnimationFrame[],
    loop: AnimationLoopType,
    speed: number, // global speed
    pause?: number, // global pause default 0
    font?: string, // canvas font string
    id: string
}

export interface DialogueRenderState {
    frame: number,
    text: string[],
    delta: number
}