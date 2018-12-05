const fs = require('fs')
const path = require('path')
const moment = require('./moment.js')


class InputRow {

    constructor(row) {
        let matched = /\[(.*)\] (falls asleep|wakes up|Guard #(\d*) begins shift)/g.exec(row);
        this.date = matched[1];
        this.observation = matched[2];
        this.guardId = parseInt(matched[3]);
        this.mDate = moment(this.date);
    }
    toString(){
        return `${this.date} ${this.observation}`;
    }
}
class OneDay{
    constructor(mDate){
        this.events = []
        this.mDay = (mDate.hour() == 23) ? moment(mDate).startOf('day').add(1, 'day') : moment(mDate).startOf('day'); 
    }

    addEvent(event){
        this.events.push(event);
    }

    sameDay(dateToCheck){
        return dateToCheck.isBetween(
            moment(this.mDay).add(-1, 'hour'),
            moment(this.mDay).add(23, 'hour')
        );
    }
    initVariables(){
        //this.guardId = this.events.find(event=>event.guardId).guardId;
        this.guardId = this.events.shift().guardId;
        let minutes = [];
        let event = this.events.shift();
        let watch = 0
        for(let i=0;i<60;i++){
            if (event && i == event.mDate.minute()){
                watch = event.observation == 'falls asleep' ? 1 : 0;
                event = this.events.shift();
            }
            minutes[i]=watch;
        }
        this.minutes = minutes;
    }
    sleepTime(){
        return this.minutes.reduce((a,b)=>a+b);
    }
}
class Guard{
    constructor(){
        this.days = [];
    }
    addDay(day){
        this.days.push(day);
    }
    sleepTime(){
        return this.days.reduce((sum, day) => sum + day.sleepTime(),0);
    }
    guardId(){
        return this.days[0].guardId;
    }
    mostSleepMinute() {
        let minutes = [];
        for (let i = 0; i < 60; i++) {
            minutes[i] = 0;
        }
        for (let i = 0; i < 60; i++) {
            this.days.forEach(day => minutes[i] += day.minutes[i])
        }
        let maxValue = 0;
        let mostSleepMinute = 0;

        for (let i = 0; i < 60; i++) {
            if (minutes[i] > maxValue) {
                maxValue = minutes[i];
                mostSleepMinute = i;
            }
        };
        return [mostSleepMinute, maxValue];
    }
}

class Day {
    constructor(dayInput) {
        this.dayInput = dayInput;
        console.log(this.part1());
        console.log(this.part2());
    }

    part1() {
        let report = this.groupByDay();
        report.forEach(oneDay=>oneDay.initVariables())
        let guards = new Map();
        report.forEach(oneDay=>{
            let guard;
            if (guards.has(oneDay.guardId)){
                guard = guards.get(oneDay.guardId);
            }else{
                guard = new Guard();
                guards.set(oneDay.guardId, guard);
            }
            guard.addDay(oneDay);
        });
        let maxSleepTime = 0;
        let maxSleepGuard = null;

        [...guards.values()].forEach(guard => {
            if (guard.sleepTime() > maxSleepTime){
                maxSleepTime = guard.sleepTime();
                maxSleepGuard = guard;
            }
        });

        return maxSleepGuard.guardId() * maxSleepGuard.mostSleepMinute()[0];
    }

    groupByDay(){
        let report = [];
        this.dayInput
            .sort((a, b) => a.mDate.valueOf() - b.mDate.valueOf())
            .forEach(event => {
                let theDay = report.find(reportPostion => reportPostion.sameDay(event.mDate));
                if (!theDay) {
                    theDay = new OneDay(event.mDate);
                    report.push(theDay);
                }
                theDay.addEvent(event);
            });
        return report;
    }

    part2() {
        let report = this.groupByDay();
        report.forEach(oneDay => oneDay.initVariables())
        let guards = new Map();
        report.forEach(oneDay => {
            let guard;
            if (guards.has(oneDay.guardId)) {
                guard = guards.get(oneDay.guardId);
            } else {
                guard = new Guard();
                guards.set(oneDay.guardId, guard);
            }
            guard.addDay(oneDay);
        });

        let maxTimes = 0;
        let maxSleepGuard = null;
        let maxmostSleepMinute = 0;

        [...guards.values()].forEach(guard => {
            let [mostSleepMinute,times] = guard.mostSleepMinute()
            if (times > maxTimes) {
                maxTimes = times;
                maxSleepGuard = guard;
                maxmostSleepMinute = mostSleepMinute;
            }
        });

        return maxSleepGuard.guardId() * maxmostSleepMinute;
    }

};

function fileInput(fileName){
    const file = path.join(__dirname, fileName)
    return fs.readFileSync(file, { encoding: 'utf-8' })
        .split('\n')
        .map(row => new InputRow(row));
}
function day(file){
    new Day(fileInput(file));
}

day('data2.input');
//day('data3.input');
day('data.input');
