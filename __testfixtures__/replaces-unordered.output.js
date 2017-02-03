import Ember from 'ember';

export default Ember.Component.extend({
  personalInfo: Ember.computed(
    'user.{firstName,lastName}',
    'address.{firstLine,secondLine}',
    function() {

    }
  ),
});
