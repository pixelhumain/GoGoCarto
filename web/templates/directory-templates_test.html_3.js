/**
 * @fileoverview Compiled template for file
 *
 * 
 *
 * @suppress {checkTypes|fileoverviewTags}
 */

goog.provide('biopen_twigJs_test');

goog.require('twig');
goog.require('twig.filter');

/**
 * @constructor
 * @param {twig.Environment} env
 * @extends {twig.Template}
 */
biopen_twigJs_test = function(env) {
    twig.Template.call(this, env);
};
twig.inherits(biopen_twigJs_test, twig.Template);

/**
 * @inheritDoc
 */
biopen_twigJs_test.prototype.getParent_ = function(context) {
    return false;
};

/**
 * @inheritDoc
 */
biopen_twigJs_test.prototype.render_ = function(sb, context, blocks) {
    blocks = typeof(blocks) == "undefined" ? {} : blocks;
    // line 2
    sb.append("<div> hou le joli test!<\/div>");
};

/**
 * @inheritDoc
 */
biopen_twigJs_test.prototype.getTemplateName = function() {
    return "biopen_twigJs_test";
};

/**
 * Returns whether this template can be used as trait.
 *
 * @return {boolean}
 */
biopen_twigJs_test.prototype.isTraitable = function() {
    return false;
};
/* {% twig_js name="biopen_twigJs_test" %}*/
/* <div> hou le joli test!</div>*/
