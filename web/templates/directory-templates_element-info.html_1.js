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
    sb.append("  <div class=\"collapsible-header ");
    sb.append(twig.filter.escape(this.env_, twig.attr(("element" in context ? context["element"] : null), "type"), "html", null, true));
    sb.append("\">\n    \n    ");
    // line 14
    sb.append("    <div class='collapsible-header-title row ");
    sb.append(twig.filter.escape(this.env_, twig.filter.lower(this.env_, twig.attr(("element" in context ? context["element"] : null), "mainProduct")), "html", null, true));
    sb.append(" ");
    sb.append(twig.filter.escape(this.env_, twig.attr(("element" in context ? context["element"] : null), "type"), "html", null, true));
    sb.append("'> \n\n      <span class=\"col s12 name\">\n\n        ");
    // line 19
    sb.append("        <span class=\"element-main-icon icon icon-");
    sb.append(twig.filter.escape(this.env_, twig.filter.lower(this.env_, twig.attr(("element" in context ? context["element"] : null), "mainProduct")), "html", null, true));
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
    sb.append("      <span class=\"products col s8 hideOnLargeScreen\">\n\n         ");
    // line 48
    if (((twig.attr(("element" in context ? context["element"] : null), "isProducteurOrAmap", undefined, "method")) || (((twig.attr(twig.attr(("productsToDisplay" in context ? context["productsToDisplay"] : null), "others"), "length")) == (0))))) {
        // line 49
        sb.append("            ");
        sb.append(twig.filter.escape(this.env_, twig.filter.capitalize(this.env_, twig.attr(twig.attr(("productsToDisplay" in context ? context["productsToDisplay"] : null), "main"), "value")), "html", null, true));
        sb.append(" \n            ");
        // line 50
        if (((twig.attr(twig.attr(("productsToDisplay" in context ? context["productsToDisplay"] : null), "others"), "length")) != (0))) {
            sb.append(", ");
        }
        // line 51
        sb.append("         ");
    }
    // line 52
    sb.append("\n         ");
    // line 53
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
        context["product"] = v;
        sb.append(" \n            ");
        // line 54
        context["isDisabled"] = ((twig.attr(("product" in context ? context["product"] : null), "disabled")) ? ("disabled") : (""));
        // line 55
        sb.append("            <span class=\"product ");
        sb.append(twig.filter.escape(this.env_, ("isDisabled" in context ? context["isDisabled"] : null), "html", null, true));
        sb.append("\">");
        sb.append(twig.filter.escape(this.env_, twig.filter.capitalize(this.env_, twig.attr(("product" in context ? context["product"] : null), "value")), "html", null, true));
        sb.append(" <\/span>\n            ");
        // line 56
        if ((!twig.attr(loop, "last"))) {
            sb.append(", ");
        }
        // line 57
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
    // line 58
    sb.append("\n      <\/span>\n\n      ");
    // line 62
    sb.append("      <span class=\"col s4 right-align btn-select-as-representant-container\" style=\"display:none\">\n        <button class=\"btn btn-select-as-representant waves-effect waves-light\" >S\u00e9lectionner<\/button> \n      <\/span>\n\n      ");
    // line 67
    sb.append("      <span class=\"col s4 right-align starRespresentantLabel\" style=\"display:none\">Element principal<\/span>\n\n      ");
    // line 70
    sb.append("      <a><span class=\"col s4 right-align moreInfos hideOnLargeScreen\">Plus d'infos<\/span><\/a>\n      <a><span class=\"col s4 right-align lessInfos hideOnLargeScreen\" style=\"display:none\">Moins d'infos<\/span><\/a>\n\n    <\/div>\n\n  <\/div>\n\n  ");
    // line 78
    sb.append("  <div class=\"collapsible-body moreDetails custom-scroll-bar\" > \n  \n    ");
    // line 81
    sb.append("    ");
    if (("listingMode" in context ? context["listingMode"] : null)) {
        // line 82
        sb.append("      <div class=\"menu-element ");
        sb.append(twig.filter.escape(this.env_, twig.attr(("element" in context ? context["element"] : null), "type"), "html", null, true));
        sb.append("\">  \n\n        <div class=\"menu-element-item item-add-favorite\" style=\"display:none\">\n          <span class=\"menu-icon icon-star-empty icon-favorite tooltipped\" \n          data-position=\"top\" data-delay=\"0\" data-tooltip=\"Enregistrer comme favoris\"><\/span>\n          <span class=\"menu-element-item-text\">Enregistrer<\/span>\n        <\/div>\n        <div class=\"menu-element-item item-remove-favorite\" style=\"display:none\">\n          <span class=\"menu-icon icon-star-full icon-favorite tooltipped\"\n          data-position=\"top\" data-delay=\"0\" data-tooltip=\"Retirer des favoris\"><\/span>\n          <span class=\"menu-element-item-text favorite\">Enregistr\u00e9<\/span>\n        <\/div>\n        <div class=\"menu-element-item item-share\">\n          <span class=\"menu-icon icon-share-alt tooltipped\"\n          data-position=\"top\" data-delay=\"0\" data-tooltip=\"Partager l'URL\"><\/span>\n          <span class=\"menu-element-item-text\">Partager l'URL<\/span>\n        <\/div>\n        <div class=\"menu-element-item item-directions\">\n          <span class=\"menu-icon icon-directions tooltipped\" \n          data-position=\"top\" data-delay=\"0\" data-tooltip=\"Itin\u00e9raire vers cet \u00e9l\u00e9ment\"><\/span>\n          <span class=\"menu-element-item-text\">Itin\u00e9raire<\/span>\n        <\/div>\n        <div class=\"menu-element-item item-edit\">\n          <span class=\"menu-icon icon-edit tooltipped\" \n          data-position=\"top\" data-delay=\"0\" data-tooltip=\"Proposer des modifications\"><\/span>\n          <span class=\"menu-element-item-text\">Proposer des modifications<\/span>\n        <\/div>\n        <div class=\"menu-element-item item-delete\"> \n          <span class=\"menu-icon btn-delete icon-exclamation-1 tooltipped\" \n          data-position=\"top\" data-delay=\"0\" data-tooltip=\"Signaler une erreur\"><\/span>\n          <span class=\"menu-element-item-text\">Signaler une erreur<\/span>\n        <\/div>  \n            \n      <\/div> \n    ");
    }
    // line 117
    sb.append("  \n    ");
    // line 119
    sb.append("    <div class=\"collapsible-body-main-content\"> \n\n      ");
    // line 122
    sb.append("      <h3>Infos<\/h3>   \n      <div class=\"section row sectionInfos\">\n\n        ");
    // line 126
    sb.append("        <span class=\"col s12 address\">");
    sb.append(twig.filter.escape(this.env_, twig.filter.capitalize(this.env_, twig.attr(("element" in context ? context["element"] : null), "address")), "html", null, true));
    sb.append("<\/span>\n        \n        ");
    // line 129
    sb.append("        ");
    if (twig.attr(("element" in context ? context["element"] : null), "tel")) {
        // line 130
        sb.append("          <span class=\"col s12 tel\">");
        sb.append(twig.filter.escape(this.env_, twig.attr(("element" in context ? context["element"] : null), "tel"), "html", null, true));
        sb.append("<\/span>\n        ");
    }
    // line 132
    sb.append("\n        ");
    // line 134
    sb.append("        ");
    if (twig.attr(("element" in context ? context["element"] : null), "mail")) {
        // line 135
        sb.append("          <span class=\"col s12 tel\"><a href=\"mailto:");
        sb.append(twig.filter.escape(this.env_, twig.attr(("element" in context ? context["element"] : null), "mail"), "html", null, true));
        sb.append("\">");
        sb.append(twig.filter.escape(this.env_, twig.attr(("element" in context ? context["element"] : null), "mail"), "html", null, true));
        sb.append("<\/a>\n          <\/span>\n        ");
    }
    // line 138
    sb.append("\n        ");
    // line 140
    sb.append("        ");
    if (twig.attr(("element" in context ? context["element"] : null), "webSite")) {
        // line 141
        sb.append("          <span class=\"col s12 tel\"><a href=\"");
        sb.append(twig.filter.escape(this.env_, twig.attr(("element" in context ? context["element"] : null), "webSite"), "html", null, true));
        sb.append("\" target=\"_blank\">");
        sb.append(twig.filter.escape(this.env_, twig.attr(("element" in context ? context["element"] : null), "webSite"), "html", null, true));
        sb.append("<\/a>\n          <\/span>\n        ");
    }
    // line 144
    sb.append("\n      <\/div>\n      <div class=\"divider\"><\/div>\n\n      ");
    // line 149
    sb.append("      ");
    if (((twig.attr(("element" in context ? context["element"] : null), "type")) != ("epicerie"))) {
        // line 150
        sb.append("        <h3>Les produits<\/h3>   \n        <div class=\"section sectionDetailProducts\"> \n          ");
        // line 152
        context['_parent'] = context;
        var seq = twig.attr(("element" in context ? context["element"] : null), "products");
        twig.forEach(seq, function(v, k) {
            context["_key"] = k;
            context["product"] = v;
            sb.append(" \n            ");
            // line 153
            context["isDisabled"] = ((twig.attr(("product" in context ? context["product"] : null), "disabled")) ? ("disabled") : (""));
            // line 154
            sb.append("            <div class='row ");
            sb.append(twig.filter.escape(this.env_, twig.attr(("product" in context ? context["product"] : null), "nameFormate"), "html", null, true));
            sb.append(" ");
            if (((twig.attr(("product" in context ? context["product"] : null), "nameFormate")) == (twig.attr(("element" in context ? context["element"] : null), "mainProduct")))) {
                sb.append("strong");
            }
            sb.append("'>\n              <span class=\"col s6 m4 product ");
            // line 155
            sb.append(twig.filter.escape(this.env_, ("isDisabled" in context ? context["isDisabled"] : null), "html", null, true));
            sb.append("\">\n                <span class=\"icon icon-");
            // line 156
            sb.append(twig.filter.escape(this.env_, twig.attr(("product" in context ? context["product"] : null), "nameFormate"), "html", null, true));
            sb.append(" ");
            sb.append(twig.filter.escape(this.env_, ("isDisabled" in context ? context["isDisabled"] : null), "html", null, true));
            sb.append("\"><\/span>            \n                <span class=\"option-name\">");
            // line 157
            sb.append(twig.filter.escape(this.env_, twig.filter.capitalize(this.env_, twig.attr(("product" in context ? context["product"] : null), "nameShort")), "html", null, true));
            sb.append("<\/span> \n              <\/span>\n              <span class=\"col s6 m8 detail ");
            // line 159
            sb.append(twig.filter.escape(this.env_, ("isDisabled" in context ? context["isDisabled"] : null), "html", null, true));
            sb.append("\">");
            sb.append(twig.filter.escape(this.env_, twig.filter.capitalize(this.env_, twig.attr(("product" in context ? context["product"] : null), "descriptif")), "html", null, true));
            sb.append("<\/span>\n            <\/div>\n          ");
        }, this);
        // line 161
        sb.append("          \n\n        <\/div>       \n        <div class=\"divider\"><\/div>\n      ");
    }
    // line 166
    sb.append("\n      ");
    // line 168
    sb.append("      <h3>Horaires d'ouverture<\/h3>   \n      <div class=\"section row sectionOpenHourss\">  \n        ");
    // line 170
    context["count"] = 0;
    sb.append(" \n\n        ");
    // line 172
    context['_parent'] = context;
    var seq = twig.attr(("element" in context ? context["element"] : null), "getFormatedOpenHourss", undefined, "method");
    twig.forEach(seq, function(v, k) {
        context["key"] = k;
        context["horaire"] = v;
        sb.append(" \n          ");
        // line 173
        if (((("horaire" in context ? context["horaire"] : null)) != (null))) {
            // line 174
            sb.append("\n            <div class='row'>\n              <span class=\"col s3 day\">");
            // line 176
            sb.append(twig.filter.escape(this.env_, twig.filter.capitalize(this.env_, ("key" in context ? context["key"] : null)), "html", null, true));
            sb.append("<\/span>\n              <span class=\"col s9 openHours\">");
            // line 177
            sb.append(twig.filter.escape(this.env_, ("horaire" in context ? context["horaire"] : null), "html", null, true));
            sb.append(" <\/span>\n            <\/div>\n            ");
            // line 179
            context["count"] = (Number(("count" in context ? context["count"] : null)) + Number(1));
            sb.append(" \n\n          ");
        }
        // line 182
        sb.append("        ");
    }, this);
    sb.append("  \n\n        ");
    // line 184
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
/*   <div class="collapsible-header {{ element.type }}">*/
/*     */
/*     {# Header Title #}*/
/*     <div class='collapsible-header-title row {{element.mainProduct|lower}} {{element.type}}'> */
/* */
/*       <span class="col s12 name">*/
/* */
/*         {# Icons #}*/
/*         <span class="element-main-icon icon icon-{{element.mainProduct|lower}} hideOnLargeScreen"></span>*/
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
/* */
/*          {% if element.isProducteurOrAmap() or productsToDisplay.others.length == 0 %}*/
/*             {{ productsToDisplay.main.value|capitalize }} */
/*             {% if productsToDisplay.others.length != 0 %}, {% endif %}*/
/*          {% endif %}*/
/* */
/*          {% for product in productsToDisplay.others %} */
/*             {% set isDisabled = product.disabled ? 'disabled' : '' %}*/
/*             <span class="product {{isDisabled}}">{{ product.value|capitalize }} </span>*/
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
/*       <div class="menu-element {{ element.type }}">  */
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
/* */
/*       {# Products #}*/
/*       {% if element.type != 'epicerie' %}*/
/*         <h3>Les produits</h3>   */
/*         <div class="section sectionDetailProducts"> */
/*           {% for product in element.products %} */
/*             {% set isDisabled = product.disabled ? 'disabled' : '' %}*/
/*             <div class='row {{ product.nameFormate }} {% if product.nameFormate == element.mainProduct %}strong{% endif %}'>*/
/*               <span class="col s6 m4 product {{ isDisabled }}">*/
/*                 <span class="icon icon-{{ product.nameFormate }} {{ isDisabled }}"></span>            */
/*                 <span class="option-name">{{ product.nameShort|capitalize }}</span> */
/*               </span>*/
/*               <span class="col s6 m8 detail {{ isDisabled }}">{{ product.descriptif|capitalize }}</span>*/
/*             </div>*/
/*           {% endfor %}          */
/* */
/*         </div>       */
/*         <div class="divider"></div>*/
/*       {% endif %}*/
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
