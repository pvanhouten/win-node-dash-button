const { Cap, decoders } = require("cap")
const throttle = require("lodash.throttle")

const Server = function() {
    var self = this
    const cap = new Cap()
    const buffer = new Buffer(65536)

    this.dashButtons = {}

    this.register = function(button) {
      button.callback = throttle(button.callback, 5000)
      self.dashButtons[button.mac.toUpperCase()] = button
      return self
    }

    this.packetReceived = function(nbytes, trunc) {
      const decodedPacket = decoders.Ethernet(buffer)
      if (decodedPacket.info.type === 2054) {
        // ARP
        console.log("ARP request detected...")
        const button = self.dashButtons[decodedPacket.info.srcmac.toUpperCase()]
        if (button && button.callback) {
          console.log("Registered Dash button click detected! Firing callback!")
          button.callback(decodedPacket)
        }
      }
    }

    this.start = function(ip) {
      const device = Cap.findDevice(ip)
      if (!device) {
        throw Error(
          `No device found at ${ip}. Here are all the devices available =>\n${JSON.stringify(
            Cap.deviceList(),
            null,
            2
          )}`
        )
      }

      console.log(`Listening for ARP requests on ${ip}`)
      cap.open(device, "", 10 * 1024 * 1024, buffer)

      try {
        cap.setMinBytes(0)
      } catch (e) {
        console.log(e)
      }

      // Listen for packets and register callback
      cap.on("packet", self.packetReceived)

      process.on("SIGINT", self.stop)
    }

    this.stop = function() {
      console.log("Shutting down")
      cap.removeListener("packet", self.packetReceived)
      cap.close()
    }
  },

  DashButton = function(mac, callback) {
    this.mac = mac
    this.callback = callback
  }

module.exports = {
  DashButton,
  Server
}
