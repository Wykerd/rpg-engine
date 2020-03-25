import { Point, Corner, VericalEdge, HorizontalEgde } from "../../core/types";

export interface BubbleAnimation {
    horizontal: (point: Point, ms: number, length: number, edge: HorizontalEgde) => Point;
    vertical: (point: Point, ms: number, length: number, edge: VericalEdge) => Point;
    corner: (corner: Corner, ms: number) => number;
    terminator: (ctx: CanvasRenderingContext2D, ms: number) => any; // render type
}