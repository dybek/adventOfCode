const fs = require('fs')
const path = require('path')

var left = { x: 0, y: -1 };
var right = { x: 0, y: 1 };
var up = { x: -1, y: 0 };
var down = { x: 1, y: 0 };

var carId = 0;

class Car{
    constructor(x,y,nextStepDirection){
        this.x =x;
        this.y = y;
        this.nextStepDirection = nextStepDirection;
        this.turnGen = this.turnGenerator();
        this.id = carId++;
    }
    nextTurn(){
        let turn = this.turnGen.next().value;
        if (turn == 'straight'){
            return this.nextStepDirection;
        }
        if (turn == 'left') {
            if (this.nextStepDirection == left) return down;
            if (this.nextStepDirection == down) return right;
            if (this.nextStepDirection == right) return up;
            if (this.nextStepDirection == up) return left;
        }
        if (turn == 'right') {
            if (this.nextStepDirection == left) return up;
            if (this.nextStepDirection == down) return left;
            if (this.nextStepDirection == right) return down;
            if (this.nextStepDirection == up) return right;
        }
    }
    *turnGenerator(){
        while(true){
            yield 'left';
            yield 'straight';
            yield 'right';
        }
    }
}
class NetworkDiagram {
    constructor(networkDiagramData) {
        this.left = left;
        this.right = { x: 1, y: 0 };
        this.up = { x: 0, y: -1 };
        this.down = { x: 0, y: 1 };

        this.networkDiagramData = networkDiagramData;
        this.extractNetworkDiagram();
    }

    extractNetworkDiagram() {
        let networkDiagram = [];

        networkDiagram = this.networkDiagramData
            .split('\n')
            .map(row => [...row]
                .map(element=>{
                    return {el:element}
                })
            );

        this.networkDiagram = networkDiagram;
        this.maxY = this.networkDiagram.length - 1;
        this.maxX = this.networkDiagram[0].length - 1;
    }

    findCars(){
        let cars = [];
        for (let x = 0; x < this.networkDiagram.length;x++){
            let networkDiagramRow = this.networkDiagram[x];
            for (let y = 0; y < networkDiagramRow.length; y++) {
                let element = networkDiagramRow[y];
                if(!element) continue;
                if (element.el == '^') {
                    let car = new Car(x,y,up);
                    cars.push(car);
                    element.el = '|';
                    element.car = car;
                };
                if (element.el == 'v') {
                    let car = new Car(x, y, down);
                    cars.push(car);
                    element.el = '|';
                    element.car = car;
                };
                if (element.el == '<') {
                    let car = new Car(x, y, left);
                    cars.push(car);
                    element.el = '-';
                    element.car = car;
                };
                if (element.el == '>') {
                    let car = new Car(x, y, right);
                    cars.push(car);
                    element.el = '-';
                    element.car = car;
                };
            }
        }
        this.cars = cars;   
    }
    moveCar(car){
        let currentPosition = this.networkDiagram[car.x][car.y];
        let direction = car.nextStepDirection;
        let x = car.x 
        + direction.x;
        let y = car.y 
        + direction.y;

        let newPosition = this.networkDiagram[x][y];
        if(newPosition.car){
            throw { x, y, car: newPosition.car}
        }

        let newDirection;
        if(newPosition.el == '+'){
            newDirection = car.nextTurn();
        } else if (newPosition.el == '\\') {
            if(direction == right){
                newDirection = down;
            }else if (direction == up) {
                newDirection = left;
            } else if (direction == down) {
                newDirection = right;
            } else if (direction == left) {
                newDirection = up;
            }
        } else if (newPosition.el == '/') {
            if (direction == up) {
                newDirection = right;
            } else if (direction == left) {
                newDirection = down;
            } else if (direction == right) {
                newDirection = up;
            } else if (direction == down) {
                newDirection = left;
            }
        }else{
            newDirection = direction
        }

        currentPosition.car = null;
        newPosition.car = car;
        car.x = x;
        car.y = y;
        car.nextStepDirection = newDirection;
    }

    removeCarFromDiagram(car){
        for (let x = 0; x < this.networkDiagram.length; x++) {
            let networkDiagramRow = this.networkDiagram[x];
            for (let y = 0; y < networkDiagramRow.length; y++) {
                if (networkDiagramRow[y].car == car){
                    networkDiagramRow[y].car = null;
                } 
            }
        }
    }
    part1() {
        this.findCars();
        try{
            while(true){
                this.cars.forEach((car)=>{
                    this.moveCar(car);
                });
                this.cars.sort((car1,car2)=>{
                    if(car1.x == car2.x){
                        return car1.y - car2.y;
                    }else{
                        return car1.x - car2.x;
                    }
                })
            }
        }catch(e){
            return ''+e.y+','+e.x;
        }
    }
    part2() {
        this.findCars();
        let car
            while (this.cars.length > 1) {
                let newCars = []
                
                do {
                    car = this.cars.shift()
                    if(!car) break;
                    try {
                        this.moveCar(car);
                        newCars.push(car);
                    }catch(e){
                        this.cars = this.cars.filter(a=>a!=e.car)
                        newCars = newCars.filter(a => a != e.car)
                        this.removeCarFromDiagram(car);
                        this.removeCarFromDiagram(e.car);
                        // remove car
                        // remove e.car
                        //e.car
                    }
                   
                } while (car != null);
                /* this.cars.forEach((car) => {
                    this.moveCar(car);
                }); */
                newCars.sort((car1, car2) => {
                    if (car1.x == car2.x) {
                        return car1.y - car2.y;
                    } else {
                        return car1.x - car2.x;
                    }
                })
                this.cars = newCars;
            }
        //this.moveCar(this.cars[0]);
        return '' + this.cars[0].y + ',' + this.cars[0].x;
    }

}

class Day {
    constructor(dayInput) {
        this.networkDiagram = new NetworkDiagram(dayInput);
        //console.log(this.part1());
        console.log(this.part2());
    }

    part1() {
        return this.networkDiagram.part1();
    }
    part2() {
        return this.networkDiagram.part2();
    }
};

function fileInput(fileName){
    const file = path.join(__dirname, fileName)
    return fs.readFileSync(file, { encoding: 'utf-8' });
}
function day(file){
    new Day(fileInput(file));
}

// day('data2.input');
// day('data3.input');
day('data.input');
