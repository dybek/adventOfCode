"use strict"
const chevrotain = require("chevrotain")
// const chevrotain = require("./chevrotain.js")
const Lexer = chevrotain.Lexer
const createToken = chevrotain.createToken

// (function(exports){

    // ----------------- Lexer -----------------



    const N = createToken({ name: "N", pattern: /N/ });
    const E = createToken({ name: "E", pattern: /E/ });
    const W = createToken({ name: "W", pattern: /W/ });
    const S = createToken({ name: "S", pattern: /S/ });

    const PPipe = createToken({ name: "PPipe", pattern: /\|/ });

    const LBracket = createToken({ name: "LBracket", pattern: /\(/ });
    const RBracket = createToken({ name: "RBracket", pattern: /\)/ });

    const Begin = createToken({ name: "Begin", pattern: /\^/ });
    const End = createToken({ name: "End", pattern: /\$\n/ });

    const aocTokens = [Begin, End, PPipe, LBracket, RBracket,
        N, E, W, S];

    const AocLexer = new Lexer(aocTokens, {
        // Less position info tracked, reduces verbosity of the playground output.
        positionTracking: "onlyStart"
    });

    // Labels only affect error messages and Diagrams.
    LBracket.LABEL = "'('";
    RBracket.LABEL = "')'";
    Begin.LABEL = "'^'";
    End.LABEL = "'$'";
    PPipe.LABEL = "'|'";


    // ----------------- parser -----------------
    const Parser = chevrotain.Parser;

    class AocParser extends Parser {
        constructor() {
            super(aocTokens, {
                recoveryEnabled: true,
                outputCst: true
            })

            const $ = this;

            $.RULE("aoc", () => {
                $.CONSUME(Begin);
                $.SUBRULE($.exp);
                $.CONSUME(End);
            });

            $.RULE("direction", () => {
                $.OR([
                    { ALT: () => $.CONSUME(N) },
                    { ALT: () => $.CONSUME(S) },
                    { ALT: () => $.CONSUME(E) },
                    { ALT: () => $.CONSUME(W) }
                ]);
            });

            $.RULE("exp", () => {
                $.MANY({
                    DEF: () =>
                        $.OR([
                            { ALT: () => $.SUBRULE($.direction) },
                            { ALT: () => $.SUBRULE($.alt) }
                        ])
                });
            });

            $.RULE("alt", () => {
                $.CONSUME(LBracket);
                $.SUBRULE1($.exp);
                $.CONSUME(PPipe);
                $.SUBRULE2($.exp);
                $.CONSUME(RBracket);
            });

            
            // very important to call this after all the rules have been setup.
            // otherwise the parser may not work correctly as it will lack information
            // derived from the self analysis.
            this.performSelfAnalysis();
        }

    }

module.exports = {
    lexer: AocLexer,
    parser: AocParser
}
        // defaultRule: "aoc";

// })(exports);