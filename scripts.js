const list =[];

renderList();

function addTask() {
  let task = document.getElementById('input');
  let taskValue = task.value;
  list.push({title: taskValue, done: false});
  task.value = '';
  renderList();
}

function renderList() {
  const ul = document.getElementById('list');
  let li;
  let button;

  ul.innerHTML = '';

  list.forEach((item, i) => {
    li = document.createElement('li');
    li.innerHTML = item.title;
    button = document.createElement('button');
    button.setAttribute('index', i);
    button.innerHTML = 'Done';
    button.addEventListener('click', e => {
      changeDone(e.target.getAttribute('index'));
    });
    if (item.done) {
      li.className = 'done';
    }
    li.appendChild(button);
    ul.appendChild(li);
  });

}

function changeDone(index) {
  list[index].done = !list[index].done;
  renderList();
}