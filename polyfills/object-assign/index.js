function merge(target, source) {
  const enumerableProperties = Object.keys(source);
  const symbolProperties = Object.getOwnPropertySymbols(source);
  [...enumerableProperties, ...symbolProperties].forEach((key) => {
    target[key] = source[key];
  });
  return target;
}

Object.polyfillAssign = function (target, ...sources) {
  target = Object(target);

  return sources.reduce((acc, source) => {
    acc = merge(acc, source);
    return acc;
  }, target);
};
