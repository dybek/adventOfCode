const fs = require('fs')
const path = require('path')

class Program {
    constructor(insturction) {
        let matched = /(\w*)\s(\d*)\s(\d*)\s(\d*)/g.exec(insturction);
        this.instructionName = matched[1];
        this.a = parseInt(matched[2])
        this.b = parseInt(matched[3])
        this.c = parseInt(matched[4])
        this.instructionArray = [this.instructionName, this.a, this.b, this.c];
        this.instruction = null;
    }
    setInstruction(instructionMap) {
        this.instruction = instructionMap.get(this.instructionName)
    }
}

class Day {
    constructor(ipRegister, programList) {
        this.ipRegister = ipRegister;
        this.state = [];
        this.programList = programList;

        // console.log(this.part1());
        console.log(this.part2());
    }

    setInstructionMapping(){
        let instructionMapping = new Map();

        instructionMapping.set('addr', this.addr);
        instructionMapping.set('addi', this.addi);
        instructionMapping.set('mulr', this.mulr);
        instructionMapping.set('muli', this.muli);
        instructionMapping.set('banr', this.banr);
        instructionMapping.set('bani', this.bani);
        instructionMapping.set('borr', this.borr);
        instructionMapping.set('bori', this.bori);
        instructionMapping.set('setr', this.setr);
        instructionMapping.set('seti', this.seti);
        instructionMapping.set('gtir', this.gtir);
        instructionMapping.set('gtri', this.gtri);
        instructionMapping.set('gtrr', this.gtrr);
        instructionMapping.set('eqir', this.eqir);
        instructionMapping.set('eqri', this.eqri);
        instructionMapping.set('eqrr', this.eqrr);

        for (let program of this.programList) {
            program.setInstruction(instructionMapping)
        }
    }

    part1() {
        this.setInstructionMapping();

        this.setState([0, 0, 0, 0, 0, 0])

        do{
            let ip = this.state[this.ipRegister];
            let program = this.programList[ip];
            const oldState = [...this.state];
            const newState = program.instruction.call(this, program.instructionArray);
            // console.log(`ip=${ip} [${oldState.join(',')}] ${program.instructionArray.join(' ')} [${newState.join(',')}]`)
            this.state = newState;
            this.state[this.ipRegister] = this.state[this.ipRegister] + 1;
        } while( this.state[this.ipRegister] < this.programList.length);

        return this.state[0];
    }

    part2() {
        this.setInstructionMapping();

        this.setState([0, 0, 0, 0, 0, 0])
        this.setState([0, 1, 10551428, 10551428, 10551428, 4])
        this.setState([1, 2, 10551428, 10551428, 5275714, 4])
        this.setState([3, 2, 10551428, 0, 10551427, 5])
        this.setState([3, 3, 10551428, 0, 3517141, 10])
        this.setState([3, 3, 10551428, 0, 10551427, 5])
        this.setState([3, 4, 10551428, 0, 2637857, 10])
        this.setState([7, 4, 10551428, 0, 10551427, 5])
        this.setState([7, 5, 10551428, 0, 2110285, 10])
        this.setState([7, 5, 10551428, 0, 10551427, 5])
        this.setState([7, 6, 10551428, 0, 1758571, 10])
        this.setState([7, 6, 10551428, 0, 10551427, 5])
        this.setState([7, 7, 10551428, 0, 1507346, 10])
        this.setState([7, 7, 10551428, 0, 10551427, 5])
        this.setState([7, 8, 10551428, 0, 1318928, 10])
        this.setState([7, 8, 10551428, 0, 10551427, 5])
        this.setState([7, 9, 10551428, 0, 1172380, 10])
        this.setState([7, 9, 10551428, 0, 10551427, 5])
        this.setState([7, 10, 10551428, 0, 1055142, 10])
        this.setState([7, 66, 10551428, 0, 10551427, 5])
        this.setState([7, 67, 10551428, 0, 157483, 10])
        this.setState([74, 67, 10551428, 0, 10551427, 5])
        this.setState([8189644, 10551427, 10551428, 0, 10551427, 5])
        this.setState([18741072, 10551428, 10551428, 0, 10551427, 5])

        /*
        1
2=>3
4=>7
67=>74
2*67=>208
4*67=>476
39371=>39847
2*39371=>118589
4*39371=>276073
67*39371=>2913930
2*67*39371=>8189644
*/
        do {
            let ip = this.state[this.ipRegister];
            let program = this.programList[ip];
            const oldState = [...this.state];
            const newState = program.instruction.call(this, program.instructionArray);
            console.log(`ip=${ip} [${oldState.join(',')}] ${program.instructionArray.join(' ')} [${newState.join(',')}]`)
            this.state = newState;
            this.state[this.ipRegister] = this.state[this.ipRegister] + 1;
        } while (this.state[this.ipRegister] < this.programList.length);

        return this.state[0];
    }

    setState(state) {
        this.state = state;
    }
    sameResults(r1, r2) {
        let counter = 0;
        for (let i = 0; i < 4; i++) {
            if (r1[i] == r2[i]) counter++
        }
        return counter == 4;
    }

    addr(insturction) {
        let a = this.state[insturction[1]];
        let b = this.state[insturction[2]];
        let result = a + b;
        this.state[insturction[3]] = result;
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
    let lines = fs.readFileSync(file, { encoding: 'utf-8' })
        .split('\n');
    const ipLine = lines.shift();
    const ipMatch = /#ip (\d)/g.exec(ipLine);
    return [ipMatch[1], lines.map(line => new Program(line))];
}
function day(file, file2) {
    new Day(...fileInput(file));
}

// day('data2.input');
day('data.input');
