function Tile(name, owner, points, moveLimit, prey, imageUrl){
    this.owner = owner;
    this.name = name;
    this.points = points;
    this.moveLimit = moveLimit;
    this.prey = prey;
    this.imageUrl = imageUrl;
    this.visible = false;
}