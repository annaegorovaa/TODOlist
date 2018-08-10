let list =[];
let currentIndex;
const editableTask = document.getElementById('editable-task');
let displayOption = 'all';

if (localStorage.tasks) {
  list = JSON.parse(localStorage.tasks);
}

renderList(displayOption);

document.getElementById('button-addon2').addEventListener('click', () => {
  let task = document.getElementById('input');
  let taskValue = task.value;
  if (taskValue) {
    list.push({title: taskValue, done: false});
  }
  task.value = '';
  renderList(displayOption);
});

document.getElementById('save-btn').addEventListener('click', () => {
  changeTask(currentIndex, editableTask.value);
});

document.getElementById('all-tasks').addEventListener('click', () => {
  displayOption = 'all';
  renderList(displayOption);
});

document.getElementById('done-tasks').addEventListener('click', () => {
  displayOption = 'done';
  renderList(displayOption);
});

document.getElementById('undone-tasks').addEventListener('click', () => {
  displayOption = 'undone';
  renderList(displayOption);
});

document.getElementById('btn-xhr').addEventListener('click', () => loadToDoListByXHR());

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

function renderList(displayOption) {
  const table = document.getElementById('list');
  table.innerHTML = '';
  list.forEach((item, i) => {
    if (displayOption === 'all' || displayOption === 'done' && item.done || displayOption === 'undone' && !item.done) {
      let tr = document.createElement('tr');
      let checkbox = createCheckbox(i);
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
      let edit = createEditButton(i);
      let td3 = document.createElement('td');
      td3.appendChild(edit);
      tr.appendChild(td3);
      let del = createDelButton(i);
      let td4 = document.createElement('td');
      td4.appendChild(del);
      tr.appendChild(td4);
      table.appendChild(tr);
    }
  });
  localStorage.setItem('tasks', JSON.stringify(list));
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
  renderList(displayOption);
}

function removeTask(value) {
  list.splice(value, 1);
  renderList(displayOption);
}

function changeTask(index, value) {
  list[index].title = value;
  renderList(displayOption);
}

function loadToDoListByXHR() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://jsonplaceholder.typicode.com/todos', true);
  xhr.send();
  let loadedList = [];
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      loadedList = JSON.parse(xhr.response);
      loadedList.forEach(item => {
        item.done = item.completed;
      });
      list = [
        ...list,
        ...loadedList
      ];
      renderList(displayOption);
    }
  };
}