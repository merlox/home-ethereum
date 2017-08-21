import React from 'react'
import ReactDOM from 'react-dom'

class App extends React.Component {
   constructor(props){
      super(props)
   }

   render(){
      return ()
   }
}

function init(){
   const div = document.createElement('div')
   div.id = 'root'
   document.appendChild(div)

   ReactDOM.render(
      <App />,
      document.querySelector('#root')
   )
}

init()
