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
const InputRecipient = document.querySelector('.recipient')
const InputTransferAmount = document.querySelector('.transfer-amount')
const inputUsernameClose = document.querySelector('.close-input-user')
const inputPinClose = document.querySelector('.close-input-pin')
const inputLoanAmount = document.querySelector('.loan-amount')

const btnLogin = document.querySelector('.arrow')
const btnTransfer = document.querySelector('.transfer-btn')
const btnLoan = document.querySelector('.loan-btn')
const btnClose = document.querySelector('.close-btn')
const btnSort = document.querySelector('.sort-btn')


//update ui
function updateUI(account){
    //display balance
    calcDisplayBalance(account)

    //display movement
    displayTransaction(account.movements)

    //display summary
    calcBalanceSummary(account)
}

//event listeners
//login
let currentCustomer
btnLogin.addEventListener('click', (e)=>{
    e.preventDefault();
    currentCustomer = accounts.find((acc)=>acc.username === inputUsername.value)

    if(currentCustomer?.pin === Number(inputPin.value)){
        appContainer.style.opacity = 1;
        inputUsername.value = inputPin.value = ''

        //login greeting
        labelGreeting.textContent = `welcome back, ${currentCustomer.owner.split(' ')[0]}`
        

        //update ui
        updateUI(currentCustomer)
    }
    console.log(currentCustomer)
})


//transfer
btnTransfer.addEventListener('click', (e)=>{
    e.preventDefault()
    const recipientUsername = InputRecipient.value
    const amount = Number(InputTransferAmount.value)

    const recipient = accounts.find((acc)=>acc.username === recipientUsername)

    if(recipient && amount > 0 && recipientUsername !== currentCustomer.username && currentCustomer.balance >= amount){
        recipient.movements.push(amount)
        currentCustomer.movements.push(-amount)

        InputRecipient.value = InputTransferAmount.value = ''
        
        //update ui
        updateUI(currentCustomer)
    }
})

//loan
btnLoan.addEventListener('click', (e)=>{
    e.preventDefault()
    const inputLoan = Number(inputLoanAmount.value)
    const depositStatus = currentCustomer.movements.some((dep)=>dep > 0.1 * inputLoan)
    if(inputLoan > 0 &&  depositStatus){
        currentCustomer.movements.push(inputLoan)
        //update ui
        updateUI(currentCustomer)
    }
    inputLoanAmount.value = ''
})

//close account
btnClose.addEventListener('click',(e)=>{
    e.preventDefault()
    const confirmUser = inputUsernameClose.value
    const confirmPin = Number(inputPinClose.value)

    if(currentCustomer.username === confirmUser && currentCustomer.pin === confirmPin){
        const acctIndex = accounts.findIndex((acc)=>acc.username===confirmUser)

        //clear input field
        inputPinClose.value = inputUsernameClose.value = ''
        accounts.splice(acctIndex,1)
        
        appContainer.style.opacity = 0;
    }
})

//sort
btnSort.addEventListener('click', ()=>{
    console.log('we are outside')
    displayTransaction(currentCustomer.movements, true)
})

  //FUNCIIONS
  //display each transaction
  function displayTransaction(transactions, sort=false){
    const transactionSort = transactions.sort((a,b)=> a-b)
    const trans = sort === true ? transactionSort : transactions
    transactionMovement.innerHTML = ''
    trans.forEach(function(amount, index){
        const type = amount > 0 ? 'deposit' : 'withdraw'
        const html = `
        <div class="transaction-unit">
            <div class="transaction-${type} transaction-status">${index + 1} ${type}</div>
            <div class="transaction-amount">$${amount}</div>
        </div>`
        transactionMovement.insertAdjacentHTML('afterbegin',html)
    })    
}
// displayTransaction(account1.movements)

//diplay total balance
function calcDisplayBalance(account){
    account.balance = account.movements.reduce((acc, mov)=>acc+mov,0)
    labelBalance.textContent = `$${account.balance}`
}
// calcDisplayBalance(account1.movements)

//calculate and display balance summary
function calcBalanceSummary(account){
    labelSumIn.textContent = `0.00`
    labelSumOut.textContent = `0.00`
    labelInterest.textContent = `0.00`

    //calculate income
    const income = account.movements.filter((acc)=>acc > 0).reduce((acc, cur)=>acc+cur,0)
    labelSumIn.textContent = `$${income}`

    //calcuate debit
    const debit = account.movements.filter((acc)=>acc <0).reduce((acc,cur)=>acc+cur,0)
    labelSumOut.textContent = `$${Math.abs(debit)}`

    //calculate interest
    const interest = account.movements.filter((dep)=>dep >0).map((dep)=>dep*account.interestRate/100).filter((dep)=>dep>=1).reduce((acc,cur)=>acc+cur,0)
    labelInterest.textContent = `$${interest}`
}
// calcBalanceSummary(account1.movements)

//create username for each account
const createUsername = function(userAccounts){
    userAccounts.forEach((acct)=>{
        acct.username = acct.owner.toLowerCase().split(' ').map((name)=>name[0]).join('')
    })
}

createUsername(accounts)
console.log(accounts)
  