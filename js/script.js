const listsContainer = document.querySelector('[info-list]')
const newListForm = document.querySelector('[form-new-info-list]')
const newListInput = document.querySelector('[new-info-list-input]')
const listTitle = document.querySelector('[info-list-title]')
const listCount = document.querySelector('[count-of-info-lists]')
const listDisplayContainer = document.querySelector('[info-list-display]')
const tasksContainer = document.querySelector('[info-tasks]')
const newTaskForm = document.querySelector('[new-info-task-form]')
const newTaskInput = document.querySelector('[new-info-task-input]')
const buttonClearTasks = document.querySelector('[button-clear-complete-tasks]')
const buttonDeleteList = document.querySelector('[button-delete-list]')
const taskTemplate = document.getElementById('task-template')
const modalMess = document.getElementById('myModal');
const span = document.getElementsByClassName("close")[0];

const STORAGE_LIST_KEY = 'task.lists'
const STORAGE_SELECT_LIST_ID_KEY = 'task.selectListId'

let lists = JSON.parse(localStorage.getItem(STORAGE_LIST_KEY)) || []
let selectListId = localStorage.getItem(STORAGE_SELECT_LIST_ID_KEY)

listsContainer.addEventListener('click', x => {
  if (x.target.tagName.toLowerCase() === 'li') {
    selectListId = x.target.dataset.listId
    saveAndRender()
  }
})

tasksContainer.addEventListener('click', x => {
  if (x.target.tagName.toLowerCase() === 'input') {
    const selectList = lists.find(list => list.id === selectListId)
    const selectTask = selectList.tasks.find(task => task.id === x.target.id)
    selectTask.complete = x.target.checked

    save()
    renderTaskCount(selectList)
  }
})

buttonClearTasks.addEventListener('click', x => {
  const selectList = lists.find(list => list.id === selectListId)
  selectList.tasks = selectList.tasks.filter(task => !task.complete)
  saveAndRender()

})

buttonDeleteList.addEventListener('click', x => {
  lists = lists.filter(list => list.id !== selectListId)
  selectListId = null
  saveAndRender()
})

newListForm.addEventListener('submit', x => {
  x.preventDefault()
  const listName = newListInput.value

  if (listName == null || listName === ''|| listName.length > 10) {
    modalMessage()
    return
  }

  const list = createList(listName)
  newListInput.value = null
  lists.push(list)
  saveAndRender()
})

newTaskForm.addEventListener('submit', x => {
  x.preventDefault()
  const taskName = newTaskInput.value

  if (taskName == null || taskName === '' || taskName.length > 30) {
    modalMessage()
    return
  }

  const task = createTask(taskName)
  newTaskInput.value = null
  const selectList = lists.find(list => list.id === selectListId)
  selectList.tasks.push(task)
  saveAndRender()
})

function createList(name) {
  return { id: Date.now().toString(), name: name, tasks: [] }
}

function createTask(name) {
  return { id: Date.now().toString(), name: name, complete: false }
}

function saveAndRender() {
  save()
  render()
}

function save() {

  localStorage.setItem(STORAGE_LIST_KEY, JSON.stringify(lists))
  localStorage.setItem(STORAGE_SELECT_LIST_ID_KEY, selectListId)
}

function render() {
  clearElement(listsContainer)
  renderLists()

  const selectList = lists.find(list => list.id === selectListId)

  if (selectListId == null) {
    listDisplayContainer.style.display = 'none'
  } else {
    listDisplayContainer.style.display = ''
    listTitle.innerText = selectList.name
    renderTaskCount(selectList)
    clearElement(tasksContainer)
    renderTasks(selectList)
  }
}

function renderTasks(selectList) {
  selectList.tasks.forEach(task => {
    const taskElement = document.importNode(taskTemplate.content, true)
    const checkbox = taskElement.querySelector('input')

    checkbox.id = task.id
    checkbox.checked = task.complete

    const label = taskElement.querySelector('label')

    label.htmlFor = task.id
    label.append(task.name)
    tasksContainer.appendChild(taskElement)
  })
}

function renderTaskCount(selectList) {
  const incompleteTaskCount = selectList.tasks.filter(task => !task.complete).length
  listCount.innerText = `${incompleteTaskCount} осталось`
}

function renderLists() {
  lists.forEach(list => {
    const listElement = document.createElement('li')
    listElement.dataset.listId = list.id
    listElement.classList.add("list-name")
    listElement.innerText = list.name

    if (list.id === selectListId) {
      listElement.classList.add('active-list')
    }

    listsContainer.appendChild(listElement)
  })
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

function modalMessage(){
    modalMess.style.display = "block";
}

span.onclick = function() {
  modalMess.style.display = "none";
}

 window.onclick = function(event) {
  if (event.target === modalMess) {
    modalMess.style.display = "none";
  }
}

render()