import { Constants } from 'expo';
import isIPhoneX from 'react-native-is-iphonex';
import {  StyleSheet, Dimensions,} from 'react-native'

export const landmarkSizeCameraNew = 2
export const {width, height} = Dimensions.get('window')

export const styles = StyleSheet.create({
    slideDefault: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB'
    },
    slideSwipe: {
        flex: 1,
        backgroundColor: 'white'
    },
    slideSwipeOk: {
        flex: 1,
        backgroundColor: '#9DD6EB'
    },
    slideSwipeListAlbum: {
        flex: 1,
        backgroundColor: '#9DD6EB'
    },
    text: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold'
    },
    containero: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    card: {
        position: 'absolute',
        width: width - 20,
        height: height * 0.7,
        top: (height * 0.02) / 2,
        overflow: 'hidden',
        backgroundColor: 'white',
        margin: 10,
        borderWidth: 1,
        borderColor: 'lightgrey',
        borderRadius: 8,
    },
    camera: {
        flex: 1,
        justifyContent: 'space-between',
    },
    topBar: {
        flex: 0.2,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: Constants.statusBarHeight / 2,
    },
    bottomBar: {
        paddingBottom: isIPhoneX ? 25 : 5,
        backgroundColor: 'transparent',
        alignSelf: 'flex-end',
        justifyContent: 'space-between',
        flex: 0.12,
        flexDirection: 'row',
    },
    noPermissions: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    gallery: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    toggleButton: {
        flex: 0.25,
        height: 40,
        marginHorizontal: 2,
        marginBottom: 10,
        marginTop: 20,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    autoFocusLabel: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    bottomButton: {
        flex: 0.3,
        height: 58,
        justifyContent: 'center',
        alignItems: 'center',
    },
    newPhotosDot: {
        position: 'absolute',
        top: 0,
        right: -5,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4630EB'
    },
    options: {
        position: 'absolute',
        bottom: 80,
        left: 30,
        width: 200,
        height: 160,
        backgroundColor: '#000000BA',
        borderRadius: 4,
        padding: 10,
    },
    detectors: {
        flex: 0.5,
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
    },
    pictureQualityLabel: {
        fontSize: 10,
        marginVertical: 3,
        color: 'white'
    },
    pictureSizeContainer: {
        flex: 0.5,
        alignItems: 'center',
        paddingTop: 10,
    },
    pictureSizeChooser: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    pictureSizeLabel: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    facesContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        top: 0,
    },
    face: {
        padding: 10,
        borderWidth: 2,
        borderRadius: 2,
        position: 'absolute',
        borderColor: '#FFD700',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    landmark: {
        width: landmarkSizeCameraNew,
        height: landmarkSizeCameraNew,
        position: 'absolute',
        backgroundColor: 'red',
    },
    faceText: {
        color: '#FFD700',
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10,
        backgroundColor: 'transparent',
    },
    row: {
        flexDirection: 'row',
    }
})