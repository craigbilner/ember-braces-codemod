import Ember from 'ember';

export default Ember.Component.extend({
  foo: Ember.computed('foo.bar', 'foo.baz.bar', function() {

  }),
});
