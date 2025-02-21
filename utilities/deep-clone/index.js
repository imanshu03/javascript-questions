function deepClone(data) {
  let result = data;
  if (typeof result !== "object") return result;

  switch (true) {
    case data instanceof Map:
      result = [...data.entries()].reduce((acc, [key, value]) => {
        acc.set(key, deepClone(value));
      }, new Map());
      break;
    case data instanceof Set:
      result = new Set();
      data.forEach((item) => {
        result.add(deepClone(item));
      });
      break;
    case Array.isArray(data):
      result = data.map((item) => {
        return deepClone(item);
      });
      break;
    case typeof data === "object" && data !== null:
      result = Object.entries(data).reduce((acc, [key, value]) => {
        acc[key] = deepClone(value);
      }, {});
      break;
  }
  return result;
}
