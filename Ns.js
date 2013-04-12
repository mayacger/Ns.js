(function(global, undefined){
    "use strict";
    var _VERSION = '0.0.1',
        _ua = navigator.userAgent.toLowerCase(),
        _IE = _ua.indexOf('msie') > -1 && _ua.indexOf('opera') == -1,
        _matches = /(?:msie|firefox|webkit|opera)[\/:\s](\d+)/.exec(_ua),
        _V = _matches ? _matches[1] : '0',
        doc = global.document,
        body = doc.body,
        rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/;
    //基础类
    var Ns = function(expr, root){
        return new Ns.fn.init(expr, root);
    }

    /**
     * 数组判断
     * @param val
     * @returns {boolean}
     * @private
     */
    function _isArray(val) {
    	if (!val) {
    		return false;
    	}
    	return Object.prototype.toString.call(val) === '[object Array]';
    }

    /**
     * 函数判断
     * @param val
     * @returns {boolean}
     * @private
     */
    function _isFunction(val) {
    	if (!val) {
    		return false;
    	}
    	return Object.prototype.toString.call(val) === '[object Function]';
    }
    function _inArray(val, arr) {
    	for (var i = 0, len = arr.length; i < len; i++) {
    		if (val === arr[i]) {
    			return i;
    		}
    	}
    	return -1;
    }
    function _each(obj, fn) {
    	if (_isArray(obj)) {
    		for (var i = 0, len = obj.length; i < len; i++) {
    			if (fn.call(obj[i], i, obj[i]) === false) {
    				break;
    			}
    		}
    	} else {
    		for (var key in obj) {
    			if (obj.hasOwnProperty(key)) {
    				if (fn.call(obj[key], key, obj[key]) === false) {
    					break;
    				}
    			}
    		}
    	}
    }

    /**
     * 私有属性操作
     * @param el
     * @param val
     * @returns {string}
     * @private
     */
    function _getAttr(el, val){
        return el.getAttribute(val);
    }
    function _setAttr(el, key, val){
        if (_IE && _V < 8 && key.toLowerCase() == 'class') {
            key = 'className';
        }
        el.setAttribute(key, '' + val);
    }
    function _removeAttr(el, key) {
    	if (_IE && _V < 8 && key.toLowerCase() == 'class') {
    		key = 'className';
    	}
    	_setAttr(el, key, '');
    	el.removeAttribute(key);
    }

    /**
     * 是否含有class
     * @private
     */
    function _hasClass(el, cls){
        var result = _getElementsByClassName(el.parentNode, cls).length;
        return (result > 0 ? true : false);
    }
    function _getElementsByClassName(el, cls){
        if(el.getElementsByClassName){
            return el.getElementsByClassName(cls);
        }else{
            var result = [];
            var elems = el.getElementsByTagName('*');
            for(var i = 0, len = elems.length; i < len; i++){
                if(elems[i].className.indexOf(cls) != -1){
                    result[result.length] = elems;
                }
            }
            return result;
        }
    }
    function _bind(elem, eventType, callback){
        // 转为小写
        eventType = eventType.toLowerCase();

        if(elem.addEventListener){
            elem.addEventListener(eventType, callback, false);
        }else if(elem.attachEvent){
            elem.attachEvent('on' + eventType, callback);
        };
    }
    function _unbind(elem, eventType, callback){
        // 转为小写
        eventType = eventType.toLowerCase();

        if ( elem.detachEvent ) {
            elem.detachEvent("on" + eventType, callback);
        } else{
            elem.removeEventListener(elem, eventType, callback);
        };
    }
    /**
     * 向外传递接口
     * @type {Function}
     */
    global.N = global.ns = Ns;

    //定义prototype别名
    Ns.fn = Ns.prototype = {
        constructor: Ns,
        init: function(expr, root){
            var elem=[],
                match,
                m,
                nodetype;
            root = root || doc;
            //N('');
            if(!expr){
                return this;
            }
            //html字符串检测
            if(typeof expr === 'string'){
                if(match = rquickExpr.exec(expr)){
                    if(m = match[1]){//N(id);
                        elem.push(root.getElementById( m ));
                    }else if(match[2]){//N(tag);
                        elem = root.getElementsByTagName( expr )
                    }else if((m = match[3])){//$(class);
                        elem = _getElementsByClassName(root, m);
                    }
                }
            }else{
                if(typeof expr === "object"){
                    elem.push(expr);
                }
            }
            this.expr = this[0] = elem;
            return this;
        },
        /**
         *
         * @param fn
         */
        each: function(fn){
            var self = this.expr;
            for(var i = 0; i < self.length; i++){
                if(fn.call(self[i], i, self[i]) == false){
                    return self;
                }
            }
            return this;
        },
        /**
         * Dom方法
         * @param value
         * @returns {*}
         */
        html: function(value){
            var self = this.expr;
            if(value === undefined){
                if(self.length < 1){
                    return '';
                }
                return self[0].innerHTML;
            }
            this.each(function(){
                this.innerHTML = value;
            });
            return this;
        },
        attr: function(key, val){
            var self = this.expr;
            if (key === undefined) {
                return self;
            }
            if (typeof key === 'object') {
                _each(key, function(k, v) {
                    self.attr(k, v);
                });
                return self;
            }
            if (val === undefined) {
                val = self.length < 1 ? null : _getAttr(self[0], key);
                return val === null ? '' : val;
            }
            this.each(function() {
                _setAttr(this, key, val);
            });
            return this;
        },
        /*
        *如果是无参调用 .hasClass()
        *@return className属性值
        *-----------------------------------
        *如果是.hasClass(v)
        *@param v className,
        *@return 判断DOM element是否含有名为
        *@param v的className属性
        */
        hasClass: function(cls){
            var self = this.expr;
            if(self.length < 1){
                return false;
            }
            return _hasClass(self[0], cls);
        },
        bind: function( eventType, callback){
            this.each(function(){
               _bind(this, eventType, callback);
            });
        },
        unbind: function(eventType, callback){
            this.each(function(){
                _unbind(this, eventType, callback);
            })
        }
    };
    Ns.fn.init.prototype = Ns.fn;
    /**
     * 拓展ns
     *如果是一个参数 .extend(obj)
     *@param obj 封装好将要扩展的属性或方法集合
     *------------------------------------------
     *如果是二个参数 .extend(str,v)
     *@param str 扩展的属性名
     *@param v 扩展的属性名@param str的值或方法
     *
     *如果自定义的属性和_T中的属性重名 不会覆盖原有属性
     */
    Ns.extend = Ns.fn.extend = function(){
        if(arguments.length == 1){
                for(var i in arguments[0]){
                        Ns.prototype[i] = arguments[0][i];
                }
        }
        if(arguments.length == 2){
                Ns.prototype[arguments[0]] = arguments[1];
        }
    }
}(this));
