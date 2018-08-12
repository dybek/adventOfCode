package day2

import java.io.File

class Day2 {
    init {

        part1()
        part2()
    }

    fun part1(){
        var sum = 0

        File(this.javaClass.getResource("./input").file).forEachLine { it ->

            val regex = """(\d+)x(\d+)x(\d+)""".toRegex()
            val matchResult = regex.find(it)
            val dimmensions = matchResult!!.destructured.toList().map { Integer.parseInt(it) }
            val (l, w, h) = dimmensions

            val fields = arrayListOf<Int>(l*w, l*h, w*h)
            val min = fields.min()

            val field = fields.sum() * 2 + min!!
            sum += field
        }
        println(sum)
    }

    fun part2(){
        var sum = 0

        File(this.javaClass.getResource("./input").file).forEachLine { it ->

            val regex = """(\d+)x(\d+)x(\d+)""".toRegex()
            val matchResult = regex.find(it)
            val dimmensions = matchResult!!.destructured.toList().map { Integer.parseInt(it) }
            val (l, w, h) = dimmensions


            val max = dimmensions.max()!!

            val ribbon = (l+w+h - max)*2 + l*w*h

            sum += ribbon
        }
        println(sum)
    }
}

fun main(args: Array<String>) {
    Day2()

}