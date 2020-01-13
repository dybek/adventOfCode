const fs = require('fs')
const path = require('path')

class Reaction {

    constructor(row) {

        let matched = /^(.*)=> (\d+ \w+)$/g.exec(row);
        let left = matched[1];
        let right = matched[2];

        this.input = left.split(',').map(this.chemical)
        this.output = this.chemical(right);
    }

    chemical(text){
        let matched = /(\d+) (\w+)/g.exec(text);
        let count = parseInt(matched[1]);
        let symbol = matched[2];
        return new Chemical(count, symbol);
    }
}
class Chemical{
    constructor(count, symbol){
        this.count = count;
        this.symbol = symbol;
    }
}

class ChemicalMagazine{
    constructor(reactions){
        this.reactions = reactions;
        this.ore = 0;
        this.magazine = new Map();
    }

    create(chemical){
        let {symbol, count} = chemical;
        count = this.takeFromMagazine(chemical);

        if(count > 0){
            let reaction = this.reactions.get(symbol);   
            let reactionCount = Math.ceil(count / reaction.output.count)
            for(let i=0;i<reactionCount;i++){
                this.makeReaction(reaction);
            }
            this.takeFromMagazine(new Chemical(count, symbol));
        }
    }

    makeReaction(reaction){
        reaction.input.forEach(inputChemical=>{
            this.create(inputChemical);
        });
        this.addToMagazine(reaction.output);
    }

    addToMagazine(chemical){
        let count = 0;
        if(this.magazine.has(chemical.symbol)){
            count = this.magazine.get(chemical.symbol);
        }
        count+=chemical.count;
        this.magazine.set(chemical.symbol, count);
    }

    takeFromMagazine(chemical){
        let {symbol, count} = chemical;
        if(symbol == 'ORE'){
            this.ore+=count;
            return 0;
        }
        let fromMagazine = this.magazine.get(symbol)
        if(fromMagazine){
            if(fromMagazine >= count){
                this.magazine.set(symbol, fromMagazine - count);
                return 0;
            }else{
                let left = count - fromMagazine;
                this.magazine.set(symbol, 0);
                return left;
            }
        }else{
            return count;
        }
    }
}

class Day14 {
    constructor(dayInput) {
        this.dayInput = dayInput;
        // console.log(this.part1());
        console.log(this.part2());
    }

    buildReactionMap(reactionsList){
        let reactions = new Map();
        reactionsList.forEach(reaction=>{
            reactions.set(reaction.output.symbol, reaction);
        });
        return reactions;
    }

    part1() {
        let reactions = this.buildReactionMap(this.dayInput);
        let magazine = new ChemicalMagazine(reactions);
        //let fuel = reactions.get('FUEL');
        magazine.create(new Chemical(1,'FUEL'));

        return magazine.ore;
    }


    part2() {
    //  let trilion = 1000000000000;
        let trilion = 1000000000000;

        let reactions = this.buildReactionMap(this.dayInput);
        let magazine = new ChemicalMagazine(reactions);
        let fuel = 0;
        //let fuel = reactions.get('FUEL');
        do{
            magazine.create(new Chemical(1,'FUEL'));
            fuel++
        }while(magazine.ore < trilion);
        return fuel-1;
        // let oneFuel = this.part1();
        // return Math.floor(trilion / oneFuel);
    }
};

function fileInput(fileName){
    const file = path.join(__dirname, fileName)
    return fs.readFileSync(file, { encoding: 'utf-8' })
        .split('\n')
        .map(row => new Reaction(row));
}
function day(file){
    new Day14(fileInput(file));
}

day('data.input');
// day('data_test.input');
// day('data_test2.input');
// day('data_test3.input');
// day('data_test4.input');
// day('data_test5.input');
