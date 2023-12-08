
class Row(destination: Long, var source: Long, step: Long) {
    var modifier: Long
    var end: Long

    init {
        modifier = destination - source
        end = source + step
    }
}

class Data(var seeds: List<Long>, val maps: List<List<Row>>) {
    fun calculateStep(current: Long, map: List<Row>): Long {
        for (row in map) {
            when (current) {
                in row.source..row.end -> return current + row.modifier
            }
        }
        return current
    }

    fun calculateValueFromMaps(value: Long): Long {
        var result = value
        for (map in maps) {
            result = calculateStep(result, map)
        }
        return result
    }
    fun calculate():List<Long> {
        var values = seeds;
        return seeds.map { value -> calculateValueFromMaps(value) }
    }

    fun transformSeeds(){
        seeds = seeds.indices.asSequence()
            .filter { it % 2 == 0 }
            .flatMap { seeds[it] until (seeds[it] + seeds[it + 1]) }
            .toList()
    }

    fun println() {
        println("seeds: ${seeds.joinToString(" ")}-maps: ${maps.joinToString(" ")}")
    }

    fun part2(): Long {
        return seeds.indices.asSequence()
            .filter { it % 2 == 0 }
            .flatMap { seeds[it] until (seeds[it] + seeds[it + 1]) }
            .map { value -> calculateValueFromMaps(value) }
            .minOrNull()!!
    }
}


fun main() {

    fun inputToList(input: List<String>): Data {
        val input = input.joinToString(separator = "\n")
        val regex = Regex(
            "seeds:(.*)\\n\\nseed-to-soil map:",
            RegexOption.MULTILINE
        )
        var (a) = regex.find(input)!!.destructured
        var seeds = a.trim().split(' ').filter { it.isNotEmpty() }.map { it.trim().toLong() }
        val regex2 = Regex(
            "map:\\n((?:\\d|\\s)+)",
            RegexOption.MULTILINE
        )
        var inputs = regex2.findAll(input).toList().map { it.groupValues[1] }
        var maps = inputs.map {
            it.trim().split('\n')
                .map { it ->
                    var row = it
                        .trim()
                        .split(' ')
                        .filter { it.isNotEmpty() }
                        .map { it.trim().toLong() }
                    Row(row[0], row[1], row[2])
                }
        }
        return Data(seeds, maps)
    }

    fun part1(input: List<String>): Long {
        println("part1 start")
        var data = inputToList(input)
        val result = data.calculate()
//            result.println()
        return result.minOrNull()!!
    }

    fun part2(input: List<String>): Long {
        println("part2 start")
        var data = inputToList(input)
        return data.part2()
    }

    // test if implementation meets criteria from the description, like:
    val testInput = readInput("data_test")
    check(part1(testInput) == 35.toLong())
    check(part2(testInput) == 46.toLong())

    val input = readInput("data")
//    check(part1(input) == 388071289)
//    check(part2(input) == 84206669)
    part1(input).println()
//    part2(input).println()
}
