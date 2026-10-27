export function javaListSort<T>(input: readonly T[], compare: (left: T, right: T) => number): T[] {
  if (input.length > 4096) throw new Error("Too many sortable records");

  const values = [...input];
  const runs: { start: number; length: number }[] = [];
  let gallopThreshold = 7;
  const copy = (source: readonly T[], from: number, to: number, count: number) => {
    const block = source.slice(from, from + count);

    for (let index = 0; index < count; index++) values[to + index] = block[index]!;
  };
  const gallop = (
    key: T,
    source: readonly T[],
    start: number,
    length: number,
    hint: number,
    upper: boolean,
  ): number => {
    let previous = 0;
    let distance = 1;
    const advances = (value: T) => (upper ? compare(key, value) >= 0 : compare(key, value) > 0);

    if (advances(source[start + hint]!)) {
      const maximum = length - hint;

      while (distance < maximum && advances(source[start + hint + distance]!)) {
        previous = distance;
        distance = distance * 2 + 1;
      }

      distance = Math.min(distance, maximum) + hint;
      previous += hint;
    } else {
      const maximum = hint + 1;

      while (distance < maximum && !advances(source[start + hint - distance]!)) {
        previous = distance;
        distance = distance * 2 + 1;
      }

      const oldPrevious = previous;
      previous = hint - Math.min(distance, maximum);
      distance = hint - oldPrevious;
    }

    previous++;

    while (previous < distance) {
      const middle = previous + ((distance - previous) >>> 1);

      if (advances(source[start + middle]!)) previous = middle + 1;
      else distance = middle;
    }

    return distance;
  };
  const mergeForward = (left: number, leftCount: number, right: number, rightCount: number) => {
    const saved = values.slice(left, left + leftCount);
    let a = 0,
      b = right,
      output = left;
    values[output++] = values[b++]!;

    if (--rightCount === 0) {
      copy(saved, a, output, leftCount);

      return;
    }

    if (leftCount === 1) {
      copy(values, b, output, rightCount);
      values[output + rightCount] = saved[a]!;

      return;
    }

    let threshold = gallopThreshold;
    merging: for (;;) {
      let fromLeft = 0,
        fromRight = 0;

      do {
        if (compare(values[b]!, saved[a]!) < 0) {
          values[output++] = values[b++]!;
          fromRight++;
          fromLeft = 0;

          if (--rightCount === 0) break merging;
        } else {
          values[output++] = saved[a++]!;
          fromLeft++;
          fromRight = 0;

          if (--leftCount === 1) break merging;
        }
      } while ((fromLeft | fromRight) < threshold);

      do {
        fromLeft = gallop(values[b]!, saved, a, leftCount, 0, true);

        if (fromLeft !== 0) {
          copy(saved, a, output, fromLeft);
          output += fromLeft;
          a += fromLeft;
          leftCount -= fromLeft;

          if (leftCount <= 1) break merging;
        }

        values[output++] = values[b++]!;

        if (--rightCount === 0) break merging;

        fromRight = gallop(saved[a]!, values, b, rightCount, 0, false);

        if (fromRight !== 0) {
          copy(values, b, output, fromRight);
          output += fromRight;
          b += fromRight;
          rightCount -= fromRight;

          if (rightCount === 0) break merging;
        }

        values[output++] = saved[a++]!;

        if (--leftCount === 1) break merging;

        threshold--;
      } while (fromLeft >= 7 || fromRight >= 7);

      threshold = Math.max(0, threshold) + 2;
    }
    gallopThreshold = Math.max(1, threshold);

    if (leftCount === 1) {
      copy(values, b, output, rightCount);
      values[output + rightCount] = saved[a]!;
    } else if (leftCount === 0) throw new Error("Invalid sort comparison contract");
    else copy(saved, a, output, leftCount);
  };
  const mergeBackward = (left: number, leftCount: number, right: number, rightCount: number) => {
    const saved = values.slice(right, right + rightCount);
    let a = left + leftCount - 1,
      b = rightCount - 1,
      output = right + rightCount - 1;
    values[output--] = values[a--]!;

    if (--leftCount === 0) {
      copy(saved, 0, output - rightCount + 1, rightCount);

      return;
    }

    if (rightCount === 1) {
      output -= leftCount;
      a -= leftCount;
      copy(values, a + 1, output + 1, leftCount);
      values[output] = saved[b]!;

      return;
    }

    let threshold = gallopThreshold;
    merging: for (;;) {
      let fromLeft = 0,
        fromRight = 0;

      do {
        if (compare(saved[b]!, values[a]!) < 0) {
          values[output--] = values[a--]!;
          fromLeft++;
          fromRight = 0;

          if (--leftCount === 0) break merging;
        } else {
          values[output--] = saved[b--]!;
          fromRight++;
          fromLeft = 0;

          if (--rightCount === 1) break merging;
        }
      } while ((fromLeft | fromRight) < threshold);

      do {
        fromLeft = leftCount - gallop(saved[b]!, values, left, leftCount, leftCount - 1, true);

        if (fromLeft !== 0) {
          output -= fromLeft;
          a -= fromLeft;
          leftCount -= fromLeft;
          copy(values, a + 1, output + 1, fromLeft);

          if (leftCount === 0) break merging;
        }

        values[output--] = saved[b--]!;

        if (--rightCount === 1) break merging;

        fromRight = rightCount - gallop(values[a]!, saved, 0, rightCount, rightCount - 1, false);

        if (fromRight !== 0) {
          output -= fromRight;
          b -= fromRight;
          rightCount -= fromRight;
          copy(saved, b + 1, output + 1, fromRight);

          if (rightCount <= 1) break merging;
        }

        values[output--] = values[a--]!;

        if (--leftCount === 0) break merging;

        threshold--;
      } while (fromLeft >= 7 || fromRight >= 7);

      threshold = Math.max(0, threshold) + 2;
    }
    gallopThreshold = Math.max(1, threshold);

    if (rightCount === 1) {
      output -= leftCount;
      a -= leftCount;
      copy(values, a + 1, output + 1, leftCount);
      values[output] = saved[b]!;
    } else if (rightCount === 0) throw new Error("Invalid sort comparison contract");
    else copy(saved, 0, output - rightCount + 1, rightCount);
  };
  const merge = (index: number) => {
    let { start: left, length: leftCount } = runs[index]!;
    const { start: right, length } = runs[index + 1]!;
    runs.splice(index, 2, { start: left, length: leftCount + length });
    const skipped = gallop(values[right]!, values, left, leftCount, 0, true);
    left += skipped;
    leftCount -= skipped;

    if (leftCount === 0) return;

    const rightCount = gallop(
      values[left + leftCount - 1]!,
      values,
      right,
      length,
      length - 1,
      false,
    );

    if (rightCount === 0) return;

    if (leftCount <= rightCount) mergeForward(left, leftCount, right, rightCount);
    else mergeBackward(left, leftCount, right, rightCount);
  };
  let minimum = values.length,
    remainder = 0;

  while (minimum >= 32) {
    remainder |= minimum & 1;
    minimum >>= 1;
  }

  minimum += remainder;

  for (let start = 0; start < values.length;) {
    let end = start + 1;

    if (end < values.length) {
      const descending = compare(values[end++]!, values[start]!) < 0;

      while (end < values.length && compare(values[end]!, values[end - 1]!) < 0 === descending)
        end++;

      if (descending) {
        for (let left = start, right = end - 1; left < right; left++, right--)
          [values[left], values[right]] = [values[right]!, values[left]!];
      }
    }

    const forced = Math.min(values.length, start + minimum);

    for (; end < forced; end++) {
      const value = values[end]!;
      let left = start,
        right = end;

      while (left < right) {
        const middle = (left + right) >>> 1;

        if (compare(value, values[middle]!) < 0) right = middle;
        else left = middle + 1;
      }

      copy(values, left, left + 1, end - left);
      values[left] = value;
    }

    runs.push({ start, length: end - start });
    start = end;

    while (runs.length > 1) {
      let index = runs.length - 2;

      if (index > 0 && runs[index - 1]!.length <= runs[index]!.length + runs[index + 1]!.length) {
        if (runs[index - 1]!.length < runs[index + 1]!.length) index--;
      } else if (runs[index]!.length > runs[index + 1]!.length) break;

      merge(index);
    }
  }

  while (runs.length > 1) {
    let index = runs.length - 2;

    if (index > 0 && runs[index - 1]!.length < runs[index + 1]!.length) index--;

    merge(index);
  }

  return values;
}
