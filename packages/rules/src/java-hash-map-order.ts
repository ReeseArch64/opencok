interface Node {
  key: string;
  hash: number;
  red: boolean;
  next?: Node;
  prev?: Node;
  parent?: Node;
  left?: Node;
  right?: Node;
}

interface Bucket {
  head: Node;
  tree: boolean;
}

function hash(key: string): number {
  let code = 0;

  for (let i = 0; i < key.length; i++) {code = (Math.imul(code, 31) + key.charCodeAt(i)) | 0;}

  return code ^ (code >>> 16);
}

function rotate(root: Node, node: Node, left: boolean): Node {
  const promoted = (left ? node.right : node.left)!;
  const child = left ? promoted.left : promoted.right;

  if (left) {node.right = child;}
  else {node.left = child;}

  if (child) {child.parent = node;}

  promoted.parent = node.parent;

  if (!node.parent) {root = promoted;}
  else if (node.parent.left === node) {node.parent.left = promoted;}
  else {node.parent.right = promoted;}

  if (left) {promoted.left = node;}
  else {promoted.right = node;}

  node.parent = promoted;

  return root;
}

function balance(root: Node, node: Node): Node {
  node.red = true;

  while (node.parent?.red) {
    const parent = node.parent;
    const grand = parent.parent;

    if (!grand) {break;}

    const left = parent === grand.left;
    const uncle = left ? grand.right : grand.left;

    if (uncle?.red) {
      parent.red = false;
      uncle.red = false;
      grand.red = true;
      node = grand;
    } else {
      if (node === (left ? parent.right : parent.left)) {
        node = parent;
        root = rotate(root, node, left);
      }

      const nextParent = node.parent!;
      const nextGrand = nextParent.parent!;
      nextParent.red = false;
      nextGrand.red = true;
      root = rotate(root, nextGrand, !left);
    }
  }

  root.red = false;

  return root;
}

function direction(a: Node, b: Node): boolean {
  return a.hash < b.hash || (a.hash === b.hash && a.key < b.key);
}

function moveRoot(bucket: Bucket, root: Node) {
  if (bucket.head === root) {return;}

  if (root.prev) {root.prev.next = root.next;}

  if (root.next) {root.next.prev = root.prev;}

  root.prev = undefined;
  root.next = bucket.head;
  bucket.head.prev = root;
  bucket.head = root;
}

function treeify(bucket: Bucket) {
  let root: Node | undefined;

  for (let node: Node | undefined = bucket.head; node; node = node.next) {
    node.parent = node.left = node.right = undefined;
    node.red = false;

    if (!root) {
      root = node;
      continue;
    }

    let parent = root;

    for (;;) {
      const left = direction(node, parent);
      const child = left ? parent.left : parent.right;

      if (child) {
        parent = child;
        continue;
      }

      node.parent = parent;

      if (left) {parent.left = node;}
      else {parent.right = node;}

      root = balance(root, node);
      break;
    }
  }

  bucket.tree = true;
  moveRoot(bucket, root!);
}

function ordered(keys: Iterable<string>, hashKey: (key: string) => number): string[] {
  let buckets: (Bucket | undefined)[] = Array(16);
  const seen = new Set<string>();
  function resize() {
    const old = buckets;
    buckets = Array(old.length * 2);

    for (let index = 0; index < old.length; index++) {
      const bucket = old[index];

      if (!bucket) {continue;}

      const sides: Node[][] = [[], []];

      for (let node: Node | undefined = bucket.head; node; node = node.next)
        {sides[(node.hash & old.length) === 0 ? 0 : 1]!.push(node);}

      for (let side = 0; side < 2; side++) {
        const nodes = sides[side]!;

        if (!nodes.length) {continue;}

        for (let i = 0; i < nodes.length; i++) {
          nodes[i]!.prev = nodes[i - 1];
          nodes[i]!.next = nodes[i + 1];
        }

        const split = { head: nodes[0]!, tree: bucket.tree && nodes.length > 6 };

        if (split.tree && sides[1 - side]!.length) {treeify(split);}

        buckets[index + side * old.length] = split;
      }
    }
  }

  for (const key of keys) {
    if (seen.has(key)) {continue;}

    if (seen.size >= 4096 || typeof key !== "string") {throw new Error("Invalid hash map keys");}

    const node: Node = { key, hash: hashKey(key), red: false };
    const index = node.hash & (buckets.length - 1);
    const bucket = buckets[index];

    if (!bucket) {buckets[index] = { head: node, tree: false };}
    else if (bucket.tree) {
      let root = bucket.head;

      while (root.parent) {root = root.parent;}

      let parent = root;

      for (;;) {
        const left = direction(node, parent);
        const child = left ? parent.left : parent.right;

        if (child) {
          parent = child;
          continue;
        }

        node.parent = parent;
        node.prev = parent;
        node.next = parent.next;

        if (parent.next) {parent.next.prev = node;}

        parent.next = node;

        if (left) {parent.left = node;}
        else {parent.right = node;}

        moveRoot(bucket, balance(root, node));
        break;
      }
    } else {
      let tail = bucket.head;
      let length = 1;

      while (tail.next) {
        tail = tail.next;
        length++;
      }

      tail.next = node;
      node.prev = tail;

      if (length >= 8) {
        if (buckets.length < 64) {resize();}
        else {treeify(bucket);}
      }
    }

    seen.add(key);

    if (seen.size > buckets.length * 0.75) {resize();}
  }

  const result: string[] = [];

  for (const bucket of buckets)
    {for (let node = bucket?.head; node; node = node.next) {result.push(node.key);}}

  return result;
}

export function javaHashMapOrder(keys: Iterable<string>): string[] {
  return ordered(keys, hash);
}

export function javaIntHashMapOrder(keys: Iterable<number>): number[] {
  function* strings() {
    for (const key of keys) {
      if (!Number.isInteger(key) || key < -2147483648 || key > 2147483647)
        {throw new Error("Invalid integer hash map key");}

      yield String(key);
    }
  }

  return ordered(strings(), (key) => {
    const value = Number(key);

    return value ^ (value >>> 16);
  }).map(Number);
}
