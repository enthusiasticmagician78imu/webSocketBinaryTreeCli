import { hierarchy, select, tree, HierarchyPointNode,HierarchyNode } from "d3";
import { useEffect, useRef, useState } from "react";
import NodeOfTree from "./nodes";
import LinkOfTree from "./links";

export class TreeNode<T> {
  value: T;
  left?: TreeNode<T>;
  right?: TreeNode<T>;
  // children?: TreeNode<T>[];
  constructor(value: T) {
    this.value = value;
  }
}
var margin = { top: 50, bottom: 80 },
  width = 800,
  height = 800 - margin.top - margin.bottom;
type Props = {
  data: TreeNode<string>;
  PathNode?:string
};

function myXOR<T>(a?: TreeNode<T>, b?: TreeNode<T>) {
  return (a || b) && !(a && b);
}
function BinaryTreeGraph({ data ,PathNode}: Props) {
  // const svgRef = useRef<SVGSVGElement>(null);
  // const [i,setI] = useState()
  // useEffect(() => {
    // const svg = select(svgRef.current);
    // svg
    //   .attr("height", height + margin.top + margin.bottom)
    //   .attr("viewBox", "0 0 400 400")
    //   .append("g")
    //   .attr("transform", "translate(0," + margin.top + ")");
    const treeLayout = tree<TreeNode<string>>().size([width, height]);

    interface ga extends TreeNode<string> {
      children?: TreeNode<string>[];
      
    }
    const root = hierarchy(data, function (d:ga) {
      d.children = [];
      if (d.left) {
        d.children.push(d.left);
        if (myXOR<string>(d.left, d.right)) {
          d.children.push(new TreeNode("e"));
        }
      }
      if (d.right) {
        if (myXOR<string>(d.left, d.right)) {
          d.children.push(new TreeNode("e"));
        }
      
        d.children.push(d.right);
      }
      return d.children;
    });
    // console.log(root)
    // root.x0 = width / 2;
    // root.y0 = 0;
    const initialCordsX = width / 2
    const initialCordsY = 0
    
    const treeData = treeLayout(root);

  
    const nodes = treeData.descendants();

    const links = treeData.descendants().slice(1);

    nodes.forEach(function (d) {
      d.y = d.depth * 100;
    });

    //nodes
   // const node= svg
   //    .selectAll("g.node")
   //    .data(nodes as HierarchyPointNode<TreeNode<string>>[])


    // const nodeEnter = node.enter()
    //   .append("g")
    //   .attr("class", "node")
    //   .attr("transform", function(d){
    //                          return "translate(" + root.x0 + "," + root.y0 + ")";
                         // })
//     nodeEnter
//       .append("circle")
//       .attr("class", function (d) {
//         if (isNaN(d.value!)) {
//           return "node hidden";
//         }
//         return "node";
//       })
//       .attr("r", 1e-6)
//       .style("fill", function (d) {
//         return d.children ? "lightsteelblue" : "#fff";
//       });

// nodeEnter.append('text')
//             .attr("dy", ".35em")
//             .text(function(d){ return d.data.value; });
     // var nodeUpdate = nodeEnter.merge(node);
//   
   // nodeUpdate.transition()
   //          .duration(750)
   //          .attr("transform", function(d) {
   //              return "translate(" + d.x + "," + d.y + ")";
   //          });
//     nodeUpdate.select('circle.node')
//             .attr('r', 10)
//             .style("fill", function(d){
//                 return d.children ? "lightsteelblue" : "#fff";
//             })
//             .attr('cursor', 'pointer');

  // }, [data]);

  return (
    <div className="tree">
      <svg height={height + margin.top + margin.bottom + 500} width={width}  >
      <g  transform={`translate(0,${margin.top})`}>
      <LinkOfTree data={links} x0={initialCordsX} y0={initialCordsY}/>
      <NodeOfTree data={nodes} treeData={treeData} x0={initialCordsX} y0={initialCordsY} pathNode={PathNode}/>
      </g>
      </svg>
    </div>
  );
}

export default BinaryTreeGraph;
