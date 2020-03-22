import { SpriteSheetDefinition, SpriteSheet, Sprite } from ".";
import { Dimensions } from "../core/types";

export default class SpriteSheetLoader implements SpriteSheet {
    public readonly src: string;
    public readonly frame : Dimensions;
    private _sprites : Sprite[] = [];
    private _spriteDef : string[][];
    public readonly id: string;
    private _image: ImageBitmap | undefined;

    constructor (init: SpriteSheetDefinition) {
        this.src = init.src;
        this.frame = init.frame;
        this.id = init.id;
        this._spriteDef = init.sprites;
    }

    public async load () : Promise<SpriteSheetLoader> {
        const res = await fetch(this.src);
        const image = await res.blob();

        this._image = await createImageBitmap(image);
        
        this._sprites = [];

        this._spriteDef.forEach((row, y) => {
            row.forEach((id, x) => {
                this._sprites.push({
                    rendererId: this.id,
                    position: {
                        x: x * this.frame.width,
                        y: y * this.frame.height,
                        width: this.frame.width,
                        height: this.frame.height
                    },
                    id
                })
            })
        });

        return this;
    }

    public get sprites() : Sprite[] {
        return this._sprites;
    }

    public getSpriteById(id : string) {
        return this._sprites.find(sprite => sprite.id === id);
    }

    public get image() {
        if (!this._image) throw new Error('oof')
        return this._image;
    }
}