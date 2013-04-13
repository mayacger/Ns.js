(function(global, undefined){
    "use strict";
    var _VERSION = '0.0.1',
        _ua = navigator.userAgent.toLowerCase(),
        _IE = _ua.indexOf('msie') > -1 && _ua.indexOf('opera') == -1,
        _matches = /(?:msie|firefox|webkit|opera)[\/:\s](\d+)/.exec(_ua),
        _V = _matches ? _matches[1] : '0',
        doc = global.document,
        body = doc.body,
        proto_ary = Array.prototype,
    	slice = proto_ary.slice,
    	push = proto_ary.push,
        rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/;
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
     * 转为数组
     * @param obj
     * @returns {Array}
     * @private
     */
    var _makeArray = function(){
    	return Array.prototype.slice.call(arguments, 0);
    }
    try{
    	Array.prototype.slice.call(document.documentElement.childNodes, 0)[0].nodeType;
    }catch(e){
        _makeArray = function(obj){
    		var res = [];
    		for(var i = 0, len = obj.length; i < len; i++){
    			res.push(obj[i]);
    		}
    		return res;
    	}
    }
    /**
     * class
     * @param all
     * @param attr
     * @param val
     * @returns {Array}
     */
    function _filter(all,attr,val){
        var reg = RegExp('(?:^|\\s+)' + val + '(?:\\s+|$)');
        function test(node) {
            var v = attr == 'className' ? node.className : node.getAttribute(attr);
            if(v) {
                if(val) {
                    if(reg.test(v))
                        return true;
                } else {
                    return true;
                }
            }
            return false;
        }
        var i = -1,
            el,
            r = -1,
            res = [];
        while((el = all[++i])) {
            if(test(el)){
            res[++r] = el;
            }
        }
        return res;
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
        if(typeof  key === 'object'){
            _each(key, function(k ,v){
                _setAttr(el, k ,v);
            });
            return;
        }
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
    function _setCss(el, key, val){
        if(typeof  key === 'object'){
            _each(key, function(k ,v){
                _setCss(el, k ,v);
            });
            return;
        }
        el.style[key] = val;
    }
    function _getStyle(obj, attr) {
        if(obj.currentStyle) {
            return obj.currentStyle[attr];//兼容IE浏览器
        } else {
            return getComputedStyle(obj, false)[attr];//兼容firefox chrome
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
    //基础类
    var NS = function(expr, root){
        return new NS.fn.init(expr, root);
    }
    //定义prototype别名
    NS.fn = NS.prototype = {
        NS: _VERSION,
        constructor: NS,
        init: function(expr, context){
            var regId = /^#[\w\-]+/,
                regCls = /^([\w\-]+)?\.([\w\-]+)/,
                regTag = /^([\w\*]+)$/,
                regNodeAttr = /^([\w\-]+)?\[([\w]+)(=(\w+))?\]/,
                //开头以#或者数字字符组成
                simple = /^[\w\-#]+$/.test(expr);
            //如果没有传入context就使用document
            context = context || doc;
            //下面逻辑需要
            typeof context === 'string' ? doc.getElementById(context.substring(1,context.length)) : context;
            //如果什么都没有传入直接返回
            if(!expr){
                return this;
            }
            //N('body/div/...') or N(window)
            if(expr.nodeType || expr == window){
                this[0] = expr;
                this.length = 1;
                return this;
            }
            //如果支持querySelectorAll
            if(!simple && context.querySelectorAll){
                if(context.nodeType === 1){
                    var old = context.id,
                        id = context.id = 'NS';
                    try{
                        return this._toSelf(context.querySelectorAll('#' + id + " " + expr));
                    } catch(e){

                    }finally{
                        old ? context.id = old : context.removeAttribute('id');
                    }
                    this._toSelf(context.querySelectorAll(expr));
                    return this;
                }
            }
            //N('#id')
            if(regId.test(expr)){
                this[0] = doc.getElementById(expr.substr(1, expr.length));
                this.length = 1;
                return this;
            }
            //N('div.class')
            if(regCls.test(expr)){
                var ary = expr.split('.'),
                    all = context.getElementsByTagName(ary[0] || '*');
                this._toSelf(_filter(all,'className',ary[1]));
                return this;
            }
            //N('div')
            if(regTag.test((expr))){
                this._toSelf(context.getElementsByTagName(expr));
                return this;
            }
            //N('input[type=text]')
            if(regNodeAttr.test((expr))){
                var arr = regNodeAttr.exec(expr),
                    all = context.getElementsByTagName(arr[1] || '*');
                this._toSelf(_filter(all, arr[2], arr[4]));
                return this;
            }
        },
        length: 0,
        _toSelf: function(els){
            push.apply(this, _makeArray(els));
        },
        each: function(fn){
            return NS.each(this, fn);
        }
    };
    NS.fn.init.prototype = NS.fn;
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
    NS.extend = NS.fn.extend = function(){
        if(arguments.length == 1){
                for(var i in arguments[0]){
                    NS.prototype[i] = arguments[0][i];
                }
        }
        if(arguments.length == 2){
            NS.prototype[arguments[0]] = arguments[1];
        }
    };
    /**
     * 基础方法
     */
    NS.extend({
        /**
         * 遍历
         * @param obj
         * @param fn
         * @returns {Object}
         */
        each: function(obj, fn){
            if(!obj || typeof fn != 'function'){
                return;
            }
            var name, i = 0, len = obj.length;
            if('length' in obj){
                for(var val = obj[0]; i < len && fn.call(val, val, i) !== false; val = obj[++i]){
                }
            }else{
                for(name in obj){
                    if(fn.call(obj[name], obj[name], name) === false){
                        break;
                    }
                }
            }
            return obj;
        },
        size: function(){
           return this.length;
        },
        /**
         * Dom方法
         * @param value
         * @returns {this}
         */
        html: function(value){
            var self = this[0];
            if(value === undefined){
                if(self.length < 1){
                    return '';
                }
                return self.innerHTML;
            }
            this.each(this,function(){
                this.innerHTML = value;
            });
            return this;
        },
        attr: function(key, val){
            var self = this[0];
            if (key === undefined) {
                return self;
            }
            if (val === undefined && typeof key != 'object') {
                val = self.length < 1 ? null : _getAttr(self, key);
                return val === null ? '' : val;
            }
            this.each(this, function() {
                _setAttr(this, key, val);
            });
            return _this;
        },
        css: function(key, val){
            var self = this[0];
            if(val === undefined && typeof key === 'object'){
                return _getStyle(self, key);
            }
            this.each(this, function() {
                _setCss(this, key, val);
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
            var self = this[0];
            if(self.length < 1){
                return false;
            }
            return _hasClass(self[0], cls);
        },
        bind: function( eventType, callback){
            this.each(this[0], function(){
               _bind(this, eventType, callback);
            });
        },
        unbind: function(eventType, callback){
            this.each(this[0], function(){
                _unbind(this, eventType, callback);
            })
        },
        isArray: _isArray,
        isFunction: _isFunction
    });
    /**
     * 向外传递接口
     * @type {Function}
     */
    global.N = global.NS = NS;
    /**
     * add AMD module
     */
    if ( typeof define === "function" && define.amd && define.amd.NS ) {
    	define( "NS", [], function () { return NS; } );
    }
}(this));
