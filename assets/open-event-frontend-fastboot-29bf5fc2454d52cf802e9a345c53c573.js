define("open-event-frontend/initializers/ajax",["exports"],function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
e.default={name:"ajax-service",initialize:function(){}}}),define("open-event-frontend/initializers/error-handler",["exports"],function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t={name:"error-handler",initialize:function(e){Ember.onerror||(Ember.onerror=function(e){var t="There was an error running your app in fastboot. More info about the error: \n ".concat(e.stack||e)
Ember.Logger.error(t)})}}
e.default=t}),define("open-event-frontend/instance-initializers/setup-fetch",["exports","fetch"],function(e,t){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var r={name:"fetch",initialize:function(e){var r=e.lookup("service:fastboot").get("request"),n="undefined:"===r.protocol?"http:":r.protocol;(0,t.setupFastboot)(n,r.get("host"))}}
e.default=r})
