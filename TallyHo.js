function TallyHo(){
    this.blue;
    this.brown;
    this.tiles = [];
}
TallyHo.prototype.blueNumbers = [2, 6];
TallyHo.prototype.brownNumbers = [2, 8];
TallyHo.prototype.greenNumbers = [8, 7, 8, 7];

TallyHo.prototype.setBrown = function(player){
    this.brown = player;
};

TallyHo.prototype.setBlue = function(player){
    this.blue = player;
};

TallyHo.prototype.createBlues = function(){
    for (var i = 0; i < this.blueNumbers[0]; i++){
        var bear = new Tile("Bear", this.blue, 10, 1, ["Hunter", "Lumberjack"], "");
        this.tiles.push(bear);
    }
    for (var i = 0; i < this.blueNumbers[1]; i++){
        var fox = new Tile("Fox", this.blue, 5, 7, ["Duck", "Pheasant"], "");
        this.tiles.push(fox);
    }
};

TallyHo.prototype.createBrowns = function(){
    for (var i = 0; i < this.brownNumbers[0]; i++){
        var lumberjack = new Tile("Lumberjack", this.brown, 5, 1, ["Oak", "Pine"], "");
        this.tiles.push(lumberjack);
    }
    for (var i = 0; i < this.brownNumbers[1]; i++){
        var random = Math.floor((Math.random() * 4) + 1);
        var hunter = new Tile("Hunter", this.brown, 5, 7, ["Pheasant", "Duck", "Bear", "Fox"], "hunter_" + random + ".jpge");
        hunter.huntingDirection = random;
        this.tiles.push(hunter);
    }
};

TallyHo.prototype.createGreens = function(){
    for (var i = 0; i < this.greenNumbers[0]; i++){
        var pheasant = new Tile("Pheasant", "none", 3, 7, [], "");
        this.tiles.push(pheasant);
    }
    for (var i = 0; i < this.greenNumbers[1]; i++){
        var duck = new Tile("Duck", "none", 2, 7, [], "");
        this.tiles.push(duck);
    }
    for (var i = 0; i < this.greenNumbers[2]; i++){
        var oak = new Tile("Oak", "none", 2, 0, [], "");
        this.tiles.push(oak);
    }
    for (var i = 0; i < this.greenNumbers[3]; i++){
        var pine = new Tile("Pine", "none", 2, 0, [], "");
        this.tiles.push(pine);
    }
};