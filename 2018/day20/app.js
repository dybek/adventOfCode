"use strict"
const fs = require('fs')
const path = require('path')

const lexerParser = require('./lexerParser.js')

const lexer = lexerParser.lexer;
const AocParser = lexerParser.parser;

class Graph{
    constructor(el){
        this.el = el;
        this.children = [];
    }
}

class Day {
    constructor(dayInput) {
        this.dayInput = dayInput;

        this.parser = new AocParser([], { outputCst: true })

        const lexingResult = lexer.tokenize(dayInput);
        this.parser.input = lexingResult.tokens;
/* 
        this.parser.aoc();

        const aocVisitor = this.parser.getBaseCstVisitorConstructor()

        class myVisitor extends aocVisitor {
            constructor() {
                super()
                // The "validateVisitor" method is a helper utility which performs static analysis
                // to detect missing or redundant visitor methods
                this.validateVisitor()
            }
            // Visit methods go here
            aoc(ctx) {
                console.log(ctx);
            }
            direction(ctx) {
                console.log(ctx);
            }
            exp(ctx) {
                console.log(ctx);
            }
            alt(ctx) {
                console.log(ctx);
            }
        }

        const myVisitorInstance = new myVisitor()
        
        console.log(myVisitorInstance);
 */

        console.log(this.parser.aoc());

        // let cstResult = this.parser.qualifiedName()
        // console.log(cstResult);
        //console.log(this.part1());
        console.log(this.part1());
    }

    part1() {
        // this.parser 
        return this.dayInput;
    }

    part2() {
        for (let k = 0; k < this.dayInput.length; k++) {
            if(this.drawRect(k) == 0){
                return this.dayInput[k].id;
            }
        }
    }
};

function fileInput(fileName){
    const file = path.join(__dirname, fileName)
    return fs.readFileSync(file, { encoding: 'utf-8' });
}
function day(file){
    const input = fileInput(file);
    new Day(input);
}

day('data2.input');
//day('data3.input');
// day('data.input');
