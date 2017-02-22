import Ember from 'ember';

export default Ember.Component.extend({
  foo: Ember.computed('foo.bar', 'foo.baz', 'foo', function() {

  }),

  bar: Ember.computed('aaa', 'd.b', 'd.cc', function() {

  }),

  baz: Ember.computed('foo.bar.baz', 'faa.baa.baz', 'foo.bar', 'fzz.bar.baz', function() {

  }),

  bash: Ember.computed('foo.bar', 'foo.baz', 'foo.bash', function() {

  }).readOnly(),
});
