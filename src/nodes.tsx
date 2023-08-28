import { useMemo } from "react"
import {TreeNode} from "./tree"
import { HierarchyPointNode} from "d3"
import { config, useSpring, useSprings,animated } from "@react-spring/web"

type Props = {
  data:HierarchyPointNode<TreeNode<string>>[],
  treeData:HierarchyPointNode<TreeNode<string>>,
  x0:number,
  y0:number,
  pathNode?:string
  // stylesProps:any

}
function pathRecursive(node:HierarchyPointNode<TreeNode<string>>,pathStr:string[]){
  const direction = pathStr.shift()

  if (direction == undefined){
    return node.data.value
  }
  if(direction == "0"){
    
    node = node.children![0]
  }
  if (direction == "1"){
    node = node.children![1]
  }
  
  return pathRecursive(node,pathStr)
}
function NodeOfTree({data,treeData,x0,y0,pathNode}:Props){
   

  // console.log(currentNode)
  console.log(data);
  console.log(treeData)
  console.log(pathNode)
  let currentNode:string
  if(pathNode !== undefined){
  console.log("GAA")
  currentNode = pathRecursive(treeData,pathNode!.split(""))
    console.log(currentNode)
  }

  else{
   currentNode = ""
  }

  // treeData.children![0].data.value = "100"
  const springs = useSprings(
    data.length
    ,data.map((ele,i)=>({
      from:{r:0.001,transform:`translate(${x0},${y0})`,stroke: "black",fill:"#fff"},
    to:{r:15,transform:`translate(${ele.x},${ele.y})`,stroke: (ele.data.value) == currentNode ? "green":"black" ,fill:(ele.data.value) == currentNode ? "gray":"#fff"},
      config:config.molasses
    }))
  )
  
  // const nodes = useMemo(()=>,[])

  return springs.map((spring,i)=><animated.g className="node" transform={spring.transform} key={i}>
    <animated.circle className={isNaN(Number(data[i].data.value))?`node hidden`:`node`} r={spring.r} stroke={spring.stroke} fill={spring.fill}></animated.circle><text  x="0" y="1"  alignmentBaseline="middle" textAnchor="middle"> { isNaN(Number(data[i].data.value))? " ":data[i].data.value}</text></animated.g>)
}
export default NodeOfTree
