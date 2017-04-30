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
    sb.append("  <div class=\"collapsible-header bgdSoftColorAs ");
    sb.append(twig.filter.escape(this.env_, ("pendingClass" in context ? context["pendingClass"] : null), "html", null, true));
    sb.append("\" option-id=");
    sb.append(twig.filter.escape(this.env_, twig.attr(("mainOptionValueToDisplay" in context ? context["mainOptionValueToDisplay"] : null), "colorOptionId"), "html", null, true));
    sb.append(">\n    \n    ");
    // line 14
    sb.append("    <div class='collapsible-header-title row'> \n\n      <span class=\"col s12 name\">\n\n        ");
    // line 19
    sb.append("        <span class=\"element-main-icon icon ");
    sb.append(twig.filter.escape(this.env_, twig.attr(twig.attr(("mainOptionValueToDisplay" in context ? context["mainOptionValueToDisplay"] : null), "option"), "icon"), "html", null, true));
    sb.append(" colorAs ");
    sb.append(twig.filter.escape(this.env_, ("pendingClass" in context ? context["pendingClass"] : null), "html", null, true));
    sb.append(" hideOnLargeScreen\" option-id=");
    sb.append(twig.filter.escape(this.env_, twig.attr(("mainOptionValueToDisplay" in context ? context["mainOptionValueToDisplay"] : null), "colorOptionId"), "html", null, true));
    sb.append("><\/span>\n        <span class=\"star-names-icons\">\n          ");
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
    // line 31
    sb.append("\n        ");
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
    sb.append("      <span class=\"inline-option-values col s8 hideOnLargeScreen\">\n        ");
    // line 50
    sb.append("\n        ");
    // line 51
    context['_parent'] = context;
    var seq = ("allOptionsValues" in context ? context["allOptionsValues"] : null);
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
        sb.append(" \n            ");
        // line 52
        context["isDisabled"] = ((twig.attr(("optionValue" in context ? context["optionValue"] : null), "isFilledByFilters")) ? ("") : ("disabled"));
        // line 53
        sb.append("            <span class=\"option-value ");
        sb.append(twig.filter.escape(this.env_, ("isDisabled" in context ? context["isDisabled"] : null), "html", null, true));
        sb.append("\">");
        sb.append(twig.filter.escape(this.env_, twig.filter.capitalize(this.env_, twig.attr(twig.attr(("optionValue" in context ? context["optionValue"] : null), "option"), "name")), "html", null, true));
        sb.append(" ");
        if ((!twig.attr(loop, "last"))) {
            sb.append(", ");
        }
        sb.append("<\/span>            \n        ");
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
    sb.append("\n      <\/span>      \n\n      ");
    // line 59
    sb.append("      <span class=\"col s4 right-align btn-select-as-representant-container\" style=\"display:none\">\n        <button class=\"btn btn-select-as-representant waves-effect waves-light\" >S\u00e9lectionner<\/button> \n      <\/span>\n\n      ");
    // line 64
    sb.append("      <span class=\"col s4 right-align starRespresentantLabel\" style=\"display:none\">Element principal<\/span>\n\n      ");
    // line 67
    sb.append("      <a><span class=\"col s4 right-align moreInfos hideOnLargeScreen\">Plus d'infos<\/span><\/a>\n      <a><span class=\"col s4 right-align lessInfos hideOnLargeScreen\" style=\"display:none\">Moins d'infos<\/span><\/a>\n\n    <\/div>\n\n    ");
    // line 72
    if (((twig.attr(("element" in context ? context["element"] : null), "isPending", undefined, "method")) && ((!("listingMode" in context ? context["listingMode"] : null))))) {
        // line 73
        sb.append("        <div class=\"vote-section\">\n          <span class=\"basic-message\">\n            <span class=\"icon-attention\"><\/span>\n            <span class=\"text\">Acteur en cours de validation ");
        // line 76
        sb.append("<\/span>\n            <span class=\"btn-vote-more-info validation-process-info\" onclick='$(\"#popup-vote\").openModal()'>EN SAVOIR PLUS<\/span>\n            <span class=\"vote-button btn btn-vote waves-effect waves-light\">Voter<\/span>\n          <\/span>\n          <div class=\"result-message\" style=\"display:none\"><\/div>\n        <\/div>\n    ");
    }
    // line 83
    sb.append("\n  <\/div>\n\n  ");
    // line 87
    sb.append("  <div class=\"collapsible-body moreDetails custom-scroll-bar\"> \n  \n    ");
    // line 90
    sb.append("    ");
    if (("listingMode" in context ? context["listingMode"] : null)) {
        // line 91
        sb.append("       ");
        if (twig.attr(("element" in context ? context["element"] : null), "isPending", undefined, "method")) {
            // line 92
            sb.append("      <div class=\"vote-section\">\n          <span class=\"basic-message\">\n            <span class=\"icon-attention\"><\/span>\n            <span class=\"text\">Attention cet acteur est en cours de validation<\/span>\n            <span class=\"vote-button btn btn-vote waves-effect waves-light\">Voter<\/span>\n          <\/span>\n          <div class=\"result-message\" style=\"display:none\"><\/div>\n      <\/div>\n      ");
        }
        // line 101
        sb.append("      <div class=\"menu-element bgdSoftColorAs ");
        sb.append(twig.filter.escape(this.env_, ("pendingClass" in context ? context["pendingClass"] : null), "html", null, true));
        sb.append("\" option-id=");
        sb.append(twig.filter.escape(this.env_, twig.attr(("mainOptionValueToDisplay" in context ? context["mainOptionValueToDisplay"] : null), "colorOptionId"), "html", null, true));
        sb.append(">  \n\n        <div class=\"menu-element-item item-add-favorite\" style=\"display:none\">\n          <span class=\"menu-icon icon-star-empty icon-favorite tooltipped\" \n          data-position=\"top\" data-delay=\"0\" data-tooltip=\"Enregistrer comme favoris\"><\/span>\n          <span class=\"menu-element-item-text\">Enregistrer<\/span>\n        <\/div>\n        <div class=\"menu-element-item item-remove-favorite\" style=\"display:none\">\n          <span class=\"menu-icon icon-star-full icon-favorite tooltipped\"\n          data-position=\"top\" data-delay=\"0\" data-tooltip=\"Retirer des favoris\"><\/span>\n          <span class=\"menu-element-item-text favorite\">Enregistr\u00e9<\/span>\n        <\/div>\n        <div class=\"menu-element-item item-share\">\n          <span class=\"menu-icon icon-share-alt tooltipped\"\n          data-position=\"top\" data-delay=\"0\" data-tooltip=\"Partager l'URL\"><\/span>\n          <span class=\"menu-element-item-text\">Partager l'URL<\/span>\n        <\/div>\n        <div class=\"menu-element-item item-directions\">\n          <span class=\"menu-icon icon-directions tooltipped\" \n          data-position=\"top\" data-delay=\"0\" data-tooltip=\"Itin\u00e9raire vers cet \u00e9l\u00e9ment\"><\/span>\n          <span class=\"menu-element-item-text\">Itin\u00e9raire<\/span>\n        <\/div>\n        <div class=\"menu-element-item item-edit\">\n          <span class=\"menu-icon icon-edit tooltipped\" \n          data-position=\"top\" data-delay=\"0\" data-tooltip=\"Proposer des modifications\"><\/span>\n          <span class=\"menu-element-item-text\">Proposer des modifications<\/span>\n        <\/div>\n        <div class=\"menu-element-item item-delete\"> \n          <span class=\"menu-icon btn-delete icon-exclamation-1 tooltipped\" \n          data-position=\"top\" data-delay=\"0\" data-tooltip=\"Signaler une erreur\"><\/span>\n          <span class=\"menu-element-item-text\">Signaler une erreur<\/span>\n        <\/div>  \n            \n      <\/div> \n    ");
    }
    // line 136
    sb.append("  \n    ");
    // line 138
    sb.append("    <div class=\"collapsible-body-main-content\"> \n\n      ");
    // line 141
    sb.append("      <h3>Infos<\/h3>   \n      <div class=\"section row sectionInfos\">\n\n        ");
    // line 145
    sb.append("        <span class=\"col s12 address\">");
    sb.append(twig.filter.escape(this.env_, twig.filter.capitalize(this.env_, twig.attr(("element" in context ? context["element"] : null), "address")), "html", null, true));
    sb.append("<\/span>\n        \n        ");
    // line 148
    sb.append("        ");
    if (twig.attr(("element" in context ? context["element"] : null), "tel")) {
        // line 149
        sb.append("          <span class=\"col s12 tel\">");
        sb.append(twig.filter.escape(this.env_, twig.attr(("element" in context ? context["element"] : null), "tel"), "html", null, true));
        sb.append("<\/span>\n        ");
    }
    // line 151
    sb.append("\n        ");
    // line 153
    sb.append("        ");
    if (twig.attr(("element" in context ? context["element"] : null), "mail")) {
        // line 154
        sb.append("          <span class=\"col s12 tel\"><a href=\"mailto:");
        sb.append(twig.filter.escape(this.env_, twig.attr(("element" in context ? context["element"] : null), "mail"), "html", null, true));
        sb.append("\">");
        sb.append(twig.filter.escape(this.env_, twig.attr(("element" in context ? context["element"] : null), "mail"), "html", null, true));
        sb.append("<\/a>\n          <\/span>\n        ");
    }
    // line 157
    sb.append("\n        ");
    // line 159
    sb.append("        ");
    if (twig.attr(("element" in context ? context["element"] : null), "webSite")) {
        // line 160
        sb.append("          <span class=\"col s12 tel\"><a href=\"");
        sb.append(twig.filter.escape(this.env_, twig.attr(("element" in context ? context["element"] : null), "webSite"), "html", null, true));
        sb.append("\" target=\"_blank\">");
        sb.append(twig.filter.escape(this.env_, twig.attr(("element" in context ? context["element"] : null), "webSite"), "html", null, true));
        sb.append("<\/a>\n          <\/span>\n        ");
    }
    // line 163
    sb.append("\n      <\/div>\n      <div class=\"divider\"><\/div>\n      \n      ");
    // line 168
    sb.append("      <h3>Les cat\u00e9gories<\/h3> \n      <div class=\"section row categories\">\n        \n        ");
    // line 171
    (new biopen_twigJs_category_value(this.env_)).render_(sb, twig.extend({}, context, {"categoryValue": ("mainCategoryValue" in context ? context["mainCategoryValue"] : null), "subcategoriesCount": 1}));
    sb.append("  \n\n      <\/div>\n      <div class=\"divider\"><\/div>\n\n      ");
    // line 177
    sb.append("      <h3>Horaires d'ouverture<\/h3>   \n      <div class=\"section row sectionOpenHourss\">  \n        ");
    // line 179
    context["count"] = 0;
    sb.append(" \n\n        ");
    // line 181
    context['_parent'] = context;
    var seq = twig.attr(("element" in context ? context["element"] : null), "getFormatedOpenHours", undefined, "method");
    twig.forEach(seq, function(v, k) {
        context["key"] = k;
        context["horaire"] = v;
        sb.append(" \n          ");
        // line 182
        if (((("horaire" in context ? context["horaire"] : null)) != (null))) {
            // line 183
            sb.append("\n            <div class='row'>\n              <span class=\"col s3 day\">");
            // line 185
            sb.append(twig.filter.escape(this.env_, twig.filter.capitalize(this.env_, ("key" in context ? context["key"] : null)), "html", null, true));
            sb.append("<\/span>\n              <span class=\"col s9 openHours\">");
            // line 186
            sb.append(twig.filter.escape(this.env_, ("horaire" in context ? context["horaire"] : null), "html", null, true));
            sb.append(" <\/span>\n            <\/div>\n            ");
            // line 188
            context["count"] = (Number(("count" in context ? context["count"] : null)) + Number(1));
            sb.append(" \n\n          ");
        }
        // line 191
        sb.append("        ");
    }, this);
    sb.append("          \n\n        ");
    // line 193
    if (twig.attr(("element" in context ? context["element"] : null), "openHoursMoreInfos")) {
        // line 194
        sb.append("          <div class='col' ");
        if (((("count" in context ? context["count"] : null)) != (0))) {
            sb.append("style=\"margin-top:1rem;\"");
        }
        sb.append(">");
        sb.append(twig.filter.escape(this.env_, twig.filter.capitalize(this.env_, twig.attr(("element" in context ? context["element"] : null), "openHoursMoreInfos")), "html", null, true));
        sb.append("<\/div> \n          ");
        // line 195
        context["count"] = (Number(("count" in context ? context["count"] : null)) + Number(1));
        sb.append(" \n        ");
    }
    // line 197
    sb.append("\n        ");
    // line 198
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
/*   <div class="collapsible-header bgdSoftColorAs {{pendingClass}}" option-id={{mainOptionValueToDisplay.colorOptionId}}>*/
/*     */
/*     {# Header Title #}*/
/*     <div class='collapsible-header-title row'> */
/* */
/*       <span class="col s12 name">*/
/* */
/*         {# Icons #}*/
/*         <span class="element-main-icon icon {{mainOptionValueToDisplay.option.icon}} colorAs {{pendingClass}} hideOnLargeScreen" option-id={{mainOptionValueToDisplay.colorOptionId}}></span>*/
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
/*         {% endif %}*/
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
/*       {# Categories litteral #}*/
/*       <span class="inline-option-values col s8 hideOnLargeScreen">*/
/*         {#} {% set isDisabled = mainOptionValueToDisplay.isFilledByFilters ? '' : 'disabled' %}*/
/*         <span class="option-value {{ isDisabled }}">{{ mainOptionValueToDisplay.option.name|capitalize }} */
/*         {% if otherOptionsValuesToDisplay.length != 0 %}, {% endif %}</span>#}*/
/* */
/*         {% for optionValue in allOptionsValues %} */
/*             {% set isDisabled = optionValue.isFilledByFilters ? '' : 'disabled' %}*/
/*             <span class="option-value {{ isDisabled }}">{{ optionValue.option.name|capitalize }} {% if not loop.last %}, {% endif %}</span>            */
/*         {% endfor %}*/
/* */
/*       </span>      */
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
/*     {% if element.isPending() and not listingMode %}*/
/*         <div class="vote-section">*/
/*           <span class="basic-message">*/
/*             <span class="icon-attention"></span>*/
/*             <span class="text">Acteur en cours de validation {#(<span class="validation-process-info">En savoir plus</span>)#}</span>*/
/*             <span class="btn-vote-more-info validation-process-info" onclick='$("#popup-vote").openModal()'>EN SAVOIR PLUS</span>*/
/*             <span class="vote-button btn btn-vote waves-effect waves-light">Voter</span>*/
/*           </span>*/
/*           <div class="result-message" style="display:none"></div>*/
/*         </div>*/
/*     {% endif %}*/
/* */
/*   </div>*/
/* */
/*   {# BODY #}*/
/*   <div class="collapsible-body moreDetails custom-scroll-bar"> */
/*   */
/*     {# Menu in constellation mode #}*/
/*     {% if listingMode %}*/
/*        {% if element.isPending() %}*/
/*       <div class="vote-section">*/
/*           <span class="basic-message">*/
/*             <span class="icon-attention"></span>*/
/*             <span class="text">Attention cet acteur est en cours de validation</span>*/
/*             <span class="vote-button btn btn-vote waves-effect waves-light">Voter</span>*/
/*           </span>*/
/*           <div class="result-message" style="display:none"></div>*/
/*       </div>*/
/*       {% endif %}*/
/*       <div class="menu-element bgdSoftColorAs {{pendingClass}}" option-id={{mainOptionValueToDisplay.colorOptionId}}>  */
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
/*         {% include '@directory/directory/twig-js-templates/element-info-category-value.html.twig' with { 'categoryValue' : mainCategoryValue, 'subcategoriesCount' : 1 } %}  */
/* */
/*       </div>*/
/*       <div class="divider"></div>*/
/* */
/*       {# Open Hours #}*/
/*       <h3>Horaires d'ouverture</h3>   */
/*       <div class="section row sectionOpenHourss">  */
/*         {% set count = 0 %} */
/* */
/*         {% for key, horaire in element.getFormatedOpenHours() %} */
/*           {% if horaire != null %}*/
/* */
/*             <div class='row'>*/
/*               <span class="col s3 day">{{ key|capitalize }}</span>*/
/*               <span class="col s9 openHours">{{ horaire }} </span>*/
/*             </div>*/
/*             {% set count = count + 1 %} */
/* */
/*           {% endif %}*/
/*         {% endfor %}          */
/* */
/*         {% if element.openHoursMoreInfos %}*/
/*           <div class='col' {% if count != 0 %}style="margin-top:1rem;"{% endif %}>{{  element.openHoursMoreInfos | capitalize }}</div> */
/*           {% set count = count + 1 %} */
/*         {% endif %}*/
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
    sb.append("\n<div class=\"marker-name bgdColorAs ");
    // line 3
    sb.append(twig.filter.escape(this.env_, ("pendingClass" in context ? context["pendingClass"] : null), "html", null, true));
    sb.append("\" option-id=");
    sb.append(twig.filter.escape(this.env_, twig.attr(("mainOptionValueToDisplay" in context ? context["mainOptionValueToDisplay"] : null), "colorOptionId"), "html", null, true));
    sb.append(" style=\"display:none\">");
    sb.append(twig.filter.escape(this.env_, twig.filter.capitalize(this.env_, twig.attr(("element" in context ? context["element"] : null), "name")), "html", null, true));
    sb.append("<\/div>\n\n<div class=\"marker-wrapper colorAs ");
    // line 5
    sb.append(twig.filter.escape(this.env_, ("pendingClass" in context ? context["pendingClass"] : null), "html", null, true));
    sb.append("\" option-id=\"");
    sb.append(twig.filter.escape(this.env_, twig.attr(("mainOptionValueToDisplay" in context ? context["mainOptionValueToDisplay"] : null), "colorOptionId"), "html", null, true));
    sb.append("\" id=\"marker-");
    sb.append(twig.filter.escape(this.env_, twig.attr(("element" in context ? context["element"] : null), "id"), "html", null, true));
    sb.append("\">\n\n\t<div class=\"rotate animate icon-marker\"><\/div>\n\t\n\t<div class=\"iconInsideMarker-wrapper rotate\">\n\t\t");
    // line 10
    context["mainIcon"] = ((twig.attr(("element" in context ? context["element"] : null), "isPending", undefined, "method")) ? ("icon-attention") : (twig.attr(twig.attr(("mainOptionValueToDisplay" in context ? context["mainOptionValueToDisplay"] : null), "option"), "icon")));
    // line 11
    sb.append("\t\t<div class=\"iconInsideMarker colorAs ");
    sb.append(twig.filter.escape(this.env_, ("pendingClass" in context ? context["pendingClass"] : null), "html", null, true));
    sb.append(" ");
    sb.append(((twig.attr(("mainOptionValueToDisplay" in context ? context["mainOptionValueToDisplay"] : null), "isFilledByFilters")) ? ("") : ("disabled")));
    sb.append(" ");
    sb.append(twig.filter.escape(this.env_, ("mainIcon" in context ? context["mainIcon"] : null), "html", null, true));
    sb.append("\" option-id=");
    sb.append(twig.filter.escape(this.env_, ((twig.attr(twig.attr(("mainOptionValueToDisplay" in context ? context["mainOptionValueToDisplay"] : null), "option"), "color")) ? (twig.attr(("mainOptionValueToDisplay" in context ? context["mainOptionValueToDisplay"] : null), "optionId")) : (twig.attr(("mainOptionValueToDisplay" in context ? context["mainOptionValueToDisplay"] : null), "colorOptionId"))), "html", null, true));
    sb.append(">\n\t<\/div>\n\n\t");
    // line 14
    context["nbreOthersOptions"] = twig.attr(("otherOptionsValuesToDisplay" in context ? context["otherOptionsValuesToDisplay"] : null), "length");
    sb.append("\t\n\n\t");
    // line 16
    if (((((((("nbreOthersOptions" in context ? context["nbreOthersOptions"] : null)) > (0))) && (("showMoreIcon" in context ? context["showMoreIcon"] : null)))) && ((!twig.attr(("element" in context ? context["element"] : null), "isPending", undefined, "method"))))) {
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
            // line 26
            sb.append("\n\t\t\t\t");
            // line 27
            context["disableOption"] = ((((twig.attr(("otherOptionValue" in context ? context["otherOptionValue"] : null), "isFilledByFilters")) == (false))) ? ("disabled") : (""));
            // line 28
            sb.append("\n\t\t\t\t<div class=\"moreIconWrapper ");
            // line 29
            sb.append(twig.filter.escape(this.env_, ("disableOption" in context ? context["disableOption"] : null), "html", null, true));
            sb.append(" ");
            sb.append(((twig.attr(("otherOptionValue" in context ? context["otherOptionValue"] : null), "colorOptionId")) ? ("colorAs") : ("")));
            sb.append(" ");
            sb.append(twig.filter.escape(this.env_, ("pendingClass" in context ? context["pendingClass"] : null), "html", null, true));
            sb.append("\" option-id=");
            sb.append(twig.filter.escape(this.env_, twig.attr(("otherOptionValue" in context ? context["otherOptionValue"] : null), "colorOptionId"), "html", null, true));
            sb.append("\n\t\t\t\t\t\tstyle=\"left:");
            // line 30
            sb.append(twig.filter.escape(this.env_, ((32) * (twig.attr(loop, "index0"))), "html", null, true));
            sb.append("px\">\n\t\t\t\t\t<span class=\"moreIcon iconInsideMarker ");
            // line 31
            sb.append(twig.filter.escape(this.env_, ("disableOption" in context ? context["disableOption"] : null), "html", null, true));
            sb.append(" ");
            sb.append(twig.filter.escape(this.env_, twig.attr(twig.attr(("otherOptionValue" in context ? context["otherOptionValue"] : null), "option"), "icon"), "html", null, true));
            sb.append(" colorAs ");
            sb.append(twig.filter.escape(this.env_, ("pendingClass" in context ? context["pendingClass"] : null), "html", null, true));
            sb.append("\" option-id=");
            sb.append(twig.filter.escape(this.env_, ((twig.attr(twig.attr(("otherOptionValue" in context ? context["otherOptionValue"] : null), "option"), "color")) ? (twig.attr(("otherOptionValue" in context ? context["otherOptionValue"] : null), "optionId")) : (twig.attr(("otherOptionValue" in context ? context["otherOptionValue"] : null), "colorOptionId"))), "html", null, true));
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
/* <div class="marker-name bgdColorAs {{pendingClass}}" option-id={{mainOptionValueToDisplay.colorOptionId}} style="display:none">{{ element.name | capitalize }}</div>*/
/* */
/* <div class="marker-wrapper colorAs {{pendingClass}}" option-id="{{mainOptionValueToDisplay.colorOptionId}}" id="marker-{{ element.id }}">*/
/* */
/* 	<div class="rotate animate icon-marker"></div>*/
/* 	*/
/* 	<div class="iconInsideMarker-wrapper rotate">*/
/* 		{% set mainIcon = element.isPending() ? 'icon-attention' :  mainOptionValueToDisplay.option.icon %}*/
/* 		<div class="iconInsideMarker colorAs {{pendingClass}} {{ mainOptionValueToDisplay.isFilledByFilters ? '' : 'disabled' }} {{mainIcon}}" option-id={{ mainOptionValueToDisplay.option.color ? mainOptionValueToDisplay.optionId : mainOptionValueToDisplay.colorOptionId }}>*/
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
/* 				{% set disableOption = otherOptionValue.isFilledByFilters == false ? 'disabled' : '' %}*/
/* */
/* 				<div class="moreIconWrapper {{ disableOption }} {{ otherOptionValue.colorOptionId ? 'colorAs' : '' }} {{pendingClass}}" option-id={{ otherOptionValue.colorOptionId }}*/
/* 						style="left:{{ 32 * loop.index0 }}px">*/
/* 					<span class="moreIcon iconInsideMarker {{ disableOption }} {{ otherOptionValue.option.icon }} colorAs {{pendingClass}}" option-id={{ otherOptionValue.option.color ? otherOptionValue.optionId : otherOptionValue.colorOptionId }}>*/
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
        context["colWidth"] = ((twig.attr(twig.attr(("categoryValue" in context ? context["categoryValue"] : null), "category"), "enableDescription")) ? ("s6 m5") : ("s12"));
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
        sb.append("\t\n\t    \t");
        // line 25
        context["iconColorId"] = ((twig.attr(twig.attr(("optionValue" in context ? context["optionValue"] : null), "option"), "icon")) ? (twig.attr(twig.attr(("optionValue" in context ? context["optionValue"] : null), "option"), "id")) : (""));
        sb.append("\t\n\t\t\t\t");
        // line 26
        if (("iconClass" in context ? context["iconClass"] : null)) {
            sb.append("    \n\t\t\t\t\t<span class=\"icon ");
            // line 27
            sb.append(twig.filter.escape(this.env_, ("iconClass" in context ? context["iconClass"] : null), "html", null, true));
            sb.append(" colorAs\" option-id=");
            sb.append(twig.filter.escape(this.env_, ("iconColorId" in context ? context["iconColorId"] : null), "html", null, true));
            sb.append(" ><\/span>\n\t\t\t\t");
        }
        // line 29
        sb.append("\t\t\t\t\n\t      <span class=\"option-name\" option-id=");
        // line 30
        sb.append(twig.filter.escape(this.env_, twig.attr(twig.attr(("optionValue" in context ? context["optionValue"] : null), "option"), "id"), "html", null, true));
        sb.append(" >");
        sb.append(twig.filter.escape(this.env_, twig.filter.capitalize(this.env_, twig.attr(twig.attr(("optionValue" in context ? context["optionValue"] : null), "option"), "nameShort")), "html", null, true));
        sb.append("<\/span> \n\n\t      ");
        // line 32
        if (("displayFirstCategoryInline" in context ? context["displayFirstCategoryInline"] : null)) {
            // line 33
            sb.append("\t      \t<span class=\"inline-option\">(\n\t      \t\t");
            // line 34
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
                // line 35
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
            // line 37
            sb.append(")\n\t      <\/span>\n\t      ");
        }
        // line 40
        sb.append("\n\t    <\/span>\n\t    ");
        // line 42
        if (twig.attr(twig.attr(("categoryValue" in context ? context["categoryValue"] : null), "category"), "enableDescription")) {
            // line 43
            sb.append("\t    \t<span class=\"col s6 m7 option-description\">");
            sb.append(twig.filter.escape(this.env_, twig.filter.capitalize(this.env_, twig.attr(("optionValue" in context ? context["optionValue"] : null), "description")), "html", null, true));
            sb.append("<\/span>\n\t    ");
        }
        // line 45
        sb.append("\t  <\/div>\n\n\t");
        // line 47
        context["subcategoriesCount"] = twig.attr(twig.attr(("optionValue" in context ? context["optionValue"] : null), "children"), "length");
        // line 48
        sb.append("\t");
        if (("displayFirstCategoryInline" in context ? context["displayFirstCategoryInline"] : null)) {
            context["subcategoriesCount"] = ((("subcategoriesCount" in context ? context["subcategoriesCount"] : null)) - (1));
        }
        // line 49
        sb.append("\n\t");
        // line 50
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
            // line 51
            sb.append("\n\t\t");
            // line 52
            if ((!((twig.attr(loop1, "first")) && (("displayFirstCategoryInline" in context ? context["displayFirstCategoryInline"] : null))))) {
                // line 53
                sb.append("\t\t\t");
                (new biopen_twigJs_category_value(this.env_)).render_(sb, twig.extend({}, context, {"categoryValue": ("subcategory" in context ? context["subcategory"] : null), "subcategoriesCount": ("subcategoriesCount" in context ? context["subcategoriesCount"] : null)}));
                sb.append(" \n\t\t");
            }
            // line 55
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
        // line 56
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
    // line 58
    sb.append(" \n\n");
    // line 60
    if (("displayThisCategoryValue" in context ? context["displayThisCategoryValue"] : null)) {
        // line 61
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
/* 		{% set colWidth = categoryValue.category.enableDescription ? 's6 m5' : 's12' %}*/
/* 	  <div class='row {% if loop.first %}strong{% endif %}'>*/
/* 	    <span class="option-value col {{ colWidth }}">*/
/* */
/* 	    	{% set iconClass = optionValue.option.icon ? optionValue.option.icon : 'icon-angle-right' %}	*/
/* 	    	{% set iconColorId = optionValue.option.icon ? optionValue.option.id : '' %}	*/
/* 				{% if iconClass %}    */
/* 					<span class="icon {{ iconClass }} colorAs" option-id={{ iconColorId }} ></span>*/
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
/* 	    	<span class="col s6 m7 option-description">{{ optionValue.description|capitalize }}</span>*/
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
