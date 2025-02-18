var register = function (Handlebars) {
  var helpers = {
    isEnterLocation: function (v1, v2, options) {
      return v1 === v2 ? options.fn(this) : options.inverse(this);
    },
  };

  if (Handlebars && typeof Handlebars.registerHelper === 'function') {
    for (var prop in helpers) {
      Handlebars.registerHelper(prop, helpers[prop]);
    }
  } else {
    return helpers;
  }
};

module.exports.register = register;
module.exports.helpers = register(null);
