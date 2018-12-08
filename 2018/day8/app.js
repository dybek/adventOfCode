const fs = require('fs')
const path = require('path')


class InputRow {

    constructor(row) {
        this.numbers = row.split(' ');
    }    
}

class Node{
    constructor(){
        this.children = []
        this.metadata = []
    }
    value(){
        if(this.children.length == 0){
            return this.metadata.reduce((sum,val)=>sum+=val,0);
        }else{
            let sum = 0;
            for (let j = 0; j < this.metadata.length; j++) {
                let meta = this.metadata[j];
                let child = this.children[meta-1];
                if(child){
                    sum += child.value()
                }
            }
            return sum;
        }
    }

}

class Day {
    constructor(dayInput) {
        this.numbers = dayInput.numbers;
        this.gen = this.generator();
        console.log(this.part1());
        console.log(this.part2());
    }

    *generator(){
        for (const number of this.numbers) {
            yield parseInt(number);
        }
    }

    part1() {
        this.metadataSum = 0;
        this.tree = this.createNode();
        return this.metadataSum;
    }

    createNode(){
        let node = new Node(); 
        node.childCount = this.gen.next().value;
        node.metadataCount = this.gen.next().value;
        for(let i=0;i<node.childCount;i++){
            node.children.push(this.createNode())
        }
        for (let j = 0; j < node.metadataCount; j++) {
            let meta = this.gen.next().value;
            this.metadataSum += meta;
            node.metadata.push(meta);
        }
        return node
    }

    part2() {
        return this.tree.value();
    }

};

function fileInput(fileName){
    const file = path.join(__dirname, fileName)
    return new InputRow(fs.readFileSync(file, { encoding: 'utf-8' }));
}
function day(file){
    new Day(fileInput(file));
}

day('data2.input');
// day('data3.input');
day('data.input');
