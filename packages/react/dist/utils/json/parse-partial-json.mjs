// src/utils/json/parse-partial-json.ts
import sjson from "secure-json-parse";
import { fixJson } from "./fix-json.mjs";
import { useContentPart } from "../../context/index.mjs";
var PARTIAL_JSON_COUNT_SYMBOL = Symbol("partial-json-count");
var parsePartialJson = (json) => {
  try {
    return sjson.parse(json);
  } catch {
    try {
      const [fixedJson, partialCount] = fixJson(json);
      const res = sjson.parse(fixedJson);
      res[PARTIAL_JSON_COUNT_SYMBOL] = partialCount;
      return res;
    } catch {
      return void 0;
    }
  }
};
var COMPLETE_STATUS = Object.freeze({ type: "complete" });
var getFieldStatus = (lastState, args, fieldPath, partialCount) => {
  if (fieldPath.length === 0) return lastState;
  if (typeof args !== "object" || args === null) return COMPLETE_STATUS;
  const path = fieldPath.at(-1);
  if (!Object.prototype.hasOwnProperty.call(args, path)) {
    return lastState;
  }
  const argsKeys = Object.keys(args);
  const isLast = argsKeys[argsKeys.length - 1] === path;
  if (!isLast) return COMPLETE_STATUS;
  return getFieldStatus(
    lastState,
    args[path],
    fieldPath.slice(0, -1),
    partialCount - 1
  );
};
var getToolArgsFieldStatus = (status, args, fieldPath) => {
  const partialCount = args[PARTIAL_JSON_COUNT_SYMBOL] ?? 0;
  if (partialCount === 0) return COMPLETE_STATUS;
  const lastState = status.type !== "requires-action" ? status : COMPLETE_STATUS;
  return getFieldStatus(lastState, args, fieldPath, partialCount);
};
var useToolArgsFieldStatus = (fieldPath) => {
  return useContentPart((p) => {
    if (p.type !== "tool-call") throw new Error("not a tool call");
    return getToolArgsFieldStatus(p.status, p.args, fieldPath);
  });
};
export {
  parsePartialJson,
  useToolArgsFieldStatus
};
//# sourceMappingURL=parse-partial-json.mjs.map