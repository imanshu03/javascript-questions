function partitionStart(array, start, end) {
  const pivot = start;
  let left = start + 1,
    right = end;

  while (left <= right) {
    if (array[left] >= array[pivot] && array[right] <= array[pivot]) {
      [array[left], array[right]] = [array[right], array[left]];
      left += 1;
      right -= 1;
    } else if (array[left] < array[pivot]) {
      left += 1;
    } else if (array[right] > array[pivot]) {
      right -= 1;
    }
  }

  [array[right], array[pivot]] = [array[pivot], array[right]];
  return right;
}

function partitionEnd(array, start, end) {
  const pivot = end;
  let left = start,
    right = end - 1;

  while (left <= right) {
    if (array[left] >= array[pivot] && array[right] <= array[pivot]) {
      [array[left], array[right]] = [array[right], array[left]];
      left += 1;
      right -= 1;
    } else if (array[left] < array[pivot]) {
      left += 1;
    } else if (array[right] > array[pivot]) {
      right -= 1;
    }
  }

  [array[left], array[pivot]] = [array[pivot], array[left]];
  return left;
}

function quickSort(array, start = 0, end = array.length - 1) {
  if (start < end) {
    const pivot = partitionStart(array, start, end);
    // const pivot = partitionEnd(array, start, end);
    quickSort(array, start, pivot - 1);
    quickSort(array, pivot + 1, end);
  }
}

const array = [54, 26, 93, 17, 77, 31, 44, 55, 20];
quickSort(array);
console.log("Result --> ", array);
