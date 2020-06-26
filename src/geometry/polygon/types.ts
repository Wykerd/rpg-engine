import { Point, Dimensions, StrokeStyle, FillStyle } from "../../core/types";

export type PolygonPath = Point[];

export interface Polygon {
    path: PolygonPath;
    anchor: Point;
}

export interface StyledPolygon extends Polygon {
    style: FillStyle | StrokeStyle
}

export interface PolygonScaledCache extends Polygon {
    scale: Dimensions
}