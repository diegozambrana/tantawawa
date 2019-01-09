cc.Class({
    extends: cc.Component,

    properties: {
        pickRadius: 0,
        paused: false,
    },

    // use this for initialization
    onLoad: function () {
        this.vel = 4;
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
        this.game.removeEnergyFromList();
        this.node.destroy();
    },

    update: function(dt){
        var self = this;
        if(!self.paused){
           self.node.y = self.node.y - self.vel;
        }
        if (this.getPlayerDistance() < this.pickRadius) {
            this.destroy();
            this.game.addEnergy(cc.random0To1() * 7 + 3);
            return;
        }
        if(this.node.y < (-1) * (this.game.node.height/2 + 60)){
            this.destroy();
            return;

        }
    },
});
