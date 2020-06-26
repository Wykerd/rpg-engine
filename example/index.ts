import { SpriteStore, SpriteRenderer, SpriteSheetLoader } from '../src/sprites';
import { AnimatedSpriteRenderer, AnimationLoopType, DialogueAnimationLoopType, DialogueBubbleRenderer } from '../src/animation';
import { DialogueRenderer } from '../src/animation/dialogue';
import { BubbleRenderer, BubbleTerminators } from '../src/animation/bubble';
import { PolygonRenderer } from '../src/geometry/polygon';
import Helpers from '../src/core/helpers';
import Particle from '../src/geometry/particle'

const canvas : HTMLCanvasElement = document.querySelector('canvas');

(window as any).SpriteStore = SpriteStore;

(async () => {
    const pp = new SpriteSheetLoader({
        src: './into_anim.png',
        frame: {
            width: 1200,
            height: 900
        },
        sprites: [
            ['sr_1',  'sr_2',  'sr_3',  'sr_4' ],
            ['sr1_1', 'sr1_2', 'sr1_3', 'sr1_4'],
            ['sr2_1', 'sr2_2', 'sr2_3', 'sr2_4'],
            ['sr3_1', 'sr3_2', 'sr3_3', 'sr3_4'],
            ['sr4_1', 'sr4_2', 'sr4_3', 'sr4_4'],
            ['sr5_1', 'sr5_2', 'sr5_3', 'sr5_4'],
            ['sr6_1', 'sr6_2', 'sr6_3', 'sr6_4']
        ],
        id: 'spr_1'
    });
    
    const ctx = canvas.getContext('2d');

    SpriteStore.getInstance().add(new SpriteRenderer(ctx, await pp.load()));

    const an = new AnimatedSpriteRenderer(ctx, {
        loop: AnimationLoopType.oscillate,
        fps: 8,
        frames: 30,
        keyframes: pp.sprites.map((sprite, index) => {
            return {
                frame: index,
                layers: [sprite]
            }
        }).splice(0, pp.sprites.length - 1),
        id: 'ok_boomer'
    });
    
    canvas.width = 700;
    canvas.height = 700;
    
    const spr = SpriteStore.getInstance().get('spr_1');

    // dialog test
    const ff = new DialogueRenderer(ctx, {
        keyframes: [
            {
                content: [
                    {
                        text: 'Epic gamer moment, this is so'
                    },
                    {
                        text: '... ',
                        speed: 150,
                        pause: 500
                    },
                    {
                        text: 'cool',
                        prerender: ({position, index, ms}) => {
                            return {
                                x: position.x,
                                y: position.y + (Math.sin((ms / 150.00) + index) * 2),
                                width: position.width,
                                height: position.height
                            }
                        },
                    }
                ],
                speed: 100
            },
            {
                content: [
                    {
                        text: 'AMAZING!',
                        speed: 20,
                        pause: 4000,
                        prerender: ({position, index, ms, ctx}) => {
                            const nPos = {
                                x: position.x,
                                y: position.y + (Math.sin((ms / 15) + (index * 1.5)) * 3),
                                width: position.width + (Math.sin((ms / 150.00) + index) * 2),
                                height: position.height
                            };
                            
                            ctx.fillStyle = `rgb(${(Math.sin((ms / 100) + index) * 255)}, 15, 15)`;

                            return nPos
                        }
                    }
                ]
            }
        ],
        loop: DialogueAnimationLoopType.pause,
        speed: 100,
        id: 'epic',
        font: {
            font: '50px sans-serif',
            height: 50
        }
    });

    const ey = new BubbleRenderer(ctx, {
        vertical: (point, ms) => {
            point.x += (Math.sin((ms / 300.00) + (point.y / 80)) * 2)
            return point;
        },
        horizontal: (point, ms) => {
            point.y += (Math.sin((ms / 300.00) + (point.x / 80)) * 2)
            return point;
        },
        terminator: BubbleTerminators.fill('#222222c0'),
        corner: () => 60
    });

    const boomer = new DialogueBubbleRenderer(ctx, {
        loop: DialogueAnimationLoopType.once,
        pause: 2000,
        transition: 500,
        padding: 50
    }, ff, ey);

    console.log(ff.calculateFrameDuration());

    const polygon = {
        path: [ 
            { x: 100, y: 100 }, 
            { x: 200, y: 150 },
            { x: 150, y: 200 },
            { x: 100, y: 190 } 
        ],
        anchor: {
            x: 0,
            y: 0
        },
        style: Helpers.StrokeStyleFromMaybe()
    };

    const p2 = {
        path: [ 
            { x: 300, y: 300 }, 
            { x: 400, y: 350 },
            { x: 350, y: 400 },
            { x: 300, y: 390 } 
        ],
        anchor: {
            x: 0,
            y: 0
        },
        style: Helpers.StrokeStyleFromMaybe()
    };

    const p3 = {
        path: [ 
            {x: 450, y: 100},
            {x: 380, y: 110},
            {x: 420, y: 150},
            {x: 400, y: 250},
            {x: 360, y: 200},
            {x: 280, y: 260},
            {x: 390, y: 320},
            {x: 410, y: 270}
        ],
        anchor: {
            x: 0,
            y: 0
        },
        style: Helpers.StrokeStyleFromMaybe()
    };

    const bounding_box = {
        path: [ 
            { x: 0, y: 0 }, 
            { x: 0, y: 600 },
            { x: 600, y: 600 },
            { x: 600, y: 0 } 
        ],
        anchor: {
            x: 0,
            y: 0
        },
        style: Helpers.StrokeStyleFromMaybe()
    };

    const pol_render = new PolygonRenderer(ctx, polygon);
    const pol_render2 = new PolygonRenderer(ctx, p2);
    const pol_render3 = new PolygonRenderer(ctx, p3);
    const bond_rend = new PolygonRenderer(ctx, bounding_box);

    const particle = new Particle(80, 20);

    let emit = particle.emit([ polygon, bounding_box, p2 ]);

    canvas.addEventListener('mousemove', (e) => {
        particle.x = e.clientX;
        particle.y = e.clientY;
        console.time('oof')
        emit = particle.emit([ polygon, bounding_box, p2, p3 ]);
        console.timeEnd('oof')
    });
/*
    const intersect = particle.cast([ { x: 0, y: 100 }, { x: 100, y: 100 } ],  Helpers.RadiansToVector(1.91986));

    const closest = particle.hit([ { x: 0, y: 80 }, { x: 100, y: 80 }, { x: 100, y: 100 }, { x: 0, y: 100 } ], Helpers.RadiansToVector(1.91986));
*/

    console.log('emit', emit);

    let preDelta : number = -1;
    const dr = (delta : number) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        /*const yes = an.draw(delta, {
            x: 0,
            y: 0,
            width: 600,
            height: 450
        });
        
        /* const ok = ff.draw(delta, {
            x: 0,
            y: 0,
            width: 600,
            height: 450
        }); */


        // ey.draw(delta, { x: 50, y: 50, height: 300, width: 500 })

        /* const dim = ff.getDimensions({
            x: 0,
            y: 0,
            width: 600,
            height: 450
        }); */

        ctx.strokeStyle = '#000';
        ctx.beginPath();
        //ctx.moveTo(0, dim.height);
        //ctx.lineTo(dim.width, dim.height);
        ctx.stroke();

        /*boomer.draw(delta, {
            x: 50,
            y: 50,
            width: 600,
            height: 450
        })*/

        ctx.font = '20px sans-serif';
        // if (1000/(delta - preDelta) < 55) console.log('Frame drop', 1000/(delta - preDelta));
        ctx.fillText((1000/(delta - preDelta)).toFixed(0).toString(), 10, 340)
        preDelta = delta;

        ctx.font = '10px sans-serif';
        /*const renderStack = JSON.stringify([yes, ok], null, ' ');
        renderStack.split('\n').forEach((ln, i) => {
            ctx.fillText(ln, 10, 360 + (12*i))
        })*/

        pol_render.draw({ x: 0, y: 0, ...pol_render.dimensions });
        bond_rend.draw({ x: 0, y: 0, ...bond_rend.dimensions });
        pol_render2.draw({ x: 0, y: 0, ...pol_render2.dimensions });
        pol_render3.draw({ x: 0, y: 0, ...pol_render3.dimensions });

        /*ctx.fillStyle = "#dd3838";
        ctx.beginPath();
        ctx.arc(intersect.x, intersect.y, 4, 0, 2*Math.PI, false);
        ctx.fill();
        ctx.fillStyle = "#dd3838";
        ctx.beginPath();
        ctx.arc(intersect2.x, intersect2.y, 4, 0, 2*Math.PI, false);
        ctx.fill();

        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(closest.x, closest.y, 2, 0, 2*Math.PI, false);
        ctx.fill();*/

        ctx.fillStyle = ctx.createRadialGradient(particle.x, particle.y, 2, particle.x, particle.y, 300);
        ctx.fillStyle.addColorStop(0, "#F6CD8B90");
        ctx.fillStyle.addColorStop(1, "#00000000");
        // ctx.fillStyle = "#dd3838";
        ctx.beginPath();
        ctx.moveTo(emit[0].x, emit[0].y);
        emit.forEach(pt => {
            ctx.lineTo(pt.x, pt.y);
        });
        ctx.closePath();
        ctx.fill();

        /*emit.forEach(pt => {
            ctx.fillStyle = "blue";
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 3, 0, 2*Math.PI, false);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = "blue";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(pt.x, pt.y);
            ctx.closePath();
            ctx.stroke();
        })*/

        requestAnimationFrame(dr);
    };

    requestAnimationFrame(dr);
    
    console.log(spr);

    console.log(pol_render.dimensions);
})();
