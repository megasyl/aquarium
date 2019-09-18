class FoodGrid {
    constructor(cellSize) {
        this.cells = [];
        this.cellXSize = windowWidth / cellSize;
        this.cellYSize = windowHeight / cellSize;
        for (let x =0, y=0; x <= windowWidth; x+=this.cellXSize) {
            for (let y=0; y <= windowHeight; y+=this.cellYSize) {
                this.cells.push({x, y, amount: FoodGrid.maxCellAmount()})
            }
        }

    }

    draw() {
        push();
        strokeWeight(0.1);
        this.cells.forEach(cell => {


            cell.amount += 0.2;
            if (cell.amount > FoodGrid.maxCellAmount())
                cell.amount = FoodGrid.maxCellAmount();
            const opacity = (cell.amount * 50) / FoodGrid.maxCellAmount();
            fill(255, 204, 0, opacity)
            rect(cell.x, cell.y, this.cellXSize, this.cellYSize);

        });
        pop();
    }

    findCell(x, y) {
        return foodGrid.cells.find((cell) => collidePointRect(x,y,cell.x,cell.y,foodGrid.cellXSize,foodGrid.cellYSize));
    }

    static maxCellAmount() {
        return 1000;
    }
}
