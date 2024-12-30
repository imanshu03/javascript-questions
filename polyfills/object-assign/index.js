function merge(target, source) {
  const enumerableProperties = Object.keys(source);
  const symbolProperties = Object.getOwnPropertySymbols(source);
  [...enumerableProperties, ...symbolProperties].forEach((key) => {
    target[key] = source[key];
  });
  return target;
}

Object.polyfillAssign = function (target, ...sources) {
  if (target == null) throw Error("Cannot convert undefined or null to object");

  target = Object(target);

  return sources.reduce((acc, source) => {
    acc = merge(acc, source);
    return acc;
  }, target);
};
