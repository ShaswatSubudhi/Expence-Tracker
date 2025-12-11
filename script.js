let expenses = [];
let budgets = {};
let typeChart = null;
let catChart = null;
let trendChart = null;
let editingId = null;
let deleteId = null;
let filteredExpenses = [];
let currentTab = 'expense';

// Currency conversion rates (base: INR)
const conversionRates = {
  '₹': 1,
  '$': 83.5,
  '€': 91.2,
  '£': 106.8,
  '¥': 0.56
};

async function init() {
  await loadExpenses();
  await loadBudgets();
  document.getElementById('date').valueAsDate = new Date();
  document.getElementById('addBtn').addEventListener('click', addExpense);
  render();
}

async function loadExpenses() {
  try {
    const result = await window.storage.get('expenses');
    if (result && result.value) {
      expenses = JSON.parse(result.value);
    }
  } catch (error) {
    expenses = [];
  }
}

async function saveExpenses() {
  try {
    await window.storage.set('expenses', JSON.stringify(expenses));
  } catch (error) {
    console.error('Failed to save expenses:', error);
    showToast('Failed to save. Please try again.', 'error');
  }
}

async function loadBudgets() {
  try {
    const result = await window.storage.get('budgets');
    if (result && result.value) {
      budgets = JSON.parse(result.value);
    }
  } catch (error) {
    budgets = {};
  }
}

async function saveBudgets() {
  try {
    await window.storage.set('budgets', JSON.stringify(budgets));
  } catch (error) {
    console.error('Failed to save budgets:', error);
  }
}

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById('expenseTab').style.display = 'none';
  document.getElementById('budgetTab').style.display = 'none';
  document.getElementById('importTab').style.display = 'none';

  if (tab === 'expense') {
    document.getElementById('expenseTab').style.display = 'block';
    document.querySelectorAll('.tab-btn')[0].classList.add('active');
  } else if (tab === 'budget') {
    document.getElementById('budgetTab').style.display = 'block';
    document.querySelectorAll('.tab-btn')[1].classList.add('active');
    renderBudgets();
  } else if (tab === 'import') {
    document.getElementById('importTab').style.display = 'block';
    document.querySelectorAll('.tab-btn')[2].classList.add('active');
  }
}

async function addExpense() {
  const titleEl = document.getElementById('title');
  const amountEl = document.getElementById('amount');
  const dateEl = document.getElementById('date');
  const categoryEl = document.getElementById('category');
  const typeEl = document.getElementById('type');
  const currencyEl = document.getElementById('currency');
  const recurringEl = document.getElementById('recurring');

  const title = titleEl.value.trim();
  const amount = Number(amountEl.value);
  const date = dateEl.value;
  const category = categoryEl.value;
  const type = typeEl.value;
  const currency = currencyEl.value;
  const recurring = recurringEl.checked;

  if (!title || !amount || !date) {
    showToast('Please fill all fields', 'error');
    return;
  }

  if (editingId) {
    const index = expenses.findIndex(e => e.id === editingId);
    if (index !== -1) {
      expenses[index] = { title, amount, date, category, type, currency, recurring, id: editingId };
      showToast('Expense updated successfully!');
    }
    editingId = null;
    document.getElementById('formTitle').textContent = 'Add New Expense';
    document.getElementById('addBtn').textContent = 'Add Expense';
    document.getElementById('cancelBtn').style.display = 'none';
  } else {
    const expense = { title, amount, date, category, type, currency, recurring, id: Date.now() };
    expenses.push(expense);
    showToast('Expense added successfully!');
  }

  await saveExpenses();

  titleEl.value = '';
  amountEl.value = '';
  dateEl.valueAsDate = new Date();
  recurringEl.checked = false;

  render();
}

function editExpense(id) {
  const expense = expenses.find(e => e.id === id);
  if (!expense) return;

  editingId = id;
  document.getElementById('title').value = expense.title;
  document.getElementById('amount').value = expense.amount;
  document.getElementById('date').value = expense.date;
  document.getElementById('category').value = expense.category;
  document.getElementById('type').value = expense.type;
  document.getElementById('currency').value = expense.currency || '₹';
  document.getElementById('recurring').checked = expense.recurring || false;
  document.getElementById('formTitle').textContent = 'Edit Expense';
  document.getElementById('addBtn').textContent = 'Update Expense';
  document.getElementById('cancelBtn').style.display = 'block';

  switchTab('expense');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function cancelEdit() {
  editingId = null;
  document.getElementById('title').value = '';
  document.getElementById('amount').value = '';
  document.getElementById('date').valueAsDate = new Date();
  document.getElementById('recurring').checked = false;
  document.getElementById('formTitle').textContent = 'Add New Expense';
  document.getElementById('addBtn').textContent = 'Add Expense';
  document.getElementById('cancelBtn').style.display = 'none';
}

function showDeleteModal(id) {
  deleteId = id;
  document.getElementById('deleteModal').classList.add('active');
}

function closeModal() {
  deleteId = null;
  document.getElementById('deleteModal').classList.remove('active');
}

async function confirmDelete() {
  if (deleteId) {
    expenses = expenses.filter(e => e.id !== deleteId);
    await saveExpenses();
    closeModal();
    showToast('Expense deleted');
    render();
  }
}

function applyFilters() {
  const search = document.getElementById('searchBox').value.toLowerCase();
  const category = document.getElementById('filterCategory').value;
  const type = document.getElementById('filterType').value;
  const month = document.getElementById('filterMonth').value;

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  filteredExpenses = expenses.filter(e => {
    const matchSearch = e.title.toLowerCase().includes(search);
    const matchCategory = !category || e.category === category;
    const matchType = !type || e.type === type;
    
    let matchMonth = true;
    if (month === 'current') {
      const expDate = new Date(e.date);
      matchMonth = expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
    } else if (month === 'last') {
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const expDate = new Date(e.date);
      matchMonth = expDate.getMonth() === lastMonth && expDate.getFullYear() === lastYear;
    }

    return matchSearch && matchCategory && matchType && matchMonth;
  });

  render();
}

function convertToINR(amount, currency) {
  return amount * conversionRates[currency];
}

function formatCurrency(amount, currency) {
  return `${currency}${amount.toFixed(2)}`;
}

function render() {
  const reqList = document.getElementById('reqList');
  const optList = document.getElementById('optList');
  reqList.innerHTML = '';
  optList.innerHTML = '';

  let reqTotal = 0;
  let optTotal = 0;

  const displayExpenses = filteredExpenses.length > 0 || 
    document.getElementById('searchBox').value || 
    document.getElementById('filterCategory').value || 
    document.getElementById('filterType').value ||
    document.getElementById('filterMonth').value
    ? filteredExpenses : expenses;

  if (displayExpenses.length === 0) {
    const emptyReq = document.createElement('div');
    emptyReq.className = 'empty-state';
    emptyReq.textContent = 'No required expenses yet';
    reqList.appendChild(emptyReq);

    const emptyOpt = document.createElement('div');
    emptyOpt.className = 'empty-state';
    emptyOpt.textContent = 'No optional expenses yet';
    optList.appendChild(emptyOpt);
  } else {
    displayExpenses.forEach(e => {
      const li = document.createElement('li');
      const amountInINR = convertToINR(e.amount, e.currency || '₹');
      const recurringBadge = e.recurring ? '<span class="recurring-badge">Recurring</span>' : '';
      
      li.innerHTML = `
        <div class="expense-item">
          <div class="expense-info">
            <div class="expense-title">${escapeHtml(e.title)}${recurringBadge}</div>
            <div class="expense-meta">${e.category} • ${formatDate(e.date)}</div>
          </div>
          <div style="text-align:right;">
            <div class="expense-amount">${formatCurrency(e.amount, e.currency || '₹')}</div>
            <div class="expense-actions">
              <button class="btn btn-secondary" onclick="editExpense(${e.id})">Edit</button>
              <button class="btn btn-danger" onclick="showDeleteModal(${e.id})">Delete</button>
            </div>
          </div>
        </div>
      `;

      if (e.type === 'required') {
        reqTotal += amountInINR;
        reqList.appendChild(li);
      } else {
        optTotal += amountInINR;
        optList.appendChild(li);
      }
    });
  }

  document.getElementById('reqTotal').innerText = `₹${reqTotal.toFixed(2)}`;
  document.getElementById('optTotal').innerText = `₹${optTotal.toFixed(2)}`;

  updateStatistics();
  updateTypeChart(reqTotal, optTotal);
  updateCategoryChart();
  updateTrendChart();
  updateBudgetStatus();
}

function updateStatistics() {
  const totalINR = expenses.reduce((sum, e) => sum + convertToINR(e.amount, e.currency || '₹'), 0);
  const count = expenses.length;
  const avg = count > 0 ? totalINR / count : 0;

  const categoryTotals = {};
  expenses.forEach(e => {
    const amountINR = convertToINR(e.amount, e.currency || '₹');
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + amountINR;
  });

  const topCat = Object.keys(categoryTotals).length > 0 
    ? Object.keys(categoryTotals).reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b)
    : '-';

  document.getElementById('totalExpenses').textContent = `₹${totalINR.toFixed(2)}`;
  document.getElementById('totalItems').textContent = count;
  document.getElementById('avgExpense').textContent = `₹${avg.toFixed(2)}`;
  document.getElementById('topCategory').textContent = topCat;

  document.getElementById('totalExpensesMobile').textContent = `₹${totalINR.toFixed(2)}`;
  document.getElementById('totalItemsMobile').textContent = count;
  document.getElementById('avgExpenseMobile').textContent = `₹${avg.toFixed(2)}`;
  document.getElementById('topCategoryMobile').textContent = topCat;
}

function updateTypeChart(req, opt) {
  const ctx = document.getElementById('typeChart').getContext('2d');
  if (typeChart) typeChart.destroy();

  typeChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Required', 'Optional'],
      datasets: [{
        data: [req, opt],
        backgroundColor: ['#ff6b6b', '#48dbfb'],
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: function(ctx) {
              return '₹' + (ctx.raw || 0).toFixed(2);
            }
          }
        },
        legend: { 
          labels: { 
            color: '#000',
            font: { size: 14 }
          } 
        }
      },
      layout: {
        padding: {
          top: 10,
          bottom: 10,
          left: 10,
          right: 10
        }
      }
    }
  });
}

function updateCategoryChart() {
  const totals = {};
  expenses.forEach(e => { 
    const amountINR = convertToINR(e.amount, e.currency || '₹');
    totals[e.category] = (totals[e.category] || 0) + amountINR;
  });

  const ctx = document.getElementById('expChart').getContext('2d');
  if (catChart) catChart.destroy();

  catChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(totals),
      datasets: [{
        label: 'Amount (₹)',
        data: Object.values(totals),
        backgroundColor: [
          'rgba(99,132,255,0.85)',
          'rgba(75,192,192,0.85)',
          'rgba(255,159,64,0.85)',
          'rgba(153,102,255,0.85)',
          'rgba(255,99,132,0.85)'
        ],
        borderRadius: 10,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { 
          ticks: { 
            color: '#000',
            font: { size: 13 },
            maxRotation: 45,
            minRotation: 0
          } 
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: '#000',
            callback: function(value) { return '₹' + value.toFixed(0); },
            font: { size: 13 }
          },
          grid: { color: 'rgba(0,0,0,0.1)' }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(ctx) { return '₹' + ctx.raw.toFixed(2); }
          }
        },
        legend: { display: false }
      },
      layout: {
        padding: {
          top: 10,
          bottom: 10,
          left: 10,
          right: 10
        }
      }
    }
  });
}

function updateTrendChart() {
  const sortedExpenses = [...expenses].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  const dailyTotals = {};
  sortedExpenses.forEach(e => {
    const amountINR = convertToINR(e.amount, e.currency || '₹');
    if (dailyTotals[e.date]) {
      dailyTotals[e.date] += amountINR;
    } else {
      dailyTotals[e.date] = amountINR;
    }
  });

  const dates = Object.keys(dailyTotals).sort();
  const amounts = dates.map(d => dailyTotals[d]);

  const ctx = document.getElementById('trendChart').getContext('2d');
  if (trendChart) trendChart.destroy();

  trendChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates.map(d => formatDate(d)),
      datasets: [{
        label: 'Daily Spending',
        data: amounts,
        borderColor: '#2d61ff',
        backgroundColor: 'rgba(45,97,255,0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#2d61ff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: {
            color: '#000',
            font: { size: 12 },
            maxRotation: 45,
            minRotation: 45
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: '#000',
            callback: function(value) { return '₹' + value.toFixed(0); },
            font: { size: 13 }
          },
          grid: { color: 'rgba(0,0,0,0.1)' }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(ctx) { return '₹' + ctx.raw.toFixed(2); }
          }
        },
        legend: { display: false }
      },
      layout: {
        padding: {
          top: 10,
          bottom: 10,
          left: 10,
          right: 10
        }
      }
    }
  });
}

async function setBudget() {
  const category = document.getElementById('budgetCategory').value;
  const amount = Number(document.getElementById('budgetAmount').value);
  const currency = document.getElementById('budgetCurrency').value;

  if (!amount || amount <= 0) {
    showToast('Please enter a valid budget amount', 'error');
    return;
  }

  const amountINR = convertToINR(amount, currency);
  budgets[category] = { amount: amountINR, currency, originalAmount: amount };
  await saveBudgets();
  
  document.getElementById('budgetAmount').value = '';
  showToast(`Budget set for ${category}!`);
  renderBudgets();
  updateBudgetStatus();
}

function renderBudgets() {
  const budgetList = document.getElementById('budgetList');
  budgetList.innerHTML = '';

  if (Object.keys(budgets).length === 0) {
    budgetList.innerHTML = '<div class="empty-state">No budgets set yet</div>';
    return;
  }

  Object.keys(budgets).forEach(category => {
    const budget = budgets[category];
    const spent = expenses
      .filter(e => e.category === category)
      .reduce((sum, e) => sum + convertToINR(e.amount, e.currency || '₹'), 0);

    const item = document.createElement('div');
    item.className = 'budget-item';
    item.innerHTML = `
      <div style="flex:1;">
        <strong>${category}</strong>
        <div style="font-size:12px; opacity:0.8; margin-top:4px;">
          Spent: ₹${spent.toFixed(2)} / Budget: ₹${budget.amount.toFixed(2)}
        </div>
      </div>
      <button class="btn btn-danger" onclick="removeBudget('${category}')">Remove</button>
    `;
    budgetList.appendChild(item);
  });
}

async function removeBudget(category) {
  delete budgets[category];
  await saveBudgets();
  showToast(`Budget removed for ${category}`);
  renderBudgets();
  updateBudgetStatus();
}

function updateBudgetStatus() {
  const statusDiv = document.getElementById('budgetStatus');
  statusDiv.innerHTML = '';

  if (Object.keys(budgets).length === 0) {
    statusDiv.innerHTML = '<div class="empty-state">No budgets set</div>';
    return;
  }

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  Object.keys(budgets).forEach(category => {
    const budget = budgets[category];
    const monthExpenses = expenses.filter(e => {
      const expDate = new Date(e.date);
      return e.category === category && 
             expDate.getMonth() === currentMonth && 
             expDate.getFullYear() === currentYear;
    });

    const spent = monthExpenses.reduce((sum, e) => sum + convertToINR(e.amount, e.currency || '₹'), 0);
    const percentage = (spent / budget.amount) * 100;

    let barClass = '';
    if (percentage >= 100) barClass = 'danger';
    else if (percentage >= 80) barClass = 'warning';

    const item = document.createElement('div');
    item.className = 'budget-item';
    item.innerHTML = `
      <div style="flex:1;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <strong>${category}</strong>
          <span style="font-size:13px;">${percentage.toFixed(0)}%</span>
        </div>
        <div class="budget-progress">
          <div class="budget-progress-bar ${barClass}" style="width:${Math.min(percentage, 100)}%"></div>
        </div>
        <div style="font-size:11px; opacity:0.8; margin-top:4px;">
          ₹${spent.toFixed(2)} of ₹${budget.amount.toFixed(2)}
        </div>
      </div>
    `;
    statusDiv.appendChild(item);
  });
}

function importCSV() {
  const fileInput = document.getElementById('csvFile');
  const file = fileInput.files[0];

  if (!file) return;

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: async function(results) {
      let imported = 0;
      let failed = 0;

      results.data.forEach(row => {
        const title = row.Title || row.title;
        const amount = Number(row.Amount || row.amount);
        const date = row.Date || row.date;
        const category = row.Category || row.category || 'Other';
        const type = (row.Type || row.type || 'optional').toLowerCase();
        const currency = row.Currency || row.currency || '₹';
        const recurring = (row.Recurring || row.recurring || 'false').toLowerCase() === 'true';

        if (title && amount && date) {
          expenses.push({
            title,
            amount,
            date,
            category,
            type: type === 'required' ? 'required' : 'optional',
            currency,
            recurring,
            id: Date.now() + imported
          });
          imported++;
        } else {
          failed++;
        }
      });

      await saveExpenses();
      fileInput.value = '';
      
      if (imported > 0) {
        showToast(`Imported ${imported} expenses!`);
        render();
      }
      
      if (failed > 0) {
        showToast(`${failed} rows failed to import`, 'error');
      }
    },
    error: function(error) {
      showToast('Error reading CSV file', 'error');
      console.error(error);
    }
  });
}

function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  if (type === 'error') toast.classList.add('error');
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}

function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, function(m) { 
    return ({
      '&':'&amp;',
      '<':'&lt;',
      '>':'&gt;',
      '"':'&quot;',
      "'":'&#39;'
    }[m]); 
  });
}

function exportData() {
  if (expenses.length === 0) {
    showToast('No expenses to export', 'error');
    return;
  }

  let csv = 'Title,Amount,Date,Category,Type,Currency,Recurring\n';
  expenses.forEach(e => {
    csv += `"${e.title}",${e.amount},${e.date},${e.category},${e.type},${e.currency || '₹'},${e.recurring || false}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  
  showToast('Expenses exported successfully!');
}

init();