/* idb.js: indexedDB database to provide offline functionality */
let db;
const request = indexedDB.open("budget_tracker", 1);

request.onupgradeneeded = event => {
    const db = event.target.result;

    db.createObjectStore("budget_transaction", { autoIncrement: true });
};

request.onsuccess = event => {
    db = event.target.result;

    // check if app is online, if yes send all local db data to api
    if (navigator.onLine) {
        uploadTransactions();
    }
};

request.onerror = event => {
    console.log(event.target.errorCode);
};


// save a record of offline transaction
const saveRecord = record => {
    // open a transaction on the db and access object store
    const transaction = db.transaction(["budget_transaction"], "readwrite");
    const budgetObjectStore = transaction.objectStore("budget_transaction");

    // add record to the store
    budgetObjectStore.add(record);
};


// upload transactions when going back online
const uploadTransactions = () => {
    // open a transaction on the db and access object store
    const transaction = db.transaction(["budget_transaction"], "readwrite");
    const budgetObjectStore = transaction.objectStore("budget_transaction");

    // get all records from store
    const getAll = budgetObjectStore.getAll();

    // if successful, send to api using the bulk post endpoint
    getAll.onsuccess = () => {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
                .then(response => response.json())
                .then(serverResponse => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse);
                    }
                    
                    // if successful, clear all items in store
                    const transaction = db.transaction(["budget_transaction"], "readwrite");
                    const budgetObjectStore = transaction.objectStore("budget_transaction");
                    budgetObjectStore.clear();
                })
                .catch(err => console.log(err));
        }
    };
}

// listen for app coming back online
window.addEventListener("online", uploadTransactions);
