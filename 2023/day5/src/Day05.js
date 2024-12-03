class Row {
    constructor(destination, source, step) {
        this.source = source;
        this.modifier = destination - source;
        this.end = source + step;
    }
}

class Data {
    constructor(seeds, maps) {
        this.seeds = seeds;
        this.maps = maps;
    }

    calculateStep(current, map) {
        for (var row of map) {
            if (current >= row.source && current <= row.end) {
                return current + row.modifier;
            }
        }
        return current;
    }

    calculateValueFromMaps(value) {
        var result = value;
        for (var map of this.maps) {
            result = this.calculateStep(result, map);
        }
        return result;
    }

    calculate() {
        return this.seeds.map(value => this.calculateValueFromMaps(value));
    }

    transformSeeds() {
        this.seeds = this.seeds.flatMap(
            (seed, index) => index % 2 === 0 ? Array.from({length: this.seeds[index + 1] - seed}, (_, i) => seed + i) : []
        );
    }

    print() {
        console.log(`seeds: ${this.seeds.join(" ")}-maps: ${JSON.stringify(this.maps)}`);
    }

    part2() {
        this.transformSeeds();
        return Math.min(...this.calculate());
    }
}

function main() {
    // Implement the required data preprocessing functions, readInput, inputToList, part1, part2, check etc.
}