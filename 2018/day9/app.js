class ListElement{
    constructor(value){
        this.value = value;
        this.nextElement = null;
        this.prevElement = null;
    }
    addOnRight(element){
        if(this.nextElement){
            this.nextElement.prevElement = element;
            element.nextElement = this.nextElement;
        }
        this.nextElement = element;
        element.prevElement = this;
    }
    addOnLeft(element) {
        if (this.prevElement) {
            this.prevElement.nextElement = element;
            element.prevElement = this.prevElement;
        }
        this.prevElement = element;
        element.nextElement = this;
    }
    next(){
        return this.nextElement;
    }
    prev(){
        return this.prevElement;
    }
}

class List{
    constructor(element){
        this.element = element;
    }
    put(value){
        if(!this.element){
            this.element = new ListElement(value);
            this.element.nextElement = this.element;
            this.element.prevElement = this.element;
        }else{
            this.element.addOnRight(new ListElement(value));
        }
    }
    remove(){
        let element = this.element;
        let prev = this.element.prev();
        let next = this.element.next();
        prev.nextElement = next;
        next.prevElement = prev;
        this.element = next;
        return element;
    }
    next(){
        if(!this.element) return null;
        this.element = this.element.next();
        return this;
    }
    prev(){
        if (!this.element) return null;
        this.element = this.element.prev();
        return this;
    }
    el(){
        return this.element;
    }
}

class Player{
    constructor(number){
        this.number = number;
        this.score = 0;
    }
}

class Day {
    constructor(players, marbles) {
        this.create(players, marbles);
        console.log(this.part1());
        this.create(players, marbles*100);
        console.log(this.part2());
    }

    create(players, marbles){
        this.players = players;
        this.marbles = marbles;
        this.marbleGen = this.marbleGenerator();
        this.playersList = [];

        for (let i = 0; i < this.players; i++) {
            this.playersList.push(new Player(i + 1));
        }
        this.playerGen = this.playerGenerator();
    }

    *marbleGenerator() {
        for (let i=0;i<=this.marbles;i++) {
            yield i;
        }
    }
    *playerGenerator() {
        while(true){
            for (let i = 0; i < this.playersList.length; i++) {
                yield this.playersList[i];
            }
        }
    }

    part1() {
        let list = new List();
        
        let marble = this.marbleGen.next()
        while(!marble.done){
            let marbleValue = marble.value;
            let player = this.playerGen.next().value;
            if (marbleValue> 0 && marbleValue%23 == 0){
                player.score +=marbleValue;
                let removed = list
                    .prev()
                    .prev()
                    .prev()
                    .prev()
                    .prev()
                    .prev()
                    .prev()
                    .remove();
                player.score +=removed.value;
            }else{
                list.next();
                list.put(marbleValue);
                list.next();
            }

            marble = this.marbleGen.next()
        }


        return this.playersList
            .map((player)=>player.score)
            .reduce((max,current)=> current>max?current:max,0)
    }

    part2() {
        let list = new List();

        let marble = this.marbleGen.next()
        while (!marble.done) {
            let marbleValue = marble.value;
            let player = this.playerGen.next().value;
            if (marbleValue > 0 && marbleValue % 23 == 0) {
                player.score += marbleValue;
                let removed = list
                    .prev()
                    .prev()
                    .prev()
                    .prev()
                    .prev()
                    .prev()
                    .prev()
                    .remove();
                player.score += removed.value;
            } else {
                list.next();
                list.put(marbleValue);
                list.next();
            }

            marble = this.marbleGen.next()
        }


        return this.playersList
            .map((player) => player.score)
            .reduce((max, current) => current > max ? current : max, 0)
    }

};

function day(players, marbles){
    new Day(players, marbles);
}

day(9, 25);
day(10, 1618);
day(13,7999); //points: high score is 146373
day(17,1104); //points: high score is 2764
day(21,6111); //points: high score is 54718
day(30,5807); //points: high score is 37305
day(465, 71498);
