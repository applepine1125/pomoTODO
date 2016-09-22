var tasklist = [];

/* uniqId:はautoincrementするIDの最大値を保存 */

function init() {
    if (!localStorage.getItem('uniqId')) {
        localStorage.setItem('uniqId', 0);
    }

    $('#tbl-todo').find("tr:gt(0)").remove();

    queryTasks();

    for (var i = 0; i < tasklist.length; i++) {
        taskId = i + 1;
        $('tbody tr:last').after("<tr><td class='task-number'>" + "<b>" + taskId + "</b>. " + "</td><td class='taskName'>" + tasklist[i].split("|")[1] + "</td><td class='doneButton'><input type='button' value='Done' class='button btn-done-task is-primary is-outlined'></td><input type='hidden' class='taskId' value='" + tasklist[i] + "'></tr>");
    }

    $(".btn-done-task").on('click', function() {
        var idx = parseInt($('.btn-done-task').index(this));
        var td = $('.taskId:eq(' + idx + ')').val();
        var ss = td.split("|");
        updateTask(ss[0], "", 0);
        init();
    });

};

init();

/**
 * Press Enter Key then submit and clear textbox.
 */
$('#taskName').keypress(function(e) {
    if (e.which == 13) {
        var taskName = $('#taskName').val();
        if (!taskName) {
            alert('Please input taskname first.');
            return false;
        }
        insertTask(taskName);
        init();
        $("#taskName").val('');
    }
});


/* timer function */
$(document).on('click', '.timer-start', function() {
    $(".timer-start").val("Timer Pause");
    $(".timer-start").attr('class', "button is-primary is-outlined is-large timer-pause");
    $(".timeout").attr('class', "timer");
    $('.timer').startTimer({
        // allowPause: true,
        // onComplete: function() {
        //         $(".timer-pause").val("Timer Start");
        //         $(".timer-pause").attr('class', "timer-start");
        //         // for(var i = 0;i <)
        //         var td = $('.taskId:eq(' + "0" + ')').val();
        //         console.log(td);
        //         if (td) {
        //             var ss = td.split("|");
        //             updateTask(ss[0], "", 0);
        //         }
        //         init();
        // }
    });
});

$(document).on('click', '.timer-resume', function() {
    $(".timer").trigger('resume');
    $(".timer-resume").val("Timer Pause");
    $(".timer-resume").attr('class', "button is-primary is-outlined is-large timer-pause");
});

$(document).on('click', '.timer-pause', function() {
    $(".timer").trigger('pause');
    $(".timer-pause").val("Timer Resume");
    $(".timer-pause").attr('class', "button is-primary is-outlined is-large timer-resume");
});

/* add button */
$("#btn-add-task").click(function() {
    var taskName = $('#taskName').val();
    if (!taskName) {
        alert('Please input taskname first.');
        return false;
    }
    insertTask(taskName);
    init();
    $("#taskName").val('');
});

/* clear button */
$("#btn-clear-task").click(function() {
    queryTasks();
    if (confirm('Do you delete localStorage?')) {
        clearLocalStorage();
        $('#tbl-todo').find("tr:gt(0)").remove();
    }
});

/*  delete localStorage */
function clearLocalStorage() {
    localStorage.clear();
    localStorage.setItem('uniqId', 0);
}

/* insertTask */
function insertTask(taskName) {
    var data = {
        taskName: taskName,
        validFlg: 1, //1:valid,0:invalid
        createDate: new Date()
    };
    /* increment uniqId */
    localStorage.setItem('uniqId', parseInt(localStorage.getItem('uniqId')) + 1);
    /* insert localStorage */
    var maxUniqId = localStorage.getItem('uniqId');
    localStorage.setItem(maxUniqId, JSON.stringify(data));
}

/* update task Information(now just validflg) */
function updateTask(id, taskName, validFlg) {
    var json = JSON.parse(localStorage.getItem(parseInt(id)));
    json.validFlg = validFlg;
    localStorage.setItem(parseInt(id), JSON.stringify(json));
}

/* query TaskList */
function queryTasks() {
    var maxUniqId = parseInt(localStorage.getItem('uniqId'));
    tasklist = [];
    for (var i = 1; i <= maxUniqId; i++) {
        var json = JSON.parse(localStorage.getItem(String(i)));
        if (json.validFlg == 1) {
            tasklist.push(i + "|" + json.taskName);
        }
    }
}

$(".button").click(function() {
    $(this).blur();
});

var data = {
    labels: [
        "elapsed time",
        "remaining time",
    ],
    datasets: [{
        data: [0, 1500],
        backgroundColor: [
            "#E1E2E3",
            "#FF4500",
        ],
        hoverBackgroundColor: [
            "#E5E7EA",
            "#FF6600",
        ],
        borderWidth: [0, 0]
    }]
};

var options = {
    responsive: false,
    legend: {
        display: false
    },
    cutoutPercentage: 90,
};

var ctx = $("#Doughnut")[0].getContext("2d");
var Doughnut = new Chart(ctx, {
    type: 'doughnut',
    data: data,
    options: options
});

function doughnutTimerUpdate(remainingTime) {
    // Doughnut.options.animation=false;
    Doughnut.data.datasets[0].data[0] = 1500 - remainingTime;
    Doughnut.data.datasets[0].data[1] = remainingTime;
    Doughnut.update();
}
