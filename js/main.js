const AMOUNT = 'Quantidade'
const NAME = 'Nome'

const form = document.getElementById('formNovoItem')

restoreItensListFromLocalStorage()

form.addEventListener('submit', (event) => {
  event.preventDefault()
  const name = event.target.elements['name'];
  const amount = event.target.elements['amount'];

  if (!name.value) return;
  if (!amount.value) amount.value = 0;

  const newItem = {name: name.value, amount: amount.value}
  const items = getItemsLocalStorage()


  if (hasItemLocalStorage(items, name.value)) {
    updateItemLocalStorage(items, newItem)
  }
  else {
    const itemElement = createItemElement(newItem)
    insertItemElementInList(itemElement)
    saveItemLocalStorage(items, {name: name.value, amount: amount.value})
  }

  handleInputClear(name, amount)
})


function createItemElement({name, amount}) {
  const strongElement = document.createElement('strong');
  strongElement.innerHTML = amount;

  const itemElement = document.createElement('li');
  itemElement.className = 'item'
  itemElement.appendChild(strongElement)
  itemElement.innerHTML += name;

  return itemElement;
}

function insertItemElementInList(itemElement) {
  const list = document.getElementById('list')
  list.appendChild(itemElement)
}

function handleInputClear(name, amount) {
  name.value = ""
  amount.value = ""
}

function getItemsLocalStorage() {
  return localStorage.getItem("lista") ? JSON.parse(localStorage.getItem("lista")) : []
}

function hasItemLocalStorage(items, value) {
  return items.find(item => item[NAME] === value)
}

function saveItemLocalStorage( items, {name, amount}) {
  const newItem = {
    [NAME]: name,
    [AMOUNT]: amount
  }
  items.push(newItem)
  setItemsLocalStorage(items)
}

function updateItemLocalStorage(items, newItem) {
  const newItems = items.map(item => {
    if (item[NAME] === newItem.name)
      item[AMOUNT] = parseInt(item[AMOUNT]) + parseInt(newItem.amount)
    
    return item
  })
  setItemsLocalStorage(newItems)
}

function setItemsLocalStorage(items) {
  //* o localStorage aceita apenas string
  //* dados sensiveis devem ser armazenados nos cookies e criptografados
  localStorage.setItem("lista" , JSON.stringify(items))
}

function restoreItensListFromLocalStorage() {
  const items = getItemsLocalStorage()

  items.forEach(item => {
    const itemElement = createItemElement({name: item[NAME], amount: item[AMOUNT]})
    insertItemElementInList(itemElement)
  })
}