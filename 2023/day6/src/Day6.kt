fun main() {
    fun createInput(input: List<String>): List<Pair<Long, Long>> {
        var time = input[0].split(Regex("\\s+")).map {
            try {
                it.toLong()
            } catch (e: NumberFormatException) {
                null
            }
        }.filterNotNull()
        var distance = input[1].split(Regex("\\s+")).map {
            try {
                it.toLong()
            } catch (e: NumberFormatException) {
                null
            }
        }.filterNotNull()
        return time.zip(distance)
    }

    fun createInput2(input: List<String>): List<Pair<Long, Long>> {
        var time = input[0].split(Regex("\\s+")).map {
            try {
                it.toInt()
            } catch (e: NumberFormatException) {
                null
            }
        }.filterNotNull()
        var distance = input[1].split(Regex("\\s+")).map {
            try {
                it.toInt()
            } catch (e: NumberFormatException) {
                null
            }
        }.filterNotNull()
        return listOf(Pair(time.joinToString(separator = "").toLong(), distance.joinToString(separator = "").toLong()))
    }

    fun calculate(input: List<Pair<Long, Long>>): Int {
        return input.map {
            val (time, distance) = it
            (1..time).count { spead ->
                (time - spead) * spead > distance
            }
        }
            .map {
                it
            }.reduce { a, b -> a * b }
    }

    fun part1(input: List<String>): Int {
        return calculate(createInput(input))
    }

    fun part2(input: List<String>): Int {
        return calculate(createInput2(input))
    }

    // test if implementation meets criteria from the description, like:
    val testInput = readInput("data_test")
    check(part1(testInput) == 288)
    check(part2(testInput) == 71503)

    val input = readInput("data")
    //    check(part1(input) == 2065338)
//    check(part2(input) == 34934171)
    part1(input).println()
    part2(input).println()
}
