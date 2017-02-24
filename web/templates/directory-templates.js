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
        sb.append("\">  \n        ");
        // line 83
        (new element-menu.html(this.env_)).render_(sb, context);
        sb.append("            \n        <center>\n\n          <!-- <span class=\"menu-icon icon-directions tooltipped\" \n          data-position=\"top\" data-delay=\"0\" data-tooltip=\"Itin\u00e9raire vers ce element\"><\/span>\n          <span class=\"menu-icon icon-edit tooltipped\" \n          data-position=\"top\" data-delay=\"0\" data-tooltip=\"Modifier ces informations\"><\/span>\n          <span class=\"menu-icon icon-delete tooltipped\" \n          data-position=\"top\" data-delay=\"0\" data-tooltip=\"Supprimer ce element\"><\/span> -->\n          ");
        // line 94
        sb.append("        <\/center>       \n      <\/div> \n    ");
    }
    // line 97
    sb.append("  \n    ");
    // line 99
    sb.append("    <div class=\"collapsible-body-main-content\"> \n\n      ");
    // line 102
    sb.append("      <h3>Infos<\/h3>   \n      <div class=\"section row sectionInfos\">\n\n        ");
    // line 106
    sb.append("        <span class=\"col s12 address\">");
    sb.append(twig.filter.escape(this.env_, twig.filter.capitalize(this.env_, twig.attr(("element" in context ? context["element"] : null), "address")), "html", null, true));
    sb.append("<\/span>\n        \n        ");
    // line 109
    sb.append("        ");
    if (twig.attr(("element" in context ? context["element"] : null), "tel")) {
        // line 110
        sb.append("          <span class=\"col s12 tel\">");
        sb.append(twig.filter.escape(this.env_, twig.attr(("element" in context ? context["element"] : null), "tel"), "html", null, true));
        sb.append("<\/span>\n        ");
    }
    // line 112
    sb.append("\n        ");
    // line 114
    sb.append("        ");
    if (twig.attr(("element" in context ? context["element"] : null), "mail")) {
        // line 115
        sb.append("          <span class=\"col s12 tel\"><a href=\"mailto:");
        sb.append(twig.filter.escape(this.env_, twig.attr(("element" in context ? context["element"] : null), "mail"), "html", null, true));
        sb.append("\">");
        sb.append(twig.filter.escape(this.env_, twig.attr(("element" in context ? context["element"] : null), "mail"), "html", null, true));
        sb.append("<\/a>\n          <\/span>\n        ");
    }
    // line 118
    sb.append("\n        ");
    // line 120
    sb.append("        ");
    if (twig.attr(("element" in context ? context["element"] : null), "webSite")) {
        // line 121
        sb.append("          <span class=\"col s12 tel\"><a href=\"");
        sb.append(twig.filter.escape(this.env_, twig.attr(("element" in context ? context["element"] : null), "webSite"), "html", null, true));
        sb.append("\" target=\"_blank\">");
        sb.append(twig.filter.escape(this.env_, twig.attr(("element" in context ? context["element"] : null), "webSite"), "html", null, true));
        sb.append("<\/a>\n          <\/span>\n        ");
    }
    // line 124
    sb.append("\n      <\/div>\n      <div class=\"divider\"><\/div>\n\n      ");
    // line 129
    sb.append("      ");
    if (((twig.attr(("element" in context ? context["element"] : null), "type")) != ("epicerie"))) {
        // line 130
        sb.append("        <h3>Les produits<\/h3>   \n        <div class=\"section sectionDetailProducts\"> \n          ");
        // line 132
        context['_parent'] = context;
        var seq = twig.attr(("element" in context ? context["element"] : null), "products");
        twig.forEach(seq, function(v, k) {
            context["_key"] = k;
            context["product"] = v;
            sb.append(" \n            ");
            // line 133
            context["isDisabled"] = ((twig.attr(("product" in context ? context["product"] : null), "disabled")) ? ("disabled") : (""));
            // line 134
            sb.append("            <div class='row ");
            sb.append(twig.filter.escape(this.env_, twig.attr(("product" in context ? context["product"] : null), "nameFormate"), "html", null, true));
            sb.append(" ");
            if (((twig.attr(("product" in context ? context["product"] : null), "nameFormate")) == (twig.attr(("element" in context ? context["element"] : null), "mainProduct")))) {
                sb.append("strong");
            }
            sb.append("'>\n              <span class=\"col s6 m4 product ");
            // line 135
            sb.append(twig.filter.escape(this.env_, ("isDisabled" in context ? context["isDisabled"] : null), "html", null, true));
            sb.append("\">\n                <span class=\"icon icon-");
            // line 136
            sb.append(twig.filter.escape(this.env_, twig.attr(("product" in context ? context["product"] : null), "nameFormate"), "html", null, true));
            sb.append(" ");
            sb.append(twig.filter.escape(this.env_, ("isDisabled" in context ? context["isDisabled"] : null), "html", null, true));
            sb.append("\"><\/span>            \n                <span class=\"productName\">");
            // line 137
            sb.append(twig.filter.escape(this.env_, twig.filter.capitalize(this.env_, twig.attr(("product" in context ? context["product"] : null), "nameShort")), "html", null, true));
            sb.append("<\/span> \n              <\/span>\n              <span class=\"col s6 m8 detail ");
            // line 139
            sb.append(twig.filter.escape(this.env_, ("isDisabled" in context ? context["isDisabled"] : null), "html", null, true));
            sb.append("\">");
            sb.append(twig.filter.escape(this.env_, twig.filter.capitalize(this.env_, twig.attr(("product" in context ? context["product"] : null), "descriptif")), "html", null, true));
            sb.append("<\/span>\n            <\/div>\n          ");
        }, this);
        // line 141
        sb.append("          \n\n        <\/div>       \n        <div class=\"divider\"><\/div>\n      ");
    }
    // line 146
    sb.append("\n      ");
    // line 148
    sb.append("      <h3>Horaires d'ouverture<\/h3>   \n      <div class=\"section row sectionOpenHourss\">  \n        ");
    // line 150
    context["count"] = 0;
    sb.append(" \n\n        ");
    // line 152
    context['_parent'] = context;
    var seq = twig.attr(("element" in context ? context["element"] : null), "getFormatedOpenHourss", undefined, "method");
    twig.forEach(seq, function(v, k) {
        context["key"] = k;
        context["horaire"] = v;
        sb.append(" \n          ");
        // line 153
        if (((("horaire" in context ? context["horaire"] : null)) != (null))) {
            // line 154
            sb.append("\n            <div class='row'>\n              <span class=\"col s3 day\">");
            // line 156
            sb.append(twig.filter.escape(this.env_, twig.filter.capitalize(this.env_, ("key" in context ? context["key"] : null)), "html", null, true));
            sb.append("<\/span>\n              <span class=\"col s9 openHours\">");
            // line 157
            sb.append(twig.filter.escape(this.env_, ("horaire" in context ? context["horaire"] : null), "html", null, true));
            sb.append(" <\/span>\n            <\/div>\n            ");
            // line 159
            context["count"] = (Number(("count" in context ? context["count"] : null)) + Number(1));
            sb.append(" \n\n          ");
        }
        // line 162
        sb.append("        ");
    }, this);
    sb.append("  \n\n        ");
    // line 164
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
/*         {% include '@directory/directory/components/element-menu.html.twig' %}            */
/*         <center>*/
/* */
/*           <!-- <span class="menu-icon icon-directions tooltipped" */
/*           data-position="top" data-delay="0" data-tooltip="Itinéraire vers ce element"></span>*/
/*           <span class="menu-icon icon-edit tooltipped" */
/*           data-position="top" data-delay="0" data-tooltip="Modifier ces informations"></span>*/
/*           <span class="menu-icon icon-delete tooltipped" */
/*           data-position="top" data-delay="0" data-tooltip="Supprimer ce element"></span> -->*/
/*           {# <button id="" class="btn waves-effect waves-light">Modifier</button>*/
/*           <button id="" class="btn waves-effect waves-light">Supprimer</button> #}*/
/*         </center>       */
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
/*                 <span class="productName">{{ product.nameShort|capitalize }}</span> */
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
