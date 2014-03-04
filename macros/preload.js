try {
	version.extensions['preload'] = {
		major: 1,
		minor: 0,
		revision: 0
	};
	macros['preload'] = {
		init: function() {
			if (this.images == null) {
				this.images = new Object();
				this.images.initial = new Array(
					"ranked.png",
					"league_queue.png",
					"match_found.png",
					"lanes.png",
					"champs/leesin.png",
					"champs/vi.png",
					"champs/volibear.png",
					"champs/ashe.png",
					"champs/corki.png",
					"champs/twitch.png",
					"champs/sona.png",
					"champs/taric.png",
					"champs/thresh.png",
					"defeat.jpg"
				);
				this.images.top = new Array(
					"champs/riven.png",
					"champs/shen.png",
					"champs/singed.png",
					"splash/riven.png",
					"splash/shen.png",
					"splash/singed.png"
				);
				this.images.mid = new Array(
					"champs/ahri.png",
					"champs/kassadin.png",
					"champs/orianna.png",
					"splash/ahri.png",
					"splash/kassadin.png",
					"splash/orianna.png"
				);
				this.images.jungle = new Array(
					"splash/leesin.png",
					"splash/vi.png",
					"splash/volibear.png",
					"items/huntersmachete.png",
					"abilities/resonatingstrike.png",
					"abilities/vaultbreaker.png",
					"abilities/rollingthunder.png",
					"jungle/golem.png",
					"jungle/golem2.jpg",
					"jungle/lizard.png",
					"jungle/lizard2.jpg"
				);
				this.images.adc = new Array(
					"splash/ashe.png",
					"splash/corki.png",
					"splash/twitch.png",
					"items/doransblade.png",
					"abilities/bolastrike.png",
					"abilities/zenithblade.png",
					"doublekill.png",
					"jungle/dragon.png"
				);
				this.images.support = new Array(
					"splash/sona.png",
					"splash/taric.png",
					"splash/thresh.png",
					"sr_start.png",
					"items/doransshield.png",
					"items/stealthward.png",
					"abilities/bearstance.png",
					"abilities/rocketgrab.png",
					"abilities/piltover.png",
					"abilities/elasticslingshot.png",
					"doublekill.png",
					"jungle/dragon.png"
				);
				this.images.ending = new Array(
					"defeat_series.png",
					"uninstall.png"
				);
			}
		},
		handler: function(place, macroName, params, parser) {
			// initialize the arrays
			this.init();

			// preload all the images for the given section
			var toLoad = this.images[params[0]]
			for (i = 0; i < toLoad.length; ++i) {
				var temp = new Image();
				temp.src = toLoad[i];
			}
		},
		images: null,
	};
} catch (e) {
	throwError(place, "Preload Macro Error: " + e.message);
}