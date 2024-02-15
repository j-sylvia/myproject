import React, {useState} from "react";

function Todo(){
    var [input,setInput] = useState("");

    function add(){
    // var inp=event.target.value;
    alert(input);

    
    }
    function remove(){
        setInput("");
        // input=" ";
        alert("removed"); 
    }

    return (
        <div>        
            <input type="text" value={input} onChange={(e)=>setInput(e.target.value)}/>
            <button onClick={add}>+</button>
            <button onClick={remove}>-</button>
            {/* <h3>{input}</h3> */}
        </div>
    )
}
export default Todo;