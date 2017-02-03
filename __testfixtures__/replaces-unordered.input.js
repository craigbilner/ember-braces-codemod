import Ember from 'ember';

export default Ember.Component.extend({
  personalInfo: Ember.computed('user.firstName', 'address.firstLine', 'user.lastName', 'address.secondLine', function() {

  }),
});
