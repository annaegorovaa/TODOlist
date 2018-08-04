let list =[];

if (localStorage.tasks) {
  list = JSON.parse(localStorage.tasks);
}

renderList();

document.getElementById('button-addon2').addEventListener('click', () => {
  let task = document.getElementById('input');
  let taskValue = task.value;
  list.push({title: taskValue, done: false});
  task.value = '';
  renderList();
});

function renderList() {
  const table = document.getElementById('list');

  table.innerHTML = '';

  list.forEach((item, i) => {
    let tr = document.createElement('tr');
    let td1 = document.createElement('td');
    let checkbox = document.createElement('i');
    checkbox.className = 'far fa-circle';
    checkbox.setAttribute('index', i);
    checkbox.addEventListener('click', e => {
      changeDone(e.target.getAttribute('index'));
    });
    if (item.done) {
      tr.className = 'done';
      checkbox.className = list[i].done ? 'far fa-check-circle' : 'far fa-circle';
    }
    td1.appendChild(checkbox);
    tr.appendChild(td1);
    let td2 = document.createElement('td');
    td2.innerText = item.title;
    tr.appendChild(td2);
    table.appendChild(tr);
    let td3 = document.createElement('td');
    let del = document.createElement('i');
    del.className = 'far fa-trash-alt';
    del.addEventListener('click',() => {
      removeTask(i);
    });
    td3.appendChild(del);
    tr.appendChild(td3);
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