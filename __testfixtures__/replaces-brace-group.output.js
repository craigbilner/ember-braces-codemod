import Ember from 'ember';

export default Ember.Component.extend({
  foo: Ember.computed('foo.{bar,baz}', 'foo', function() {

  }),

  bar: Ember.computed('d.{b,cc}', 'aaa', function() {

  }),
});
