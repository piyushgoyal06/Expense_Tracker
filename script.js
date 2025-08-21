const balance = document.getElementById("balance");
const moneyPlus = document.getElementById("money-plus");
const moneyMinus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const notification = document.getElementById("notification");


const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
);
let transactions =
  localStorageTransactions !== null ? localStorageTransactions : [];

function updateLocaleStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function showNotification() {
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
  }, 2000);
}

function generateID() {
  return Math.floor(Math.random() * 100000000);
}

function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === "" || amount.value.trim() === "") {
    showNotification();
  } else {
    if (editID) {
      transactions = transactions.map((t) =>
        t.id === editID ? { ...t, text: text.value, amount: +amount.value } : t
      );
      editID = null;
      document.querySelector(".btn").textContent = "Add transaction";
    } else {
      
      const transaction = {
        id: generateID(),
        text: text.value,
        amount: +amount.value,
      };
      transactions.push(transaction);
    }

    updateLocaleStorage();
    init();
    text.value = "";
    amount.value = "";
  }
}


function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");
  item.classList.add(sign === "+" ? "plus" : "minus");
  item.innerHTML = `
          ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
          <div>
            <button class="edit-btn" onclick="editTransaction(${transaction.id})"><i class="fa fa-edit"></i></button>
            <button class="delete-btn" onclick="removeTransaction(${transaction.id})"><i class="fa fa-times"></i></button>
          </div>
    `;
  list.appendChild(item);
}

function updateValues() {
  const amounts = transactions.map((transaction) => transaction.amount);
  const total = amounts
    .reduce((accumulator, value) => (accumulator += value), 0)
    .toFixed(2);
  const income = amounts
    .filter((value) => value > 0)
    .reduce((accumulator, value) => (accumulator += value), 0)
    .toFixed(2);
  const expense = (
    amounts
      .filter((value) => value < 0)
      .reduce((accumulator, value) => (accumulator += value), 0) * -1
  ).toFixed(2);
  balance.innerText = `$${total}`;
  moneyPlus.innerText = `$${income}`;
  moneyMinus.innerText = `$${expense}`;
}

function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  updateLocaleStorage();
  init();
}

let editID = null;

function editTransaction(id) {
  const transaction = transactions.find((t) => t.id === id);
  if (transaction) {
    text.value = transaction.text;
    amount.value = transaction.amount;
    editID = id;
    document.querySelector(".btn").textContent = "Update Transaction";
  }
}

function init() {
  list.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();

form.addEventListener("submit", addTransaction);
