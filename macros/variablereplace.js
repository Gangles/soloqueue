try {
  version.extensions['macrodemoMacro'] = { 
    major:1, minor:0, revision:0 
  };
  macros['variablereplace'] = {
    handler: function(place, macroName, params, parser) {
		var element = document.getElementById("ally4");
		if(element != null)
		{
			element.innerHTML = state.history[0].variables['ally4'];
		}
    },
    init: function() { },
  };
} catch(e) {
  throwError(place,"macrodemo Setup Error: "+e.message); 
}