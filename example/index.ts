import { SpriteStore, SpriteRenderer, SpriteSheetLoader } from '../src/sprites';
import { AnimatedSpriteRenderer, AnimationLoopType } from '../src/animation';
import { DialogueRenderer } from '../src/animation/dialogue';
import { BubbleRenderer, BubbleTerminators } from '../src/animation/bubble';

const canvas : HTMLCanvasElement = document.querySelector('canvas');

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
                        pause: 1000
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
                        pause: 2000,
                    }
                ],
                speed: 100
            },
            {
                content: [
                    {
                        text: 'AMAZING!',
                        speed: 20,
                        pause: 5000,
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
        loop: AnimationLoopType.linear,
        speed: 100,
        id: 'epic',
        font: {
            font: '100px sans-serif',
            height: 100
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
        terminator: BubbleTerminators.stroke('#222'),
        corner: () => 60
    });

    console.log(ff.calculateFrameDuration());

    let preDelta : number = -1;
    const dr = (delta : number) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const yes = an.draw(delta, {
            x: 0,
            y: 0,
            width: 600,
            height: 450
        });
        
        /*const ok = ff.draw(delta, {
            x: 0,
            y: 0,
            width: 600,
            height: 450
        });*/


        ey.draw(delta, { x: 50, y: 50, height: 300, width: 500 })

        /*const dim = ff.getDimensions({
            x: 0,
            y: 0,
            width: 600,
            height: 450
        });

        ctx.strokeStyle = '#000';
        ctx.beginPath();
        ctx.moveTo(0, dim.height);
        ctx.lineTo(dim.width, dim.height);
        ctx.stroke();*/

        ctx.font = '20px sans-serif';

        ctx.fillText((1000/(delta - preDelta)).toFixed(0).toString(), 10, 340)
        preDelta = delta;

        ctx.font = '10px sans-serif';
        /*const renderStack = JSON.stringify([yes, ok], null, ' ');
        renderStack.split('\n').forEach((ln, i) => {
            ctx.fillText(ln, 10, 360 + (12*i))
        })*/

        requestAnimationFrame(dr);
    };

    requestAnimationFrame(dr);
    
    console.log(spr)
})();
