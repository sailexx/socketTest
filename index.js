const WebSocket = require('ws');
const prompt = require('prompt-sync')({ sigint: true });

const SERVER_URL = 'ws://localhost';

let wsArr = [];
let msg = "";
let errorMsg = "";


const connectionNumber = Number(prompt('Enter MAX_CONNECTIONS: '));
const MAX_CONNECTIONS = isNaN(connectionNumber) || connectionNumber === 0
  ? 600
  : connectionNumber;

const intervalId = setInterval(() => {
  if (wsArr.length >= MAX_CONNECTIONS) {
    return clearInterval(intervalId);
  }

  const id = wsArr.length;
  const ws = new WebSocket(SERVER_URL);
  const wo = createWebSocket(id, ws);

  wsArr.push(wo);

  // setInterval(() => {
  //   if (wo.ws.readyState !== WebSocket.OPEN) {
  //     console.log('Retrying the connection..');
  //     const newWs = new WebSocket(SERVER_URL);
  //     const newWo = createWebSocket(wo.id, newWs);
  //     wsArr[id] = newWo; // update the wsArr array with the new WebSocket object
  //   }
  // }, MAX_CONNECTIONS * 100);

}, 100);


function createWebSocket(id, ws) {
  const wo = { id, ws, newMsg: "", errMsg: "", hasError: false };

  ws.on('open', () => { });

  ws.on('message', (message) => {
    wo.hasError = false;
    wo.newMsg = message.toString();
    if (msg !== message.toString()) {
      msg = message.toString();

    }
  });

  ws.on('error', (error) => {
    wo.hasError = true;
    wo.errMsg = error.toString();
    if (errorMsg !== error.toString()) {
      errorMsg = error.toString();
    }
  });

  ws.on('close', () => { });

  return wo;

}











setInterval(() => {
  console.clear();
  console.log("Received MSG        : " + msg);
  console.log("Is all the msg same : " + allSame(wsArr.map((w) => w.newMsg)));
  console.log("total ws count  : " + wsArr.length);
  console.log(" ")

  console.log("all msg data: ")

  printCount(wsArr.map((w) => w.newMsg));
  console.log(" ")
  console.log("all error datas: ")

  printCount(wsArr.map((w) => w.errMsg));
}, 50);

function removeClient(wo) {
  // wsArr = wsArr.filter((item) => item !== wo);

}

process.on('SIGINT', () => {
  console.log('Closing all connections');
  wsArr.forEach((wo) => wo.ws.close());
  process.exit();
});

function allSame(arr) {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] !== arr[0]) {
      return false;
    }
  }
  return true;
}

function printCount(arr) {
  const countMap = {};
  for (const item of arr) {
    countMap[item] = countMap[item] ? countMap[item] + 1 : 1;
  }
  for (const [item, count] of Object.entries(countMap)) {
    if(item !== "") console.log(`${item} * ${count}`);
  }
}

