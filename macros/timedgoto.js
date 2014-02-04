// Timed Goto macro by Leon Arnott
// http://www.glorioustrainwrecks.com/node/5108
version.extensions.timedgotoMacro = { major:1, minor:2, revision:0 };
macros["goto"] = macros.timedgoto = {
	timer: null,
	handler: function(a, b, c, d) {
		function cssTimeUnit(s) {
			if (typeof s == "string") {
				if (s.slice(-2).toLowerCase() == "ms") {
					return +(s.slice(0, -2)) || 0
				} else {
					if (s.slice(-1).toLowerCase() == "s") {
						return +(s.slice(0, -1)) * 1000 || 0
					}
				}
			}
			throwError(a, s + " isn't a CSS time unit");
			return 0
		}
		var t, d, m, s;
		t = c[c.length - 1];
		d = d.fullArgs();
		m = 0;
		if (b != "goto") {
			d = d.slice(0, d.lastIndexOf(t));
			m = cssTimeUnit(t)
		}
		d = eval(Wikifier.parse(d));
		if (d + "" && state && state.init) {
			if (macros["goto"].timer) {
				clearTimeout(macros["goto"].timer)
			}
			s = state.history[0].passage.title;
			macros["goto"].timer = setTimeout(function() {
				if (state.history[0].passage.title == s) {
					state.display(d, a)
				}
			}, m)
		}
	}
};
