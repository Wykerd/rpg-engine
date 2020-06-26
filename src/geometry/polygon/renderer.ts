import { RendererBase } from "../../core/renderer";
import { Polygon, PolygonScaledCache, StyledPolygon } from "./types";
import { Dimensions, DrawPosition, FillStyle, StrokeStyle } from "../../core/types";

export default class PolygonRenderer extends RendererBase {
    private polygon : StyledPolygon;
    private _last_render: PolygonScaledCache | undefined;
    private _dimensions : Dimensions;

    constructor (ctx : CanvasRenderingContext2D, polygon : StyledPolygon) {
        super(ctx);
        this.polygon = polygon;

        if (polygon.path.length < 1) throw new Error('Invalid polygon defined. Expected at least one vector in path.');

        let min_x = 0, 
            max_x = 0, 
            min_y = 0,
            max_y = 0;

        for (const path of polygon.path) {
            if (path.x > max_x) max_x = path.x;
            else if (path.x < min_x) min_x = path.x;

            if (path.y > max_y) max_y = path.y;
            else if (path.y < min_x) min_y = path.y;
        }

        if (polygon.anchor.x > max_x) max_x = polygon.anchor.x;
        else if (polygon.anchor.x < min_x) min_x = polygon.anchor.x;

        if (polygon.anchor.y > max_y) max_y = polygon.anchor.y;
        else if (polygon.anchor.y < min_x) min_y = polygon.anchor.y;

        this._dimensions = {
            height: max_y - min_y,
            width: max_x - min_x
        };
    }

    public get dimensions() {
        return this._dimensions
    }

    public draw (position: DrawPosition) {
        const multiplier: Dimensions = {
            height: position.height / this._dimensions.height,
            width: position.width / this._dimensions.width
        };

        const _polygon: PolygonScaledCache = this._last_render?.scale?.height === multiplier.height && this._last_render?.scale?.width === multiplier.width ? 
            this._last_render : 
            (() => {
                const _anchor = {
                    x: this.polygon.anchor.x * multiplier.width,
                    y: this.polygon.anchor.y * multiplier.height
                };
                return {
                    scale: multiplier,
                    path: this.polygon.path.map(point => { 
                        return {
                            x: (point.x * multiplier.width) + _anchor.x,
                            y: (point.y * multiplier.height) + _anchor.y
                        }
                    }),
                    anchor: {
                        x: 0,
                        y: 0
                    }
                };
            })();
            
        let stroke = false;
        
        if ((this.polygon.style as FillStyle).fillStyle) {
            this.ctx.fillStyle = (this.polygon.style as FillStyle).fillStyle;
        }

        const _stroke_style = (this.polygon.style as StrokeStyle)
        if (_stroke_style.strokeStyle) {
            this.ctx.strokeStyle = _stroke_style.strokeStyle;
            this.ctx.lineJoin = _stroke_style.lineJoin;
            this.ctx.lineWidth = _stroke_style.lineWidth;
            this.ctx.lineCap = _stroke_style.lineCap;
            stroke = true;
        }

        this.ctx.beginPath();
        this.ctx.moveTo(_polygon.path[0].x + position.x, _polygon.path[0].y + position.y);
        for (const point of _polygon.path) {
            this.ctx.lineTo(point.x + position.x, point.y + position.y);
        }
        this.ctx.closePath();
        
        stroke ? this.ctx.stroke() : this.ctx.fill();

        this._last_render = _polygon;
    }
}