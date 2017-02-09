import Ember from 'ember';

export default Ember.Component.extend({
  foo: Ember.computed('foo.bar.{baz,foo,bar}', 'foo', 'foo.baz', function() {

  }),
});
