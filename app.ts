let grid: Grid

class Grid {
    public width: number
    public height: number
    public cells: Cell[][] = []

    public constructor(width: number, height: number) {
        this.width = width
        this.height = height

        for (let x = 0; x < this.width; x++) {
            this.cells[x] = []
            for (let y = 0; y < this.height; y++) {
                this.cells[x][y] = new Cell(x, y, Math.random() < 0.5)
            }
        }
    }

    public getNeighbors(cell: Cell): number {
        let neighbors: number = 0
        let operators: number[] = [-1, 0, 1]

        operators.forEach((xdiff) => {
            operators.forEach((ydiff) => {
                if (xdiff !== 0 && ydiff !== 0) {
                    let x: number = cell.x + xdiff
                    let y: number = cell.y + ydiff
                    if (x > this.width - 1) {
                        x = 0
                    }
                    if (x < 0) {
                        x = this.width - 1
                    }
                    if (y > this.height - 1) {
                        y = 0
                    }
                    if (y < 0) {
                        y = this.height - 1
                    }
                    let myCell: Cell = this.cells[x][y]
                    if (myCell.alive) {
                        neighbors++
                    }
                }
            });
        });

        return neighbors
    }
}

class Cell {
    public x: number
    public y: number
    public alive: boolean

    public constructor(x: number, y: number, alive: boolean) {
        this.x = x
        this.y = y
        this.alive = alive
    }
}

function game() {
    let width: number = parseInt((<HTMLInputElement>document.getElementById('width')).value)
    let height: number = parseInt((<HTMLInputElement>document.getElementById('height')).value)
    let iterations: number = parseInt((<HTMLInputElement>document.getElementById('iterations')).value)

    grid = new Grid(width, height)
    render(grid)
    let num: number = 0
    let interval = setInterval(() => {
        if(num >= iterations) {clearInterval(interval)} 
        num++
        startIteration()
    }, 1000);
}

function render(grid: Grid) {
    const gridElement = document.getElementById('grid')
    if (!gridElement) {
        return;
    }
    gridElement.innerHTML = ""
    let tickbox: string = "✅"
    let crossmark: string = "❌"
    for (let y = 0; y < grid.height; y++) {
        for (let x = 0; x < grid.width; x++) {
            let cell: Cell = grid.cells[x][y]
            gridElement.append((cell.alive ? tickbox : crossmark))
        }
        gridElement.append(document.createElement('br'))
    }
}

function iteration(grid: Grid) {
    let cellsInfo: boolean[][] = []
    for (let x = 0; x < grid.width; x++) {
        cellsInfo[x] = []
        for (let y = 0; y < grid.height; y++) {
            let neighbors:number = grid.getNeighbors(grid.cells[x][y])
            if(grid.cells[x][y].alive) {
                if(neighbors == 0 || neighbors == 1) {
                    cellsInfo[x][y] = false
                }
                if(neighbors >= 4) {
                    cellsInfo[x][y] = false
                }
                if(neighbors == 2 || neighbors == 3) {
                    cellsInfo[x][y] = true
                }
            }
            else {
                if(neighbors == 3) {
                    cellsInfo[x][y] = true
                }
                else {
                    cellsInfo[x][y] = false
                }
            }
        }
    }
    for (let x = 0; x < grid.width; x++) {
        for (let y = 0; y < grid.height; y++) {
            grid.cells[x][y].alive = cellsInfo[x][y]
        }
    }
}

function startIteration() {
    iteration(grid)
    render(grid)
}


