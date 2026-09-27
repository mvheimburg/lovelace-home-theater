/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$3=globalThis,e$3=t$3.ShadowRoot&&(void 0===t$3.ShadyCSS||t$3.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$2=Symbol(),o$3=new WeakMap;let n$2 = class n{constructor(t,e,o){if(this._$cssResult$=true,o!==s$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$3&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$3.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$3.set(s,t));}return t}toString(){return this.cssText}};const r$3=t=>new n$2("string"==typeof t?t:t+"",void 0,s$2),i$4=(t,...e)=>{const o=1===t.length?t[0]:e.reduce((e,s,o)=>e+(t=>{if(true===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1],t[0]);return new n$2(o,t,s$2)},S$1=(s,o)=>{if(e$3)s.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of o){const o=document.createElement("style"),n=t$3.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$2=e$3?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$3(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:i$3,defineProperty:e$2,getOwnPropertyDescriptor:h$1,getOwnPropertyNames:r$2,getOwnPropertySymbols:o$2,getPrototypeOf:n$1}=Object,a$1=globalThis,c$1=a$1.trustedTypes,l$2=c$1?c$1.emptyScript:"",p$2=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$1={toAttribute(t,s){switch(s){case Boolean:t=t?l$2:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$1=(t,s)=>!i$3(t,s),b$1={attribute:true,type:String,converter:u$1,reflect:false,useDefault:false,hasChanged:f$1};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;let y$1 = class y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b$1){if(s.state&&(s.attribute=false),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=true),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e$2(this.prototype,t,h);}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h$1(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i);},configurable:true,enumerable:true}}static getPropertyOptions(t){return this.elementProperties.get(t)??b$1}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$1(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=true,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...r$2(t),...o$2(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$2(s));}else void 0!==s&&i.push(c$2(s));return i}static _$Eu(t,s){const i=s.attribute;return  false===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=false,this.hasUpdated=false,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(true),this._$EO?.forEach(t=>t.hostConnected?.());}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.());}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&true===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u$1).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$1;this._$Em=e;const r=h.fromAttribute(s,t.type);this[e]=r??this._$Ej?.get(e)??r,this._$Em=null;}}requestUpdate(t,s,i,e=false,h){if(void 0!==t){const r=this.constructor;if(false===e&&(h=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??f$1)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,s,i);} false===this.isUpdatePending&&(this._$ES=this._$EP());}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),true!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),true===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t));}async _$EP(){this.isUpdatePending=true;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];true!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e);}}let t=false;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(s)):this._$EM();}catch(s){throw t=false,this._$EM(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=true,this.firstUpdated(t)),this.updated(t);}_$EM(){this._$AL=new Map,this.isUpdatePending=false;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return  true}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM();}updated(t){}firstUpdated(t){}};y$1.elementStyles=[],y$1.shadowRootOptions={mode:"open"},y$1[d$1("elementProperties")]=new Map,y$1[d$1("finalized")]=new Map,p$2?.({ReactiveElement:y$1}),(a$1.reactiveElementVersions??=[]).push("2.1.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2=globalThis,i$2=t=>t,s$1=t$2.trustedTypes,e$1=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,h="$lit$",o$1=`lit$${Math.random().toFixed(9).slice(2)}$`,n="?"+o$1,r$1=`<${n}>`,l$1=document,c=()=>l$1.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,d=t=>u(t)||"function"==typeof t?.[Symbol.iterator],f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m$1=/>/g,p$1=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,x=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),b=x(1),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l$1.createTreeWalker(l$1,129);function V(t,i){if(!u(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e$1?e$1.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v?"!--"===u[1]?c=_:void 0!==u[1]?c=m$1:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p$1):void 0!==u[3]&&(c=p$1):c===p$1?">"===u[0]?(c=n??v,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p$1:'"'===u[3]?$:g):c===$||c===g?c=p$1:c===_||c===m$1?c=v:(c=p$1,n=void 0);const x=c===p$1&&t[i+1].startsWith("/>")?" ":"";l+=c===v?s+r$1:d>=0?(e.push(a),s.slice(0,d)+h+s.slice(d)+o$1+x):s+o$1+(-2===d?i:x);}return [V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h)){const i=v[a++],s=r.getAttribute(t).split(o$1),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H}),r.removeAttribute(t);}else t.startsWith(o$1)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o$1),i=t.length-1;if(i>0){r.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c());}}}else if(8===r.nodeType)if(r.data===n)d.push({type:2,index:l});else {let t=-1;for(;-1!==(t=r.data.indexOf(o$1,t+1));)d.push({type:7,index:l}),t+=o$1.length-1;}l++;}}static createElement(t,i){const s=l$1.createElement("template");return s.innerHTML=t,s}}function M(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M(t,h._$AS(t,i.values),h,e)),i}class R{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l$1).importNode(i,true);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new k(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new Z(h,this,t)),this._$AV.push(i),r=s[++n];}o!==r?.index&&(h=P.nextNode(),o++);}return P.currentNode=l$1,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):d(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l$1.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new R(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new k(this.O(c()),this.O(c()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(false,true,s);t!==this._$AB;){const s=i$2(t).nextSibling;i$2(t).remove(),t=s;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=M(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class I extends H{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}class L extends H{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A);}}class z extends H{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=M(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t);}}const B=t$2.litHtmlPolyfillSupport;B?.(S,k),(t$2.litHtmlVersions??=[]).push("3.3.3");const D=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new k(i.insertBefore(c(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=globalThis;let i$1 = class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=D(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(true);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(false);}render(){return E}};i$1._$litElement$=true,i$1["finalized"]=true,s.litElementHydrateSupport?.({LitElement:i$1});const o=s.litElementPolyfillSupport;o?.({LitElement:i$1});(s.litElementVersions??=[]).push("4.2.2");

const colorSchemes = [
    "home-assistant",
    "bright",
    "warm",
    "mint",
    "sky",
    "lavender",
];

class ConfigValidationError extends Error {
    constructor(code) {
        super(code);
        this.code = code;
    }
}
const TYPE = "custom:home-theater-card";
const PLAYER = /^media_player\.[a-z0-9_]+$/;
function object(input) {
    if (!input || typeof input !== "object" || Array.isArray(input))
        throw new ConfigValidationError("invalidConfig");
    return input;
}
function optional(input, key) {
    if (input[key] !== undefined && typeof input[key] !== "string")
        throw new ConfigValidationError("invalidText");
}
function normalizeConfig(input) {
    const c = object(input);
    if (c.type !== TYPE)
        throw new ConfigValidationError("invalidType");
    for (const key of ["title", "icon", "tv_input", "tv_audio"])
        optional(c, key);
    for (const key of ["theater", "tv", "receiver"])
        if (c[key] !== undefined && (typeof c[key] !== "string" || !PLAYER.test(c[key])))
            throw new ConfigValidationError("invalidPlayer");
    if (c.appearance !== undefined &&
        !["default", "bubble"].includes(String(c.appearance)))
        throw new ConfigValidationError("invalidAppearance");
    if (c.color_scheme !== undefined &&
        !colorSchemes.includes(c.color_scheme))
        throw new ConfigValidationError("invalidScheme");
    if (c.sources !== undefined && !Array.isArray(c.sources))
        throw new ConfigValidationError("invalidSources");
    const sources = c.sources?.map((value) => {
        const s = object(value);
        if (!["receiver", "tv"].includes(String(s.device)) || typeof s.source !== "string" || !s.source)
            throw new ConfigValidationError("invalidSource");
        optional(s, "name");
        optional(s, "icon");
        return { ...s, device: s.device, source: s.source };
    });
    const config = { ...c, type: TYPE };
    if (sources)
        config.sources = sources;
    return config;
}

const en = {
    invalidConfig: "Check the card configuration in the dashboard code editor.",
    invalidType: "Use type: custom:home-theater-card.",
    invalidAppearance: "Choose Default or Bubble appearance.",
    invalidScheme: "Choose a listed color scheme.",
    invalidPlayer: "Choose a media player entity (media_player.*).",
    invalidSources: "Sources must be a list.",
    invalidSource: "Each source needs a device (receiver or tv) and a source name.",
    invalidText: "Names, titles, inputs and icons must be text.",
    title: "TV",
    on: "On",
    off: "Off",
    unavailable: "Unavailable",
    turnOn: "Turn on",
    turnOff: "Turn off",
    pending: "Updating…",
    failed: "The TV or receiver did not accept the command",
    timeout: "No confirmation from the TV or receiver. Check them and try again.",
    configure: "Configure",
    close: "Close",
    setup: "Choose a Home Theater room in the visual card editor.",
    withoutIntegration: "Without the Home Theater integration",
    directHelp: "Bind a TV and receiver directly. Sources are then hidden while the devices are off, and arrow keys always go to the TV.",
    sources: "Sources",
    allSources: "All sources",
    receiverInputs: "Receiver inputs",
    tvSources: "TV inputs and apps",
    switchTo: "Switch to",
    playing: "Playing",
    navigation: "Navigation",
    up: "Up",
    down: "Down",
    left: "Left",
    right: "Right",
    ok: "OK",
    back: "Back",
    home: "Home",
    volume: "Volume",
    volumeUp: "Volume up",
    volumeDown: "Volume down",
    mute: "Mute",
    unmute: "Unmute",
    muted: "Muted",
    soundMode: "Sound mode",
    tvSound: "TV sound",
    arcProblem: "The TV is playing through its own speakers, not the receiver.",
    useReceiver: "Send to receiver",
    arcHint: "If the receiver stays silent on TV apps, turn on HDMI control (CEC/SIMPLINK) and ARC on both the TV and the receiver, and connect the receiver's ARC output to the TV's ARC/eARC input.",
    tvPowerHint: "Home Assistant cannot turn this TV on yet. Add an automation for the TV's “Device is requested to turn on” trigger that sends a Wake-on-LAN packet.",
    theaterEntity: "Home Theater room",
    theaterHelp: "A room from the Home Theater integration shows what is playing, keeps sources while the room is off and sends arrow keys to the active player. The integration then owns the TV, receiver, sources and linked players: set them under Settings → Devices & services → Home Theater → Configure.",
    integrationSettings: "Home Theater settings",
    room: "Room",
    tvPowerHintTheater: "Home Assistant cannot turn this TV on yet. Add the TV's MAC address under the Home Theater integration's Configure.",
    configureHelpTheater: "Sources, their names and the players linked to them are set in the Home Theater integration. Title and appearance are set in this card's visual editor.",
    devices: "Devices",
    tv: "TV",
    receiver: "Receiver",
    details: "Details",
    configureHelp: "To choose the TV, receiver, favourite sources and appearance, edit this dashboard, select Edit on this card, and use the visual editor. Save the dashboard to keep your changes; Cancel leaves saved settings unchanged.",
    editorHelp: "Choose the Home Theater room this card shows. Changes are saved with the dashboard.",
    cardTitle: "Title",
    icon: "Icon",
    name: "Name",
    tvEntity: "TV (LG webOS)",
    receiverEntity: "AV receiver",
    tvInput: "TV input the receiver is connected to",
    tvInputHelp: "Selecting a receiver source also switches the TV to this input.",
    tvAudio: "Receiver input for the TV's own sound",
    tvAudioHelp: "Selecting a TV app also switches the receiver to this input (usually TV Audio).",
    none: "None",
    favourites: "Favourite sources",
    favouritesHelp: "Leave empty to show the receiver's inputs and Live TV. All sources stay available under All sources.",
    addSource: "Add source",
    device: "Device",
    source: "Source",
    remove: "Remove",
    moveUp: "Move up",
    moveDown: "Move down",
    incomplete: "Choose a source or remove each empty source row. Until then, your latest editor changes are not passed to the dashboard.",
    appearance: "Appearance",
    default: "Default",
    bubble: "Bubble",
    colorScheme: "Color scheme",
    "home-assistant": "Home Assistant",
    bright: "Bright",
    warm: "Warm",
    mint: "Mint",
    sky: "Sky",
    lavender: "Lavender",
    "output.tv_speaker": "TV speakers",
    "output.external_arc": "Receiver (HDMI ARC)",
    "output.external_optical": "Receiver (optical)",
    "output.external_speaker": "Receiver (optical/ARC)",
    "output.tv_external_speaker": "TV speakers and receiver",
    "output.tv_speaker_headphone": "TV speakers and headphones",
    "output.bt_soundbar": "Bluetooth",
    "output.headphone": "Headphones",
    "output.lineout": "Line out",
};
const nb = {
    invalidConfig: "Kontroller kortoppsettet i dashbordets kodeeditor.",
    invalidType: "Bruk type: custom:home-theater-card.",
    invalidAppearance: "Velg Standard eller Bubble som utseende.",
    invalidScheme: "Velg et fargevalg fra listen.",
    invalidPlayer: "Velg en mediespillerenhet (media_player.*).",
    invalidSources: "Kilder må være en liste.",
    invalidSource: "Hver kilde trenger en enhet (receiver eller tv) og et kildenavn.",
    invalidText: "Navn, titler, innganger og ikoner må være tekst.",
    title: "TV",
    on: "På",
    off: "Av",
    unavailable: "Utilgjengelig",
    turnOn: "Slå på",
    turnOff: "Slå av",
    pending: "Oppdaterer …",
    failed: "TV-en eller mottakeren godtok ikke kommandoen",
    timeout: "Ingen bekreftelse fra TV-en eller mottakeren. Kontroller dem og prøv igjen.",
    configure: "Konfigurer",
    close: "Lukk",
    setup: "Velg et hjemmekino-rom i den visuelle korteditoren.",
    withoutIntegration: "Uten Hjemmekino-integrasjonen",
    directHelp: "Koble TV og mottaker direkte. Kildene skjules da mens enhetene er av, og piltastene går alltid til TV-en.",
    sources: "Kilder",
    allSources: "Alle kilder",
    receiverInputs: "Innganger på mottakeren",
    tvSources: "TV-innganger og apper",
    switchTo: "Bytt til",
    playing: "Spiller",
    navigation: "Navigasjon",
    up: "Opp",
    down: "Ned",
    left: "Venstre",
    right: "Høyre",
    ok: "OK",
    back: "Tilbake",
    home: "Hjem",
    volume: "Volum",
    volumeUp: "Volum opp",
    volumeDown: "Volum ned",
    mute: "Demp",
    unmute: "Slå på lyden",
    muted: "Dempet",
    soundMode: "Lydmodus",
    tvSound: "TV-lyd",
    arcProblem: "TV-en spiller gjennom egne høyttalere, ikke mottakeren.",
    useReceiver: "Send til mottakeren",
    arcHint: "Hvis mottakeren er stille på TV-apper: slå på HDMI-styring (CEC/SIMPLINK) og ARC både på TV-en og mottakeren, og koble mottakerens ARC-utgang til TV-ens ARC/eARC-inngang.",
    tvPowerHint: "Home Assistant kan ikke slå på denne TV-en ennå. Legg til en automasjon for TV-ens utløser «Enheten blir bedt om å slå seg på» som sender en Wake-on-LAN-pakke.",
    theaterEntity: "Hjemmekino-rom",
    theaterHelp: "Et rom fra Hjemmekino-integrasjonen viser hva som spilles, beholder kildene mens rommet er av og sender piltastene til spilleren som er i bruk. Integrasjonen eier da TV, mottaker, kilder og koblede spillere: sett dem under Innstillinger → Enheter og tjenester → Hjemmekino → Konfigurer.",
    integrationSettings: "Innstillinger for hjemmekino",
    room: "Rom",
    tvPowerHintTheater: "Home Assistant kan ikke slå på denne TV-en ennå. Legg inn TV-ens MAC-adresse under Konfigurer for Hjemmekino-integrasjonen.",
    configureHelpTheater: "Kilder, navnene deres og spillerne som er koblet til dem, settes i Hjemmekino-integrasjonen. Tittel og utseende settes i kortets visuelle editor.",
    devices: "Enheter",
    tv: "TV",
    receiver: "Mottaker",
    details: "Detaljer",
    configureHelp: "For å velge TV, mottaker, favorittkilder og utseende, rediger dashbordet, velg Rediger på dette kortet og bruk den visuelle editoren. Lagre dashbordet for å beholde endringene. Avbryt lar lagrede innstillinger være uendret.",
    editorHelp: "Velg hjemmekino-rommet dette kortet viser. Endringer lagres med dashbordet.",
    cardTitle: "Tittel",
    icon: "Ikon",
    name: "Navn",
    tvEntity: "TV (LG webOS)",
    receiverEntity: "AV-mottaker",
    tvInput: "TV-inngangen mottakeren er koblet til",
    tvInputHelp: "Når du velger en kilde på mottakeren, bytter TV-en også til denne inngangen.",
    tvAudio: "Inngang på mottakeren for TV-ens egen lyd",
    tvAudioHelp: "Når du velger en TV-app, bytter mottakeren også til denne inngangen (vanligvis TV Audio).",
    none: "Ingen",
    favourites: "Favorittkilder",
    favouritesHelp: "La stå tomt for å vise mottakerens innganger og Live TV. Alle kilder er fortsatt tilgjengelige under Alle kilder.",
    addSource: "Legg til kilde",
    device: "Enhet",
    source: "Kilde",
    remove: "Fjern",
    moveUp: "Flytt opp",
    moveDown: "Flytt ned",
    incomplete: "Velg en kilde eller fjern hver tomme kilderad. Frem til da blir de siste endringene i editoren ikke sendt til dashbordet.",
    appearance: "Utseende",
    default: "Standard",
    bubble: "Bubble",
    colorScheme: "Fargevalg",
    "home-assistant": "Home Assistant",
    bright: "Lys",
    warm: "Varm",
    mint: "Mint",
    sky: "Himmelblå",
    lavender: "Lavendel",
    "output.tv_speaker": "TV-høyttalere",
    "output.external_arc": "Mottaker (HDMI ARC)",
    "output.external_optical": "Mottaker (optisk)",
    "output.external_speaker": "Mottaker (optisk/ARC)",
    "output.tv_external_speaker": "TV-høyttalere og mottaker",
    "output.tv_speaker_headphone": "TV-høyttalere og hodetelefoner",
    "output.bt_soundbar": "Bluetooth",
    "output.headphone": "Hodetelefoner",
    "output.lineout": "Linjeutgang",
};
function language(hass) {
    const lang = (hass?.language || hass?.locale?.language || "en")
        .toLowerCase()
        .replace(/_/g, "-")
        .split("-")[0];
    return ["nb", "no", "nn"].includes(lang) ? "nb" : "en";
}
function t$1(hass, key) {
    return (language(hass) === "nb" ? nb : en)[key];
}
/** Known webOS sound outputs get a label; unknown values stay recognizable. */
function outputLabel(hass, output) {
    const key = `output.${output}`;
    return key in en ? t$1(hass, key) : output;
}
function formatLocale(hass) {
    const preference = hass?.locale?.number_format;
    const formats = {
        comma_decimal: "en-US",
        decimal_comma: "de-DE",
        space_comma: "nb-NO",
        none: "en-US",
    };
    const locale = (hass?.locale?.language || hass?.language || "en")
        .replace(/_/g, "-")
        .replace(/^(no|nn)(?=-|$)/i, "nb");
    return { locale: formats[preference ?? ""] ?? locale, grouping: preference !== "none" };
}
/** Formats a receiver volume in dB for display only. */
function formatDb(hass, value) {
    const { locale, grouping } = formatLocale(hass);
    const options = {
        maximumFractionDigits: 1,
        signDisplay: "exceptZero",
        useGrouping: grouping,
    };
    let number;
    try {
        number = new Intl.NumberFormat(locale, options).format(value);
    }
    catch {
        number = new Intl.NumberFormat("en", options).format(value);
    }
    return `${number} dB`;
}

/** media_player supported_features bits used by this card. */
const Feature = {
    VOLUME_MUTE: 8,
    TURN_ON: 128,
    TURN_OFF: 256,
    VOLUME_STEP: 1024,
    SELECT_SOUND_MODE: 65536,
};
/** Default receiver input that plays the TV's own sound (Denon/Marantz naming). */
const DEFAULT_TV_AUDIO = "TV Audio";
/** webOS names for sending the TV's sound to an ARC/eARC or optical receiver. */
const RECEIVER_OUTPUT = "external_arc";
const OFF = ["off", "standby"];
const MISSING = ["unavailable", "unknown"];
function entityOf(hass, id) {
    return id ? hass?.states[id] : undefined;
}
function available(hass, id) {
    const entity = entityOf(hass, id);
    return !!entity && hass.connection?.connected !== false && !MISSING.includes(entity.state);
}
function isOn(entity) {
    return !!entity && !OFF.includes(entity.state) && !MISSING.includes(entity.state);
}
function supports(entity, feature) {
    const value = entity?.attributes.supported_features;
    return typeof value === "number" && (value & feature) === feature;
}
function sourceList(entity) {
    const list = entity?.attributes.source_list;
    return Array.isArray(list) ? list.filter((s) => typeof s === "string") : [];
}
function soundModes(entity) {
    const list = entity?.attributes.sound_mode_list;
    return Array.isArray(list) ? list.filter((s) => typeof s === "string") : [];
}
function text$1(entity, key) {
    const value = entity?.attributes[key];
    return typeof value === "string" && value ? value : undefined;
}
const currentSource = (entity) => text$1(entity, "source");
const currentSoundMode = (entity) => text$1(entity, "sound_mode");
const soundOutput = (entity) => text$1(entity, "sound_output");
function tvAudio(config) {
    return config.receiver ? config.tv_audio || DEFAULT_TV_AUDIO : undefined;
}
/**
 * Configured favourites, or a short default: the receiver's own inputs (without
 * the TV audio input) and the TV's Live TV. Every source stays reachable in the
 * full source list.
 */
function favourites(config, hass) {
    if (config.sources?.length)
        return config.sources;
    const receiver = entityOf(hass, config.receiver);
    const tv = entityOf(hass, config.tv);
    const audio = tvAudio(config);
    const result = sourceList(receiver)
        .filter((source) => source !== audio)
        .map((source) => ({ device: "receiver", source }));
    const tvSources = sourceList(tv);
    if (config.receiver) {
        if (tvSources.includes("Live TV"))
            result.push({ device: "tv", source: "Live TV" });
    }
    else
        result.push(...tvSources.map((source) => ({ device: "tv", source })));
    return result;
}
/** Every source the two players offer, receiver inputs first. */
function allSources(config, hass) {
    const audio = tvAudio(config);
    return [
        ...sourceList(entityOf(hass, config.receiver))
            .filter((source) => source !== audio)
            .map((source) => ({ device: "receiver", source })),
        ...sourceList(entityOf(hass, config.tv))
            .filter((source) => source !== config.tv_input)
            .map((source) => ({ device: "tv", source })),
    ];
}
/**
 * What the room is showing. A receiver on its TV audio input means the TV's own
 * input or app is playing; any other receiver input is a player on the receiver.
 */
function activeSource(config, hass) {
    const receiver = entityOf(hass, config.receiver);
    const tv = entityOf(hass, config.tv);
    const input = isOn(receiver) ? currentSource(receiver) : undefined;
    if (input && input !== tvAudio(config))
        return { device: "receiver", source: input };
    const app = isOn(tv) ? currentSource(tv) : undefined;
    if (app && app !== config.tv_input)
        return { device: "tv", source: app };
    if (input)
        return { device: "receiver", source: input };
    return undefined;
}
function sameSource(a, b) {
    return !!a && a.device === b.device && a.source === b.source;
}
/** Denon/Marantz map 0..1 onto -80..+18 dB; show the receiver's own dB figure. */
function volumeDb(entity) {
    const level = entity?.attributes.volume_level;
    return typeof level === "number" && Number.isFinite(level) ? Math.round((level * 100 - 80) * 2) / 2 : undefined;
}
function muted(entity) {
    return entity?.attributes.is_volume_muted === true;
}
/**
 * The TV's sound should reach the receiver over ARC whenever a receiver is
 * configured. A TV reporting its own speakers or headphones is misrouted.
 */
function arcProblem(config, hass) {
    const tv = entityOf(hass, config.tv);
    const output = soundOutput(tv);
    return !!config.receiver && isOn(tv) && !!output &&
        (output.startsWith("tv_speaker") || output === "headphone");
}
function roomOn(config, hass) {
    return isOn(entityOf(hass, config.tv)) || isOn(entityOf(hass, config.receiver));
}

/** For presses with no observable state, such as a remote key: done once HA accepts the call. */
const accepted = () => true;
/** Tracks acknowledgements only. HA owns device state; no state is synthesized here. */
class Requests {
    constructor(changed, timeoutMs = 15000) {
        this.changed = changed;
        this.timeoutMs = timeoutMs;
        this.active = new Set();
    }
    pending(key) {
        return [...this.active].some((r) => key === undefined || r.key === key);
    }
    /** Sends `steps` in order; the request ends when HA confirms it or it times out. */
    start(key, confirm, steps) {
        if (this.pending(key))
            return false;
        this.error = undefined;
        this.errorDetail = undefined;
        const request = {
            key,
            confirm,
            sent: false,
            confirmed: false,
            timer: setTimeout(() => {
                if (!this.active.has(request))
                    return;
                this.error = "timeout";
                this.finish(request);
            }, this.timeoutMs),
        };
        this.active.add(request);
        this.changed();
        const failed = (error) => {
            if (!this.active.has(request))
                return;
            this.error = "failed";
            this.errorDetail =
                error instanceof Error
                    ? error.message
                    : typeof error === "object" && error !== null && "message" in error
                        ? String(error.message)
                        : typeof error === "string"
                            ? error
                            : undefined;
            this.finish(request);
        };
        (async () => {
            for (const step of steps)
                await step();
        })().then(() => {
            if (!this.active.has(request))
                return;
            request.sent = true;
            if (request.confirmed || confirm === accepted)
                this.finish(request);
        }, failed);
        return true;
    }
    reconcile(states) {
        for (const request of this.active) {
            request.confirmed = request.confirm(states);
            if (request.sent && request.confirmed)
                this.finish(request);
        }
    }
    finish(request) {
        clearTimeout(request.timer);
        this.active.delete(request);
        this.changed();
    }
    reset() {
        for (const r of this.active)
            clearTimeout(r.timer);
        this.active.clear();
        this.error = undefined;
        this.errorDetail = undefined;
        this.changed();
    }
}

/** Guesses by the names Denon receivers and webOS TVs use; users can override per source. */
const GUESSES = [
    [/netflix/i, "mdi:netflix"],
    [/youtube/i, "mdi:youtube"],
    [/spotify/i, "mdi:spotify"],
    [/plex/i, "mdi:plex"],
    [/twitch/i, "mdi:twitch"],
    [/apple\s*tv|airplay/i, "mdi:apple"],
    [/chromecast|google\s*tv|\bcast\b/i, "mdi:cast"],
    [/live\s*tv|^tv$|tuner|antenna/i, "mdi:television-classic"],
    [/game|playstation|ps\d|xbox|switch|nintendo/i, "mdi:gamepad-variant-outline"],
    [/cbl|sat|cable|decoder|set.?top/i, "mdi:satellite-variant"],
    [/blu.?ray|dvd|disc/i, "mdi:disc-player"],
    [/bluetooth/i, "mdi:bluetooth"],
    [/phono|vinyl|turntable/i, "mdi:record-player"],
    [/^cd$/i, "mdi:disc"],
    [/\b(radio|fm|am|dab|tuner)\b/i, "mdi:radio"],
    [/heos|online|network|music/i, "mdi:music-box-outline"],
    [/tv audio/i, "mdi:television-speaker"],
    [/media player|shield|fire\s*tv|roku/i, "mdi:play-box-outline"],
    [/aux|usb/i, "mdi:usb-port"],
    [/hdmi|input|\bav\b/i, "mdi:video-input-hdmi"],
];
function sourceIcon(source) {
    const match = GUESSES.find(([pattern]) => pattern.test(source.name || source.source))
        ?? GUESSES.find(([pattern]) => pattern.test(source.source));
    return match?.[1] ?? (source.device === "tv" ? "mdi:application-outline" : "mdi:video-input-hdmi");
}

/** Local overrides only: removing the attribute restores the dashboard theme. */
const colorSchemeStyles = i$4 `
  :host([data-color-scheme]) {
    color-scheme: light;
    --primary-text-color: #202b36;
    --secondary-text-color: #52606d;
    --disabled-text-color: #626d78;
    --text-primary-color: #fff;
    --success-color: #28723c;
    --warning-color: #8c6100;
    --error-color: #bd2635;
    --orange-color: #ab4b13;
    --info-color: #146a91;
    --primary-color: var(--scheme-accent);
    --accent-color: var(--scheme-accent);
    --card-background-color: var(--scheme-surface);
    --ha-card-background: var(--scheme-surface);
    --primary-background-color: var(--scheme-surface);
    --secondary-background-color: var(--scheme-secondary);
    --divider-color: var(--scheme-border);
    --ha-card-border-color: var(--scheme-border);
    --bubble-main-background-color: var(--scheme-surface);
    --bubble-secondary-background-color: var(--scheme-secondary);
    --bubble-icon-background-color: var(--scheme-secondary);
    --bubble-sub-button-background-color: var(--scheme-secondary);
    --bubble-accent-color: var(--scheme-accent);
    --bubble-border: 1px solid var(--scheme-border);
    --ha-card-box-shadow: 0 2px 8px rgb(32 43 54 / 0.06);
    --bubble-box-shadow: var(--ha-card-box-shadow);
    --input-fill-color: var(--scheme-secondary);
    --input-ink-color: var(--primary-text-color);
    --input-label-ink-color: var(--secondary-text-color);
    --mdc-theme-primary: var(--scheme-accent);
    --mdc-theme-surface: var(--scheme-surface);
    --mdc-theme-on-surface: var(--primary-text-color);
    --mdc-text-field-fill-color: var(--scheme-secondary);
    --mdc-text-field-ink-color: var(--primary-text-color);
  }
  :host([data-color-scheme="bright"]) {
    --scheme-surface: #ffffff;
    --scheme-secondary: #edf3fa;
    --scheme-accent: #2365a5;
    --scheme-border: #ccd9e7;
  }
  :host([data-color-scheme="warm"]) {
    --scheme-surface: #fffaf1;
    --scheme-secondary: #f4ead9;
    --scheme-accent: #885321;
    --scheme-border: #ddd0ba;
  }
  :host([data-color-scheme="mint"]) {
    --scheme-surface: #f2fbf5;
    --scheme-secondary: #dfefe5;
    --scheme-accent: #286c50;
    --scheme-border: #c1d9ca;
  }
  :host([data-color-scheme="sky"]) {
    --scheme-surface: #f1f8ff;
    --scheme-secondary: #dfeefa;
    --scheme-accent: #22638e;
    --scheme-border: #c2d8e9;
  }
  :host([data-color-scheme="lavender"]) {
    --scheme-surface: #faf5ff;
    --scheme-secondary: #ede3f6;
    --scheme-accent: #725095;
    --scheme-border: #d7c8e5;
  }
`;

const styles = [
    colorSchemeStyles,
    i$4 `
    :host {
      display: block;
      color: var(--primary-text-color, #262d38);
      font-family: var(--paper-font-body1_-_font-family, system-ui, sans-serif);
      --ht-surface: var(--ha-card-background, var(--card-background-color, #fff));
      --ht-pill: var(--secondary-background-color, #f1f3f6);
      --ht-accent: var(--bubble-accent-color, var(--primary-color, #507b9b));
      --ht-radius: var(--ha-card-border-radius, 16px);
      --ht-muted: var(--secondary-text-color, #626976);
    }
    :host([appearance="bubble"]) {
      --ht-surface: var(
        --bubble-main-background-color,
        var(--ha-card-background, var(--card-background-color, #fff))
      );
      --ht-pill: var(
        --bubble-secondary-background-color,
        var(--secondary-background-color, #f1f3f6)
      );
      --ht-radius: var(--bubble-border-radius, 28px);
    }
    * {
      box-sizing: border-box;
    }
    ha-card {
      display: block;
      padding: 16px;
      background: var(--ht-surface);
      border-radius: var(--ht-radius);
      border: 1px solid var(--ha-card-border-color, var(--divider-color, #ddd));
      box-shadow: var(--ha-card-box-shadow, none);
    }
    :host([appearance="bubble"]) ha-card {
      border: var(--bubble-border, none);
      box-shadow: var(--bubble-box-shadow, var(--ha-card-box-shadow, none));
    }
    button {
      font: inherit;
      color: inherit;
      cursor: pointer;
      border: 0;
      background: none;
      min-height: 44px;
    }
    button:disabled {
      cursor: default;
      opacity: 0.55;
    }
    button:focus-visible {
      outline: 3px solid var(--ht-accent);
      outline-offset: 3px;
    }
    button:hover:not(:disabled) {
      filter: brightness(0.96);
    }
    button:active:not(:disabled) {
      filter: brightness(0.9);
    }
    h2,
    h3,
    p {
      margin: 0;
    }
    header {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-bottom: 14px;
    }
    h2 {
      font-size: 17px;
      font-weight: 650;
      line-height: 1.3;
      overflow-wrap: anywhere;
    }
    h3 {
      font-size: 13px;
      font-weight: 650;
      color: var(--ht-muted);
      margin: 18px 0 8px;
    }
    .heading {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
      min-width: 0;
    }
    .heading > ha-icon {
      flex: none;
      color: var(--ht-muted);
    }
    ha-card[data-state="on"] .heading > ha-icon {
      color: var(--ht-accent);
    }
    .titles {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .titles .status {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .status {
      font-size: 12px;
      color: var(--ht-muted);
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-left: auto;
      flex: none;
    }
    ha-icon {
      --mdc-icon-size: 21px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
    }
    .round {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: none;
      background: var(--ht-pill);
    }
    .power[aria-pressed="true"] {
      background: color-mix(in srgb, var(--ht-accent) 24%, var(--ht-pill));
      color: var(--ht-accent);
    }
    .sources {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(100%, 118px), 1fr));
      gap: 8px;
    }
    .chip {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
      padding: 0 12px 0 10px;
      border-radius: 22px;
      background: var(--ht-pill);
      font-size: 13px;
      text-align: left;
    }
    .chip span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .chip ha-icon {
      flex: none;
      color: var(--ht-muted);
    }
    .chip[aria-pressed="true"] {
      background: color-mix(in srgb, var(--ht-accent) 22%, var(--ht-pill));
      font-weight: 600;
    }
    .chip[aria-pressed="true"] ha-icon {
      color: var(--ht-accent);
    }
    .chip.more {
      color: var(--ht-muted);
    }
    .devices {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin: -4px 0 12px;
    }
    .device-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 0 12px 0 10px;
      border-radius: 22px;
      background: var(--ht-pill);
      font-size: 12px;
      border: 1px solid transparent;
    }
    .device-pill ha-icon {
      --mdc-icon-size: 18px;
      color: var(--ht-muted);
    }
    .device-pill .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--ht-muted);
      opacity: 0.5;
    }
    .device-pill {
      max-width: 100%;
      min-width: 0;
    }
    .device-pill .state {
      color: var(--ht-muted);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      min-width: 0;
    }
    .device-pill[data-state="on"] .dot {
      background: var(--success-color, #28723c);
      opacity: 1;
    }
    .device-pill[data-state="on"] ha-icon {
      color: var(--ht-accent);
    }
    .device-pill[data-state="unavailable"] .dot {
      background: var(--error-color, #bd2635);
      opacity: 1;
    }
    .device-pill[data-missing] {
      border-color: var(--warning-color, #8c6100);
    }
    .now-playing {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
      margin: 0 0 12px;
      padding: 6px;
      border-radius: 18px;
      background: var(--ht-pill);
    }
    .now-playing img {
      width: 64px;
      height: 64px;
      object-fit: cover;
      border-radius: 12px;
      flex: none;
    }
    .now-playing > ha-icon {
      width: 64px;
      height: 64px;
      --mdc-icon-size: 32px;
      color: var(--ht-muted);
      flex: none;
    }
    .now-playing strong {
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .controls-row {
      display: flex;
      justify-content: flex-start;
      margin-top: 16px;
    }
    .action.primary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: color-mix(in srgb, var(--ht-accent) 22%, var(--ht-pill));
    }
    .controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      flex-wrap: wrap;
      margin-top: 18px;
    }
    .navigation {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }
    .dpad {
      display: grid;
      grid-template: repeat(3, 56px) / repeat(3, 56px);
      border-radius: 50%;
      background: var(--ht-pill);
      padding: 4px;
    }
    .pad {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .pad ha-icon {
      --mdc-icon-size: 28px;
      width: 30px;
      height: 30px;
    }
    .up { grid-area: 1 / 2; }
    .left { grid-area: 2 / 1; }
    .ok {
      grid-area: 2 / 2;
      background: var(--ht-surface);
      font-weight: 650;
      font-size: 14px;
      box-shadow: 0 1px 4px rgb(0 0 0 / 0.12);
    }
    .right { grid-area: 2 / 3; }
    .down { grid-area: 3 / 2; }
    .nav-keys {
      display: flex;
      gap: 16px;
    }
    .volume {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 6px;
      border-radius: 30px;
      background: var(--ht-pill);
    }
    .volume .round {
      background: var(--ht-surface);
    }
    .volume output {
      font-size: 12px;
      font-variant-numeric: tabular-nums;
      color: var(--ht-muted);
      min-width: 64px;
      text-align: center;
      padding: 4px 0;
    }
    .mute[aria-pressed="true"] {
      color: var(--error-color, #bd2635);
    }
    .hint {
      font-size: 13px;
      line-height: 1.6;
      color: var(--ht-muted);
      margin-top: 12px;
    }
    .error,
    .warning {
      padding: 10px 12px;
      margin: 0 0 12px;
      border-radius: 12px;
      font-size: 13px;
      line-height: 1.5;
      overflow-wrap: anywhere;
    }
    .error {
      color: var(--error-color, #bd2635);
      background: color-mix(in srgb, var(--error-color, #bd2635) 8%, var(--ht-surface));
    }
    .warning {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
      background: color-mix(in srgb, var(--warning-color, #8c6100) 12%, var(--ht-surface));
    }
    .warning > span {
      flex: 1;
      min-width: 150px;
    }
    .warning ha-icon {
      color: var(--warning-color, #8c6100);
    }
    .action {
      padding: 0 16px;
      border-radius: 22px;
      background: var(--ht-pill);
    }
    .warning .action {
      background: var(--ht-surface);
    }
    dialog {
      color: inherit;
      background: var(--ht-surface);
      border: 1px solid var(--divider-color, #ddd);
      border-radius: var(--ht-radius);
      width: min(480px, calc(100vw - 32px));
      max-height: calc(100dvh - 32px);
      padding: 20px;
      box-shadow: 0 16px 60px #0005;
    }
    dialog::backdrop {
      background: rgb(0 0 0 / 0.4);
    }
    dialog header h3:first-child {
      margin-top: 0;
    }
    dialog .warning {
      margin-top: 10px;
    }
    .device {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 6px 0;
    }
    .device > span {
      display: flex;
      flex-direction: column;
    }
    @media (max-width: 400px) {
      ha-card {
        padding: 12px;
      }
      .controls {
        gap: 14px;
      }
      .dpad {
        grid-template: repeat(3, 50px) / repeat(3, 50px);
      }
      .pad {
        width: 50px;
        height: 50px;
      }
    }
  `,
];

/** Keys: the room remote's command, then the webOS button for direct mode. */
const DPAD = [
    ["up", "UP", "mdi:chevron-up"],
    ["left", "LEFT", "mdi:chevron-left"],
    ["ok", "ENTER", ""],
    ["right", "RIGHT", "mdi:chevron-right"],
    ["down", "DOWN", "mdi:chevron-down"],
];
const INTEGRATION_PAGE = "/config/integrations/integration/home_theater";
function strings(value) {
    return Array.isArray(value) ? value.filter((s) => typeof s === "string") : [];
}
function text(value) {
    return typeof value === "string" && value ? value : undefined;
}
class HomeTheaterCard extends i$1 {
    constructor() {
        super(...arguments);
        this.config = { type: TYPE };
        this.waiters = new Set();
        this.requests = new Requests(() => this.requestUpdate(), 60000);
    }
    setConfig(input) {
        this.close();
        this.configError = undefined;
        try {
            this.config = normalizeConfig(input);
        }
        catch (error) {
            if (!(error instanceof ConfigValidationError))
                throw error;
            this.config = { type: TYPE };
            this.configError = error.code;
        }
        this.cancelWaiters();
        this.requests.reset();
        this.requestUpdate();
    }
    /** A new card shows the first Home Theater room; the editor can pick another. */
    static getStubConfig(hass) {
        const room = Object.values(hass?.entities ?? {})
            .filter((e) => e.platform === "home_theater" && e.entity_id.startsWith("media_player."))
            .map((e) => e.entity_id)
            .sort()[0];
        return room ? { type: TYPE, theater: room } : { type: TYPE };
    }
    static async getConfigElement() {
        await Promise.resolve().then(function () { return editor; });
        return document.createElement("home-theater-card-editor");
    }
    getCardSize() {
        return this.on ? 7 : 3;
    }
    t(key) {
        return t$1(this.hass, key);
    }
    willUpdate(changed) {
        if (changed.has("hass") && this.hass) {
            this.requests.reconcile(this.hass.states);
            for (const waiter of this.waiters)
                if (waiter.test()) {
                    clearTimeout(waiter.timer);
                    this.waiters.delete(waiter);
                    waiter.resolve();
                }
        }
        this.setAttribute("appearance", this.config.appearance ?? "default");
        if (!this.config.color_scheme || this.config.color_scheme === "home-assistant")
            this.removeAttribute("data-color-scheme");
        else
            this.setAttribute("data-color-scheme", this.config.color_scheme);
    }
    updated() {
        const dialog = this.renderRoot.querySelector("dialog");
        if (this.dialogKind && dialog && !dialog.open)
            dialog.showModal();
    }
    disconnectedCallback() {
        this.close();
        this.cancelWaiters();
        this.requests.reset();
        super.disconnectedCallback();
    }
    /** Resolves once HA reports the condition, for steps that need a device awake. */
    waitFor(test, ms = 25000) {
        if (test())
            return Promise.resolve();
        return new Promise((resolve, reject) => {
            const waiter = {
                test,
                resolve,
                reject,
                timer: setTimeout(() => {
                    this.waiters.delete(waiter);
                    reject(new Error(this.t("timeout")));
                }, ms),
            };
            this.waiters.add(waiter);
        });
    }
    cancelWaiters() {
        for (const waiter of this.waiters) {
            clearTimeout(waiter.timer);
            waiter.reject(new Error("cancelled"));
        }
        this.waiters.clear();
    }
    // ----- which entities the card works with
    /** The integration's room media player, when the card is bound to one. */
    get room() {
        return this.config.theater;
    }
    entity(id) {
        return entityOf(this.hass, id);
    }
    roomAttr(key) {
        return this.entity(this.room)?.attributes[key];
    }
    get tvId() {
        return this.room ? text(this.roomAttr("tv")) : this.config.tv;
    }
    get receiverId() {
        return this.room ? text(this.roomAttr("receiver")) : this.config.receiver;
    }
    /** The room's remote, found beside its media player on the same device. */
    get remoteId() {
        const entries = this.hass?.entities;
        const device = this.room ? entries?.[this.room]?.device_id : undefined;
        if (!device)
            return undefined;
        return Object.values(entries).find((e) => e.device_id === device &&
            e.platform === "home_theater" && e.entity_id.startsWith("remote."))?.entity_id;
    }
    /** The room's device name, as the integration entry named it. */
    get roomName() {
        const device = this.room ? this.hass?.entities?.[this.room]?.device_id : undefined;
        const entry = device ? this.hass?.devices?.[device] : undefined;
        return text(entry?.name_by_user) ?? text(entry?.name);
    }
    get volumeId() {
        return this.room || this.config.receiver || this.config.tv;
    }
    get configured() {
        return !!(this.room || this.config.tv || this.config.receiver);
    }
    get on() {
        return this.room ? isOn(this.entity(this.room)) : roomOn(this.config, this.hass);
    }
    get anyAvailable() {
        return this.room
            ? available(this.hass, this.room)
            : available(this.hass, this.config.tv) || available(this.hass, this.config.receiver);
    }
    canTurnOnTv() {
        return this.room
            ? this.roomAttr("can_turn_on_tv") === true
            : supports(this.entity(this.config.tv), Feature.TURN_ON);
    }
    audioProblem() {
        return this.room ? this.roomAttr("audio_problem") === true : arcProblem(this.config, this.hass);
    }
    // ----- requests
    call(domain, service, data) {
        return () => this.hass.callService(domain, service, data);
    }
    send(key, confirm, steps) {
        if (!this.hass || this.busy(key))
            return;
        this.requests.start(key, confirm, steps);
    }
    /** Power and source changes touch both devices, so they block each other. */
    busy(key) {
        return ["power", "source"].includes(key)
            ? this.requests.pending("power") || this.requests.pending("source")
            : this.requests.pending(key);
    }
    // ----- power
    powerEnabled() {
        if (this.busy("power") || !this.anyAvailable)
            return false;
        if (this.room || this.on)
            return true;
        return available(this.hass, this.config.receiver) ||
            (available(this.hass, this.config.tv) && this.canTurnOnTv());
    }
    togglePower() {
        const on = this.on;
        const room = this.room;
        if (room) {
            this.send("power", (s) => isOn(s[room]) !== on, [this.call("media_player", on ? "turn_off" : "turn_on", { entity_id: room })]);
            return;
        }
        const { tv, receiver } = this.config;
        const steps = [];
        if (on) {
            for (const id of [tv, receiver])
                if (id && isOn(this.entity(id)))
                    steps.push(this.call("media_player", "turn_off", { entity_id: id }));
            this.send("power", (s) => !isOn(tv ? s[tv] : undefined) && !isOn(receiver ? s[receiver] : undefined), steps);
            return;
        }
        if (receiver && available(this.hass, receiver))
            steps.push(this.call("media_player", "turn_on", { entity_id: receiver }));
        if (tv && this.canTurnOnTv())
            steps.push(this.call("media_player", "turn_on", { entity_id: tv }));
        const target = receiver && available(this.hass, receiver) ? receiver : tv;
        this.send("power", (s) => isOn(s[target]), steps);
    }
    /** One device on or off. Turning one on goes through the room, which wakes only what is off. */
    deviceEnabled(id, tv) {
        if (!id || this.busy("power") || !available(this.hass, id))
            return false;
        if (isOn(this.entity(id)))
            return supports(this.entity(id), Feature.TURN_OFF);
        if (this.room)
            return available(this.hass, this.room) && (!tv || this.canTurnOnTv());
        return supports(this.entity(id), Feature.TURN_ON);
    }
    toggleDevice(id, tv) {
        if (!id || !this.deviceEnabled(id, tv))
            return;
        const on = isOn(this.entity(id));
        const target = !on && this.room ? this.room : id;
        this.send("power", (s) => isOn(s[id]) !== on, [this.call("media_player", on ? "turn_off" : "turn_on", { entity_id: target })]);
    }
    // ----- sources
    chips(all) {
        const room = this.room;
        if (room) {
            const entity = this.entity(room);
            const labels = strings(all ? this.roomAttr("all_sources") : this.roomAttr("sources"));
            const list = labels.length || all ? labels : strings(entity?.attributes.source_list);
            const current = this.on ? text(entity?.attributes.source) : undefined;
            const enabled = available(this.hass, room) && !this.busy("source");
            return list.map((label) => ({
                key: label, label, source: label,
                icon: sourceIcon({ device: "tv", source: label }),
                active: label === current, enabled,
                select: () => this.send("source", (s) => s[room]?.attributes.source === label, [this.call("media_player", "select_source", { entity_id: room, source: label })]),
            }));
        }
        const active = this.on ? activeSource(this.config, this.hass) : undefined;
        const list = all
            ? allSources(this.config, this.hass).map((s) => this.config.sources?.find((f) => sameSource(s, f)) ?? s)
            : favourites(this.config, this.hass);
        return list.map((s) => ({
            key: `${s.device}:${s.source}`, label: s.name || s.source, source: s.source, device: s.device,
            icon: s.icon || sourceIcon(s), active: sameSource(active, s),
            enabled: this.sourceEnabled(s), select: () => this.selectSource(s),
        }));
    }
    sourceEnabled(source) {
        if (this.busy("source"))
            return false;
        const { tv, receiver } = this.config;
        if (source.device === "receiver")
            return available(this.hass, receiver);
        if (!available(this.hass, tv))
            return false;
        // An off TV needs Wake-on-LAN or the receiver's HDMI control to wake it.
        return isOn(this.entity(tv)) || this.canTurnOnTv() || available(this.hass, receiver);
    }
    selectSource(source) {
        if (!this.hass || !this.sourceEnabled(source))
            return;
        const { tv, receiver, tv_input } = this.config;
        const audio = tvAudio(this.config);
        const steps = [];
        const wake = (id) => {
            if (isOn(this.entity(id)))
                return;
            steps.push(this.call("media_player", "turn_on", { entity_id: id }));
            steps.push(() => this.waitFor(() => isOn(this.entity(id))));
        };
        if (source.device === "receiver") {
            wake(receiver);
            steps.push(this.call("media_player", "select_source", { entity_id: receiver, source: source.source }));
            const tvOn = isOn(this.entity(tv));
            if (tv && tv_input && tvOn)
                steps.push(this.call("media_player", "select_source", { entity_id: tv, source: tv_input }));
            else if (tv && !tvOn && this.canTurnOnTv())
                steps.push(this.call("media_player", "turn_on", { entity_id: tv }));
            this.send("source", (s) => s[receiver]?.attributes.source === source.source &&
                (!tv || !tv_input || !tvOn || s[tv]?.attributes.source === tv_input), steps);
            return;
        }
        if (receiver && available(this.hass, receiver)) {
            wake(receiver);
            if (audio)
                steps.push(this.call("media_player", "select_source", { entity_id: receiver, source: audio }));
        }
        if (!isOn(this.entity(tv))) {
            if (this.canTurnOnTv())
                steps.push(this.call("media_player", "turn_on", { entity_id: tv }));
            steps.push(() => this.waitFor(() => isOn(this.entity(tv))));
        }
        steps.push(this.call("media_player", "select_source", { entity_id: tv, source: source.source }));
        const withReceiver = !!receiver && available(this.hass, receiver) && !!audio;
        this.send("source", (s) => s[tv]?.attributes.source === source.source &&
            (!withReceiver || s[receiver]?.attributes.source === audio), steps);
    }
    // ----- remote keys, volume, sound
    dpadTarget() {
        if (this.room)
            return this.on && available(this.hass, this.remoteId) ? this.remoteId : undefined;
        return isOn(this.entity(this.config.tv)) ? this.config.tv : undefined;
    }
    press(command, button) {
        const target = this.dpadTarget();
        if (!target || !available(this.hass, target))
            return;
        this.send("dpad", accepted, [this.room
                ? this.call("remote", "send_command", { entity_id: target, command })
                : this.call("webostv", "button", { entity_id: target, button })]);
    }
    volumeEnabled() {
        const id = this.volumeId;
        return available(this.hass, id) && isOn(this.entity(id)) && supports(this.entity(id), Feature.VOLUME_STEP);
    }
    volume(direction) {
        const id = this.volumeId;
        if (!id || !this.volumeEnabled())
            return;
        this.send("volume", accepted, [this.call("media_player", `volume_${direction}`, { entity_id: id })]);
    }
    toggleMute() {
        const id = this.volumeId;
        if (!id || !this.volumeEnabled())
            return;
        const target = !muted(this.entity(id));
        this.send("mute", (s) => muted(s[id]) === target, [this.call("media_player", "volume_mute", { entity_id: id, is_volume_muted: target })]);
    }
    selectSoundMode(mode) {
        const id = this.receiverId;
        if (!id || !available(this.hass, id))
            return;
        this.send("sound_mode", (s) => s[id]?.attributes.sound_mode === mode, [this.call("media_player", "select_sound_mode", { entity_id: id, sound_mode: mode })]);
    }
    useReceiver() {
        const room = this.room;
        const tv = this.tvId;
        if (!tv || !available(this.hass, tv))
            return;
        this.send("output", (s) => s[tv]?.attributes.sound_output === RECEIVER_OUTPUT, [room
                ? this.call("home_theater", "use_receiver", { entity_id: room })
                : this.call("webostv", "select_sound_output", { entity_id: tv, sound_output: RECEIVER_OUTPUT })]);
    }
    // ----- dialogs and navigation
    open(kind, event) {
        this.trigger = event.currentTarget;
        this.dialogKind = kind;
        this.requestUpdate();
    }
    close() {
        this.renderRoot?.querySelector("dialog")?.close();
        this.dialogKind = undefined;
        if (this.trigger?.isConnected)
            this.trigger.focus();
        this.trigger = undefined;
        this.requestUpdate();
    }
    more(id) {
        if (!id || !this.entity(id))
            return;
        this.close();
        this.dispatchEvent(new CustomEvent("hass-more-info", {
            detail: { entityId: id },
            bubbles: true,
            composed: true,
        }));
    }
    openIntegration() {
        this.close();
        history.pushState(null, "", INTEGRATION_PAGE);
        window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
    }
    // ----- rendering
    status() {
        if (!this.anyAvailable)
            return this.t("unavailable");
        if (this.requests.pending("power") || this.requests.pending("source"))
            return this.t("pending");
        if (!this.on)
            return this.t("off");
        const active = this.chips(false).find((c) => c.active) ?? this.chips(true).find((c) => c.active);
        const parts = [];
        if (this.room)
            parts.push(text(this.roomAttr("source")) ?? this.t("on"));
        else
            parts.push(active?.label ?? activeSource(this.config, this.hass)?.source ?? this.t("on"));
        const player = this.entity(this.volumeId);
        if (isOn(player)) {
            const db = this.receiverId ? volumeDb(player) : undefined;
            if (muted(player))
                parts.push(this.t("muted"));
            else if (db !== undefined)
                parts.push(formatDb(this.hass, db));
        }
        return parts.join(" · ");
    }
    error() {
        if (this.configError)
            return b `<p class="error" role="alert">${this.t(this.configError)}</p>`;
        return this.requests.error
            ? b `<p class="error" role="alert">
          ${this.t(this.requests.error)}${this.requests.errorDetail ? b ` — ${this.requests.errorDetail}` : A}
        </p>`
            : A;
    }
    arcWarning() {
        if (!this.audioProblem())
            return A;
        return b `<div class="warning" role="status">
      <ha-icon .icon=${"mdi:speaker-off"}></ha-icon>
      <span>${this.t("arcProblem")}</span>
      <button class="action" data-action="use-receiver" ?disabled=${this.busy("output")}
        @click=${() => this.useReceiver()}>${this.t("useReceiver")}</button>
    </div>`;
    }
    devices() {
        const tv = this.tvId;
        const receiver = this.receiverId;
        if (!tv || !receiver)
            return A;
        const pill = (id, label, icon, isTv) => {
            const on = isOn(this.entity(id));
            const state = available(this.hass, id) ? (on ? "on" : "off") : "unavailable";
            // An on device shows its current input, so the receiver's TV Audio is visible too.
            const input = on ? text(this.entity(id)?.attributes.source) : undefined;
            const status = input ?? this.t(state === "unavailable" ? "unavailable" : state);
            // Worth a nudge: the other device is on and this one is not.
            const missing = !on && state !== "unavailable" && this.on;
            return b `<button class="device-pill" data-action=${`device-${label}`} data-state=${state}
        aria-pressed=${String(on)} ?data-missing=${missing}
        aria-label=${`${this.t(on ? "turnOff" : "turnOn")}: ${this.t(label)} (${status})`}
        title=${`${this.t(on ? "turnOff" : "turnOn")}: ${this.t(label)}`}
        ?disabled=${!this.deviceEnabled(id, isTv)} @click=${() => this.toggleDevice(id, isTv)}>
        <ha-icon .icon=${icon}></ha-icon><span>${this.t(label)}</span>
        <span class="dot" aria-hidden="true"></span><span class="state">${status}</span>
      </button>`;
        };
        return b `<div class="devices" role="group" aria-label=${this.t("devices")}>
      ${pill(tv, "tv", "mdi:television", true)}${pill(receiver, "receiver", "mdi:amplifier", false)}
    </div>`;
    }
    nowPlaying() {
        if (!this.room || !this.on)
            return A;
        const attributes = this.entity(this.room)?.attributes ?? {};
        const title = text(attributes.media_title);
        if (!title)
            return A;
        const episode = [text(attributes.media_series_title), text(attributes.media_artist), text(attributes.app_name)]
            .find((value) => value);
        const picture = text(attributes.entity_picture);
        return b `<div class="now-playing" data-now-playing>
      ${picture ? b `<img src=${picture} alt="" />` : b `<ha-icon .icon=${"mdi:play-circle-outline"}></ha-icon>`}
      <div class="titles"><strong>${title}</strong>${episode ? b `<span class="status">${episode}</span>` : A}</div>
    </div>`;
    }
    chip(chip) {
        return b `<button class="chip" data-action="source" data-device=${chip.device ?? "room"}
      data-source=${chip.source} aria-pressed=${String(chip.active)}
      aria-label=${chip.active ? `${this.t("playing")}: ${chip.label}` : `${this.t("switchTo")} ${chip.label}`}
      title=${chip.label} ?disabled=${!chip.enabled}
      @click=${() => chip.select()}>
      <ha-icon .icon=${chip.icon}></ha-icon>
      <span>${chip.label}</span>
    </button>`;
    }
    sources() {
        const list = this.chips(false);
        const every = this.chips(true);
        // What is playing stays visible even when it is not a favourite.
        if (!list.some((c) => c.active)) {
            const active = every.find((c) => c.active);
            if (active)
                list.push(active);
        }
        const more = every.some((c) => !list.some((f) => f.key === c.key));
        if (!list.length && !more)
            return A;
        return b `<div class="sources" role="group" aria-label=${this.t("sources")}>
      ${list.map((c) => this.chip(c))}
      ${more ? b `<button class="chip more" data-action="all-sources" title=${this.t("allSources")}
        @click=${(e) => this.open("sources", e)}>
        <ha-icon .icon=${"mdi:dots-horizontal"}></ha-icon><span>${this.t("allSources")}</span>
      </button>` : A}
    </div>`;
    }
    dpad() {
        const target = this.dpadTarget();
        if (!target)
            return A;
        const disabled = !available(this.hass, target);
        return b `<div class="navigation" role="group" aria-label=${this.t("navigation")}>
      <div class="dpad">
        ${DPAD.map(([key, button, icon]) => b `<button class=${`pad ${key}`} data-action=${`dpad-${key}`}
          aria-label=${this.t(key)} title=${this.t(key)} ?disabled=${disabled}
          @click=${() => this.press(key, button)}>${icon ? b `<ha-icon .icon=${icon}></ha-icon>` : this.t("ok")}</button>`)}
      </div>
      <div class="nav-keys">
        <button class="round" data-action="dpad-back" aria-label=${this.t("back")} title=${this.t("back")}
          ?disabled=${disabled} @click=${() => this.press("back", "BACK")}><ha-icon .icon=${"mdi:arrow-u-left-top"}></ha-icon></button>
        <button class="round" data-action="dpad-home" aria-label=${this.t("home")} title=${this.t("home")}
          ?disabled=${disabled} @click=${() => this.press("home", "HOME")}><ha-icon .icon=${"mdi:home-outline"}></ha-icon></button>
      </div>
    </div>`;
    }
    volumeControls() {
        const player = this.entity(this.volumeId);
        if (!isOn(player) || !supports(player, Feature.VOLUME_STEP))
            return A;
        const enabled = this.volumeEnabled();
        const db = this.receiverId ? volumeDb(player) : undefined;
        const isMuted = muted(player);
        return b `<div class="volume" role="group" aria-label=${this.t("volume")}>
      <button class="round" data-action="volume-up" aria-label=${this.t("volumeUp")} title=${this.t("volumeUp")}
        ?disabled=${!enabled} @click=${() => this.volume("up")}><ha-icon .icon=${"mdi:plus"}></ha-icon></button>
      <output aria-live="polite">${isMuted ? this.t("muted") : db !== undefined ? formatDb(this.hass, db) : this.t("volume")}</output>
      <button class="round" data-action="volume-down" aria-label=${this.t("volumeDown")} title=${this.t("volumeDown")}
        ?disabled=${!enabled} @click=${() => this.volume("down")}><ha-icon .icon=${"mdi:minus"}></ha-icon></button>
      ${supports(player, Feature.VOLUME_MUTE) ? b `<button class="round mute" data-action="mute"
        aria-pressed=${String(isMuted)} aria-label=${this.t(isMuted ? "unmute" : "mute")} title=${this.t(isMuted ? "unmute" : "mute")}
        ?disabled=${!enabled || this.busy("mute")} @click=${() => this.toggleMute()}>
        <ha-icon .icon=${isMuted ? "mdi:volume-off" : "mdi:volume-high"}></ha-icon></button>` : A}
    </div>`;
    }
    sourcesDialog() {
        const all = this.chips(true);
        if (this.room)
            return b `<div class="sources">${all.map((c) => this.chip(c))}</div>`;
        const group = (device, label) => {
            const list = all.filter((c) => c.device === device);
            return list.length ? b `<h3>${this.t(label)}</h3>
        <div class="sources">${list.map((c) => this.chip(c))}</div>` : A;
        };
        return b `${group("receiver", "receiverInputs")}${group("tv", "tvSources")}`;
    }
    configureDialog() {
        const tv = this.tvId;
        const receiver = this.receiverId;
        const receiverEntity = this.entity(receiver);
        const modes = soundModes(receiverEntity);
        const mode = currentSoundMode(receiverEntity);
        const output = this.room ? text(this.roomAttr("tv_sound_output")) : soundOutput(this.entity(tv));
        const device = (id, label) => id ? b `<div class="device">
      <span><strong>${this.t(label)}</strong><span class="status">${available(this.hass, id)
            ? this.t(isOn(this.entity(id)) ? "on" : "off") : this.t("unavailable")}</span></span>
      <button class="action" data-action=${`more-${label}`} ?disabled=${!this.entity(id)}
        @click=${() => this.more(id)}>${this.t("details")}</button>
    </div>` : A;
        return b `
      ${receiver && isOn(receiverEntity) && supports(receiverEntity, Feature.SELECT_SOUND_MODE) && modes.length ? b `
        <h3>${this.t("soundMode")}</h3>
        <div class="sources">${modes.map((m) => b `<button class="chip" data-action="sound-mode" data-mode=${m}
          aria-pressed=${String(m === mode)} ?disabled=${this.busy("sound_mode") || !available(this.hass, receiver)}
          @click=${() => this.selectSoundMode(m)}><span>${m}</span></button>`)}</div>` : A}
      ${tv && receiver ? b `<h3>${this.t("tvSound")}</h3>
        <p class="status" data-output=${output ?? ""}>${output ? outputLabel(this.hass, output) : this.t(isOn(this.entity(tv)) ? "unavailable" : "off")}</p>
        ${this.arcWarning()}
        <p class="hint">${this.t("arcHint")}</p>` : A}
      ${tv && this.entity(tv) && !this.canTurnOnTv() ? b `<p class="hint" data-hint="tv-power">${this.t(this.room ? "tvPowerHintTheater" : "tvPowerHint")}</p>` : A}
      ${this.configured ? b `<h3>${this.t("devices")}</h3>${device(this.room, "room")}${device(tv, "tv")}${device(receiver, "receiver")}` : A}
      ${this.room ? b `<div class="controls-row"><button class="action primary" data-action="integration"
        @click=${() => this.openIntegration()}><ha-icon .icon=${"mdi:cog-outline"}></ha-icon>${this.t("integrationSettings")}</button></div>` : A}
      <p class="hint">${this.t(this.room ? "configureHelpTheater" : "configureHelp")}</p>`;
    }
    dialog() {
        if (!this.dialogKind)
            return A;
        const title = this.t(this.dialogKind === "sources" ? "allSources" : "configure");
        return b `<dialog aria-labelledby="dialog-title"
      @cancel=${(e) => { e.preventDefault(); this.close(); }}>
      <header>
        <div class="heading"><h2 id="dialog-title">${title}</h2></div>
        <button class="round" data-action="close" aria-label=${this.t("close")} title=${this.t("close")}
          @click=${() => this.close()}><ha-icon .icon=${"mdi:close"}></ha-icon></button>
      </header>
      ${this.error()}
      ${this.dialogKind === "sources" ? this.sourcesDialog() : this.configureDialog()}
    </dialog>`;
    }
    render() {
        const on = this.on;
        const configured = this.configured;
        return b `<ha-card data-state=${on ? "on" : "off"}>
      <header>
        <div class="heading">
          <ha-icon .icon=${this.config.icon || "mdi:television"}></ha-icon>
          <div class="titles">
            <h2>${this.config.title || this.roomName || this.t("title")}</h2>
            <span class="status" aria-live="polite">${configured ? this.status() : A}</span>
          </div>
        </div>
        <div class="header-actions">
          ${configured ? b `<button class="round power" data-action="power" aria-pressed=${String(on)}
            aria-label=${this.t(on ? "turnOff" : "turnOn")} title=${this.t(on ? "turnOff" : "turnOn")}
            ?disabled=${!this.powerEnabled()} @click=${() => this.togglePower()}>
            <ha-icon .icon=${"mdi:power"}></ha-icon></button>` : A}
          <button class="round" data-action="configure" aria-label=${this.t("configure")} title=${this.t("configure")}
            @click=${(e) => this.open("configure", e)}><ha-icon .icon=${"mdi:cog-outline"}></ha-icon></button>
        </div>
      </header>
      ${this.error()}
      ${!configured ? b `<p class="hint">${this.t("setup")}</p>` : b `
        ${this.devices()}
        ${this.nowPlaying()}
        ${this.arcWarning()}
        ${this.sources()}
        ${on ? b `<div class="controls">${this.dpad()}${this.volumeControls()}</div>` : A}`}
      ${this.dialog()}
    </ha-card>`;
    }
}
HomeTheaterCard.styles = styles;
HomeTheaterCard.properties = { hass: { attribute: false } };
if (!customElements.get("home-theater-card"))
    customElements.define("home-theater-card", HomeTheaterCard);
const registry = window;
registry.customCards ?? (registry.customCards = []);
if (!registry.customCards.some((c) => c.type === "home-theater-card"))
    registry.customCards.push({
        type: "home-theater-card",
        name: "Home Theater Card",
        description: "One power button, sources, arrows and volume for a TV and AV receiver.",
        preview: true,
    });

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t={ATTRIBUTE:1,PROPERTY:3,BOOLEAN_ATTRIBUTE:4},e=t=>(...e)=>({_$litDirective$:t,values:e});class i{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i;}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const r=o=>void 0===o.strings,m={},p=(o,t=m)=>o._$AH=t;

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const l=e(class extends i{constructor(r$1){if(super(r$1),r$1.type!==t.PROPERTY&&r$1.type!==t.ATTRIBUTE&&r$1.type!==t.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!r(r$1))throw Error("`live` bindings can only contain a single expression")}render(r){return r}update(i,[t$1]){if(t$1===E||t$1===A)return t$1;const o=i.element,l=i.name;if(i.type===t.PROPERTY){if(t$1===o[l])return E}else if(i.type===t.BOOLEAN_ATTRIBUTE){if(!!t$1===o.hasAttribute(l))return E}else if(i.type===t.ATTRIBUTE&&o.getAttribute(l)===t$1+"")return E;return p(i),t$1}});

/** Edits only Lovelace configuration. HA's dashboard owns Save and Cancel. */
class HomeTheaterEditor extends i$1 {
    constructor() {
        super(...arguments);
        this.config = { type: TYPE };
    }
    setConfig(config) {
        this.configError = undefined;
        try {
            this.config = normalizeConfig(config);
        }
        catch (error) {
            if (!(error instanceof ConfigValidationError))
                throw error;
            this.configError = error.code;
        }
        this.requestUpdate();
    }
    t(key) {
        return t$1(this.hass, key);
    }
    change(update) {
        const next = structuredClone(this.config);
        update(next);
        for (const key of ["title", "icon", "theater", "tv", "receiver", "tv_input", "tv_audio"])
            if (next[key] === "" || next[key] === undefined)
                delete next[key];
        this.config = next;
        try {
            const valid = normalizeConfig(next);
            this.dispatchEvent(new CustomEvent("config-changed", {
                detail: { config: valid },
                bubbles: true,
                composed: true,
            }));
        }
        catch {
            // An empty source row remains a local draft until the user picks a source.
        }
        this.requestUpdate();
    }
    text(name, label, value, change) {
        return b `<label>${this.t(label)}<input name=${name} .value=${l(value ?? "")}
      @change=${(e) => change(e.target.value)} /></label>`;
    }
    /** A choice from the player's live source list; the saved value stays listed even when the player is off. */
    choice(name, label, options, value, change, empty, help) {
        const list = value && !options.includes(value) ? [value, ...options] : options;
        if (!list.length && !empty)
            return this.text(name, label, value, change);
        return b `<label>${this.t(label)}
      <select name=${name} .value=${l(value ?? "")}
        @change=${(e) => change(e.target.value)}>
        ${empty ? b `<option value="" ?selected=${!value}>${this.t(empty)}</option>` : A}
        ${!empty && !value ? b `<option value="" selected disabled>${this.t("source")}</option>` : A}
        ${list.map((option) => b `<option value=${option} ?selected=${option === value}>${option}</option>`)}
      </select>
      ${help ? b `<small>${this.t(help)}</small>` : A}
    </label>`;
    }
    player(key, label) {
        const filter = { theater: { integration: "home_theater" }, tv: { integration: "webostv" }, receiver: {} }[key];
        return b `<ha-selector data-field=${key} .hass=${this.hass}
      .selector=${{ entity: { domain: "media_player", ...filter } }}
      .value=${this.config[key] || undefined} .label=${this.t(label)}
      @value-changed=${(e) => {
            e.stopPropagation();
            this.change((c) => { c[key] = e.detail.value ?? ""; });
        }}></ha-selector>`;
    }
    move(list, index, offset) {
        const to = index + offset;
        if (to < 0 || to >= list.length)
            return;
        [list[index], list[to]] = [list[to], list[index]];
    }
    tool(action, label, icon, disabled, run, context) {
        return b `<button class="icon-button" data-action=${action} ?disabled=${disabled}
      title=${this.t(label)} aria-label=${`${this.t(label)}: ${context}`} @click=${run}>
      <ha-icon .icon=${icon}></ha-icon>
    </button>`;
    }
    sourceRow(source, index, count) {
        const options = sourceList(entityOf(this.hass, source.device === "tv" ? this.config.tv : this.config.receiver));
        const name = source.name || source.source || this.t("source");
        const edit = (update) => this.change((c) => update(c.sources[index]));
        return b `<div class="source-row" data-source=${index}>
      <div class="fields">
        <label>${this.t("device")}
          <select name=${`source-device-${index}`} .value=${l(source.device)}
            @change=${(e) => edit((s) => {
            s.device = e.target.value;
            s.source = "";
        })}>
            ${["receiver", "tv"].map((d) => b `<option value=${d} ?selected=${d === source.device}>${this.t(d)}</option>`)}
          </select>
        </label>
        ${this.choice(`source-${index}`, "source", options, source.source, (value) => edit((s) => { s.source = value; }))}
        ${this.text(`source-name-${index}`, "name", source.name, (value) => edit((s) => { if (value)
            s.name = value;
        else
            delete s.name; }))}
        ${this.text(`source-icon-${index}`, "icon", source.icon, (value) => edit((s) => { if (value)
            s.icon = value;
        else
            delete s.icon; }))}
      </div>
      <div class="tools">
        ${this.tool("source-up", "moveUp", "mdi:arrow-up", index === 0, () => this.change((c) => this.move(c.sources, index, -1)), name)}
        ${this.tool("source-down", "moveDown", "mdi:arrow-down", index === count - 1, () => this.change((c) => this.move(c.sources, index, 1)), name)}
        ${this.tool("remove-source", "remove", "mdi:delete-outline", false, () => this.change((c) => {
            c.sources.splice(index, 1);
            if (!c.sources.length)
                delete c.sources;
        }), name)}
      </div>
    </div>`;
    }
    render() {
        if (this.configError)
            return b `<p class="error" role="alert">${this.t(this.configError)} ${this.t("invalidConfig")}</p>`;
        const sources = this.config.sources ?? [];
        const tvSources = sourceList(entityOf(this.hass, this.config.tv));
        const receiverSources = sourceList(entityOf(this.hass, this.config.receiver));
        const room = !!this.config.theater;
        const direct = b `
      <small>${this.t("directHelp")}</small>
      ${this.player("tv", "tvEntity")}
      ${this.player("receiver", "receiverEntity")}
      ${this.config.tv && this.config.receiver ? b `<div class="fields">
        ${this.choice("tv_input", "tvInput", tvSources, this.config.tv_input, (value) => this.change((c) => { c.tv_input = value; }), "none", "tvInputHelp")}
        ${this.choice("tv_audio", "tvAudio", receiverSources, this.config.tv_audio ?? DEFAULT_TV_AUDIO, (value) => this.change((c) => { if (value === DEFAULT_TV_AUDIO)
            delete c.tv_audio;
        else
            c.tv_audio = value; }), undefined, "tvAudioHelp")}
      </div>` : A}
      <fieldset>
        <legend>${this.t("favourites")}</legend>
        <small>${this.t("favouritesHelp")}</small>
        ${sources.some((s) => !s.source) ? b `<p class="error" role="alert">${this.t("incomplete")}</p>` : A}
        ${sources.map((s, i) => this.sourceRow(s, i, sources.length))}
        <button class="add" data-action="add-source"
          @click=${() => this.change((c) => {
            c.sources = [...(c.sources ?? []), { device: c.receiver ? "receiver" : "tv", source: "" }];
        })}>${this.t("addSource")}</button>
      </fieldset>`;
        return b `
      <p>${this.t("editorHelp")}</p>
      ${this.player("theater", "theaterEntity")}
      <small>${this.t("theaterHelp")}</small>
      <div class="fields">
        ${this.text("title", "cardTitle", this.config.title, (value) => this.change((c) => { c.title = value; }))}
        ${this.text("icon", "icon", this.config.icon, (value) => this.change((c) => { c.icon = value; }))}
        <label>${this.t("appearance")}
          <select name="appearance" .value=${l(this.config.appearance ?? "default")}
            @change=${(e) => this.change((c) => {
            c.appearance = e.target.value;
        })}>
            ${["default", "bubble"].map((v) => b `<option value=${v} ?selected=${v === (this.config.appearance ?? "default")}>${this.t(v)}</option>`)}
          </select>
        </label>
        <label>${this.t("colorScheme")}
          <select name="color_scheme" .value=${l(this.config.color_scheme ?? "home-assistant")}
            @change=${(e) => this.change((c) => {
            c.color_scheme = e.target.value;
        })}>
            ${colorSchemes.map((v) => b `<option value=${v} ?selected=${v === (this.config.color_scheme ?? "home-assistant")}>${this.t(v)}</option>`)}
          </select>
        </label>
      </div>
      ${room ? A : b `<details class="direct" ?open=${!!(this.config.tv || this.config.receiver)}>
        <summary>${this.t("withoutIntegration")}</summary>
        ${direct}
      </details>`}
    `;
    }
}
HomeTheaterEditor.properties = { hass: { attribute: false } };
HomeTheaterEditor.styles = i$4 `
    :host {
      display: block;
      color: var(--primary-text-color, #202b36);
      font: inherit;
    }
    * {
      box-sizing: border-box;
    }
    p {
      line-height: 1.5;
      color: var(--secondary-text-color, #626976);
    }
    small {
      color: var(--secondary-text-color, #626976);
      line-height: 1.4;
    }
    label {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 14px;
    }
    input,
    select,
    button {
      font: inherit;
      color: inherit;
      min-height: 44px;
      border-radius: 10px;
      border: 1px solid var(--divider-color, #ccc);
      background: var(--card-background-color, #fff);
      padding: 8px 10px;
    }
    button {
      cursor: pointer;
      background: var(--secondary-background-color, #f1f3f6);
    }
    button:disabled {
      opacity: 0.4;
      cursor: default;
    }
    input:focus-visible,
    select:focus-visible,
    button:focus-visible {
      outline: 3px solid var(--primary-color, #507b9b);
      outline-offset: 2px;
    }
    .fields {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 180px), 1fr));
      gap: 12px;
      margin: 12px 0;
    }
    fieldset {
      min-width: 0;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 14px;
      padding: 12px;
      margin: 16px 0;
    }
    legend {
      padding: 0 6px;
      font-weight: 600;
    }
    .tools {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      margin: 10px 0;
    }
    .source-row {
      border-top: 1px solid var(--divider-color, #ccc);
      padding: 12px 0;
    }
    .error {
      color: var(--error-color, #bd2635);
    }
    ha-selector {
      display: block;
      width: 100%;
      margin: 8px 0;
    }
    .icon-button {
      min-width: 44px;
    }
    ha-icon {
      --mdc-icon-size: 20px;
    }
    .add {
      width: 100%;
      margin-top: 8px;
    }
    details.direct {
      margin-top: 16px;
      border-top: 1px solid var(--divider-color, #ccc);
      padding-top: 8px;
    }
    summary {
      cursor: pointer;
      min-height: 44px;
      display: flex;
      align-items: center;
      font-weight: 600;
    }
  `;
if (!customElements.get("home-theater-card-editor"))
    customElements.define("home-theater-card-editor", HomeTheaterEditor);

var editor = /*#__PURE__*/Object.freeze({
    __proto__: null,
    HomeTheaterEditor: HomeTheaterEditor
});

export { HomeTheaterCard };
//# sourceMappingURL=home-theater-card.js.map
