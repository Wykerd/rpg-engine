import { RendererBase } from "../core/renderer";
import { SpriteSheetLoader } from ".";
import { DrawPosition } from "../core/types";
import debug from "../core/debug";

export default class SpriteRenderer extends RendererBase {
    private spriteSheet : SpriteSheetLoader;

    constructor (ctx : CanvasRenderingContext2D, spriteSheet : SpriteSheetLoader) {
        super(ctx);
        this.spriteSheet = spriteSheet;
    }

    public draw (id: string, position: DrawPosition) {
        const sprite = this.spriteSheet.getSpriteById(id);
        if (!sprite) {
            return debug.warn('Sprite render called on invalid ID', `\n\nSprite ID: ${id}\nSpriteSheet ID: ${this.spriteSheet.id}`);
        }
        this.ctx.drawImage(
            this.spriteSheet.image,
            // crop from source 
            sprite.position.x, 
            sprite.position.y, 
            sprite.position.width, 
            sprite.position.height, 
            // position on canvas
            position.x + position.x, 
            position.y + position.y, 
            position.width,
            position.height
        );
    }

    public get id() {
        return this.spriteSheet.id;
    }
}