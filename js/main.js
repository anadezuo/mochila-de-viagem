const AMOUNT = 'Quantidade'
const NAME = 'Nome'
const DESCRIPTION = 'Descrição'
const ADD = 'add'
const form = document.getElementById('formNovoItem')
var items = getItemsLocalStorage()

restoreItensListFromLocalStorage(items)

form.addEventListener('submit', (event) => {
  event.preventDefault()

  const type = event.submitter.id
  const name = event.target.elements['name']
  const amount = event.target.elements['amount']
  const description = event.target.elements['description']
  
  if (!name.value) return
  if (!amount.value) amount.value = 0
  if (!description.value) description.value = ""

  addOrUpdateItem(type, {name: name.value, amount: amount.value, description: description.value})

  handleInputClear(name, amount, description)
})

function addOrUpdateItem(type, {name, amount, description}){
  const indexItem = hasItem(items, name)
  const newItem = {name: name, amount: amount, description: description}
  
  if (indexItem >= 0) {
    updateItem(items, newItem, type, indexItem)
    updateItemElement(items, newItem, indexItem)
  }
  else {
    const itemElement = createItemElement(newItem)
    insertItemElementInList(itemElement)
    insertItem(items, newItem)
  }

  setItemsLocalStorage(items)
}



function createItemElement({name, amount, description}) {
  const strongElement = document.createElement('strong')
  strongElement.innerHTML = amount
  strongElement.setAttribute('name', name)

  const itemElement = document.createElement('li')
  itemElement.className = 'item'
  itemElement.appendChild(strongElement)
  itemElement.innerHTML += name

  const descriptionElement = document.createElement('input')
  descriptionElement.className = 'description'
  descriptionElement.id = buildDescriptionId(name)
  descriptionElement.value = description
  descriptionElement.setAttribute('disabled',true)
  descriptionElement.setAttribute('type','true')

  itemElement.appendChild(descriptionElement)
  itemElement.appendChild(removeButton(name))

  return itemElement
}

function insertItemElementInList(itemElement) {
  const list = document.getElementById('list')
  list.appendChild(itemElement)
}

function insertItem(items, {name, amount, description}){
  const newItem = {
    [NAME]: name,
    [AMOUNT]: amount,
    [DESCRIPTION]: description
  }
  items.push(newItem)
}

function buildDescriptionId(name){
  return `description-${name}`
}

function updateItemElement(items, {name}, indexItem) {
  const itemElement = document.getElementsByName(name)
  itemElement[0].textContent = items[indexItem][AMOUNT]

  const itemDescription = document.getElementById(buildDescriptionId(name))
  itemDescription.value = items[indexItem][DESCRIPTION]
}

function addOrUpdateAmount(type, amount, newAmount){
  if(type === ADD) 
    return parseInt(amount) + parseInt(newAmount)
  else
    return parseInt(newAmount)
}

function updateItem(items, newItem, type, indexItem){
  items[indexItem][AMOUNT] = addOrUpdateAmount(type, items[indexItem][AMOUNT], newItem.amount)
  
  if(newItem.description !== '')
    items[indexItem][DESCRIPTION] = newItem.description
}

function removeButton(name){
  const button = document.createElement('button')
  button.innerText = 'X'
  button.className = 'remover'

  button.addEventListener('click', function(){
    removeItem(name)
    removeElement(this.parentNode)
  })
  return button
}

function removeItem( name){
  const itemsFiltered = items.filter(item => item[NAME] !== name)
  items = itemsFiltered
  setItemsLocalStorage(itemsFiltered)
}

function removeElement(element){
  element.remove()
}

function handleInputClear(name, amount, description) {
  name.value = ""
  amount.value = ""
  description.value = ""
}

function getItemsLocalStorage() {
  return localStorage.getItem("lista") ? JSON.parse(localStorage.getItem("lista")) : []
}

function hasItem(items, value) {
  return items.findIndex(item => item[NAME] === value)
}

function setItemsLocalStorage(items) {
  //O localStorage aceita apenas string
  //Dados sensíveis devem ser armazenados nos cookies
  localStorage.setItem("lista" , JSON.stringify(items))
}

function restoreItensListFromLocalStorage(items) {
  items.forEach(item => {
    const itemElement = createItemElement({name: item[NAME], amount: item[AMOUNT], description: item[DESCRIPTION]})
    insertItemElementInList(itemElement)
  })
}

function addDefaultList(){
  const defaultList = [
    { [NAME]: 'Documentos', [AMOUNT]: '1', [DESCRIPTION]: ''},
    { [NAME]: 'Dinheiro', [AMOUNT]: '1', [DESCRIPTION]: ''},
    { [NAME]: 'Celular', [AMOUNT]: '1', [DESCRIPTION]: ''},
    { [NAME]: 'Calça', [AMOUNT]: '1', [DESCRIPTION]: ''},
    { [NAME]: 'Camisetas', [AMOUNT]: '1', [DESCRIPTION]: ''},
    { [NAME]: 'Chinelo', [AMOUNT]: '1', [DESCRIPTION]: ''},
  ]

  defaultList.forEach(item => 
    addOrUpdateItem(ADD, {name: item[NAME], amount: item[AMOUNT], description: item[DESCRIPTION]})
  )
}