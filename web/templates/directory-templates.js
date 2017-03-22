/**
 * @fileoverview Compiled template for file
 *
 * 
 *
 * @suppress {checkTypes|fileoverviewTags}
 */

goog.provide('biopen_twigJs_elementInfo');

goog.require('twig');
goog.require('twig.filter');

/**
 * @constructor
 * @param {twig.Environment} env
 * @extends {twig.Template}
 */
biopen_twigJs_elementInfo = function(env) {
    twig.Template.call(this, env);
};
twig.inherits(biopen_twigJs_elementInfo, twig.Template);

/**
 * @inheritDoc
 */
biopen_twigJs_elementInfo.prototype.getParent_ = function(context) {
    return false;
};

/**
 * @inheritDoc
 */
biopen_twigJs_elementInfo.prototype.render_ = function(sb, context, blocks) {
    blocks = typeof(blocks) == "undefined" ? {} : blocks;
    // line 2
    sb.append("\n");
    // line 6
    sb.append("<li id=\"element-info-");
    sb.append(twig.filter.escape(this.env_, twig.attr(("element" in context ? context["element"] : null), "id"), "html", null, true));
    sb.append("\" \n    class=\"element-item\" \n    data-element-id=\"");
    // line 8
    sb.append(twig.filter.escape(this.env_, twig.attr(("element" in context ? context["element"] : null), "id"), "html", null, true));
    sb.append("\">\n\n  ");
    // line 11
    sb.append("  <div class=\"collapsible-header bgdSoftColorAs\" option-id=");
    sb.append(twig.filter.escape(this.env_, twig.attr(("element" in context ? context["element"] : null), "colorOptionId"), "html", null, true));
    sb.append(">\n    \n    ");
    // line 14
    sb.append("    <div class='collapsible-header-title row'> \n\n      <span class=\"col s12 name\">\n\n        ");
    // line 19
    sb.append("        <span class=\"element-main-icon icon ");
    sb.append(twig.filter.escape(this.env_, twig.attr(("mainOptionToDisplay" in context ? context["mainOptionToDisplay"] : null), "icon"), "html", null, true));
    sb.append(" hideOnLargeScreen\"><\/span>\n        <span class=\"star-names-icons\">\n          ");
    // line 21
    context['_parent'] = context;
    var seq = ("starNames" in context ? context["starNames"] : null);
    twig.forEach(seq, function(v, k) {
        context["_key"] = k;
        context["starName"] = v;
        sb.append(" \n              <span class=\"icon icon-");
        // line 22
        sb.append(twig.filter.escape(this.env_, ("starName" in context ? context["starName"] : null), "html", null, true));
        sb.append("\"><\/span>\n            ");
    }, this);
    // line 24
    sb.append("        <\/span>   \n           \n        ");
    // line 27
    sb.append("        <span class=\"icon icon-close\" id=\"btn-close-bandeau-detail\"><\/span>\n        ");
    // line 28
    if (((("showDistance" in context ? context["showDistance"] : null)) && (((twig.attr(("element" in context ? context["element"] : null), "distance")) != (null))))) {
        // line 29
        sb.append("          <span class=\"right-align distance\">~ ");
        sb.append(twig.filter.escape(this.env_, twig.attr(("element" in context ? context["element"] : null), "distance"), "html", null, true));
        sb.append(" km<\/span>\n        ");
    }
    // line 30
    sb.append("  \n\n        ");
    // line 33
    sb.append("        ");
    sb.append(twig.filter.escape(this.env_, twig.filter.capitalize(this.env_, twig.attr(("element" in context ? context["element"] : null), "name")), "html", null, true));
    sb.append("\n\n      <\/span>\n      \n    <\/div>\n\n    ");
    // line 40
    sb.append("    <div class='collapsible-header-more row'>\n\n      ");
    // line 43
    sb.append("      <span class=\"description col s12\">");
    sb.append(twig.filter.escape(this.env_, twig.filter.capitalize(this.env_, twig.attr(("element" in context ? context["element"] : null), "description")), "html", null, true));
    sb.append("<\/span> \n\n      ");
    // line 46
    sb.append("      <span class=\"products col s8 hideOnLargeScreen\">\n        ");
    // line 47
    sb.append(twig.filter.escape(this.env_, twig.filter.capitalize(this.env_, twig.attr(("mainOptionToDisplay" in context ? context["mainOptionToDisplay"] : null), "name")), "html", null, true));
    sb.append(" \n        ");
    // line 48
    if (((twig.attr(("otherOptionsToDisplay" in context ? context["otherOptionsToDisplay"] : null), "length")) != (0))) {
        sb.append(", ");
    }
    // line 49
    sb.append("\n        ");
    // line 50
    context['_parent'] = context;
    var seq = ("otherOptionsToDisplay" in context ? context["otherOptionsToDisplay"] : null);
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
        context["option"] = v;
        sb.append(" \n            ");
        // line 51
        context["isDisabled"] = ((twig.attr(("option" in context ? context["option"] : null), "isDisabled")) ? ("disabled") : (""));
        // line 52
        sb.append("            <span class=\"product ");
        sb.append(twig.filter.escape(this.env_, ("isDisabled" in context ? context["isDisabled"] : null), "html", null, true));
        sb.append("\">");
        sb.append(twig.filter.escape(this.env_, twig.filter.capitalize(this.env_, twig.attr(("option" in context ? context["option"] : null), "name")), "html", null, true));
        sb.append(" <\/span>\n            ");
        // line 53
        if ((!twig.attr(loop, "last"))) {
            sb.append(", ");
        }
        // line 54
        sb.append("        ");
        ++loop['index0'];
        ++loop['index'];
        loop['first'] = false;
        if (loop['length']) {
            --loop['revindex0'];
            --loop['revindex'];
            loop['last'] = 0 === loop['revindex0'];
        }
    }, this);
    // line 55
    sb.append("\n      <\/span>\n\n      ");
    // line 59
    sb.append("      <span class=\"col s4 right-align btn-select-as-representant-container\" style=\"display:none\">\n        <button class=\"btn btn-select-as-representant waves-effect waves-light\" >S\u00e9lectionner<\/button> \n      <\/span>\n\n      ");
    // line 64
    sb.append("      <span class=\"col s4 right-align starRespresentantLabel\" style=\"display:none\">Element principal<\/span>\n\n      ");
    // line 67
    sb.append("      <a><span class=\"col s4 right-align moreInfos hideOnLargeScreen\">Plus d'infos<\/span><\/a>\n      <a><span class=\"col s4 right-align lessInfos hideOnLargeScreen\" style=\"display:none\">Moins d'infos<\/span><\/a>\n\n    <\/div>\n\n  <\/div>\n\n  ");
    // line 75
    sb.append("  <div class=\"collapsible-body moreDetails custom-scroll-bar\" > \n  \n    ");
    // line 78
    sb.append("    ");
    if (("listingMode" in context ? context["listingMode"] : null)) {
        // line 79
        sb.append("      <div class=\"menu-element bgdSoftColorAs\" option-id=");
        sb.append(twig.filter.escape(this.env_, twig.attr(("element" in context ? context["element"] : null), "colorOptionId"), "html", null, true));
        sb.append(">  \n\n        <div class=\"menu-element-item item-add-favorite\" style=\"display:none\">\n          <span class=\"menu-icon icon-star-empty icon-favorite tooltipped\" \n          data-position=\"top\" data-delay=\"0\" data-tooltip=\"Enregistrer comme favoris\"><\/span>\n          <span class=\"menu-element-item-text\">Enregistrer<\/span>\n        <\/div>\n        <div class=\"menu-element-item item-remove-favorite\" style=\"display:none\">\n          <span class=\"menu-icon icon-star-full icon-favorite tooltipped\"\n          data-position=\"top\" data-delay=\"0\" data-tooltip=\"Retirer des favoris\"><\/span>\n          <span class=\"menu-element-item-text favorite\">Enregistr\u00e9<\/span>\n        <\/div>\n        <div class=\"menu-element-item item-share\">\n          <span class=\"menu-icon icon-share-alt tooltipped\"\n          data-position=\"top\" data-delay=\"0\" data-tooltip=\"Partager l'URL\"><\/span>\n          <span class=\"menu-element-item-text\">Partager l'URL<\/span>\n        <\/div>\n        <div class=\"menu-element-item item-directions\">\n          <span class=\"menu-icon icon-directions tooltipped\" \n          data-position=\"top\" data-delay=\"0\" data-tooltip=\"Itin\u00e9raire vers cet \u00e9l\u00e9ment\"><\/span>\n          <span class=\"menu-element-item-text\">Itin\u00e9raire<\/span>\n        <\/div>\n        <div class=\"menu-element-item item-edit\">\n          <span class=\"menu-icon icon-edit tooltipped\" \n          data-position=\"top\" data-delay=\"0\" data-tooltip=\"Proposer des modifications\"><\/span>\n          <span class=\"menu-element-item-text\">Proposer des modifications<\/span>\n        <\/div>\n        <div class=\"menu-element-item item-delete\"> \n          <span class=\"menu-icon btn-delete icon-exclamation-1 tooltipped\" \n          data-position=\"top\" data-delay=\"0\" data-tooltip=\"Signaler une erreur\"><\/span>\n          <span class=\"menu-element-item-text\">Signaler une erreur<\/span>\n        <\/div>  \n            \n      <\/div> \n    ");
    }
    // line 114
    sb.append("  \n    ");
    // line 116
    sb.append("    <div class=\"collapsible-body-main-content\"> \n\n      ");
    // line 119
    sb.append("      <h3>Infos<\/h3>   \n      <div class=\"section row sectionInfos\">\n\n        ");
    // line 123
    sb.append("        <span class=\"col s12 address\">");
    sb.append(twig.filter.escape(this.env_, twig.filter.capitalize(this.env_, twig.attr(("element" in context ? context["element"] : null), "address")), "html", null, true));
    sb.append("<\/span>\n        \n        ");
    // line 126
    sb.append("        ");
    if (twig.attr(("element" in context ? context["element"] : null), "tel")) {
        // line 127
        sb.append("          <span class=\"col s12 tel\">");
        sb.append(twig.filter.escape(this.env_, twig.attr(("element" in context ? context["element"] : null), "tel"), "html", null, true));
        sb.append("<\/span>\n        ");
    }
    // line 129
    sb.append("\n        ");
    // line 131
    sb.append("        ");
    if (twig.attr(("element" in context ? context["element"] : null), "mail")) {
        // line 132
        sb.append("          <span class=\"col s12 tel\"><a href=\"mailto:");
        sb.append(twig.filter.escape(this.env_, twig.attr(("element" in context ? context["element"] : null), "mail"), "html", null, true));
        sb.append("\">");
        sb.append(twig.filter.escape(this.env_, twig.attr(("element" in context ? context["element"] : null), "mail"), "html", null, true));
        sb.append("<\/a>\n          <\/span>\n        ");
    }
    // line 135
    sb.append("\n        ");
    // line 137
    sb.append("        ");
    if (twig.attr(("element" in context ? context["element"] : null), "webSite")) {
        // line 138
        sb.append("          <span class=\"col s12 tel\"><a href=\"");
        sb.append(twig.filter.escape(this.env_, twig.attr(("element" in context ? context["element"] : null), "webSite"), "html", null, true));
        sb.append("\" target=\"_blank\">");
        sb.append(twig.filter.escape(this.env_, twig.attr(("element" in context ? context["element"] : null), "webSite"), "html", null, true));
        sb.append("<\/a>\n          <\/span>\n        ");
    }
    // line 141
    sb.append("\n      <\/div>\n      <div class=\"divider\"><\/div>\n      \n      ");
    // line 146
    sb.append("      <h3>Les cat\u00e9gories<\/h3> \n      <div class=\"section row categories\">\n        \n        ");
    // line 149
    (new biopen_twigJs_category_value(this.env_)).render_(sb, twig.extend({}, context, {"categoryValue": ("mainCategoryValue" in context ? context["mainCategoryValue"] : null)}));
    sb.append("  \n\n      <\/div>\n      <div class=\"divider\"><\/div>\n\n      ");
    // line 155
    sb.append("      <h3>Horaires d'ouverture<\/h3>   \n      <div class=\"section row sectionOpenHourss\">  \n        ");
    // line 157
    context["count"] = 0;
    sb.append(" \n\n        ");
    // line 159
    context['_parent'] = context;
    var seq = twig.attr(("element" in context ? context["element"] : null), "getFormatedOpenHourss", undefined, "method");
    twig.forEach(seq, function(v, k) {
        context["key"] = k;
        context["horaire"] = v;
        sb.append(" \n          ");
        // line 160
        if (((("horaire" in context ? context["horaire"] : null)) != (null))) {
            // line 161
            sb.append("\n            <div class='row'>\n              <span class=\"col s3 day\">");
            // line 163
            sb.append(twig.filter.escape(this.env_, twig.filter.capitalize(this.env_, ("key" in context ? context["key"] : null)), "html", null, true));
            sb.append("<\/span>\n              <span class=\"col s9 openHours\">");
            // line 164
            sb.append(twig.filter.escape(this.env_, ("horaire" in context ? context["horaire"] : null), "html", null, true));
            sb.append(" <\/span>\n            <\/div>\n            ");
            // line 166
            context["count"] = (Number(("count" in context ? context["count"] : null)) + Number(1));
            sb.append(" \n\n          ");
        }
        // line 169
        sb.append("        ");
    }, this);
    sb.append("  \n\n        ");
    // line 171
    if (((("count" in context ? context["count"] : null)) == (0))) {
        sb.append("<div class='col'> Non renseign\u00e9es <\/div>");
    }
    sb.append(" \n      \n      <\/div> \n\n    <\/div>\n  <\/div>\n<\/li>\n\n");
};

/**
 * @inheritDoc
 */
biopen_twigJs_elementInfo.prototype.getTemplateName = function() {
    return "biopen_twigJs_elementInfo";
};

/**
 * Returns whether this template can be used as trait.
 *
 * @return {boolean}
 */
biopen_twigJs_elementInfo.prototype.isTraitable = function() {
    return false;
};
/* {% twig_js name="biopen_twigJs_elementInfo" %}*/
/* */
/* {# -------------- #}*/
/* {#  ELEMENT INFO  #}*/
/* {# -------------- #}*/
/* <li id="element-info-{{ element.id }}" */
/*     class="element-item" */
/*     data-element-id="{{ element.id }}">*/
/* */
/*   {# HEADER #}*/
/*   <div class="collapsible-header bgdSoftColorAs" option-id={{element.colorOptionId}}>*/
/*     */
/*     {# Header Title #}*/
/*     <div class='collapsible-header-title row'> */
/* */
/*       <span class="col s12 name">*/
/* */
/*         {# Icons #}*/
/*         <span class="element-main-icon icon {{mainOptionToDisplay.icon}} hideOnLargeScreen"></span>*/
/*         <span class="star-names-icons">*/
/*           {% for starName in starNames %} */
/*               <span class="icon icon-{{starName}}"></span>*/
/*             {% endfor %}*/
/*         </span>   */
/*            */
/*         {# Distance and Close Button #}*/
/*         <span class="icon icon-close" id="btn-close-bandeau-detail"></span>*/
/*         {% if showDistance and element.distance != null %}*/
/*           <span class="right-align distance">~ {{ element.distance }} km</span>*/
/*         {% endif %}  */
/* */
/*         {# Name #}*/
/*         {{ element.name|capitalize }}*/
/* */
/*       </span>*/
/*       */
/*     </div>*/
/* */
/*     {# Header More #}*/
/*     <div class='collapsible-header-more row'>*/
/* */
/*       {# Description #}*/
/*       <span class="description col s12">{{ element.description|capitalize }}</span> */
/* */
/*       {# Products litteral #}*/
/*       <span class="products col s8 hideOnLargeScreen">*/
/*         {{ mainOptionToDisplay.name|capitalize }} */
/*         {% if otherOptionsToDisplay.length != 0 %}, {% endif %}*/
/* */
/*         {% for option in otherOptionsToDisplay %} */
/*             {% set isDisabled = option.isDisabled ? 'disabled' : '' %}*/
/*             <span class="product {{isDisabled}}">{{ option.name|capitalize }} </span>*/
/*             {% if not loop.last %}, {% endif %}*/
/*         {% endfor %}*/
/* */
/*       </span>*/
/* */
/*       {# Select as Representant (constellation mode) #}*/
/*       <span class="col s4 right-align btn-select-as-representant-container" style="display:none">*/
/*         <button class="btn btn-select-as-representant waves-effect waves-light" >Sélectionner</button> */
/*       </span>*/
/* */
/*       {# Representant Label(constellation mode) #}*/
/*       <span class="col s4 right-align starRespresentantLabel" style="display:none">Element principal</span>*/
/* */
/*       {# Toggle Details Buttons #}*/
/*       <a><span class="col s4 right-align moreInfos hideOnLargeScreen">Plus d'infos</span></a>*/
/*       <a><span class="col s4 right-align lessInfos hideOnLargeScreen" style="display:none">Moins d'infos</span></a>*/
/* */
/*     </div>*/
/* */
/*   </div>*/
/* */
/*   {# BODY #}*/
/*   <div class="collapsible-body moreDetails custom-scroll-bar" > */
/*   */
/*     {# Menu in constellation mode #}*/
/*     {% if listingMode %}*/
/*       <div class="menu-element bgdSoftColorAs" option-id={{element.colorOptionId}}>  */
/* */
/*         <div class="menu-element-item item-add-favorite" style="display:none">*/
/*           <span class="menu-icon icon-star-empty icon-favorite tooltipped" */
/*           data-position="top" data-delay="0" data-tooltip="Enregistrer comme favoris"></span>*/
/*           <span class="menu-element-item-text">Enregistrer</span>*/
/*         </div>*/
/*         <div class="menu-element-item item-remove-favorite" style="display:none">*/
/*           <span class="menu-icon icon-star-full icon-favorite tooltipped"*/
/*           data-position="top" data-delay="0" data-tooltip="Retirer des favoris"></span>*/
/*           <span class="menu-element-item-text favorite">Enregistré</span>*/
/*         </div>*/
/*         <div class="menu-element-item item-share">*/
/*           <span class="menu-icon icon-share-alt tooltipped"*/
/*           data-position="top" data-delay="0" data-tooltip="Partager l'URL"></span>*/
/*           <span class="menu-element-item-text">Partager l'URL</span>*/
/*         </div>*/
/*         <div class="menu-element-item item-directions">*/
/*           <span class="menu-icon icon-directions tooltipped" */
/*           data-position="top" data-delay="0" data-tooltip="Itinéraire vers cet élément"></span>*/
/*           <span class="menu-element-item-text">Itinéraire</span>*/
/*         </div>*/
/*         <div class="menu-element-item item-edit">*/
/*           <span class="menu-icon icon-edit tooltipped" */
/*           data-position="top" data-delay="0" data-tooltip="Proposer des modifications"></span>*/
/*           <span class="menu-element-item-text">Proposer des modifications</span>*/
/*         </div>*/
/*         <div class="menu-element-item item-delete"> */
/*           <span class="menu-icon btn-delete icon-exclamation-1 tooltipped" */
/*           data-position="top" data-delay="0" data-tooltip="Signaler une erreur"></span>*/
/*           <span class="menu-element-item-text">Signaler une erreur</span>*/
/*         </div>  */
/*             */
/*       </div> */
/*     {% endif %}*/
/*   */
/*     {# Body Main Container #}*/
/*     <div class="collapsible-body-main-content"> */
/* */
/*       {# Contact infos #}*/
/*       <h3>Infos</h3>   */
/*       <div class="section row sectionInfos">*/
/* */
/*         {# Address #}*/
/*         <span class="col s12 address">{{ element.address|capitalize }}</span>*/
/*         */
/*         {# Tel #}*/
/*         {% if element.tel %}*/
/*           <span class="col s12 tel">{{ element.tel }}</span>*/
/*         {% endif %}*/
/* */
/*         {# Mail #}*/
/*         {% if element.mail %}*/
/*           <span class="col s12 tel"><a href="mailto:{{ element.mail }}">{{ element.mail }}</a>*/
/*           </span>*/
/*         {% endif %}*/
/* */
/*         {# WebSite #}*/
/*         {% if element.webSite %}*/
/*           <span class="col s12 tel"><a href="{{ element.webSite }}" target="_blank">{{ element.webSite }}</a>*/
/*           </span>*/
/*         {% endif %}*/
/* */
/*       </div>*/
/*       <div class="divider"></div>*/
/*       */
/*       {# Categories  #}*/
/*       <h3>Les catégories</h3> */
/*       <div class="section row categories">*/
/*         */
/*         {% include '@directory/directory/twig-js-templates/element-info-category-value.html.twig' with { 'categoryValue' : mainCategoryValue } %}  */
/* */
/*       </div>*/
/*       <div class="divider"></div>*/
/* */
/*       {# Open Hours #}*/
/*       <h3>Horaires d'ouverture</h3>   */
/*       <div class="section row sectionOpenHourss">  */
/*         {% set count = 0 %} */
/* */
/*         {% for key, horaire in element.getFormatedOpenHourss() %} */
/*           {% if horaire != null %}*/
/* */
/*             <div class='row'>*/
/*               <span class="col s3 day">{{ key|capitalize }}</span>*/
/*               <span class="col s9 openHours">{{ horaire }} </span>*/
/*             </div>*/
/*             {% set count = count + 1 %} */
/* */
/*           {% endif %}*/
/*         {% endfor %}  */
/* */
/*         {% if count == 0 %}<div class='col'> Non renseignées </div>{% endif %} */
/*       */
/*       </div> */
/* */
/*     </div>*/
/*   </div>*/
/* </li>*/
/* */
/* */

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
    sb.append("\n<div class=\"marker-name bgdColorAs\" option-id=");
    // line 3
    sb.append(twig.filter.escape(this.env_, twig.attr(("element" in context ? context["element"] : null), "colorOptionId"), "html", null, true));
    sb.append(" style=\"display:none\">");
    sb.append(twig.filter.escape(this.env_, twig.filter.capitalize(this.env_, twig.attr(("element" in context ? context["element"] : null), "name")), "html", null, true));
    sb.append("<\/div>\n\n<div class=\"marker-wrapper colorAs\" option-id=\"");
    // line 5
    sb.append(twig.filter.escape(this.env_, twig.attr(("element" in context ? context["element"] : null), "colorOptionId"), "html", null, true));
    sb.append("\" id=\"marker-");
    sb.append(twig.filter.escape(this.env_, twig.attr(("element" in context ? context["element"] : null), "id"), "html", null, true));
    sb.append("\">\n\n\t<div class=\"rotate animate icon-marker\"><\/div>\n\t\n\t<div class=\"iconInsideMarker-wrapper rotate\">\n\t\t<div class=\"iconInsideMarker colorAs ");
    // line 10
    sb.append(((twig.attr(("mainOptionToDisplay" in context ? context["mainOptionToDisplay"] : null), "isDisabled")) ? ("disabled") : ("")));
    sb.append(" ");
    sb.append(twig.filter.escape(this.env_, twig.attr(("mainOptionToDisplay" in context ? context["mainOptionToDisplay"] : null), "icon"), "html", null, true));
    sb.append("\" option-id=");
    sb.append(twig.filter.escape(this.env_, twig.attr(("mainOptionToDisplay" in context ? context["mainOptionToDisplay"] : null), "id"), "html", null, true));
    sb.append(">\n\t\t<\/div>\n\t<\/div>\n\n\t");
    // line 14
    context["nbreOthersOptions"] = twig.attr(("otherOptionsToDisplay" in context ? context["otherOptionsToDisplay"] : null), "length");
    sb.append("\t\n\n\t");
    // line 16
    if (((((("nbreOthersOptions" in context ? context["nbreOthersOptions"] : null)) > (0))) && (("showMoreIcon" in context ? context["showMoreIcon"] : null)))) {
        // line 17
        sb.append("\n\t\t");
        // line 18
        context["widthMoreOption"] = (Number(((("nbreOthersOptions" in context ? context["nbreOthersOptions"] : null)) * (39))) + Number(5));
        sb.append("   \t\n\n    \t<div class=\"icon-plus-circle animate rotate\"><\/div>\n\n    \t<div class=\"moreIconContainer animate rotate\" \n    \t\t  style=\"width:");
        // line 23
        sb.append(twig.filter.escape(this.env_, ("widthMoreOption" in context ? context["widthMoreOption"] : null), "html", null, true));
        sb.append("px\">\n    \t\n\t\t\t");
        // line 25
        context['_parent'] = context;
        var seq = ("otherOptionsToDisplay" in context ? context["otherOptionsToDisplay"] : null);
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
            context["otherOption"] = v;
            // line 26
            sb.append("\n\t\t\t\t");
            // line 27
            context["disableOption"] = ((twig.attr(("otherOption" in context ? context["otherOption"] : null), "isDisabled")) ? ("disabled") : (""));
            // line 28
            sb.append("\n\t\t\t\t<div class=\"moreIconWrapper ");
            // line 29
            sb.append(twig.filter.escape(this.env_, ("disableOption" in context ? context["disableOption"] : null), "html", null, true));
            sb.append(" ");
            sb.append(((twig.attr(("otherOption" in context ? context["otherOption"] : null), "ownerColorId")) ? ("colorAs") : ("")));
            sb.append("\" option-id=");
            sb.append(twig.filter.escape(this.env_, twig.attr(("otherOption" in context ? context["otherOption"] : null), "ownerColorId"), "html", null, true));
            sb.append("\n\t\t\t\t\t\tstyle=\"left:");
            // line 30
            sb.append(twig.filter.escape(this.env_, ((32) * (twig.attr(loop, "index0"))), "html", null, true));
            sb.append("px\">\n\t\t\t\t\t<span class=\"moreIcon iconInsideMarker ");
            // line 31
            sb.append(twig.filter.escape(this.env_, ("disableOption" in context ? context["disableOption"] : null), "html", null, true));
            sb.append(" ");
            sb.append(twig.filter.escape(this.env_, twig.attr(("otherOption" in context ? context["otherOption"] : null), "icon"), "html", null, true));
            sb.append(" colorAs\" option-id=");
            sb.append(twig.filter.escape(this.env_, twig.attr(("otherOption" in context ? context["otherOption"] : null), "id"), "html", null, true));
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
/* <div class="marker-name bgdColorAs" option-id={{element.colorOptionId}} style="display:none">{{ element.name | capitalize }}</div>*/
/* */
/* <div class="marker-wrapper colorAs" option-id="{{element.colorOptionId}}" id="marker-{{ element.id }}">*/
/* */
/* 	<div class="rotate animate icon-marker"></div>*/
/* 	*/
/* 	<div class="iconInsideMarker-wrapper rotate">*/
/* 		<div class="iconInsideMarker colorAs {{ mainOptionToDisplay.isDisabled ? 'disabled' : '' }} {{ mainOptionToDisplay.icon }}" option-id={{ mainOptionToDisplay.id }}>*/
/* 		</div>*/
/* 	</div>*/
/* */
/* 	{% set nbreOthersOptions = otherOptionsToDisplay.length %}	*/
/* */
/* 	{% if nbreOthersOptions > 0 and showMoreIcon %}*/
/* */
/* 		{% set widthMoreOption = nbreOthersOptions * 39 + 5  %}   	*/
/* */
/*     	<div class="icon-plus-circle animate rotate"></div>*/
/* */
/*     	<div class="moreIconContainer animate rotate" */
/*     		  style="width:{{ widthMoreOption }}px">*/
/*     	*/
/* 			{% for otherOption in otherOptionsToDisplay %}*/
/* */
/* 				{% set disableOption = otherOption.isDisabled ? 'disabled' : '' %}*/
/* */
/* 				<div class="moreIconWrapper {{ disableOption }} {{ otherOption.ownerColorId ? 'colorAs' : '' }}" option-id={{ otherOption.ownerColorId }}*/
/* 						style="left:{{ 32 * loop.index0 }}px">*/
/* 					<span class="moreIcon iconInsideMarker {{ disableOption }} {{ otherOption.icon }} colorAs" option-id={{ otherOption.id }}>*/
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
