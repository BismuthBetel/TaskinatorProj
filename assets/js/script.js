//global variables that are called throughout the code

var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

var pageContentEl = document.querySelector("#page-content");

var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var taskIdCounter = 0;

//array for tasks
var tasks = [];


//function handling form name input and task input

var taskFormHandler = function (event) {

    event.preventDefault();

    var taskNameInput = document.querySelector("input[name='task-name']").value;

    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }

    // reset form fields for next task entered
    document.querySelector("input[name='task-name']").value = "";
    document.querySelector("select[name='task-type']").selectedIndex = 0;


    formEl.reset();

    //to find data task id for editing
    var isEdit = formEl.hasAttribute("data-task-id");

    // has data attribute, so get task id and call function to complete edit process
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    // no data attribute, so create object as normal and pass to creatTaskEl function
    else {

        // package up data as an object
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        }

        // send it as an argument to createTaskEl
        createTaskEl(taskDataObj);
    }

};


// function to create tasks
var createTaskEl = function (taskDataObj) {

    //create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    //add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    //create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";

    //add HTML content to div
    taskInfoEl.innerHTML = "<h3 class= 'task-name'>" + taskDataObj.name + "</h3><span class= 'task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);

    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);

    // //add entire list item to list
    // tasksToDoEl.appendChild(listItemEl);

    switch (taskDataObj.status) {
        case "to do":
            taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 0;
            tasksToDoEl.append(listItemEl);
            break;
        case "in progress":
            taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 1;
            tasksInProgressEl.appendChild(listItemEl);
            break;
        case "completed":
            taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 2;
            tasksCompletedEl.appendChild(listItemEl);
            break;
        default:
            console.log("Something went wrong!");

    }

    taskDataObj.id = taskIdCounter;

    //adds object to array
    tasks.push(taskDataObj);

    //increase task counter for next unique id, increases the counter by one.
    taskIdCounter++;

    saveTasks();

};

//function to Edit tasks

var completeEditTask = function (taskName, taskType, taskId) {
    //find task list item with taskId value
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //set new values 
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    //loop through tasks array and task object with new content
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    }

    saveTasks();

    alert("Task Updated!");
    //remove data attribrute from form
    formEl.removeAttribute("data-task-id");
    //update formEl button to go back to "Add Task" after editing
    document.querySelector("#save-task").textContent = "Add Task";
};


//function to create task actions edit or delete buttons

var createTaskActions = function (taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    //create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    //create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    //create change status dropdown
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);

    //create status options
    var statusChoices = ["To Do", "In Progress", "Completed"];

    for (var i = 0; i < statusChoices.length; i++) {
        //create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        //append to select
        statusSelectEl.appendChild(statusOptionEl);
    }


    return actionContainerEl;
};

//function to handle the edit or delete buttons

var taskButtonHandler = function (event) {
    // console.log(event.target);
    // get target element from event
    var targetEl = event.target;

    //edit button was clicked
    if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }
    else if (targetEl.matches(".delete-btn")) {
        console.log("delete", targetEl);

        //get the element's task id
        var taskId = targetEl.getAttribute("data-task-id")
        deleteTask(taskId);
    }
};

//function to carry out deletion of tasks

var deleteTask = function (taskId) {
    console.log(taskId);

    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    //new array to hold updated list of tasks
    var updatedTaskArr = [];

    //loop through current tasks
    for (var i = 0; i < tasks.length; i++) {
        //if tasks[i] doesn't match value of taskId, lets keep that task and push into new array
        if (tasks[i].id !== parseInt[i]) {
            updatedTaskArr.push(tasks[i]);
        }

    }
    tasks = updatedTaskArr;
    saveTasks();
};

//reassign tasks array to be same as updatedTaskArr




//function to carry out editing of tasks

var editTask = function (taskId) {
    console.log(taskId);

    //get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    console.log(taskName);

    var taskType = taskSelected.querySelector("span.task-type").textContent;
    console.log(taskType);

    //write values of taskName and taskType to form to be edited
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;

    //update form's button to reflect editing task
    formEl.querySelector("#save-task").textContent = "Save Task";
    //set data attribute to the form with a value of task's id to identify which on is being edited
    formEl.setAttribute("data-task-id", taskId);
}

//function to change status of tasks
var taskStatusChangeHandler = function (event) {
    console.log(event.target.value);

    //get task item's id, based on event.target's data-task-id attribute
    var taskId = event.target.getAttribute("data-task-id");

    //find parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");


    //convert value to lowercase
    var statusValue = event.target.value.toLowerCase();


    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);

    }
    else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }

    //update tasks in tasks array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }

    }

    saveTasks();
};

var saveTasks = function () {

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

//1. get task items from localStorage 2. convert tasks from string into array of objects 3. iterates through a tasks array & creates task elements on the page from it
var loadTasks = function () {

    var savedTasks = localStorage.getItem("tasks");

    // console.log(tasks);

    if (!savedTasks) {
        return false;
    }
    console.log("Saved tasks found!");
    //else, load up saved tasks

    //parse into array of objects
    savedTasks = JSON.parse(savedTasks);

    // console.log();

    for (var i = 0; i < savedTasks.length; i++) {

        console.log(savedTasks[i]);
        createTaskEl(savedTasks[i]);

    }


};

//event listeners on bottom so they will listen to whole main content

//create new task
formEl.addEventListener("submit", taskFormHandler);

//for edit and delete buttons
pageContentEl.addEventListener("click", taskButtonHandler);

//for changing the status
pageContentEl.addEventListener("change", taskStatusChangeHandler);


loadTasks();


