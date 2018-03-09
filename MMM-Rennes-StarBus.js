/* A MagicMirror module to show bus timetables and arival times of Rennes Star Bus.
 * Copyright (C) 2018 Gil Mardon
 * https://github.com/GilMardon/MMM-Rennes-StarBus
 * License: GNU General Public License */

Module.register("MMM-Rennes-StarBus", {
	defaults: {
		timeFormat: config.timeFormat,
		maxEntries: 5,
		updateInterval: 60000,
		retryDelay: 5000
	},

	requiresVersion: "2.1.0", // Required version of MagicMirror

	start: function() {
		var self = this;
		var dataRequest = null;
		var dataNotification = null;

		//Flag for check if module is loaded
		//this.loaded = false;
		console.log(this.config.timeFormat);
		this.sendSocketNotification("CONFIG", this.config);

		// Schedule update timer.
		setInterval(function() {
			self.sendSocketNotification("GET_DATA");
		}, this.config.updateInterval);
		
	},	

	getDom: function() {
		var self = this;

		// create element wrapper for show into the module
		var wrapper = document.createElement("div");
		// If this.dataRequest is not empty
		if (this.dataRequest) {
			this.dataRequest.forEach(function(data, i) {
				var wrapperDataRequest = document.createElement("div");
				
				wrapperDataRequest.innerHTML = data;
				wrapperDataRequest.className = "small";
	
				wrapper.appendChild(wrapperDataRequest);
			});

			
		}
		
		return wrapper;
	},

	getScripts: function() {
		return ["moment.js"];
	},

	getStyles: function () {
		return [
			"MMM-Rennes-StarBus.css",
		];
	},

	processData: function(data) {
		var self = this;
		this.dataRequest = data;
		self.updateDom(self.config.animationSpeed);
	},


	formatTimeString: function(date) {
		var m = moment(date);

		var hourSymbol = "HH";
		var periodSymbol = "";

		if (this.config.timeFormat !== 24) {
			hourSymbol = "h";
			periodSymbol = " A";
		}

		var format = hourSymbol + ":mm" + periodSymbol;

		return m.format(format);
	},

    /**
     * socketNotificationReceived from helper
     * Processes messages from node_helper
     */
	socketNotificationReceived: function (notification, message) {
		if (notification === "DATA") {
			this.processData(message);
		} else if (notification === "ERROR") {
			self.updateDom(self.config.animationSpeed);
		} 
	},
});
