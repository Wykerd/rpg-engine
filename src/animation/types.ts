import { Sprite } from "../sprites/types";

export enum AnimationLoopType {
    oscillate = 'oscillate',
    linear = 'linear',
    random = 'random'
}

export interface AnimationFrame {
    frame: number, // number of frame
    layers: Sprite[] // layers to render in order!
}

export interface Animation {
    loop: AnimationLoopType,
    fps: number,
    frames: number,
    keyframes: AnimationFrame[], 
    // Key frames to render if no frame property assumes next frame in sequence else holds current frame until frame number specified.
    id: string
}