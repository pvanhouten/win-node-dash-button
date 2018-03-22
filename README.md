# win-node-dash-button

A node module built for Windows to emit events when an Amazon Dash Button is pressed. Forked from https://github.com/pvanhouten/win-node-dash-button/

## Requirements

[Npcap](https://nmap.org/npcap/) installed with WinPcap compatibility:

```bash
npcap-<version>.exe /winpcap_mode=yes
```

## Examples

```javascript
const wirelessIP = "192.168.1.10",
      dashMacAddress = "12:34:56:78:90:12",
      svr = new Server(),
      tide = new DashButton(dashMacAddress, () => console.log("Tide button was pressed!")),

svr.register(tide)
   .start(wirelessIP);
```

### Notes

 - Only dash buttons that emit an ARP (not UDP) packet will be detected

### TODO
 - Add a find button helper script?