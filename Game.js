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

var imgUrls = t.tiles.reduce(function(accumulated, nextTile) {
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
        }
        if((nextTile.name == 'Oak' || nextTile.name == 'Pine') && accumulated[1].indexOf(nextTile.imageUrl) == -1){
            accumulated[1].push(nextTile.imageUrl);
        }
     }  
     return accumulated;
  },
  [ ["public/img/hunter_2.jpg"], ["public/img/hunter_2.jpg"] ]  // initial value for accumulated
);
console.log(imgUrls);

var ractive = new Ractive({
    el : "#container",
    template : "#template",
    data : {
        board : board,
        imgUrls : imgUrls,
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
        event.target.className = "tile non-selected";
        return;
    }
    if (this.get("selectedTile").prey.indexOf(this.get(e.keypath).name) != -1){
        var hand = this.get("players." + this.get("turn") + ".hand");
        hand.push(this.get(e.keypath));
        this.set(e.keypath, ractive.get("selectedTile"));
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
            event.target.className += " selected";
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
    event.target.style.display = "none";
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