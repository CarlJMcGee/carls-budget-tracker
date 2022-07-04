let db;

const request = indexedDB.open("transaction", 1);

request.onupgradeneeded = function (e) {
  const db = e.target.result;
  db.createObjectStore("new_transaction", { autoIncrement: true });
};

request.onsuccess = function (e) {
  db = e.target.result;

  if (navigator.onLine) {
    // uploadTransaction();
    console.log(`uploadTransaction`);
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
