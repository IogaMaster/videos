import { Node } from "@motion-canvas/2d";
import { easeInOutQuart, PossibleVector2, Reference, Vector2 } from "@motion-canvas/core";

export function* slideIn(node: Reference<Node>) {
    yield* node().position([0, 0], 0.5, easeInOutQuart)
}

export function* slideOut(node: Reference<Node>, outPos: PossibleVector2) {
    yield* node().position(outPos, 0.5, easeInOutQuart)
}

