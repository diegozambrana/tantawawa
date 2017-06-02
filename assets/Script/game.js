cc.Class({
    extends: cc.Component,

    properties: {

        // nodo del player para poder controlar el movimiento del mismo
        player: {
            default: null,
            type: cc.Node
        },

        // nodo para controlar la barra de energia
        energyBar: {
            default: null,
            type: cc.Node
        },

        // nodo para el indicador de energia
        progressIndicator: {
            default: null,
            type: cc.Node
        },

        // botones de control
        buttonLeft: cc.Node,
        buttonRight: cc.Node,
        buttonPause: cc.Node,
        buttonResume: cc.Node,
        buttonExitGame: cc.Node,
        
        // controles para la barra de energia
        energy: 0,
        energyDifference: 0,

        // controles para el indicador de progreso del juego
        progressTotal: 0,
        progressCurrent: 0,
        progressDifference: 0,

        // controla que el juego este pausado
        gamePaused: false,
        pauseModal: {
            default: null,
            type: cc.Node
        },
        
    },

    setInputControl: function () {
        // configura las entradas
        var self = this;
        // obtenemos el componente player de nuestro personaje pricipal
        var player = self.player.getComponent("player");
        // Agregamos un evento de teclado
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            // Al presionar la tecla se establece la direccion de la aceleracion
            onKeyPressed: function(keyCode, event) {
                switch(keyCode) {
                    case cc.KEY.a:
                        if(!self.gamePaused)
                            player.moveTo("left");
                        break;
                    case cc.KEY.d:
                        if(!self.gamePaused)
                            player.moveTo("right");
                        break;
                }
            },
            // al levantar la tecla se detiene la aceleracion
            onKeyReleased: function(keyCode, event) {
                switch(keyCode) {
                    case cc.KEY.a:
                        if(!self.gamePaused)
                            player.stop("left");
                        break;
                    case cc.KEY.d :
                        if(!self.gamePaused)
                            player.stop("right");
                        break;
                }
            }
        }, self.node);
    },

    setButtonControl: function(){
        var self = this;
        // obtenemos el componente player de nuestro personaje pricipal
        var player = self.player.getComponent("player");
        // agregamos la funcionalidad a los botones de derecha e izquierda.
        self.buttonLeft.on(cc.Node.EventType.TOUCH_START, function (event) {
            if(!self.gamePaused)
                player.moveTo("left");
        }, self.node);
        self.buttonLeft.on(cc.Node.EventType.TOUCH_END, function (event) {
            if(!self.gamePaused)
                player.stop("left");
        }, self.node);
        self.buttonRight.on(cc.Node.EventType.TOUCH_START, function (event) {
            if(!self.gamePaused)
                player.moveTo("right");
        }, self.node);
        self.buttonRight.on(cc.Node.EventType.TOUCH_END, function (event) {
            if(!self.gamePaused)
                player.stop("right");
        }, self.node);
    },

    setEnergy: function(){
        var self = this;
        // hace que se disminuya la energia
        self.callbackEngery = function(){
            self.energy -= self.energyDifference;
            self.energyBar.width = 188*self.energy/100;
            if(self.energy < 1){
                // si la energia llega a cero se detiene
                cc.log("END GAME");
                self.unschedule(self.callbackEngery);
            }
        };
        self.schedule(self.callbackEngery, 0.1);
    },

    setProgress: function(){
        var self = this;
        // avanzamos el indicador de progreso
        var startProgress = self.progressIndicator.x;
        cc.log(startProgress);
        self.callbackProgress = function(){
            self.progressCurrent += self.progressDifference;
            cc.log(self.progressCurrent);
            self.progressIndicator.x = startProgress + (170*self.progressCurrent/100);
            if(self.progressCurrent >= self.progressTotal){
                cc.log("FINISH GAME");
                self.unschedule(self.callbackProgress);
                self.unschedule(self.callbackEngery);
            }
        };
        self.schedule(self.callbackProgress,0.1);
    },

    setPauseButton: function(){
        var self = this;
        // agregamos funcionalidad al boton pause
        self.pauseModal.active = false;
        self.buttonPause.on(cc.Node.EventType.TOUCH_START, function (event) {
            cc.log("PAUSE");
            self.gamePaused = true;
            self.unschedule(self.callbackProgress);
            self.unschedule(self.callbackEngery); 
            self.pauseModal.active = true;

        }, self.node);
        self.buttonResume.on(cc.Node.EventType.TOUCH_START, function(event){
            cc.log("RESUME");
            self.gamePaused = false;
            self.schedule(self.callbackProgress,0.1);
            self.schedule(self.callbackEngery,0.1);
            self.pauseModal.active = false;
        }, self.node);
        cc.log(self.pauseModal);
        self.buttonExitGame.on(cc.Node.EventType.TOUCH_START, function (event) {
            cc.log("EXIT");
            cc.director.loadScene("Scene/Menu");
        }, self.node);
    },

    onLoad: function () {
        var self = this;
        self.setButtonControl();
        self.setInputControl();
        self.setEnergy();
        self.setProgress();
        self.setPauseButton();
    },

    update: function (dt) {

    },
});
