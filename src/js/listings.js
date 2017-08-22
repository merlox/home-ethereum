import React from 'react'
import './../stylus/index.styl'

class Listings extends React.Component {
   constructor(props){
      super(props)
   }

   render(){
      return (
         <div>
            Here goes the listings
            <div ref="listing-nodes">{this.props.listingNodes}</div>
         </div>
      )
   }
}

function Listing(props){
      return (
      <div className="listing">
         <img className="image-house" src={`./../img/${props.source}`}/>
         <h3>Title of the listing</h3>
         <b>95€</b><span>Location, Country</span>
      </div>
   )
}

export default Listings
export {Listing}
