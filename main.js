// Executes when DOM is ready
$(document).ready(function () {
  page.init();
});

var page = {
  url: "http://tiy-fee-rest.herokuapp.com/collections/claytonkinder",
  init: function () {
    page.initLoading();
    page.initEvents();
  },
  initLoading: function () {
    page.loadTasks();
  },
  initEvents: function () {
    $( "#todoInput" ).focusin(function() {
      $(this).closest('#todo').find('.octicon-chevron-down').addClass('rotate');
    });
    $( "#todoInput" ).focusout(function() {
      $(this).closest('#todo').find('.octicon-chevron-down').removeClass('rotate');
    });



    $('#todoInputRight').on('submit', '#todoInputForm', page.addTask);
    $('#todoTaskBlock').on('click', '.taskLeftCircle', function(e){
      e.preventDefault();
      $(this).find('.octicon-check').toggleClass('checked');
      $(this).closest('.todoTask').find('.taskRightText').toggleClass('completed');

      if ($(this).closest('.todoTask').attr('rel') === 'false')  {
        $(this).closest('.todoTask').attr('rel', 'true');
      } else if ($(this).closest('.todoTask').attr('rel') === 'true') {
        $(this).closest('.todoTask').attr('rel', 'false');
      }

      var $thisTask = $(this).closest('.todoTask');
      var taskId = $(this).closest('.todoTask').data('id');
      var updatedTask = {
        taskText: $thisTask.find('.taskRightText').val(),
        completed: $thisTask.attr('rel')
      };

      page.updateTask(updatedTask, taskId);
    });

    $('#todoSettingsRight').on('click', '#settingsRightClear', function(e) {
      e.preventDefault();

      var deleteData = [];
      $('.todoTask').each(function(el) {
        if ($(this).attr('rel') === "true") {
          deleteData.push($(this).data('id'));
        }
      });

      page.deleteTask(deleteData);

    });

    $('#todoSettingsMiddle').on('click', '.middleSetting', function(e) {
      $('.middleSetting').removeClass('settingsActive');
      $(this).addClass('settingsActive');
    });

    $('#todoSettingsMiddle').on('click', '#settingsMiddleAll', function(e) {
      $('#todoTaskBlock').html('');
      page.loadTasks();
    });

    $('#todoSettingsMiddle').on('click', '#settingsMiddleActive', function(e) {
      $('#todoTaskBlock').html('');
      page.loadAllButCompleted();
    });

    $('#todoSettingsMiddle').on('click', '#settingsMiddleCompleted', function(e) {
      $('#todoTaskBlock').html('');
      page.loadAllButActive();
    });

    $('#todoTaskBlock').on('submit', '.todoTaskForm', function (e) {
      console.log('Yo!');
      e.preventDefault();
      var $thisTask = $(this).closest('.todoTask');
      var taskId = $(this).closest('.todoTask').data('id');
      var updatedTask = {
        taskText: $thisTask.find('.taskRightText').val(),
        completed: $thisTask.attr('rel')
      };

      console.log(updatedTask, taskId);
      page.updateTask(updatedTask, taskId);
    });
  },
  addOneTaskToDOM: function (task) {
    page.loadTemplate("task", task, $('#todoTaskBlock'));
    $('#numLeft').html($('#todoTaskBlock').children().length);
  },
  addAllTasksToDOM: function (taskCollection) {
    _.each(taskCollection, page.addOneTaskToDOM);
  },
  loadTasks: function () {
    $.ajax({
      url: page.url,
      method: 'GET',
      success: function (data) {
        page.addAllTasksToDOM(data);
        $('#numLeft').html(data.length);
      },
      error: function (err) {

      }
    });
  },
  createTask: function (newTask) {

    $.ajax({
      url: page.url,
      method: 'POST',
      data: newTask,
      success: function (data) {

        page.addOneTaskToDOM(data);
      },
      error: function (err) {
        console.log("Error: ", err);
      }
    });

  },
  updateTask: function (editedTask, taskId) {

    $.ajax({
      url: page.url + '/' + taskId,
      method: 'PUT',
      data: editedTask,
      success: function (data) {
        $('#todoTaskBlock').html('');
        page.loadTasks();

      },
      error: function (err) {}
    });


  },
  deleteTask: function(deleteData) {

    $('#todoTaskBlock').html('');

    _.each(deleteData, function(el, idx, arr){
      $.ajax({
        url: page.url + "/" + deleteData[idx],
        method: 'DELETE',
        success: function (data) {
          page.loadTasks();
          page.removeCompleted();
          console.log('Deleted');
        }
      });
    });
  },
  addTask: function (event) {
    event.preventDefault();

    // build an object that looks like our original data
    var newTask = {
      taskText: $('input[name="todoInput"]').val() ? $('input[name="todoInput"]').val() : "",
      completed: false
    };
    page.createTask(newTask);

    // clear taskInput
    $('input[name="todoInput"]').val("");
  },
  loadTemplate: function (tmplName, data, $target) {
    var compiledTmpl = _.template(page.getTemplate(tmplName));

    $target.append(compiledTmpl(data));
  },
  getTemplate: function (name) {
    return templates[name];
  },
  removeCompleted: function(elements) {
    $('.todoTask').each(function(el) {
      if ($(this).attr('rel') === 'true') {
        console.log('Removed completed!');
        $(this).remove();
      }
    });
  },
  removeActive: function(elements) {
    $('.todoTask').each(function(el) {
      if ($(this).attr('rel') === 'false') {
        $(this).remove();
      }
    });
  },
  loadAllButCompleted: function() {
    $.ajax({
      url: page.url,
      method: 'GET',
      success: function (data) {
        console.log('GET data: ', data);
        page.addAllTasksToDOM(data);
        page.removeCompleted();
        $('#numLeft').html($('#todoTaskBlock').children().length);
      },
      error: function (err) {

      }
    });
  },
  loadAllButActive: function() {
    $.ajax({
      url: page.url,
      method: 'GET',
      success: function (data) {
        console.log('GET data: ', data);
        page.addAllTasksToDOM(data);
        page.removeActive();
        $('#numLeft').html($('#todoTaskBlock').children().length);
      },
      error: function (err) {

      }
    });
  }
};
