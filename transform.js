const toLiteral = j => name => j.literal(name);

const keyLength = key => key.split('.').length;

const byLengthAlpha = (a, b) => {
  if (keyLength(a) < keyLength(b)) {
    return 1;
  }

  if (keyLength(a) > keyLength(b)) {
    return -1;
  }

  if (a > b) {
    return 1;
  }

  if (a < b) {
    return -1;
  }

  return 0;
};

const groupDepth = (a, b) => {
  const aParts = a.split('.');
  const bParts = b.split('.');
  const shortLength = Math.min(aParts.length, bParts.length);

  let i = 0;
  for (; i < shortLength; i += 1) {
    if (aParts[i] !== bParts[i]) {
      break;
    }
  }

  return i === shortLength ? i - 1 : i;
};

const takeSuffix = (key, depth) => key.split('.').slice(depth, key.length - 1).join('.');

const takePrefix = (key, depth) => key.split('.').slice(0, depth).join('.');

const makeKey = (group, key) => `${group}.${key}`;

const makeGroup = key => ({
  depth: 0,
  keys: [key],
});

const groupByDepth = ([x, ...xs], groups) => {
  if (!x) {
    return groups;
  }

  const newGroups = groups.slice(0);
  const lastGroup = newGroups[newGroups.length - 1];
  const { depth: lgDepth, group: lgGroup, keys: [lgKey] } = lastGroup;

  if (!lgDepth) {
    // last key wasn't grouped
    const depth = groupDepth(x, lgKey);
    if (depth) {
      // can group last one with this one
      const lastKey = lastGroup.keys.pop();
      lastGroup.keys.push(takeSuffix(lastKey, depth), takeSuffix(x, depth));
      lastGroup.depth = depth;
      lastGroup.group = takePrefix(x, depth);
    } else {
      // can't group this one with the last one, just add it on
      newGroups.push(makeGroup(x));
    }
  } else if (groupDepth(x, makeKey(lgGroup, lgKey)) === lgDepth) {
    // this one can be lumped in with the previous one(s)
    lastGroup.keys.push(takeSuffix(x, lgDepth));
  } else {
    // can't be grouped, just add it on
    newGroups.push(makeGroup(x));
  }

  return groupByDepth(xs, newGroups);
};

const group = ([a, b, ...c]) => {
  if (!a) {
    return [];
  }

  if (!b) {
    return [makeGroup(a)];
  }

  return groupByDepth([b, ...c], [makeGroup(a)]);
};

const toBrace = ({ group: prefix, keys }) =>
  prefix ? `${prefix}.{${keys.sort().join(',')}}` : keys[0];

const emberComputed = j => [
  j.Property,
  {
    value: {
      type: 'CallExpression',
      callee: {
        type: 'MemberExpression',
        object: {
          type: 'Identifier',
          name: 'Ember',
        },
        property: {
          type: 'Identifier',
          name: 'computed',
        },
      },
    },
  },
];

const transform = (file, api) => {
  const j = api.jscodeshift;
  const root = j(file.source);

  root.find(...emberComputed(j)).replaceWith((path) => {
    const args = path.value.value.arguments;
    const func = args[args.length - 1];
    const argNames =
      args.slice(0, args.length - 1).map(({ value }) => value);
    const newParams = group(argNames.sort(byLengthAlpha)).map(toBrace);

    if (argNames.length !== newParams.length) {
      /* eslint-disable no-param-reassign */
      path.value.value.arguments = newParams.map(toLiteral(j)).concat(func);
      /* eslint-disable no-param-reassign */
    }

    return path.node;
  });

  return root.toSource({
    quote: 'single',
  });
};

module.exports = transform;
