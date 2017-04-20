/**
 * @fileoverview Compiled template for file
 *
 * 
 *
 * @suppress {checkTypes|fileoverviewTags}
 */

goog.provide('biopen_twigJs_category_value');

goog.require('twig');
goog.require('twig.filter');

/**
 * @constructor
 * @param {twig.Environment} env
 * @extends {twig.Template}
 */
biopen_twigJs_category_value = function(env) {
    twig.Template.call(this, env);
};
twig.inherits(biopen_twigJs_category_value, twig.Template);

/**
 * @inheritDoc
 */
biopen_twigJs_category_value.prototype.getParent_ = function(context) {
    return false;
};

/**
 * @inheritDoc
 */
biopen_twigJs_category_value.prototype.render_ = function(sb, context, blocks) {
    blocks = typeof(blocks) == "undefined" ? {} : blocks;
    // line 2
    sb.append("\n");
    // line 3
    context["displayThisCategoryValue"] = ((twig.attr(twig.attr(("categoryValue" in context ? context["categoryValue"] : null), "children"), "length")) > (0));
    // line 4
    sb.append("\n");
    // line 5
    if (("displayThisCategoryValue" in context ? context["displayThisCategoryValue"] : null)) {
        // line 6
        sb.append("\t<div class=\"category-wrapper\">\n\t");
        // line 7
        if (((("subcategoriesCount" in context ? context["subcategoriesCount"] : null)) > (1))) {
            // line 8
            sb.append("\t\t<div class=\"category-name\">");
            sb.append(twig.filter.escape(this.env_, twig.attr(twig.attr(("categoryValue" in context ? context["categoryValue"] : null), "category"), "name"), "html", null, true));
            sb.append("<\/div>\n\t\t");
        }
    }
    // line 11
    sb.append("\n");
    // line 12
    context['_parent'] = context;
    var seq = twig.attr(("categoryValue" in context ? context["categoryValue"] : null), "children");
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
        context["optionValue"] = v;
        // line 13
        sb.append("\n\t\t");
        // line 14
        context["displayFirstCategoryInline"] = (((((((!twig.attr(twig.attr(("categoryValue" in context ? context["categoryValue"] : null), "category"), "enableDescription"))) && (((twig.attr(twig.attr(("optionValue" in context ? context["optionValue"] : null), "children"), "length")) > (0))))) && (twig.attr(twig.attr(twig.attr(("optionValue" in context ? context["optionValue"] : null), "children"), 0, undefined, "array"), "isLastCategoryDepth")))) && ((!twig.attr(twig.attr(twig.attr(twig.attr(("optionValue" in context ? context["optionValue"] : null), "children"), 0, undefined, "array"), "category"), "enableDescription"))));
        // line 18
        sb.append("\n\t\t");
        // line 20
        sb.append("\t\t");
        context["colWidth"] = ((twig.attr(twig.attr(("categoryValue" in context ? context["categoryValue"] : null), "category"), "enableDescription")) ? ("s6 m4") : ("s12"));
        // line 21
        sb.append("\t  <div class='row ");
        if (twig.attr(loop, "first")) {
            sb.append("strong");
        }
        sb.append("'>\n\t    <span class=\"option-value col ");
        // line 22
        sb.append(twig.filter.escape(this.env_, ("colWidth" in context ? context["colWidth"] : null), "html", null, true));
        sb.append("\">\n\n\t    \t");
        // line 24
        context["iconClass"] = ((twig.attr(twig.attr(("optionValue" in context ? context["optionValue"] : null), "option"), "icon")) ? (twig.attr(twig.attr(("optionValue" in context ? context["optionValue"] : null), "option"), "icon")) : ("icon-angle-right"));
        sb.append("\t\n\t\t\t\t");
        // line 25
        if (("iconClass" in context ? context["iconClass"] : null)) {
            sb.append("    \n\t\t\t\t\t<span class=\"icon ");
            // line 26
            sb.append(twig.filter.escape(this.env_, ("iconClass" in context ? context["iconClass"] : null), "html", null, true));
            sb.append(" colorAs\" option-id=");
            sb.append(twig.filter.escape(this.env_, twig.attr(twig.attr(("optionValue" in context ? context["optionValue"] : null), "option"), "id"), "html", null, true));
            sb.append(" ><\/span>\n\t\t\t\t");
        }
        // line 28
        sb.append("\t\t\t\t\n\t      <span class=\"option-name\" option-id=");
        // line 29
        sb.append(twig.filter.escape(this.env_, twig.attr(twig.attr(("optionValue" in context ? context["optionValue"] : null), "option"), "id"), "html", null, true));
        sb.append(" >");
        sb.append(twig.filter.escape(this.env_, twig.filter.capitalize(this.env_, twig.attr(twig.attr(("optionValue" in context ? context["optionValue"] : null), "option"), "nameShort")), "html", null, true));
        sb.append("<\/span> \n\n\t      ");
        // line 31
        if (("displayFirstCategoryInline" in context ? context["displayFirstCategoryInline"] : null)) {
            // line 32
            sb.append("\t      \t<span class=\"inline-option\">(\n\t      \t\t");
            // line 33
            var seq1 = twig.attr(twig.attr(twig.attr(("optionValue" in context ? context["optionValue"] : null), "children"), 0, undefined, "array"), "children");
            var loop1 = {
                'parent': loop,
                'index0': 0,
                'index': 1,
                'first': true
            };
            if (twig.countable(seq1)) {
                var length = twig.count(seq1);
                loop1['revindex0'] = length - 1;
                loop1['revindex'] = length;
                loop1['length'] = length;
                loop1['last'] = 1 === length;
            }
            twig.forEach(seq1, function(v1, k1) {
                context["_key"] = k1;
                context["suboptionValue"] = v1;
                sb.append(" \n\t      \t\t\t<span>");
                // line 34
                sb.append(twig.filter.escape(this.env_, twig.attr(twig.attr(("suboptionValue" in context ? context["suboptionValue"] : null), "option"), "name"), "html", null, true));
                sb.append(" ");
                if ((!twig.attr(loop1, "last"))) {
                    sb.append(", ");
                }
                sb.append("<\/span> \n\t      \t\t\t\n\t      \t");
                ++loop1['index0'];
                ++loop1['index'];
                loop1['first'] = false;
                if (loop1['length']) {
                    --loop1['revindex0'];
                    --loop1['revindex'];
                    loop1['last'] = 0 === loop1['revindex0'];
                }
            }, this);
            // line 36
            sb.append(")\n\t      <\/span>\n\t      ");
        }
        // line 39
        sb.append("\n\t    <\/span>\n\t    ");
        // line 41
        if (twig.attr(twig.attr(("categoryValue" in context ? context["categoryValue"] : null), "category"), "enableDescription")) {
            // line 42
            sb.append("\t    \t<span class=\"col s6 m8 option-description\">");
            sb.append(twig.filter.escape(this.env_, twig.filter.capitalize(this.env_, twig.attr(("optionValue" in context ? context["optionValue"] : null), "description")), "html", null, true));
            sb.append("<\/span>\n\t    ");
        }
        // line 44
        sb.append("\t  <\/div>\n\n\t");
        // line 46
        context["subcategoriesCount"] = twig.attr(twig.attr(("optionValue" in context ? context["optionValue"] : null), "children"), "length");
        // line 47
        sb.append("\t");
        if (("displayFirstCategoryInline" in context ? context["displayFirstCategoryInline"] : null)) {
            context["subcategoriesCount"] = ((("subcategoriesCount" in context ? context["subcategoriesCount"] : null)) - (1));
        }
        // line 48
        sb.append("\n\t");
        // line 49
        var seq1 = twig.attr(("optionValue" in context ? context["optionValue"] : null), "children");
        var loop1 = {
            'parent': loop,
            'index0': 0,
            'index': 1,
            'first': true
        };
        if (twig.countable(seq1)) {
            var length = twig.count(seq1);
            loop1['revindex0'] = length - 1;
            loop1['revindex'] = length;
            loop1['length'] = length;
            loop1['last'] = 1 === length;
        }
        twig.forEach(seq1, function(v1, k1) {
            context["_key"] = k1;
            context["subcategory"] = v1;
            // line 50
            sb.append("\n\t\t");
            // line 51
            if ((!((twig.attr(loop1, "first")) && (("displayFirstCategoryInline" in context ? context["displayFirstCategoryInline"] : null))))) {
                // line 52
                sb.append("\t\t\t");
                (new biopen_twigJs_category_value(this.env_)).render_(sb, twig.extend({}, context, {"categoryValue": ("subcategory" in context ? context["subcategory"] : null), "subcategoriesCount": ("subcategoriesCount" in context ? context["subcategoriesCount"] : null)}));
                sb.append(" \n\t\t");
            }
            // line 54
            sb.append("\n\t");
            ++loop1['index0'];
            ++loop1['index'];
            loop1['first'] = false;
            if (loop1['length']) {
                --loop1['revindex0'];
                --loop1['revindex'];
                loop1['last'] = 0 === loop1['revindex0'];
            }
        }, this);
        // line 55
        sb.append(" \n\n");
        ++loop['index0'];
        ++loop['index'];
        loop['first'] = false;
        if (loop['length']) {
            --loop['revindex0'];
            --loop['revindex'];
            loop['last'] = 0 === loop['revindex0'];
        }
    }, this);
    // line 57
    sb.append(" \n\n");
    // line 59
    if (("displayThisCategoryValue" in context ? context["displayThisCategoryValue"] : null)) {
        // line 60
        sb.append("\t<!-- div end for category-wrapper -->\n\t<\/div>\n");
    }
};

/**
 * @inheritDoc
 */
biopen_twigJs_category_value.prototype.getTemplateName = function() {
    return "biopen_twigJs_category_value";
};

/**
 * Returns whether this template can be used as trait.
 *
 * @return {boolean}
 */
biopen_twigJs_category_value.prototype.isTraitable = function() {
    return false;
};
/* {% twig_js name="biopen_twigJs_category_value" %}*/
/* */
/* {% set displayThisCategoryValue = categoryValue.children.length > 0 %}*/
/* */
/* {% if displayThisCategoryValue %}*/
/* 	<div class="category-wrapper">*/
/* 	{% if subcategoriesCount > 1 %}*/
/* 		<div class="category-name">{{ categoryValue.category.name }}</div>*/
/* 		{% endif %}*/
/* {% endif %}*/
/* */
/* {% for optionValue in categoryValue.children %}*/
/* */
/* 		{% set displayFirstCategoryInline = not categoryValue.category.enableDescription */
/* 																		and optionValue.children.length > 0 */
/* 																		and optionValue.children[0].isLastCategoryDepth */
/* 																		and not optionValue.children[0].category.enableDescription %}*/
/* */
/* 		{#{% set isDisabled = optionValue.option.isDisabled ? 'disabled' : '' %}#}*/
/* 		{% set colWidth = categoryValue.category.enableDescription ? 's6 m4' : 's12' %}*/
/* 	  <div class='row {% if loop.first %}strong{% endif %}'>*/
/* 	    <span class="option-value col {{ colWidth }}">*/
/* */
/* 	    	{% set iconClass = optionValue.option.icon ? optionValue.option.icon : 'icon-angle-right' %}	*/
/* 				{% if iconClass %}    */
/* 					<span class="icon {{ iconClass }} colorAs" option-id={{ optionValue.option.id }} ></span>*/
/* 				{% endif %}*/
/* 				*/
/* 	      <span class="option-name" option-id={{ optionValue.option.id }} >{{ optionValue.option.nameShort|capitalize }}</span> */
/* */
/* 	      {% if displayFirstCategoryInline %}*/
/* 	      	<span class="inline-option">(*/
/* 	      		{% for suboptionValue in optionValue.children[0].children %} */
/* 	      			<span>{{ suboptionValue.option.name }} {% if not loop.last %}, {% endif %}</span> */
/* 	      			*/
/* 	      	{% endfor %})*/
/* 	      </span>*/
/* 	      {% endif %}*/
/* */
/* 	    </span>*/
/* 	    {% if categoryValue.category.enableDescription %}*/
/* 	    	<span class="col s6 m8 option-description">{{ optionValue.description|capitalize }}</span>*/
/* 	    {% endif %}*/
/* 	  </div>*/
/* */
/* 	{% set subcategoriesCount = optionValue.children.length %}*/
/* 	{% if displayFirstCategoryInline %}{% set subcategoriesCount = subcategoriesCount - 1 %}{% endif %}*/
/* */
/* 	{% for subcategory in optionValue.children %}*/
/* */
/* 		{% if not (loop.first and displayFirstCategoryInline) %}*/
/* 			{% include '@directory/directory/twig-js-templates/element-info-category-value.html.twig' with { 'categoryValue' : subcategory, 'subcategoriesCount' : subcategoriesCount } %} */
/* 		{% endif %}*/
/* */
/* 	{% endfor %} */
/* */
/* {% endfor %} */
/* */
/* {% if displayThisCategoryValue %}*/
/* 	<!-- div end for category-wrapper -->*/
/* 	</div>*/
/* {% endif %}*/
