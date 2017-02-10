import Ember from 'ember';

export default Ember.Component.extend({
  foo: Ember.computed('foo.bar.{bar,baz,foo}', 'foo.baz', 'foo', function() {

  }),
});
