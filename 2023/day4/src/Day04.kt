import kotlin.math.pow

class Data(val id: Int, val winning: List<Int>, val numbers: List<Int>){
    fun println(){
        println("Card $id: ${winning.joinToString(" ")}|${numbers.joinToString(" ")}")
    }
    fun intersectCount():Int{
        return winning.intersect(numbers).count()
    }

    fun points():Int{
        return when(val count = intersectCount()){
            0 -> 0
            else -> 2.pow(count-1)
        }
    }
}
infix fun Int.pow(exponent: Int): Int = toDouble().pow(exponent).toInt()

fun main() {

    fun inputToList(input: List<String>): List<Data> {
        return input.map { row ->
            val regex = Regex("Card\\s*(\\d*): (.*)\\|(.*)")
            val result = regex.find(row)!!
            val (id, winning, numbers) = result.destructured
            Data(id.toInt(),
                winning.trim().split(' ').filter { it.isNotEmpty() }.map { it.trim().toInt() },
                numbers.trim().split(' ').filter { it.isNotEmpty() }.map { it.trim().toInt() })
        }
    }

    fun part1(input: List<String>): Int {
        val data = inputToList(input)
        return data.sumOf{it.points()}
    }

    fun part2(input: List<String>): Int {
        val data = inputToList(input)
        var cards = data.map { 1 }.toIntArray()
        for (i in data.indices){
            for (j in 1..data[i].intersectCount()){
                cards[i+j] = cards[i+j] + cards[i];
            }
        }
        return cards.sumOf { it }
    }

    // test if implementation meets criteria from the description, like:
    val testInput = readInput("data_test")
    check(part1(testInput) == 13)
    check(part2(testInput) == 30)

    val input = readInput("data")
//    check(part1(input) == 529618)
//    check(part2(input) == 77509019)
    part1(input).println()
    part2(input).println()
}
