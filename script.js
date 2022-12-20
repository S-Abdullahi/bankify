'use strict'

// Data
const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2, // %
    pin: 1111,
  
    movementsDates: [
      '2019-11-18T21:31:17.178Z',
      '2019-12-23T07:42:02.383Z',
      '2020-01-28T09:15:04.904Z',
      '2020-04-01T10:17:24.185Z',
      '2020-05-08T14:11:59.604Z',
      '2020-05-27T17:01:17.194Z',
      '2020-07-11T23:36:17.929Z',
      '2020-07-12T10:51:36.790Z',
    ],
    currency: 'EUR',
    locale: 'pt-PT', // de-DE
  };
  
  const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
  
    movementsDates: [
      '2019-11-01T13:15:33.035Z',
      '2019-11-30T09:48:16.867Z',
      '2019-12-25T06:04:23.907Z',
      '2020-01-25T14:18:46.235Z',
      '2020-02-05T16:33:06.386Z',
      '2020-04-10T14:43:26.374Z',
      '2020-06-25T18:49:59.371Z',
      '2020-07-26T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-US',
  };
  
  const accounts = [account1, account2];

  //ELEMENT
const labelGreeting = document.querySelector('.greeting')
const labelDashDate = document.querySelector('.dashboard-date')
const labelDashTime = document.querySelector('.dashboard-time')
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
    displayTransaction(account)

    //display summary
    calcBalanceSummary(account)
}

//event listeners
//login
let currentCustomer
btnLogin.addEventListener('click', (e)=>{
    e.preventDefault();

    const loginTime = new Date()
    const date = `${loginTime.getDate()}`.padStart(2,0)
    const month = `${loginTime.getMonth()}`.padStart(2,0)
    const year = loginTime.getFullYear()
    const hour = `${loginTime.getHours()}`.padStart(2,0)
    const minute = `${loginTime.getMinutes()}`.padStart(2,0)

    labelDashDate.textContent = `${date}/${month}/${year}`
    labelDashTime.textContent = `${hour}:${minute}`
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
    const inputLoan = Math.floor(inputLoanAmount.value)
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
let switchKey = false
btnSort.addEventListener('click', ()=>{
    displayTransaction(currentCustomer.movements, !switchKey)
    switchKey = !switchKey
})

  //FUNCIIONS
  //display each transaction
  function displayTransaction(acc, sort=false){
    const transactionSort = acc.movements.slice().sort((a,b)=> a-b)
    const trans = sort ? transactionSort : acc.movements
    transactionMovement.innerHTML = ''
    trans.forEach(function(amount, index){
        const type = amount > 0 ? 'deposit' : 'withdraw'
        const transTime = new Date(acc.movementsDates[index])
        const year = transTime.getFullYear()
        const month = `${transTime.getMonth()}`.padStart(2,0)
        const day = `${transTime.getDate()}`.padStart(2,0)

        const displayTime = `${year}/${month}/${day}`

        const html = `
        <div class="transaction-unit">
            <div class="transaction-${type} transaction-status">${index + 1} ${type}</div>
            <div class="transaction-date">${displayTime}</div>
            <div class="transaction-amount">$${amount.toFixed(2)}</div>
        </div>`
        transactionMovement.insertAdjacentHTML('afterbegin',html)
    })    
}
// displayTransaction(account1.movements)

//diplay total balance
function calcDisplayBalance(account){
    account.balance = account.movements.reduce((acc, mov)=>acc+mov,0)
    labelBalance.textContent = `$${account.balance.toFixed(2)}`
}
// calcDisplayBalance(account1.movements)

//calculate and display balance summary
function calcBalanceSummary(account){
    labelSumIn.textContent = `0.00`
    labelSumOut.textContent = `0.00`
    labelInterest.textContent = `0.00`

    //calculate income
    const income = account.movements.filter((acc)=>acc > 0).reduce((acc, cur)=>acc+cur,0)
    labelSumIn.textContent = `$${income.toFixed(2)}`

    //calcuate debit
    const debit = account.movements.filter((acc)=>acc <0).reduce((acc,cur)=>acc+cur,0)
    labelSumOut.textContent = `$${Math.abs(debit).toFixed(2)}`

    //calculate interest
    const interest = account.movements.filter((dep)=>dep >0).map((dep)=>dep*account.interestRate/100).filter((dep)=>dep>=1).reduce((acc,cur)=>acc+cur,0)
    labelInterest.textContent = `$${interest.toFixed(2)}`
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

//Array.from() practice
// document.querySelector('.dashboard-balance').addEventListener('click',()=>{
//     const tranUI = Array.from(document.querySelectorAll('.transaction-amount'))//.map((el)=>el.textContent.replace('$',''))

//     const pracUI = document.querySelectorAll('.transaction-amount')
//     const pracUIArray = [...pracUI]
//     console.log(tranUI)
//     console.log(pracUIArray.map((el)=>el.textContent.replace('$',)))
// })