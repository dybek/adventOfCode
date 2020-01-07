const fs = require('fs')
const path = require('path')

class InputRow {

    constructor(row) {
        // let matched = /([xy])=(\d*),\s*([xy])=(\d*)..(\d*)/g.exec(row);
        let matched = /<x=(-?\d*), y=(-?\d*), z=(-?\d*)>/g.exec(row);
        this.x = parseInt(matched[1]);
        this.y = parseInt(matched[2]);
        this.z = parseInt(matched[3]);
    }
}

class Day12 {
    constructor(dayInput) {
        this.dayInput = dayInput;
        // console.log(this.part1());
        console.log(this.part2());
    }

    part1() {
        // console.log(this.dayInput);
        // let positions = Object.assign({}, this.dayInput);
        let positions = [...this.dayInput];
        let velocities = [
            { x: 0, y: 0, z: 0 },
            { x: 0, y: 0, z: 0 },
            { x: 0, y: 0, z: 0 },
            { x: 0, y: 0, z: 0 }
        ];
        for (let i = 0; i < 1000; i++) {
            velocities = this.velocity(positions, velocities);
            positions = this.nextPositions(positions, velocities);
        }
        return this.totalEnergy(positions, velocities);
    }

    part2() {
        // console.log(this.findElementLoopCount('x'));
        // console.log(this.findElementLoopCount('y'));
        // console.log(this.findElementLoopCount('z'));

        return nww([
            this.findElementLoopCount('x'),
            this.findElementLoopCount('y'),
            this.findElementLoopCount('z')
        ]);
    }

    findElementLoopCount(element){
        let positions = [...this.dayInput];
        let velocities = [
            { x: 0, y: 0, z: 0 },
            { x: 0, y: 0, z: 0 },
            { x: 0, y: 0, z: 0 },
            { x: 0, y: 0, z: 0 }
        ];
        let memory = [];
        const createElement = (positions, velocities) => [...positions.map(e => e[element]), ...velocities.map(e => e[element])];
        memory.push(createElement(positions, velocities))
        let i = 1;
        do {
            velocities = this.velocity(positions, velocities);
            positions = this.nextPositions(positions, velocities);
            let toRemember = createElement(positions, velocities);
            let found = memory.find(value => this.isEqualArray(value, toRemember))
            if (found) {
                break;
            }
            memory.push(toRemember);
            i++;
        } while (true);
        return i;
    }

    totalEnergy(positions, velocities) {
        return positions.map((position, index) => {
            let velocity = velocities[index];
            return this.energy(position, velocity);
        }).reduce((prev, current) => prev += current, 0);
    }

    energy(position, velocity) {
        let potential = Math.abs(position.x) + Math.abs(position.y) + Math.abs(position.z);
        let kinetic = Math.abs(velocity.x) + Math.abs(velocity.y) + Math.abs(velocity.z);
        return potential * kinetic;
    }

    nextPositions(positions, velocities) {
        return positions.map((position, index) => {
            let velocity = velocities[index];
            return { x: position.x + velocity.x, y: position.y + velocity.y, z: position.z + velocity.z }
        });
    }

    velocity(coords, velocities) {
        const result = [];
        for (let i = 0; i < coords.length; i++) {
            let velocity = Object.assign({}, velocities[i]);
            let current = coords[i];
            result[i] = coords.filter(el => el != current)
                .map(this.oneMoonCompare(current))
                .reduce(this.sumCoords, velocity)
        }
        return result;
    }

    oneMoonCompare(currentMoon) {
        return (moon) => {
            let zeros = { x: 0, y: 0, z: 0 };
            if (currentMoon.x > moon.x) zeros.x = zeros.x - 1;
            if (currentMoon.x < moon.x) zeros.x = zeros.x + 1;
            if (currentMoon.y > moon.y) zeros.y--;
            if (currentMoon.y < moon.y) zeros.y++;
            if (currentMoon.z > moon.z) zeros.z--;
            if (currentMoon.z < moon.z) zeros.z++;
            return zeros;
        }
    }

    sumCoords(prev, current) {
        return { x: prev.x + current.x, y: prev.y + current.y, z: prev.z + current.z }
    }

    isEqualArray(one, two) {
        let result = true;
        for (let i = 0; i < one.length; i++) {
            result = result && (one[i] == two[i]);
        }
        return result;
    }

    isEqual(one, two) {
        let result = true;
        for (let i = 0; i < one.positions.length;i++){
            let first = one.positions[i];
            let second = two.positions[i];
            result = result && (first.x === second.x) && (first.y === second.y) && (first.z === second.z);
        }
        for (let i = 0; i < one.velocities.length; i++) {
            let first = one.velocities[i];
            let second = two.velocities[i];
            result = result && (first.x === second.x) && (first.y === second.y) && (first.z === second.z);
        }
        return result
    }
    isZeroVelocities(velocities){
        let result = true;
        for (let i = 0; i < velocities.length; i++) {
            let velocity = velocities[i];
            result = result && (velocity.x == 0 && velocity.y==0 && velocity.z ==0);
        }
        return result;
    }

};

function nww(numbers){
    if(numbers.length == 2){
        let a = numbers[0];
        let b = numbers[1];
        return (a * b)/nwd(a,b);
    }else{
        let n = [...numbers];
        let a = n.shift()
        return nww([a, nww(n)]);
    }
}
function nwd(a, b) {
    if (!b) {
        return a;
    }
    return nwd(b, a % b);
}; 

function fileInput(fileName) {
    const file = path.join(__dirname, fileName)
    return fs.readFileSync(file, { encoding: 'utf-8' })
        .split('\n')
        .map(row => new InputRow(row));
}
function day(file) {
    new Day12(fileInput(file));
}

day('data.input');
// day('data_test.input');
// day('data_test2.input');
