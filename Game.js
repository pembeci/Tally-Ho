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
        huntCoor : [],
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
ractive.on("hunt", function(e, i, j){
    if (this.get(e.keypath) == this.get("selectedTile")){
        this.set("selectedTileCoor", null);
        this.set("selectedTile", null);
        theElemenet = event.path[0];
        theElemenet.className = "tile non-selected";
        return;
    }
    if (canHunt(i, j)){
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
            this.set("huntCoor", possibleHunts(i, j));
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

function canHunt(x, y){
    return (ractive.get("huntCoor").reduce(function(result, coor){
        if (coor.x == x && coor.y == y) result = true; 
        return result;
    }, false))
}
function canMove(x, y){
    return (ractive.get("moveCoor").reduce(function(result, coor){
        if (coor.x == x && coor.y == y) result = true; 
        return result;
    }, false))
}

function possibleHunts(x, y){
    var posHunts = [];
    var selectedTile = ractive.get("selectedTile");
    if (selectedTile.moveLimit == 7){
        if (selectedTile.huntingDirection){
            var verticalArray = [];
            var i ;
            switch(selectedTile.huntingDirection){
                case 1:
                    for (var i = 0; i < x; i++){
                        verticalArray.push(ractive.get("board." + i + "." + y))
                    }
                    i = x - 1;
                    while(i > -1){
                        if (verticalArray[i] == null){
                            i--;
                        }else{
                            if (verticalArray[i].visible){
                                if (selectedTile.prey.indexOf(verticalArray[i].name) != -1){
                                    posHunts.push({ x : i, y : y });                    
                                    i = -1;
                                }else i = -1;
                            }else i = -1;
                        }
                    }
                    break;
                case 2:
                    i = y + 1;
                    while(i < ractive.get("board").length){
                        if (ractive.get("board." + x + "." + i) == null){
                            i++;
                        }else{
                            if (ractive.get("board." + x + "." + i).visible){
                                if (selectedTile.prey.indexOf(ractive.get("board." + x + "." + i + ".name")) != -1){
                                    posHunts.push({ x : x, y : i });                    
                                    i = ractive.get("board").length;
                                }else i = ractive.get("board").length;
                            }else i = ractive.get("board").length;
                        }
                    }
                    break;
                case 3:
                    for (var i = 0; i < ractive.get("board").length; i++){
                        verticalArray.push(ractive.get("board." + i + "." + y))
                    }
                    i = x + 1;
                    while(i < verticalArray.length){
                        if (verticalArray[i] == null){
                            i++;
                        }else{
                            if (verticalArray[i].visible){
                                if (selectedTile.prey.indexOf(verticalArray[i].name) != -1){
                                    posHunts.push({ x : i, y : y });                    
                                    i = verticalArray.length;
                                }else i = verticalArray.length;
                            }else i = verticalArray.length;
                        }
                    }
                    break;
                case 4:
                    i = y - 1;
                    while(i > -1){
                        if (ractive.get("board." + x + "." + i) == null){
                            i--;
                        }else{
                            if (ractive.get("board." + x + "." + i).visible){
                                if (selectedTile.prey.indexOf(ractive.get("board." + x + "." + i + ".name")) != -1){
                                    posHunts.push({ x : i, y : y });                    
                                    i = -1;
                                }else i = -1;
                            }else i = -1;
                        }
                    }
                    break;
            }
        }else {
            var forward = y + 1;
            var back = y - 1;
            while(forward != ractive.get("board").length || back >= 0){
                if (back > -1){
                    if (ractive.get('board.' + x + '.' + back) == null){
                        back--;
                    }else{
                        if (ractive.get('board.' + x + '.' + back + ".visible")){
                            if (selectedTile.prey.indexOf(ractive.get("board." + x + "." + back).name) != -1){
                                posHunts.push({ x : x, y : back });                    
                                back = -1;
                            }else back = -1;
                        }else back = -1;
                    }
                }
                if (forward < ractive.get("board").length){
                    if (ractive.get('board.' + x + '.' + forward) == null){
                        forward++;
                    }else{
                        if (ractive.get('board.' + x + '.' + forward + ".visible")){
                            if (selectedTile.prey.indexOf(ractive.get("board." + x + "." + forward).name) != -1){
                                posHunts.push({ x : x, y : forward });                    
                                forward = ractive.get("board").length
                            }else forward = ractive.get("board").length
                        }else forward = ractive.get("board").length
                    }
                }
            }
            back = x - 1 ;
            forward = x + 1;
            var verticalArray = [];
            for (var i = 0; i < ractive.get("board").length; i++){
                verticalArray.push(ractive.get("board." + i + "." + y))
            }
            while(forward < verticalArray.length || back >= 0){
                if (back != -1){
                    if (ractive.get('board.' + back + '.' + y) == null){
                        back--;
                    }else{
                        if (ractive.get('board.' + back + '.' + y + ".visible")){
                            if (selectedTile.prey.indexOf(ractive.get("board." + back + "." + y).name) != -1){
                                posHunts.push({ x : back, y : y });                    
                                back = -1;
                            }else back = -1;
                        }else back = -1;
                    }
                }
                if (forward != verticalArray.length){
                    if (ractive.get('board.' + forward + '.' + y) == null){
                        forward++;
                    }else{
                        if (ractive.get('board.' + forward + '.' + y + ".visible")){
                            if (selectedTile.prey.indexOf(ractive.get("board." + forward + "." + y).name) != -1){
                                posHunts.push({ x : forward, y : y });                    
                                forward = verticalArray.length;
                            }else forward = verticalArray.length; 
                        }else forward = verticalArray.length;
                    }
                }
            }
        }
        
    }else if (selectedTile.moveLimit == 1){
        for (var i = x - selectedTile.moveLimit; i <= x + selectedTile.moveLimit; i++){
           for(var j = y - selectedTile.moveLimit; j <= y + selectedTile.moveLimit; j++){
              
               if (i == x || j == y){
                   if (ractive.get('board.' + i + '.' + j + ".visible") && ractive.get('board.' + i + '.' + j) != null){
                       if (selectedTile.prey.indexOf(ractive.get('board.' + i + '.' + j).name) != -1){
                           posHunts.push({ x : i, y : j });
                       }    
                   }
               }
           } 
        }
    }
    return posHunts;
}

function possibleMoves(x, y){
    var posMoves = []
    var limit = ractive.get("selectedTile").moveLimit;
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
        back = x - 1 ;
        forward = x + 1;
        var verticalArray = [];
        for (var i = 0; i < ractive.get("board").length; i++){
            verticalArray.push(ractive.get("board." + i + "." + y))
        }
        while(forward != verticalArray.length || back >= 0){
            if (back != -1){
                if (ractive.get("board." + back + "." + y) == null){
                    posMoves.push({ x : back, y : y });
                    back--;
                }else back = -1; 
            }
            if (forward != verticalArray.length){
                if (ractive.get("board." + forward + "." + y) == null){
                    posMoves.push({ x : forward, y : y });
                    forward++;
                }else forward = verticalArray.length
            }
        }
    }
    else if(limit == 1){
        for (var i = x - limit; i <= x + limit; i++){
           for(var j = y - limit; j <= y + limit; j++){
               if (i == x || j == y){
                   if (ractive.get('board.' + i + '.' + j) == null){
                       posMoves.push({ x : i, y : j });
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