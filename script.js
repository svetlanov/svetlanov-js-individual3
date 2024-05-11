/**
 * Глобальный массив, содержащий все транзакции.
 * @type {Array<Object>}
 */
let transactions = [
    { id: 1, date: new Date(), category: 'Food', description: 'Dinner at a restaurant', amount: 50 },
    { id: 2, date: new Date(), category: 'Transport', description: 'Taxi fare', amount: -20 },
    { id: 3, date: new Date(), category: 'Utilities', description: 'Electricity bill', amount: 30 }
];

/**
 * Обработчик кликов на таблице транзакций для удаления или отображения деталей транзакций.
 */
document.getElementById('transactionTable').addEventListener('click', function(event) {
    const id = parseInt(event.target.parentNode.parentNode.firstChild.textContent);
    if (event.target.className === 'delete-btn') {
        deleteTransaction(id);
        return;
    }
    
    if (event.target.tagName === 'TD' && event.target.parentNode.tagName === 'TR') {
        const selectedRow = event.target.parentNode;
        const id = selectedRow.cells[0].textContent;

        const description = getTransactionById(parseInt(id))?.description || ''

        document.getElementById('transactionDetails').textContent = description;
    }
});

/**
 * Удаляет транзакцию по ID и обновляет таблицу и общую сумму.
 * @param {number} id - ID транзакции для удаления.
 */
function deleteTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    refreshTable();
    calculateTotal();
}

/**
 * Получает транзакцию по её ID.
 * @param {number} id - Уникальный идентификатор транзакции.
 * @returns {Object|undefined} Объект транзакции, если найден, иначе undefined.
 */
function getTransactionById(id) {
    return transactions.find(transaction => transaction.id === id);
}

/**
 * Обновляет таблицу транзакций, очищая и заново заполняя её.
 */
function refreshTable() {
    const tableBody = document.getElementById('transactionTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';
    transactions.forEach(transaction => addTransactionToTable(transaction));
}

/**
 * Добавляет транзакцию в таблицу.
 * @param {Object} transaction - Объект транзакции для добавления.
 */
function addTransactionToTable(transaction) {
    const tableBody = document.getElementById('transactionTable').getElementsByTagName('tbody')[0];
    let row = tableBody.insertRow();
    row.innerHTML = `<td>${transaction.id}</td>
                     <td>${formatDate(transaction.date)}</td>
                     <td>${transaction.amount}</td>
                     <td>${transaction.category}</td>
                     <td>${getShortDescription(transaction.description)}</td>
                     <td><button class='delete-btn'>Delete</button></td>`;
    row.style.color = transaction.amount > 0 ? 'green' : 'red';
}

/**
 * Рассчитывает и отображает общую сумму всех транзакций.
 */
function calculateTotal() {
    let total = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    document.getElementById('totalAmount').textContent = total.toFixed(2);
}

/**
 * Пытается добавить новую транзакцию из значений формы, проверяя корректность данных.
 */
function tryAddTransaction() {
    try {
        const id = parseInt(document.getElementById('id').value);
        const date = new Date(document.getElementById('date').value);
        const amount = parseFloat(document.getElementById('amount').value);
        const category = document.getElementById('category').value;
        const description = document.getElementById('description').value;

        if (!id || !date || isNaN(amount) || !category || !description) {
            alert('Please fill out all fields correctly.');
            return;
        }

        if (transactions.some(t => t.id === id)) {
            throw new Error('Transaction with this id already exist');
        }

        if (date > new Date()) {
            throw new Error('The transaction date cannot be greater than today\'s date');
        }

        const transaction = { id, date, amount, category, description };
        transactions.push(transaction);
        addTransactionToTable(transaction);
        calculateTotal();
    } catch (err) {
        alert(`Failed to add new transaction: ${err.message}`)
    }
}

/**
 * Форматирует объект даты в удобочитаемую строку.
 * @param {Date} date - Дата для форматирования.
 * @returns {string} Отформатированная строка даты.
 */
function formatDate(date) {

    const dateFormatOptions = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
        timeZone: "Europe/Chisinau",
      };

    return new Intl.DateTimeFormat('ru-RU', dateFormatOptions).format(date)
}

/**
 * Возвращает сокращенное описание из полного описания.
 * @param {string} description - Полное описание транзакции.
 * @returns {string} Сокращенное описание или полное, если в нем менее 4 слов.
 */
function getShortDescription(description) {
    if (!description) return '';

    let descriptionParts = description?.split(' ');

    if (descriptionParts?.length <= 4) return description;

    return descriptionParts.slice(0, 4).join(' ');
}

transactions.forEach(transaction => addTransactionToTable(transaction));
