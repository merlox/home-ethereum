import React from 'react'
import ReactDOM from 'react-dom'
import Header from './header'
import Listings from './listings'
import {Listing} from './listings'

class App extends React.Component {
   constructor(props){
      super(props)

      this.state = {
         listingNodes: [],
      }
   }

   componentDidMount(){
      this.generateListings.bind(this)()
   }

   generateListings(){
      let nodes = []

      for(let i = 1; i < 6; i++){
         let src = `${i}.jpg`
         nodes.push(<Listing key={src} source={src}/>)
      }

      this.setState({
         listingNodes: nodes
      })
   }

   render(){
      return (
         <div>
            <Header {...this.state} />
            <Listings {...this.state} />
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
