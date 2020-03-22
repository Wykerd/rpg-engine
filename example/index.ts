import { SpriteStore, SpriteRenderer, SpriteSheetLoader } from '../src/sprites';
import { AnimatedSpriteRenderer, AnimationLoopType } from '../src/animation'

const canvas : HTMLCanvasElement = document.querySelector('canvas');

(async () => {
    const pp = new SpriteSheetLoader({
        src: './into_anim.png',
        frame: {
            width: 1200,
            height: 900
        },
        sprites: [
            ['sr_1', 'sr_2', 'sr_3', 'sr_4'],
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
        loop: AnimationLoopType.linear,
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
    
    let preDelta : number = -1;
    const dr = (delta : number) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const yes = an.draw(delta, {
            x: 0,
            y: 0,
            width: 600,
            height: 450
        });
        
        ctx.font = '20px sans-serif';

        ctx.fillText((1000/(delta - preDelta)).toFixed(0).toString(), 10, 50)
        preDelta = delta;

        ctx.font = '15px sans-serif';

        ctx.fillText(JSON.stringify(yes), 10, 20);

        requestAnimationFrame(dr);
    };

    requestAnimationFrame(dr);
    
    console.log(spr)
})();
