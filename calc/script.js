'use strict';

const start = document.getElementById('start'),
    cancel = document.getElementById('cancel'),
    buttonFirstPlus = document.getElementsByTagName('button')[0],
    buttonSecondPlus = document.getElementsByTagName('button')[1],
    depositCheck = document.querySelector('#deposit-check'),
    depositBank = document.querySelector('.deposit-bank'),
    depositPercent = document.querySelector('.deposit-percent'),
    depositAmount = document.querySelector('.deposit-amount'),
    budgetDayValue = document.querySelector('.budget_day-value'),
    budgetMonthValue = document.querySelector('.budget_month-value'),
    salaryAmount = document.querySelector('.salary-amount'),
    incomeTitle = document.querySelector('.income-title'),
    incomePeriodValue = document.querySelector('.income_period-value'),
    additionalIncomeItem = document.querySelectorAll('.additional_income-item'),
    additionalIncomeValue = document.querySelector('.additional_income-value'),
    expensesTitle = document.querySelector('.expenses-title'),
    expensesMonthValue = document.querySelector('.expenses_month-value'),
    additionalExpensesItem = document.querySelector('.additional_expenses-item'),
    additionalExpensesValue = document.querySelector('.additional_expenses-value'),
    targetAmount = document.querySelector('.target-amount'),
    targetMonthValue = document.querySelector('.target_month-value'),
    periodSelect = document.querySelector('.period-select'),
    periodAmount = document.querySelector('.period-amount');

let incomeItems = document.querySelectorAll('.income-items'),
    expensesItems = document.querySelectorAll('.expenses-items');

class appData {

    constructor() {

        this.budget = 0;
        this.budgetDay = 0;
        this.budgetMonth = 0;
        this.expensesMonth = 0;
        this.income = {};
        this.incomeMonth = 0;
        this.addIncome = [];
        this.expenses = {};
        this.addExpenses = [];
        this.deposit = false;
        this.percentDeposit = 0;
        this.moneyDeposit = 0;

    }
    getSalaryAmount() {

        if (salaryAmount.value !== '') {
            start.removeAttribute('disabled', 'disabled');
        }

    }
    start() {
        
        if (salaryAmount.value === '') {
            start.setAttribute('disabled', 'disabled');
            return;
        }

        const allInput = document.querySelectorAll('.data input[type="text"]');
        allInput.forEach((item) => {
            item.setAttribute('disabled', 'disabled');
        });
        start.style.display = 'none';
        cancel.style.display = 'block';

        this.budget = +salaryAmount.value;

        this.getUniversal(expensesItems, `expenses`, this.expenses);
        this.getUniversal(incomeItems, 'income', this.income);
        this.getExpensesMonth();
        this.getInfoDeposit();
        this.getBudget();
        this.getAddExpenses();
        this.getAddIncome();
        this.showResult();
        // this.wholeAppData();
        // this.getTargetMonth();
        // this.getStatusIncome();
        // this.getInfoDeposit();

    }
    reset() {

        const allInputReset = document.querySelectorAll('input[type="text"]');
        allInputReset.forEach((item) => {

            if (item.type == "text") {
                item.value = '';
                item.disabled = false;
            }

            periodSelect.value = 1;
            periodAmount.innerHTML = periodSelect.value;

        });

        depositCheck.checked = false;

        start.style.display = 'block';
        cancel.style.display = 'none';


        incomeItems = document.querySelectorAll('.income-items');
        for (let i = 1; i < incomeItems.length; i++) {
            incomeItems[i].parentNode.removeChild(incomeItems[i]);
        }

        expensesItems = document.querySelectorAll('.expenses-items');
        for (let i = 1; i < expensesItems.length; i++) {
            expensesItems[i].parentNode.removeChild(expensesItems[i]);
        }

        buttonFirstPlus.style.display = 'block';
        buttonSecondPlus.style.display = 'block';

    }
    showResult() {
        

        budgetMonthValue.value = this.budgetMonth;
        budgetDayValue.value = Math.ceil(this.budgetDay);
        expensesMonthValue.value = this.expensesMonth;
        additionalExpensesValue.value = this.addExpenses.join(', ');
        additionalIncomeValue.value = this.addIncome.join(', ');
        targetMonthValue.value = Math.ceil(this.getTargetMonth());
        incomePeriodValue.value = this.calcSevedMoney();

        periodSelect.addEventListener('change', () => {
            incomePeriodValue.value = this.calcSevedMoney();
        });

    }
    addUniversalBlock(universalItems, universal, buttonPlus) {

        const cloneUniversalItem = universalItems[0].cloneNode(true);
        universalItems[0].parentNode.insertBefore(cloneUniversalItem, buttonPlus);
        universalItems = document.querySelectorAll(`.${universal}-items`);

        if (universalItems.length === 3) {
            buttonPlus.style.display = 'none';
        }

    }
    getUniversal(universalVarItems, universalVar, universalItem) {

        universalVarItems = document.querySelectorAll(`.${universalVar}-items`);

        universalVarItems.forEach((item) => {

            const itemAlls = item.querySelector(`.${universalVar}-title`).value;
            const cashAlls = item.querySelector(`.${universalVar}-amount`).value;

            if (itemAlls !== '' && cashAlls !== '') {
                universalItem[itemAlls] = cashAlls;
            }

        });

        for (const key in this.income) {
            this.incomeMonth += +this.income[key];
        }

    }
    getAddExpenses() {

        const addExpenses = additionalExpensesItem.value.split(',');

        addExpenses.forEach((item) => {

            item = item.trim();
            if (item !== '') {
                this.addExpenses.push(item);
            }

        });

    }
    getAddIncome() {

        additionalIncomeItem.forEach((item) => {

            const itemValue = item.value.trim();

            if (itemValue !== '') {
                this.addIncome.push(itemValue);
            }

        });

    }
    getExpensesMonth() {

        for (const key in this.expenses) {
            this.expensesMonth += +this.expenses[key];
        }

    }
    getBudget() {

        this.budgetMonth = this.budget + this.incomeMonth -
            this.expensesMonth + (this.moneyDeposit * this.percentDeposit) / 12;
        this.budgetDay = this.budgetMonth / 30;

    }
    getTargetMonth() {

        return targetAmount.value / this.budget;

    }
    getStatusIncome() {

        if (this.budgetDay >= 800) {
            return ('Высокий');
        } else if (this.budgetDay >= 300 && this.budgetDay < 800) {
            return ('Средний');
        } else if (this.budgetDay < 300) {
            return ('Низкий');
        } else if (this.budgetDay >= 0) {
            return ('Что то пошло не так');
        }

    }
    getInfoDeposit() {

        if (this.deposit) {
            this.percentDeposit = depositPercent.value;
            this.moneyDeposit = depositAmount.value;
        }

    }
    calcSevedMoney() {

        return this.budgetMonth * periodSelect.value;

    }
    wholeAppData() {

        for (const key in this) {
            console.log('Наша программа ' + key + ' включает в себя данные: ' + this[key]);
        }

    }
    eventsListeners() {

        start.addEventListener('click', () => {
            this.start();
        });
        cancel.addEventListener('click', () => {
            this.reset();
        });

        buttonSecondPlus.addEventListener('click', () => {
            this.addUniversalBlock(expensesItems, `expenses`, buttonSecondPlus);
        });

        buttonFirstPlus.addEventListener('click', () => {
            this.addUniversalBlock(incomeItems, `income`, buttonFirstPlus);
        });

        periodSelect.addEventListener('change', () => {
            periodAmount.innerHTML = periodSelect.value;
        });

        depositCheck.addEventListener('change', () => {

            if (depositCheck.checked) {
                depositBank.style.display = 'inline-block';
                depositAmount.style.display = 'inline-block';
                this.deposit = 'true';
                depositBank.addEventListener('change', () => {
                    const target = event.target;
                    const selectIndex = target.options[target.selectedIndex].value;
                    if (selectIndex === 'other') {
                        depositPercent.style.display = 'inline-block';
                        depositPercent.value = '';
                        depositPercent.removeAttribute('disabled');
                    } else {
                        depositPercent.style.display = 'none';
                        depositPercent.value = selectIndex;
                    }
                });
            } else {
                depositBank.style.display = 'none';
                depositAmount.style.display = 'none';
                depositAmount.value = '';
                this.deposit = 'false';
            }

        });

        salaryAmount.addEventListener('keyup', () => {
            this.getSalaryAmount();
        });

    }
}

const calc = new appData();
calc.eventsListeners();