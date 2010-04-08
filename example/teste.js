Ext.ns('app');
app.x = (app.x - 10) || 500;
Ext.Load.file(['form.js', 'title.js'], function(){
	app.win = new Ext.Window({
		height: app.x,
		width: app.x,
		title: app.title/*$CREDITOS$*/,//'Nova Janela',
		closeAction: 'hide',
		layout: 'fit',
		items: app.form
	});
	app.win.show();
},this)