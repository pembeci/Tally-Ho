board = [
        [ [], [], [], [], [], [], [] ],
        [ [], [], [], [], [], [], [] ],
        [ [], [], [], [], [], [], [] ],
        [ [], [], [], [], [], [], [] ],
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

ractive.on("move", function(e){
    /*if (this.get('selectedTile')){
        console.log(e)
        ractive.set(e.keypath, this.get('selectedTile'));
        ractive.set("selectedTile", null);
        ractive.set(this.get("selectedTileCoor"), []);        
    }*/
});
ractive.on("hit", function(e, i, j){
    console.log(i, j)
    if (this.get("selectedTile").prey.indexOf(this.get(e.keypath).name)>= 0)
        alert();
});
function possibleMoves(x, y, limit){
    for (var i = 0; i < 7; i++){
        for (var j = 0; j < 7; j++){
            if ((x - i <= limit && y - j = 0) || (x - i = 0 && y - j <= limit)){
                
            }
        }    
    }
}
ractive.on("selectTile", function(e, i, j){
    console.log(i, j)
    console.log(event)
    theElemenet = event.path[0];
    this.set("selectedTile", this.get(e.keypath));
    this.set("selectedTileCoor", e.keypath);
    console.log(this.get("selectedTile"));
    theElemenet.className += " selected";
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
}*/

        
        
        
        
        
        