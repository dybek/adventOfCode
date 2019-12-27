const fs = require('fs')
const path = require('path')



class Day8 {
    constructor(dayInput, width, height) {
        this.dayInput = dayInput;
        this.width = width;
        this.height = height;
        //console.log(this.part1());
        this.part2();
    }

    createLayers() {
        let layers = [];
        let layerSize = this.width * this.height;
        let layersCount = this.dayInput.length / layerSize;

        for (let layerIndex = 0; layerIndex < layersCount; layerIndex++) {
            layers[layerIndex] = this.dayInput.slice(layerIndex * layerSize, layerIndex * layerSize + layerSize);
        }
        return layers;
    }

    count0(layer) {
        return this.count(layer, '0');
    }

    count(layer, element) {
        return [...layer].filter(el=>el == element).length;
    }

    part1() {
        const layers = this.createLayers();

        let result = layers.reduce((prev, current, currentIndex) => (this.count0(current) < prev.count0) ? { count0: this.count0(current), index: currentIndex } : prev, { count0: this.dayInput.length, index: -1 })

        let layer = layers[result.index];

        return this.count(layer, '1') * this.count(layer, '2');
        // [...layer].filter(el = '0').length
        // return layers;
    }

    part2() {
        const layers = this.createLayers();

        let printableLayers = layers.reduce((prev, current)=>{
            let result = new Array(prev.length);
            for(let i=0;i<prev.length;i++){
                result[i] = prev[i] === '2' ? current[i] : prev[i];
            }
            return result.join('');
        }); //,'0'.repeat(this.width*this.height)

        this.printLayer(printableLayers,this.width, this.height);
    }

    printLayer(layer, width, height){
        
        for(let i=0;i<height;i++){
            let line = layer.slice(i*width,(i+1)*width);
            line = line.replace(/2/g,' ')
                .replace(/1/g,'*')
                .replace(/0/g,' ');
            console.log(line);
        }
    }

};

function fileInput(fileName) {
    const file = path.join(__dirname, fileName)
    return fs.readFileSync(file, { encoding: 'utf-8' })
        .split('\n')[0];
}
function day(file, width, height) {
    new Day8(fileInput(file), width, height);
}

day('data.input',25, 6);
// day('data_test.input', 3, 2);
// day('data_test2.input', 2, 2);
