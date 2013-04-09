(function(global, undefined){
    //基础类
    var Ns = function(){},
        doc = global.document,
        body = doc.body;

    //定义prototype别名
    Ns.fn = Ns.prototype;

    //给类添加属性
    Ns.fn.extend = function(obj){
        var extended = obj.extended;

        for(var i in obj){
            Ns[i] = obj[i];
        }

        if (extended) {
            extended(Ns);
        };
    }

    // 给实例添加属性
    Ns.fn.include = function(obj){
        var included = obj.included;

        for(var i in obj){
            Ns.fn[i] = obj[i];
        }

        if (included) {
            included(Ns);
        };

    }
    global.ns = new Ns();
}(this));
/**
 * DOM
 */
(function(ns){
    var doc = window.document,
        body = doc.body;
    ns.include({
        $: function(selector){
            switch(selector.charAt(0)){
                case "#":
                    var objStr = selector.substring(1,selector.length);
                    return doc.getElementById(objStr);
                break;
                case ".":

                break;
                default : 
            };
        }
    });
}(ns));
/**
 * 事件
 */
(function(ns){
    var doc = window.document,
        body = doc.body;
    ns.include({
        /**
        *  DomReay
        * @param  {Function} callback [加载完成执行]
        * @return {[type]}            [description]
        */
        onDomReady: function(callback){
            if (doc.addEventListener) {
                doc.addEventListener('DOMContentLoaded', callback, false);
            }else{
                if (body && body.lastChild) {
                    callback();
                }else{
                    return setTimeout(argument.callee, 0);
                }
            }
        },
        /**
         * 创建新的event命名空间
         * @type {Object}
         */
        Events:{
            bind: function(elem, eventType, callback){
                elem = elem || window;
                // 转为小写
                eventType = eventType.toLowerCase();

                if(elem.addEventListener){
                    elem.addEventListener(eventType, callback, false);
                }else if(elem.attachEvent){
                    elem.attachEvent('on' + eventType, callback);
                };  
            },
            unbind: function(elem, eventType, callback){

                eventType = eventType.toLowerCase();

                if ( elem.detachEvent ) {
                    elem.detachEvent("on" + eventType, callback);
                } else{
                    elem.removeEventListener(elem, eventType, callback);
                }; 
            }
        }
    });
}(ns));
/**
 * AJAX
 */
/**
 * 动画
 */
