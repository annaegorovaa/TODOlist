let list =[];
let currentIndex;
const editableTask = document.getElementById('editable-task');

if (localStorage.tasks) {
  list = JSON.parse(localStorage.tasks);
}

renderList();

document.getElementById('button-addon2').addEventListener('click', () => {
  let task = document.getElementById('input');
  let taskValue = task.value;
  if (taskValue) {
    list.push({title: taskValue, done: false});
  }
  task.value = '';
  renderList();
});

document.getElementById('save-btn').addEventListener('click', () => {
  changeTask(currentIndex, editableTask.value);
});

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

function renderList() {
  const table = document.getElementById('list');

  table.innerHTML = '';

  list.forEach((item, i) => {
    let tr = document.createElement('tr');
    let checkbox = document.createElement('i');
    checkbox.className = 'far fa-circle';
    checkbox.setAttribute('index', i);
    checkbox.addEventListener('click', checkboxClickHandler);
    if (item.done) {
      tr.className = 'done';
      checkbox.className = list[i].done ? 'far fa-check-circle' : 'far fa-circle';
    }
    let td1 = document.createElement('td');
    td1.appendChild(checkbox);
    tr.appendChild(td1);
    let td2 = document.createElement('td');
    td2.innerText = item.title;
    tr.appendChild(td2);
    let td3 = document.createElement('td');
    let edit = document.createElement('i');
    edit.className = 'far fa-edit';
    edit.setAttribute('data-toggle', 'modal');
    edit.setAttribute('data-target', '#modal');
    edit.setAttribute('index', i);
    edit.addEventListener('click', editClickHandler);
    td3.appendChild(edit);
    tr.appendChild(td3);
    let td4 = document.createElement('td');
    let del = document.createElement('i');
    del.className = 'far fa-trash-alt';
    del.setAttribute('index', i);
    del.addEventListener('click', delClickHandler);
    td4.appendChild(del);
    tr.appendChild(td4);
    table.appendChild(tr);
  });
  localStorage.setItem('tasks', JSON.stringify(list));
}

function changeDone(index) {
  list[index].done = !list[index].done;
  renderList();
}

function removeTask(value) {
  list.splice(value, 1);
  renderList();
}

function changeTask(index, value) {
  list[index].title = value;
  renderList();
}