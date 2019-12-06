const fs = require('fs')
const path = require('path')

class InputRow {
    constructor(row) {
        this.program = row.split(',')
            .map(intcode => parseInt(intcode));
    }
}

class Day2 {
    constructor(dayInput) {
        this.program = dayInput.program;
        // console.log(this.part1(12, 2));
        console.log(this.part2(19690720));
    }
    size() {
        return this.program.length;
    }

    part1(noun, verb) {
        this.program[1] = noun;
        this.program[2] = verb;
        let ip = 0;
        let opcode = this.program[ip++];

        do {
            if (opcode == 1) {
                let firstIndex = this.program[ip++];
                let secondIndex = this.program[ip++];
                let sumIndex = this.program[ip++];
                let sum = this.program[firstIndex % this.size()] + this.program[secondIndex % this.size()];
                this.program[sumIndex % this.size()] = sum;
            } else if (opcode == 2) {
                let firstIndex = this.program[ip++];
                let secondIndex = this.program[ip++];
                let sumIndex = this.program[ip++];
                let sum = this.program[firstIndex % this.size()] * this.program[secondIndex % this.size()];
                this.program[sumIndex % this.size()] = sum;
            } else if (opcode == 99) {
                return this.program[0];
            } else {
                console.error("Error")
            }
            opcode = this.program[ip++];
        } while (ip < this.size());

    }


    part2(condition) {
        const savedProgram = [...this.program];
        for (let i = 0; i <= 99; i++) {
            for (let j = 0; j <= 99; j++) {
                this.program = [...savedProgram];
                let result = this.part1(i, j);
                if (result == condition) return 100 * i + j;
            }
        }

        return -1;
    }

};

function fileInput(fileName) {
    const file = path.join(__dirname, fileName)
    return new InputRow(fs.readFileSync(file, { encoding: 'utf-8' }));
}
function day(file) {
    new Day2(fileInput(file));
}

// day('data_test.input');
day('data.input');
