import { Node } from "@motion-canvas/2d";
import { all, easeInOutQuart, linear, PossibleVector2, Reference, Vector2 } from "@motion-canvas/core";

export function* slideIn(node: Reference<Node>) {
    yield* node().position([0, 0], 0.5, easeInOutQuart)
}

export function* slideOut(node: Reference<Node>, outPos: PossibleVector2) {
    yield* node().position(outPos, 0.5, easeInOutQuart)
}

export function* scrollScreenshot(node: Reference<Node>) {
    yield* node().y(-7000, 25, linear)
}

export function* wiggle(node: Reference<Node>, amplitude: any) {
    node().rotation(amplitude * 12, 0.3);
    node().rotation(amplitude * -12, 0.3);
    node().rotation(0, 0.3);
};

export function* spin(node: Reference<Node>, amplitude: any) {
    node().rotation(amplitude * 360, 0.3);
};
