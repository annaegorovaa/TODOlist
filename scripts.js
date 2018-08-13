let list =[];
let currentIndex;
const editableTask = document.getElementById('editable-task');
let displayOptions = {};

if (localStorage.tasks) {
  list = JSON.parse(localStorage.tasks);
}

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

applyOptions();

document.onkeyup = typeEnter;

document.getElementById('button-addon2').addEventListener('click', () => addTask());

document.getElementById('save-btn').addEventListener('click', () => {
  changeTask(currentIndex, editableTask.value);
});

document.getElementById('all-tasks').addEventListener('click', () => {
  displayOptions.showDone = true;
  displayOptions.showUndone = true;
  localStorage.setItem('dispOptions', JSON.stringify(displayOptions));
  applyOptions();
});

document.getElementById('done-tasks').addEventListener('click', () => {
  displayOptions.showDone = true;
  displayOptions.showUndone = false;
  localStorage.setItem('dispOptions', JSON.stringify(displayOptions));
  applyOptions();
});

document.getElementById('undone-tasks').addEventListener('click', () => {
  displayOptions.showDone = false;
  displayOptions.showUndone = true;
  localStorage.setItem('dispOptions', JSON.stringify(displayOptions));
  applyOptions();
});

document.getElementById('name-sort').addEventListener('click', () => {
  displayOptions.sortAscend = !displayOptions.sortAscend;
  list.sort(compareName);
  applyOptions();
});

document.getElementById('date-sort').addEventListener('click', () => {
  displayOptions.sortAscend = !displayOptions.sortAscend;
  list.sort(compareDate);
  applyOptions();
});

document.getElementById('btn-xhr').addEventListener('click', () => loadToDoListByXHR());

document.getElementById('clear-tasks').addEventListener('click', () => clearList());

document.getElementById('search').addEventListener('keyup', applySearch);

function addTask() {
  let task = document.getElementById('input');
  let taskValue = task.value;
  if (taskValue) {
    list.push({title: taskValue, done: false, date: Date.now()});
  }
  task.value = '';
  localStorage.setItem('tasks', JSON.stringify(list));
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
    let td2 = document.createElement('td');
    td2.innerText = item.title;
    tr.appendChild(td2);
    let edit = createEditButton(item.index);
    let td3 = document.createElement('td');
    td3.appendChild(edit);
    tr.appendChild(td3);
    let del = createDelButton(item.index);
    let td4 = document.createElement('td');
    td4.appendChild(del);
    tr.appendChild(td4);
    table.appendChild(tr);
  });
}

function createCheckbox(index) {
  let checkbox = document.createElement('i');
  checkbox.className = 'far fa-circle';
  checkbox.setAttribute('index', index);
  checkbox.addEventListener('click', checkboxClickHandler);
  return checkbox;
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

function changeDone(index) {
  list[index].done = !list[index].done;
  applyOptions();
}

function removeTask(value) {
  list.splice(value, 1);
  applyOptions();
}

function changeTask(index, value) {
  list[index].title = value;
  applyOptions();
}

function clearList() {
  list = [];
  localStorage.setItem('tasks', JSON.stringify(list));
  applyOptions();
}

function loadToDoListByXHR() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://jsonplaceholder.typicode.com/todos', true);
  xhr.send();
  let loadedList = [];
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      loadedList = JSON.parse(xhr.response).map((el, i) => ({
        ...el,
        done: el.completed,
        date: Date.now() + i
      }));
      list = [
        ...list,
        ...loadedList
      ];
      localStorage.setItem('tasks', JSON.stringify(list));
      applyOptions();
    }
  };
}

function compareName(task1, task2) {
  if (task1.title < task2.title) {
    return displayOptions.sortAscend ? -1 : 1;
  }
  if (task1.title > task2.title) {
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

function typeEnter(e) {
  let x = e.key || e.which;
  if (x === 'Enter') {
    addTask();
  }
}

function applyOptions() {
  let alteredList = [];
  list.forEach((item, i) => {
    if ((displayOptions.showDone && item.done) || (displayOptions.showUndone && !item.done)) {
      alteredList.push(item);
      alteredList[alteredList.length - 1].index = i;
    }
  });
  alteredList.sort(displayOptions.chosenSort === 'date' ? compareDate : compareName);
  alteredList = alteredList.filter(el => el.title.includes(displayOptions.search));
  renderList(alteredList);
}

function applySearch(e) {
  displayOptions.search = e.target.value;
  applyOptions();
}