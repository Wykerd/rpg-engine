import { DialogueAnimationLoopType } from "../dialogue/types";

export interface DialogueBubbleOptions {
    loop: DialogueAnimationLoopType,
    pause: number,
    transition: number,
    padding: number,
}