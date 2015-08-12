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
        moveCoor : [],
        players : [],
        turn : 0
    }
});
ractive.push("players", t.blue);
ractive.push("players", t.brown);
ractive.on("showTile", function(e){
    ractive.set(e.keypath + ".visible", true);
    changeTurn();
});

ractive.on("move", function(e, i, j){
    if (canMove(i, j)){
        this.set(e.keypath, this.get("selectedTile"));
        this.set(this.get("selectedTileCoor"), null);
        this.set("selectedTile", null)
    }
    changeTurn();
});
ractive.on("hit", function(e, i, j){
    if (this.get(e.keypath) == this.get("selectedTile")){
        this.set("selectedTileCoor", null);
        this.set("selectedTile", null);
        theElemenet = event.path[0];
        theElemenet.className = "tile non-selected";
        return;
    }
    if (this.get("selectedTile").prey.indexOf(this.get(e.keypath).name) != -1){
        var hand = this.get("players." + this.get("turn") + ".hand");
        hand.push(this.get(e.keypath));
        this.set(e.keypath, ractive.get("selectedTile"))
        this.set(this.get("selectedTileCoor"), null);
        this.set("selectedTile", null)
    }
    changeTurn();
});

ractive.on("selectTile", function(e, i, j){
    if (this.get("players." + this.get("turn")).name == this.get(e.keypath).owner.name ||
       this.get(e.keypath).owner == "all"){
        if (this.get(e.keypath).name != "Oak" && this.get(e.keypath).name != "Pine"){
            this.set("selectedTile", this.get(e.keypath));
            this.set("selectedTileCoor", e.keypath);
            theElemenet = event.path[0];
            theElemenet.className += " selected";
            this.set('moveCoor', possibleMoves(i, j));    
        }
    }
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

function changeTurn(){
    ractive.set("turn", ractive.get("turn") == 1 ? 0 : 1)
}

function canMove(x, y){
    return (ractive.get("moveCoor").reduce(function(result, coor){
        if (coor.x == x && coor.y == y) result = true; 
        return result;
    }, false))
}

function possibleMoves(x, y){
    var posMoves = []
    limit = ractive.get("selectedTile").moveLimit;
    if(limit == 7){
        var forward = y + 1;
        var back = y - 1;
        while(forward != ractive.get("board").length || back >= 0){
            if (back != -1){
                if (ractive.get("board." + x + "." + back) == null){
                    posMoves.push({ x : x, y : back });                    
                    back--;
                }else back = -1; 
            }
            if (forward != ractive.get("board").length){
                if (ractive.get("board." + x + "." + forward) == null){
                    posMoves.push({ x : x, y : forward });
                    forward++;
                }else forward = ractive.get("board").length
            }
        }
        var up = x - 1 ;
        var down = x + 1;
        var verticalArray = [];
        for (var i = 0; i < ractive.get("board").length; i++){
            verticalArray.push(ractive.get("board." + i + "." + y))
        }
        while(forward != verticalArray.length || up >= 0){
            if (up != -1){
                if (ractive.get("board." + up + "." + y) == null){
                    posMoves.push({ x : x, y : up });
                    up--;
                }else up = -1; 
            }
            if (forward != verticalArray.length){
                if (ractive.get("board." + down + "." + y) == null){
                    posMoves.push({ x : x, y : down });
                    down++;
                }else down = ractive.get("board").length
            }
        }
    }
    else if(limit == 1){
        for (var i = x - limit; i <= x + limit; i++){
           for(var j = y - limit; j <= y + limit; j++){
               if (i == x || j == y){
                   if (ractive.get('board.' + i + '.' + j) == null){
                       posMoves.push({ x : i, y : j });
                       console.log(i ,j);
                   }
               }
           } 
        }
    };
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