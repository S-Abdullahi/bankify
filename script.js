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
      '2022-12-19T14:43:26.374Z',
      '2022-12-18T18:49:59.371Z',
      '2022-12-20T12:01:20.894Z',
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
const labelTime = document.querySelector('.time-reading')

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
console.log(new Date().getTime())
//number formatting
function formatNumber(value, locale, currency){
    return Intl.NumberFormat(locale,{
        style: 'currency',
        currency: currency
    }).format(value)
}


//timer
const setTimer = function(){
    let time = 100
    const tick = function(){
        let hour = String(Math.trunc(time/60)).padStart(2,0)
        let minute = String(time % 60).padStart(2,0)
        labelTime.textContent = `${hour} : ${minute}`

        if(time == 0){
            appContainer.style.opacity = 0;
            labelGreeting.textContent = 'Login to get started'
            clearInterval(timeInterval)
        }
        time--
    }
    
    tick()
    const timeInterval = setInterval(tick,1000)
    return timeInterval
}

//date formating
function formatDate(date,locale){
        const change = Math.abs(Math.round((new Date(date).getTime() - new Date().getTime())/ (1000*60*60*24)));
        if (change == 0) return 'Today'
        if (change == 1) return 'Yesterday'
        if (change == 2) return '2 days ago'
        if (change == 3) return '3 days ago'

        return Intl.DateTimeFormat(locale).format(date)
}

//event listeners
//login
let currentCustomer, timer
btnLogin.addEventListener('click', (e)=>{
    e.preventDefault();

    const loginTime = new Date()
    const option = {
        hour: 'numeric',
        minute: 'numeric'
    }
    const lang = navigation.language

    labelDashDate.textContent = new Intl.DateTimeFormat(lang).format(loginTime)
    labelDashTime.textContent = new Intl.DateTimeFormat(lang,option).format(loginTime)
    currentCustomer = accounts.find((acc)=>acc.username === inputUsername.value)

    if(currentCustomer?.pin === Number(inputPin.value)){
        appContainer.style.opacity = 1;
        inputUsername.value = inputPin.value = ''

        //login greeting
        labelGreeting.textContent = `welcome back, ${currentCustomer.owner.split(' ')[0]}`
        

        //update ui
        if(timer) clearInterval(timer)
        timer = setTimer()
        updateUI(currentCustomer)

    }
})


//transfer
btnTransfer.addEventListener('click', (e)=>{
    e.preventDefault()
    const recipientUsername = InputRecipient.value
    const amount = Number(InputTransferAmount.value)
    const now = new Date()
    const recipient = accounts.find((acc)=>acc.username === recipientUsername)

    if(recipient && amount > 0 && recipientUsername !== currentCustomer.username && currentCustomer.balance >= amount){
        recipient.movements.push(amount)
        currentCustomer.movements.push(-amount)

        InputRecipient.value = InputTransferAmount.value = ''
        recipient.movementsDates.push(now.toISOString())
        currentCustomer.movementsDates.push(now.toISOString())
        //update ui
        updateUI(currentCustomer)

        //reset timer
        clearInterval(timer)
        timer = setTimer()
    }
})

//loan
btnLoan.addEventListener('click', (e)=>{
    e.preventDefault()
    const inputLoan = Math.floor(inputLoanAmount.value)
    const depositStatus = currentCustomer.movements.some((dep)=>dep > 0.1 * inputLoan)
    const now = new Date()
    if(inputLoan > 0 &&  depositStatus){
        setTimeout(() => {
            currentCustomer.movements.push(inputLoan)
            currentCustomer.movementsDates.push(now.toISOString())
            //update ui
            updateUI(currentCustomer)
    
            clearInterval(timer)
            timer = setTimer()
    
        }, 2500);
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

        const displayTime = `${day}/${month}/${year}`

        const html = `
        <div class="transaction-unit">
            <div class="transaction-${type} transaction-status">${index + 1} ${type}</div>
            <div class="transaction-date">${formatDate(transTime.getTime(),acc.locale)}</div>
            <div class="transaction-amount">${formatNumber(amount.toFixed(2),acc.locale,acc.currency)}</div>
        </div>`
        transactionMovement.insertAdjacentHTML('afterbegin',html)
    })    
}

//diplay total balance
function calcDisplayBalance(account){
    account.balance = account.movements.reduce((acc, mov)=>acc+mov,0)
    labelBalance.textContent = `${formatNumber(account.balance.toFixed(2),account.locale, account.currency)}`
}

//calculate and display balance summary
function calcBalanceSummary(account){
    labelSumIn.textContent = `0.00`
    labelSumOut.textContent = `0.00`
    labelInterest.textContent = `0.00`

    //calculate income
    const income = account.movements.filter((acc)=>acc > 0).reduce((acc, cur)=>acc+cur,0)
    labelSumIn.textContent = formatNumber(income.toFixed(2),account.locale,account.currency)

    //calcuate debit
    const debit = account.movements.filter((acc)=>acc <0).reduce((acc,cur)=>acc+cur,0)
    labelSumOut.textContent = formatNumber(Math.abs(debit).toFixed(2),account.locale, account.currency) 

    //calculate interest
    const interest = account.movements.filter((dep)=>dep >0).map((dep)=>dep*account.interestRate/100).filter((dep)=>dep>=1).reduce((acc,cur)=>acc+cur,0)
    labelInterest.textContent = formatNumber(interest.toFixed(2), account.locale, account.currency)
}

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