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
    constructor(dayInput, times) {
        this.dayInput = dayInput;
        this.times = times;
        // console.log(this.part1());
        console.log(this.part2());
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

    part3() {
        let phrasesCount = 100;
        let input = this.dayInput.repeat(this.times);
        let offset = input.substring(0,7);
        for(let i=0;i<phrasesCount;i++){
            input = this.phrase(input);
        }
        return input.substring(offset,offset+8);
    }

    position(phrase, index){
        if(phrase == 0){
            return this.input[index];
        }else{
            if(index == this.inputLastElementIndex){
                return this.input[this.inputLastElementIndex];
            }else{
                return (this.position(phrase, index+1) + this.position(phrase-1, index)) % 10;
            }
        }
    }

    halfPhrase(input){
        let output = [];
        output.fill(0);
        let half = Math.ceil(this.input.length/2);
        for(let i=this.inputLastElementIndex;i>=half;--i){
            if(i == this.inputLastElementIndex){
                output[i] = input[this.inputLastElementIndex];
            }else{
                output[i] = (output[i+1] + input[i]) % 10;
            }
        }
        return output;
    }

    part2() {

        //ostatnią przepisuję n-output to n-input
        //poprzednia (n-1)-output to n-output + (n-1)-input

        let phrasesCount = 100;
        let input = this.dayInput.repeat(this.times);
        
        this.input = Array.from(input).map(s=>parseInt(s));
        this.inputLastElementIndex = this.input.length -1;
        let offset = parseInt(input.substring(0,7));

        for(let i=0;i<phrasesCount;i++){
            this.input = this.halfPhrase(this.input);
        }
        let result = this.input.slice(offset,offset+8).join('');
        // let result = ''+this.input[offset]+this.input[offset+1]+this.input[offset+2];
        // return input.substring(offset,offset+8);

        // let result = this.position(100,offset);
        // let result = this.position(3,5);
        // for(let i=0;i<phrasesCount;i++){
            // input = this.phrase(input);
        // }
        return result;
    }

};

function fileInput(fileName){
    const file = path.join(__dirname, fileName)
    return fs.readFileSync(file, { encoding: 'utf-8' });
}
function day(file,times){
    new Day16(fileInput(file), times);
}

day('data.input', 10000);
// day('data_test.input',10);
// day('data_test2.input');
// day('data_test3.input');
// day('data_test4.input');
// day('data_test5.input',10000);
// day('data_test.input',1);
