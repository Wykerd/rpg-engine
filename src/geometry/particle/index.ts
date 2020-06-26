import { Point } from '../../core/types';
import { CastPoint, HitPoint } from './types';
import { PolygonPath, Polygon } from '../polygon';
import Helpers from '../../core/helpers';

interface AngledPoint extends Point {
    angle: number;
}

export default class Particle implements Point {
    public x: number;
    public y: number;

    constructor (x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public cast (boundries: [ Point, Point ], dir: Point = { x: 1, y: 0 }) : CastPoint | undefined {
        const x1 = boundries[0].x;
        const y1 = boundries[0].y;
        const x2 = boundries[1].x;
        const y2 = boundries[1].y;

        const x3 = this.x;
        const y3 = this.y;
        const x4 = this.x + dir.x;
        const y4 = this.y + dir.y;

        const deno = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

        if (deno === 0) return;

        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / deno;
        const u = -(((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / deno);

        if (t >= 0 && t <= 1 && u >= 0) {
            return {
                x: x1 + t * (x2 - x1),
                y: y1 + t * (y2 - y1),
                t,
                u
            }
        }
    }

    public hit (poly: PolygonPath, dir: Point = { x: 1, y: 0 }) : HitPoint[] {
        const points : HitPoint[] = []
        const checkColision = (bounds: [ Point, Point ]) => {
            const point = this.cast(bounds, dir);
            if (point) {
                const dx = point.x - this.x;
                const dy = point.y - this.y;
                const pdist = Math.sqrt(dx * dx + dy * dy);
                points.push({...point, dist: pdist});
            }
        };

        for (let i = 0; i < poly.length - 1; i++) {
            checkColision([ poly[i], poly[i+1] ]);
        }

        checkColision([ poly[0], poly[poly.length - 1] ]);

        return points.sort((a,b) => a.dist - b.dist);
    }

    public emit (scene: Polygon[]) {
        const uniqueVectices : Point[] = [];

        for (const poly of scene) {
            const pointSet : { [key: string]: boolean } = {};
            for (const vertex of poly.path) {
                const pointKey = vertex.x + '-' + vertex.y;
                if (!pointSet[pointKey]) {
                    pointSet[pointKey] = true;
                    uniqueVectices.push(vertex);
                }
            }
        }

        const directionVectors : AngledPoint[] = [];
        
        uniqueVectices.forEach(point => {
            const dx = point.x - this.x;
            const dy = point.y - this.y;
            const r = Math.atan2(dy, dx);
            directionVectors.push(
                {
                    x: dx,
                    y: dy,
                    angle: r
                }, 
                { 
                    ...Helpers.RadiansToVector(r + 0.00000000001), 
                    angle: r + 0.00000000001 
                }, 
                { 
                    ...Helpers.RadiansToVector(r - 0.00000000001), 
                    angle: r - 0.00000000001 
                }
            );
        });

        const intersectVertices : AngledPoint[] = [];
        for (const dir of directionVectors) {
            let dist : number | undefined;
            let closestPoint : CastPoint | undefined;
            for (const poly of scene) {
                const vertex = this.hit(poly.path, dir);
                if (vertex[0]) {
                    const dx = vertex[0].x - this.x;
                    const dy = vertex[0].y - this.y;
                    const pdist = Math.sqrt(dx * dx + dy * dy);
                    if (!dist || dist > pdist) {
                        closestPoint = vertex[0];
                        dist = pdist;
                    }
                }
            }
            if (closestPoint) intersectVertices.push({...closestPoint, angle: dir.angle});
        }

        return intersectVertices.sort((a,b) => a.angle - b.angle);
    }
}