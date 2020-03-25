export interface Dimensions {
    width: number,
    height: number
}

export interface Point {
    x: number,
    y: number
}

export interface DrawPosition extends Dimensions, Point {}

export interface TextFont {
    fillStyle?: string | CanvasGradient | CanvasPattern,
    font?: string,
    height?: number
}

export enum HorizontalEgde {
    top = 'top',
    bottom = 'bottom'
};

export enum VericalEdge {
    right = 'right',
    left = 'left'
}

export type Corner = [HorizontalEgde, VericalEdge];