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
    global.Ns = new Ns();
}(this));

(function(Ns){
    var doc = window.document,
        body = doc.body;
    /**
     *  DomReay
     * @param  {Function} callback [加载完成执行]
     * @return {[type]}            [description]
     */
    Ns.include({
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
        }
    });
}(Ns));
