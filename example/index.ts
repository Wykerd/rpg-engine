import { SpriteStore, SpriteRenderer, SpriteSheetLoader } from '../src/sprites';
import { AnimatedSpriteRenderer, AnimationLoopType } from '../src/animation'

const canvas : HTMLCanvasElement = document.querySelector('canvas');

(async () => {
    const pp = new SpriteSheetLoader({
        src: './epic.png',
        frame: {
            width: 1148,
            height: 542
        },
        sprites: [
            ['srp_1']
        ],
        id: 'sr_1'
    });

    const pp_2 = new SpriteSheetLoader({
        src: './epic_2.png',
        frame: {
            width: 1148,
            height: 542
        },
        sprites: [
            ['srp_1']
        ],
        id: 'sr_2'
    })
    
    SpriteStore.getInstance().add(new SpriteRenderer(canvas.getContext('2d'), await pp.load()));

    SpriteStore.getInstance().add(new SpriteRenderer(canvas.getContext('2d'), await pp_2.load()));

    const an = new AnimatedSpriteRenderer(canvas.getContext('2d'), {
        loop: AnimationLoopType.linear,
        fps: 60,
        frames: 2,
        keyframes: [{
            frame: 0,
            layers: [
                {
                    position: {
                        x: 0,
                        y: 0,
                        width: 1148,
                        height: 542
                    },
                    rendererId: 'sr_1',
                    id: 'srp_1'
                }
            ]
        },
        {
            frame: 1,
            layers: [
                {
                    position: {
                        x: 0,
                        y: 0,
                        width: 1148,
                        height: 542
                    },
                    rendererId: 'sr_2',
                    id: 'srp_1'
                }
            ]
        }],
        id: 'ok_boomer'
    });
    
    canvas.width = 500;
    canvas.height = 500;
    
    const spr = SpriteStore.getInstance().get('sr_1');
    
    const dr = (delta : number) => {
        an.draw(delta, {
            x: 0,
            y: 0,
            width: 200,
            height: 200
        });
        requestAnimationFrame(dr)
    };

    requestAnimationFrame(dr)
    
    console.log(spr)
})();
