const WebSocket = require('ws');
const prompt = require('prompt-sync')({ sigint: true });



let wsArr = [];
let msg = "";
let errorMsg = "";

const contentId = Number(prompt('Enter content Id: '));

const SERVER_URL = `wss://socket1.test.dev.ncv.jp/socket/general/${contentId}/-/`;


const connectionNumber = Number(prompt('Enter MAX_CONNECTIONS: '));
const MAX_CONNECTIONS = isNaN(connectionNumber) || connectionNumber === 0
  ? 600
  : connectionNumber;

const initConnectionNumber = Number(prompt('Enter Initial Connection: '));
const INIT_CONNECTIONS = isNaN(initConnectionNumber) || initConnectionNumber === 0
  ? 0
  : initConnectionNumber;

  const addDuration = Number(prompt('Enter Socket Add Interval in ms: '));
  const ADD_INTERVAL = isNaN(addDuration) || addDuration === 0
    ? 1000
    : addDuration;


  const refreshInterval = Number(prompt('Enter Msg Refresh interval in ms: '));
  const REFRESH_INTERVAL = isNaN(refreshInterval) || refreshInterval === 0
    ? 500
    : refreshInterval;



  for(var i = 0; i < INIT_CONNECTIONS; i++){
    const id = wsArr.length;
    const ws = new WebSocket(SERVER_URL);
    const wo = createWebSocket(id, ws);
  
    wsArr.push(wo);
  
  }
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

}, ADD_INTERVAL);


function createWebSocket(id, ws) {
  const wo = { id, ws, newMsg: "", errMsg: "", hasError: false };

  ws.on('open', () => { });

  ws.on('message', (message) => {
    wo.hasError = false;
        wo.errMsg = "";
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

  ws.on('close', () => { 
    removeClient(wo);
  });

  return wo;

}

function removeClient(wo) {
  wsArr = wsArr.filter((item) => item !== wo);
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
}, REFRESH_INTERVAL);

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
