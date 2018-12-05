const fs = require('fs')
const path = require('path')

class Day {
    constructor(code) {
        this.code = code;
        //console.log(this.part1());
        console.log(this.part2());
    }

    part1() {
        let letters = [...this.code];
        let index;
        // console.log(letters);
        do{
            index = this.hasAdjacentPolarity(letters);
            if (index > -1) letters.splice(index,2);
            // console.log(letters);
        }while(index > -1);

        return letters.length;
    }

    hasAdjacentPolarity(letters){
        for(let i=0;i<letters.length-1;i++){
            if (this.isOpositePolarity(letters[i], letters[i+1])) return i;
        }
        return -1;
    }

    isOpositePolarity(one, two){
        if(one == two) return false;
        if(one.toLowerCase() == two.toLowerCase()) return true;
        return false;
    }

    part2() {

        let minSize = 10000000000;
        for(let index = 97;index<123;index++){
            let toRemove = String.fromCharCode(index);
            let letters = this.remove([...this.code], toRemove);
            let reducted = this.reduce([...letters]);
            if (reducted < minSize){
                minSize = reducted
            }
        }
        return minSize;
    }
    remove(letters, toRemove){
        return letters
            .filter(letter => letter != toRemove && letter != toRemove.toUpperCase())
            .reduce((text, letter) => text+=letter);
    }

    reduce(letters){
        let index;
        // console.log(letters);
        do {
            index = this.hasAdjacentPolarity(letters);
            if (index > -1) letters.splice(index, 2);
            // console.log(letters);
        } while (index > -1);

        return letters.length;
    }

};

function fileInput(fileName){
    const file = path.join(__dirname, fileName)
    return fs.readFileSync(file, { encoding: 'utf-8' })
        .split('\n');
}
function day(file){
    new Day(fileInput(file)[0]);
}

day('data2.input');
day('data.input');
