var Observable = require("FuseJS/Observable")
var DateTime = require("lib/DateTime.js")

var date = Observable(new Date());
var selectedDate = Observable();

this.Parameter.onValueChanged(module, function(value) {
	//Selects today's day, if it is the current month and year
	if(value.day == -1){
		if(value.month == new Date().getMonth() && value.year == new Date().getFullYear())
			value.day = new Date().getDate();
		else
			value.day = 1; //Returns the selection of the day to the 1st day of the month
	}

	date.value = new Date(value.year, value.month,value.day)
})

var text = date.map(function(day) {
	var auxDate = checkDateWeek(day);

	return DateTime.dayLabels[auxDate.getDay()]
})

var label = date.map(function(day) {
	var dataLabel = new Date();

	//Selects today's day, if it is the current month and year
	if(day.getDate() == new Date().getDate()
		&& day.getMonth() == new Date().getMonth()
		&& day.getFullYear() == new Date().getFullYear())
	{
		dataLabel = new Date(day.getFullYear(), day.getMonth(), new Date().getDate());
	}
	else
	{
		var auxDate = new Date(day.getFullYear(), day.getMonth(), day.getDate());
		dataLabel = checkDateWeek(auxDate);
	}

	var auxDay = ('0' + (dataLabel.getDate())).slice(-2);
	var auxMonth = ('0' + (dataLabel.getMonth()+1)).slice(-2);

	var textDate = "" + "" + auxDay + "/" + auxMonth + "/" + dataLabel.getFullYear();
	
	selectedDate.value = textDate;
	
	return textDate;
})

function checkDateWeek(date){

	if(date.getDay() == 0){
		return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
	}else if(date.getDay() == 6){
		return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 2);
	}else
	return date;
}

function selectedDay(args){
	console.log("selectedDay");
	console.dir(args);
}

module.exports = {
	text: text,
	label: label,
	
	selectedDay: selectedDay,
};