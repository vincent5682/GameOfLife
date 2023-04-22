var grid;
var Grid = /** @class */ (function () {
    function Grid(width, height) {
        this.cells = [];
        this.width = width;
        this.height = height;
        for (var x = 0; x < this.width; x++) {
            this.cells[x] = [];
            for (var y = 0; y < this.height; y++) {
                this.cells[x][y] = new Cell(x, y, Math.random() < 0.5);
            }
        }
    }
    Grid.prototype.getNeighbors = function (cell) {
        var _this = this;
        var neighbors = 0;
        var operators = [-1, 0, 1];
        operators.forEach(function (xdiff) {
            operators.forEach(function (ydiff) {
                if (xdiff !== 0 && ydiff !== 0) {
                    var x = cell.x + xdiff;
                    var y = cell.y + ydiff;
                    if (x > _this.width - 1) {
                        x = 0;
                    }
                    if (x < 0) {
                        x = _this.width - 1;
                    }
                    if (y > _this.height - 1) {
                        y = 0;
                    }
                    if (y < 0) {
                        y = _this.height - 1;
                    }
                    var myCell = _this.cells[x][y];
                    if (myCell.alive) {
                        neighbors++;
                    }
                }
            });
        });
        return neighbors;
    };
    return Grid;
}());
var Cell = /** @class */ (function () {
    function Cell(x, y, alive) {
        this.x = x;
        this.y = y;
        this.alive = alive;
    }
    return Cell;
}());
function game() {
    var width = parseInt(document.getElementById('width').value);
    var height = parseInt(document.getElementById('height').value);
    var iterations = parseInt(document.getElementById('iterations').value);
    grid = new Grid(width, height);
    render(grid);
    var num = 0;
    var interval = setInterval(function () {
        if (num >= iterations) {
            clearInterval(interval);
        }
        num++;
        startIteration();
    }, 1000);
}
function render(grid) {
    var gridElement = document.getElementById('grid');
    if (!gridElement) {
        return;
    }
    gridElement.innerHTML = "";
    var tickbox = "✅";
    var crossmark = "❌";
    for (var y = 0; y < grid.height; y++) {
        for (var x = 0; x < grid.width; x++) {
            var cell = grid.cells[x][y];
            gridElement.append((cell.alive ? tickbox : crossmark));
        }
        gridElement.append(document.createElement('br'));
    }
}
function iteration(grid) {
    var cellsInfo = [];
    for (var x = 0; x < grid.width; x++) {
        cellsInfo[x] = [];
        for (var y = 0; y < grid.height; y++) {
            var neighbors = grid.getNeighbors(grid.cells[x][y]);
            if (grid.cells[x][y].alive) {
                if (neighbors == 0 || neighbors == 1) {
                    cellsInfo[x][y] = false;
                }
                if (neighbors >= 4) {
                    cellsInfo[x][y] = false;
                }
                if (neighbors == 2 || neighbors == 3) {
                    cellsInfo[x][y] = true;
                }
            }
            else {
                if (neighbors == 3) {
                    cellsInfo[x][y] = true;
                }
                else {
                    cellsInfo[x][y] = false;
                }
            }
        }
    }
    for (var x = 0; x < grid.width; x++) {
        for (var y = 0; y < grid.height; y++) {
            grid.cells[x][y].alive = cellsInfo[x][y];
        }
    }
}
function startIteration() {
    iteration(grid);
    render(grid);
}
