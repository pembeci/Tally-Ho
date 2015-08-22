board = [
        [ [], [], [], [], [], [], [] ],
        [ [], [], [], [], [], [], [] ],
        [ [], [], [], [], [], [], [] ],
        [ [], [], [], null, [], [], [] ],
        [ [], [], [], [], [], [], [] ],
        [ [], [], [], [], [], [], [] ],
        [ [], [], [], [], [], [], [] ]
    ];

var t = new TallyHo();

var ractive = new Ractive({
    el : "#container",
    template : "#template",
    data : {
        gamePhase: 'pickName', /*gameStart, gameInit*/
        board : board,
        imgUrls : [],
        tiles : null,
        selectedTile : null,
        selectedTileCoor : null,
        moveCoor : [],
        huntCoor : [],
        players : [],
        turn : 0
    },
    computed : {
        blueHand: function(){
            if (this.get("players").length == 2){
                return (this.get("players.0.hand").reduce(function(hand, tile){
                    hand[tile.name]++;
                    return hand;
                }, { Hunter : 0,
                     Bear : 0,
                     Fox : 0,
                     Pheasant : 0,
                     Duck : 0,
                     Lumberjack : 0
                    }))
            }
        },
        blueHandPoint : function(){
          return (this.get("players.0.hand").reduce(function(total, tile){
              return total + tile.points;
          }, 0))  
        },
        brownHand : function(){
            if (this.get("players").length == 2){
                return (this.get("players.1.hand").reduce(function(hand, tile){
                    hand[tile.name]++;
                    return hand;
                }, { Hunter : 0,
                     Bear : 0,
                     Fox : 0,
                     Pheasant : 0,
                     Duck : 0,
                     Oak : 0,
                     Pine : 0,
                     Lumberjack : 0
                    }))
            }
        },
        brownHandPoint : function(){
          return (this.get("players.1.hand").reduce(function(total, tile){
              return total + tile.points;
          }, 0))  
        },
        isAllVisible : function(){
            if (this.get("gamePhase") == "gameStart"){
                var result = true;
                for (var i = 0; i < this.get("board").length; i++){
                    for (var j = 0; j < this.get("board").length; j++){
                        if (this.get("board." + i + "." + j) != null && this.get("board." + i + "." + j + ".visible") == false){
                            result = false;
                            break;
                        }
                    }
                    if (!result) break;
                }
                return result;
            }else return false;
        },
        isGameFinish : function(){
            if (this.get("players").length == 2){
                if (this.get("players").filter(function(player){
                        if (player.remainingMoves == 0) return player;
                    }).length == 2)
                    return true;
                else return false;
            }
        }
    }
});

ractive.on("p1ready", function(){
    var name = ractive.get("player1name") ? ractive.get("player1name") : 'Blue';
    if (this.get('players.1')){
        if(this.get('players.1').name == name){
            name = name + "(1)";
        }
    }
    var playerBlue = new Player(name);
    playerBlue.remainingMoves = 5;
    t.setBlue(playerBlue);
    ractive.set("players.0", t.blue);
    event.target.style.display = 'none';
    if(ractive.get('players').length == 2){
        ractive.set('gamePhase', 'gameInit');
        return;
    }
});

ractive.on("p2ready", function() {
    if(ractive.get('players.0') == undefined) {
        var name = ractive.get("player1name") ? ractive.get("player1name") : 'Blue';
        if (this.get('players.1')){
            if(this.get('players.1').name == name){
                name = name + "(1)";
            }
        }
        var playerBlue = new Player(name);
        playerBlue.remainingMoves = 5;
        t.setBlue(playerBlue);
        ractive.set("players.0", t.blue);
        event.target.style.display = 'none';
        if(ractive.get('players').length == 2){
            ractive.set('gamePhase', 'gameInit');
            return;
        }
    };
    var name = ractive.get("player2name") ? ractive.get("player2name") : 'Brown';
    if (this.get('players.0')){
        if(this.get('players.0').name == name){
            name = name + "(1)";
        }
    }
    var playerBrown = new Player(name);
    playerBrown.remainingMoves = 5;
    t.setBrown(playerBrown);
    ractive.set("players.1", t.brown);
    event.target.style.display = 'none'; 
    if(ractive.get('players').length == 2){
        ractive.set('gamePhase', 'gameInit');
        return;
    }
});

ractive.on("showTile", function(e){
    ractive.set(e.keypath + ".visible", true);
    calculateTotalMoves();
    changeTurn();
});

ractive.on("move", function(e, i, j){
    if (canMove(i, j)){
        if (this.get("isAllVisible")) calculateRemaningMoves()
        this.set(e.keypath, this.get("selectedTile"));
        this.set(this.get("selectedTileCoor"), null);
        this.set("selectedTile", null);
        calculateTotalMoves();
        changeTurn();
    }
});

ractive.on("hunt", function(e, i, j){
    if (this.get(e.keypath) == this.get("selectedTile")){
        this.set("selectedTileCoor", null);
        this.set("selectedTile", null);
        event.target.className = "tile non-selected";
        return;
    }
    if (canHunt(i, j)){
        if (this.get("isAllVisible")) calculateRemaningMoves()
        this.push("players." + this.get("turn") + ".hand", this.get(e.keypath));
        //hand.push(this.get(e.keypath));
        this.set(e.keypath, ractive.get("selectedTile"));
        this.set(this.get("selectedTileCoor"), null);
        this.set("selectedTile", null);
        calculateTotalMoves();
        changeTurn();
    }
});

ractive.on("selectTile", function(e, i, j){
    if (this.get("players." + this.get("turn")).name == this.get(e.keypath).owner.name ||
       this.get(e.keypath).owner == "all"){
        if (this.get(e.keypath).name != "Oak" && this.get(e.keypath).name != "Pine"){
            this.set("selectedTile", this.get(e.keypath));
            this.set("selectedTileCoor", e.keypath);
            this.set('moveCoor', possibleMoves(i, j));
            this.set("huntCoor", possibleHunts(i, j));
            event.target.className += " selected";
            if (this.get("isAllVisible")){
                if (this.get(e.keypath).name != "Pheasant" && this.get(e.keypath).name != "Duck"){
                   if (e.keypath == "board.0.3" || e.keypath == "board.3.0" || e.keypath == "board.3.6" || e.keypath == "board.6.3"){
                        pickOwnTiles(e);
                        calculateRemaningMoves();
                        changeTurn(); 
                    }
                }
            }
        }
    }
});

ractive.on("tilePlacement", function(){
    //Creating Tiles
    t.createBlues();
    t.createGreens();
    t.createBrowns();
    this.set('imgUrls', findImgUrls());
    this.set('tiles', shuffle(t.tiles));
    for(var i = 0; i < this.get("board").length; i++){
        for(var j = 0; j < this.get("board").length; j++){
            if (i == 3 && j == 3) continue;
            ractive.set("board[" + i + "][ " + j + " ]", ractive.get("tiles").pop());
        }
    }
    ractive.set('gamePhase', 'gameStart');
});

function pickOwnTiles(e){
    if (ractive.get(e.keypath).owner.name == ractive.get("players." + ractive.get("turn")).name){
        ractive.push("players." + ractive.get("turn") + ".hand", ractive.get(e.keypath));
        ractive.set(ractive.get("selectedTileCoor"), null);
        ractive.set("selectedTile", null);
    }
}

function calculateTotalMoves(){
    var moves = ractive.get("players." + ractive.get("turn") + ".moves");
    ractive.set("players." + ractive.get("turn") + ".moves", ++moves);
}

function calculateRemaningMoves(){
    var remaningMoves = ractive.get("players." + ractive.get("turn") + ".remainingMoves");
    ractive.set("players." + ractive.get("turn") + ".remainingMoves", --remaningMoves);
    return remaningMoves;
}

function changeTurn(){
    ractive.set("turn", ractive.get("turn") == 1 ? 0 : 1);
}

function canHunt(x, y){
    return (ractive.get("huntCoor").reduce(function(result, coor){
        if (coor.x == x && coor.y == y) result = true; 
        return result;
    }, false));
}

function canMove(x, y){
    return (ractive.get("moveCoor").reduce(function(result, coor){
        if (coor.x == x && coor.y == y) result = true; 
        return result;
    }, false));
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
                                    posHunts.push({ x : x, y : i });                    
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
                                forward = ractive.get("board").length;
                            }else forward = ractive.get("board").length;
                        }else forward = ractive.get("board").length;
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
    var posMoves = [];
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
                }else forward = ractive.get("board").length;
            }
        }
        back = x - 1 ;
        forward = x + 1;
        var verticalArray = [];
        for (var i = 0; i < ractive.get("board").length; i++){
            verticalArray.push(ractive.get("board." + i + "." + y));
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
                }else forward = verticalArray.length;
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

function findImgUrls(){ /*return a array*/ 
    return t.tiles.reduce(function(accumulated, nextTile) {
         if (nextTile.owner == t.blue){
            if(accumulated[0].indexOf(nextTile.imageUrl) == -1){
                accumulated[0].push(nextTile.imageUrl);
                accumulated[1].push(nextTile.imageUrl);
            }
         }
         else if(nextTile.owner == t.brown){
            if(nextTile.name != 'Hunter' && accumulated[1].indexOf(nextTile.imageUrl) == -1){
                accumulated[0].push(nextTile.imageUrl);
                accumulated[1].push(nextTile.imageUrl);
            }
         }
         else{
            if((nextTile.name == 'Pheasant' || nextTile.name == 'Duck') && accumulated[0].indexOf(nextTile.imageUrl) == -1){
                accumulated[0].push(nextTile.imageUrl);
                accumulated[1].push(nextTile.imageUrl);
            }
            if((nextTile.name == 'Oak' || nextTile.name == 'Pine') && accumulated[1].indexOf(nextTile.imageUrl) == -1){
                accumulated[1].push(nextTile.imageUrl);
            }
         }  
         return accumulated;
      },
      [ ["public/img/hunter_2.jpg"], ["public/img/hunter_2.jpg"] ]  // initial value for accumulated
    );
}