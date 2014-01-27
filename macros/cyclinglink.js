// Cycling Link macro by Leon Arnott
// http://www.glorioustrainwrecks.com/node/5020
version.extensions['randomnumber'] = { major:3, minor:3, revision:0 };
macros.cyclinglink = {
	handler: function(a, b, c) {
		var rl = "cyclingLink";

		function toggleText(w) {
			w.classList.remove("cyclingLinkInit");
			w.classList.toggle(rl + "Enabled");
			w.classList.toggle(rl + "Disabled");
			w.style.display = ((w.style.display == "none") ? "inline" : "none")
		}
		switch (c[c.length - 1]) {
			case "end":
				var end = true;
				c.pop();
				break;
			case "out":
				var out = true;
				c.pop();
				break
		}
		var v = "";
		if (c.length && c[0][0] == "$") {
			v = c[0].slice(1);
			c.shift()
		}
		var h = state.history[0].variables;
		if (out && h[v] === "") {
			return
		}
		var l = Wikifier.createInternalLink(a, null);
		l.className = "internalLink cyclingLink";
		l.setAttribute("data-cycle", 0);
		for (var i = 0; i < c.length; i++) {
			var on = (i == Math.max(c.indexOf(h[v]), 0));
			var d = insertElement(null, "span", null, "cyclingLinkInit cyclingLink" + ((on) ? "En" : "Dis") + "abled");
			if (on) {
				h[v] = c[i];
				l.setAttribute("data-cycle", i)
			} else {
				d.style.display = "none"
			}
			insertText(d, c[i]);
			if (on && end && i == c.length - 1) {
				l.parentNode.replaceChild(d, l)
			} else {
				l.appendChild(d)
			}
		}
		l.onclick = function() {
			var t = this.childNodes;
			var u = this.getAttribute("data-cycle") - 0;
			var m = t.length;
			toggleText(t[u]);
			u = (u + 1);
			if (!(out && u == m)) {
				u %= m;
				if (v) {
					h[v] = c[u]
				}
			} else {
				h[v] = ""
			} if ((end || out) && u == m - (end ? 1 : 0)) {
				if (end) {
					var n = this.removeChild(t[u]);
					n.className = rl + "End";
					n.style.display = "inline";
					this.parentNode.replaceChild(n, this)
				} else {
					this.parentNode.removeChild(this);
					return
				}
				return
			}
			toggleText(t[u]);
			this.setAttribute("data-cycle", u)
		}
	}
};
