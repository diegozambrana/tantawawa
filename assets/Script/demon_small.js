cc.Class({
    extends: cc.Component,

    properties: {
        pickRadius: 50,
        paused: false,
    },

    // use this for initialization
    onLoad: function () {
        this.vel = 6;
        this.xMove = cc.random0To1() * 4 + 0.5;
        cc.log("------------- aqui ")
        cc.log("this.node");
        cc.log(this.node);
        cc.log("(Math.random() - 0.5) * 2: ")
        cc.log((Math.random() - 0.5) * 2)
        // this.direction = cc.randomMinus1To1() < 0 ? -1 : 1;
        this.direction = ((Math.random() * 0.5) * 2) ? -1 : 1;
        this.node.scaleX = -1 * this.direction;
        cc.log("this.node");
        cc.log(this.node);
        cc.log("this.node.scaleX:");
        cc.log(this.node.scaleX);
    },

    stop: function(){
        this.paused = true;
    },

    restart: function(){
        this.paused = false;
    },

    getPlayerDistance: function () {
        // judge the distance according to the position of the player node
        var playerPos = this.game.player.getPosition();
        // calculate the distance between two nodes according to their positions
        // var dist = cc.pDistance(this.node.position, playerPos);
        var dist = this.node.position.sub(playerPos).mag()
        return dist;
    },

    destroy: function(){
        this.game.removeSmallDemonFromList();
        this.node.destroy();
    },

    update: function(dt){
        var self = this;
        if(!self.paused){
            self.node.y = self.node.y - self.vel;
            var max = (this.game.node.width/2) - 40;
            var min = -1 * max;
            if(self.node.x >= max || self.node.x <= min){
                this.direction = this.direction * -1;
                this.node.scaleX = -1 * this.direction;
            }
            self.node.x = self.node.x + (this.xMove * this.direction);
        }
        if (this.getPlayerDistance() < this.pickRadius) {
            this.game.subtractEnergy(0.75);
            return;
        }
        if(this.node.y < (-1) * (this.game.node.height/2 + 60)){
            this.destroy();
            return;

        }
    },

});
