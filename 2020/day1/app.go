package main

import "fmt"
import "io/ioutil"
import "strings"
import "strconv"

func day1(content []byte) {
	input := strings.Split(string(content), "\n")

	var numbers = make([]int, len(input))
	var err error
	for i := 0; i < len(numbers); i++ {
		numbers[i], err = strconv.Atoi(input[i])
	}
	if err != nil {
		panic(err)
	}


	fmt.Println(part1(numbers))
	fmt.Println(part2(numbers))
}

func part1(numbers []int) int{
	for i := 0; i < len(numbers); i++ {
		for j := 0; j < len(numbers); j++ {
			if numbers[i] + numbers[j] == 2020{
				return numbers[i] * numbers[j]
			}
		}
	}
	return 0
}

func part2(numbers []int) int{
	for i := 0; i < len(numbers); i++ {
		for j := 0; j < len(numbers); j++ {
			for k := 0; k < len(numbers); k++ {
				if numbers[i] + numbers[j] + numbers[k] == 2020{
					return numbers[i] * numbers[j] * numbers[k]
				}
			}
		}
	}
	return 0
}

func fileInput(fileName string) []byte{

	content, err := ioutil.ReadFile(fileName)
	if err != nil {
		panic(err)
	}
	return content
}

func day(file string) {
    day1(fileInput(file))
}

func main() {
	day("input.data")
	day("input2.data")
}