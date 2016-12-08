if(typeof require === 'undefined' && typeof module === 'undefined' && typeof window !== 'undefined') {

	var require = function(module) {
		var libs = {}
		libs['react'] = 'React';
		libs['react-dom'] = 'ReactDOM';
		libs['redux'] = 'Redux';
		libs['react-redux'] = 'ReactRedux';
		libs['react-router'] = 'ReactRouter';
		libs['marked'] = 'marked';
		libs['./redux-store'] = 'store';
		libs['./routes'] = 'routes';
		libs['./index'] = 'Index'
		libs['./commentbox'] = 'CommentBox'
		if(module in libs && libs[module] in window) {
			return window[libs[module]]
		}
	}

	var module = {}
	Object.defineProperty(module, "exports", {
	  set: function (exported) {
			if(exported.prototype && exported.prototype.isReactComponent) {
				var displayName = exported.displayName;
				if('WrappedComponent' in exported) {
					displayName = exported.WrappedComponent.displayName;
				}
				window[displayName] = exported;
			} else {
				if('configureStore' in exported) {
					window['store'] = exported;
				}
				if('routes' in exported) {
					window['routes'] = exported;
				}
			}
		}
	});
}
