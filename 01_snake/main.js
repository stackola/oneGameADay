"use strict";
var Game = (function () {
    function Game() {
        this.canvas = document.getElementById("main");
        this.context = this.canvas.getContext("2d");
        this.canvas.width = config.sizeX;
        this.canvas.height = config.sizeY;
        this.snake = new Snake(5);
        this.food = new Food();
    }
    Game.prototype.draw = function () {
        this.context.clearRect(0, 0, config.sizeX, config.sizeY);
        this.snake.draw(this.context);
        this.food.draw(this.context);
    };
    Game.prototype.tick = function () {
        this.snake.tick();
        if (this.snake.parts[0].equals(this.food.position)) {
            this.snake.eat();
            this.food = new Food();
        }
    };
    return Game;
}());
var Food = (function () {
    function Food() {
        this.position = Vector.Random();
    }
    Food.prototype.draw = function (context) {
        context.beginPath();
        context.fillStyle = "#ffff00";
        context.fillRect(this.position.x * config.tileSize, this.position.y * config.tileSize, config.tileSize, config.tileSize);
        context.closePath();
    };
    return Food;
}());
var Snake = (function () {
    function Snake(length) {
        this.hasEaten = false;
        this.length = length;
        this.parts = [Vector.Random()]; //head
        for (var i = 1; i < length; ++i) {
            this.parts.push(this.parts[this.parts.length - 1].add(new Vector(0, -1)));
        }
    }
    Snake.prototype.draw = function (context) {
        for (var i = 0; i < this.parts.length; ++i) {
            var part = this.parts[i];
            context.beginPath();
            context.fillStyle = "#ffffff";
            context.fillRect(part.x * config.tileSize, part.y * config.tileSize, config.tileSize, config.tileSize);
            context.closePath();
        }
    };
    Snake.prototype.tick = function () {
        var v = this.parts[0].add(config.direction);
        if (v.x < 0) {
            v.x = config.sizeX / config.tileSize - v.x - 2;
        }
        if (v.y < 0) {
            v.y = config.sizeY / config.tileSize - v.y - 2;
        }
        if (v.x >= config.sizeX / config.tileSize) {
            v.x = 0;
        }
        if (v.y >= config.sizeY / config.tileSize) {
            v.y = 0;
        }
        //check if new head is on any old part
        var res = this.parts.filter(function (d) { return d.equals(v); });
        if (res.length > 0) {
            console.log("you ded");
            this.parts = [Vector.Random()]; //head
            for (var i = 1; i < this.length; ++i) {
                this.parts.push(this.parts[this.parts.length - 1].add(new Vector(0, -1)));
            }
            config.direction = new Vector(0, 1);
            return;
        }
        this.parts.unshift(v);
        if (!this.hasEaten) {
            this.parts.pop();
        }
        this.hasEaten = false;
    };
    Snake.prototype.eat = function () {
        this.hasEaten = true;
    };
    return Snake;
}());
var Vector = (function () {
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector.prototype.add = function (v) {
        return new Vector(this.x + v.x, this.y + v.y);
    };
    Vector.prototype.equals = function (v) {
        return (this.x == v.x && this.y == v.y);
    };
    Vector.Random = function () {
        return new Vector(Math.floor(Math.random() * config.sizeX / config.tileSize), Math.floor(Math.random() * config.sizeY / config.tileSize));
    };
    return Vector;
}());
var config = {
    tileSize: 20,
    sizeX: 600,
    sizeY: 600,
    direction: new Vector(0, 1)
};
var g = new Game();
function tick() {
    g.tick();
    g.draw();
    setTimeout(tick, 200 - g.snake.length * 4);
}
document.onkeydown = checkKey;
function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == '38') {
        // up arrow
        config.direction = new Vector(0, -1);
    }
    else if (e.keyCode == '40') {
        // down arrow
        config.direction = new Vector(0, 1);
    }
    else if (e.keyCode == '37') {
        // left arrow
        config.direction = new Vector(-1, 0);
    }
    else if (e.keyCode == '39') {
        // right arrow
        config.direction = new Vector(1, 0);
    }
}
tick();
