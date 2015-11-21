"use strict";

var Cap = require('cap').Cap,
    decoders = require('cap').decoders,
    _ = require("lodash"),

    Server = function () {
        var self = this,
            cap = new Cap(),
            buffer = new Buffer(65536);

        this.dashButtons = {};

        this.register = function (button) {
            button.callback = _.debounce(button.callback, 10000);
            self.dashButtons[button.mac.toUpperCase()] = button;
            return self;
        };

        this.packetReceived = function (nbytes, trunc) {
            var ret = decoders.Ethernet(buffer);
            if (ret.info.type === 2054) { // arp
                var button = self.dashButtons[ret.info.srcmac.toUpperCase()];
                if (button && button.callback) {
                    button.callback(ret);
                }
            }
        };

        this.start = function (ip) {
            var device = Cap.findDevice(ip),
                linkType = cap.open(device, "", 10 * 1024 * 1024, buffer);

            try {
                cap.setMinBytes(0);
            } 
            catch (e) {
                console.log(e);
            }

            cap.on("packet", self.packetReceived);

            process.on("SIGINT", self.stop);
        };

        this.stop = function () {
            console.log("Shutting down");
            cap.removeListener("packet", self.packetReceived);
            cap.close();
        };
    },

    DashButton = function (mac, callback) {
        this.mac = mac;
        this.callback = callback;
    };


module.exports = {
    DashButton: DashButton,
    Server: Server
};
