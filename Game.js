board = [
        [ [], [], [], [], [], [], [] ],
        [ [], [], [], [], [], [], [] ],
        [ [], [], [], [], [], [], [] ],
        [ [], [], [], [], [], [], [] ],
        [ [], [], [], [], [], [], [] ],
        [ [], [], [], [], [], [], [] ],
        [ [], [], [], [], [], [], [] ]
    ];

var ractive = new Ractive({
    el : "#container",
    template : "#template",
    data : {
        board : board,
        tiles : shuffle(t.tiles)
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