const fs = require('fs')
const path = require('path')


class InputRow {

    constructor(row) {
        let matched = /Step (\w) must be finished before step (\w) can begin\./g.exec(row);
        this.before = matched[1];
        this.next = matched[2];
    }    
}

class Node {
    constructor(name){
        this.name = name;
        this.children = []
        this.parents = []
    }
    addChild(child){
        this.children.push(child);
        child.parents.push(this);
    }
    setTime(time){
        this.toFinish = time + this.name.charCodeAt() - 64;
    }
    tick(){
        this.toFinish--;
    }
}

class Day {
    constructor(dayInput) {
        this.dayInput = dayInput;
        //console.log(this.part1());
        //console.log(this.part2(0,2));
        console.log(this.part2(60,5));
    }

    part1() {
        let index = new Map();

        this.dayInput
            .forEach(row => {
                let node
                if(index.has(row.before)){
                    node = index.get(row.before)
                }else{
                    node = new Node(row.before);
                    index.set(row.before, node)
                }
                let child
                if (index.has(row.next)) {
                    child = index.get(row.next)
                } else {
                    child = new Node(row.next);
                    index.set(row.next, child)
                }
                node.addChild(child)
            });

        this.result = [];

        let roots =[...index.values()].filter(node=>node.parents.length == 0);

        this.steps = roots;

    
        while (this.steps.length > 0) {
            this.sort();
            let current = this.steps.shift();
            this.result.push(current);
            current.children.forEach((child)=>{
                if(child.parents.every(parent=>this.result.indexOf(parent)>-1)){
                // if ( this.steps.indexOf(child) < 0 && this.result.indexOf(child) < 0){
                    this.steps.push(child);
                }
            });
            
        }


        return this.result.map(node=>node.name).join('');
    }

    sort(){
        this.steps
            .sort((a,b)=>{
                let nameA = a.name;
                let nameB = b.name;
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
            });
    }

    part2(time, workers) {
        let index = new Map();

        this.dayInput
            .forEach(row => {
                let node
                if (index.has(row.before)) {
                    node = index.get(row.before)
                } else {
                    node = new Node(row.before);
                    node.setTime(time);
                    index.set(row.before, node)
                }
                let child
                if (index.has(row.next)) {
                    child = index.get(row.next)
                } else {
                    child = new Node(row.next);
                    child.setTime(time);
                    index.set(row.next, child)
                }
                node.addChild(child)
            });

        this.result = [];

        let roots = [...index.values()].filter(node => node.parents.length == 0);

        this.steps = roots;

        this.inProgress = []
        let counter = 0

        while (this.steps.length > 0 || this.inProgress.length > 0) {

            this.inProgress.forEach(node=>node.tick());


            this.inProgress
                .filter(node=>node.toFinish == 0)
                .forEach(node=>{
                    workers++
                    this.result.push(node);
                    node.children.forEach((child) => {
                        if (child.parents.every(parent => this.result.indexOf(parent) > -1)) {
                            this.steps.push(child);
                        }
                    });
                })
            this.inProgress = this.inProgress.filter(node => node.toFinish != 0)

            this.sort();

            while(workers>0 && this.steps.length > 0){
                let current = this.steps.shift();
                if(current){
                    this.inProgress.push(current);
                    workers--;
                }
            }
            counter++
        }

        console.log(this.result.map(node => node.name).join(''))
        return counter-1;
    }

};

function fileInput(fileName){
    const file = path.join(__dirname, fileName)
    return fs.readFileSync(file, { encoding: 'utf-8' })
        .split('\n')
        .map(row => new InputRow(row));
}
function day(file){
    new Day(fileInput(file));
}

day('data2.input');
//day('data3.input');
day('data.input');
