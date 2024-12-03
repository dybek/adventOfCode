import koma.create
import koma.extensions.forEachIndexedN
import koma.extensions.mapIndexed
import koma.matrix.Matrix
import kotlin.math.abs

private infix fun Int.toward(to: Int): IntProgression {
    val step = if (this > to) -1 else 1
    return IntProgression.fromClosedRange(this, to, step)
}
fun main() {

    fun transformInput(input: List<String>): Matrix<Double> {
        val matrix  = input.map { line ->
            line.map { char ->
                when (char) {
                    '#' -> 1.0
                    else -> 0.0
                }
            }.toDoubleArray()
        }.toTypedArray()
        return create(matrix)
    }

    fun <T> elementPairs(arr: List<T>): Sequence<Pair<T, T>> = sequence {
        for(i in 0 until arr.size-1)
            for(j in i+1 until arr.size)
                yield(arr[i] to arr[j])
    }

    fun part1(input: List<String>): Int {
        var matrix = transformInput(input)
        var counter = 1.0
        var m2 = matrix.mapIndexed { a,b, value ->
            if (value == 1.0)
                counter++
            else
                0.0
        }
        val emptyRows= mutableListOf<Int>()
            matrix.filterRowsIndexed { index, row ->
                if (row.elementSum() == 0.0) {
                    emptyRows += index
                    true
                } else {
                    false
                }
            }
        val emptyCols= mutableListOf<Int>()
        matrix.filterColsIndexed { index, col ->
            if (col.elementSum() == 0.0) {
                emptyCols += index
                true
            } else {
                false
            }
        }
        var galaxies = mutableListOf<Pair<Int, Int>>()
        matrix.forEachIndexedN{ index, value ->
            if (value == 1.0) {
                galaxies += Pair(index[0], index[1])
            }
        }

        val sum = elementPairs(galaxies).map{(a,b)->
            var x = abs(a.first - b.first)
            var y = abs(a.second - b.second)
            x+=(a.first toward b.first).count { emptyRows.contains(it) }
            y+=(a.second toward b.second).count { emptyCols.contains(it) }
            x+y
        }.sumOf { it }
        sum.println()
        return sum
    }

    fun part2(input: List<String>, muliplier: Int): Long {
        var matrix = transformInput(input)
        var counter = 1.0
        var m2 = matrix.mapIndexed { a,b, value ->
            if (value == 1.0)
                counter++
            else
                0.0
        }
        val emptyRows= mutableListOf<Int>()
        matrix.filterRowsIndexed { index, row ->
            if (row.elementSum() == 0.0) {
                emptyRows += index
                true
            } else {
                false
            }
        }
        val emptyCols= mutableListOf<Int>()
        matrix.filterColsIndexed { index, col ->
            if (col.elementSum() == 0.0) {
                emptyCols += index
                true
            } else {
                false
            }
        }
        var galaxies = mutableListOf<Pair<Int, Int>>()
        matrix.forEachIndexedN{ index, value ->
            if (value == 1.0) {
                galaxies += Pair(index[0], index[1])
            }
        }

        val sum = elementPairs(galaxies).map{(a,b)->
            var x = abs(a.first - b.first).toLong()
            var y = abs(a.second - b.second).toLong()
            x+=((a.first toward b.first).count { emptyRows.contains(it) } * (muliplier-1))
            y+=((a.second toward b.second).count { emptyCols.contains(it) } * (muliplier-1))
            x+y
        }.sumOf { it }
        sum.println()
        return sum
    }

    // test if implementation meets criteria from the description, like:
    val testInput = readInput("data_test")
    part1(testInput).println()
    check(part1(testInput) == 374)
    check(part2(testInput,10) == 1030L)
    check(part2(testInput,100) == 8410L)

    val input = readInput("data")
    part1(input).println()
    part2(input, 1000000).println()
}
