import Ember from 'ember';

export default Ember.Component.extend({
  foo: Ember.computed('foo', 'foo.bar', 'foo.baz', function() {

  }),
});
