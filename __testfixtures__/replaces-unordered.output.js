import Ember from 'ember';

export default Ember.Component.extend({
  personalInfo: Ember.computed(
    'address.{firstLine,secondLine}',
    'user.{firstName,lastName}',
    function() {

    }
  ),
});
