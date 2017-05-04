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
    
    setInputControl: function () {
        // configura las entradas
        var self = this;
        // Agregamos un evento de teclado
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            // Al presionar la tecla se establece la direccion de la aceleracion
            onKeyPressed: function(keyCode, event) {
                switch(keyCode) {
                    case cc.KEY.a || cc.KEY.left:
                        self.accLeft = true;
                        self.accRight = false;
                        break;
                    case cc.KEY.d || cc.KEY.right:
                        self.accLeft = false;
                        self.accRight = true;
                        break;
                }
            },
            // al levantar la tecla se detiene la aceleracion
            onKeyReleased: function(keyCode, event) {
                switch(keyCode) {
                    case cc.KEY.a || cc.KEY.left:
                        self.accLeft = false;
                        break;
                    case cc.KEY.d  || cc.KEY.right:
                        self.accRight = false;
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
