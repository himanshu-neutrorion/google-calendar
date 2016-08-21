
var calendarDemoApp = angular.module('calendarDemoApp', ['ui.calendar', 'ui.bootstrap', 'datePicker']);

calendarDemoApp.controller('CalendarCtrl',
   function($scope, $compile, $timeout, uiCalendarConfig,$http,$window) {
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
	
	// $scope.invites= "";
	// $scope.location = "";
	// $scope.description = "";
	// $scope.invite_start_date = "";
	// $scope.invite_end_date = "";

   
    /* event source that pulls from google.com */
   
    /* event source that contains custom events on the scope */
    $scope.events = [
      {title: 'All Day Event',start: new Date(y, m, 1)},
    ];
    /* event source that calls a function on every view switch */

    /* alert on eventClick */
    $scope.alertOnEventClick = function( date, jsEvent, view){
        $scope.alertMessage = (date.title + ' was clicked ');
    };
    /* alert on Drop */
     $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
       $scope.alertMessage = ('Event Dropped to make dayDelta ' + delta);
    };
    /* alert on Resize */
    $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
       $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };
    /* add and removes an event source of choice */
    $scope.addRemoveEventSource = function(sources,source) {
      var canAdd = 0;
      angular.forEach(sources,function(value, key){
        if(sources[key] === source){
          sources.splice(key,1);
          canAdd = 1;
        }
      });
      if(canAdd === 0){
        sources.push(source);
      }
    };
    /* add custom event*/
    $scope.addEvent = function() {
      $scope.events.push({
        title: $scope.title,
        start: new Date($scope.dateRange.start),
        end: new Date($scope.dateRange.end),
        className: ['openSesame']
      });
        var startDateString = (new Date($scope.dateRange.start)).toISOString();
        var endDateString = (new Date($scope.dateRange.end)).toISOString();
        // console.log($scope.dateRange.start);
	//   console.log($scope.invites);
	// console.log($scope.location);
	// console.log($scope.description);
	// console.log($scope.invite_start_date);
	// console.log($scope.invite_end_date);
	
	$scope.googleCal($scope.invites, $scope.location,startDateString,endDateString,$scope.title,$scope.description);
	
    };
       $scope.logout = function () {
           // $http({
           //     method: 'GET',
           //     url: 'http://www.nextmail.dev/logout'
           // }).success(function(data) {
           //
           // });
           $window.location.href = 'http://www.nextmail.dev/logout';
       }
    /* remove event */
    $scope.remove = function(index) {
      $scope.events.splice(index,1);
    };
    /* Change View */
    $scope.changeView = function(view,calendar) {
      uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
    };
    /* Change View */
    $scope.renderCalendar = function(calendar) {
      $timeout(function() {
        if(uiCalendarConfig.calendars[calendar]){
          uiCalendarConfig.calendars[calendar].fullCalendar('render');
        }
      });
    };
     /* Render Tooltip */
    $scope.eventRender = function( event, element, view ) {
        element.attr({'tooltip': event.title,
                      'tooltip-append-to-body': true});
        $compile(element)($scope);
    };
    /* config object */
    $scope.uiConfig = {
      calendar:{
        height: 450,
        editable: true,
        header:{
          left: 'title',
          center: '',
          right: 'today prev,next'
        },
        eventClick: $scope.alertOnEventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender
      }
    };

   
    /* event sources array*/
    $scope.eventSources = [$scope.events];
    // $scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];
	
	
	
	$scope.dateRange = moment().range("2016-08-21", "2016-08-25");


     //Select range options
     $scope.customRanges = [
     {
         label: "This week",
         range: moment().range(
             moment().startOf("week").startOf("day"),
             moment().endOf("week").startOf("day")
         )
     },
     {
         label: "Last month",
         range: moment().range(
             moment().add(-1, "month").startOf("month").startOf("day"),
             moment().add(-1, "month").endOf("month").startOf("day")
         )
     },
     {
         label: "This month",
         range: moment().range(
             moment().startOf("month").startOf("day"),
             moment().endOf("month").startOf("day")
         )
     },
     {
         label: "This year",
         range: moment().range(
             moment().startOf("year").startOf("day"),
             moment().endOf("year").startOf("day")
         )
     },
     {
         label: "Last year",
         range: moment().range(
             moment().startOf("year").add(-1, "year").startOf("day"),
             moment().add(-1, "year").endOf("year").startOf("day")
         )
     }
     ];

   $scope.mycallback = "None";
   $scope.dateRangeChanged = function() {
   $scope.mycallback = " from " + $scope.dateRange.start.format("LL") + " to " + $scope.dateRange.end.format("LL");
   };
   
   $scope.setEventCalendar = function(){
	 $http({
		 method:'GET',
		 url: 'http://www.nextmail.dev/list'
	 }).success(function(data){
		 
		 angular.forEach(data,function(value,key){
			 
			 $scope.events.push({
						title: value.summary,
						start: new Date(value.start), 
						end: new Date(value.end),
						className: ['openSesame'],
						stick :true,
					});
		 });
		 
	 });  
   };
   
    $timeout($scope.setEventCalendar);
   $scope.googleCal  = function(email, location, start_date, end_date,title, description){
         $http({
            method: 'GET',
            url: 'http://www.nextmail.dev/createEvent?email='+email+'&location='+location+'&start_date='+start_date+'&end_date='+end_date+'&title='+title+'&description='+description
        }).success(function(data) {
             alert("success");
        });
    };
   
	
	
});
calendarDemoApp.controller('dateCtrl', ['$scope', function($scope){
    // specify default date range in controller
    $scope.dateRange = moment().range("2016-08-21", "2016-08-25");


    //Select range options
    $scope.customRanges = [
        {
            label: "This week",
            range: moment().range(
                moment().startOf("week").startOf("day"),
                moment().endOf("week").startOf("day")
            )
        },
        {
            label: "Last month",
            range: moment().range(
                moment().add(-1, "month").startOf("month").startOf("day"),
                moment().add(-1, "month").endOf("month").startOf("day")
            )
        },
        {
            label: "This month",
            range: moment().range(
                moment().startOf("month").startOf("day"),
                moment().endOf("month").startOf("day")
            )
        },
        {
            label: "This year",
            range: moment().range(
                moment().startOf("year").startOf("day"),
                moment().endOf("year").startOf("day")
            )
        },
        {
            label: "Last year",
            range: moment().range(
                moment().startOf("year").add(-1, "year").startOf("day"),
                moment().add(-1, "year").endOf("year").startOf("day")
            )
        }
    ];

    $scope.mycallback = "None";
    $scope.dateRangeChanged = function() {
        $scope.mycallback = " from " + $scope.dateRange.start.format("LL") + " to " + $scope.dateRange.end.format("LL");
    }

}]);


(function () {
var datePicker = angular.module("datePicker", ['pasvaz.bindonce']);
datePicker.directive('taDateRangePicker', ["$compile", "$timeout", function ($compile, $timeout){
            var CUSTOM = "CUSTOM";

            return {
                scope: {
                    model: "=ngModel",
                    ranges: "=?",
                    callback: "&"
                },
                template: "<div class=\"selectbox\"><i class=\"fa fa-calendar\"></i> <span ng-show=\"model\">{{model.start.format(\"LL\")}} - {{model.end.format(\"LL\")}}</span> <span ng-hide=\"model\">Select date range</span> <b class=\"caret\"></b></div>",
                link: function (scope, element, attrs) {
                    //scope.name = 'Aaron';
                    scope.weekDays = moment.weekdaysMin();

                    //set default ranges
                    if (!(scope.ranges && scope.ranges.length))
                        scope.ranges = getDefaultRanges();
                        console.log(scope);
                        console.log(scope.ranges);
                    scope.show = function () {
                        //clear prevs
                        console.log(scope);
                        scope.currentSelection = null;
                        console.log(scope);
                        console.log(scope.ranges);
                        //prepare
                        prepareMonths(scope);
                        scope.selection = scope.model;
                        console.log(scope);
                        prepareRanges(scope);
                        return scope.visible = true;
                    };
                    scope.hide = function ($event) {
                        if ($event != null) {
                            if (typeof $event.stopPropagation === "function") {
                                $event.stopPropagation();
                            }
                        }
                        scope.visible = false;
                        return scope.start = null;
                    };
                    scope.handlePickerClick = function ($event) {
                        return $event != null ? typeof $event.stopPropagation === "function" ? $event.stopPropagation() : void 0 : void 0;
                    };

                    scope.select = function (day, $event) {

                        if ($event != null) {
                            if (typeof $event.stopPropagation === "function") {
                                $event.stopPropagation();
                            }
                        }
                        if (day.disabled) {
                            return;
                        }

                        //both dates are already selected, reset dates
                        var current = scope.getCurrentSelection();

                        var date = day.date;
                        if ((current.start && current.end) || !current.start) {
                            current.start = moment(date);
                            current.end = null;
                            scope.inputDates[0] = current.start.format("YYYY-MM-DD");
                        } else if (current.start && !current.end) {
                            if (current.start.isAfter(date, 'day')) {
                                current.start = moment(date);
                                scope.inputDates[0] = current.start.format("YYYY-MM-DD");
                            }
                            else if (current.start.isBefore(date, 'day')) {
                                current.end = moment(date);
                                scope.inputDates[1] = current.end.format("YYYY-MM-DD");
                            }
                        }
                        scope.resetRangeClass();
                    };

                    scope.setRange = function (range, $event) {
                        if (!range)
                            return;
                        if (range == CUSTOM) {
                            scope.showCalendars = true;
                            return;
                        }
                        scope.showCalendars = false;
                        scope.currentSelection = range.clone();
                        scope.selection = scope.currentSelection.clone();
                        scope.ok($event);
                    };

                    scope.ok = function ($event) {
                        if ($event != null) {
                            if (typeof $event.stopPropagation === "function") {
                                $event.stopPropagation();
                            }
                        }
                        scope.model = scope.selection;
                        $timeout(function () {
                            if (scope.callback) {
                                return scope.callback();
                            }
                        });
                        return scope.hide();
                    };

                    scope.clear = function ($event) {
                        if ($event != null) {
                            if (typeof $event.stopPropagation === "function") {
                                $event.stopPropagation();
                            }
                        }
                        scope.selection = null;
                        scope.ok($event);
                    };

                    scope.applySelection = function ($event) {
                        if ($event != null) {
                            if (typeof $event.stopPropagation === "function") {
                                $event.stopPropagation();
                            }
                        }
                        scope.showCalendars = true;
                        scope.selection = moment.range(scope.currentSelection.start.clone(), scope.currentSelection.end.clone());
                        scope.ok($event);
                    }

                    scope.move = function (date, n, $event) {
                        if ($event != null) {
                            if (typeof $event.stopPropagation === "function") {
                                $event.stopPropagation();
                            }
                        }

                        var currentStart, currentEnd;

                        if (n < 0) {

                            currentStart = date.clone().add(n, 'months');
                            currentEnd = currentStart.clone().add(1, 'months');

                        } else {
                            currentEnd = date.clone().add(n, 'months');
                            currentStart = currentEnd.clone().add(-1, 'months');
                        }

                        scope.months[0] = createMonth(currentStart);
                        scope.months[1] = createMonth(currentEnd);
                    }

                    scope.getCurrentSelection = function() {
                        if (!scope.currentSelection && scope.selection)
                            scope.currentSelection = scope.selection.clone();
                        if (!scope.currentSelection)
                            scope.currentSelection = {};
                        return scope.currentSelection;
                    }

                    scope.getClassName = function (day) {

                        var current = scope.getCurrentSelection();

                        if (!day || day.number == false)
                            return "off";

                        if (current) {
                            if (current.start && current.start.isSame(day.date, 'day'))
                                return "active start-date";
                            if (current.end && current.end.isSame(day.date, 'day'))
                                return "active end-date";
                            if (current.start && current.end && current.start.isBefore(day.date, 'day') && current.end.isAfter(day.date, 'day'))
                                return "in-range";
                        }
                        return "available";
                    };

                    scope.resetRangeClass = function () {
                        var found = false;
                        var current = scope.getCurrentSelection();
                        for (var i = 0; i < scope.ranges.length; i++) {
                            var item = scope.ranges[i];
                            item.active = false;
                            if (item.range && item.range != CUSTOM && current.start && current.end) {
                                if (current.start.isSame(item.range.start, 'day') && current.end.isSame(item.range.end, 'day')) {
                                    item.active = true;
                                    found = true;
                                }
                            }
                        }
                        if (!found)
                            scope.ranges[scope.ranges.length - 1].active = true;
                    };

                    scope.updateStartOrEndDate = function (first, last) {
                        var current = scope.getCurrentSelection();

                        if (first) {
                            var start = moment(scope.inputDates[0]);
                            if (!start)
                                return;

                            current.start = start;
                            if (!current.end || current.end.isBefore(start, 'day')) {
                                current.end = start;
                                scope.inputDates[1] = current.end.format("YYYY-MM-DD");
                            }
                        } else if (last) {
                            var end = moment(scope.inputDates[1]);
                            if (!end)
                                return;

                            current.end = end;
                            if (!current.start || current.start.isAfter(end, 'day')) {
                                current.start = end;
                                scope.inputDates[0] = current.start.format("YYYY-MM-DD");
                            }
                        }
                        scope.resetRangeClass();
                    }

                    scope.moveToMonth = function (first, index) {
                        if (!first)
                            return;

                        var start = moment(scope.inputDates[0]);
                        if (!start)
                            return;

                        if (!start.isSame(scope.months[index].date, 'month')) {
                            //move to month
                            scope.months[0] = createMonth(start.clone());
                            scope.months[1] = createMonth(start.clone().add(1, 'months'));
                        }

                    }


                    /**************************************************************************************/
                    //load popup template
                    var el = $compile(angular.element(getPickDateTemplate()))(scope);
                    element.append(el);

                    element.bind("click", function (e) {
                        if (e != null) {
                            if (typeof e.stopPropagation === "function") {
                                e.stopPropagation();
                            }
                        }
                        return scope.$apply(function () {
                            if (scope.visible) {
                                return scope.hide();
                            } else {
                                return scope.show();
                            }
                        });
                    });
                    var documentClickFn = function (e) {
                        scope.$apply(function () {
                            return scope.hide();
                        });
                        return true;
                    };
                    angular.element(document).bind("click", documentClickFn);
                    scope.$on('$destroy', function () {
                        return angular.element(document).unbind('click', documentClickFn);
                    });
                }
            };

            function prepareRanges(scope) {
               console.log(scope.ranges);
               console.log(scope.ranges.length);
                if (scope.ranges[scope.ranges.length - 1].range != CUSTOM)
                    scope.ranges.push({ label: 'Custom Range', range: CUSTOM });

                scope.resetRangeClass();

                if (scope.ranges[scope.ranges.length - 1].active)
                    scope.showCalendars = true;
            };

            function prepareMonths(scope) {
                scope.months = [];
                var start = null;
                var end = null;
                if (scope.model) {
                    start = scope.model.start;
                    end = scope.model.end;
                }

                if (!start) start = moment();
                if (!end) end = moment();

                scope.months.push(createMonth(start.clone().startOf("month")));
                scope.months.push(createMonth(start.clone().startOf("month").add(1, "month")));

                scope.inputDates = [];
                scope.inputDates.push(start.format("YYYY-MM-DD"));
                scope.inputDates.push(end.format("YYYY-MM-DD"));
            }

            function createMonth(date) {
                var month = { name: date.format("MMM YYYY"), date: date, weeks: getWeeks(date) };
                return month;
            }

            function sameMonth(a, b, other) {
                if (a.month() !== b.month()) {
                    return other;
                }
                return a.date();
            }

            function getWeeks(m) {
                var lastOfMonth = m.clone().endOf('month'),
                    lastOfMonthDate = lastOfMonth.date(),
                    firstOfMonth = m.clone().startOf('month'),
                    currentWeek = firstOfMonth.clone().day(0),
                    startOfWeek,
                    endOfWeek;

                var thisMonth = m.month();
                var thisYear = m.year();

                var weeks = [];
                while (currentWeek < lastOfMonth) {
                    startOfWeek = sameMonth(currentWeek.clone().day(0), firstOfMonth, 1);
                    endOfWeek = sameMonth(currentWeek.clone().day(6), firstOfMonth, lastOfMonthDate);

                    var week = [];
                    for (var i = startOfWeek; i <= endOfWeek; i++)
                        week.push({ number: i, date: new Date(thisYear, thisMonth, i) });

                    var days = week.length;
                    if (days < 7) {
                        if (weeks.length == 0) {
                            while (days < 7) {
                                week.splice(0, 0, { number: false, disabled: true });
                                days += 1;
                            }
                        } else {
                            while (days < 7) {
                                week.push({ number: false, disabled:true });
                                days += 1;
                            }
                        }
                    }
                    weeks.push(week);

                    currentWeek.add(7, 'd');
                }

                return weeks;
            }

            function getDefaultRanges() {
                return [
                    {
                        label: "This week",
                        range: moment().range(moment().startOf("week").startOf("day"), moment().endOf("week").startOf("day"))
                    }, {
                        label: "Next week",
                        range: moment().range(moment().startOf("week").add(1, "week").startOf("day"), moment().add(1, "week").endOf("week").startOf("day"))
                    }, {
                        label: "This month",
                        range: moment().range(moment().startOf("month").startOf("day"), moment().endOf("month").startOf("day"))
                    }, {
                        label: "Next month",
                        range: moment().range(moment().startOf("month").add(1, "month").startOf("day"), moment().add(1, "month").endOf("month").startOf("day"))
                    }, {
                        label: "Year to date",
                        range: moment().range(moment().startOf("year").startOf("day"), moment().endOf("day"))
                    }
                ];
            }

                function getPickDateTemplate() {
                    return ''
                        + '<div ng-show="visible" ng-click="handlePickerClick($event)" class="ta-daterangepicker">'
                        + '<div bindonce ng-repeat="month in months" class="calendar" ng-show="showCalendars">'
                        + '<div class="input">'
                        + '<input class="input-mini active" type="text" ng-model="inputDates[$index]" ng-change="updateStartOrEndDate($first,$last)" ng-blur="moveToMonth($first,$index)"/>'
                        + '<i class="fa fa-calendar"></i>'
                        + '<a ng-show="$last && currentSelection && currentSelection.start && currentSelection.end" href="" ng-click="clear()"><i class="fa fa-remove"></i></a>'
                        + '</div>'
                        + '<div class="calendar-table">'
                        + '<table>'
                        + '<thead>'
                        + '<tr>'
                        + '<th class="available"><a ng-if="$first" ng-click="move(month.date, -1, $event)"><i class="fa fa-chevron-left"></i> </a></th>'
                        + '<th colspan="5"><div class="month-name" bo-text="month.name"></div></th>'
                        + '<th class="available"> <a ng-if="$last" ng-click="move(month.date, +1, $event)"><i class="fa fa-chevron-right"></i> </a> </th>'
                        + '</tr>'
                        + '<tr>'
                        + '<th bindonce ng-repeat="day in weekDays" class="weekday" bo-text="day"></th>'
                        + '</tr>'
                        + '</thead>'
                        + '<tbody>'
                        + '<tr bindonce ng-repeat="week in month.weeks">'
                        + '<td ng-repeat="day in week" ng-class="getClassName(day)">'
                        + '<div ng-if="day.number" bo-text="day.number" ng-click="select(day, $event)"></div>'
                        + '</td>'
                        + '</tr>'
                        + '</tbody>'
                        + '</table>'
                        + '</div>'
                        + '</div>'
                        + '<button class="btn btn-sm btn-success" ng-click="applySelection()" ng-disabled="!showCalendars || !currentSelection || !currentSelection.start || !currentSelection.end">Apply</button> '
                        + '<button class="btn btn-sm btn-default" ng-click="hide()">Cancel</button>'
                        + '</div>'
                        + '</div>'
                        + '</div>';
                }
            }
    ]);
})();
