// Combined Replace Macro Set by Leon Arnott
// http://www.glorioustrainwrecks.com/node/5462
(function() {
	version.extensions.replaceMacrosCombined = {
		major: 1,
		minor: 1,
		revision: 2
	};
	var nullobj = {
		handler: function() {}
	};

	function showVer(n, notrans) {
		if (!n) {
			return
		}
		n.innerHTML = "";
		new Wikifier(n, n.tweecode);
		n.setAttribute("data-enabled", "true");
		n.style.display = "inline";
		n.classList.remove("revision-span-out");
		if (!notrans) {
			n.classList.add("revision-span-in");
			if (n.timeout) {
				clearTimeout(n.timeout)
			}
			n.timeout = setTimeout(function() {
				n.classList.remove("revision-span-in");
				n = null
			}, 1)
		}
	}

	function hideVer(n, notrans) {
		if (!n) {
			return
		}
		n.setAttribute("data-enabled", "false");
		n.classList.remove("revision-span-in");
		if (n.timeout) {
			clearTimeout(n.timeout)
		}
		if (!notrans) {
			n.classList.add("revision-span-out");
			n.timeout = setTimeout(function() {
				if (n.getAttribute("data-enabled") == "false") {
					n.classList.remove("revision-span-out");
					n.style.display = "none";
					n.innerHTML = ""
				}
				n = null
			}, 1000)
		} else {
			n.style.display = "none";
			n.innerHTML = "";
			n = null
		}
	}

	function tagcontents(b, starttags, desttags, endtags, k) {
		var l = 0,
			c = "",
			tg, a, i;

		function tagfound(i, e) {
			for (var j = 0; j < e.length; j++) {
				if (a.indexOf("<<" + e[j], i) == i) {
					return e[j]
				}
			}
		}
		a = b.source.slice(k);
		for (i = 0; i < a.length; i++) {
			if (tg = tagfound(i, starttags)) {
				l++
			} else {
				if ((tg = tagfound(i, desttags)) && l == 0) {
					b.nextMatch = k + i + tg.length + 4;
					return [c, tg]
				} else {
					if (tg = tagfound(i, endtags)) {
						l--;
						if (l < 0) {
							return null
						}
					}
				}
			}
			c += a.charAt(i)
		}
		return null
	}
	var begintags = [];
	var endtags = [];

	function revisionSpanHandler(g, e, f, b) {
		var k = b.source.indexOf(">>", b.matchStart) + 2,
			vsns = [],
			vtype = e,
			flen = f.length,
			becomes, c, cn, m, h, vsn;

		function mkspan(vtype) {
			h = insertElement(m, "span", null, "revision-span " + vtype);
			h.setAttribute("data-enabled", false);
			h.style.display = "none";
			h.tweecode = "";
			return h
		}
		if (this.shorthand && flen) {
			while (f.length > 0) {
				vsns.push([f.shift(), (this.flavour == "insert" ? "gains" : "becomes")])
			}
		} else {
			if (this.flavour == "insert" || (this.flavour == "continue" && this.trigger == "time")) {
				vsns.push(["", "becomes"])
			}
		} if (this.flavour == "continue" && flen) {
			b.nextMatch = k + b.source.slice(k).length;
			vsns.push([b.source.slice(k), vtype])
		} else {
			becomes = ["becomes", "gains"];
			c = tagcontents(b, begintags, becomes.concat(endtags), endtags, k);
			if (c && endtags.indexOf(c[1]) == -1) {
				while (c) {
					vsns.push(c);
					c = tagcontents(b, begintags, becomes, endtags, b.nextMatch)
				}
				c = tagcontents(b, begintags, ["end" + e], endtags, b.nextMatch)
			}
			if (!c) {
				throwError(g, "can't find matching end" + e);
				return
			}
			vsns.push(c);
			if (this.flavour == "continue") {
				k = b.nextMatch;
				b.nextMatch = k + b.source.slice(k).length;
				vsns.push([b.source.slice(k), ""])
			}
		} if (this.flavour == "remove") {
			vsns.push(["", "becomes"])
		}
		cn = 0;
		m = insertElement(g, "span", null, e);
		m.setAttribute("data-flavour", this.flavour);
		h = mkspan("initial");
		vsn = vsns.shift();
		h.tweecode = vsn[0];
		showVer(h, true);
		while (vsns.length > 0) {
			if (vsn) {
				vtype = vsn[1]
			}
			vsn = vsns.shift();
			h = mkspan(vtype);
			h.tweecode = vsn[0]
		}
		if (typeof this.setup == "function") {
			this.setup(m, g, f)
		}
	}

	function quantity(m) {
		return (m.children.length - 1) + (m.getAttribute("data-flavour") == "remove")
	}

	function revisionSetup(m, g, f) {
		m.className += " " + f[0].replace(" ", "_")
	}

	function keySetup(m, g, f) {
		var fl = this.flavour,
			key = f[0];
		m.setEventListener("keydown", function l(e) {
			var done = !revise("revise", m);
			if (done) {
				m.removeEventListener("keydown", l)
			}
		})
	}

	function timeSetup(m, g, f) {
		function cssTimeUnit(s) {
			if (typeof s == "string") {
				if (s.slice(-2).toLowerCase() == "ms") {
					return Number(s.slice(0, -2)) || 0
				} else {
					if (s.slice(-1).toLowerCase() == "s") {
						return Number(s.slice(0, -1)) * 1000 || 0
					}
				}
			}
			throwError(g, s + " isn't a CSS time unit");
			return 0
		}
		var fl = this.flavour;
		var tm = cssTimeUnit(f[0]);
		setTimeout(function timefn() {
			var done = !revise("revise", m);
			if (!done) {
				setTimeout(timefn, tm)
			}
		}, tm)
	}

	function hoverSetup(m) {
		var fn, noMouseEnter = (document.head.onmouseenter !== null);
		m.onmouseenter = function() {
			revise("revise", this)
		};
		m.onmouseleave = function() {
			revise("revert", this)
		};
		if (noMouseEnter) {
			fn = function(n) {
				return function(e) {
					if (!event.relatedTarget || (event.relatedTarget != this && !(this.compareDocumentPosition(event.relatedTarget) & Node.DOCUMENT_POSITION_CONTAINED_BY))) {
						this[n]()
					}
				}
			};
			m.onmouseover = fn("onmouseenter");
			m.onmouseout = fn("onmouseleave")
		}
		m = null
	}

	function mouseSetup(m) {
		var fl = this.flavour,
			evt = (document.head.onmouseenter === null ? "onmouseenter" : "onmouseover");
		m[evt] = function() {
			var done = !revise("revise", this);
			if (done) {
				this[evt] = null
			}
		};
		m = null
	}

	function linkSetup(m, g, f) {
		var fl = this.flavour,
			l = Wikifier.createInternalLink(),
			p = m.parentNode;
		l.className = "internalLink replaceLink";
		p.insertBefore(l, m);
		l.insertBefore(m, null);
		l.onclick = function() {
			var p, done = false;
			if (m && m.parentNode == this) {
				done = !revise("revise", m);
				scrollWindowTo(m)
			}
			if (done) {
				this.parentNode.insertBefore(m, this);
				this.parentNode.removeChild(this)
			}
		};
		l = null
	}

	function visitedSetup(m, g, f) {
		var i, done, shv = state.history[0].variables,
			os = "once seen",
			d = (m.firstChild && (this.flavour == "insert" ? m.firstChild.nextSibling : m.firstChild).tweecode);
		shv[os] = shv[os] || {};
		if (d && !shv[os].hasOwnProperty(d)) {
			shv[os][d] = 1
		} else {
			for (i = shv[os][d]; i > 0 && !done; i--) {
				done = !revise("revise", m, true)
			}
			if (shv[os].hasOwnProperty(d)) {
				shv[os][d] += 1
			}
		}
	}[{
		name: "insert",
		flavour: "insert",
		trigger: "link",
		setup: linkSetup
	}, {
		name: "timedinsert",
		flavour: "insert",
		trigger: "time",
		setup: timeSetup
	}, {
		name: "insertion",
		flavour: "insert",
		trigger: "revisemacro",
		setup: revisionSetup
	}, {
		name: "later",
		flavour: "insert",
		trigger: "visited",
		setup: visitedSetup
	}, {
		name: "keyinsert",
		flavour: "insert",
		trigger: "key",
		setup: keySetup
	}, {
		name: "replace",
		flavour: "replace",
		trigger: "link",
		setup: linkSetup
	}, {
		name: "timedreplace",
		flavour: "replace",
		trigger: "time",
		setup: timeSetup
	}, {
		name: "mousereplace",
		flavour: "replace",
		trigger: "mouse",
		setup: mouseSetup
	}, {
		name: "hoverreplace",
		flavour: "replace",
		trigger: "hover",
		setup: hoverSetup
	}, {
		name: "revision",
		flavour: "replace",
		trigger: "revisemacro",
		setup: revisionSetup
	}, {
		name: "keyreplace",
		flavour: "replace",
		trigger: "key",
		setup: keySetup
	}, {
		name: "timedremove",
		flavour: "remove",
		trigger: "time",
		setup: timeSetup
	}, {
		name: "mouseremove",
		flavour: "remove",
		trigger: "mouse",
		setup: mouseSetup
	}, {
		name: "hoverremove",
		flavour: "remove",
		trigger: "hover",
		setup: hoverSetup
	}, {
		name: "removal",
		flavour: "remove",
		trigger: "revisemacro",
		setup: revisionSetup
	}, {
		name: "once",
		flavour: "remove",
		trigger: "visited",
		setup: visitedSetup
	}, {
		name: "keyremove",
		flavour: "remove",
		trigger: "key",
		setup: keySetup
	}, {
		name: "continue",
		flavour: "continue",
		trigger: "link",
		setup: linkSetup
	}, {
		name: "timedcontinue",
		flavour: "continue",
		trigger: "time",
		setup: timeSetup
	}, {
		name: "mousecontinue",
		flavour: "continue",
		trigger: "mouse",
		setup: mouseSetup
	}, {
		name: "keycontinue",
		flavour: "continue",
		trigger: "key",
		setup: keySetup
	}, {
		name: "cycle",
		flavour: "cycle",
		trigger: "revisemacro",
		setup: revisionSetup
	}, {
		name: "mousecycle",
		flavour: "cycle",
		trigger: "mouse",
		setup: mouseSetup
	}, {
		name: "timedcycle",
		flavour: "cycle",
		trigger: "time",
		setup: timeSetup
	}, {
		name: "keycycle",
		flavour: "replace",
		trigger: "key",
		setup: keySetup
	}].forEach(function(e) {
		e.handler = revisionSpanHandler;
		e.shorthand = (["link", "mouse", "hover"].indexOf(e.trigger) > -1);
		macros[e.name] = e;
		macros["end" + e.name] = nullobj;
		begintags.push(e.name);
		endtags.push("end" + e.name)
	});

	function insideDepartingSpan(elem) {
		var r = elem.parentNode;
		while (!r.classList.contains("passage")) {
			if (r.classList.contains("revision-span-out")) {
				return true
			}
			r = r.parentNode
		}
	}

	function reviseAll(rt, rname) {
		var rall = document.querySelectorAll(".passage ." + rname),
			ret = false;
		for (var i = 0; i < rall.length; i++) {
			if (!insideDepartingSpan(rall[i])) {
				ret = revise(rt, rall[i]) || ret
			}
		}
		return ret
	}

	function revise(rt, r, notrans) {
		var ind2, curr, next, ind = -1,
			rev = (rt == "revert"),
			rnd = (rt.indexOf("random") > -1),
			fl = r.getAttribute("data-flavour"),
			rc = r.childNodes,
			cyc = (fl == "cycle"),
			rcl = rc.length - 1;

		function doToGainerSpans(n, fn) {
			for (var k = n - 1; k >= 0; k--) {
				if (rc[k + 1].classList.contains("gains")) {
					fn(rc[k], notrans)
				} else {
					break
				}
			}
		}
		for (var k = 0; k <= rcl; k++) {
			if (rc[k].getAttribute("data-enabled") == "true") {
				ind = k
			}
		}
		if (rev) {
			ind -= 1
		}
		curr = (ind >= 0 ? rc[ind] : (cyc ? rc[rcl] : null));
		ind2 = ind;
		if (rnd) {
			ind2 = (ind + (Math.floor(Math.random() * rcl))) % rcl
		}
		next = ((ind2 < rcl) ? rc[ind2 + 1] : (cyc ? rc[0] : null));
		var docurr = (rev ? showVer : hideVer);
		var donext = (rev ? hideVer : showVer);
		var currfn = function() {
			if (!(next && next.classList.contains("gains")) || rnd) {
				docurr(curr, notrans);
				doToGainerSpans(ind, docurr, notrans)
			}
		};
		var nextfn = function() {
			donext(next, notrans);
			if (rnd) {
				doToGainerSpans(ind2 + 1, donext, notrans)
			}
		};
		if (!rev) {
			currfn();
			nextfn()
		} else {
			nextfn();
			currfn()
		}
		return (cyc ? true : (rev ? (ind > 0) : (ind2 < rcl - 1)))
	}
	macros.revert = macros.revise = macros.randomise = macros.randomize = {
		handler: function(a, b, c) {
			var l, rev, rname;

			function disableLink(l) {
				l.style.display = "none"
			}

			function enableLink(l) {
				l.style.display = "inline"
			}

			function updateLink(l) {
				if (l.className.indexOf("random") > -1) {
					enableLink(l);
					return
				}
				var rall = document.querySelectorAll(".passage ." + rname),
					cannext, canprev, i, ind, r, fl;
				for (i = 0; i < rall.length; i++) {
					r = rall[i], fl = r.getAttribute("data-flavour");
					if (insideDepartingSpan(r)) {
						continue
					}
					if (fl == "cycle") {
						cannext = canprev = true
					} else {
						if (r.firstChild.getAttribute("data-enabled") == !1 + "") {
							canprev = true
						}
						if (r.lastChild.getAttribute("data-enabled") == !1 + "") {
							cannext = true
						}
					}
				}
				var can = (l.classList.contains("revert") ? canprev : cannext);
				(can ? enableLink : disableLink)(l)
			}

			function toggleText(w) {
				w.classList.toggle(rl + "Enabled");
				w.classList.toggle(rl + "Disabled");
				w.style.display = ((w.style.display == "none") ? "inline" : "none")
			}
			var rl = "reviseLink";
			if (c.length < 2) {
				throwError(a, b + " macro needs 2 parameters");
				return
			}
			rname = c.shift().replace(" ", "_");
			l = Wikifier.createInternalLink(a, null);
			l.className = "internalLink " + rl + " " + rl + "_" + rname + " " + b;
			var v = "";
			var end = false;
			var out = false;
			if (c.length > 1 && c[0][0] == "$") {
				v = c[0].slice(1);
				c.shift()
			}
			switch (c[c.length - 1]) {
				case "end":
					end = true;
					c.pop();
					break;
				case "out":
					out = true;
					c.pop();
					break
			}
			var h = state.history[0].variables;
			for (var i = 0; i < c.length; i++) {
				var on = (i == Math.max(c.indexOf(h[v]), 0));
				var d = insertElement(null, "span", null, rl + ((on) ? "En" : "Dis") + "abled");
				if (on) {
					h[v] = c[i];
					l.setAttribute("data-cycle", i)
				} else {
					d.style.display = "none"
				}
				insertText(d, c[i]);
				l.appendChild(d)
			}
			l.onclick = function() {
				reviseAll(b, rname);
				var t = this.childNodes,
					u = this.getAttribute("data-cycle") - 0,
					m = t.length,
					n, lall, i;
				if ((end || out) && u == m - (end ? 2 : 1)) {
					if (end) {
						n = this.removeChild(t[u + 1]);
						n.className = rl + "End";
						n.style.display = "inline";
						this.parentNode.replaceChild(n, this)
					} else {
						this.parentNode.removeChild(this);
						return
					}
				} else {
					toggleText(t[u]);
					u = (u + 1) % m;
					if (v) {
						h[v] = c[u]
					}
					toggleText(t[u]);
					this.setAttribute("data-cycle", u)
				}
				lall = document.getElementsByClassName(rl + "_" + rname);
				for (i = 0; i < lall.length; i++) {
					updateLink(lall[i])
				}
			};
			l = null
		}
	};
	macros.mouserevise = macros.hoverrevise = {
		handler: function(a, b, c, d) {
			var endtags = ["end" + b],
				evt = (window.onmouseenter === null ? "onmouseenter" : "onmouseover"),
				t = tagcontents(d, [b], endtags, endtags, d.source.indexOf(">>", d.matchStart) + 2);
			if (t) {
				var rname = c[0].replace(" ", "_"),
					h = insertElement(a, "span", null, "hoverrevise hoverrevise_" + rname),
					f = function() {
						var done = !reviseAll("revise", rname);
						if (b != "hoverrevise" && done) {
							this[evt] = null
						}
					};
				new Wikifier(h, t[0]);
				if (b == "hoverrevise") {
					h.onmouseover = f;
					h.onmouseout = function() {
						reviseAll("revert", rname)
					}
				} else {
					h[evt] = f
				}
				h = null
			}
		}
	};
	macros.instantrevise = {
		handler: function(a, b, c, d) {
			reviseAll("revise", c[0].replace(" ", "_"))
		}
	};
	macros.endmouserevise = nullobj;
	macros.endhoverrevise = nullobj
}());
