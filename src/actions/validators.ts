import { ACTIONS } from "./definitions";
import type { TActionWithOptionalArgs } from "./types";

const ACTIONS_REQUIRING_ARGS: ReadonlySet<string> = new Set([
	"remove-media-asset",
	"remove-media-assets",
]);

export function isActionWithOptionalArgs(
	value: unknown,
): value is TActionWithOptionalArgs {
	return (
		typeof value === "string" &&
		Object.hasOwn(ACTIONS, value) &&
		!ACTIONS_REQUIRING_ARGS.has(value)
	);
}
