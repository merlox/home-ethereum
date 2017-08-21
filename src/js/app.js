import React from 'react'
import ReactDOM from 'react-dom'
import './../css/index.css'

class App extends React.Component {
   constructor(props){
      super(props)
   }

   render(){
      return (<div>Hi</div>)
   }
}

function init(){
   const div = document.createElement('div')
   div.id = 'root'
   document.body.appendChild(div)

   ReactDOM.render(
      <App />,
      document.querySelector('#root')
   )
}

init()
