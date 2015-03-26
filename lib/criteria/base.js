/**
 * BaseCriteria
 *
 * Parent of all the criteria
 */
var BaseCriteria = function() {};
BaseCriteria.prototype.applies = function(params) {
  return true;
};
BaseCriteria.prototype.matches = function(item, params) {
  return 1;
};
BaseCriteria.prototype.mixin = function(object) {
  for (var property in object) {
    if (object.hasOwnProperty(property)) {
      this[property] = object[property];
    }
  }
};
BaseCriteria.prototype.option = function(program) {
}
module.exports = BaseCriteria;
