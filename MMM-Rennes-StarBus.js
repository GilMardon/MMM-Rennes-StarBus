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

    start: function () {
        var self = this;
        var dataRequest = null;
        var dataNotification = null;

        this.sendSocketNotification("CONFIG", this.config);

        // Schedule update timer.
        setInterval(function () {
            self.sendSocketNotification("GET_DATA");
        }, this.config.updateInterval);

    },
    formatTimeString: function (date) {
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
    getDom: function () {
        var self = this;

        // Create an element wrapper for display data
        var wrapper = document.createElement("table");

        // If data are not empty
        if (this.dataRequest) {
            this.dataRequest.records.forEach(function (data, i) {
                var lineWrapper = document.createElement("tr");

                var wrapperArrivee = document.createElement("td");
                wrapperArrivee.innerHTML = data.fields.nomcourtligne;
                wrapperArrivee.className = "nomcourtligne";
                wrapper.appendChild(wrapperArrivee);

                var wrapperArrivee = document.createElement("td");
                wrapperArrivee.innerHTML = self.formatTimeString(data.fields.arrivee);
                wrapperArrivee.className = "arrivee";
                wrapper.appendChild(wrapperArrivee);

                var wrapperNomArret = document.createElement("td");
                wrapperNomArret.innerHTML = data.fields.nomarret;
                wrapperNomArret.className = "nomarret";
                wrapper.appendChild(wrapperNomArret);

                var wrapperDestination = document.createElement("td");
                wrapperDestination.innerHTML = "vers";
                wrapperDestination.className = "vers";
                wrapper.appendChild(wrapperDestination);

                var wrapperDestination = document.createElement("td");
                wrapperDestination.innerHTML = data.fields.destination;
                wrapperDestination.className = "destination";
                wrapper.appendChild(wrapperDestination);

                wrapper.appendChild(lineWrapper);
            });
        }

        return wrapper;
    },

    getScripts: function () {
        return ["moment.js"];
    },

    getStyles: function () {
        return [
            "MMM-Rennes-StarBus.css",
        ];
    },

    processData: function (data) {
        var self = this;
        this.dataRequest = data;
        self.updateDom(self.config.animationSpeed);
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
