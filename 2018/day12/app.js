const fs = require('fs')
const path = require('path')

class InputRow {
    constructor(row) {
        let matched = /(.*) => (.)/g.exec(row);
        this.pattern = [...matched[1]]
            .map(place => place == '#' ? 1 : 0);
        this.result = matched[2] == '#' ? 1 : 0;

    }
    toInt(){
        return parseInt(this.pattern.join(''));
    }
    match(toCompare){
        let match = 0
        for(let i=0;i<5;i++){
            if(toCompare[i] == this.pattern[i]) match++
        }
        return match == 5;
    }
}

class Day {
    constructor(input, rows) {
        this.input = [...input]
            .map(place=>place=='#'?1:0);
        //this.rows = rows;
        this.map = new Map();
        rows.forEach(row => {
            this.map.set(row.toInt(), row.result);
        });
        this.history = [];

        console.log(this.part(20));
        console.log(this.part(102));
        console.log(this.part(103));
        console.log(this.part(104));
        console.log(this.part(105));
        console.log((this.part(103) - this.part(102)) * (50000000000-102)+this.part(102))
        // console.log(this.part(50000000000));
    }

    part(steps) {

        let index = 0;
        let state = [...this.input];

        for (let j = 0; j < steps; j++) {
            state.unshift(0,0,0,0);
            state.push(0,0,0,0);
            index -= 4;
            let newState = [];
            for(let i=2;i<state.length-2;i++){
                let toCompare = parseInt(state.slice(i-2, i+3).join(''));
                newState.push(this.map.get(toCompare));
            }
            index += 2;
            state = newState;

            let k = -1;
            while (state[++k] == 0) {
            }
            if (k > -1) state = state.slice(k);
            index += k
            k = state.length;
            while (state[--k] == 0) {
            }
            if (k < state.length) state = state.slice(0, k + 1);

        /*     if(this.findInHistory(state)){
                console.log("history",j,state.join(''));
            } */
            //console.log(state.join('') +'=' + this.stateSum(state, index));
        }

        return this.stateSum(state, index);

    }
    stateSum(state, index){
        let sum = 0;
        for (let i = 0; i < state.length; i++) {
            if (state[i] == 1) sum += (i + index);
        }
        return sum;
    }

    findInHistory(state){
        let result = this.history.some(record=>this.match(state, record));
        this.history.push([...state]);
        return result;
    }

    match(state, record){
        if(state.length != record.length) return false;
        for (let i = 0; i < state.length; i++) {
            if(state[i] != record[i]) return false
        }
        return true;
    }

    getPattern(toCompare){
        for (let i = 0; i < this.rows.length; i++) {
            if (this.rows[i].match(toCompare)) return this.rows[i].result;
        }
        return 0;
    }

};

function fileInput(fileName){
    const file = path.join(__dirname, fileName)
    let rows = fs.readFileSync(file, { encoding: 'utf-8' })
        .split('\n');
    let input  = rows.shift();
    rows.shift();
    let matchedInput = /initial state: (.*)/g.exec(input);
    rows = rows.map(row => new InputRow(row));

    new Day(matchedInput[1], rows);
}
function day(file){
    fileInput(file);
}

// day('data2.input');
// day('data3.input');
day('data.input');
