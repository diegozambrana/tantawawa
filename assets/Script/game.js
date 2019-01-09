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
        buttonRestart: cc.Node,
        buttonEndExitGame: cc.Node,
        buttonWinExitGame: cc.Node,
        
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

        // controla cuando el juego se pierde
        gameLose: false,
        endGameModal : {
            default: null,
            type: cc.Node
        },

        backgroundPrefab: {
            default: null,
            type: cc.Prefab
        },

        energyPrefab: {
            default: null,
            type: cc.Prefab
        },

        demonPrefab: {
            default: null,
            type: cc.Prefab
        },

        demonBigPrefab: {
            default: null,
            type: cc.Prefab
        },
        
        stair: {
            default: null,
            type: cc.Node
        },
        winGameModal :  {
            default: null,
            type: cc.Node
        },
        
        musicAudio: {
            default: null,
            url: cc.AudioClip
        },
        energyAudio1: {
            default: null,
            url: cc.AudioClip
        },
        energyAudio2: {
            default: null,
            url: cc.AudioClip
        },
        eatAudio: {
            default: null,
            url: cc.AudioClip
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
                        if(!self.gamePaused && !self.gameLose)
                            player.moveTo("left");
                        break;
                    case cc.KEY.d:
                        if(!self.gamePaused && !self.gameLose)
                            player.moveTo("right");
                        break;
                }
            },
            // al levantar la tecla se detiene la aceleracion
            onKeyReleased: function(keyCode, event) {
                switch(keyCode) {
                    case cc.KEY.a:
                        if(!self.gamePaused && !self.gameLose)
                            player.stop("left");
                        break;
                    case cc.KEY.d :
                        if(!self.gamePaused && !self.gameLose)
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
            if(!self.gamePaused && !self.gameLose)
                player.moveTo("left");
        }, self.node);
        self.buttonLeft.on(cc.Node.EventType.TOUCH_END, function (event) {
            if(!self.gamePaused && !self.gameLose)
                player.stop("left");
        }, self.node);
        self.buttonRight.on(cc.Node.EventType.TOUCH_START, function (event) {
            if(!self.gamePaused && !self.gameLose)
                player.moveTo("right");
        }, self.node);
        self.buttonRight.on(cc.Node.EventType.TOUCH_END, function (event) {
            if(!self.gamePaused && !self.gameLose)
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
                cc.log("END GAME ENERGY 0");
                //self.unschedule(self.callbackEngery);
                self.endGame();
            }
        };
        self.schedule(self.callbackEngery, 0.1);
    },

    setProgress: function(){
        var self = this;
        // avanzamos el indicador de progreso
        var startProgress = self.progressIndicator.x;
        self.callbackProgress = function(){
            self.progressCurrent += self.progressDifference;
            self.progressIndicator.x = startProgress + (170*self.progressCurrent/100);
            if(self.progressCurrent >= self.progressTotal){
                cc.log("FINISH GAME");
                self.unschedule(self.callbackProgress);
                self.unschedule(self.callbackEngery);
                self.winGame();
            }
        };
        self.schedule(self.callbackProgress,0.1);
    },

    setPauseButton: function(){
        var self = this;
        // agregamos funcionalidad al boton pause
        self.pauseModal.active = false;
        self.buttonPause.on(cc.Node.EventType.TOUCH_START, function (event) {
            self.gamePaused = true;
            self.unschedule(self.callbackCreateEnergy);
            self.energyList.forEach(function(e){
               e.getComponent("energy").stop(); 
            });
            self.unschedule(self.callbackCreateSmallDemon);
            self.unschedule(self.callbackCreateBigDemon);
            self.demonSmallList.forEach(function(sd){
               sd.getComponent("demon_small").stop(); 
            });
            self.demonBigList.forEach(function(bd){
               try{
                 bd.getComponent("demon_big").stop();
               }catch(e){}
            });
            self.unschedule(self.callbackProgress);
            self.unschedule(self.callbackEngery);
            self.pauseModal.active = true;
        }, self.node);
        self.buttonResume.on(cc.Node.EventType.TOUCH_START, function(event){
            self.gamePaused = false;
            self.energyList.forEach(function(e){
              try{
                e.getComponent("energy").restart();
              }catch(e){}
            });
            self.demonSmallList.forEach(function(sd){
              try{
               sd.getComponent("demon_small").restart();
              }catch(e){}
            });
            self.demonBigList.forEach(function(bd){
              try{
                bd.getComponent("demon_big").restart(); 
              }catch(e){}
            });
            self.schedule(self.callbackCreateEnergy, self.delay_energy);
            self.schedule(self.callbackCreateSmallDemon, self.delay_energy);
            self.schedule(self.callbackCreateBigDemon, self.delay_big_demon);
            self.schedule(self.callbackProgress,0.1);
            self.schedule(self.callbackEngery,0.1);
            self.pauseModal.active = false;
        }, self.node);
        self.buttonExitGame.on(cc.Node.EventType.TOUCH_START, function (event) {
            cc.log("EXIT");
            cc.director.loadScene("Scene/Menu");
        }, self.node);
    },

    removeAll: function(){
        var self = this;
        self.energyList.forEach(function(e){
            try{e.getComponent("energy").destroy();}catch(e){}
        });
        self.demonSmallList.forEach(function(sd){
            try{sd.getComponent("demon_small").destroy();}catch(e){}
        });
        self.demonBigList.forEach(function(bd){
            try{bd.getComponent("demon_big").destroy();}catch(e){}
        });
    },

    setEndGameButton: function(){
        var self = this;
        self.endGameModal.active = false;
        self.buttonRestart.on(cc.Node.EventType.TOUCH_START, function (event) {
            self.gameLose = false;
            self.progressCurrent = 0;
            self.energy = self.totalEnergy;
            self.schedule(self.callbackProgress,0.1);
            self.schedule(self.callbackEngery,0.1);
            self.schedule(self.callbackCreateEnergy, self.delay_energy);
            self.schedule(self.callbackCreateSmallDemon, self.delay_energy);
            self.schedule(self.callbackCreateBigDemon, self.delay_big_demon);
            self.removeAll();
            self.endGameModal.active = false;

        }, self.node);
        self.buttonEndExitGame.on(cc.Node.EventType.TOUCH_START, function (event) {
            cc.director.loadScene("Scene/Menu");
        }, self.node);
    },
    setWin: function(){
        var self = this;
        self.winGameModal.active = false;
        self.buttonWinExitGame.on(cc.Node.EventType.TOUCH_START, function (event) {
            cc.director.loadScene("Scene/Menu");
        }, self.node);
    },

    endGame: function(){
        var self = this;
        var player = self.player.getComponent("player");
        self.gameLose = true;
        player.stop("left");
        player.stop("right");
        self.endGameModal.active = true;
        self.unschedule(self.callbackProgress);
        self.unschedule(self.callbackEngery); 
        self.unschedule(self.callbackCreateEnergy);
        self.unschedule(self.callbackCreateSmallDemon);
        self.unschedule(self.callbackCreateBigDemon);
    },

    winGame: function(){
        var self = this;
        var player = self.player.getComponent("player");
        player.stop("left");
        player.stop("right");

        
        self.unschedule(self.callbackProgress);
        self.unschedule(self.callbackEngery); 
        self.unschedule(self.callbackCreateEnergy);
        self.unschedule(self.callbackCreateSmallDemon);
        self.unschedule(self.callbackCreateBigDemon);

        // agrega la escalera
        var anim = self.stair.getComponent(cc.Animation);
        anim.play("AnimationStair");
        var animPlayer = player.getComponent(cc.Animation);
        animPlayer.play("AnimationTantawawaFinal");

        //muestra el modal de felicitaciones
        self.scheduleOnce(function(){self.winGameModal.active = true;}, 2);
    },

    createEnergy: function(){
        var self = this;
        var newEnergy = cc.instantiate(this.energyPrefab);
        this.node.addChild(newEnergy, -1);
        newEnergy.setPosition(this.getNewEnergyPosition());
        newEnergy.getComponent('energy').game = this;
        self.energyList.push(newEnergy);
    },

    createSmallDemon: function(){
        var self = this;
        var newDemon = cc.instantiate(this.demonPrefab);
        this.node.addChild(newDemon, -1);
        newDemon.setPosition(this.getNewEnergyPosition());
        newDemon.getComponent('demon_small').game = this;
        self.demonSmallList.push(newDemon);
    },

    createBigDemon: function(){
        var self = this;
        var newDemon = cc.instantiate(this.demonBigPrefab);
        this.node.addChild(newDemon, -1);
        newDemon.setPosition(this.getNewEnergyPosition());
        newDemon.getComponent('demon_big').game = this;
        newDemon.getComponent('demon_big').setPosition(this.getNewEnergyPosition());
        self.demonBigList.push(newDemon);
    },

    getNewEnergyPosition: function(){
        var maxX = (this.node.width/2) - 60;
        var randX = ((Math.random() * 0.5) * 2) * maxX;
        var randY = this.node.height/2 + 60;
        return cc.p(randX, randY);
    },

    removeEnergyFromList: function(){
        var self = this;
        self.energyList.shift();
    },

    removeSmallDemonFromList: function(){
        var self = this;
        self.demonSmallList.shift();
    },

    setBackground: function(){
        var self = this;
        self.background = cc.instantiate(self.backgroundPrefab);
        self.node.addChild(self.background, -2);
        self.background.setPosition(cc.p(0,0));
    },

    setCreateEnergy: function(){
        var self = this;
        self.delay_energy = 2.7;
        self.callbackCreateEnergy = function(){
            self.createEnergy();
        };
        self.schedule(self.callbackCreateEnergy, self.delay_energy);
    },

    setCreateDemons: function(){
        var self = this;
        self.delay_demon_small = 1.5;
        self.delay_big_demon = 2.5;
        self.callbackCreateSmallDemon = function(){
            self.createSmallDemon();
        };
        self.callbackCreateBigDemon = function(){
            self.createBigDemon();
        };
        self.schedule(self.callbackCreateSmallDemon, self.delay_demon_small);
        self.schedule(self.callbackCreateBigDemon, self.delay_big_demon);
    },

    subtractEnergy: function(value){
        var self = this;
        if(value < self.energy){
            self.energy = self.energy - value;
        }else{
            self.energy = 0;
        }
        if(!self.is_eating){
            cc.audioEngine.playEffect(self.eatAudio);
            self.is_eating = true;
            self.schedule(function(){self.is_eating = false;}, 0.8);
        }
    },

    addEnergy: function(value){
        var self = this;
        self.energy = self.energy + value;
        if(self.rezo_type){
            cc.audioEngine.playEffect(self.energyAudio1);
        }else{
            cc.audioEngine.playEffect(self.energyAudio2);
        }
        self.rezo_type = !self.rezo_type;
    },
    
    startMusic: function(){
        var self = this;
        // true para que se reprodusca dentor un loop
        // false para que se reprodusca solo una vez
        cc.audioEngine.playMusic(self.musicAudio, true);
    },

    onLoad: function () {
        var self = this;
        self.rezo_type = false;
        self.is_eating = false;
        self.energyList = [];
        self.demonSmallList = [];
        self.demonBigList = [];
        self.totalEnergy = self.energy;
        self.setButtonControl();
        self.setInputControl();
        self.setEnergy();
        self.setProgress();
        self.setPauseButton();
        self.setEndGameButton();
        self.setBackground();
        self.setCreateEnergy();
        self.setCreateDemons();
        self.setWin();
        self.startMusic();
    },

    
    update: function (dt) {

    },
});
