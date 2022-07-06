let db;

const request = indexedDB.open("transaction", 1);

request.onupgradeneeded = function (e) {
  const db = e.target.result;
  db.createObjectStore("new_transaction", { autoIncrement: true });
};

request.onsuccess = function (e) {
  db = e.target.result;

  if (navigator.onLine) {
    uploadTransaction();
  }
};

request.onerror = function (e) {
  console.log(e.target.errorCode);
};

function saveRecord(record) {
  const sess = db.transaction(["new_transaction"], "readwrite");

  const transactionObjectStore = sess.objectStore("new_transaction");

  transactionObjectStore.add(record);
}

function uploadTransaction() {
  const sess = db.transaction(["new_transaction"], "readwrite");

  const transactionObjectStore = sess.objectStore("new_transaction");

  const getAll = transactionObjectStore.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((serverRes) => {
          if (serverRes.message) {
            throw new Error(serverRes);
          }

          const sess = db.transaction(["new_transaction"], "readwrite");
          const transactionObjectStore = sess.objectStore("new_transaction");
          transactionObjectStore.clear();
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };
}

window.addEventListener("online", uploadTransaction);
