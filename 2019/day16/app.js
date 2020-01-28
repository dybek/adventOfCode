const fs = require('fs')
const path = require('path')

function *baseGenerator(){
    while(true){
        yield 0;
        yield 1;
        yield 0;
        yield -1;
    }
}
class PatternGenerator{
    constructor(position){
        this.position = position;
    }

    *execute(){
        const baseGen = baseGenerator();
        let counter = 0;
        do{
            const baseResult = baseGen.next();
            const base = baseResult.value;
            for(let i=0;i<this.position;i++){
                if(counter != 0){
                    yield base;
                }
                counter++
            }
        }while(true);
    }
}

class Day16 {
    constructor(dayInput) {
        this.dayInput = dayInput;
        console.log(this.part1());
        // console.log(this.part2());
    }

    phrase(input){
        let array = Array.from(input);
        let patternArray = [...array];
        return array.map((value, index)=>
            this.calcPosition(patternArray,index+1)
        ).join('');
    }

    calcPosition(patternArray, position){
        const patternGenerator = new PatternGenerator(position);
        const patternCreator = patternGenerator.execute();
        const result = [...patternArray].map(el=>{
            let left = el;
            let right = patternCreator.next().value;
            return left * right;
        }).reduce((accu, current)=>accu+=current,0);
        return Math.abs(result) % 10;
    }

    part1() {
        /* 
        let patternGenerator = new PatternGenerator(2);
        let patternCreator = patternGenerator.execute()
        for (let index = 0; index < 10; index++) {
            console.log(patternCreator.next().value);
            
        } */
        let phrasesCount = 100;
        let input = this.dayInput;
        for(let i=0;i<phrasesCount;i++){
            input = this.phrase(input);
        }
        return input.substring(0,8);
    }

    part2() {
  
    }

};

function fileInput(fileName){
    const file = path.join(__dirname, fileName)
    return fs.readFileSync(file, { encoding: 'utf-8' });
}
function day(file){
    new Day16(fileInput(file));
}

day('data.input');
// day('data_test.input');
day('data_test2.input');
day('data_test3.input');
day('data_test4.input');
