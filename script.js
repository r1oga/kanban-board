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
    kanban = {
      backlog: ['Release the course', 'Sit back and relax'],
      progress: ['Work on projects', 'Listen to music'],
      complete: ['Being cool', 'Getting stuff done'],
      'on-hold': ['Being uncool']
    }
  }
}

// Set localStorage Arrays
function storeKanban() {
  localStorage.setItem('kanban', JSON.stringify(kanban))
}

// Create DOM Elements for each list item
function createItemEl(columnEl, item) {
  const listEl = document.createElement('li')
  listEl.classList.add('drag-item')
  listEl.textContent = item
  listEl.draggable = true
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
