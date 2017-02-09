# Ember braces codemod

To conform to [this linting rule](https://github.com/netguru/eslint-plugin-ember/blob/master/docs/rules/use-brace-expansion.md)
, this codemod will replace computed props with their brace equivalent if possible.

## Changes

### willChange

```js
export default Ember.Component.extend({
  personalInfo: Ember.computed('user.firstName', 'address.firstLine', 'user.lastName', 'address.secondLine', function() {

  }),
});
```

will become

```js
export default Ember.Component.extend({
  personalInfo: Ember.computed(
    'user.{firstName,lastName}',
    'address.{firstLine,secondLine}',
    function() {

    }
  ),
});
```

#### nested expressions

```js
export default Ember.Component.extend({
  personalInfo: Ember.computed('a.b.c', 'a.b.d', function() {
  
  }),
});
```

will become

```js
export default Ember.Component.extend({
  personalInfo: Ember.computed('a.b.{c,d}', function() {
  
  }),
});
```

### wontChange

#### things that can't be grouped

```js
export default Ember.Component.extend({
  personalInfo: Ember.computed('foo', 'bar', 'baz.foo', function() {
  
  }),
});
