interface BodyState {
    translation: { x: number; y: number; z?: number };
    rotation: any;
}

export class PhysicsManager {
    private timeline: Map<number, BodyState[]> = new Map();
    private entries: { body: any; onSync: (t: any, r: any) => void }[] = [];

    public register(body: any, onSync: (translation: any, rotation: any) => void) {
        this.entries.push({ body, onSync });
    }

    // Standard bake for pure physics worlds
    public bake(world: { step: (eventQueue?: any) => void }, frameCount: number) {
        this.customBake(frameCount, () => {
            world.step();
        });
    }

    // Custom bake for physics worlds that require procedural step logic
    public customBake(frameCount: number, stepCallback: (frameIndex: number) => void) {
        this.timeline.clear();

        for (let f = 0; f < frameCount; f++) {
            // Run per-frame simulation step callback safely outside data-mapping blocks
            stepCallback(f);

            const frameSnapshot: BodyState[] = this.entries.map(({ body }) => {
                const t = body.translation();
                const r = body.rotation();
                return {
                    translation: { x: t.x, y: t.y, z: t.z ?? 0 },
                    rotation: typeof r === 'number' ? r : { x: r.x, y: r.y, z: r.z, w: r.w },
                };
            });

            this.timeline.set(f, frameSnapshot);
        }
    }

    public sync(frameIndex: number) {
        const snapshot = this.timeline.get(frameIndex);
        if (!snapshot) return;

        this.entries.forEach(({ body, onSync }, idx) => {
            const state = snapshot[idx];
            if (!state) return;

            body.setTranslation(state.translation, true);
            body.setRotation(state.rotation, true);

            onSync(state.translation, state.rotation);
        });
    }
}
