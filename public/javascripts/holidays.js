$(document).ready(function () {
    var holidays = JSON.parse($('#holidaylist').val());
    var events = [];
    for (var i = 0; i < holidays.length; i++) {
        var newobj = {
            title: holidays[i].message,
            start: holidays[i].date,
            end: holidays[i].date,
            allDay: false,            
        };
        events[i] = newobj;
    }
    // var events =  [
    //     {
    //         title: 'event3',
    //         start: '2019-03-03 12:30:00',
    //         end: '2019-03-03 16:30:00',
    //         allDay: false 
    //     }
    // ];
    $('#calendar').fullCalendar({
        events: events,
        displayEventTime: false
    });
});