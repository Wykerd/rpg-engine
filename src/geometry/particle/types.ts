import { Point } from "../../core/types";

export interface CastPoint extends Point {
    t: number,
    u: number
}

export interface HitPoint extends CastPoint {
    dist: number
}