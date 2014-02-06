module.exports={scope:"ud.saas",id:null,connected:!1,current:null,socket:!1,instance:null,messages:[],settings:{query_timeout:3e3,log:{errors:!0,events:!1,procedurals:!1,all_data:!1}},connect:function(a,b){"use strict";var c=this;c.settings.log.procedurals&&c.log(c.scope+".connect()",arguments),b=jQuery.extend(!0,{"force new connection":!1,secure:!0},b?b:{},{instance:c.instance});var d=(b.secure?"https://saas.usabilitydynamics.com:443/":"http://saas.usabilitydynamics.com:80/")+("string"==typeof a?a:"");return"object"!=typeof io?(jQuery(document).trigger("ud::saas::update",{message:"Socket.io Not Loaded, connection not established.",args:arguments}),!1):c.socket&&!b["force new connection"]?(c.emit(c.id+"::receive::instance",{instance:c.instance}),c.socket):(c.socket=io.connect(d,b),c.on("connect",function(){c.id=c.socket.socket.sessionid,c.current=d,jQuery(document).trigger("ud::saas::connect",c),jQuery(document).trigger(""+c.id+"::init",c),c.on(c.id+"::update",function(a){a.message&&c.messages.push({time:(new Date).getTime(),message:a.message,screen:c.instance.screen}),jQuery(document).trigger(""+c.id+"::update",a)}),c.on(c.id+"::request::instance",function(){c.emit(c.id+"::receive::instance",{instance:c.instance}),c.connected=null,c.on(c.id+"::update::screen_set",function(a){jQuery(document).trigger(""+c.id+"::update::screen_set::"+a.screen,{data:a,saas:c})}),c.on(c.id+"::update::authentication",function(a){a.success?(c.connected=!0,jQuery(document).trigger(""+c.id+"::connected",c)):(c.connected=!1,c.current=null,c.log(new Error(c.scope+".connect() update::authentication - Failure.")))})}),c.on("disconnect",function(){jQuery(document).trigger(""+c.id+"::disconnected",c),c.connected=!1,c.current=null,c.id=null,c.settings.log.all_data&&"function"==typeof c.log_all&&jQuery(document).unbind("io::data",c.log_all)}),c.settings.log.all_data&&"function"==typeof c.log_all&&jQuery(document).bind("io::data",c.log_all)}),c.socket)},disconnect:function(){"use strict";var a=this;a.settings.log.procedurals&&a.log(a.scope+".disconnect()",arguments),a.socket&&"function"==typeof a.socket.disconnect&&(a.socket.disconnect(),a.socket.removeAllListeners(),jQuery(document).trigger("ud::saas::disconnect",a))},emit:function(a,b){"use strict";var c=this;c.settings.log.events&&c.log(c.scope+".emit()",arguments),c.id&&(b.session=b.session?b.session:c.id),c.socket.emit(a,b)},on:function(a,b){"use strict";var c=this;if(c.settings.log.events&&c.log(c.scope+".on()",arguments),c.socket)return c.socket.on(a,b);var d=setInterval(function(){return c.socket?(c.socket.on(a,b),void clearInterval(d)):ud.warning("Socket not ready. "+a+" called too early. Retrying in several seconds...")},2500);window.setTimeout(function(){ud.warning("Socket attempts for "+a+" are up."),clearInterval(d)},1e4)},query:function(a,b,c){"use strict";var d=this;return d.settings.log.events&&d.log(d.scope+".get()",arguments),d.connected||(ud.warning(d.scope+".get() - Called too early. Scheduling re-try for "+d.id+"::connected event.",arguments),jQuery(document).one("ud::saas::connected",function(){ud.warning(d.scope+".get() - Calling scheduled ud.saas.query() post "+d.id+"::connected event.",arguments),d.query(a,b,c)})),window.ud.saas._instances=window.ud.saas._instances?window.ud.saas._instances:{},b._hash=parseInt(Math.random().toString().replace("0.","")),window.ud.saas._instances[b._hash]=setTimeout(function(){delete window.ud.saas._instances[b._hash],"function"==typeof c?c(new Error("ud.saas.query() - No response received, dropping listener: receive::"+a+"::"+b._hash),b):d.log(new Error("ud.saas.query() - No response received, dropping listener: receive::"+a+"::"+b._hash),b)},d.settings.query_timeout),d.socket.emit("request::"+a,b),d.socket.on("receive::"+a+"::"+b._hash,function(a){switch(clearTimeout(window.ud.saas._instances[b._hash]),typeof c){case"function":c(null,a);break;default:c=a}}),null},log:function(a){var b=this;if("object"!=typeof window.console||/MSIE (\d+\.\d+);/.test(navigator.userAgent))return!1;if(!("object"==typeof a&&a instanceof Error)||b.settings.log.errors)return console.log.apply(console,arguments),"boolean"==typeof arguments[0]?arguments[0]:!0},log_all:function(a,b){"use strict";if("object"==typeof window.console||/MSIE (\d+\.\d+);/.test(navigator.userAgent)){if("event"===b.type)return console.log("ud.saas.log_all()",b);"heartbeat"===b.type}return!1}};