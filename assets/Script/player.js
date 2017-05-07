cc.Class({
    extends: cc.Component,

    properties: {
        // movimiento maximo
        maxMoveSpeed: 0,
        // aceleracion
        accel: 0,
        speed: 0,
        canvas: {
            default: null,
            type: cc.Node
        },
    },
    
    moveTo: function(direction){
        var self = this;
        cc.log("moveTo: " + direction);
        if(direction == "left"){
            self.accLeft = true;
            self.accRight = false;
        }else{
            self.accLeft = false;
            self.accRight = true;
        }
    },
    
    stop: function(direction){
        var self = this;
        if(direction == "left"){
            self.accLeft = false;
        }else{
            self.accRight = false;
        }
    },
    
    setInputControl: function () {
        // configura las entradas
        var self = this;
        // Agregamos un evento de teclado
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            // Al presionar la tecla se establece la direccion de la aceleracion
            onKeyPressed: function(keyCode, event) {
                switch(keyCode) {
                    case cc.KEY.a:
                        self.moveTo("left");
                        break;
                    case cc.KEY.d:
                        self.moveTo("right");
                        break;
                }
            },
            // al levantar la tecla se detiene la aceleracion
            onKeyReleased: function(keyCode, event) {
                switch(keyCode) {
                    case cc.KEY.a:
                        self.stop("left");
                        break;
                    case cc.KEY.d :
                        self.stop("right");
                        break;
                }
            }
        }, self.node);
    },

    // use this for initialization
    onLoad: function () {
        // variables de aceleracion
        this.accLeft = false;
        this.accRight = false;
        this.xSpeed = 0;
        this.setInputControl();
        cc.log("this.canvas.width(): " + this.canvas.width);
        cc.log("this.node.x: " + this.node.x);
    },
    
    move: function(){
        
    },

    update: function (dt) {
        // actualiza la velocidad del personaje
        if (this.accLeft) {
            if(this.xSpeed > 0){
                this.xSpeed = 0;
            }
            this.xSpeed -= this.accel * dt;
        } else if (this.accRight) {
            if(this.xSpeed < 0){
                this.xSpeed = 0;
            }
            this.xSpeed += this.accel * dt;
        }
        // restringe la velocidad del personaje principal
        if ( Math.abs(this.xSpeed) > this.maxMoveSpeed ) {
            // pone limite a la velocida
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }
        if(!this.accLeft && !this.accRight){
            this.xSpeed = 0;
        }
        
        // Actualiza la posicion del personaje y verifica que no salga de la pantalla
        if((this.accLeft && this.node.x > ((-1)*this.canvas.width/2 + 50)) ||
           (this.accRight && this.node.x < (this.canvas.width/2 - 50))){
            this.node.x += this.xSpeed * dt;
        }
    },
});
