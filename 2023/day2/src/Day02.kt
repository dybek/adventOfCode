fun main() {
    fun part1(input: List<String>): Int {

        val colors = mapOf<String, Int>("red" to 12, "green" to 13, "blue" to 14)
        return input.map { row ->
            val regex = Regex("Game (\\d+): (.*)")
            val result = regex.find(row)!!
            val (id, groups) = result.destructured
            Pair(id.toInt(), groups)
        }.map {
            val (id, group) = it;
            val list = group.split(';').map {
                it.split(',').map {
                    val result = it.trim().split(' ')
                    Pair(result[0].toInt(), result[1])
                }
            }
            Pair(id, list)
        }
            .filter {
                val (_, list) = it
                val a = list.flatten()
                list.flatten().all {
                    val (count, color) = it
                    colors[color]!! >= count
                }
            }.fold(0) { sum, el ->
                sum + el.first
            }
    }

    fun part2(input: List<String>): Int {
        return input.map { row ->
            val regex = Regex("Game (\\d+): (.*)")
            val result = regex.find(row)!!
            val (id, groups) = result.destructured
            Pair(id.toInt(), groups)
        }.map {
            val (id, group) = it;
            val list = group.split(';').map {
                it.split(',').map {
                    val result = it.trim().split(' ')
                    Pair(result[0].toInt(), result[1])
                }
            }
            Pair(id, list)
        }
            .map {
                val (_, list) = it


                fun calculate(searchedColor: String): Int {
                    return list.flatten().filter {
                        val (_, color) = it
                        color == searchedColor
                    }.fold(0) { max, el ->
                        if (el.first > max) el.first else max
                    }
                }

                val red = calculate("red");
                val green = calculate("green");
                val blue = calculate("blue");

                red * green * blue
            }.fold(0) { sum, el ->
                sum + el
            }
    }

    // test if implementation meets criteria from the description, like:
    val testInput = readInput("Day02_test")
    check(part1(testInput) == 8)
    check(part2(testInput) == 2286)

    val input = readInput("Day02")
    part1(input).println()
    part2(input).println()
}
