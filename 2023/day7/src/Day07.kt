var Cards = arrayOf( "A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2").reversed()
var Cards2 = arrayOf( "A", "K", "Q", "T", "9", "8", "7", "6", "5", "4", "3", "2", "J").reversed()

class Hand(val cards:String, val bid:Int, val part2: Boolean =false) : Comparable<Hand> {
    fun type():Int {
        val isFiveOfAKind = cards.map { it }.distinct().size == 1
        val isFourOfAKind = cards.groupBy { it }.map { it.value.size }.contains(4)
        val isFullHouse = cards.groupBy { it }.map { it.value.size }.containsAll(listOf(2,3))
        val isThreeOfAKind = cards.groupBy { it }.map { it.value.size }.contains(3)
        val isTwoPairs = cards.groupBy { it }.map { it.value.size }.filter { it == 2 }.size == 2
        val isOnePair = cards.groupBy { it }.map { it.value.size }.contains(2)
        val isHighCard = true
        return when {
            isFiveOfAKind -> 7
            isFourOfAKind -> 6
            isFullHouse -> 5
            isThreeOfAKind -> 4
            isTwoPairs -> 3
            isOnePair -> 2
            isHighCard -> 1
            else -> 0
        }
    }

    fun type2():Int {
        if(cards.contains("J")){
            val j = cards.count { it == 'J' }
            val cardsJ = cards.map { it }.filter { it!='J' }
            val isFiveOfAKind = j==5 || j==4 || cardsJ.distinct().size == 1
//            j==3
            val isFourOfAKind = cardsJ.groupBy { it }.map { it.value.size }.contains(4-j)

            val isFullHouse = j==2 && cardsJ.groupBy { it }.map { it.value.size }.contains(2) || j==1 && cardsJ.groupBy { it }.map { it.value.size }.filter { it == 2 }.size == 2
            val isThreeOfAKind = j==2 || j==1 && cardsJ.groupBy { it }.map { it.value.size }.contains(2)
            val isOnePair = j==1
            val isHighCard = true
            return when {
                isFiveOfAKind -> 7
                isFourOfAKind -> 6
                isFullHouse -> 5
                isThreeOfAKind -> 4
                isOnePair -> 2
                isHighCard -> 1
                else -> 0
            }
        }else{
            return type()
        }
    }
    override fun compareTo(other: Hand): Int {
        if(part2) {
            type2().let {
                if (it != other.type2()) return it - other.type2()
            }
        }else{
            type().let {
                if (it != other.type()) return it - other.type()
            }
        }

        var thisCardIndices:List<Int>
        var otherCardIndices:List<Int>
        if(part2) {
            thisCardIndices = cards.map { Cards2.indexOf(it.toString()) }
            otherCardIndices = other.cards.map { Cards2.indexOf(it.toString()) }
        }else {
            thisCardIndices = cards.map { Cards.indexOf(it.toString()) }
            otherCardIndices = other.cards.map { Cards.indexOf(it.toString()) }
        }
        return thisCardIndices.zip(otherCardIndices).map { it.first - it.second }.firstOrNull { it != 0 } ?: 0
    }
}

fun main() {
    fun createInput(input: List<String>, part2: Boolean=false): List<Hand> {
        return input.map {
            val (cards,bid) = it.split(" ")
            Hand(cards.trim(), bid.trim().toInt(),part2)
        }
    }
    fun part1(input: List<String>): Int {
        return createInput(input).sorted().withIndex()
            .map{(index,it)->
                (index+1)*it.bid
            }
            .sumOf {it}
    }

    fun part2(input: List<String>): Int {
        return createInput(input, true).sorted().withIndex()
            .map{(index,it)->
//                println("${it.cards} type:${it.type2()} bid:${it.bid}")
                (index+1)*it.bid
            }
            .sumOf {it}
    }

    val testInput = readInput("data_test")
//    part1(testInput).println()
//    part2(testInput).println()
    check(part1(testInput) == 6440)
    check(part2(testInput) == 5905)

    val input = readInput("data")
    part1(input).println()
    check(part1(input) == 248422077)
    part2(input).println()
    check(part2(input) == 249817836)
}