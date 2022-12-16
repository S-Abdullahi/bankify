'use strict'

// Data
const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
  };
  
  const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
  };
  
  const account3 = {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
  };
  
  const account4 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
  };
  
const accounts = [account1, account2, account3, account4];

  //ELEMENT
const labelBalance = document.querySelector('.dashboard-balance')

const transactionMovement = document.querySelector('.transaction-log')



  //FUNCIIONS
  //display each transaction
  const displayTransaction = function(transactions){
    transactionMovement.innerHTML = ''
    transactions.forEach(function(amount, index){
        const type = amount > 0 ? 'deposit' : 'withdraw'
        const html = `
        <div class="transaction-unit">
            <div class="transaction-${type} transaction-status">${index + 1} ${type}</div>
            <div class="transaction-amount">${amount}</div>
        </div>`
        transactionMovement.insertAdjacentHTML('afterbegin',html)
    })    
}

displayTransaction(account1.movements)

//diplay total balance
const calcDisplayBalance = function(movements){
    const balance = movements.reduce((acc, mov)=>acc+mov,0)
    labelBalance.textContent = `${balance} EUR`
}
calcDisplayBalance(account1.movements)

//create username for each account
const createUsername = function(userAccounts){
    userAccounts.forEach((acct)=>{
        acct.username = acct.owner.toLowerCase().split(' ').map((name)=>name[0]).join('')
    })
}

createUsername(accounts)
console.log(accounts)
  