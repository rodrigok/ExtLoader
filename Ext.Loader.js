/*
arrumar erros
prop mostrar erros?
*/
Ext.Loader = function(conf){
	this.version = '0.0.6';
	this.conf = {
		method      : 'POST', //[POST,GET]
		proxy       : 'SCRIPTTAG', //[AJAX,SCRIPTTAG]
		cache       : false,
		basePath    : '',
		serverLoader: false,
		modReWrite  : false,
		fileParam   : 'file',
		baseParams  : {}
	};
	this.addEvents(
		'beforeload',
		'afterload',
		'beforerequest',
		'afterrequest'
	);
	this.on('beforeload', this._onBeforeLoad);
	this.on('afterload', this._onAfterLoad);
	Ext.apply(this.conf, conf);
}
Ext.extend(Ext.Loader, Ext.util.Observable, {
	baseTag   : Ext.select('head').elements[0],
	cacheFiles: {},
	tags: {
		js: {
			AJAX: {
				tag: 'script',
				attributes: {
					type   : 'text/javascript', 
					charset: 'utf-8'
				}
			},
			SCRIPTTAG: {
				tag: 'script',
				src: 'src',
				attributes: {
					type   : 'text/javascript', 
					charset: 'utf-8'
				}
			},
			onLoad   : true
		},
		css: {
			AJAX: {
				tag: 'style',
				attributes: {
					type   : 'text/css', 
					charset: 'utf-8'
				}
			},
			SCRIPTTAG: {
				tag: 'link',
				src: 'href',
				attributes: {
					rel    : 'stylesheet',
					type   : 'text/css', 
					charset: 'utf-8'
				}
			}
		}
	},
	errors: {
		unknowproxy: 'Proxy {1} inexistente'
	},
	file: function(file, callback, scope, conf){
		this.request(this.adjustConf(file, callback, scope, conf));
	},
	theme: function(file, callback, scope, conf){
		var cfg = {
			proxy: 'SCRIPTTAG',
			serverLoader: false
		}
		Ext.applyIf(cfg, conf);
		this.file(file, callback, scope, cfg);
	},
	module: function(module, callback, scope, conf){
		module = [].concat(module);
		var files = [];
		Ext.each(module, function(item){
			files.push(item+'.js');
			files.push(item+'.css');
		});
		this.file(files, callback, scope, conf);
	},
	removeModule: function(mod){
		delete this.cacheFiles[mod+'.js'];
		delete this.cacheFiles[mod+'.css'];
	},
	adjustConf: function(file, callback, scope, conf){
		var obj = {};
		obj.items = [].concat(file);
		obj.totalCount = obj.items.length;
		obj.totalLoaded = 0;
		Ext.each(obj.items, function(item, index){
			if(!Ext.isObject(item)){
				item = {file:item}
			}
			Ext.applyIf(item, {
				id      : item.file,
				callback: callback,
				scope   : scope
			})
			Ext.applyIf(item, conf);
			item.params = Ext.apply({}, item.params, this.conf.baseParams);
			Ext.applyIf(item, this.conf);
			var tag = this.tags[item.file.split('.').pop()]
			Ext.applyIf(item, {
				tag   : tag[item.proxy],
				onLoad: tag.onLoad
			})
			obj.items[index] = item;
		},this)
		return obj;
	},
	request: function(obj){
		Ext.each(obj.items, function(item){
			if((this.fireEvent('beforerequest', item))&&(item.cache)&&(this.cacheFiles[item.id])){
				this.fireEvent('afterload', obj, item, this.cacheFiles[item.id], true);
			}else{
				var fn = this.requestFn[item.proxy];
				if(fn){
					fn.call(this, item, obj);
				}else{
					this.error('unknowproxy', item.proxy);
				}
			}
			this.fireEvent('afterrequest', item)
		},this)
	},
	_onAfterLoad: function(obj, item, el, cache){
		this.cacheFiles[item.id] = el;
		obj.totalLoaded++;
		if((!cache)&&(Ext.isFunction(item.progress))){
			item.progress.call(item.scope||this, obj.totalLoaded, obj.totalCount, obj, item, el);
		}
		if((obj.totalLoaded === obj.totalCount)&&(Ext.isFunction(item.callback))){
			item.callback.call(item.scope||this, obj, item, el, cache);
		}
	},
	_onBeforeLoad: function(obj, item){
		if(this.cacheFiles[item.id]){
			this.baseTag.removeChild(this.cacheFiles[item.id])
		}
	},
	requestFn: {
		AJAX: function(item, obj){
			if(item.tag){
				var url = item.file;
				if(item.serverLoader){
					 url = item.serverLoader;
					 item.params[item.fileParam] = item.file;
				}
				url = item.basePath + url;
				Ext.Ajax.request({
					url: item.basePath + (item.serverLoader || item.file),
					scope: this,
					params: item.params,
					method: item.method,
					success: function(response){
						this.fireEvent('beforeload', obj, item);
						var el = document.createElement(item.tag.tag);
						Ext.iterate(item.tag.attributes, function(key, value){
							el.setAttribute(key,value);
						})
						el.setAttribute('id',item.id);
						this.baseTag.appendChild(el);
						el.text = response.responseText;
						this.fireEvent('afterload', obj, item, el, false);
					}
				})
			}
		},
		SCRIPTTAG: function(item, obj){
			if(item.tag){
				this.fireEvent('beforeload', obj, item);
				var el = document.createElement(item.tag.tag);
				Ext.iterate(item.tag.attributes, function(key, value){
					el.setAttribute(key,value);
				})
				el.setAttribute('id',item.id);
				var url = item.basePath+item.file;
				if(item.serverLoader){
					 url = item.serverLoader;
					 item.params[item.fileParam] = item.basePath+item.file;
				}
				item.params._dc = new Date().getTime();
				if(item.modReWrite){
					var params = [];
					Ext.iterate(item.params, function(key, value){
						params.push(value);
					})
					url = url + '/' + params.join('/');
				}else{
					url = Ext.urlAppend(url, Ext.urlEncode(item.params));
				}
				
				el.setAttribute(item.tag.src, url);
				this.baseTag.appendChild(el);
				if(!item.onLoad){
					this.fireEvent('afterload', obj, item, el, false);
				}else if(el.readyState){
	                el.onreadystatechange = function(){
	                    if (/loaded|complete|4/i.test(el.readyState+"")){
	                    	this.fireEvent('afterload', obj, item, el, false);
                        	el.onreadystatechange = null;
	                    }
	                }.createDelegate(this);
	            }else{
	                el.onload = function(){
	                	this.fireEvent('afterload', obj, item, el, false);
                    	el.onload = null;
	                }.createDelegate(this);
	            }
			}
		}
	},
	error: function(er){
		var msg = new Ext.Template(this.errors[er]).apply(arguments);
		if(console&&console.error){
			console.error(msg)	
		}else{
			alert(msg);
		}
	}
});

Ext.Load = new Ext.Loader();
Ext.LoadIf = new Ext.Loader({cache:true});