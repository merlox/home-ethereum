import React from 'react'
import './../stylus/listings.styl'

class Listings extends React.Component {
   constructor(props){
      super(props)
   }

   render(){
      let nodes = []

      for(let i = 1; i < 6; i++){
         let images = []

         for(let j = 1; j < 6; j++){
            images.push(`./../img/${j}.jpg`)
         }

         nodes.push(<Listing key={i} images={images}/>)
      }

      return (
         <div>
            Here goes the listings
            <div ref="listing-nodes">{nodes}</div>
         </div>
      )
   }
}

class Listing extends React.Component {
   constructor(props){
      super(props)

      this.state = {
         activeImage: 1, // Usamos un array que empieza desde 1 y lo restamos en el render
         images: this.props.images,
         animation: false,
      }
   }

   nextImage(increase){
      if(increase){

         // If we are in the last image go to the first one
         if(this.state.activeImage >= this.state.images.length)
            this.setState({
               activeImage: 1,
               animation: !this.state.animation,
            })
         else
            this.setState({
               activeImage: this.state.activeImage + 1,
               animation: !this.state.animation,
            })
      }else{

         // If we are in the first image go to the last
         if(this.state.activeImage === 1)
            this.setState({
               activeImage: this.state.images.length,
               animation: !this.state.animation,
            })
         else
            this.setState({
               activeImage: this.state.activeImage - 1,
               animation: !this.state.animation,
            })
      }
   }

   render() {
      return (
         <div className="listing">
            <div className="listing-images-container">
               <img
                  className={this.state.animation ? 'animate-image' : 'animate-image2' }
                  src={this.props.images[this.state.activeImage - 1]} />
               <div
                  className="listing-arrow listing-arrow-back"
                  onClick={() => this.nextImage(false)}
               ></div>
               <div
                  className="listing-arrow listing-arrow-next"
                  onClick={() => this.nextImage(true)}
               ></div>
            </div>
            <h3>Title of the listing</h3>
            <p><b>95€</b> Location, Country</p>
         </div>
      )
   }
}

export default Listings
export {Listing}
