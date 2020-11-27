import React, { useState } from 'react'

 const App = () => {

  let[data,setData] = useState({  //Desctructuring
    email: '',
    password: '' 
  });

  const onChange = e =>{
    console.log(e);
    //setData({  });
  }


  return (
    <div>
       <label for="">E-mail</label>
       <br/>
      <input onChange={(e) => onChange(e)} type="email" />
      <br/>
      <label>Password</label>
      <br/>
      <input onChange={(e) => onChange(e)} type="password" />
      <br/>
      <button>
        Enviar
      </button>
    </div>
  )
}

export default App;


