import org.jgrapht.alg.StoerWagnerMinimumCut
import org.jgrapht.graph.DefaultWeightedEdge
import org.jgrapht.graph.SimpleWeightedGraph

fun main() {
    fun processInput(input: List<String>): List<Pair<String, List<String>>> {
        return input.map {
            val split = it.split(":")
            Pair(split[0].trim(), split[1].trim().split(" ").map { it.trim() })
        }
    }

    fun part1(input: List<String>): Int {
        val graph = SimpleWeightedGraph<String, DefaultWeightedEdge>(DefaultWeightedEdge::class.java)
        processInput(input).forEach { (vertex, childs) ->
            graph.addVertex(vertex)
            childs.forEach { child ->
                graph.addVertex(child)
                graph.addEdge(vertex, child)
            }
        }
        val result = StoerWagnerMinimumCut(graph).minCut()
        return result.size * (graph.vertexSet().size - result.size)
    }

    fun part2(input: List<String>): Int {
        return 0
    }

    // test if implementation meets criteria from the description, like:
    val testInput = readInput("data_test")
    check(part1(testInput) == 54)

    val input = readInput("data")
    check(part1(input) == 531437)
    part1(input).println()
}
