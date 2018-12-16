class Day {
    constructor(input) {
        this.input = input;
    }

    part1() {
        this.recipies = [3,7];
        this.firstIndex = 0;
        this.secondIndex = 1;
        do{
            this.makeStep();
            // console.log(this.recipies.join(','));
        } while (this.recipies.length < 10 + this.input);
        return this.recipies.slice(this.input, this.input+10).join('');
         
    }
    findFirstIndex(value){
        let indexToMove = 1 + value;
        this.firstIndex = (this.firstIndex + indexToMove) % this.recipies.length;
    }
    findSecondIndex(value){
        let indexToMove = 1 + value;
        this.secondIndex = (this.secondIndex + indexToMove) % this.recipies.length;
    }
    makeStep(){
        let first = this.recipies[this.firstIndex];
        let second = this.recipies[this.secondIndex];
        let sum = first + second;
        let firstPart = Math.floor(sum / 10);
        let secondPart = sum % 10;
        if(firstPart > 0) {
            this.recipies.push(firstPart);
            if(this.endsWith()) throw 'end';
        }
        this.recipies.push(secondPart);
        if (this.endsWith()) throw 'end';
        this.findFirstIndex(first);
        this.findSecondIndex(second);
    }

    part2() {
        this.recipies = [3, 7];
        this.firstIndex = 0;
        this.secondIndex = 1;
        try {
            while(true){
                this.makeStep();
            }
        } catch (e){

        };
        return this.recipies.length - this.input.length;       
    }

    endsWith(){
        if(this.recipies.length < this.input.length) return false;
        let same = 0;
        for(let i=0;i<this.input.length;i++){
            if (this.input[i] == this.recipies[this.recipies.length - this.input.length + i]) same++;
        }
        return same == this.input.length;
    }

};

function day(input){
    return new Day(input)
}

/* console.log(day(9).part1());
console.log(day(5).part1());
console.log(day(18).part1());
console.log(day(2018).part1());
console.log(day(846601).part1());*/

// console.log(day('51589').part2());
// console.log(day('01245').part2());
// console.log(day('92510').part2());
// console.log(day('59414').part2());
console.log(day('846601').part2());
