(function(global, undefined){
    //基础类
    var Ns = function(selector, context){
         //查询表达式必须为字符串，并且不能为空。
        if(typeof(selector)!=='string' || selector == '') return [];

        //使用空格分割，只处理第一个表达式
        var ss = selector.split(' ');

        //获取属性
        var attr = '';
        var s = ss[0].split(':')[0];
        if(s != ss[0])
            attr = ss[0].split(':')[1];

        var val = s.split('[')[0];
        if(val != s)
            val = s.split('[')[1].replace(/[",\]]/g,'');
        else
            val = '';
        s = s.split('[')[0];

        var obj = [];
        var sObj = null;
        //当父对象不存在时，使用document;
        context = context || document;
        switch(s.charAt(0)){
            case '#':
                //ID选择器
                sObj = document.getElementById(s.substr(1));
                if(sObj)obj.push(sObj);
                break;
            case '.':
                //类选择器
                var l = context.getElementsByTagName('*');
                var c = s.substr(1);
                for(var i=0; i<l.length; i++)
                if(l[i].className.search('\\b' + c + '\\b')!=-1)obj.push(l[i]);
                break;
            default:
                //根据tag获取元素
                obj = o.getElementsByTagName(s);
                break;
        }

        if(val){
            //[t=val]筛选属性匹配
            var l = [];
            var a = val.split('=');
            for(var i=0; i<obj.length; i++)
                if(a.length == 2 && obj[i][a[0]] == a[1]) l.push(obj[i]);
            obj = l;
        }

        if(attr){
            //: 筛选属性匹配
            var l = [];
            for(var i=0; i<obj.length; i++)
                if(obj[i][attr]) l.push(obj[i]);
            obj = l;
        }

        if(ss.length > 1){
            //递归处理表达式后续内容
            //父元素为已获取的所有元素
            var l = [];
            for(var i=0; i<obj.length; i++){
                var ll = arguments.callee(selector.substr(ss[0].length+1), obj[i]);
                if(ll.tagName) l.push(ll);
                else
                for(var j=0; j<ll.length; j++)l.push(ll[j]);
            }
            obj = l;
        }

        if(sObj && ss.length == 1){
            //当为ID选择器时，直接返回对象。
            obj=sObj;
            if(obj)obj.length = 1;
        } else {
            //去除数组中重复元素
            var l = [];
            for(var i=0; i<obj.length; i++)obj[i].$isAdd = false;
            for(var i=0; i<obj.length; i++){
                if(!obj[i].$isAdd){
                    obj[i].$isAdd = true;
                    l.push(obj[i]);
                }
            }
            obj = l;
        }
        this.el = obj;
        },
        doc = global.document,
        body = doc.body;

    //定义prototype别名
    Ns.fn = Ns.prototype = {
        /*
        *回调函数，用于处理所有方法中function类型的参数
        *@param obj 任何类型
        *@return 如果@param obj是一个函数类型的对象,则返回这个函数的返回值,如果是其他类型则直接返回@param obj
        */
        _preFormCallBack: function(obj){
            var _this = this;
            var ret = obj;
            if(typeof(obj) == "function"){
                ret = obj.call(_this.el,_this.el);
            }
            return ret;
        },
        /**
         * Dom方法
         * @param value
         * @returns {*}
         */
        html: function(value){
            if(value == undefined){
                    return this.el.innerHTML;
            }else{
                    var v = this._preFormCallBack(v);
                    this.el.innerHTML = value;
                    return this;
            }
        },
        attr: function(){
            if(arguments.length == 1){
                    return this.el.getAttribute(arguments[0]);
            }
            if(arguments.length == 2){
                    this.el.setAttribute(arguments[0],arguments[1]);
                    return this;
            }
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
        hasClass: function(v){
            if(v == undefined){
                    return this.el.className;
            }else{
                    if(this.el.className != undefined){
                            var classStr = " " + this.el.className + " ";
                            var rep = new RegExp(" " +v+ " ","gi");
                            return rep.test(classStr);
                    }else{
                            return false;
                    }
            }
        },
        bind: function( eventType, callback){
            elem = this.el || window;
            // 转为小写
            eventType = eventType.toLowerCase();

            if(elem.addEventListener){
                elem.addEventListener(eventType, callback, false);
            }else if(elem.attachEvent){
                elem.attachEvent('on' + eventType, callback);
            };
        },
        unbind: function(eventType, callback){
            elem = this.el;
            eventType = eventType.toLowerCase();

            if ( elem.detachEvent ) {
                elem.detachEvent("on" + eventType, callback);
            } else{
                elem.removeEventListener(elem, eventType, callback);
            };
        }
    };
    /**
     * 向外传递接口
     * @type {Function}
     */
    global.N = global.ns = function(selector, context){
        return new Ns(selector, context);
    }
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
    ns.extend = function(){
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
