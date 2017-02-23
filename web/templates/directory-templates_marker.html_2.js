/**
 * @fileoverview Compiled template for file
 *
 * 
 *
 * @suppress {checkTypes|fileoverviewTags}
 */

goog.provide('biopen_twigJs_marker');

goog.require('twig');
goog.require('twig.filter');

/**
 * @constructor
 * @param {twig.Environment} env
 * @extends {twig.Template}
 */
biopen_twigJs_marker = function(env) {
    twig.Template.call(this, env);
};
twig.inherits(biopen_twigJs_marker, twig.Template);

/**
 * @inheritDoc
 */
biopen_twigJs_marker.prototype.getParent_ = function(context) {
    return false;
};

/**
 * @inheritDoc
 */
biopen_twigJs_marker.prototype.render_ = function(sb, context, blocks) {
    blocks = typeof(blocks) == "undefined" ? {} : blocks;
    // line 2
    sb.append("\n<div class=\"marker-name ");
    // line 3
    sb.append(twig.filter.escape(this.env_, twig.attr(("element" in context ? context["element"] : null), "type"), "html", null, true));
    sb.append("\" style=\"display:none\">");
    sb.append(twig.filter.escape(this.env_, twig.filter.capitalize(this.env_, twig.attr(("element" in context ? context["element"] : null), "name")), "html", null, true));
    sb.append("<\/div>\n\n<div class=\"marker-wrapper ");
    // line 5
    sb.append(twig.filter.escape(this.env_, twig.attr(("element" in context ? context["element"] : null), "type"), "html", null, true));
    sb.append("\" id=\"marker-");
    sb.append(twig.filter.escape(this.env_, twig.attr(("element" in context ? context["element"] : null), "id"), "html", null, true));
    sb.append("\">\n\n\t<div class=\"rotate animate icon-marker\"><\/div>\n\t\n\t<div class=\"iconInsideMarker-wrapper rotate\">\n\t\t<div class=\"iconInsideMarker ");
    // line 10
    sb.append(((twig.attr(twig.attr(("productsToDisplay" in context ? context["productsToDisplay"] : null), "main"), "disabled")) ? ("disabled") : ("")));
    sb.append(" icon-");
    sb.append(twig.filter.escape(this.env_, twig.attr(twig.attr(("productsToDisplay" in context ? context["productsToDisplay"] : null), "main"), "value"), "html", null, true));
    sb.append("\">\n\t\t<\/div>\n\t<\/div>\n\n\t");
    // line 14
    context["nbreOthersProducts"] = twig.attr(twig.attr(("productsToDisplay" in context ? context["productsToDisplay"] : null), "others"), "length");
    sb.append("\t\n\n\t");
    // line 16
    if (((((("nbreOthersProducts" in context ? context["nbreOthersProducts"] : null)) > (0))) && (("showMoreIcon" in context ? context["showMoreIcon"] : null)))) {
        // line 17
        sb.append("\n\t\t");
        // line 18
        context["widthMoreProduct"] = (Number(((("nbreOthersProducts" in context ? context["nbreOthersProducts"] : null)) * (39))) + Number(5));
        sb.append("   \t\n\n    \t<div class=\"icon-plus-circle animate rotate\"><\/div>\n\n    \t<div class=\"moreIconContainer animate rotate\" \n    \t\t  style=\"width:");
        // line 23
        sb.append(twig.filter.escape(this.env_, ("widthMoreProduct" in context ? context["widthMoreProduct"] : null), "html", null, true));
        sb.append("px\">\n    \t\n\t\t\t");
        // line 25
        context['_parent'] = context;
        var seq = twig.attr(("productsToDisplay" in context ? context["productsToDisplay"] : null), "others");
        var loop = {
            'index0': 0,
            'index': 1,
            'first': true
        };
        if (twig.countable(seq)) {
            var length = twig.count(seq);
            loop['revindex0'] = length - 1;
            loop['revindex'] = length;
            loop['length'] = length;
            loop['last'] = 1 === length;
        }
        twig.forEach(seq, function(v, k) {
            context["_key"] = k;
            context["otherProduct"] = v;
            // line 26
            sb.append("\n\t\t\t\t");
            // line 27
            context["disableProduct"] = ((twig.attr(("otherProduct" in context ? context["otherProduct"] : null), "disabled")) ? ("disabled") : (""));
            // line 28
            sb.append("\n\t\t\t\t<div class=\"moreIconWrapper ");
            // line 29
            sb.append(twig.filter.escape(this.env_, ("disableProduct" in context ? context["disableProduct"] : null), "html", null, true));
            sb.append("\"\n\t\t\t\t\t\tstyle=\"left:");
            // line 30
            sb.append(twig.filter.escape(this.env_, ((32) * (twig.attr(loop, "index0"))), "html", null, true));
            sb.append("px\">\n\t\t\t\t\t<span class=\"moreIcon iconInsideMarker ");
            // line 31
            sb.append(twig.filter.escape(this.env_, ("disableProduct" in context ? context["disableProduct"] : null), "html", null, true));
            sb.append(" icon-");
            sb.append(twig.filter.escape(this.env_, twig.attr(("otherProduct" in context ? context["otherProduct"] : null), "value"), "html", null, true));
            sb.append("\">\n\t\t\t\t\t<\/span>\n\t\t\t \t<\/div>\n\n\t\t\t ");
            ++loop['index0'];
            ++loop['index'];
            loop['first'] = false;
            if (loop['length']) {
                --loop['revindex0'];
                --loop['revindex'];
                loop['last'] = 0 === loop['revindex0'];
            }
        }, this);
        // line 36
        sb.append("\n\t\t<\/div>\n\n\t");
    }
    // line 40
    sb.append("\n\t");
    // line 41
    if (twig.attr(("element" in context ? context["element"] : null), "isFavorite")) {
        // line 42
        sb.append("\t\t<div class=\"icon-star-full animate rotate\"><\/div>\n\t");
    }
    // line 44
    sb.append("\n<\/div>");
};

/**
 * @inheritDoc
 */
biopen_twigJs_marker.prototype.getTemplateName = function() {
    return "biopen_twigJs_marker";
};

/**
 * Returns whether this template can be used as trait.
 *
 * @return {boolean}
 */
biopen_twigJs_marker.prototype.isTraitable = function() {
    return false;
};
/* {% twig_js name="biopen_twigJs_marker" %}*/
/* */
/* <div class="marker-name {{ element.type }}" style="display:none">{{ element.name | capitalize }}</div>*/
/* */
/* <div class="marker-wrapper {{ element.type }}" id="marker-{{ element.id }}">*/
/* */
/* 	<div class="rotate animate icon-marker"></div>*/
/* 	*/
/* 	<div class="iconInsideMarker-wrapper rotate">*/
/* 		<div class="iconInsideMarker {{ productsToDisplay.main.disabled ? 'disabled' : '' }} icon-{{ productsToDisplay.main.value }}">*/
/* 		</div>*/
/* 	</div>*/
/* */
/* 	{% set nbreOthersProducts = productsToDisplay.others.length %}	*/
/* */
/* 	{% if nbreOthersProducts > 0 and showMoreIcon %}*/
/* */
/* 		{% set widthMoreProduct = nbreOthersProducts * 39 + 5  %}   	*/
/* */
/*     	<div class="icon-plus-circle animate rotate"></div>*/
/* */
/*     	<div class="moreIconContainer animate rotate" */
/*     		  style="width:{{ widthMoreProduct }}px">*/
/*     	*/
/* 			{% for otherProduct in productsToDisplay.others %}*/
/* */
/* 				{% set disableProduct = otherProduct.disabled ? 'disabled' : '' %}*/
/* */
/* 				<div class="moreIconWrapper {{ disableProduct }}"*/
/* 						style="left:{{ 32 * loop.index0 }}px">*/
/* 					<span class="moreIcon iconInsideMarker {{ disableProduct }} icon-{{ otherProduct.value }}">*/
/* 					</span>*/
/* 			 	</div>*/
/* */
/* 			 {% endfor %}*/
/* */
/* 		</div>*/
/* */
/* 	{% endif %}*/
/* */
/* 	{% if element.isFavorite %}*/
/* 		<div class="icon-star-full animate rotate"></div>*/
/* 	{% endif %}*/
/* */
/* </div>*/
