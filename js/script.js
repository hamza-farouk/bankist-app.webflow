// Selecting all the elements to be use
const labelWelcome = document.querySelector(".nav-text");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".current-balance");
const labelSumIn = document.querySelector("#total-in");
const labelSumOut = document.querySelector("#total-out");
const labelsumInterest = document.querySelector("#total-interest");
const labelTimer = document.querySelector(".timer");

const btnLogin = document.querySelector("#login");
const btnTransfer = document.querySelector("#btn-transfer");
const btnLoan = document.querySelector("#btn-loan");
const btnClose = document.querySelector("#logout");
const btnSort = document.querySelector("#sort");

const inputLoginUsername = document.querySelector("#user");
const inputLoginPin = document.querySelector("#pin");
const inputTransferTo = document.querySelector("#transfer-to");
const inputTransferAmount = document.querySelector("#transfer-amount");
const inputLoanAmount = document.querySelector("#request-amount");
const inputCloseUsername = document.querySelector("#close-user");
const inputClosePin = document.querySelector("#close-pin");

const containerApp = document.querySelector(".main-content_wrapper");
const movement = document.querySelector(".main_transaction-wrapper");

("use strict");

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2023-12-13T17:01:17.194Z",
    "2023-12-17T23:36:17.929Z",
    "2023-12-19T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2023-12-19T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

//************** Variable Declarations *********/
let currentAccount;
let state;
let count = 120;
let time = count;
let countdown;

////************** Functions Definations  *******************/

//Start tick function
const tick = function () {
  const minute = String(Math.trunc(time / 60)).padStart(2, "0");
  const seconds = String(Math.trunc(time % 60)).padStart(2, "0");
  // In each call, print the remaining time to UI
  labelTimer.textContent = `${minute}: ${seconds}`;

  console.log(time);
  // When 0 seconds , stop timer and logout user
  if (time === 0) {
    clearInterval(countdown);
    containerApp.classList.remove("login");
    time = count;
  }
  // Decrease the countdown by 1 second
  time--;
};

//Display transactions time function
const displayTransactionDate = function (date, locales) {
  console.log(date);
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, 0);
  const day = `${now.getDate()}`.padStart(2, 0);
  const hour = now.getHours();
  const minute = now.getMinutes();
  transactionTime = `${day}/${month}/${year}, ${hour}:${minute}`;
  const dateStamp = Math.round(Math.abs(date - now) / (1000 * 60 * 60 * 24));
  if (dateStamp === 0) return "Today";
  if (dateStamp === 1) return "Yesterday";
  if (dateStamp <= 7) return `${dateStamp} days has passed`;

  return new Intl.DateTimeFormat(locales).format(date);
  // `${day}/${month}/${year}`;
};

// ---- Display movement functions ----
const displayMovement = function (acc, sort = false) {
  movement.innerHTML = "";

  //check the value of sort flag to check whether to return the sort or normal array
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements; // the slice is use to create a copy because the sort method mutates the original array

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    console.log(i);
    let dates = new Date(acc.movementsDates[i]);
    const transactionTime = displayTransactionDate(dates, acc.locale);
    const html = `<div class="transaction_wrapper">
        <div class="w-layout-hflex transaction_left ">
          <div class="transaction-deposit ${type}">${i + 1} ${type}</div>
          <div class="transaction-date">${transactionTime}</div>
        </div>
        <div class="transaction-amount">${mov.toFixed(2)}</div>
      </div>`;
    movement.insertAdjacentHTML("afterbegin", html);
  });
};

//-------- Create user function --------------------------------
const createUsername = function (acct) {
  acct.forEach(function (user) {
    user.username = user.owner
      .toLowerCase()
      .split(" ")
      .map((str) => str[0])
      .join("");
  });
};

// -------- Display balance function --------

const calcDisplayBalance = function (movement) {
  const balance = movement.reduce((acc, mov) => acc + mov);
  labelBalance.textContent = `${balance.toFixed(2)} EUR`;
  return balance;
};

createUsername(accounts);
console.log(accounts);

//--------- calculate summmary function -------

const calcSummary = function (acc) {
  const deposit = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov);
  labelSumIn.textContent = `${deposit.toFixed(2)} $`;

  const withdrawal = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov);
  labelSumOut.textContent = `${Math.abs(withdrawal).toFixed(2)} $`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((mov) => (mov * acc.interestRate) / 100)
    .filter((mov) => mov > 1)
    .reduce((mov, acc) => mov + acc);
  labelsumInterest.textContent = `${interest.toFixed(2)} $`;
};
// ---------update UI--------

function updateUI(user) {
  // Display movement
  displayMovement(user);

  // Display balance
  calcDisplayBalance(user.movements);

  // Display summary
  calcSummary(user);
}

//****************** End of functions ****************************/

///****************** Event Handlers ****************************

// Login
btnLogin.addEventListener("click", function () {
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // When a user logs in

    // clear the input login and password fields
    inputLoginUsername.value = inputLoginPin.value = "";

    // Remove focus on the input pin field
    inputLoginPin.blur();

    // Add the login class to change opacity to 100
    containerApp.classList.add("login");

    // Display login message
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(" ")[0]
    }`;

    // Set the Date
    const now = new Date();
    const year = now.getFullYear();
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const day = `${now.getDate()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}`;

    updateUI(currentAccount);

    //******* set the date using browser *******
    // Define options
    const options = {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      month: "numeric",
      year: "numeric",
    };

    // Get the current language from the browser
    const locale = navigator.language;

    // set the date
    labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(
      new Date()
    );
    //Start the logout countdown
    if (countdown) clearInterval(countdown);
    time = count;
    countdown = setInterval(tick, 1000);
  }
});

//-----------------------------------------

// Transfer Event
btnTransfer.addEventListener("click", function () {
  // Get the amount to send from the amount field
  const amount = Number(inputTransferAmount.value);
  console.log(amount);

  // Get reciever account number
  const recieverAcc = accounts.find(
    (account) => account.username === inputTransferTo.value
  );
  console.log(recieverAcc);

  // check if amount
  if (
    amount > 0 &&
    calcDisplayBalance(currentAccount.movements) >= amount &&
    // currentAccount.balance >= amount &&
    recieverAcc?.username !== currentAccount.username
  ) {
    // Debiting the current account and crediting the reciever account
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);
    console.log("Transfer Valid");

    // Add transfer date
    currentAccount.movementsDates.push(new Date());
    recieverAcc.movementsDates.push(new Date());
  }

  // Clear the amount and transfer name input field
  inputTransferAmount.value = inputTransferTo.value = "";

  // update the UI
  updateUI(currentAccount);

  // Reset the time
  clearInterval(countdown);
  time = count;
  countdown = setInterval(tick, 1000);
});

//-----------------------------------

// Loan money Event
btnLoan.addEventListener("click", function () {
  const loan = Math.floor(inputLoanAmount.value);

  // check condition(any deposit > 10% of requested amount)
  if (
    loan > 0 &&
    currentAccount.movements.some((amount) => amount > loan * 0.1)
  ) {
    setTimeout(function () {
      // push amount to the array
      currentAccount.movements.push(loan);

      // Add loan date
      currentAccount.movementsDates.push(new Date());
      // update UI
      updateUI(currentAccount);
    }, 2500);
  }
  // Reset the time
  clearInterval(countdown);
  time = count;
  countdown = setInterval(tick, 1000);

  // clear the loan input field
  inputLoanAmount.value = "";

  // Remove focus on the loan field
  inputLoanAmount.blur();
});

//--------------------

// close account event
btnClose.addEventListener("click", function () {
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (account) => account.username === currentAccount.username
    );
    console.log(index);
    // Deleting the account with the splice method
    accounts.splice(index, 1);

    // clearing the close account username and pin fields
    inputCloseUsername.value = inputClosePin.value = "";

    // Remove the login class to change the opacity back to zero
    containerApp.classList.remove("login");
  }
});

//-----------------------------

// Sort event
btnSort.addEventListener("click", function () {
  displayMovement(currentAccount, !sort);
  sort = !sort;
});
