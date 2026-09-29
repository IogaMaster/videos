import { makeScene2D, Rect, Node, Txt } from '@canvas-commons/2d';
import {
    all,
    createRefArray,
    Direction,
    easeInOutCubic,
    slideTransition,
    waitFor,
} from '@canvas-commons/core';
import { Colors } from 'toolkit';
import { createSeededRandom } from 'toolkit/utils/random';

// --- VISUAL & LAYOUT CONFIGURATION ---
const BAR_COUNT = 25;
const BAR_WIDTH = 36;
const GAP = 46;
const HEIGHT_MULTIPLIER = 11;
const STEP_DURATION = 0.12;

export default makeScene2D(function*(view) {
    // --- 1. DETERMINISTIC DATA SETUP ---
    // Seeded random ensures both algorithms sort the exact same initial permutation.
    const rnd = createSeededRandom(420);
    const initialValues = Array.from({ length: BAR_COUNT }, (_, i) => i + 1);

    for (let i = initialValues.length - 1; i > 0; i--) {
        const j = Math.floor(rnd() * (i + 1));
        [initialValues[i], initialValues[j]] = [initialValues[j], initialValues[i]];
    }

    // --- 2. DENSE LOGIC: ALGORITHM STEP RECORDERS ---
    // Pre-calculates every mutation state (snapshots) so animations can play back smoothly.
    const getBubbleSortSteps = (arr: number[]) => {
        const a = [...arr];
        const steps: number[][] = [[...a]];
        for (let i = 0; i < a.length; i++) {
            let swapped = false;
            for (let j = 0; j < a.length - i - 1; j++) {
                if (a[j] > a[j + 1]) {
                    [a[j], a[j + 1]] = [a[j + 1], a[j]];
                    steps.push([...a]); // Record state snapshot on swap
                    swapped = true;
                }
            }
            if (!swapped) break; // Early exit optimization
        }
        return steps;
    };

    const getSelectionSortSteps = (arr: number[]) => {
        const a = [...arr];
        const steps: number[][] = [[...a]];
        for (let i = 0; i < a.length; i++) {
            let minIdx = i;
            for (let j = i + 1; j < a.length; j++) {
                if (a[j] < a[minIdx]) minIdx = j;
            }
            if (minIdx !== i) {
                [a[i], a[minIdx]] = [a[minIdx], a[i]];
                steps.push([...a]); // Record state snapshot on swap
            }
        }
        return steps;
    };

    const bubbleSteps = getBubbleSortSteps(initialValues);
    const selectionSteps = getSelectionSortSteps(initialValues);
    const maxSteps = Math.max(bubbleSteps.length, selectionSteps.length);

    // --- 3. REFS & COLOR UTILITIES ---
    const bubbleBars = createRefArray<Rect>();
    const selectionBars = createRefArray<Rect>();

    const palette = [
        Colors.blue, Colors.sapphire, Colors.sky, Colors.teal,
        Colors.green, Colors.yellow, Colors.peach, Colors.maroon,
        Colors.red, Colors.mauve, Colors.pink, Colors.lavender
    ];

    // Maps bar height values to a gradient color slice across the palette
    const getColorForVal = (val: number) => {
        const normalized = (val - 1) / (BAR_COUNT - 1);
        return palette[Math.floor(normalized * (palette.length - 1))];
    };

    // Centers the bar array horizontally around the track's origin
    const slotX = (i: number) => (i - (BAR_COUNT - 1) / 2) * GAP;

    // --- 4. SCENE GRAPH STRUCTURE ---
    view.add(
        <Node>
            <Rect width={1920} height={1080} fill={Colors.base} />

            {/* Top Track: Bubble Sort */}
            <Node position={[0, -120]}>
                {initialValues.map((val, i) => (
                    <Rect
                        key={`b-${i}`}
                        ref={bubbleBars}
                        width={BAR_WIDTH}
                        height={val * HEIGHT_MULTIPLIER}
                        y={0 - (val * HEIGHT_MULTIPLIER) / 2} // Anchor scaling to vertical center
                        x={slotX(i)}
                        radius={6}
                        fill={getColorForVal(val)}
                        stroke={Colors.surface0}
                        lineWidth={2}
                    />
                ))}
                <Txt text={'Bubble Sort'} fill={Colors.text} fontSize={40} fontFamily={'JetBrains Mono, monospace'} fontWeight={700} position={[0, 60]} />
            </Node>

            {/* Bottom Track: Selection Sort */}
            <Node position={[0, 250]}>
                {initialValues.map((val, i) => (
                    <Rect
                        key={`s-${i}`}
                        ref={selectionBars}
                        width={BAR_WIDTH}
                        height={val * HEIGHT_MULTIPLIER}
                        y={0 - (val * HEIGHT_MULTIPLIER) / 2} // Anchor scaling to vertical center
                        x={slotX(i)}
                        radius={6}
                        fill={getColorForVal(val)}
                        stroke={Colors.surface0}
                        lineWidth={2}
                    />
                ))}
                <Txt text={'Selection Sort'} fill={Colors.text} fontSize={45} fontFamily={'JetBrains Mono, monospace'} fontWeight={700} position={[0, 60]} />
            </Node>
        </Node>
    );

    yield* slideTransition(Direction.Left);
    yield* waitFor(0.8);

    // --- 5. DENSE LOGIC: SYNCHRONIZED RACE ANIMATION LOOP ---
    // Iterates up to maxSteps, using Math.min to clamp finished arrays to their final states.
    for (let step = 0; step < maxSteps; step++) {
        const bState = bubbleSteps[Math.min(step, bubbleSteps.length - 1)];
        const sState = selectionSteps[Math.min(step, selectionSteps.length - 1)];

        // Map declarative height, vertical position, and color tweens for both racers
        const bubbleUpdates = bubbleBars.map((bar, i) => {
            const val = bState[i];
            return all(
                bar.height(val * HEIGHT_MULTIPLIER, STEP_DURATION, easeInOutCubic),
                bar.y(0 - (val * HEIGHT_MULTIPLIER) / 2, STEP_DURATION, easeInOutCubic),
                bar.fill(getColorForVal(val), STEP_DURATION)
            );
        });

        const selectionUpdates = selectionBars.map((bar, i) => {
            const val = sState[i];
            return all(
                bar.height(val * HEIGHT_MULTIPLIER, STEP_DURATION, easeInOutCubic),
                bar.y(0 - (val * HEIGHT_MULTIPLIER) / 2, STEP_DURATION, easeInOutCubic),
                bar.fill(getColorForVal(val), STEP_DURATION)
            );
        });

        // Run all bar transitions concurrently per step
        yield* all(...bubbleUpdates, ...selectionUpdates);
    }

    // --- 6. HOLD FINAL STATE ---
    yield* waitFor(2.5);
});
