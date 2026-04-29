const balance = document.getElementById('balance');
const income = document.getElementById('income');
const expense = document.getElementById('expense');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// ADD
function addTransaction(e) {
  e.preventDefault();

  if (!text.value || !amount.value) return;

  const transaction = {
    id: Date.now(),
    text: text.value,
    amount: +amount.value
  };

  transactions.push(transaction);
  updateLocalStorage();
  init();

  text.value = '';
  amount.value = '';
}

// DOM
function addTransactionDOM(t) {
  const sign = t.amount < 0 ? '-' : '+';

  const li = document.createElement('li');
  li.classList.add(t.amount < 0 ? 'minus' : 'plus');

  li.innerHTML = `
    <span onclick="editTransaction(${t.id})">
      ${t.text} (${sign}$${Math.abs(t.amount)})
    </span>
    <button onclick="removeTransaction(${t.id})">x</button>
  `;

  list.appendChild(li);
}

// VALUES
function updateValues() {
  const amounts = transactions.map(t => t.amount);

  const total = amounts.reduce((a, b) => a + b, 0);
  const inc = amounts.filter(a => a > 0).reduce((a, b) => a + b, 0);
  const exp = amounts.filter(a => a < 0).reduce((a, b) => a + b, 0) * -1;

  balance.innerText = `$${total}`;
  income.innerText = `+$${inc}`;
  expense.innerText = `-$${exp}`;
}

// STORAGE
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// REMOVE
function removeTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  init();
}

// EDIT
function editTransaction(id) {
  const t = transactions.find(t => t.id === id);
  text.value = t.text;
  amount.value = t.amount;

  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  init();
}

// FILTER
function filterTransactions(type) {
  list.innerHTML = '';

  let filtered = transactions;

  if (type === 'income') filtered = transactions.filter(t => t.amount > 0);
  if (type === 'expense') filtered = transactions.filter(t => t.amount < 0);

  filtered.forEach(addTransactionDOM);
}

// CHART
let chart;

function updateChart() {
  const ctx = document.getElementById('chart');

  const amounts = transactions.map(t => t.amount);
  const inc = amounts.filter(a => a > 0).reduce((a, b) => a + b, 0);
  const exp = amounts.filter(a => a < 0).reduce((a, b) => a + b, 0) * -1;

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Income', 'Expense'],
      datasets: [{
        data: [inc, exp]
      }]
    }
  });
}

// INIT
function init() {
  list.innerHTML = '';

  transactions.forEach(addTransactionDOM);
  updateValues();
  updateChart();
}

init();

form.addEventListener('submit', addTransaction);

// DARK MODE
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('toggle-theme');

  btn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
  });
});