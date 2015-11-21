# win-node-dash-button
A node module built for Windows to emit events when an Amazon Dash Button is pressed

## Examples
```javascript
var svr = new Server(),
    tide   = new DashButton("12:34:56:78:90:12", function () { console.log("Tide pressed"); });

svr.register(tide)
   .start("192.168.1.10");
```