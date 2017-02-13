import Ember from 'ember';

export default Ember.Component.extend({
  personalInfo: Ember.computed('user.firstName', 'address1.firstLine', 'users.lastName', 'address2.secondLine', function() {

  }),

  foo: Ember.computed(function() {

  }),

  bar: Ember.computed('baz', function() {

  }),
});
