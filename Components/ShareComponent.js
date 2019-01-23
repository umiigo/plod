import React, { Component } from 'react';
import { Linking, Button, View, StyleSheet } from 'react-native';
import { Constants, ImagePicker } from 'expo';

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Button title="Open camera roll" onPress={this._openCameraRoll} />
      </View>
    );
  }

  _openCameraRoll = async () => {
    let image = await ImagePicker.launchImageLibraryAsync();
    let { origURL } = image;
    let encodedURL = encodeURIComponent(origURL);
    let instagramURL = `instagram://library?AssetPath=${encodedURL}`;
    Linking.openURL(instagramURL);
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
});
