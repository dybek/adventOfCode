package main

import "fmt"
import "io/ioutil"
import "strings"

func main() {
	fmt.Println(day1("input.data"))
}

func day1(fileName string) []string {
	content, err := ioutil.ReadFile(fileName)
	if err != nil {
		panic(err)
	}
	return strings.Split(string(content), "\n\r")
}
