const fs = require('fs')
const path = require('path')

class InputRow {

    constructor(row) {
        const result = row.split(')');
        this.orbited = result[0];
        this.orbit = result[1];
    }
}

class TreeNode{
    constructor(value){
        this.value = value;
        this.parent = null;
        this.children = [];
    }
    addChild(child){
        this.children.push(child);
        child.parent = this;
    }
    level(){
        if(this.parent == null){
            return 0;
        }else{
            return this.parent.level() + 1;
        }
    }
    path(){
        if (this.parent == null) {
            return [];
        } else {
            const path = this.parent.path();
            path.push(this.value);
            return path;
        }
    }
}

class Day6 {
    constructor(dayInput) {
        this.dayInput = dayInput;
        // console.log(this.part1());
        console.log(this.part2());
    }

    createAllObjects(){
        const allObjects = new Map();
        this.dayInput.forEach(orbitRow => {
            let newObject = new TreeNode(orbitRow.orbited);
            if (!allObjects.has(newObject.value)) {
                allObjects.set(newObject.value, newObject);
            }
            newObject = new TreeNode(orbitRow.orbit);
            if (!allObjects.has(newObject.value)) {
                allObjects.set(newObject.value, newObject);
            }
        });

        this.dayInput.forEach(orbitRow => {
            const orbited = allObjects.get(orbitRow.orbited);
            const orbit = allObjects.get(orbitRow.orbit);
            orbited.addChild(orbit);
        })

        return allObjects;
    }

    part1() {
        const allObjects = this.createAllObjects();

        // return allObjects.size;
        return [...allObjects.values()]
            .map(node=>node.level())
            .reduce((sum,current)=>sum+=current,0);
    }

    part2() {
        const allObjects = this.createAllObjects();
        const you = allObjects.get('YOU');
        const san = allObjects.get('SAN');
        const youPath = you.path();
        const sanPath = san.path();

        let common;
        for (let i = youPath.length; i > 0; --i) {
            const youPathElement = youPath[i];
            //const common = sanPath.find(sanPathElement => sanPathElement == youPathElement)
            for (let j = sanPath.length; j > 0; --j) {
                const sanPathElement = sanPath[j];
                if (youPathElement === sanPathElement){
                    common = sanPathElement;
                    break;
                }
                if(common != null){
                    break;
                }
                //const common = sanPath.find(sanPathElement => sanPathElement == youPathElement)
            }
        }
        console.log(common);
        // console.log(youPath.length, youPath.indexOf(common));
        // console.log(youPath.length - youPath.indexOf(common));
        // console.log(sanPath.length, sanPath.indexOf(common));
        // console.log(sanPath.length - sanPath.indexOf(common));
        // console.log(youPath);
        // console.log(sanPath);
        return (youPath.length - (youPath.indexOf(common)+1) -1) + (sanPath.length - (sanPath.indexOf(common)+1) -1);
    }

};

function fileInput(fileName){
    const file = path.join(__dirname, fileName)
    return fs.readFileSync(file, { encoding: 'utf-8' })
        .split('\n')
        .map(row => new InputRow(row));
}
function day(file){
    new Day6(fileInput(file));
}

// day('data_test.input');
// day('data_test2.input');
day('data.input');
