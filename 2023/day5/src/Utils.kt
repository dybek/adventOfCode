import java.math.BigInteger
import java.security.MessageDigest
import kotlin.io.path.Path
import kotlin.io.path.readLines

/**
 * Reads lines from the given input txt file.
 */
fun readInput(name: String) = Path("src/$name.input").readLines()

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


operator fun BigInteger.rangeTo(other: BigInteger) = BigIntegerRange(this, other)

class BigIntegerRange(start: BigInteger, endInclusive: BigInteger)
    : ClosedRange<BigInteger>, Iterable<BigInteger> {

    override val start: BigInteger = start
    override val endInclusive: BigInteger = endInclusive

    override fun iterator(): Iterator<BigInteger> = BigIntegerIterator(start, endInclusive)
    override fun contains(value: BigInteger): Boolean = value >= start && value <= endInclusive
    override fun isEmpty(): Boolean = start > endInclusive
}

class BigIntegerIterator(start: BigInteger, private val endInclusive: BigInteger)
    : Iterator<BigInteger> {

    private var current = start

    override fun hasNext(): Boolean = current <= endInclusive

    override fun next(): BigInteger {
        if (hasNext()) {
            val toReturn = current
            current += BigInteger.ONE
            return toReturn
        } else {
            throw NoSuchElementException()
        }
    }
}

