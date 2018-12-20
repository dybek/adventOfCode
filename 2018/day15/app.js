const fs = require('fs')
const path = require('path')

var Utils = {
    intersections: function(collection1, collection2, comparator){
        let result = []
        collection1.forEach(el1=> collection2.forEach(el2=>{
            if(comparator(el1,el2) == 0){
                result.push(el1);
            }
        }));
        return result;
    }

}

class Cell{
    constructor(token, x, y){
        this.token = token;
        this.x = x;
        this.y = y;
        if(token == 'G' || token == 'E'){
            this.soldier = new Soldier(token);
        }
    }
}
class Soldier{
    constructor(kind){
        this.kind = kind; //E,G
        this.hp = 200;
        this.minusHP = 3;
    }
    hit(){
        this.hp -= this.minusHP;
    }
}
class Day {
    constructor(rows) {
        this.rows = rows;

        this.makeBoard();
        // console.log(this.part1());
        console.log(this.part2());
    }
    makeBoard(){
        let y = 0;
        this.board = this.rows.map(row => {
            let x = 0;
            let oneRow = [...row].map(field => {
                return new Cell(field, x++, y);
            })
            y++;
            return oneRow;
        })
    }
    setElfHit(minusHP){
        for (let y = 0; y < this.board.length; y++) {
            let row = this.board[y];
            for (let x = 0; x < row.length; x++) {
                if (row[x].soldier != null && row[x].soldier.kind == 'G') {
                    row[x].soldier.minusHP = minusHP
                }
            }
        }
    }

    boardCopy(){
        return this.board.map(row=>[...row].map(cell=>cell.token));
    }

    printBoard(){
        this.board.forEach(row => {
            console.log(row.map(el=>el.token).join(''))
        });
        this.board.forEach(row => {
            console.log(row.map(el => el.soldier ? (el.token+'('+el.soldier.hp+')') : '').join(''))
        });
    }
    printDistanceBoard(board) {
        board.forEach(row => {
            console.log(row.join(''))
        });
    }

    part2(){
        this.makeBoard();
        let elvesCount = this.find(newCell => newCell.token == 'E').length;

        let minusHP = 4;
        let gameResult
        do{
            gameResult = this.oneGame(minusHP);
            minusHP++;
        } while (gameResult.elvesCount < elvesCount);
        return this.completedRoundCount * this.remainHP();
    }
    oneGame(minusHP){
        this.makeBoard();
        this.setElfHit(minusHP)
        this.completedRoundCount = 0;
        
        do {
            this.makeRound();
        } while (!this.isGameFinish())
        this.printBoard();
        
        return this.gameResult();
    }
    gameResult(){
        return {
            elvesCount:this.find(newCell => newCell.token == 'E').length
        }
    }

    part1() {
        this.completedRoundCount = 0;

        // this.printDistanceBoard(this.distanceBoard({x:3,y:3}));
        do{
            this.makeRound();
            this.printBoard();
        }while(!this.isGameFinish()) 
        /*    for(let i=0;i<2;i++){
            this.makeRound();
            this.printBoard();
        } */
        this.printBoard();
        
        return this.completedRoundCount * this.remainHP();
    }

    makeRound() {
        let soldiers = [];
        for (let y = 0; y < this.board.length; y++) {
            let row = this.board[y];
            for (let x = 0; x < row.length; x++) {
                if(row[x].soldier != null){
                    soldiers.push(row[x]);
                    
                }
            }
        }
        let soldiersLength = soldiers.length;
        
        try{
            for (let i = 0; i < soldiers.length;i++){
                let soldier = soldiers[i];
                let turnResult = this.takeTurn(soldier.y, soldier.x);
            }
        }catch(e){
            return    
        }
        this.completedRoundCount++;

    }

    remainHP(){
        let hp = 0;
        for (let y = 0; y < this.board.length; y++) {
            let row = this.board[y];
            for (let x = 0; x < row.length; x++) {
                if (row[x].soldier != null) {
                    hp += row[x].soldier.hp;
                }
            }
        }
        return hp;
    }

    findBestAdjecent(collection, distanceBoard){
        let wrappersCollection = collection
            .filter(adjecent => adjecent.token == '.')
            .map(adjecent => {
                let distance = distanceBoard[adjecent.y][adjecent.x]
                return {
                    distance,
                    adjecent
                }
            });
        const MAX_VALUE = 100000;

        let minDistance = MAX_VALUE;

        for (let i = 0; i < wrappersCollection.length; i++) {
            let wrapper = wrappersCollection[i];
            if (wrapper.distance < minDistance) {
                minDistance = wrapper.distance;
            }
        }
        let minWrappers = wrappersCollection.filter(wrapper => wrapper.distance == minDistance);

        let minElements = minWrappers
            .map(wrapper => wrapper.adjecent)
            .sort(this.compareCells);

        if (minElements.length > 0) {
            return minElements[0];
        }else{
            return null;
        }
    }
    attack(targetsInRange){
        if (targetsInRange.length == 0) return 0;
        targetsInRange.sort((target1, target2) => {
            if (target1.soldier.hp == target2.soldier.hp) {
                return this.compareCells(target1, target2);
            } else {
                return target1.soldier.hp - target2.soldier.hp;
            }
        });
        let targetInRange = targetsInRange[0];
        targetInRange.soldier.hit();
     
        if (targetInRange.soldier.hp <= 0) {
            targetInRange.soldier = null;
            targetInRange.token = '.';
        }
        return 1;
    }

    takeTurn(y,x){
        if(this.isGameFinish()) throw 'end';
        if(this.board[y][x].soldier == null) return 0;
        let distanceBoard = this.distanceBoard({ x, y })
        // this.printDistanceBoard(distanceBoard);
        let targets = this.findTargets(y, x);
        if(targets == null) return 0;
        let currentCellAdjacents = this.getAdjacents({ x, y });

        let targetsInRange = Utils.intersections(targets, currentCellAdjacents, this.compareCells);
        if (targetsInRange.length > 0){
            return this.attack(targetsInRange);
        }else{

            //move
            let allAdjecents = [];
            for (let target of targets){
                allAdjecents = allAdjecents.concat(this
                    .getAdjacents(target))
            }
            let choosenAdjecent = this.findBestAdjecent(allAdjecents, distanceBoard);
            if (choosenAdjecent){
                let choosenDistanceBoard = this.distanceBoard(choosenAdjecent);
                

                let bestCurrentAdjecent = this.findBestAdjecent(currentCellAdjacents, choosenDistanceBoard);

                if (bestCurrentAdjecent){
                    let currentCell = this.board[y][x];
                    let currentSoldier = currentCell.soldier;
                    let currentCellToken = currentCell.token;

                    currentCell.token = '.';
                    currentCell.soldier = null;
                    bestCurrentAdjecent.soldier = currentSoldier;
                    bestCurrentAdjecent.token = currentCellToken;

                    //prepare to attack
                    let possibleTargetsToAttack = this.getAdjacents(bestCurrentAdjecent);
                    

                    let newTargetsInRange = Utils.intersections(targets, possibleTargetsToAttack, this.compareCells);
                    if (newTargetsInRange.length > 0) {
                        return this.attack(newTargetsInRange);
                    }
                }
            }
        }
        
        return 1;
    }
    getAdjacents(cell){
        const x = cell.x;
        const y = cell.y;
        return [
            this.board[y][x-1],
            this.board[y][x+1],
            this.board[y-1][x],
            this.board[y+1][x]
        ]
    } 

    findTargets(y,x){
        let cell = this.board[y][x];
        let targets;
        if(cell.token == 'E'){
            targets = this.find(newCell=>newCell.token == 'G')
        } else if (cell.token == 'G') {
            targets = this.find(newCell => newCell.token == 'E')
        }
        return targets;

    }
    find(callback){
        let result = [];
        for (let y = 0; y < this.board.length; y++) {
            let row = this.board[y];
            for (let x = 0; x < row.length; x++) {
                if (callback(row[x])) result.push(row[x]);
            }
        }
        return result;
    }
    forEach(callback){
        for (let y = 0; y < this.board.length; y++) {
            let row = this.board[y];
            for (let x = 0; x < row.length; x++) {
                callback(row[x]);
            }
        }
    }

    distanceBoard(cell){
        let boardCopy = this.boardCopy();
        //boardCopy[cell.y][cell.x] = 0;
        let self = this;
        let fun = function(x,y,level){
            let currentLevel = boardCopy[y][x];
            if (isNaN(parseInt(currentLevel)) || currentLevel > level){
                boardCopy[y][x] = level;
                if (self.isEmpty(boardCopy[y][x - 1])) {
                    fun(x-1,y,level+1);
                }
                if (self.isEmpty(boardCopy[y][x + 1])) {
                    fun(x + 1, y, level + 1);
                }
                if (self.isEmpty(boardCopy[y - 1][x])) {
                    fun(x, y - 1, level + 1);
                }
                if (self.isEmpty(boardCopy[y + 1][x])) {
                    fun(x, y + 1, level + 1);
                }
            }else{
                return
            }            
        }
        fun(cell.x, cell.y, 0);
        return boardCopy;
    }

    isEmpty(token){
        return (token == '.' || !isNaN(parseInt(token)));
    }

    isGameFinish(){
        let gCount = 0;
        let eCount = 0;
        for(let y=0;y<this.board.length;y++){
            let row = this.board[y];
            for (let x = 0; x < row.length; x++) {
                let cell = row[x];
                if(cell.token == 'G') gCount++;
                if(cell.token == 'E') eCount++;
            }
        }
        return (gCount == 0 || eCount == 0);
    }

    compareCells(cell1, cell2){
        if (cell1.y == cell2.y) {
            return cell1.x - cell2.x;
        } else {
            return cell1.y - cell2.y;
        }
    }

};

function fileInput(fileName){
    const file = path.join(__dirname, fileName)
    let rows = fs.readFileSync(file, { encoding: 'utf-8' })
        .split('\n');
    new Day(rows);
}
function day(file){
    fileInput(file);
}

// day('data2.input');
// day('data3.input');
// day('data4.input');
// day('data5.input');
// day('data6.input');
// day('data7.input');
// day('data8.input');
// day('data9.input');
// day('data10.input');
day('data.input');
