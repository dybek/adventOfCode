const fs = require('fs')
const path = require('path')


class InputRow {

    constructor(row) {
        this.row = row;
        this.countLetters();
    }
    countLetters(){
        const letters = new Map();
        [...this.row].forEach(letter=>{
            let count = 0;
            if(letters.has(letter)){
                count = letters.get(letter);
            }
            count = count + 1;
            letters.set(letter, count);
        })
        this.letters = letters;
    }

    hasExactly(count){
        return [...this.letters.values()].some(lettersCount=>lettersCount == count);
    }
    compare(otherRow){
        let others = 0;
        for(let i=0;i<this.row.length;i++){
            if(this.row[i]!=otherRow.row[i]) others ++;
        }
        return others;
    }
    
}

class Day {
    constructor(dayInput) {
        this.dayInput = dayInput;
        //console.log(this.part1());
        console.log(this.part2());
    }

    part1() {
        const has2 = this.dayInput
            .filter((row) => row.hasExactly(2))
            .length;
        const has3 = this.dayInput
            .filter((row) => row.hasExactly(3))
            .length;
        return has2 * has3;
    }
    compare(){
        const rows = this.dayInput;

        for (let i = 0; i < rows.length; i++) {
            for (let j = 0; j < rows.length; j++) {
                if (rows[i].compare(rows[j]) == 1){
                    return [rows[i], rows[j]]
                }
            }
        }
        return []
    }

    part2() {
        let [row1, row2] = this.compare().map(a=>a.row.trim())
        let text = '';
        for (let i = 0; i < row1.length; i++) {
            if(row1[i] == row2[i]) text += row1[i];
        }
        return text;
    }

};

function fileInput(fileName){
    const file = path.join(__dirname, fileName)
    return fs.readFileSync(file, { encoding: 'utf-8' })
        .split('\n')
        .map(row => new InputRow(row));
}
function day(file){
    new Day(fileInput(file));
}

// day('data2.input');
day('data3.input');
day('data.input');
