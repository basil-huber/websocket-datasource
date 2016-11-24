define(function(){
    var WebSocketDatasource = function(url){
        var WebSocketClient = require('websocket.js').default;
        var self = this;

        this.status = 0;
        this.datasourceStatus = -1;

        function onmessage(m) {
            if (self.status === 0) {
                var view = new DataView(m.data);
                self.datasourceStatus = view.getInt32(0);
                self.status = 1;
                Object.apply(self, self.onDatasourceStatusChanged);
                
                switch (self.datasourceStatus) {
                    case 404:
                        ws.close();
                        break;
                    case 200:
                        break;
                    default:
                        console.error('unknwon datasource status code ' + self.datasourceStatus + ' for url ' + url);
                        ws.close();
                        break;
                }
            } else {
                self.onmessage(m);
            }
        };


        this.onmessage = function (m) { };
        this.onclose = function () { };
        this.onopen = function () { };
        this.onDatasourceStatusChanged = function () { };

        var ws = new WebSocketClient(url, 'datasource', { strategy: "exponential" });

        ws.onopen = function () { ws.binaryType = 'arraybuffer'; self.onopen();};
        ws.onmessage = onmessage;
        ws.onclose = function () { self.onclose() };

        this.close = function () { ws.close(); };
    };
    return WebSocketDatasource;
});
