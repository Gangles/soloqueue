try {
  version.extensions['randomnumber'] = { major:1, minor:0, revision:0 };
  macros['randomnumber'] = {
    handler: function(place, macroName, params, parser) {
		if (params[0] === undefined) params[0] = 0;
		if (params[1] === undefined) params[1] = 1;
		var n = Math.round(Math.random()*params[1] + params[0]);
		insertText(place, n);
    },
  };
} catch(e) {
  throwError(place,"randomnumber error: "+e.message); 
}