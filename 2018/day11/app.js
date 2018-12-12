class Day {
    constructor(gridSerialNumber) {
        this.gridSerialNumber = gridSerialNumber;
        // console.log(this.part1());
        console.log(this.part2());
    }

    part1() {
        let matrix = [];
        for (let i = 1; i <= 300; i++) {
            matrix[i] = [];
            for (let j = 1; j <= 300; j++) {
                let rackId = i + 10;
                let powerLevel = rackId * j;
                powerLevel += this.gridSerialNumber;
                powerLevel = powerLevel * rackId;
                powerLevel = parseInt(powerLevel / 100) % 10;
                powerLevel -= 5;
                matrix[i][j] = {powerLevel,x:i,y:j}
            }
        }
        
        let maxCell = this.maxCellGroup(3, matrix);
        return maxCell.x+','+maxCell.y;
    }
    maxCellGroup(groupSize, matrix){
        let max = -1000000000;
        let maxCell = null;
        for (let i = 1; i <= 300-groupSize+1; i++) {
            for (let j = 1; j <= 300 - groupSize + 1; j++) {
                let sum = 0;
                for (let x = 0; x < groupSize; x++) {
                    for (let y = 0; y < groupSize; y++) {
                        sum += matrix[i + x][j + y].powerLevel;
                    }
                }
                matrix[i][j].sum = sum;

                if (sum > max) {
                    max = sum;
                    maxCell = matrix[i][j];
                }

            }
        }
        return Object.assign({groupSize},maxCell)
    }

    part2() {
        let matrix = [];
        for (let i = 1; i <= 300; i++) {
            matrix[i] = [];
            for (let j = 1; j <= 300; j++) {
                let rackId = i + 10;
                let powerLevel = rackId * j;
                powerLevel += this.gridSerialNumber;
                powerLevel = powerLevel * rackId;
                powerLevel = parseInt(powerLevel / 100) % 10;
                powerLevel -= 5;
                matrix[i][j] = { powerLevel, x: i, y: j }
            }
        }
        let max = -1000000000;
        let maxCell = null;
        for (let k = 1; k <= 300; k++) {

            let tempMax = this.maxCellGroup(k, matrix);
            if (tempMax.sum>max){
                max = tempMax.sum;
                maxCell = tempMax
            }
        }
        console.log(maxCell);
        return maxCell.x + ',' + maxCell.y + ','+maxCell.groupSize;
    }

};

function day(gridSerialNumber){
    new Day(gridSerialNumber);
}

// day(18);
day(8868);
