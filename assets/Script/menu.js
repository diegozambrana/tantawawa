cc.Class({
    extends: cc.Component,

    properties: {
        //  botones 
        buttonPlay: cc.Node,
        buttonHelp: cc.Node,
        buttonExit: cc.Node,
    },

    onLoad: function () {
        var self = this;
        // agregamos los eventos para los botones del menu principal
        var urlGame = "Scene/Game";
        self.buttonPlay.on(cc.Node.EventType.TOUCH_START, function (event) {
            cc.director.loadScene(urlGame);
            cc.log("PLAY");
        }, self.node);
        self.buttonHelp.on(cc.Node.EventType.TOUCH_START, function (event) {
            cc.log("HELP");
        }, self.node);
        self.buttonExit.on(cc.Node.EventType.TOUCH_START, function (event) {
            cc.log("EXIT");
        }, self.node);
    },
});
