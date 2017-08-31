import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter, Route} from 'react-router-dom'
import Header from './header'
import Listings from './listings'

class App extends React.Component {
   constructor(props){
      super(props)
   }

   render(){
      return (
         <BrowserRouter>
            <Base>
               <Route to="/" render={() => (
                  <Listings />
               )}/>
            </Base>
         </BrowserRouter>
      )
   }
}

class Base extends React.Component {
   constructor(props) {
      super(props)
   }

   render() {
      return (
         <div>
            <Header />
            {this.props.children}
         </div>
      )
   }
}

function init(){
   ReactDOM.render(
      <App />,
      document.querySelector('#root')
   )
}

init()
