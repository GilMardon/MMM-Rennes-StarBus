/* A MagicMirror module to show bus timetables and arival times of Rennes Star Bus.
 * Copyright (C) 2018 Gil Mardon
 * https://github.com/GilMardon/MMM-Rennes-StarBus
 * License: GNU General Public License */

var NodeHelper = require("node_helper");
//var http = require('http');
const restling = require('restling');

module.exports = NodeHelper.create({

	// Override socketNotificationReceived method.

	/* socketNotificationReceived(notification, payload)
	 * This method is called when a socket notification arrives.
	 *
	 * argument notification string - The identifier of the noitication.
	 * argument payload mixed - The payload of the notification.
	 */
	socketNotificationReceived: function(notification, payload) {
		var self = this;
		
		if (notification === "CONFIG") {
			self.config = payload;
			self.getData();

			setInterval(function() {
				self.getData();
			}, self.config.updateInterval);
		} else if (notification === "GET_DATA") {
			self.getData();
		}
	},

	

	/* scheduleUpdate()
	 * Schedule next update.
	 *
	 * argument delay number - Milliseconds before next update.
	 *  If empty, this.config.updateInterval is used.
	 */
	/*scheduleUpdate: function(delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}
		nextLoad = nextLoad ;
		var self = this;
		setTimeout(function() {
			self.getData();
		}, nextLoad);
	},*/

	/*
	 * getData
	 * function example return data and show it in the module wrapper
	 * get a URL request
	 *
	 */
	getData: function() {
        var self = this;
        let RestArgs = {
            rejectUnauthorized: false
        };

        var urlApi ="https://data.rennesmetropole.fr/api/records/1.0/search/?dataset=prochains-passages-des-lignes-de-bus-du-reseau-star-en-temps-reel&sort=nomcourtligne&facet=idligne&facet=nomcourtligne&facet=sens&facet=destination&facet=precision&facet=nomarret&refine.idligne=0004&refine.nomarret=Bois+Labb%C3%A9&refine.destination=ZA+Saint-Sulpice"
        
        console.log(urlApi);

        return restling.get(urlApi, RestArgs).then(function (response) {
			if (response.response.statusCode === 401) {
				self.sendSocketNotification("ERROR", this.status);
				console.log(self.name, this.status);
				//retry = false;
			} else if (response.response.statusCode != 200) {
				console.log(self.name, "Could not load data.");
				//self.scheduleUpdate((self.loaded) ? -1 : self.config.retryDelay);
			} 

            return 	self.sendSocketNotification("DATA", response.data);

		}).catch(function(e) {
			console.log("Communications error:", e.message);
		});
	}

});
