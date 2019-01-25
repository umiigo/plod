import React, { Component } from 'react'
import {Button, Text} from 'native-base';


export default class AddAlbumButton extends Component {


handleClick=()=>{
    this.props.incrementNumberOfImages(10)
    this.props.getAlbumImages()
}

  render() {
    return (
        <Button full info onPress={()=>this.handleClick()}>
            <Text>
                ADD ALBUM
            </Text>
        </Button>
    )
  }
}

