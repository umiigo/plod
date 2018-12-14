import React, { Component } from 'react'
import { View, Text, Dimensions, Image, ScrollView } from 'react-native'
import { Button, Icon } from 'native-base'


const {width, height} = Dimensions.get('window')

const PLACEHOLDER = "https://www.westland.net/venice/images/birdseye.jpg"

export default class Deleted extends Component {
  state = {
    deletedImages: [],
    unselectedImages: [],
    isReady: false,
  }

  componentWillMount = () => {
    let splitedImages = this.splitImagesIntoSubArray(this.props.deletedImages, 3)
    this.setState({deletedImages: splitedImages}, () => this.setState({isReady: true}))
  }

  onRemovePress = (target) => {
    this.setState({unselectedImages: [...this.state.unselectedImages, target]})
  }

  onInsertPress = (target) => {
    let result = this.state.unselectedImages.filter(image => image.node.image.uri !== target.node.image.uri)
    this.setState({unselectedImages: result})
  }

  isSelected = (target) => {
    let result = this.state.unselectedImages.filter(image => image.node.image.uri === target.node.image.uri)
    return result.length >= 1 ? false : true
  }

  splitImagesIntoSubArray = (arr, count) => {
    var newArray = []
    while (arr.length > 0) {
      newArray.push(arr.splice(0, count))
    }
    return newArray
  }

  render = () => {
    let { deletedImages, isReady } = this.state
    if (isReady) {
      return(
        <View style={styles.container}>
          <ScrollView style={styles.gridContainer}>
            {deletedImages.map(gridOfImages =>
              <View key={gridOfImages.length} style={{flexDirection: 'row'}}>
                {gridOfImages.map(image =>
                  <Button onPress={() => this.isSelected(image) ? this.onRemovePress(image) : this.onInsertPress(image)} key={image.node.image.uri} transparent style={{width: '30%', height: 108, margin: 8, marginRight: 4}}>
                    <Image source={{uri: image.node.image.uri }} style={{width: '100%', height: 108, borderWidth: 2, borderColor: 'grey', borderRadius: 2}}/>
                    {this.isSelected(image) ? <Icon name="ios-checkmark-circle" style={{ position: 'absolute', left: '25%'}}/> : null}
                  </Button>
                )}
              </View>
            )}
          </ScrollView>

           <Button transparent style={styles.addButton}>
             <Icon name="ios-trash-outline" style={styles.icon}/>
             <Text style={styles.addText}>Delete Photos</Text>
           </Button>
        </View>
      )
    } else {
      return null
    }
  }
}



const styles = {
  container: {
    width: width,
    height: height * 0.85
  },
  addButton: {
    width: '50%',
    height: 50,
    backgroundColor: 'red',
    justifyContent: 'flex-start',
    alignSelf: 'center'
  },
  icon: {
    color: '#fff',
    marginRight: 8,
    marginLeft: 24
  },
  addText: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 18
  },
  gridContainer: {
    width: width,
    height: height * 0.3,
    backgroundColor: 'lightgray',
    marginBottom: 24
  }
}
