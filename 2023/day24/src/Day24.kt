import dev.romainguy.kotlin.math.Float2
import dev.romainguy.kotlin.math.dot
import dev.romainguy.kotlin.math.normalize
import java.math.BigDecimal
import kotlin.math.sign

class Row(val x: Long, val y: Long, val z: Long, val vx: Long, val vy: Long, val vz: Long) {
    override fun toString(): String {
        return "pos=<x=$x, y=$y, z=$z>, vel=<x=$vx, y=$vy, z=$vz>"
    }
}
typealias Point = Pair<Long, Long>
typealias Vector = Pair<Long, Long>

fun main() {
    fun lineIntersection(p1: Point, v1: Vector, p2: Point, v2: Vector): Pair<Double, Double>? {
        // Ax + By + C = 0
        val A1 = v1.second.toDouble()
        val B1 = -v1.first.toDouble()
        val C1 = -(A1 * p1.first + B1 * p1.second)

//        assert(A1 * p1.first + B1 * p1.second + C1 == 0L)
//        assert(A1 * (p1.first+v1.first) + B1 * (p1.second+v2.second) + C1 == 0L)

        val A2 = v2.second.toDouble()
        val B2 = -v2.first.toDouble()
        val C2 = -(A2 * p2.first + B2 * p2.second)

//        assert(A2 * p2.first + B2 * p2.second + C2 == 0L)
//        assert(A2 * (p2.first+v2.first) + B2 * (p2.second+v2.second) + C2 == 0L)

        val det = (B1 * A2) - (B2 * A1)

//        println("${A1}x + ${B1}y + ${C1} = 0")
//        println("${A2}x + ${B2}y + ${C2} = 0")
        if (det == 0.0) {
            return null
        } else {
            val x = ((C1 * B2) - (B1 * C2)).toDouble() / det.toDouble()
            val y = (A1 * C2 - C1 * A2).toDouble() / det.toDouble()
            if(sign(x-p1.first.toDouble()) == sign(v1.first.toDouble()) &&
//            sign(y-p1.second.toDouble()) == sign(v1.second.toDouble()) &&
            sign(x-p2.first.toDouble()) == sign(v2.first.toDouble()) //&&
//            sign(y-p2.second.toDouble()) == sign(v2.second.toDouble())
                ){
                return Pair(x, y)
            }else{
                return null
            }
        }
    }





    fun processInput(input: List<String>): List<Row> {
        return input.map {
            val row = it.split("@")
                .flatMap { it.split(",").map { it.trim().toLong() } }.toTypedArray()
            Row(row[0], row[1], row[2], row[3], row[4], row[5])
        }
    }

    fun part1(input: List<String>, l: Long, l1: Long): Int {
        var l = l.toDouble()
        var l1 = l1.toDouble()
        var numbers = processInput(input).map { Pair(Pair(it.x,it.y), Pair(it.vx,it.vy)) }
//        numbers.println()
        var intersects = mutableListOf<Pair<Double, Double>>()
        numbers.forEachIndexed { i,a ->
            numbers.forEachIndexed { j,b ->
                if (i > j) {
                    val i = lineIntersection(a.first, a.second, b.first, b.second)
//                    i.println()
                    if (i != null)
                        if (i.first in l..l1 && i.second in l..l1) {
                            intersects.add(i)
//                            println("intersect $a $b $i")
                        }
                }
            }
        }
//    intersects.println()
    return intersects.size
}

fun part2(input: List<String>): Int {
    return 0
}

// test if implementation meets criteria from the description, like:
val testInput = readInput("data_test")
    part1(testInput, 7, 27).println()
check(part1(testInput, 7, 27) == 2)
//    check(part2(testInput) == 2286)

val input = readInput("data")
//    check(part1(input) == 529618)
//    check(part2(input) == 77509019)
part1(input, 200000000000000, 400000000000000).println() //12853 to low
//    part2(input).println()
}
