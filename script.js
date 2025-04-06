let entries = JSON.parse(localStorage.getItem('entries')) || [];
let editIndex = null;

const form = document.getElementById('entry-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeInputs = document.getElementsByName('type');
const entryList = document.getElementById('entry-list');
const resetBtn = document.getElementById('reset-btn');

const totalIncome = document.getElementById('total-income');
const totalExpense = document.getElementById('total-expense');
const netBalance = document.getElementById('net-balance');

function renderEntries() {
  const filter = document.querySelector('input[name="filter"]:checked').value;
  entryList.innerHTML = '';
  let income = 0, expense = 0;

  entries.forEach((entry, index) => {
    if (filter !== 'all' && entry.type !== filter) return;

    const li = document.createElement('li');
    li.className = `p-3 border rounded flex justify-between items-center ${
      entry.type === 'income' ? 'bg-green-100' : 'bg-red-100'
    }`;

    li.innerHTML = `
      <div>
        <p class="font-semibold">${entry.description}</p>
        <p>₹${entry.amount}</p>
      </div>
      <div class="flex gap-2">
        <button onclick="editEntry(${index})" class="text-blue-600 hover:underline">Edit</button>
        <button onclick="deleteEntry(${index})" class="text-red-600 hover:underline">Delete</button>
      </div>
    `;
    entryList.appendChild(li);

    if (entry.type === 'income') income += entry.amount;
    else expense += entry.amount;
  });

  totalIncome.textContent = `₹${income}`;
  totalExpense.textContent = `₹${expense}`;
  netBalance.textContent = `₹${income - expense}`;
}

function saveEntries() {
  localStorage.setItem('entries', JSON.stringify(entries));
  renderEntries();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const type = [...typeInputs].find((r) => r.checked)?.value;

  if (!description || isNaN(amount) || !type) return;

  const entry = { description, amount, type };

  if (editIndex !== null) {
    entries[editIndex] = entry;
    editIndex = null;
  } else {
    entries.push(entry);
  }

  form.reset();
  saveEntries();
});

resetBtn.addEventListener('click', () => {
  form.reset();
  editIndex = null;
});

function editEntry(index) {
  const entry = entries[index];
  descriptionInput.value = entry.description;
  amountInput.value = entry.amount;
  [...typeInputs].forEach((r) => (r.checked = r.value === entry.type));
  editIndex = index;
}

function deleteEntry(index) {
  if (confirm('Are you sure you want to delete this entry?')) {
    entries.splice(index, 1);
    saveEntries();
  }
}

document.querySelectorAll('input[name="filter"]').forEach((radio) =>
  radio.addEventListener('change', renderEntries)
);

renderEntries();
