import { Dimensions, DrawPosition } from "../core/types";

export interface SpriteSheetDefinition {
    src: string, // source file
    frame: Dimensions, // dimensions of single sprite in sheet
    sprites: string[][],
    id: string
}

export interface SpriteSheet {
    src: string,
    frame: Dimensions,
    sprites: Sprite[],
    image: ImageData | ImageBitmap,
    id: string
}

export interface Sprite {
    position: DrawPosition,
    rendererId: string,
    id: string
}