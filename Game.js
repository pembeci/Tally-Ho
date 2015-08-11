board = [
        [ [], [], [], [], [], [], [] ],
        [ [], [], [], [], [], [], [] ],
        [ [], [], [], [], [], [], [] ],
        [ [], [], [], null, [], [], [] ],
        [ [], [], [], [], [], [], [] ],
        [ [], [], [], [], [], [], [] ],
        [ [], [], [], [], [], [], [] ]
    ];
var a = new Player("ersan");
var b = new Player("meltem");
 
var t = new TallyHo();
t.setBlue(a);
t.setBrown(b);
t.createBlues();
t.createGreens();
t.createBrowns();
      
var ractive = new Ractive({
    el : "#container",
    template : "#template",
    data : {
        board : board,
        tiles : shuffle(t.tiles),
        selectedTile : null,
        selectedTileCoor : null,
        blue : t.blue,
        brown : t.brown,
        moveCoor : []
    }
});

ractive.on("showTile", function(e){
    ractive.set(e.keypath + ".visible", true);
});

ractive.on("move", function(e, i, j){
    if (canMove(i, j)){
        this.set(e.keypath, this.get("selectedTile"));
        this.set(this.get("selectedTileCoor"), null);
        this.set("selectedTile", null)
    }
    
});
ractive.on("hit", function(e, i, j){
    console.log(i, j)
    if (this.get("selectedTile").prey.indexOf(this.get(e.keypath).name)>= 0)
        alert();
});

ractive.on("selectTile", function(e, i, j){
    console.log(i, j)
    console.log(event)
    theElemenet = event.path[0];
    this.set("selectedTile", this.get(e.keypath));
    this.set("selectedTileCoor", e.keypath);
    console.log(this.get("selectedTile"));
    theElemenet.className += " selected";
    ractive.set('moveCoor', possibleMoves(i, j));
});

ractive.on("tilePlacement", function(){
    for(var i = 0; i < this.get("board").length; i++){
        for(var j = 0; j < this.get("board").length; j++){
            if (i == 3 && j == 3) continue;
            ractive.set("board[" + i + "][ " + j + " ]", ractive.get("tiles").pop())
        }
    }
    console.log("Placement is done.")
});

function canMove(x, y){
    return (ractive.get("moveCoor").reduce(function(result, coor){
        if (coor.x == x && coor.y == y) return result = true;
    }, false))
}
function possibleMoves(x, y){
    var posMoves = []
    limit = ractive.get("selectedTile").moveLimit;
    if(limit == 7){
        console.log('limit must be 7 =>', limit);
        for (var i = 0; i < limit; i++){
            for (var j = 0; j < limit; j++){
                if( ((0 <= Math.abs(x - i) && Math.abs(x - i) <= 6) && (y - j == 0)) || ((x - i == 0) && (0 <= Math.abs(y - j) && Math.abs(y - j) <= 6)) ){
                    if(x != i || y != j){
                        if (ractive.get('board.' + i + '.' + j) == null){
                            posMoves.push({ x : i, y : j });
                            console.log(i ,j)
                        }
                            
                    }
                }
            }
        }
    }
    else if(limit == 1){
        console.log('limit must be 1 =>', limit);
        for (var i = -limit; i <= limit; i++){
            for (var j = -limit; j <= limit; j++){
                if(Math.abs(i) != Math.abs(j)){
                    if (ractive.get('board.' + x - i + '.' + y - j) == null){
                        posMoves.push( { x : x - i, y : y - j } );
                        console.log(i ,j)
                    }
                    //posMoves.push( { x : x - i, y : y - j } );
                }
            }
        }
    }   /*
    posMoves = posMoves.filter(function(obj){
        var theCell = ractive.get('board.' + obj.x + '.' + obj.y)
        return ( theCell == false );/*some posiblities are not covered eatable objs will be added etc.
    });
    /*
    // print posible moves list
    posMoves.forEach(function(obj){
        console.log(obj.x + "," + obj.y);
    });
    console.log(posMoves.length);*/
    return posMoves;
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex ;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
};

/*function Game(){
    this.board = [
        [ [], [], [], [], [], [], [] ],
        [ [], [], [], [], [], [], [] ],
        [ [], [], [], [], [], [], [] ],
        [ [], [], [], [], [], [], [] ],
        [ [], [], [], [], [], [], [] ],
        [ [], [], [], [], [], [], [] ],
        [ [], [], [], [], [], [], [] ]
    ];
}
Game.prototype.tilePlacement = function(tiles){
    var currentIndex = tiles.length, temporaryValue, randomIndex ;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = tiles[currentIndex];
        tiles[currentIndex] = tiles[randomIndex];
        tiles[randomIndex] = temporaryValue;
    }
    for(var i = 0; i < this.board.length; i++){
        for(var j = 0; j < this.board.length; j++){
            if (i == 3 && j == 3) continue;
            this.board[i][j] = tiles.pop()
        }
    }
<<<<<<< HEAD
}*/