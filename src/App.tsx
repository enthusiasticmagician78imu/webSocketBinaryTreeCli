import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import * as d3 from "d3";
import "./App.css";
import BinaryTreeGraph from "./tree";

import useWebSocket, { ReadyState } from "react-use-websocket";
import DataFrame from "./dataFrame";
class TreeNode<T> {
  value: T;
  left?: TreeNode<T>;
  right?: TreeNode<T>;
  // children?: TreeNode<T>[];
  constructor(value: T) {
    this.value = value;
  }
}
// function toNodes(obj:any){
//    const node= new TreeNode(obj["value"])
// }

function deserializeTree(data: string) {
  const deque: string[] = data.split(",");
  console.log(deque);
  function preorder(): TreeNode<string> | undefined {
    const s = deque.shift()!;
    if (s == "n") {
      return undefined;
    }
    const root = new TreeNode(s);
    root.left = preorder();
    root.right = preorder();
    return root;
  }
  return preorder();
}

interface mess {
  key: string;
  value: string;
}

function App() {
  const [data, setData] = useState<TreeNode<string>>();
  const [node, setNode] = useState<string>();
  const [message, setMessage] = useState<mess[]>([]);
  const [textInput, setTextInput] = useState("Hallo");
  console.log("render");
  const onChangeInput = useCallback(
    (e) => {
      setTextInput(e.target.value);
    },
    [textInput]
  );

  const [socketUrl, setSocketUrl] = useState("ws://localhost:8000");
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    onOpen: () => {
      sendMessage("tree");
    },
    onMessage: (event) => {
      const recieveData = JSON.parse(event.data);
      if (recieveData["stage"] == "initial") {
        setData(deserializeTree(recieveData["data"]));
      }
      if (recieveData["stage"] == "node") {
        console.log(recieveData);
        setNode(recieveData["data"]);
      }
      if (recieveData["stage"] == "message") {
        console.log(event);
        for (const [keyy, value] of Object.entries(
          recieveData["data"] as { [key: string]: string }
        )) {

           const resIdx = message!.findIndex((ele) => ele.key == keyy);
          if (resIdx == -1) {
            setMessage([...message!, { key: keyy, value: value }]);
          } else {
            const nextMessage = message!.map((c, i) => {
              if (i == resIdx) {
                return { ...c, value: value };
              } else {
                return c;
              }
            });
            setMessage(nextMessage);
          }
        }
      }
    },
  });
  // const [isOnline, setIsOnline] = useState(false);
  // const [textValue, setTextValue] = useState("");

  // const webSocket = useRef<WebSocket | null>(null);

  const handleClickSendMessage = useCallback(
    () => sendMessage(textInput),
    [textInput]
  );

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];
  // async function connection(socket:WebSocket, timeout = 10000) {
  //   const isOpened = () => socket.readyState === WebSocket.OPEN;

  //   if (socket.readyState !== WebSocket.CONNECTING) {
  //     return isOpened();
  //   } else {
  //     const intrasleep = 100;
  //     const ttl = timeout / intrasleep; // time to loop
  //     let loop = 0;
  //     while (socket.readyState === WebSocket.CONNECTING && loop < ttl) {
  //       await new Promise((resolve) => setTimeout(resolve, intrasleep));
  //       loop++;
  //     }
  //     return isOpened();
  //   }
  // }
  // useEffect(() => {
  //   (async () => {
  //     const opened = await connection(webSocket.current!);
  //     if (opened) {
  //       webSocket.current!.send("tree");
  //       webSocket.current!.onmessage =       }
  //   })();
  // }, []);

  const arbol = useMemo(
    () => <BinaryTreeGraph data={data!} PathNode={node}></BinaryTreeGraph>,
    [data, setData, node]
  );
  return (
    <div style={{ width: "1200px" }}>
      <input onChange={onChangeInput} value={textInput} />
      <button onClick={handleClickSendMessage}>Hit</button>
      <div className="marco">
      <div className="frameText">{message &&message.map(ele=><DataFrame message={ele}/>)}</div>
      {data && arbol}
      </div>
    </div>
  );
}

export default App;
