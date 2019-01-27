import React from 'react'

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    CameraRoll,
    TouchableHighlight,
    NativeModules,
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    imageGrid: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    image: {
        width: 100,
        height: 100,
        margin: 10,
    }
});

export default class reactImageProject extends React.Component{

    
        state = {
            images: [],
            selected: '',
        };

    componentDidMount() {
        const fetchParams = {
            // first: 50,
        };
        CameraRoll.getPhotos(fetchParams).then(r=>{
          this.storeImages(r)
        })
        console.log(this.state)
    }

    storeImages(data) {
        const assets = data.edges;
        const images = assets.map((asset) => asset.node.image);
        this.setState({
            images: images,
        });
    }
   
    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.imageGrid}>
                { this.state.images.map((image) => {
                    return (
                        <TouchableHighlight 
                          onPress={()=> console.log('eee')}
                        >
                        <Image
                          style={styles.image}
                          source={{ uri: image.uri }}
                          />
                        </TouchableHighlight>
                    );
                    })
                }
                </View>
            </ScrollView>
        );
    }
  }

AppRegistry.registerComponent('reactImageProject', () => reactImageProject);