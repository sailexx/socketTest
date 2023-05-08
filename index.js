const WebSocket = require('ws');


const CONNECTION_TIMEOUT = 5000;
// const SERVER_URL = 'wss://trd1.dev.ncv.jp/ws';
const SERVER_URL = 'ws://127.0.0.1:8080';
let MAX_CONNECTIONS = 200;
let wsArr = [];
let count  = 0;
var msg = "";
var id = "";
var inc = 200;
var errMsg = ""
var errMsgId = ""

let intervalId = setInterval(() => {
  if (wsArr.length >= MAX_CONNECTIONS) {
    count++;
    if(count > 100){
      MAX_CONNECTIONS = MAX_CONNECTIONS + inc
      count = 0
    }
    return;
  }

  const wo = addNewClient();
  wsArr.push(wo);

  wo.ws.on('open', () => {});

  wo.ws.on('close', () => {
    removeClient(wo);});

  wo.ws.on('message', (message) => {
    wo.newMsg =  message.toString();
    wo.newMsg = message.toString();
    if(msg !== message.toString()){
        msg = message.toString();
        id = wo.id + "";
    }
  });

  wo.ws.on('error', (error) => {
    inc = 1
    removeClient(wo);
    errMsgId = wo.id + "";
    errMsg = error.toString();    
  });
}, 100);

setInterval(() => { 
  console.clear()
  console.log("msg from ws id  : " + id + "\n" + 
              "Received MSG    : " + msg)
  console.log("total ws count  : "+ wsArr.length)
  console.log("error MsgId     : "+ errMsgId)
  console.log("error Msg       : "+ errMsg)
}, 100);

function addNewClient() {
  const id = wsArr.length;
  const ws = new WebSocket(SERVER_URL);
  return { id:id, ws:ws , newMsg: ""};
}

function removeClient(wo) {
  wsArr = wsArr.filter((item) => item !== wo);
}

process.on('SIGINT', () => {
  console.log('Closing all connections');
  wsArr.forEach((wo) => wo.ws.close());
  process.exit();
});
