Ext.onReady(function(){
	var tbar = new Ext.Toolbar({
		renderTo:Ext.getBody(),
		items:[{
			text:'Load teste (Icone de Carregando)',
			iconCls: 'x-tbar-page-next',
			handler: function(){
				this.oldIconCls = this.iconCls;
				this.setIconClass('loading-icon');
				this.disable();
				Ext.Load.file('teste.js', function(obj, item, el, cache){
					if(cache){
						app.win.show();
					}
					this.setIconClass(this.oldIconCls);
					this.enable();
				}, this)
			}
		},'-',{
			text:'JS com SCRIPTTAG',
			menu: [{
				text:'Load teste',
				handler: function(){
					Ext.Load.file('teste.js', function(obj, item, el, cache){
						if(cache){
							app.win.show();
						}
					}, this)
				}
			},{
				text:'LoadIf teste',
				handler: function(){
					Ext.LoadIf.file('teste.js', function(obj, item, el, cache){
						if(cache){
							app.win.show();
						}
					},this)
				}
			}]
		},'-',{
			text:'JS com AJAX',
			menu: [{
				text:'Load teste',
				handler: function(){
					Ext.Load.file('teste.js', function(obj, item, el, cache){
						if(cache){
							app.win.show();
						}
					}, this, {
						proxy: 'AJAX'
					})
				}
			},{
				text:'LoadIf teste',
				handler: function(){
					Ext.LoadIf.file('teste.js', function(obj, item, el, cache){
						if(cache){
							app.win.show();
						}
					},this, {
						proxy: 'AJAX'
					})
				}
			}]
		},'-',{
			text:'JS com SCRIPTTAG + serverLoader',
			menu: [{
				text:'Load teste',
				handler: function(){
					Ext.Load.file('teste.js', function(obj, item, el, cache){
						if(cache){
							app.win.show();
						}
					}, this, {
						serverLoader: 'handler.php'
					})
				}
			},{
				text:'LoadIf teste',
				handler: function(){
					Ext.LoadIf.file('teste.js', function(obj, item, el, cache){
						if(cache){
							app.win.show();
						}
					},this, {
						serverLoader: 'handler.php'
					})
				}
			}]
		},'-',{
			text:'JS com AJAX + serverLoader',
			menu: [{
				text:'Load teste',
				handler: function(){
					Ext.Load.file('teste.js', function(obj, item, el, cache){
						if(cache){
							app.win.show();
						}
					}, this, {
						proxy: 'AJAX',
						serverLoader: 'loadFile'
					})
				}
			},{
				text:'LoadIf teste',
				handler: function(){
					Ext.LoadIf.file('teste.js', function(obj, item, el, cache){
						if(cache){
							app.win.show();
						}
					},this, {
						proxy: 'AJAX',
						serverLoader: 'handler.php'
					})
				}
			}]//serverLoader: 'handler.php',
		},'-',{
			text:'Temas (Load)',
			menu: [{
				text:'Gray',
				handler: function(){
					Ext.Load.theme({file:'../../resources/css/xtheme-gray.css', id: 'theme'})
				}
			},{
				text:'Blue',
				handler: function(){
					Ext.Load.theme({file:'../../resources/css/xtheme-blue.css', id: 'theme'})
				}
			},{
				text:'Access',
				handler: function(){
					Ext.Load.theme({file:'../../resources/css/xtheme-access.css', id: 'theme'})
				}
			}]
		}]
	})
});