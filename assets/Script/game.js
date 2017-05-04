cc.Class({
    extends: cc.Component,

    properties: {
        // nodo del player para poder controlar el movimiento del mismo
        player: {
            default: null,
            type: cc.Node
        },
        // botones de control
        buttonLeft: {
            default: null,
            type: cc.Node
        },
        buttonRight: {
            default: null,
            type: cc.Node
        },
        buttonPause: {
            default: null,
            type: cc.Node
        },
    },

    // use this for initialization
    onLoad: function () {
        
        

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
