export function createSeededRandom(seed = 1337) {
    let currentSeed = seed;
    return () => {
        currentSeed = (currentSeed * 48271) % 2147483647;
        return currentSeed / 2147483647;
    };
}
