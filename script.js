const [addBtns, saveItemBtns, addItemContainers, addItems, itemLists] = [
  '.add-btn:not(.solid)',
  '.solid',
  '.add-container',
  '.add-item',
  '.drag-item-list'
].map(query => document.querySelectorAll(query))
const [backlogList, progressList, completeList, onHoldList] = [
  'backlog-list',
  'progress-list',
  'complete-list',
  'on-hold-list'
].map(id => document.getElementById(id))

// Initialize Arrays
// let backlogListArray = [],
//   progressListArray = [],
//   completeListArray = [],
//   onHoldListArray = []
let kanban = {}
let updatedOnLoad = false
let draggedItem
let currentColumn
// Drag Functionality

// Get Arrays from localStorage if available, set default values if not
function getStoredKanban() {
  if (localStorage.getItem('kanban')) {
    kanban = JSON.parse(localStorage.kanban)
  } else {
    kanban = { backlog: [], progress: [], complete: [], 'on-hold': [] }
  }
}

// Set localStorage Arrays
function storeKanban() {
  localStorage.setItem('kanban', JSON.stringify(kanban))
}

// Create DOM Elements for each list item
function createItemEl(columnEl, text) {
  const listEl = document.createElement('li')
  listEl.classList.add('drag-item')
  listEl.textContent = text
  listEl.draggable = true
  listEl.contentEditable = true
  listEl.addEventListener('focusout', event => {
    if (event.target.textContent === '') {
      listEl.remove()
    }
    updateLocalKanbanObject()
    storeKanban()
  })
  listEl.setAttribute('ondragstart', 'drag(event)')
  columnEl.appendChild(listEl)
}

const drag = event => {
  draggedItem = event.target
}

const allowDrop = event => {
  event.preventDefault()
}

const dragEnter = name => {
  const column = document.getElementById(`${name}-list`)
  column.classList.add('over')
  currentColumn = column
}

const drop = event => {
  event.preventDefault()

  //  remove bacground color/padding
  Object.keys(kanban).forEach(column => {
    const columnEl = document.getElementById(`${column}-list`)
    columnEl.classList.remove('over')
  })

  currentColumn.appendChild(draggedItem)
  updateLocalKanbanObject()
  storeKanban()
}

const updateLocalKanbanObject = () => {
  const columns = Object.keys(kanban)
  kanban = {}
  columns.forEach(column => {
    kanban[column] = [
      ...document.getElementById(`${column}-list`).children
    ].map(item => item.textContent)
  })
}

const addToColumn = name => {
  const index = Object.keys(kanban).indexOf(name)
  const text = addItems[index].textContent
  createItemEl(document.getElementById(`${name}-list`), text)
  updateLocalKanbanObject()
  storeKanban()
  addItems[index].textContent = ''
}

const showInputBox = name => {
  const index = Object.keys(kanban).indexOf(name)
  addBtns[index].style.visibility = 'hidden'
  saveItemBtns[index].style.display = 'flex'
  addItemContainers[index].style.display = 'flex'
}

const hideInputBox = name => {
  const index = Object.keys(kanban).indexOf(name)
  addBtns[index].style.visibility = 'visible'
  saveItemBtns[index].style.display = 'none'
  addItemContainers[index].style.display = 'none'
  addToColumn(name)
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function initDOM() {
  // Check localStorage once
  if (!updatedOnLoad) {
    getStoredKanban()
  }

  Object.entries(kanban).forEach(([column, items]) => {
    const columnEl = document.getElementById(`${column}-list`)
    columnEl.textContent = ''
    items.forEach(item => {
      createItemEl(columnEl, item)
    })
  })
}

// getStoredKanban()
// storeKanban()
initDOM()
