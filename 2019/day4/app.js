class InputRow {
    constructor(range) {
        const limits = range.split('-');
        this.min = parseInt(limits[0]);
        this.max = parseInt(limits[1]);
    }
}

class Day4 {
    constructor(dayInput) {
        this.min = dayInput.min;
        this.max = dayInput.max;

        console.log(this.part1());
        console.log(this.part2());
    }

    isOk1(numberToCheck){
        const text = '' + numberToCheck;
        if(text.length != 6){
            return false;
        }

        let twoTheSame = false;
        let i= 0;
        do{
            twoTheSame  = (text[i] == text[i+1]);
            i++;
        }while(!twoTheSame && i<text.length-1);
        if(!twoTheSame){
            return false;
        }

        let increase = false;
        i = 0;
        do {
            increase = parseInt(text[i]) <= parseInt(text[i + 1]);
            if(!increase) return false;
            i++;
        } while (i < text.length - 1);
        
        return true;
    }

    isOk2(numberToCheck) {
        const text = '' + numberToCheck;
        if (text.length != 6) {
            return false;
        }

        let twoTheSame = this.containstTwo(text);
        if (!twoTheSame) {
            return false;
        }

        let increase = false;
        let i = 0;
        do {
            increase = parseInt(text[i]) <= parseInt(text[i + 1]);
            if (!increase) return false;
            i++;
        } while (i < text.length - 1);

        return true;
    }

    testDigit(digit, text) {
        const regexp = new RegExp('([^' + digit + ']|^)[' + digit + ']{2}([^' + digit + ']|$)');
        return regexp.test(text)
    }

    containstTwo(text){
        const testDigit = this.testDigit;
        return testDigit(0, text) || testDigit(1, text) || testDigit(2, text) || testDigit(3, text) || testDigit(4, text) || testDigit(5, text) || testDigit(6, text) || testDigit(7, text) || testDigit(8, text) || testDigit(9, text);
    }
    
    part1() {
        console.log('part1');
        let counter = 0;
        for (let numberToCheck = this.min; numberToCheck <= this.max; numberToCheck++) {
            if (this.isOk1(numberToCheck)){
                counter++
            }
            
        }
        return counter;
    }

    part2() {
        console.log('part2');
        let counter = 0;
        for (let numberToCheck = this.min; numberToCheck <= this.max; numberToCheck++) {
            if (this.isOk2(numberToCheck)) {
                // console.log(numberToCheck);
                counter++
            }

        }
        return counter;
    }

};

function fileInput(range) {;
    return new InputRow(range);
}
function day(range) {
    new Day4(fileInput(range));
}

day('246515-739105');
