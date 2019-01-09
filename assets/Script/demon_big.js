cc.Class({
    extends: cc.Component,

    properties: {
        pickRadius: 0,
        paused: false,
    },

    // use this for initialization
    onLoad: function () {
        this.vel = cc.random0To1() * 2 + 3;
        this.radius = cc.random0To1() * 40 + 50;
        this.angle = 0;
        this.velAngle = cc.random0To1() * 0.05 + 0.05;

    },

    setPosition: function(position){
        this.x = position.x;
        this.y = position.y;
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
        // this.game.removeSmallDemonFromList();
        // super.destroy();
        this.node.destroy();
    },

    update: function(dt){
        var self = this;
        if(!self.paused){
            self.angle = self.angle + self.velAngle;
            self.y = self.y - self.vel;
            self.node.y = Math.cos(self.angle) * self.radius + self.y;
            self.node.x = Math.sin(self.angle) * self.radius + self.x;
        }
        if (self.getPlayerDistance() < self.pickRadius) {
            self.game.subtractEnergy(0.75);
            return;
        }
        if(self.y < (-1) * (self.game.node.height/2 + 60 + self.radius)){
            self.destroy();
            return;
        }
    },
});
