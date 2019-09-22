$(document).ready(function(){
    var events =  [
        {
            title: 'event3',
            start: '2019-03-03 12:30:00',
            end: '2019-03-03 16:30:00',
            allDay: false 
        }
    ];
    $('#calendar').fullCalendar({
        events: events
    });
});