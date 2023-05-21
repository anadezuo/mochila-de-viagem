const AMOUNT = 'Quantidade'
const NAME = 'Nome'
const form = document.getElementById('formNovoItem')
var items = getItemsLocalStorage()

restoreItensListFromLocalStorage(items)

form.addEventListener('submit', (event) => {
  event.preventDefault()
  const name = event.target.elements['name'];
  const amount = event.target.elements['amount'];

  if (!name.value) return;
  if (!amount.value) amount.value = 0;

  const newItem = {name: name.value, amount: amount.value}

  if (hasItem(items, name.value)) {
    updateItemElement(newItem)
    updateItem(items, newItem)
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
  //const id = items[items.length -1] ? (items[items.length - 1]).id + 1 : 0
  const newItem = {
    //id: id,
    [NAME]: name,
    [AMOUNT]: amount
  }
  items.push(newItem)
}

function updateItemElement({name, amount}) {
  const itemElement = document.getElementsByName(name)
  itemElement[0].textContent = parseInt(itemElement[0].textContent) + parseInt(amount)
}

function updateItem(items, newItem){
  items.map(item => {
    if (item[NAME] === newItem.name){
      item[AMOUNT] = parseInt(item[AMOUNT]) + parseInt(newItem.amount)
    }
    return item
  })
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
  return items.find(item => item[NAME] === value)
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