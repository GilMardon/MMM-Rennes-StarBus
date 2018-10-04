/* A MagicMirror module to show bus timetables and arival times of Rennes Star Bus.
 * Copyright (C) 2018 Gil Mardon
 * https://github.com/GilMardon/MMM-Rennes-StarBus
 * License: GNU General Public License */

var NodeHelper = require("node_helper");
const restling = require("restling");
const Promise = require("bluebird");
const _ = require("lodash");

module.exports = NodeHelper.create({

	// Override socketNotificationReceived method.

	/* socketNotificationReceived(notification, payload)
	 * This method is called when a socket notification arrives.
	 *
	 * argument notification string - The identifier of the noitication.
	 * argument payload mixed - The payload of the notification.
	 */
	socketNotificationReceived: function (notification, payload) {
		var self = this;

		if (notification === "CONFIG") {
			self.config = payload;
			self.getData();

			setInterval(function () {
				self.getData();
			}, self.config.updateInterval);
		} else if (notification === "GET_DATA") {
			self.getData();
		}
	},

	/*
	 * getData
	 * function example return data and show it in the module wrapper
	 * get a URL request
	 *
	 */
	getData: function () {
		let self = this;
		let returnedData = {
			nhits: 0,
			records: []
		};
		let RestArgs = {
			rejectUnauthorized: false
		};

		return Promise.each(self.config.lines, function (line) {
			let urlApi = "https://data.rennesmetropole.fr/api/records/1.0/search/?dataset=prochains-passages-des-lignes-de-bus-du-reseau-star-en-temps-reel" +
				"&sort=nomcourtligne&facet=idligne&facet=nomcourtligne&facet=sens&facet=destination&facet=precision&facet=nomarret&refine.idligne=" +
				line.line +
				"&refine.nomarret=" +
				line.stop +
				"&refine.destination=" +
				line.destination;
			if (!_.isEmpty(self.config.apikey)) {
				urlApi += "&apikey=" + self.config.apikey;
			}

			return restling.get(urlApi, RestArgs).then(function (response) {
				if (response.response.statusCode === 401) {
					self.sendSocketNotification("ERROR", this.status);
					console.log(self.name, this.status);
				} else if (response.response.statusCode != 200) {
					console.log(self.name, "Could not load data.");
				}
				delete response.data.parameters;
				delete response.data.facet_groups;

				returnedData.nhits += response.data.nhits;
				returnedData.records = returnedData.records.concat(response.data.records);

				return Promise.resolve();
			}).then(function () {
				let sortedData = {
					records: _.sortBy(returnedData.records, 'fields.arrivee'),
					nhits: returnedData.nhits
				};
				//console.log("returnedData:", returnedData);
				return self.sendSocketNotification("DATA", sortedData);
			}).catch(function (e) {
				console.log("Communications error:", e.message);
			});
		});
	}
});
