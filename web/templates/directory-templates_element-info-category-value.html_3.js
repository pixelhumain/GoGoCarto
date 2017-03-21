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
    context["displayThisCategoryValue"] = ((twig.attr(twig.attr(("categoryValue" in context ? context["categoryValue"] : null), "children"), "length")) > (1));
    // line 4
    sb.append("\n");
    // line 5
    if (("displayThisCategoryValue" in context ? context["displayThisCategoryValue"] : null)) {
        // line 6
        sb.append("\t<div class=\"category-wrapper\">\n\t<div class=\"category-name\">");
        // line 7
        sb.append(twig.filter.escape(this.env_, twig.attr(twig.attr(("categoryValue" in context ? context["categoryValue"] : null), "category"), "name"), "html", null, true));
        sb.append("<\/div>\n");
    }
    // line 9
    sb.append("\n");
    // line 10
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
        // line 11
        sb.append("\n\t");
        // line 12
        if (("displayThisCategoryValue" in context ? context["displayThisCategoryValue"] : null)) {
            // line 13
            sb.append("\n\t\t<!-- if subcategory.last children, prendre first categorie qui est pas avec description, puis enelevr cette categorie de la liste\n\t\tdes cat\u00e9gories-->\n\n\t\t");
            // line 17
            context["displayFirstCategoryInline"] = (((((((!twig.attr(twig.attr(("categoryValue" in context ? context["categoryValue"] : null), "category"), "enableDescription"))) && (((twig.attr(twig.attr(("optionValue" in context ? context["optionValue"] : null), "children"), "length")) > (0))))) && (twig.attr(twig.attr(twig.attr(("optionValue" in context ? context["optionValue"] : null), "children"), 0, undefined, "array"), "isLastCategoryDepth")))) && ((!twig.attr(twig.attr(twig.attr(twig.attr(("optionValue" in context ? context["optionValue"] : null), "children"), 0, undefined, "array"), "category"), "enableDescription"))));
            // line 21
            sb.append("\n\t\t");
            // line 22
            context["isDisabled"] = ((twig.attr(twig.attr(("optionValue" in context ? context["optionValue"] : null), "option"), "isDisabled")) ? ("disabled") : (""));
            // line 23
            sb.append("\t\t");
            context["colWidth"] = ((twig.attr(twig.attr(("categoryValue" in context ? context["categoryValue"] : null), "category"), "enableDescription")) ? ("s6 m4") : ("s12"));
            // line 24
            sb.append("\t  <div class='row ");
            if (twig.attr(loop, "first")) {
                sb.append("strong");
            }
            sb.append("'>\n\t    <span class=\"option-value col ");
            // line 25
            sb.append(twig.filter.escape(this.env_, ("colWidth" in context ? context["colWidth"] : null), "html", null, true));
            sb.append(" ");
            sb.append(twig.filter.escape(this.env_, ("isDisabled" in context ? context["isDisabled"] : null), "html", null, true));
            sb.append("\">\n\n\t    \t");
            // line 27
            context["iconClass"] = ((twig.attr(twig.attr(("optionValue" in context ? context["optionValue"] : null), "option"), "useColorForMarker")) ? ("icon-marker") : (twig.attr(twig.attr(("optionValue" in context ? context["optionValue"] : null), "option"), "icon")));
            sb.append("\t\n\t\t\t\t");
            // line 28
            if (("iconClass" in context ? context["iconClass"] : null)) {
                sb.append("    \n\t\t\t\t\t<span class=\"icon ");
                // line 29
                sb.append(twig.filter.escape(this.env_, ("iconClass" in context ? context["iconClass"] : null), "html", null, true));
                sb.append(" ");
                sb.append(twig.filter.escape(this.env_, ("isDisabled" in context ? context["isDisabled"] : null), "html", null, true));
                sb.append("  colorAs\" option-id=");
                sb.append(twig.filter.escape(this.env_, twig.attr(twig.attr(("optionValue" in context ? context["optionValue"] : null), "option"), "id"), "html", null, true));
                sb.append(" ><\/span>\n\t\t\t\t");
            }
            // line 31
            sb.append("\n\t      <span class=\"option-name\">");
            // line 32
            sb.append(twig.filter.escape(this.env_, twig.filter.capitalize(this.env_, twig.attr(twig.attr(("optionValue" in context ? context["optionValue"] : null), "option"), "nameShort")), "html", null, true));
            sb.append("<\/span> \n\n\t      ");
            // line 34
            if (("displayFirstCategoryInline" in context ? context["displayFirstCategoryInline"] : null)) {
                // line 35
                sb.append("\t      \t<span class=\"inline-option\">( ");
                var seq1 = twig.attr(twig.attr(twig.attr(("optionValue" in context ? context["optionValue"] : null), "children"), 0, undefined, "array"), "children");
                twig.forEach(seq1, function(v1, k1) {
                    context["_key"] = k1;
                    context["suboptionValue"] = v1;
                    sb.append(" ");
                    sb.append(twig.filter.escape(this.env_, twig.attr(twig.attr(("suboptionValue" in context ? context["suboptionValue"] : null), "option"), "name"), "html", null, true));
                    sb.append(" ");
                }, this);
                sb.append(" )<\/span>\n\t      ");
            }
            // line 37
            sb.append("\n\t    <\/span>\n\t    ");
            // line 39
            if (twig.attr(twig.attr(("categoryValue" in context ? context["categoryValue"] : null), "category"), "enableDescription")) {
                // line 40
                sb.append("\t    \t<span class=\"col s6 m8 option-description ");
                sb.append(twig.filter.escape(this.env_, ("isDisabled" in context ? context["isDisabled"] : null), "html", null, true));
                sb.append("\">");
                sb.append(twig.filter.escape(this.env_, twig.filter.capitalize(this.env_, twig.attr(("optionValue" in context ? context["optionValue"] : null), "description")), "html", null, true));
                sb.append("<\/span>\n\t    ");
            }
            // line 42
            sb.append("\t  <\/div>\n\n\t");
        }
        // line 45
        sb.append("\n\t");
        // line 46
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
            // line 47
            sb.append("\n\t\t");
            // line 48
            if ((!((twig.attr(loop1, "first")) && (("displayFirstCategoryInline" in context ? context["displayFirstCategoryInline"] : null))))) {
                // line 49
                sb.append("\t\t\t");
                (new biopen_twigJs_category_value(this.env_)).render_(sb, twig.extend({}, context, {"categoryValue": ("subcategory" in context ? context["subcategory"] : null)}));
                sb.append(" \n\t\t");
            }
            // line 51
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
        // line 52
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
    // line 54
    sb.append(" \n\n");
    // line 56
    if (("displayThisCategoryValue" in context ? context["displayThisCategoryValue"] : null)) {
        // line 57
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
/* {% set displayThisCategoryValue = categoryValue.children.length > 1 %}*/
/* */
/* {% if displayThisCategoryValue %}*/
/* 	<div class="category-wrapper">*/
/* 	<div class="category-name">{{ categoryValue.category.name }}</div>*/
/* {% endif %}*/
/* */
/* {% for optionValue in categoryValue.children %}*/
/* */
/* 	{% if displayThisCategoryValue %}*/
/* */
/* 		<!-- if subcategory.last children, prendre first categorie qui est pas avec description, puis enelevr cette categorie de la liste*/
/* 		des catégories-->*/
/* */
/* 		{% set displayFirstCategoryInline = not categoryValue.category.enableDescription */
/* 																		and optionValue.children.length > 0 */
/* 																		and optionValue.children[0].isLastCategoryDepth */
/* 																		and not optionValue.children[0].category.enableDescription %}*/
/* */
/* 		{% set isDisabled = optionValue.option.isDisabled ? 'disabled' : '' %}*/
/* 		{% set colWidth = categoryValue.category.enableDescription ? 's6 m4' : 's12' %}*/
/* 	  <div class='row {% if loop.first %}strong{% endif %}'>*/
/* 	    <span class="option-value col {{ colWidth }} {{ isDisabled }}">*/
/* */
/* 	    	{% set iconClass = optionValue.option.useColorForMarker ? 'icon-marker' : optionValue.option.icon %}	*/
/* 				{% if iconClass %}    */
/* 					<span class="icon {{ iconClass }} {{ isDisabled }}  colorAs" option-id={{ optionValue.option.id }} ></span>*/
/* 				{% endif %}*/
/* */
/* 	      <span class="option-name">{{ optionValue.option.nameShort|capitalize }}</span> */
/* */
/* 	      {% if displayFirstCategoryInline %}*/
/* 	      	<span class="inline-option">( {% for suboptionValue in optionValue.children[0].children %} {{ suboptionValue.option.name }} {% endfor %} )</span>*/
/* 	      {% endif %}*/
/* */
/* 	    </span>*/
/* 	    {% if categoryValue.category.enableDescription %}*/
/* 	    	<span class="col s6 m8 option-description {{ isDisabled }}">{{ optionValue.description|capitalize }}</span>*/
/* 	    {% endif %}*/
/* 	  </div>*/
/* */
/* 	{% endif %}*/
/* */
/* 	{% for subcategory in optionValue.children %}*/
/* */
/* 		{% if not (loop.first and displayFirstCategoryInline) %}*/
/* 			{% include '@directory/directory/twig-js-templates/element-info-category-value.html.twig' with { 'categoryValue' : subcategory } %} */
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
