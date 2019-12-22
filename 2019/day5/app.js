const fs = require('fs')
const path = require('path')

class InputRow {
    constructor(row) {
        this.program = row.split(',')
            .map(intcode => parseInt(intcode));
    }
}

class Day5 {
    constructor(dayInput, input) {
        this.program = dayInput.program;
        // console.log(this.part1(1));
        console.log(this.part2(input));
    }
    size() {
        return this.program.length;
    }

    part1(input) {
        this.input = input;
        this.output = null;

        this.parameterMode = 0;
        let ip = 0;
        let code = this.program[ip++];
        let instruction = this.decodeInstruction(code);
        
        do {
            switch (instruction.opcode){
                case 1:{
                    let firstArgument = this.program[ip++];
                    let secondArgument = this.program[ip++];
                    let thirdArgument = this.program[ip++];
                    let firstParam = this.readValue(firstArgument, instruction.modes[0]);
                    let secondParam = this.readValue(secondArgument, instruction.modes[1]);
                    let sum = firstParam + secondParam;
                    this.program[thirdArgument % this.size()] = sum;
                    break;
                }
                case 2:{
                    let firstArgument = this.program[ip++];
                    let secondArgument = this.program[ip++];
                    let thirdArgument = this.program[ip++];
                    let firstParam = this.readValue(firstArgument, instruction.modes[0]);
                    let secondParam = this.readValue(secondArgument, instruction.modes[1]);
                    let result = firstParam * secondParam;
                    this.program[thirdArgument % this.size()] = result;
                    break;
                }
                case 3:{
                    let argumentIndex = this.program[ip++];
                    this.program[argumentIndex]=this.input;
                    break;
                }
                case 4:{
                    let argumentIndex = this.program[ip++];
                    this.output = this.readValue(argumentIndex, instruction.modes[0]);
                    break;
                }
                case 5:{
                    let firstArgument = this.program[ip++];
                    let secondArgument = this.program[ip++];
                    let firstParam = this.readValue(firstArgument, instruction.modes[0]);
                    let secondParam = this.readValue(secondArgument, instruction.modes[1]);

                    if (firstParam != 0){
                        ip = secondParam;
                    }
                    break;
                }
                case 6:{
                    let firstArgument = this.program[ip++];
                    let secondArgument = this.program[ip++];
                    let firstParam = this.readValue(firstArgument, instruction.modes[0]);
                    let secondParam = this.readValue(secondArgument, instruction.modes[1]);

                    if (firstParam == 0) {
                        ip = secondParam;
                    }
                    break;
                }
                case 7:{
                    let firstArgument = this.program[ip++];
                    let secondArgument = this.program[ip++];
                    let thirdArgument = this.program[ip++];
                    let firstParam = this.readValue(firstArgument, instruction.modes[0]);
                    let secondParam = this.readValue(secondArgument, instruction.modes[1]);

                    let result = (firstParam < secondParam) ? 1 : 0;
                    this.program[thirdArgument % this.size()] = result;
                    break;
                }
                case 8:{
                    let firstArgument = this.program[ip++];
                    let secondArgument = this.program[ip++];
                    let thirdArgument = this.program[ip++];
                    let firstParam = this.readValue(firstArgument, instruction.modes[0]);
                    let secondParam = this.readValue(secondArgument, instruction.modes[1]);

                    let result = (firstParam == secondParam) ? 1 : 0;
                    this.program[thirdArgument % this.size()] = result;
                    break;
                }
                case 99:
                    return this.output;
                    break;
                default:
                    console.error("Error")
            }
            instruction = this.decodeInstruction(this.program[ip++])
        } while (ip < this.size());
        return this.output;
    }

    decodeInstruction(code){
        const opcode = code % 100;
        const modes = new Array(3);
        modes[0] = Math.floor(code / 100) % 10; //stringCode.length > 2 ? parseInt(stringCode[2]) : 0;
        modes[1] = Math.floor(code / 1000) % 10; //stringCode.length > 3 ? parseInt(stringCode[3]) : 0;
        modes[2] = Math.floor(code / 10000) % 10; //stringCode.length > 4 ? parseInt(stringCode[4]) : 0;
        return{
            opcode,
            modes
        }
    }

    readValue(parameter, parameterMode){
        if(parameterMode === 0){
            return this.program[parameter % this.size()];
        }else if(parameterMode === 1) { 
            return parameter;
        }
    }

    part2(input) {
        return this.part1(input);
    }

};

function fileInput(fileName) {
    const file = path.join(__dirname, fileName)
    return new InputRow(fs.readFileSync(file, { encoding: 'utf-8' }));
}
function day(file, input) {
    new Day5(fileInput(file), input);
}

// day('data_test.input');
// day('data_test2.input');
// day('data_test3.input');
// day('data_test4.input',0);
// day('data_test5.input',0);
// day('data_test6.input',0);
// day('data_test7.input',0);

// day('data_test8.input',1);
// day('data_test9.input',1);

// day('data_test10.input',9);
day('data.input', 5);
