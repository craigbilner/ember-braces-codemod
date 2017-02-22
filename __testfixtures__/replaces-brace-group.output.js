import Ember from 'ember';

export default Ember.Component.extend({
  foo: Ember.computed('foo', 'foo.{bar,baz}', function() {

  }),

  bar: Ember.computed('aaa', 'd.{b,cc}', function() {

  }),

  baz: Ember.computed('faa.baa.baz', 'foo.{bar,bar.baz}', 'fzz.bar.baz', function() {

  }),
});
