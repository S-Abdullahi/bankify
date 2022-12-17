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
const labelGreeting = document.querySelector('.greeting')
const labelBalance = document.querySelector('.dashboard-balance')
const labelSumIn = document.querySelector('.summary-in')
const labelSumOut = document.querySelector('.summary-out')
const labelInterest = document.querySelector('.summary-interest')

const transactionMovement = document.querySelector('.transaction-log')
const inputUsername = document.querySelector('.input-user')
const inputPin = document.querySelector('.input-pin')
const appContainer = document.querySelector('.app-container')

const btnLogin = document.querySelector('.arrow')

//event listeners
let currentCustomer
btnLogin.addEventListener('click', (e)=>{
    e.preventDefault();
    currentCustomer = accounts.find((acc)=>acc.username === inputUsername.value)

    if(currentCustomer.pin === Number(inputPin.value)){
        appContainer.style.opacity = 1;
        inputUsername.value = inputPin.value = ''

        //login greeting
        labelGreeting.textContent = `Good morning, ${currentCustomer.owner.split(' ')[0]}`
    }
    console.log(currentCustomer)
})


  //FUNCIIONS
  //display each transaction
  const displayTransaction = function(transactions){
    transactionMovement.innerHTML = ''
    transactions.forEach(function(amount, index){
        const type = amount > 0 ? 'deposit' : 'withdraw'
        const html = `
        <div class="transaction-unit">
            <div class="transaction-${type} transaction-status">${index + 1} ${type}</div>
            <div class="transaction-amount">$${amount}</div>
        </div>`
        transactionMovement.insertAdjacentHTML('afterbegin',html)
    })    
}
displayTransaction(account1.movements)

//diplay total balance
const calcDisplayBalance = function(movements){
    const balance = movements.reduce((acc, mov)=>acc+mov,0)
    labelBalance.textContent = `$${balance}`
}
calcDisplayBalance(account1.movements)

//calculate and display balance summary
const calcBalanceSummary = function(accounts){
    labelSumIn.textContent = `0.00`
    labelSumOut.textContent = `0.00`
    labelInterest.textContent = `0.00`

    //calculate income
    const income = accounts.filter((acc)=>acc > 0).reduce((acc, cur)=>acc+cur,0)
    labelSumIn.textContent = `$${income}`

    //calcuate debit
    const debit = accounts.filter((acc)=>acc <0).reduce((acc,cur)=>acc+cur,0)
    labelSumOut.textContent = `$${Math.abs(debit)}`

    //calculate interest
    const interest = accounts.filter((dep)=>dep >0).map((dep)=>dep*1.2/100).filter((dep)=>dep>=1).reduce((acc,cur)=>acc+cur,0)
    labelInterest.textContent = `$${interest}`
}
calcBalanceSummary(account1.movements)

//create username for each account
const createUsername = function(userAccounts){
    userAccounts.forEach((acct)=>{
        acct.username = acct.owner.toLowerCase().split(' ').map((name)=>name[0]).join('')
    })
}

createUsername(accounts)
console.log(accounts)
  