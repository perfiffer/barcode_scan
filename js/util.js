var util = {
		/**
		 * 必填参数:url  其他均为可选
		 */
		doAjax : function(url,successCallback,data,sync,errorCallback,timeouter,datatype) {
			if((successCallback && typeof successCallback != "function") || (errorCallback && typeof errorCallback != "function") ) {
				throw new Error("ajax回调函数错误，请检查！");
			}
			var type = data ? 'post' : 'get';
			$.ajax({ 
				 type: type, 
				 contentType: "application/json;charset=utf-8",
				 timeout:timeouter||30000,
				 async: sync=="false" ? false : true,
				 url: url, 
				 data: data, 	
				 dataType: datatype||'json', 
				 success: function (json, status, xhr) {
					 util.removeMask();
					 if(successCallback) successCallback(json);
		  		 },
		  		 error : function(request) {
	  				try {
						if(request.status == 404) {
							alert("请求的服务不存在！");
						} else if(request.status == 500) {
							alert("系统内部错误，请将下面详细信息截图，联系并发送系统管理员!" + "\r\n" + request.responseText);
						} else if(request.status == 518){
							//alert("会话超时，请重新登录！");
							location.href = "/scene/login.html";
						} else if(request.status == 0) {
							alert("请求超时，服务端长时间没有响应！");
						} else if(request.status == 502){
							location.href = "/scene/login.html";
						} else {
							alert("系统发生未知错误！");
						}
						if(errorCallback) errorCallback();
					} catch (e) {
						// alert('系统发生未知错误！');
					} finally {
						//关闭蒙板
						util.removeMask();
					}
	  			}
			});
		},
		/**
		 * 去掉null 和 undefined字符串
		 */
		changeNull2Empty : function(v) {
			if(!v || typeof v == 'undefined' || v == 'null') return '';
			else return v;
		},
		/**
		 * 去掉空格\n\t
		 */
		trim : function(str,isGlobal) {
			if(!str) return "";
			if(isGlobal) return str.replace(/\s/g,"");
			return str.replace(/(^\s*)|(\s*$)/g, "");
		},
		/**
		 * 根据参数名称获取值
		 */
		getParamByName : function(paramName){
			var query = location.search.substring(1);
			var result = "";
			if(query){
				var arQuery = query.split("&");
				for(var i=0;i<arQuery.length;i++){
					var pos = arQuery[i].indexOf("=");
					var qName = arQuery[i].substring(0,pos);
					var qValue = arQuery[i].substring(pos+1);
					if(qName == paramName){
						result = qValue;
						break;
					}
				}
			}
			return result;
		},
	    /**
	     * 将json格式对象转换成字符串
	     */
	    jsonToString: function(obj){
	        var THIS = this;
	        switch(typeof(obj)){
	            case 'string':
	                return '"' + obj.replace(/(["\\])/g, '\\$1') + '"';
	            case 'array':
	                return '[' + obj.map(THIS.jsonToString).join(',') + ']';
	            case 'object':
	                if(obj instanceof Array){
	                    var strArr = [];
	                    var len = obj.length;
	                    for(var i=0; i<len; i++){
	                        strArr.push(THIS.jsonToString(obj[i]));
	                    }
	                    return '[' + strArr.join(',') + ']';
	                }else if(obj==null){
	                    return 'null';

	                }else{
	                    var string = [];
	                    for (var property in obj) string.push(THIS.jsonToString(property) + ':' + THIS.jsonToString(obj[property]));
	                    return '{' + string.join(',') + '}';
	                }
	            case 'number':
	                return obj;
	            case false:
	                return obj;
	        }
	    },

	    /**
	     * 将字符串转换成json格式
	     */
	    stringToJSON: function(obj){
	        obj = eval("(" + obj + ")");
	        return obj;
	    },

	    /**
	     * 将json对象中特殊字符串去掉
	     */
	    jsonFilter: function(obj_json){
	        obj_json = obj_json.replace(/\r\n|\n|\r|\t/g,'');
	        obj_json = obj_json.replace(/<\/?[^>]*>/g,'');
	        obj_json = obj_json.replace(/[ | ]*\n/g,'\n');
	        obj_json = obj_json.replace(/\n[\s| | ]*\r/g,'\n');
	        obj_json = obj_json.replace(/&nbsp;/ig,'');
	        obj_json = obj_json.replace(/&quot;/ig,'"');	
	        return obj_json;
	    },
	    /**
	     * 转义输入框的特殊字符
	     */
	    inputFilter: function(str) {
	    	str = str.replace(/&/g,'&amp;');
	    	str = str.replace(/\"/gi,'&quot;');
	    	str = str.replace(/>/g,'&gt;');
	    	str = str.replace(/</g,'&lt;');	
	    	str = str.replace(/ /g,'&nbsp;');
//	    	str = str.replace(/update+/g,'');
			return str;
	    },
	    /**
    	 * 将url中的特殊字符转义
    	 */
	    urlFilter: function(url) {
	    	url = url.replace(/%/g,'%25');
			url = url.replace(/\+/g,'%20');
	    	url = url.replace(/\//g,'%2F');
	    	url = url.replace(/\?/g,'%3F');
	    	url = url.replace(/#/g,'%23');
	    	url = url.replace(/&/g,'%26');
	    	return url;
	    },
	    /**
	     * 添加cookie
	     */
	    setCookie:function(name,value){
	        var exp  = new Date();  //获得当前时间  
	        exp.setTime(exp.getTime() + 365*24*60*60*1000);  //换成毫秒   cookie保留一年
	    	document.cookie = name + "="+ encodeURI (value) 
	    		+";expires=" + exp.toGMTString()+"path=/";
	    },
	    /**
	     * 添加cookie，保留多少分钟
	     */
	    addCookie:function(name, value, minute) {
	    	var exp = new Date();
	    	exp.setTime(exp.getTime() + 1000*60*minute);
	    	document.cookie = name + "=" + encodeURI(value) + ";expires=" + exp.toGMTString() + "path=/";
	    },
	    /**
	     * 获取cookie
	     */
	    getCookie:function(name){
			var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		    if(arr=document.cookie.match(reg))
		        return decodeURI(arr[2]);
		    else
		        return null;
		}, 
		/**
		 * 删除cookie
		 */
		delCookie : function(name) {
			var date = new Date();
			date.setTime(date.getTime() - 10000);
			document.cookie = name + "=a;path=/;expires=" + date.toGMTString();
		},
		/**
		 * 阻止事件冒泡
		 */
		stopEventBubble : function (event){
	        var e=event || window.event;
	        if (e && e.stopPropagation){
	            e.stopPropagation();    
	        }
	        else{
	            e.cancelBubble=true;
	        }
	    },
	    /**
	     * 滚动到顶部动画
	     */
	    backTop : function() {
	    	$('body,html').animate({ scrollTop: 0 }, 500);
//	    	window.scrollTo(0,0);
	    },
	    /**
	     * 删除转圈遮罩层
	     */
		removeMask : function() {
			//$(top.document.body).find('#loading').remove();
			$('#loading').remove();
		},
		/**
		 * 添加转圈遮罩层
		 */
		showMask : function()  {
			var html = '<div id="loading" style="position: fixed;'
						+'background: black url(images/loading.gif) no-repeat center center;'
						+'left: 0;top: 0;width: 100%;height: 100%;opacity: 0.8;z-index: 99999;">'
						+'</div>';
			$(top.document.body).append($(html));
//			$('body').append($(html));
		},
		/**限制输入为整数和小数**/
		onlyNumber : function(obj) {
			var t = obj.value.charAt(0);
			obj.value = obj.value.replace(/[^\d\.]/g, '');
			obj.value = obj.value.replace(/^\./g, '');
			obj.value = obj.value.replace(/\.{2, }/g, '.');
			obj.value = obj.value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
		}
};

