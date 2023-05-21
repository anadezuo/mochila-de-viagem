const AMOUNT = 'Quantidade'
const NAME = 'Nome'
const ADD = 'add'
const form = document.getElementById('formNovoItem')
var items = getItemsLocalStorage()

restoreItensListFromLocalStorage(items)

form.addEventListener('submit', (event) => {
  event.preventDefault()

  const type = event.submitter.id;
  const name = event.target.elements['name'];
  const amount = event.target.elements['amount'];
  const indexItem = hasItem(items, name.value)
  
  if (!name.value) return;
  if (!amount.value) amount.value = 0;

  const newItem = {name: name.value, amount: amount.value}
  
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
  handleInputClear(name, amount)
})

function createItemElement({name, amount}) {
  const strongElement = document.createElement('strong');
  strongElement.innerHTML = amount;
  strongElement.setAttribute('name', name);

  const itemElement = document.createElement('li');
  itemElement.className = 'item'
  itemElement.appendChild(strongElement)
  itemElement.innerHTML += name;

  itemElement.appendChild(removeButton(name))

  return itemElement;
}

function insertItemElementInList(itemElement) {
  const list = document.getElementById('list')
  list.appendChild(itemElement)
}

function insertItem(items, {name, amount}){
  const newItem = {
    [NAME]: name,
    [AMOUNT]: amount
  }
  items.push(newItem)
}

function updateItemElement(items, {name}, indexItem) {
  const itemElement = document.getElementsByName(name)
  itemElement[0].textContent = items[indexItem][AMOUNT]
}

function addOrUpdateAmount(type, amount, newAmount){
  if(type === ADD) 
    return parseInt(amount) + parseInt(newAmount)
  else
    return parseInt(newAmount)
}

function updateItem(items, newItem, type, indexItem){
  items[indexItem][AMOUNT] = addOrUpdateAmount(type, items[indexItem][AMOUNT], newItem.amount)
}

function removeButton(name){
  const button = document.createElement('button')
  button.innerText = 'X'
  button.className = 'remover'

  button.addEventListener('click', function(){
    removeItem(name)
    removeElement(this.parentNode)
  })
  return button;
}

function removeItem( name){
  const itemsFiltered = items.filter(item => item[NAME] !== name)
  items = itemsFiltered
  setItemsLocalStorage(itemsFiltered)
}

function removeElement(element){
  element.remove()
}

function handleInputClear(name, amount) {
  name.value = ""
  amount.value = ""
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
    const itemElement = createItemElement({name: item[NAME], amount: item[AMOUNT]})
    insertItemElementInList(itemElement)
  })
}