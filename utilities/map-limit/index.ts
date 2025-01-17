interface MapLimitArguments<T> {
  dataset: T[];
  limit: number;
  iteratee: (arg: T) => Promise<T>;
  callback: (result: T[] | null, error: unknown) => void;
}

function mapLimit<T extends any>(
  dataset: MapLimitArguments<T>["dataset"],
  limit: MapLimitArguments<T>["limit"],
  iteratee: MapLimitArguments<T>["iteratee"],
  callback?: MapLimitArguments<T>["callback"]
) {
  // validating arguments
  if (typeof dataset[Symbol.iterator] !== "function") {
    throw new Error(
      `TypeError: ${typeof dataset} is not iterable for argument dataset`
    );
  }
  if (typeof limit !== "number") {
    throw new Error(
      `TypeError: ${typeof limit} is not a number for argument limit`
    );
  } else if (limit <= 0) {
    throw new Error(
      `RangeError: ${limit} is not a positive number for argument limit`
    );
  }

  const batches: Array<T[]> = [];
  for (let i = 0; i < dataset.length; i += limit) {
    batches.push(dataset.slice(i, i + limit));
  }

  const finalResult = batches.reduce<Promise<T[]>>((chain, batch, batchIdx) => {
    return chain.then((result) => {
      return new Promise((resolve, reject) => {
        let completed = 0;
        batch.forEach((item, idx) => {
          Promise.resolve(iteratee(item))
            .then((response) => {
              result[batchIdx * limit + idx] = response;
              completed += 1;
              if (completed === batch.length) {
                resolve(result);
              }
            })
            .catch(reject);
        });
      });
    });
  }, Promise.resolve(Array.from({ length: dataset.length })));

  // if callback is passed this function will be sync otherwise async
  if (callback instanceof Function) {
    finalResult
      .then((result) => {
        callback(result, null);
      })
      .catch((error) => {
        callback(null, error);
      });
  } else {
    return new Promise((resolve, reject) => {
      finalResult.then(resolve).catch(reject);
    });
  }
}

// mapLimit([1, 2, 3, 4], 2, function (num) {
//   return new Promise((resolve) => {
//     setTimeout(() => resolve(num * 2), 2000);
//   });
// }).then((response) => {
//   console.log("Result" + response);
// });

mapLimit(
  [1, 2, 3, 4],
  2,
  function (num) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(num * 2), 2000);
    });
  },
  function (result, error) {
    console.log("Result", result, error);
  }
);
