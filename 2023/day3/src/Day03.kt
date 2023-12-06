// I'm not proud  of this code
fun main() {
    fun part1(input: List<String>): Int {
        val maxY = input.size
        val maxX = input[0].length

        fun canGoTo(x: Int, y: Int): Boolean {
            if (x < 0) return false
            if (x >= maxX) return false
            if (y < 0) return false
            if (y >= maxY) return false
            return true
        }

        fun visit(x: Int, y: Int): Char {
            return input[y][x]
        }

        fun isSymbol(c: Char): Boolean {
            return !".0123456789".contains(c)
        }

        fun isNumber(c: Char): Boolean {
            return "0123456789".contains(c)
        }

        fun symbolInArea(x: Int, y: Int): Boolean {
            return listOf(
                Pair(x - 1, y - 1),
                Pair(x - 1, y),
                Pair(x - 1, y + 1),
                Pair(x, y - 1),
                Pair(x, y + 1),
                Pair(x + 1, y - 1),
                Pair(x + 1, y),
                Pair(x + 1, y + 1)
            ).filter { canGoTo(it.first, it.second) }
                .map {
                    val a = visit(it.first, it.second)
                    a
                }
                .map { isSymbol(it) }
                .reduce { acc, b ->
                    acc || b
                }
        }

        var currentNumber = ""
        var isLabel = false
        val labels = mutableListOf<Int>()

        for (i in 0..<maxY) {
            for (j in 0..<maxX) {
                val current = input[i][j]
                if (isNumber(current)) {
                    currentNumber += current
                    isLabel = isLabel || symbolInArea(j, i)
                } else {
                    if (currentNumber.isNotEmpty()) {
                        if (isLabel) {
                            labels.add(currentNumber.toInt())
                        }
                        currentNumber = ""
                        isLabel = false
                    }
                }
            }
        }
        if (isLabel) {
            labels.add(currentNumber.toInt())
        }
        return labels.reduce { sum, el -> sum + el }
    }

    fun part2(input: List<String>): Int {
        val maxY = input.size
        val maxX = input[0].length


        fun canGoTo(x: Int, y: Int): Boolean {
            if (x < 0) return false
            if (x >= maxX) return false
            if (y < 0) return false
            if (y >= maxY) return false
            return true
        }

        fun visit(x: Int, y: Int): Char {
            return input[y][x]
        }

        fun isNumber(c: Char): Boolean {
            return "0123456789".contains(c)
        }

        fun findLabels(x: Int, y: Int): List<Int> {

            fun findNumber(x: Int, y: Int):List<Pair<Int,Int>> {
                return listOf(
                    Pair(x - 1, y - 1),
                    Pair(x - 1, y),
                    Pair(x - 1, y + 1),
                    Pair(x, y - 1),
                    Pair(x, y + 1),
                    Pair(x + 1, y - 1),
                    Pair(x + 1, y),
                    Pair(x + 1, y + 1)
                )
                    .filter { canGoTo(it.first, it.second) }
                    .filter {
                        val fieldValue = visit(it.first, it.second)
                        isNumber(fieldValue)
                    }
            }

            fun findLabel(x: Int, y: Int):Int{
                var localX = x
                var label = visit(localX,y).toString()
                while(canGoTo(--localX,y) && isNumber(visit(localX,y))){
                    label = "${visit(localX,y)}${label}"
                }
                localX = x
                while(canGoTo(++localX,y) && isNumber(visit(localX,y))){
                    label = "${label}${visit(localX,y)}"
                }
                return label.toInt()
            }

            return findNumber(x,y)
                .map{ findLabel(it.first, it.second)}
                .distinct()

        }

        val labels = mutableListOf<Int>()

        for (i in 0..<maxY) {
            for (j in 0..<maxX) {
                val current = input[i][j]
                if (current == '*') {

                    val foundLabels = findLabels(j, i)
                        if(foundLabels.size==2){
                            labels.add(foundLabels[0]*foundLabels[1])
                        }
                }
            }
        }

        return labels.reduce { sum, el -> sum + el }
    }

    // test if implementation meets criteria from the description, like:
    val testInput = readInput("data_test")
    check(part1(testInput) == 4361)
    check(part2(testInput) == 467835)

    val input = readInput("data")
    check(part1(input) == 529618)
    check(part2(input) == 77509019)
    part1(input).println()
    part2(input).println()
}
