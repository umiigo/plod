import { Constants, Camera, FileSystem, Permissions, BarCodeScanner, MediaLibrary,  } from 'expo';
import React from 'react';
import * as styles from '../styles'

import {
  Component,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Slider,
  Platform
} from 'react-native';
import { Container, Content, Header, Item, Icon, Input, Button, Label } from 'native-base'
import { throws } from "assert";
import { white } from 'ansi-colors';
// import GalleryScreen from './GalleryScreen';

import { 
  Ionicons,
  MaterialIcons,
  Foundation,
  MaterialCommunityIcons,
  Octicons
} from '@expo/vector-icons';

const flashModeOrder = {
  off: 'on',
  on: 'auto',
  auto: 'torch',
  torch: 'off',
};

const flashIcons = {
  off: 'flash-off',
  on: 'flash-on',
  auto: 'flash-auto',
  torch: 'highlight'
};

const wbOrder = {
  auto: 'sunny',
  sunny: 'cloudy',
  cloudy: 'shadow',
  shadow: 'fluorescent',
  fluorescent: 'incandescent',
  incandescent: 'auto',
};

const wbIcons = {
  auto: 'wb-auto',
  sunny: 'wb-sunny',
  cloudy: 'wb-cloudy',
  shadow: 'beach-access',
  fluorescent: 'wb-iridescent',
  incandescent: 'wb-incandescent',
};





export default class App extends React.Component {
  state = {
    rollGranted: false,
    cameraGranted: false,
     type: Camera.Constants.Type.back,
    album: false,

    flash: 'off',
    zoom: 0,
    autoFocus: 'on',
    type: 'back',
    whiteBalance: 'auto',
    ratio: '16:9',
    ratios: [],
    barcodeScanning: false,
    faceDetecting: false,
    faces: [],
    newPhotos: false,
    permissionsGranted: false,
    pictureSize: undefined,
    pictureSizes: [],
    pictureSizeId: 0,
    showGallery: false,
    showMoreOptions: false,
  };

  

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA) && await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({ permissionsGranted: status === 'granted' });
  }

 async componentDidMount() {
    this.getCameraPermissions();
     await MediaLibrary.getAlbumAsync('Unsorted').then(resp=>this.setState({unsortedAlbum: resp}))
     !this.state.unsortedAlbum? 
      await MediaLibrary.createAlbumAsync('Unsorted').then(resp=>{
        this.setState({unsortedAlbum: resp})
        this.props.addUnsorted(resp)
    })
        .then(resp=>console.log(resp))
     : console.log(this.state.unsortedAlbum)
  }


  componentWillUpdate(){
      this.getUnsortedAlbum()
  }

  getUnsortedAlbum = () => 
  Expo.MediaLibrary.getAlbumAsync('Unsorted').then(album => this.setState({ album }))
 


  async getCameraPermissions() {
    const { Permissions } = Expo;
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status === 'granted') {
      this.setState({ cameraGranted: true });
      this.setState({permissionsGranted: status === 'granted'});
    } else {
      this.setState({ cameraGranted: false });
      this.setState({permissionsGranted: false});
      console.log('Uh oh! The user has not granted us permission.');
    }
    this.getCameraRollPermissions();
  }

  async getCameraRollPermissions() {
    const { Permissions } = Expo;
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === 'granted') {
      this.setState({ rollGranted: true, permissionsGranted: true })
    } else {
      console.log('Uh oh! The user has not granted us permission.');
      this.setState({ rollGranted: false, permissionsGranted: false  })
    }
  }

  takePictureAndAddToAlbum = async () => {
    const { uri } = await this.camera.takePictureAsync();
    const asset = await MediaLibrary.createAssetAsync(uri);
    const album = await MediaLibrary.getAlbumAsync('Unsorted');
    Expo.MediaLibrary.addAssetsToAlbumAsync(asset, album, false)
    //   .then(() => {
    //     console.log('Photo Taken!')
    //   })
    //   .catch(error => {
    //     Alert.alert('An Error Occurred!')
    //   });
  };

  getRatios = async () => {
    const ratios = await this.camera.getSupportedRatios();
    return ratios;
  };

  toggleView = () => this.setState({ showGallery: !this.state.showGallery, newPhotos: false });

  toggleMoreOptions = () => this.setState({ showMoreOptions: !this.state.showMoreOptions });

  toggleFacing = () => this.setState({ type: this.state.type === 'back' ? 'front' : 'back' });

  toggleFlash = () => this.setState({ flash: flashModeOrder[this.state.flash] });

  setRatio = ratio => this.setState({ ratio });

  toggleWB = () => this.setState({ whiteBalance: wbOrder[this.state.whiteBalance] });

  toggleFocus = () => this.setState({ autoFocus: this.state.autoFocus === 'on' ? 'off' : 'on' });

  zoomOut = () => this.setState({ zoom: this.state.zoom - 0.1 < 0 ? 0 : this.state.zoom - 0.1 });

  zoomIn = () => this.setState({ zoom: this.state.zoom + 0.1 > 1 ? 1 : this.state.zoom + 0.1 });

  setFocusDepth = depth => this.setState({ depth });



  handleMountError = ({ message }) => console.error(message);



  collectPictureSizes = async () => {
    if (this.camera) {
      const pictureSizes = await this.camera.getAvailablePictureSizesAsync(this.state.ratio);
      let pictureSizeId = 0;
      if (Platform.OS === 'ios') {
        pictureSizeId = pictureSizes.indexOf('High');
      } else {
        // returned array is sorted in ascending order - default size is the largest one
        pictureSizeId = pictureSizes.length-1;
      }
      this.setState({ pictureSizes, pictureSizeId, pictureSize: pictureSizes[pictureSizeId] });
    }
  };

  previousPictureSize = () => this.changePictureSize(1);
  nextPictureSize = () => this.changePictureSize(-1);

  changePictureSize = direction => {
    let newId = this.state.pictureSizeId + direction;
    const length = this.state.pictureSizes.length;
    if (newId >= length) {
      newId = 0;
    } else if (newId < 0) {
      newId = length -1;
    }
    this.setState({ pictureSize: this.state.pictureSizes[newId], pictureSizeId: newId });
  }

  renderGallery() {
    return <GalleryScreen onPress={this.toggleView.bind(this)} />;
  }

  renderFace({ bounds, faceID, rollAngle, yawAngle }) {
    return (
      <View
        key={faceID}
        transform={[
          { perspective: 600 },
          { rotateZ: `${rollAngle.toFixed(0)}deg` },
          { rotateY: `${yawAngle.toFixed(0)}deg` },
        ]}
        style={[
          styles.styles.face,
          {
            ...bounds.size,
            left: bounds.origin.x,
            top: bounds.origin.y,
          },
        ]}>
        <Text style={styles.styles.faceText}>ID: {faceID}</Text>
        <Text style={styles.styles.faceText}>rollAngle: {rollAngle.toFixed(0)}</Text>
        <Text style={styles.styles.faceText}>yawAngle: {yawAngle.toFixed(0)}</Text>
      </View>
    );
  }

  renderLandmarksOfFace(face) {
    const renderLandmark = position =>
      position && (
        <View
          style={[
            styles.styles.landmark,
            {
              left: position.x - styles.styles.landmarkSizeCameraNewlandmarkSize / 2,
              top: position.y - styles.styles.landmarkSizeCameraNew / 2,
            },
          ]}
        />
      );
    return (
      <View key={`landmarks-${face.faceID}`}>
        {renderLandmark(face.leftEyePosition)}
        {renderLandmark(face.rightEyePosition)}
        {renderLandmark(face.leftEarPosition)}
        {renderLandmark(face.rightEarPosition)}
        {renderLandmark(face.leftCheekPosition)}
        {renderLandmark(face.rightCheekPosition)}
        {renderLandmark(face.leftMouthPosition)}
        {renderLandmark(face.mouthPosition)}
        {renderLandmark(face.rightMouthPosition)}
        {renderLandmark(face.noseBasePosition)}
        {renderLandmark(face.bottomMouthPosition)}
      </View>
    );
  }

  renderFaces = () => 
    <View style={styles.styles.facesContainer} pointerEvents="none">
      {this.state.faces.map(this.renderFace)}
    </View>

  renderLandmarks = () => 
    <View style={styles.styles.facesContainer} pointerEvents="none">
      {this.state.faces.map(this.renderLandmarksOfFace)}
    </View>

  renderNoPermissions = () => 
    <View style={styles.styles.noPermissions}>
      <Text style={{ color: 'white' }}>
        Camera permissions not granted - cannot open camera preview.
      </Text>
    </View>

  renderTopBar = () => 
    <View
      style={styles.styles.topBar}>
      <TouchableOpacity style={styles.styles.toggleButton} onPress={this.toggleFacing}>
        <Ionicons name="ios-reverse-camera" size={32} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.styles.toggleButton} onPress={this.toggleFlash}>
        <MaterialIcons name={flashIcons[this.state.flash]} size={32} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.styles.toggleButton} onPress={this.toggleWB}>
        <MaterialIcons name={wbIcons[this.state.whiteBalance]} size={32} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.styles.toggleButton} onPress={this.toggleFocus}>
        <Text style={[styles.styles.autoFocusLabel, { color: this.state.autoFocus === 'on' ? "white" : "#6b6b6b" }]}>AF</Text>
      </TouchableOpacity>   
    </View>

  renderBottomBar = () =>
    <View
      style={styles.styles.bottomBar}>
      <View style={{ flex: 0.4 }}>
        <TouchableOpacity
          onPress={this.takePictureAndAddToAlbum}
          style={{ alignSelf: 'center' }}
        >
          <Ionicons name="ios-radio-button-on" size={70} color="white" />
        </TouchableOpacity>
      </View> 
      <TouchableOpacity style={styles.styles.bottomButton}  onPress={this.props.setCardDeckView}>
        <View>
          <Ionicons name="md-photos" size={45} color="white" />
          {this.state.newPhotos && <View style={styles.styles.newPhotosDot}/>}
        </View>
        <View>
          <Label style={{color:'white'}}>{this.state.album && this.state.album.assetCount}</Label>
        </View>
      </TouchableOpacity>
    </View>

  renderMoreOptions = () =>
    (
      <View style={styles.styles.options}>
        {/* <View style={styles.styles.detectors}>
          <TouchableOpacity onPress={this.toggleFaceDetection}>
            <MaterialIcons name="tag-faces" size={32} color={this.state.faceDetecting ? "white" : "#858585" } />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.toggleBarcodeScanning}>
            <MaterialCommunityIcons name="barcode-scan" size={32} color={this.state.barcodeScanning ? "white" : "#858585" } />
          </TouchableOpacity>
        </View> */}

        <View style={styles.styles.pictureSizeContainer}>
          <Text style={styles.styles.pictureQualityLabel}>Picture quality</Text>
          <View style={styles.styles.pictureSizeChooser}>
            <TouchableOpacity onPress={this.previousPictureSize} style={{ padding: 6 }}>
              <Ionicons name="md-arrow-dropleft" size={14} color="white" />
            </TouchableOpacity>
            <View style={styles.styles.pictureSizeLabel}>
              <Text style={{color: 'white'}}>{this.state.pictureSize}</Text>
            </View>
            <TouchableOpacity onPress={this.nextPictureSize} style={{ padding: 6 }}>
              <Ionicons name="md-arrow-dropright" size={14} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View> 
    );

  renderCamera = () =>
    (
      <View style={{ flex: 1 }}>
        <Camera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.styles.camera}
          onCameraReady={this.collectPictureSizes}
          type={this.state.type}
          flashMode={this.state.flash}
          autoFocus={this.state.autoFocus}
          zoom={this.state.zoom}
          whiteBalance={this.state.whiteBalance}
          ratio={this.state.ratio}
          pictureSize={this.state.pictureSize}
          onMountError={this.handleMountError}
          onFacesDetected={this.state.faceDetecting ? this.onFacesDetected : undefined}
          onFaceDetectionError={this.onFaceDetectionError}
          barCodeScannerSettings={{
            barCodeTypes: [
              BarCodeScanner.Constants.BarCodeType.qr,
              BarCodeScanner.Constants.BarCodeType.pdf417,
            ],
          }}
          onBarCodeScanned={this.state.barcodeScanning ? this.onBarCodeScanned : undefined}
          >
          {this.renderTopBar()}
          {this.renderBottomBar()}
        </Camera>
        {this.state.faceDetecting && this.renderFaces()}
        {this.state.faceDetecting && this.renderLandmarks()}
        {this.state.showMoreOptions && this.renderMoreOptions()}
      </View>
    );

  render(){
    const cameraScreenContent = this.state.permissionsGranted
      ? this.renderCamera()
      : this.renderNoPermissions();
    const content = this.state.showGallery ? this.renderGallery() : cameraScreenContent;
    return <View style={styles.styles.container}>{content}</View>;
  }
}

  {/* render() {
    
    return (
      <View style={styles.styles.container}>
        <Camera
          type={Camera.Constants.Type.back}
          style={{ flex: 1 }}
          ref={ref => {
            this.camera = ref;
          }}
        />
    
        <TouchableOpacity
          onPress={() =>
            this.state.permissionsGranted
              ? this.takePictureAndAddToAlbum()
              : Alert.alert('Permissions not granted')
          }
          style={styles.styles.buttonContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, marginBottom: 15, alignItems: 'flex-end' }}>
                      

                            <View style={{ alignItems: 'center' }}>
                                <MaterialCommunityIcons  name="circle-outline"
                                    style={{ color: 'white', fontSize: 100 }}

                                ></MaterialCommunityIcons>
                            </View>
                        

                        </View>
        </TouchableOpacity>
        <TouchableOpacity
         
         

          style={styles.styles.buttonContainer2}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, marginBottom: 15, alignItems: 'flex-end' }}>
                      

                            <View style={{ alignItems: 'center' }}>
                                <Icon name="ios-images" style={{ color: 'white', fontSize: 36 }} />
                            </View>
                        

                        </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={()=>this.props.toggleDeck()}
          style={styles.styles.buttonContainer3}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, marginBottom: 15, alignItems: 'flex-end' }}>
                      

                            <View style={{ alignItems: 'center' }}>
                                <Label style={{ color: "white" }}>{this.state.album.assetCount}</Label>
                            </View>
                        

                        </View>
        </TouchableOpacity>
      </View>
    );
  }
} */}

