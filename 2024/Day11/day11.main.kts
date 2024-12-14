@file:DependsOn("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.9.0")


import java.math.BigInteger
import java.security.MessageDigest
import kotlin.io.path.Path
import kotlin.io.path.readLines
import java.util.LinkedList
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
var testInput2 = readInput("data_test2")
var testInput3 = readInput("data_test3")
var input = readInput("data")

fun processInput(input: List<String>): MutableList<Long> {
    return input[0].split(' ').map { it.toLong() }.toMutableList()
}

fun splitInHalf(value: Int): Pair<Int, Int> {
    val str = value.toString()
    val half = str.length / 2
    return Pair(str.substring(0, half).toInt(), str.substring(half).toInt())
}

fun runCalculations(
    a: MutableList<Long>,
    count: Int,
): MutableList<Long> {
    var a1 = a
    for (i in 0 until count) {
        a1 = blink(a1)
//        """iteration:${i},size:${a1.size}""".println()
//        a.println()
    }
    return a1
}

fun runCalculations2(
    a: MutableList<Pair<Long, Long>>,
    count: Int,
): MutableList<Pair<Long, Long>> {
    var a1: MutableList<Pair<Long, Long>> = a
    for (i in 0 until count) {
        a1 = blink2(a1)
        a1 = a1
            .groupBy(keySelector = { (it: Long) -> it })
            .map { (key, value) -> Pair(key, value.sumOf { v -> v.second }) }.toMutableList()
//        a3.println()
        /*.entries.map {
            Pair(
                it.key,
                it.value
            )
        }*/
//        """iteration:${i},size:${a1.size}""".println()
//        a.println()
        i.println()
    }
    return a1
}


fun blink(a: MutableList<Long>): MutableList<Long> {
    var newList = LinkedList<Long>();
    var it = a.listIterator()
    while (it.hasNext()) {
        val value = it.next()
        if (value == 0L) {
            it.set(1L)
        } else {
            val v = value.toString()
            if (v.length % 2 == 0) {
                val half = v.length / 2
                it.set(v.substring(0, half).toLong())
                newList.add(v.substring(half).toLong())
            } else {
                it.set(value * 2024)
            }
        }
    }
    newList.addAll(a)
//    a.println()
    return newList
}

fun blink2(a: MutableList<Pair<Long, Long>>): MutableList<Pair<Long, Long>> {
    var newList = LinkedList<Pair<Long, Long>>();
    var it = a.listIterator()
    while (it.hasNext()) {
        val (value, count) = it.next()
        if (value == 0L) {
            it.set(Pair(1L, count))
        } else {
            val v = value.toString()
            if (v.length % 2 == 0) {
                val half = v.length / 2
                it.set(Pair(v.substring(0, half).toLong(), count))
                newList.add(Pair(v.substring(half).toLong(), count))
            } else {
                it.set(Pair(value * 2024, count))
            }
        }
    }
    newList.addAll(a)
//    a.println()
    return newList
}

public fun part1(input: List<String>, count: Int = 25): MutableList<Long> {
    var a = processInput(input)
    val result = runCalculations(a, count)
    """part1:${result.size}""".println()
    return result
}

public suspend fun part2(input: List<String>, firstRun: Int, secondRun: Int) {
    val firstPart = part1(input, firstRun)
        .groupBy { it }
        .mapValues { it.value.size.toLong() }
        .entries.map { Pair(it.key, it.value) }
/*    firstPart.println()
    firstPart.forEach { (k, v) ->
        """$k:$v""".println()
    }*/
//    """firstPart.size:${firstPart.size}""".println()
    val result = runCalculations2(firstPart.toMutableList(), secondRun)
        .map { (_, count) ->
            count.toBigInteger()
        }
        .fold(BigInteger.ZERO) { acc, bigInteger -> acc + bigInteger }
    "part2:${result}".println()
    /*val result = coroutineScope {
        firstPart.map { (number, count) ->
            async(Dispatchers.IO) {
                "started:$number:$count".println()
                val rs = count.toBigInteger() * runCalculations(mutableListOf(number), smallRun).size.toBigInteger()
                "finished:$number:$rs".println()
                return@async rs
            }
        }.awaitAll()

    }
    result.fold(BigInteger.ZERO) { acc, bigInteger -> acc + bigInteger }.println()*/
}

part1(input, 20)
runBlocking {
    launch {
        part2(input, 35, 40)
    }
}




