import React, { Component } from 'react'
import {Button, Text} from 'native-base';


export default class AddAlbumButton extends Component {

state={
    loading: false
}

handleClick=()=>{
    this.props.incrementNumberOfImages(10)
    this.setState({loading: true})
    this.props.getAlbumImages().then(()=>this.setState({loading:false}))
}

  render() {
    return (
        <Button full info onPress={()=>this.handleClick()}>
            <Text>
                {this.state.loading? "loading..." : "Load next 10"}
            </Text>
        </Button>
    )
  }
}

