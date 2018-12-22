const fs = require('fs')
const path = require('path')

class InputRow {
    constructor(samples) {
        let matched = /Before:\s*\[(\d*), (\d*), (\d*), (\d*)\]\n(\d*)\s(\d*)\s(\d*)\s(\d*)\nAfter:\s*\[(\d*), (\d*), (\d*), (\d*)\]/g.exec(samples);
        this.before = [parseInt(matched[1]), parseInt(matched[2]), parseInt(matched[3]), parseInt(matched[4])];
        this.instruction = [parseInt(matched[5]), parseInt(matched[6]), parseInt(matched[7]), parseInt(matched[8])];
        this.after = [parseInt(matched[9]), parseInt(matched[10]), parseInt(matched[11]), parseInt(matched[12])];
        this.instructionName = [];
    }
    addInstructionName(name){
        this.instructionName.push(name);
    }
}
class Program {
    constructor(insturction){
        let matched = /(\d*)\s(\d*)\s(\d*)\s(\d*)/g.exec(insturction);
        this.instructionNumber = parseInt(matched[1])
        this.a = parseInt(matched[2])
        this.b = parseInt(matched[3])
        this.c = parseInt(matched[4])
        this.instructionArray = [this.instructionNumber, this.a, this.b, this.c];
        this.instruction = null;
    }
    setInstruction(instructionMap){
        this.instruction = instructionMap.get(this.instructionNumber)
    }
}

class Day {
    constructor(samples, programList) {
        this.samples = samples;
        this.state = [];
        this.programList = programList;

        // console.log(this.part1());
        console.log(this.part2());
    }

    test(){
        this.setState([]);
        console.log(this.sameResults([],this.addr([])))
    }
    part1() {
        let instructions = [
            this.addr,
            this.addi,
            this.mulr,
            this.muli,
            this.banr,
            this.bani,
            this.borr,
            this.bori,
            this.setr,
            this.seti,
            this.gtir,
            this.gtri,
            this.gtrr,
            this.eqir,
            this.eqri,
            this.eqrr
        ]
        for (let sample of this.samples){
            for (let inst of instructions){
                this.setState([...sample.before]);
                let result = inst.call(this, sample.instruction);
                if (this.sameResults(result, sample.after)){
                    sample.addInstructionName(inst);
                }
            }
        }

        let counter = 0;
        for (let sample of this.samples) {
            if (sample.instructionName.length >= 3){
                counter++;
            }
        }
        
        return counter;
    }

    part2() {
        let instructions = [
            this.addr,
            this.addi,
            this.mulr,
            this.muli,
            this.banr,
            this.bani,
            this.borr,
            this.bori,
            this.setr,
            this.seti,
            this.gtir,
            this.gtri,
            this.gtrr,
            this.eqir,
            this.eqri,
            this.eqrr
        ]
        for (let sample of this.samples) {
            for (let inst of instructions) {
                this.setState([...sample.before]);
                let result = inst.call(this, sample.instruction);
                if (this.sameResults(result, sample.after)) {
                    sample.addInstructionName(inst);
                }
            }
        }

        

        let instructionMapping = new Map();
        while (instructionMapping.size < 16) {
            let instuctionCode;
            for(instuctionCode = 0; instuctionCode < 16; instuctionCode++){
                let onlyPossible = this.samples.filter(sample => sample.instruction[0] == instuctionCode)
                    .map(sample=> sample.instructionName)
                    .reduce((common, current) => common.filter(inst => current.includes(inst)), instructions)
                // if (onlyPossible.length > 1) console.error(instuctionCode, onlyPossible)
                if (onlyPossible.length == 1){
                    instructionMapping.set(instuctionCode, onlyPossible[0]);
                    this.samples = this.samples
                        .filter(sample => sample.instruction[0] != instuctionCode);
                    this.samples.forEach(sample => {
                        sample.instructionName = sample.instructionName.filter(inst => inst != onlyPossible[0])
                    });
                    break;
                }
            }
        }
/*          while(instructionMapping.size < 16){
            let justFounded = []
            let justFoundedFuctions = []
            for (let sample of this.samples) {
                if(sample.instructionName.length == 1){
                    let instructionCode = sample.instruction[0];
                    if (!instructionMapping.has(instructionCode)) {
                        instructionMapping.set(
                            instructionCode,
                            sample.instructionName[0]
                        )
                        justFounded.push(instructionCode)
                        justFoundedFuctions.push(sample.instructionName[0])
                    }
                }
            }
            this.samples = this.samples
                .filter(sample => !justFounded.includes(sample.instruction[0]))


            for (let sample of this.samples) {
                sample.instructionName = sample.instructionName
                    .filter(instructionFunction => !justFoundedFuctions.includes(instructionFunction))
            }

        } */

        for (let program of this.programList) {
            program.setInstruction(instructionMapping)
        }

        this.setState([0,0,0,0])
        for (let program of this.programList) {
            program.instruction.call(this, program.instructionArray);
        }

        return this.state[0];
    }

    setState(state){
        this.state = state;
    }
    sameResults(r1,r2){
        let counter = 0;
        for(let i=0;i<4;i++){
            if (r1[i] == r2[i]) counter++
        }
        return counter == 4;
    }

    addr(insturction){
        let a = this.state[insturction[1]];
        let b = this.state[insturction[2]];
        let result = a + b;
        this.state[insturction[3]]=result;
        return [...this.state]
    }
    addi(insturction) {
        let a = this.state[insturction[1]];
        let b = insturction[2];
        let result = a + b;
        this.state[insturction[3]] = result;
        return [...this.state]
    }

    mulr(insturction) {
        let a = this.state[insturction[1]];
        let b = this.state[insturction[2]];
        let result = a * b;
        this.state[insturction[3]] = result;
        return [...this.state]
    }
    muli(insturction) {
        let a = this.state[insturction[1]];
        let b = insturction[2];
        let result = a * b;
        this.state[insturction[3]] = result;
        return [...this.state]
    }

    banr(insturction) {
        let a = this.state[insturction[1]];
        let b = this.state[insturction[2]];
        let result = a & b;
        this.state[insturction[3]] = result;
        return [...this.state]
    }
    bani(insturction) {
        let a = this.state[insturction[1]];
        let b = insturction[2];
        let result = a & b;
        this.state[insturction[3]] = result;
        return [...this.state]
    }

    borr(insturction) {
        let a = this.state[insturction[1]];
        let b = this.state[insturction[2]];
        let result = a | b;
        this.state[insturction[3]] = result;
        return [...this.state]
    }
    bori(insturction) {
        let a = this.state[insturction[1]];
        let b = insturction[2];
        let result = a | b;
        this.state[insturction[3]] = result;
        return [...this.state]
    }

    setr(insturction) {
        let a = this.state[insturction[1]];
        let result = a;
        this.state[insturction[3]] = result;
        return [...this.state]
    }
    seti(insturction) {
        let a = insturction[1];
        let result = a;
        this.state[insturction[3]] = result;
        return [...this.state]
    }

    gtir(insturction) {
        let a = insturction[1];
        let b = this.state[insturction[2]];
        let result = a > b ? 1 : 0;
        this.state[insturction[3]] = result;
        return [...this.state]
    }
    gtri(insturction) {
        let a = this.state[insturction[1]];
        let b = insturction[2];
        let result = a > b ? 1 : 0;
        this.state[insturction[3]] = result;
        return [...this.state]
    }
    gtrr(insturction) {
        let a = this.state[insturction[1]];
        let b = this.state[insturction[2]];
        let result = a > b ? 1 : 0;
        this.state[insturction[3]] = result;
        return [...this.state]
    }

    eqir(insturction) {
        let a = insturction[1];
        let b = this.state[insturction[2]];
        let result = a == b ? 1 : 0;
        this.state[insturction[3]] = result;
        return [...this.state]
    }
    eqri(insturction) {
        let a = this.state[insturction[1]];
        let b = insturction[2];
        let result = a == b ? 1 : 0;
        this.state[insturction[3]] = result;
        return [...this.state]
    }
    eqrr(insturction) {
        let a = this.state[insturction[1]];
        let b = this.state[insturction[2]];
        let result = a == b ? 1 : 0;
        this.state[insturction[3]] = result;
        return [...this.state]
    }
};

function fileInput(fileName) {
    const file = path.join(__dirname, fileName)
    return fs.readFileSync(file, { encoding: 'utf-8' })
        .split('\n\n')
        .map(row => new InputRow(row));
}
function fileInput2(fileName) {
    const file = path.join(__dirname, fileName)
    return fs.readFileSync(file, { encoding: 'utf-8' })
        .split('\n')
        .map(row => new Program(row));
}
function day(file, file2) {
    new Day(fileInput(file), fileInput2(file2));
}

// day('data2.input');
// day('data3.input');
day('data.input', 'data2.input');
