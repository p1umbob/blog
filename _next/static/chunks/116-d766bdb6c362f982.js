(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[116],{4116:function(e,r,t){"use strict";t.d(r,{A:function(){return a}});var n=t(5893),o=t(1664),a=(t(7294),function(e){var r=e.children;return(0,n.jsx)("div",{className:"container mx-auto",children:(0,n.jsxs)("div",{className:"",children:[(0,n.jsxs)("header",{className:"flex justify-between items-center my-10 h-52 bg-gradient-to-r from-gray-500 to-white-500 bg-no-repeat bg-center",children:[(0,n.jsx)("div",{className:"logo",children:(0,n.jsx)(o.default,{href:"/",children:(0,n.jsx)("a",{className:"navbar-title font-serif cursor-pointer text-white ml-10 text-xl",children:"\u03a0\u03ac\u03bd"})})}),(0,n.jsxs)("ul",{style:{listStyle:"none",float:"right",margin:"0"},children:[(0,n.jsx)(o.default,{href:"/",passHref:!0,children:(0,n.jsx)("span",{className:"navbar-item",style:{margin:"0 12px",cursor:"pointer"},children:"Home"})}),(0,n.jsx)(o.default,{href:"/about/",passHref:!0,children:(0,n.jsx)("span",{className:"navbar-item",style:{margin:"0 12px",cursor:"pointer"},children:"About"})}),(0,n.jsx)(o.default,{href:"/contact/",passHref:!0,children:(0,n.jsx)("span",{className:"navbar-item",style:{margin:"0 12px",cursor:"pointer"},children:"Contact"})})]})]}),r]})})})},8418:function(e,r,t){"use strict";function n(e,r){(null==r||r>e.length)&&(r=e.length);for(var t=0,n=new Array(r);t<r;t++)n[t]=e[t];return n}function o(e,r){return function(e){if(Array.isArray(e))return e}(e)||function(e,r){var t=null==e?null:"undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=t){var n,o,a=[],l=!0,i=!1;try{for(t=t.call(e);!(l=(n=t.next()).done)&&(a.push(n.value),!r||a.length!==r);l=!0);}catch(u){i=!0,o=u}finally{try{l||null==t.return||t.return()}finally{if(i)throw o}}return a}}(e,r)||function(e,r){if(!e)return;if("string"===typeof e)return n(e,r);var t=Object.prototype.toString.call(e).slice(8,-1);"Object"===t&&e.constructor&&(t=e.constructor.name);if("Map"===t||"Set"===t)return Array.from(t);if("Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))return n(e,r)}(e,r)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}r.default=void 0;var a,l=(a=t(7294))&&a.__esModule?a:{default:a},i=t(6273),u=t(387),c=t(7190);var s={};function f(e,r,t,n){if(e&&i.isLocalURL(r)){e.prefetch(r,t,n).catch((function(e){0}));var o=n&&"undefined"!==typeof n.locale?n.locale:e&&e.locale;s[r+"%"+t+(o?"%"+o:"")]=!0}}var d=function(e){var r,t=!1!==e.prefetch,n=u.useRouter(),a=l.default.useMemo((function(){var r=o(i.resolveHref(n,e.href,!0),2),t=r[0],a=r[1];return{href:t,as:e.as?i.resolveHref(n,e.as):a||t}}),[n,e.href,e.as]),d=a.href,p=a.as,h=e.children,y=e.replace,v=e.shallow,m=e.scroll,b=e.locale;"string"===typeof h&&(h=l.default.createElement("a",null,h));var g=(r=l.default.Children.only(h))&&"object"===typeof r&&r.ref,x=o(c.useIntersection({rootMargin:"200px"}),2),j=x[0],w=x[1],A=l.default.useCallback((function(e){j(e),g&&("function"===typeof g?g(e):"object"===typeof g&&(g.current=e))}),[g,j]);l.default.useEffect((function(){var e=w&&t&&i.isLocalURL(d),r="undefined"!==typeof b?b:n&&n.locale,o=s[d+"%"+p+(r?"%"+r:"")];e&&!o&&f(n,d,p,{locale:r})}),[p,d,w,b,t,n]);var E={ref:A,onClick:function(e){r.props&&"function"===typeof r.props.onClick&&r.props.onClick(e),e.defaultPrevented||function(e,r,t,n,o,a,l,u){("A"!==e.currentTarget.nodeName||!function(e){var r=e.currentTarget.target;return r&&"_self"!==r||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.nativeEvent&&2===e.nativeEvent.which}(e)&&i.isLocalURL(t))&&(e.preventDefault(),null==l&&n.indexOf("#")>=0&&(l=!1),r[o?"replace":"push"](t,n,{shallow:a,locale:u,scroll:l}))}(e,n,d,p,y,v,m,b)},onMouseEnter:function(e){r.props&&"function"===typeof r.props.onMouseEnter&&r.props.onMouseEnter(e),i.isLocalURL(d)&&f(n,d,p,{priority:!0})}};if(e.passHref||"a"===r.type&&!("href"in r.props)){var M="undefined"!==typeof b?b:n&&n.locale,C=n&&n.isLocaleDomain&&i.getDomainLocale(p,M,n&&n.locales,n&&n.domainLocales);E.href=C||i.addBasePath(i.addLocale(p,M,n&&n.defaultLocale))}return l.default.cloneElement(r,E)};r.default=d},7190:function(e,r,t){"use strict";function n(e,r){(null==r||r>e.length)&&(r=e.length);for(var t=0,n=new Array(r);t<r;t++)n[t]=e[t];return n}function o(e,r){return function(e){if(Array.isArray(e))return e}(e)||function(e,r){var t=null==e?null:"undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=t){var n,o,a=[],l=!0,i=!1;try{for(t=t.call(e);!(l=(n=t.next()).done)&&(a.push(n.value),!r||a.length!==r);l=!0);}catch(u){i=!0,o=u}finally{try{l||null==t.return||t.return()}finally{if(i)throw o}}return a}}(e,r)||function(e,r){if(!e)return;if("string"===typeof e)return n(e,r);var t=Object.prototype.toString.call(e).slice(8,-1);"Object"===t&&e.constructor&&(t=e.constructor.name);if("Map"===t||"Set"===t)return Array.from(t);if("Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))return n(e,r)}(e,r)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}Object.defineProperty(r,"__esModule",{value:!0}),r.useIntersection=function(e){var r=e.rootRef,t=e.rootMargin,n=e.disabled||!i,c=a.useRef(),s=o(a.useState(!1),2),f=s[0],d=s[1],p=o(a.useState(r?r.current:null),2),h=p[0],y=p[1],v=a.useCallback((function(e){c.current&&(c.current(),c.current=void 0),n||f||e&&e.tagName&&(c.current=function(e,r,t){var n=function(e){var r=e.rootMargin||"",t=u.get(r);if(t)return t;var n=new Map,o=new IntersectionObserver((function(e){e.forEach((function(e){var r=n.get(e.target),t=e.isIntersecting||e.intersectionRatio>0;r&&t&&r(t)}))}),e);return u.set(r,t={id:r,observer:o,elements:n}),t}(t),o=n.id,a=n.observer,l=n.elements;return l.set(e,r),a.observe(e),function(){l.delete(e),a.unobserve(e),0===l.size&&(a.disconnect(),u.delete(o))}}(e,(function(e){return e&&d(e)}),{root:h,rootMargin:t}))}),[n,h,t,f]);return a.useEffect((function(){if(!i&&!f){var e=l.requestIdleCallback((function(){return d(!0)}));return function(){return l.cancelIdleCallback(e)}}}),[f]),a.useEffect((function(){r&&y(r.current)}),[r]),[v,f]};var a=t(7294),l=t(9311),i="undefined"!==typeof IntersectionObserver;var u=new Map},1664:function(e,r,t){e.exports=t(8418)}}]);