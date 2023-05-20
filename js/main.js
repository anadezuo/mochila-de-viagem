const form = document.getElementById('formNovoItem')

form.addEventListener('submit', (event) => {
  event.preventDefault()
  const name = event.target.elements['name'];
  const amount = event.target.elements['amount'];

  if (!name.value) return;

  const itemElement = createItemElement({name: name.value, amount: amount.value})
  insertItemElementInList(itemElement)
  const items = getItemsLocalStorage()
  saveItemLocalStorage(items, {name: name.value, amount: amount.value})
  handleInputClear(name, amount)
})

function createItemElement({name, amount}){
  const strongElement = document.createElement('strong');
  strongElement.innerHTML = amount;

  const itemElement = document.createElement('li');
  itemElement.className = 'item'
  itemElement.appendChild(strongElement)
  itemElement.innerHTML += name;

  return itemElement;
}

function insertItemElementInList(itemElement){
  const list = document.getElementById('list')
  list.appendChild(itemElement)
}

function handleInputClear(name, amount){
  name.value = ""
  amount.value = ""
}

function getItemsLocalStorage(){
  return localStorage.getItem("lista") ? JSON.parse(localStorage.getItem("lista")) : []
}

function saveItemLocalStorage( items, {name, amount}){
  const newItem = {
    "Nome": name,
    "Quantidade": amount
  }
  items.push(newItem)
  localStorage.setItem("lista" , JSON.stringify(items))
}