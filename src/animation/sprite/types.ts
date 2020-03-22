import { Sprite } from "../../sprites";
import { AnimationLoopType } from "../types";

export interface SpriteAnimationFrame {
    frame: number, // number of frame
    layers: Sprite[] // layers to render in order!
}

export interface SpriteAnimation {
    loop: AnimationLoopType,
    fps: number,
    frames: number,
    keyframes: SpriteAnimationFrame[], 
    // Key frames to render if no frame property assumes next frame in sequence else holds current frame until frame number specified.
    id: string
}