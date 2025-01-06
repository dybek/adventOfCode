import java.math.BigInteger
import java.security.MessageDigest
import kotlin.io.path.Path
import kotlin.io.path.readLines
import kotlin.collections.toTypedArray
import kotlin.math.abs


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

class Region(var gardenPlot: Node) : Iterable<Node> {
    override fun toString(): String {
        return "Region: ${gardenPlot.type}, size: ${count()}, area: ${area()}, perimeter: ${perimeter()}, walls: ${walls()}"
    }

    override fun iterator(): Iterator<Node> {
        return object : Iterator<Node> {
            private val stack = mutableListOf(gardenPlot)
            private val visited = mutableSetOf<Node>()

            override fun hasNext(): Boolean {
                return stack.isNotEmpty()
            }

            override fun next(): Node {
//                println("visited:${visited}")
//                println("stack:${stack}")
                val node = stack.removeAt(stack.size - 1)
//                println("current:${node}")
                if (node !in visited) {
                    visited.add(node)
                    node.neighbors
                        .filterNotNull()
                        .filter { it.type == gardenPlot.type }
                        .filter { it !in visited }
                        .filter { it !in stack }
                        .forEach { stack.add(it) }

                }
                return node
            }
        }
    }

    fun area(): Int {
        return count()
    }

    fun perimeter(): Int {
        return this.sumOf { node ->
            node.neighbors.count { it == null || it.type != gardenPlot.type }
        }
    }

    fun walls(): Int {
        val vertical = mutableListOf<Pair<Int, Int>>()
        val vertical2 = mutableListOf<Pair<Int, Int>>()
        val horizontal = mutableListOf<Pair<Int, Int>>()
        val horizontal2 = mutableListOf<Pair<Int, Int>>()
        this.forEach { node ->
//            node.println()
            node.neighbors.forEachIndexed { index, it ->
                if (it == null || it.type != gardenPlot.type) {
//                    println("wall:${index}")
                    when (index) {
                        0 -> vertical += Pair(node.x, node.y)
                        1 -> horizontal += Pair(node.x + 1, node.y)
                        2 -> vertical2 += Pair(node.x, node.y + 1)
                        3 -> horizontal2 += Pair(node.x, node.y)
                    }
                }
            }
        }
        val vg = vertical.groupBy { it.second }.mapValues {
            it.value.map { it.first }.sorted().zipWithNext().count {
                abs(
                    it.first - it.second
                ) != 1
            }
        }
        val vg2 = vertical2.groupBy { it.second }.mapValues {
            it.value.map { it.first }.sorted().zipWithNext().count {
                abs(
                    it.first - it.second
                ) != 1
            }
        }
        val hg = horizontal.groupBy { it.first }.mapValues {
            it.value.map { it.second }.sorted().zipWithNext().count {
                abs(
                    it.first - it.second
                ) != 1
            }
        }
        val hg2 = horizontal2.groupBy { it.first }.mapValues {
            it.value.map { it.second }.sorted().zipWithNext().count {
                abs(
                    it.first - it.second
                ) != 1
            }
        }

//        vg.println()
//        hg.println()

        return vg.values.count()+vg.values.sum() + hg.values.count()+hg.values.sum() + vg2.values.count()+vg2.values.sum() + hg2.values.count()+hg2.values.sum()
    }
}

class Node(val type: Char, val x: Int, val y: Int) {
    var visited: Boolean = false
    var visitedWalls = arrayOf(false, false, false, false)
    lateinit var neighbors: List<Node?>;
    fun createNeighbors(neighbors: List<Node?>) {
        this.neighbors = neighbors
    }

    override fun toString(): String {
        return "${type}(${x},${y})"
    }
//        arrayOfNulls<Node>(4)
}

public fun part1(input: List<String>) {

    var a =
        input.mapIndexed { y: Int, el: String -> el.toCharArray().mapIndexed { x: Int, n: Char -> Node(n, x, y) } }
            .toTypedArray()

    fun printA() {
        a.forEach { row ->
            row.forEach { node ->
                print(if (node.visited) "X" else node.type)
            }
            println("")
        }
    }
    printA()

    val directions = arrayOf(
        Pair(-1, 0),
        Pair(0, 1),
        Pair(1, 0),
        Pair(0, -1)
    )

    fun fillNeighbors(i: Int, j: Int) {
        val node = a[i][j]
        val neighbors = directions.map { (i1, j1) -> Pair(i + i1, j + j1) }
            .map { (i1, j1) ->
                try {
                    a[i1][j1]
                } catch (e: IndexOutOfBoundsException) {
                    null
                }
            }
        node.createNeighbors(neighbors)
    }

    for (i in a.indices) {
        for (j in a[i].indices) {
            fillNeighbors(i, j)
        }
    }


    val regions = mutableListOf<Region>()

    fun findRegion(node: Node, type: Char) {
        if (!node.visited) {
            node.visited = true
            node.neighbors.forEach { neighbor ->
                if (neighbor != null && neighbor.type == type) {
                    findRegion(neighbor, type)
                }
            }
        }
    }

    fun visit(i: Int, j: Int) {
        val current = a[i][j]
        if (!current.visited) {
            val type = current.type
            findRegion(current, type)
            val region = Region(current)
            regions.add(region)
        }
    }


    for (i in a.indices) {
        for (j in a[i].indices) {
            visit(i, j)
        }
    }

    regions
        .forEach { println(it) }
    regions.sumOf { it.area() * it.perimeter() }.println()
}

//part1(testInput)
//part1(testInput2)
//part1(testInput3)
//part1(input)


fun part2(input: List<String>) {

    var a =
        input.mapIndexed { y: Int, el: String -> el.toCharArray().mapIndexed { x: Int, n: Char -> Node(n, x, y) } }
            .toTypedArray()

    val directions = arrayOf(
        Pair(-1, 0),
        Pair(0, 1),
        Pair(1, 0),
        Pair(0, -1)
    )

    fun fillNeighbors(i: Int, j: Int) {
        val node = a[i][j]
        val neighbors = directions.map { (i1, j1) -> Pair(i + i1, j + j1) }
            .map { (i1, j1) ->
                try {
                    a[i1][j1]
                } catch (e: IndexOutOfBoundsException) {
                    null
                }
            }
        node.createNeighbors(neighbors)
    }

    for (i in a.indices) {
        for (j in a[i].indices) {
            fillNeighbors(i, j)
        }
    }

    val regions = mutableListOf<Region>()
    fun findRegion(node: Node, type: Char) {
        if (!node.visited) {
            node.visited = true
            node.neighbors.forEach { neighbor ->
                if (neighbor != null && neighbor.type == type) {
                    findRegion(neighbor, type)
                }
            }
        }
    }

    fun visit(i: Int, j: Int) {
        val current = a[i][j]
        if (!current.visited) {
            val type = current.type
            findRegion(current, type)
            val region = Region(current)
            regions.add(region)
        }
    }

    for (i in a.indices) {
        for (j in a[i].indices) {
            visit(i, j)
        }
    }

    regions
        .forEach { println(it) }
    regions.sumOf { it.area() * it.walls() }.println()
}


//part2(testInput)
part2(testInput2)
part1(testInput3)
part2(input)
