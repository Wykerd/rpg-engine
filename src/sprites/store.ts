import SpriteRenderer from "./renderer";

export interface SpriteRendererStore {
    [id: string] : SpriteRenderer
}

// SpriteStore singleton class
export default class SpriteStore {
    private static instance : SpriteStore;

    private spriteRenderers : SpriteRendererStore;

    private constructor () {
        this.spriteRenderers = {};
    }

    public add (renderer: SpriteRenderer) {
        this.spriteRenderers[renderer.id] = renderer;
    }

    public get(id: string) : SpriteRenderer {
        const renderer = this.spriteRenderers[id];
        if (!renderer) throw new Error('Attemted to get SpriteRenderer with invalid ID');
        return renderer;
    }

    static getInstance() : SpriteStore {
        if (!SpriteStore.instance) {
            SpriteStore.instance = new SpriteStore();
        }
    
        return SpriteStore.instance;
    }
}