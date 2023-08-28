
import {} from "react"
import {TreeNode} from "./tree"
import { HierarchyPointNode } from "d3"
import { config, useSpring, useSprings,animated } from "@react-spring/web"

type Props = {
  data:HierarchyPointNode<TreeNode<string>>[],
  x0:number,
  y0:number,
  // stylesProps:any

}

interface cords {x:number,y:number}

  function diagonal(s:cords,d:cords | null){
            // const path = `M ${s.x} ${s.y}
            // C ${(s.x + d.x) / 2} ${s.y},
            //   ${(s.x + d.x) / 2} ${d.y},
            //   ${d.x} ${d.y}`
          const path =`M ${s.x} ${s.y} L ${d!.x} ${d!.y}`

            return path;
        }
function LinkOfTree({data,x0,y0}:Props){
    
  const tempObjpath = {x:x0,y:y0}
  const springs = useSprings(
    data.length
    ,data.map((ele,i)=>({
      from:{d:diagonal(tempObjpath,tempObjpath)},
      to:{d:diagonal(ele,ele.parent)},
      config:config.molasses
    }))
  )
  
  return springs.map((spring,i)=><animated.path key={i} className={isNaN(Number(data[i].data.value))?`link hidden`:`link`} d={spring.d}></animated.path>)
}
export default LinkOfTree
