const editableTask = document.getElementById('editable-task');
const url = 'http://localhost:5000';
let list =[];
let currentIndex;
let displayOptions = {};

if (localStorage.dispOptions) {
  displayOptions = JSON.parse(localStorage.dispOptions);
} else {
  displayOptions = {
    showDone: true,
    showUndone: true,
    sortAscend: true,
    chosenSort: 'date',
    search: ''
  };
}

loadToDoList();

document.onkeyup = typeEnter;

document.getElementById('button-addon2').addEventListener('click', () => addTask());

document.getElementById('save-btn').addEventListener('click', () => {
  changeTask(currentIndex, editableTask.value);
});

document.getElementById('select').addEventListener('change', (event) => {
  if (event.target.value === 'Show done') {
    doneTasksSelectHandler();
  } else if (event.target.value === 'Show undone') {
    undoneTasksSelectHandler();
  } else {
    allTasksSelectHandler();
  }
});

document.getElementById('btn-xhr').addEventListener('click', () => loadToDoList());

document.getElementById('clear-tasks').addEventListener('click', () => clearList());

document.getElementById('search').addEventListener('keyup', applySearch);

document.getElementById('task').addEventListener('click', () => {
  displayOptions.sortAscend = !displayOptions.sortAscend;
  document.getElementById('task-i').className = displayOptions.sortAscend ? 'fas fa-sort-up' : 'fas fa-sort-down';
  displayOptions.chosenSort = 'name';
  document.getElementById('date-i').removeAttribute('class');
  list.sort(compareName);
  localStorage.setItem('dispOptions', JSON.stringify(displayOptions));
  applyOptions();
});

document.getElementById('date').addEventListener('click', () => {
  displayOptions.sortAscend = !displayOptions.sortAscend;
  document.getElementById('date-i').className = displayOptions.sortAscend ? 'fas fa-sort-up' : 'fas fa-sort-down';
  displayOptions.chosenSort = 'date';
  document.getElementById('task-i').removeAttribute('class');
  list.sort(compareDate);
  localStorage.setItem('dispOptions', JSON.stringify(displayOptions));
  applyOptions();
});

function allTasksSelectHandler() {
  displayOptions.showDone = true;
  displayOptions.showUndone = true;
  localStorage.setItem('dispOptions', JSON.stringify(displayOptions));
  applyOptions();
}

function doneTasksSelectHandler() {
  displayOptions.showDone = true;
  displayOptions.showUndone = false;
  localStorage.setItem('dispOptions', JSON.stringify(displayOptions));
  applyOptions();
}

function undoneTasksSelectHandler() {
  displayOptions.showDone = false;
  displayOptions.showUndone = true;
  localStorage.setItem('dispOptions', JSON.stringify(displayOptions));
  applyOptions();
}

function checkboxClickHandler(e) {
  changeDone(e.target.getAttribute('index'));
}

function editClickHandler(e) {
  currentIndex = e.target.getAttribute('index');
  editableTask.value = list[currentIndex].title;
}

function delClickHandler(e) {
  removeTask(e.target.getAttribute('index'));
}

function addTask() {
  const task = document.getElementById('input');
  let taskValue = task.value;
  if (taskValue) {
    axios.post(url, {
      title: taskValue,
      done: false,
      date: Date.now()
    })
      .then(loadToDoList)
      .catch(function (error) {
        console.log('ERROR: ', error);
      });
  }
  task.value = '';
  applyOptions();
}

function changeDone(index) {
  list[index].done = !list[index].done;
  requestPatch(index);
  applyOptions();
}

function removeTask(value) {
  requestDelete(list[value]);
  applyOptions();
}

function changeTask(index, value) {
  list[index].title = value;
  requestPatch(index);
  applyOptions();
}

function clearList() {
  list.forEach(e => requestDelete(e));
  applyOptions();
}

function createCheckbox(index) {
  let checkbox = document.createElement('i');
  checkbox.className = 'far fa-circle';
  checkbox.setAttribute('index', index);
  checkbox.addEventListener('click', checkboxClickHandler);
  return checkbox;
}

function createTaskText(text) {
  let task = document.createElement('td');
  task.innerText = text;
  return task;
}

function createDate(dateValue) {
  let date = document.createElement('td');
  date.innerText = new Date(dateValue).toLocaleDateString();
  return date;
}

function createEditButton(index) {
  let edit = document.createElement('i');
  edit.className = 'far fa-edit';
  edit.setAttribute('data-toggle', 'modal');
  edit.setAttribute('data-target', '#modal');
  edit.setAttribute('index', index);
  edit.addEventListener('click', editClickHandler);
  return edit;
}

function createDelButton(index) {
  let del = document.createElement('i');
  del.className = 'far fa-trash-alt';
  del.setAttribute('index', index);
  del.addEventListener('click', delClickHandler);
  return del;
}

function loadToDoList() {
  axios.get(url)
    .then(function (response) {
      list = response.data.map(el => ({
        ...el
      }));
      applyOptions();
    })
    .catch(function (error) {
      console.log('ERROR: ', error);
    });
}

function compareName(task1, task2) {
  if (task1.title.toLowerCase() < task2.title.toLowerCase()) {
    return displayOptions.sortAscend ? -1 : 1;
  }
  if (task1.title.toLowerCase() > task2.title.toLowerCase()) {
    return displayOptions.sortAscend ? 1 : -1;
  }
  return 0;
}

function compareDate(task1, task2) {
  if (task1.date < task2.date) {
    return displayOptions.sortAscend ? -1 : 1;
  }
  if (task1.date > task2.date) {
    return displayOptions.sortAscend ? 1 : -1;
  }
  return 0;
}

function applySearch(e) {
  displayOptions.search = e.target.value;
  localStorage.setItem('dispOptions', JSON.stringify(displayOptions));
  applyOptions();
}

function typeEnter(e) {
  let x = e.key || e.which;
  if (x === 'Enter') {
    addTask();
  }
}

function applyOptions() {
  document.getElementById('search').value = displayOptions.search;
  if (displayOptions.showDone) {
    if(displayOptions.showUndone) {
      document.getElementById('all-tasks').selected = true;
    } else {
      document.getElementById('done-tasks').selected = true;
    }
  } else {
    document.getElementById('undone-tasks').selected = true;
  }
  let alteredList = [];
  list.forEach((item, i) => {
    if ((displayOptions.showDone && item.done) || (displayOptions.showUndone && !item.done)) {
      alteredList.push(item);
      alteredList[alteredList.length - 1].index = i;
    }
  });
  alteredList = alteredList.filter(el => el.title.includes(displayOptions.search));
  alteredList.sort(displayOptions.chosenSort === 'date' ? compareDate : compareName);
  if (displayOptions.chosenSort === 'date') {
    document.getElementById('date-i').className = displayOptions.sortAscend ? 'fas fa-sort-up' : 'fas fa-sort-down';
    document.getElementById('task-i').removeAttribute('class');
  } else {
    document.getElementById('task-i').className = displayOptions.sortAscend ? 'fas fa-sort-up' : 'fas fa-sort-down';
    document.getElementById('date-i').removeAttribute('class');
  }
  renderList(alteredList);
}

function renderList(alteredList) {
  const table = document.getElementById('list');
  table.innerHTML = '';
  alteredList.forEach((item) => {
    let tr = document.createElement('tr');
    let checkbox = createCheckbox(item.index);
    if (item.done) {
      tr.className = 'done';
      checkbox.className = item.done ? 'far fa-check-circle' : 'far fa-circle';
    }
    let td1 = document.createElement('td');
    td1.appendChild(checkbox);
    tr.appendChild(td1);
    let td2 = createTaskText(item.title);
    tr.appendChild(td2);
    let td3 = createDate(item.date);
    tr.appendChild(td3);
    let edit = createEditButton(item.index);
    let td4 = document.createElement('td');
    td4.appendChild(edit);
    tr.appendChild(td4);
    let del = createDelButton(item.index);
    let td5 = document.createElement('td');
    td5.appendChild(del);
    tr.appendChild(td5);
    table.appendChild(tr);
  });
}

function requestPatch(value) {
  axios.patch(url, {
    data: list[value]
  })
    .then(loadToDoList)
    .catch(function (error) {
      console.log('ERROR: ', error);
    });
}

function requestDelete(task) {
  axios.delete(url, {
    data: task
  })
    .then(loadToDoList)
    .catch(function (error) {
      console.log('ERROR: ', error);
    });
}