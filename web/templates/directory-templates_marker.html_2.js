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
    sb.append("\n<div class=\"marker-name bgdColorAs ");
    // line 3
    sb.append(twig.filter.escape(this.env_, ("pendingClass" in context ? context["pendingClass"] : null), "html", null, true));
    sb.append("\" option-id=");
    sb.append(twig.filter.escape(this.env_, twig.attr(twig.attr(("mainOptionValueToDisplay" in context ? context["mainOptionValueToDisplay"] : null), "option"), "ownerColorId"), "html", null, true));
    sb.append(" style=\"display:none\">");
    sb.append(twig.filter.escape(this.env_, twig.filter.capitalize(this.env_, twig.attr(("element" in context ? context["element"] : null), "name")), "html", null, true));
    sb.append("<\/div>\n\n<div class=\"marker-wrapper colorAs ");
    // line 5
    sb.append(twig.filter.escape(this.env_, ("pendingClass" in context ? context["pendingClass"] : null), "html", null, true));
    sb.append("\" option-id=\"");
    sb.append(twig.filter.escape(this.env_, twig.attr(twig.attr(("mainOptionValueToDisplay" in context ? context["mainOptionValueToDisplay"] : null), "option"), "ownerColorId"), "html", null, true));
    sb.append("\" id=\"marker-");
    sb.append(twig.filter.escape(this.env_, twig.attr(("element" in context ? context["element"] : null), "id"), "html", null, true));
    sb.append("\">\n\n\t<div class=\"rotate animate icon-marker\"><\/div>\n\t\n\t<div class=\"iconInsideMarker-wrapper rotate\">\n\t\t");
    // line 10
    context["mainIcon"] = ((twig.attr(("element" in context ? context["element"] : null), "isPending", undefined, "method")) ? ("icon-thumbs-up") : (twig.attr(twig.attr(("mainOptionValueToDisplay" in context ? context["mainOptionValueToDisplay"] : null), "option"), "icon")));
    // line 11
    sb.append("\t\t<div class=\"iconInsideMarker colorAs ");
    sb.append(twig.filter.escape(this.env_, ("pendingClass" in context ? context["pendingClass"] : null), "html", null, true));
    sb.append(" ");
    sb.append(((twig.attr(("mainOptionValueToDisplay" in context ? context["mainOptionValueToDisplay"] : null), "isFilledByFilters")) ? ("") : ("disabled")));
    sb.append(" ");
    sb.append(twig.filter.escape(this.env_, ("mainIcon" in context ? context["mainIcon"] : null), "html", null, true));
    sb.append("\" option-id=");
    sb.append(twig.filter.escape(this.env_, twig.attr(("mainOptionValueToDisplay" in context ? context["mainOptionValueToDisplay"] : null), "optionId"), "html", null, true));
    sb.append(">\n\t\t<\/div>\n\t<\/div>\n\n\t");
    // line 15
    context["nbreOthersOptions"] = twig.attr(("otherOptionsValuesToDisplay" in context ? context["otherOptionsValuesToDisplay"] : null), "length");
    sb.append("\t\n\n\t");
    // line 17
    if (((((((("nbreOthersOptions" in context ? context["nbreOthersOptions"] : null)) > (0))) && (("showMoreIcon" in context ? context["showMoreIcon"] : null)))) && ((!twig.attr(("element" in context ? context["element"] : null), "isPending", undefined, "method"))))) {
        // line 18
        sb.append("\n\t\t");
        // line 19
        context["widthMoreOption"] = (Number(((("nbreOthersOptions" in context ? context["nbreOthersOptions"] : null)) * (39))) + Number(5));
        sb.append("   \t\n\n    \t<div class=\"icon-plus-circle animate rotate\"><\/div>\n\n    \t<div class=\"moreIconContainer animate rotate\" \n    \t\t  style=\"width:");
        // line 24
        sb.append(twig.filter.escape(this.env_, ("widthMoreOption" in context ? context["widthMoreOption"] : null), "html", null, true));
        sb.append("px\">\n    \t\n\t\t\t");
        // line 26
        context['_parent'] = context;
        var seq = ("otherOptionsValuesToDisplay" in context ? context["otherOptionsValuesToDisplay"] : null);
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
            context["otherOptionValue"] = v;
            // line 27
            sb.append("\n\t\t\t\t");
            // line 28
            context["disableOption"] = ((twig.attr(("otherOptionValue" in context ? context["otherOptionValue"] : null), "isFilledByFilters")) ? ("") : ("disabled"));
            // line 29
            sb.append("\n\t\t\t\t<div class=\"moreIconWrapper ");
            // line 30
            sb.append(twig.filter.escape(this.env_, ("disableOption" in context ? context["disableOption"] : null), "html", null, true));
            sb.append(" ");
            sb.append(((twig.attr(twig.attr(("otherOptionValue" in context ? context["otherOptionValue"] : null), "option"), "ownerColorId")) ? ("colorAs") : ("")));
            sb.append(" ");
            sb.append(twig.filter.escape(this.env_, ("pendingClass" in context ? context["pendingClass"] : null), "html", null, true));
            sb.append("\" option-id=");
            sb.append(twig.filter.escape(this.env_, twig.attr(twig.attr(("otherOptionValue" in context ? context["otherOptionValue"] : null), "option"), "ownerColorId"), "html", null, true));
            sb.append("\n\t\t\t\t\t\tstyle=\"left:");
            // line 31
            sb.append(twig.filter.escape(this.env_, ((32) * (twig.attr(loop, "index0"))), "html", null, true));
            sb.append("px\">\n\t\t\t\t\t<span class=\"moreIcon iconInsideMarker ");
            // line 32
            sb.append(twig.filter.escape(this.env_, ("disableOption" in context ? context["disableOption"] : null), "html", null, true));
            sb.append(" ");
            sb.append(twig.filter.escape(this.env_, twig.attr(twig.attr(("otherOptionValue" in context ? context["otherOptionValue"] : null), "option"), "icon"), "html", null, true));
            sb.append(" colorAs ");
            sb.append(twig.filter.escape(this.env_, ("pendingClass" in context ? context["pendingClass"] : null), "html", null, true));
            sb.append("\" option-id=");
            sb.append(twig.filter.escape(this.env_, twig.attr(("otherOptionValue" in context ? context["otherOptionValue"] : null), "optionId"), "html", null, true));
            sb.append(">\n\t\t\t\t\t<\/span>\n\t\t\t \t<\/div>\n\n\t\t\t ");
            ++loop['index0'];
            ++loop['index'];
            loop['first'] = false;
            if (loop['length']) {
                --loop['revindex0'];
                --loop['revindex'];
                loop['last'] = 0 === loop['revindex0'];
            }
        }, this);
        // line 37
        sb.append("\n\t\t<\/div>\n\n\t");
    }
    // line 41
    sb.append("\n\t");
    // line 42
    if (twig.attr(("element" in context ? context["element"] : null), "isFavorite")) {
        // line 43
        sb.append("\t\t<div class=\"icon-star-full animate rotate\"><\/div>\n\t");
    }
    // line 45
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
/* <div class="marker-name bgdColorAs {{pendingClass}}" option-id={{mainOptionValueToDisplay.option.ownerColorId}} style="display:none">{{ element.name | capitalize }}</div>*/
/* */
/* <div class="marker-wrapper colorAs {{pendingClass}}" option-id="{{mainOptionValueToDisplay.option.ownerColorId}}" id="marker-{{ element.id }}">*/
/* */
/* 	<div class="rotate animate icon-marker"></div>*/
/* 	*/
/* 	<div class="iconInsideMarker-wrapper rotate">*/
/* 		{% set mainIcon = element.isPending() ? 'icon-thumbs-up' :  mainOptionValueToDisplay.option.icon %}*/
/* 		<div class="iconInsideMarker colorAs {{pendingClass}} {{ mainOptionValueToDisplay.isFilledByFilters ? '' : 'disabled' }} {{mainIcon}}" option-id={{ mainOptionValueToDisplay.optionId }}>*/
/* 		</div>*/
/* 	</div>*/
/* */
/* 	{% set nbreOthersOptions = otherOptionsValuesToDisplay.length %}	*/
/* */
/* 	{% if nbreOthersOptions > 0 and showMoreIcon and not element.isPending() %}*/
/* */
/* 		{% set widthMoreOption = nbreOthersOptions * 39 + 5  %}   	*/
/* */
/*     	<div class="icon-plus-circle animate rotate"></div>*/
/* */
/*     	<div class="moreIconContainer animate rotate" */
/*     		  style="width:{{ widthMoreOption }}px">*/
/*     	*/
/* 			{% for otherOptionValue in otherOptionsValuesToDisplay %}*/
/* */
/* 				{% set disableOption = otherOptionValue.isFilledByFilters ? '' : 'disabled' %}*/
/* */
/* 				<div class="moreIconWrapper {{ disableOption }} {{ otherOptionValue.option.ownerColorId ? 'colorAs' : '' }} {{pendingClass}}" option-id={{ otherOptionValue.option.ownerColorId }}*/
/* 						style="left:{{ 32 * loop.index0 }}px">*/
/* 					<span class="moreIcon iconInsideMarker {{ disableOption }} {{ otherOptionValue.option.icon }} colorAs {{pendingClass}}" option-id={{ otherOptionValue.optionId }}>*/
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
