export class LineBoil {
    private frame = 0;
    private interval: number;
    private gaps: number[];
    private cachedNodes: any[] | null = null;

    constructor(targetFPS = 4, baseFPS = 60, gaps = [5.5, 7.0, 8.5, 6.2, 7.8]) {
        this.interval = Math.round(baseFPS / targetFPS);
        this.gaps = gaps;
    }

    /** Automatically applies line boil, caching nodes on first run to avoid scene graph traversal overhead */
    public apply(targets: (() => any)[] | (() => any)) {
        // Only update on target frame intervals
        if (this.frame % this.interval === 0) {
            // Lazy-load and cache nodes once to maximize loop speed
            if (!this.cachedNodes) {
                const targetVal = typeof targets === 'function' ? targets() : null;
                if (targetVal && typeof targetVal.children === 'function') {
                    this.cachedNodes = targetVal.children();
                } else if (Array.isArray(targets)) {
                    this.cachedNodes = targets.map(r => (typeof r === 'function' ? r() : r));
                } else {
                    this.cachedNodes = [];
                }
            }

            const tick = (this.frame / this.interval) | 0; // Faster bitwise floor
            const nodes = this.cachedNodes;
            const gaps = this.gaps;
            const gapsLen = gaps.length;

            // Direct loop with zero allocations
            for (let i = 0, len = nodes.length; i < len; i++) {
                const node = nodes[i];
                if (node && typeof node.roughHachureGap === 'function') {
                    node.roughHachureGap(gaps[(tick + i * 3) % gapsLen]);
                }
            }
        }
        this.frame++;
    }
}
