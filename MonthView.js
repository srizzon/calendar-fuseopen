var Observable = require("FuseJS/Observable")
var DateTime = require("lib/DateTime.js")

var viewNode = this;
var date = Observable(DateTime.first(new Date()));
var currentMonth = Observable(false);
var isToday = Observable(false);
var daySelected = Observable();

var isLoading = Observable(false);

/** The parameter to this page contains the date we should be displaying. */
this.Parameter.onValueChanged(module, function(value) {
	date.value = new Date(value.year, value.month,1)
})

function changeMonth(){
	if(isLoading.value)
		isLoading.value = false;
	else
		isLoading.value = true;
}

/** When a month is activated we set the bookmarks to the previous and next month. */
exports.activated = function() {
	
	//Seleciona o dia de hoje, caso seja o mês e ano atual
	if(date.value.getMonth() == new Date().getMonth()
	   && date.value.getFullYear() == new Date().getFullYear()){
		daySelected.value = new Date().getDate();
		currentMonth.value = true;
	}
	else{
		//Volta a seleção do dia da semana
		if(date.value.getDay() == 0){
			date.value = new Date(date.value.getFullYear(), date.value.getMonth(), date.value.getDate() + 2);
			daySelected.value = 2;
		}
		else if(date.value.getDay() == 6){
			date.value = new Date(date.value.getFullYear(), date.value.getMonth(), date.value.getDate() + 3);
			daySelected.value = 3;
		}
		else{
			if(daySelected.value == undefined)
				daySelected.value = 1;
		}

		currentMonth.value = false;
	}

	var p = new Date(date.value.valueOf())

	routerCalendar.pushRelative( viewNode, "day", { month: p.getMonth(), year: p.getFullYear(), day: -1 })

	p.setMonth( p.getMonth() - 1)
	routerCalendar.bookmark({
		name: "prevMonth",
		relative: viewNode,
		path: [ "month", { month: p.getMonth(), year: p.getFullYear() } ]
	})
	
	p = new Date(date.value.valueOf())
	p.setMonth( p.getMonth() + 1)
	routerCalendar.bookmark({
		name: "nextMonth",
		relative: viewNode,
		path: [ "month", { month: p.getMonth(), year: p.getFullYear() } ]
	})

	isLoading.value = false;
}

/** A day from the previous/next month on the grid */
function FillDay(day) {
	this.type = "fill"
	this.day = day
	this.dayOfMonth = day.getDate()

	if(day.getDate() == new Date().getDate()
	   && day.getMonth() == new Date().getMonth()){
		this.isToday = true;
	}
	else{
		this.isToday = false;
	}
}

/** A day from the current month */
function Day(day) {
	if(validDateWeek(day))
		this.type = "day";
	else
		this.type = "fill";

	this.day = day;
	this.dayOfMonth = day.getDate();

	if(day.getDate() == new Date().getDate()
	   && day.getMonth() == new Date().getMonth()
	   && day.getFullYear() == new Date().getFullYear()){
		this.isToday = true;
	}
	else{
		this.isToday = false;
	}
}

function validDateWeek(day){

	//Sunday
	//if(day.getDay() == 0)
	//	return false;

	//Saturday
	//if(day.getDay() == 6)
	//	return false;

	// Block future days
	//if(day >= new Date())
	//	return false;

	// Block days past
	//if(day >= new Date())
	//	return false;

	return true;
}

/** The `days` are filled with complete weeks worth of days to cover the current month. */
exports.days = Observable()
date.onValueChanged(module, function(v) {
	var first = DateTime.first(v)
	var num = DateTime.monthDays(v)
	
	var days = []
	
	var day = first
	var start = DateTime.dayOfWeek(first)
	day.setDate(day.getDate() - start)
	for (var i=0; i < start; ++i) {
		days.push( new FillDay(day) )
		day = DateTime.nextDay(day)
	}

	for (var i=0; i < num; ++i) {
		days.push( new Day(day) )
		day = DateTime.nextDay(day)
	}
	
	var end = (num + start) % 7
	if (end > 0) {
		for (var i=end; i < 7; ++i) {
			days.push( new FillDay(day) );
			day = DateTime.nextDay(day)
		}
	}

	var tempToday = new Date();

	exports.today = tempToday.getDate()

	exports.days.replaceAll(days)
})

exports.monthLabel = date.map( function(v) {
	return DateTime.monthLabels[v.getMonth()] + " " + v.getFullYear()
})

exports.daysOfWeek = ["D","S","T","Q","Q","S","S"]

exports.openDay = function(args) {
	var day = args.data.day;

	var auxMonth = ('0' + (day.getMonth())).slice(-2);

	routerCalendar.pushRelative( viewNode, "day", { month: auxMonth, year: day.getFullYear(), day: day.getDate() })
}

exports.daySelected = daySelected
exports.currentMonth = currentMonth
exports.isLoading = isLoading
exports.changeMonth = changeMonth
