@file:DependsOn("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.9.0")


import java.math.BigInteger
import java.security.MessageDigest
import kotlin.io.path.Path
import kotlin.io.path.readLines
import kotlinx.coroutines.*


/**
 * Reads lines from the given input txt file.
 */
fun readInput(name: String) = Path("./$name.input").readLines()

/**
 * Converts string to md5 hash.
 */
fun String.md5() = BigInteger(1, MessageDigest.getInstance("MD5").digest(toByteArray()))
    .toString(16)
    .padStart(32, '0')

/**
 * The cleaner shorthand for printing output.
 */
fun Any?.println() = println(this)

var testInput = readInput("data_test")
var input = readInput("data")

fun findBegin(a: Array<CharArray>): Pair<Int, Int> {
    for (y in a.indices) {
        for (x in a[y].indices) {
            if (a[y][x] == '^') {
                return Pair(x, y)
            }
        }
    }
    return Pair(0, 0)
}

val directions = arrayOf(
    Pair(1, 0),
    Pair(0, 1),
    Pair(-1, 0),
    Pair(0, -1)
)

fun chooseMark(direction: Int, position: Pair<Int, Int>, a: Array<CharArray>): Char {
    val (x, y) = position
    val current = a[y][x]
    when (direction) {
        0, 2 -> {
            if (current == '-') throw Exception("Cycle detected")
            return if (current == '|') '+' else '-'
        }

        1, 3 -> {
            if (current == '|') throw Exception("Cycle detected")
            return if (current == '-') '+' else '|'
        }
    }
    return TODO("Provide the return value")
}

fun part1(input: List<String>): MutableList<Pair<Int, Int>> {

    val a = input.map { it.toCharArray() }.toTypedArray()
    return calc(a)
}

fun calc(a: Array<CharArray>): MutableList<Pair<Int, Int>> {
    var position = findBegin(a);

    var direction = 3;
    try {
        while (true) {
            val (x, y) = position
            a[y][x] = chooseMark(direction, position, a)
            var nextPositionX = x + directions[direction].first
            var nextPositionY = y + directions[direction].second
            var nextPosition = Pair(nextPositionX, nextPositionY)
            if (a[nextPositionY][nextPositionX] == '#') {
                direction = (direction + 1) % 4
                nextPosition = Pair(x + directions[direction].first, y + directions[direction].second)
            }
            position = nextPosition
        }
    } catch (e: ArrayIndexOutOfBoundsException) {
    }
    val road = emptyList<Pair<Int, Int>>().toMutableList()
    var sum = 0;
    for (y in a.indices) {
        for (x in a[y].indices) {
            if (a[y][x] in listOf<Char>('|', '+', '-')) road += Pair(x, y)
        }
    }
    /*a.forEach {
        it.forEach {
            print(it.toChar())

        }
        print("\n")
    }*/
    road.size.println()
    return road
}

public fun part2(input: List<String>) {

    val a = input.map { it.toCharArray() }.toTypedArray()
    val road = part1(input)
    findBegin(a)
    var count = 0
    for ((x, y) in road) {
        //create deep copy of a
        val b = a.map { it.copyOf() }.toTypedArray()
        b[y][x] = '#'
        try {
            calc(b)
        } catch (e: Exception) {
            println(e)
            b.forEach {
                it.forEach {
                    print(it.toChar())

                }
                print("\n")
            }
            count++
        }
    }
    count.println()

}

//part1(testInput)
//part1(input)
part2(testInput)
//part2(input)