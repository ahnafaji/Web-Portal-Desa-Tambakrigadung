/**
 * Safely serialize any nested object containing BigInt values into native Numbers/Strings.
 * Prevents Express res.json() from throwing TypeError: Do not know how to serialize a BigInt.
 */
export function serializeBigInt(data) {
  if (data === null || data === undefined) return data;
  if (typeof data === "bigint") {
    // If within safe integer range, convert to Number for frontends; otherwise String
    return data <= BigInt(Number.MAX_SAFE_INTEGER) && data >= BigInt(Number.MIN_SAFE_INTEGER)
      ? Number(data)
      : data.toString();
  }
  if (Array.isArray(data)) {
    return data.map((item) => serializeBigInt(item));
  }
  if (typeof data === "object") {
    // Check if it's a Date or other specialized object
    if (data instanceof Date) return data;
    const res = {};
    for (const [key, value] of Object.entries(data)) {
      res[key] = serializeBigInt(value);
    }
    return res;
  }
  return data;
}

export const sendResponse = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    success: statusCode >= 200 && statusCode < 300,
    message,
    data: serializeBigInt(data),
  });
};
