const fs = require('fs')
const path = require('path')

class InputRow {
    constructor(row) {
        this.program = row.split(',')
            .map(intcode => parseInt(intcode));
    }
}

const permutations = function* (elements) {
    if (elements.length === 1) {
        yield elements;
    } else {
        let [first, ...rest] = elements;
        for (let perm of permutations(rest)) {
            for (let i = 0; i < elements.length; i++) {
                let start = perm.slice(0, i);
                let rest = perm.slice(i);
                yield [...start, first, ...rest];
            }
        }
    }
}

class Program {
    constructor(program) {
        this.program = program;
        this.halt = false;
        this.phaseUsed = false;
        this.ip = 0;
        const code = this.program[this.ip++];
        this.instruction = this.decodeInstruction(code);
    }

    size() {
        return this.program.length;
    }

    execute(phase, input) {
        this.input = input;
        this.phase = phase;
        
        this.output = null;
        // if(this.ip >= this.size()){
            // this.ip = 0;
            // this.instruction = this.decodeInstruction(this.program[this.ip++]);
        // }

        do {
            switch (this.instruction.opcode) {
                case 1: {
                    let firstArgument = this.program[this.ip++];
                    let secondArgument = this.program[this.ip++];
                    let thirdArgument = this.program[this.ip++];
                    let firstParam = this.readValue(firstArgument, this.instruction.modes[0]);
                    let secondParam = this.readValue(secondArgument, this.instruction.modes[1]);
                    let sum = firstParam + secondParam;
                    this.program[thirdArgument % this.size()] = sum;
                    break;
                }
                case 2: {
                    let firstArgument = this.program[this.ip++];
                    let secondArgument = this.program[this.ip++];
                    let thirdArgument = this.program[this.ip++];
                    let firstParam = this.readValue(firstArgument, this.instruction.modes[0]);
                    let secondParam = this.readValue(secondArgument, this.instruction.modes[1]);
                    let result = firstParam * secondParam;
                    this.program[thirdArgument % this.size()] = result;
                    break;
                }
                case 3: {
                    let argumentIndex = this.program[this.ip++];
                    if(!this.phaseUsed){
                        this.program[argumentIndex] = this.phase;
                        this.phaseUsed = true;
                    }else{
                        this.program[argumentIndex] = this.input;
                    }
                    break;
                }
                case 4: {
                    let argumentIndex = this.program[this.ip++];
                    this.output = this.readValue(argumentIndex, this.instruction.modes[0]);
                    //to correct run after return
                    this.instruction = this.decodeInstruction(this.program[this.ip++]);
                    return this.output;
                    break;
                }
                case 5: {
                    let firstArgument = this.program[this.ip++];
                    let secondArgument = this.program[this.ip++];
                    let firstParam = this.readValue(firstArgument, this.instruction.modes[0]);
                    let secondParam = this.readValue(secondArgument, this.instruction.modes[1]);

                    if (firstParam != 0) {
                        this.ip = secondParam;
                    }
                    break;
                }
                case 6: {
                    let firstArgument = this.program[this.ip++];
                    let secondArgument = this.program[this.ip++];
                    let firstParam = this.readValue(firstArgument, this.instruction.modes[0]);
                    let secondParam = this.readValue(secondArgument, this.instruction.modes[1]);

                    if (firstParam == 0) {
                        this.ip = secondParam;
                    }
                    break;
                }
                case 7: {
                    let firstArgument = this.program[this.ip++];
                    let secondArgument = this.program[this.ip++];
                    let thirdArgument = this.program[this.ip++];
                    let firstParam = this.readValue(firstArgument, this.instruction.modes[0]);
                    let secondParam = this.readValue(secondArgument, this.instruction.modes[1]);

                    let result = (firstParam < secondParam) ? 1 : 0;
                    this.program[thirdArgument % this.size()] = result;
                    break;
                }
                case 8: {
                    let firstArgument = this.program[this.ip++];
                    let secondArgument = this.program[this.ip++];
                    let thirdArgument = this.program[this.ip++];
                    let firstParam = this.readValue(firstArgument, this.instruction.modes[0]);
                    let secondParam = this.readValue(secondArgument, this.instruction.modes[1]);

                    let result = (firstParam == secondParam) ? 1 : 0;
                    this.program[thirdArgument % this.size()] = result;
                    break;
                }
                case 99:
                    this.halt = true;
                    return this.input;
                    break;
                default:
                    console.error("Error")
            }
            this.instruction = this.decodeInstruction(this.program[this.ip++])
        } while (this.ip < this.size());
        // this.halt = true;
        return this.output;
    }

    decodeInstruction(code) {
        const opcode = code % 100;
        const modes = new Array(3);
        modes[0] = Math.floor(code / 100) % 10; //stringCode.length > 2 ? parseInt(stringCode[2]) : 0;
        modes[1] = Math.floor(code / 1000) % 10; //stringCode.length > 3 ? parseInt(stringCode[3]) : 0;
        modes[2] = Math.floor(code / 10000) % 10; //stringCode.length > 4 ? parseInt(stringCode[4]) : 0;
        return {
            opcode,
            modes
        }
    }

    readValue(parameter, parameterMode) {
        if (parameterMode === 0) {
            return this.program[parameter % this.size()];
        } else if (parameterMode === 1) {
            return parameter;
        }
    }

};

class Day7 {

    constructor(dayInput) {
        this.instructionSet = dayInput.program;
    
        // console.log(this.part1());
        console.log(this.part2());
    }

    part1() {

        let max = 0;
        const permutationGenerator = permutations([0, 1, 2, 3, 4])

        for (var onePermutation of permutationGenerator) {
            let executionOutput = this.executeSequence(onePermutation);
            if (executionOutput > max){
                max = executionOutput;
            }
        }
        return max;
    }

    executeSequence(phrases){
        let output = 0;
        const program1 = new Program([...this.instructionSet]);
        const program2 = new Program([...this.instructionSet]);
        const program3 = new Program([...this.instructionSet]);
        const program4 = new Program([...this.instructionSet]);
        const program5 = new Program([...this.instructionSet]);
        output = program1.execute(phrases[0], output)
        output = program2.execute(phrases[1], output)
        output = program3.execute(phrases[2], output)
        output = program4.execute(phrases[3], output)
        output = program5.execute(phrases[4], output)
        return output;
    }

    executeLoop(phrases) {
        let output = 0;
        const program1 = new Program([...this.instructionSet]);
        const program2 = new Program([...this.instructionSet]);
        const program3 = new Program([...this.instructionSet]);
        const program4 = new Program([...this.instructionSet]);
        const program5 = new Program([...this.instructionSet]);
        let halt = false;
        do{
            output = program1.execute(phrases[0], output)
            output = program2.execute(phrases[1], output)
            output = program3.execute(phrases[2], output)
            output = program4.execute(phrases[3], output)
            output = program5.execute(phrases[4], output)
            if (program5.halt == true){
                halt = true
                program5.halt = false;
            }
        } while (halt == false);
        return output;
    }

    part2() {
        let max = 0;
        const permutationGenerator = permutations([5, 6, 7, 8, 9])

        for (var onePermutation of permutationGenerator) {
            let executionOutput = this.executeLoop(onePermutation);
            console.log(onePermutation, executionOutput);
            if (executionOutput > max) {
                max = executionOutput;
            }
        }
        return max;
    }

};

function fileInput(fileName) {
    const file = path.join(__dirname, fileName)
    return new InputRow(fs.readFileSync(file, { encoding: 'utf-8' }));
}
function day(file){
    new Day7(fileInput(file));
}

// day('data_test.input');
// day('data_test2.input');
day('data.input');
