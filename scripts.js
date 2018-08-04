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
  let tr;
  let td1;
  let td2;
  let checkbox;

  table.innerHTML = '';

  list.forEach((item, i) => {
    tr = document.createElement('tr');
    td1 = document.createElement('td');
    checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.setAttribute('index', i);
    checkbox.addEventListener('click', e => {
      changeDone(e.target.getAttribute('index'));
    });
    if (item.done) {
      tr.className = 'done';
      checkbox.checked = true;
    }
    td1.appendChild(checkbox);
    tr.appendChild(td1);
    td2 = document.createElement('td');
    td2.innerText = item.title;
    tr.appendChild(td2);
    table.appendChild(tr);
  });
  localStorage.setItem('tasks', JSON.stringify(list));
}

function changeDone(index) {
  list[index].done = !list[index].done;
  renderList();
}