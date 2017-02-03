const init = arr => arr.slice(0, arr.length - 1);
const last = arr => arr[arr.length - 1];
const mergeProps = (merged, key) => {
  const newMerged = Object.assign({}, merged);
  const parts = key.split('.');

  if (parts.length !== 2) {
    // not valid for brace
    if (merged[key]) {
      // valid brace already exists
      newMerged[key].includeGroup = true;
    } else {
      // first invalid case
      newMerged[key] = null;
    }

    return newMerged;
  }

  const [group, prop] = parts;

  if (merged[group] === null) {
    // not a valid brace
    newMerged[group] = {
      includeGroup: true,
      props: [prop],
    };
  } else if (merged[group]) {
    // add to group
    newMerged[group].props.push(prop);
  } else {
    newMerged[group] = {
      props: [prop],
    };
  }

  return newMerged;
};

const keysToList = groupedKeys => (props, key) => {
  const info = groupedKeys[key];
  if (!info) {
    // no grouping, leave alone
    props.push(key);
    return props;
  }

  if (info.includeGroup) {
    // group independent of brace
    props.push(key);
  }

  if (info.props.length > 1) {
    // use brace
    props.push(`${key}.{${info.props}}`);
    return props;
  }

  // standard group.prop
  props.push(`${key}.${info.props[0]}`);
  return props;
};

const convertToBrace = (args) => {
  const keys = args.reduce(mergeProps, {});

  return Object.keys(keys).reduce(keysToList(keys), []);
};

const toLiteral = j => name => j.literal(name);

const transform = (file, api) => {
  const j = api.jscodeshift;
  const root = j(file.source);

  const computeds = root.find(j.Property, {
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
  });

  computeds.replaceWith((path) => {
    const keys = init(path.value.value.arguments);
    const func = last(path.value.value.arguments);
    const newParams = convertToBrace(keys.map(({ value }) => value));

    /* eslint-disable no-param-reassign */
    path.value.value.arguments = newParams.map(toLiteral(j)).concat(func);
    /* eslint-disable no-param-reassign */

    return path.node;
  });

  return root.toSource({
    quote: 'single',
  });
};

module.exports = transform;
