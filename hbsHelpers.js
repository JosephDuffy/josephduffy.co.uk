var extraHelpers = require('handlebars-helper');
var moment = require('moment');

var ifCondHelper = function (v1, operator, v2, options) {
    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
};

var ifProductionHelper = function() {
    return process.env.NODE_ENV === 'production';
};

var dateFormatter = function (date, format) {
    return moment(date).format(format);
};

var registerHelper = function(handlebars) {
    handlebars.registerHelper('ifCond', ifCondHelper);
    handlebars.registerHelper('isProduction', ifProductionHelper);

    // Override format date with our own implementation
    handlebars.registerHelper('formatDate', dateFormatter);

    for (var helperName in extraHelpers.helpers) {
        if (helperName === "formatDate") { break }
        var helperFunction = extraHelpers.helpers[helperName];
        handlebars.registerHelper(helperName, helperFunction);
    }
};

module.exports = registerHelper;