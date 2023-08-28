import { useEffect } from "react"
import { config, useSpring, useSprings,animated } from "@react-spring/web"
interface mess {
  key:string
  value:string
}
type Props = {
  message:mess
}
function DataFrame({message}:Props){

  const [fadein,set] = useSpring(()=>({opacity:0}))

  useEffect(()=>{
    set({opacity:1,from:{opacity:0}})
  },[set,message])
  return(
  <div >
      {message.key}: <animated.span style={fadein}>{message.value}</animated.span>
    </div>
  )
}

export default DataFrame
