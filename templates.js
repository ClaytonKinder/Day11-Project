
var templates = {};

templates.task = [
  '<div class="todoTask" data-id="<%= _id %>" rel="<%= completed %>">',
  '<div class="todoTaskLeft">',
  '<div class="taskLeftCircle">',
  '<div class="taskLeftCheck">',
  '<% if (completed === "true") { %>',
  '<span class="mega-octicon octicon-check checked"></span>',
  '<% } else { %>',
  '<span class="mega-octicon octicon-check"></span>',
  '<% } %>',
  '</div></div></div>',
  '<div class="todoTaskRight">',
  '<form class="todoTaskForm">',
  '<% if (completed === "true") { %>',
  '<input type="text" class="taskRightText completed" value="<%= taskText %>" readonly>',
  '<% } else { %>',
  '<input type="text" class="taskRightText" value="<%= taskText %>">',
  '<% } %>',
  '</form>',
  '</div></div>'
].join("");
