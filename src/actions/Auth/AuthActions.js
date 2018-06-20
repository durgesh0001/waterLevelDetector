import firebase from 'firebase';
import {Actions} from 'react-native-router-flux';
import {Alert} from 'react-native';
import {
    EMAIL_CHANGED,
    RESET_USER,
    CONFIRM_PASSWORD_CHANGED,
    ON_CHANGE_IMAGE_SUCCESS,
    FIRST_NAME_CHANGED,
    FETCH_AUTH_DETAIL_SUCCESS,
    LAST_NAME_CHANGED,
    NAME_CHANGED,
    ON_ADDRESS_CHANGE,
    PASSWORD_CHANGED,
    PHONE_CHANGED,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAIL,
    LOGIN_USER,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_REQUEST
} from '../types'
import RNFetchBlob from 'react-native-fetch-blob';



/*
   @Method : NameChanged
   @Params :
   @Returns : *
   */
export const NameChanged = (text) => {
    return {
        type: NAME_CHANGED,
        payload: text

    }
};


/*
   @Method : emailChanged
   @Params :
   @Returns : *
   */
export const phoneChanged = (text) => {

    return {
        type: PHONE_CHANGED,
        payload: text

    }
};
/*
   @Method : emailChanged
   @Params :
   @Returns : *
   */
export const emailChanged = (text) => {

    return {
        type: EMAIL_CHANGED,
        payload: text

    }
};

/*
   @Method : onAddressChange
   @Params :
   @Returns : *
   */
export const onAddressChange = (text) => {

    return {
        type: ON_ADDRESS_CHANGE,
        payload: text

    }
};

/*
   @Method : passwordChanged
   @Params :
   @Returns : *
   */
export const passwordChanged = (text) => {

    return {
        type: PASSWORD_CHANGED,
        payload: text

    }
};


/*
   @Method : changeProfilePicture
   @Params :
   @Returns : *
   */
export const changeProfilePicture = (imageData) => {
    return (dispatch) => {
        dispatch({type: ON_CHANGE_IMAGE_SUCCESS, payload: imageData.path, loading: false});
    }

};

/*
   @Method : confirmPasswordChanged
   @Params :
   @Returns : *
   */
export const confirmPasswordChanged = (text) => {

    return {
        type: CONFIRM_PASSWORD_CHANGED,
        payload: text

    }
};


/*
   @Method : firstNameChanged
   @Params :
   @Returns : *
   */
export const firstNameChanged = (text) => {

    return {
        type: FIRST_NAME_CHANGED,
        payload: text

    }
};
/*
   @Method : lastNameChanged
   @Params :
   @Returns : *
   */
export const lastNameChanged = (text) => {

    return {
        type: LAST_NAME_CHANGED,
        payload: text

    }
};

/*
   @Method : forgotPassword
   @Params :
   @Returns : *
   */
export const forgotPassword = ({email}) => {
    return (dispatch) => {
        dispatch({type: FORGOT_PASSWORD_REQUEST});

        firebase.auth().sendPasswordResetEmail(email)
            .then(user => {
                Alert.alert('Success', 'Please check mail for reset your password');
                dispatch({type: FORGOT_PASSWORD_SUCCESS});
            })
            .catch(() => {
                Alert.alert('Error', 'Sorry Email does not exits');
                dispatch({type: FORGOT_PASSWORD_SUCCESS});
            })
    };
}

/*
   @Method : registerUser
   @Params :
   @Returns : *
   */
export const registerUser = ({email,password,phone}) => {
    return (dispatch) => {
        dispatch({type: LOGIN_USER});
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(user => {
                firebase.database().ref(`/users`)
                    .push({email,password,phone,id: user.uid, is_online:true,created_at:Date.now(),profile_picture:''})
                    .then(() => {
                       firebase.auth().currentUser.sendEmailVerification();
                        var user = firebase.auth().currentUser;
                        user.updateProfile({
                            displayName: "",
                            photoURL: "",
                            phoneNumber:phone
                        }).then(function () {
                            loginUserSuccess(dispatch, user);
                            Actions.CongratulationForm({type:'reset'});
                        }).catch(function (error) {
                            loginUserFail(dispatch);
                            Alert.alert('Error', 'Something is wrong,Please try again');
                        });

                    })
                    .catch(() => {
                        loginUserFail(dispatch);
                        Alert.alert('Error', 'Something is wrong,Please try again');
                    })
            })
            .catch(() => {
                loginUserFail(dispatch);
                Alert.alert('Error', 'Email is already exists');
            })
    };
}

/*
   @Method : getUserDetails
   @Params :
   @Returns : *
   */
export const getUserDetails=()=>{
    return (dispatch) => {
        dispatch({type: LOGIN_USER})
        const {currentUser} = firebase.auth();
        let ref = firebase.database().ref("/users");
        ref.orderByChild("id").equalTo(`${currentUser.uid}`).on("value", snapshot => {
            _.map(snapshot.val(),(val,uid)=>{
                val.userId = uid;
                dispatch({type: FETCH_AUTH_DETAIL_SUCCESS, payload:val});

            });
        });
    };
}


/*
   @Method : changePassword
   @Params :
   @Returns : *
   */
export const changePassword = ({password}) => {
    return (dispatch) => {
        dispatch({type: LOGIN_USER});
        var user = firebase.auth().currentUser;
        user.updatePassword(password).then(function () {
            loginUserSuccess(dispatch, user);
            Actions.login({type:'reset'});
        }).catch(function (error) {
            Alert.alert('Error', 'Something is wrong,Please try again');
            loginUserFail(dispatch);
        });
    };
};

/*
   @Method : uploadPhoto
   @Params :
   @Returns : *
   */
export const uploadPhoto = (file,userId) => {
    const polyfill = RNFetchBlob.polyfill;
    window.XMLHttpRequest = polyfill.XMLHttpRequest;
    window.Blob = polyfill.Blob;
    const sessionId = new Date().getTime();
    let uploadBlob = null;
    const imageRef = firebase.storage().ref('images/').child(`${sessionId}.png`)

    return (dispatch) => {
        dispatch({type: LOGIN_USER});
        let path = file.path;
        Blob.build(RNFetchBlob.wrap(path), {type: 'image/jpeg'})
            .then((blob) => imageRef
                .put(blob, {contentType: 'image/png'})
            ).then((snapshot) => {
        })
            .then(() => {
                return imageRef.getDownloadURL();
            })
            .then((url) => {
                var user = firebase.auth().currentUser;
                firebase.database().ref(`/users/${userId}`)
                    .update({profile_picture:url})
                    .then(() => {
                        user.updateProfile({
                            photoURL: url
                        }).then(function() {
                            dispatch({type: ON_CHANGE_IMAGE_SUCCESS, payload: url, loading: false});
                            dispatch({type: LOGIN_USER_FAIL});
                            Alert.alert( 'Success', 'Profile Picture has been updated successfully');

                        }).catch(function(error) {
                            loginUserFail(dispatch);
                            Alert.alert( 'Error', 'Something is wrong,Please try again');
                        });
                    })
            }).catch((error) => {
            Alert.alert( 'Error', 'Something is wrong,Please try again');
            dispatch({type: LOGIN_USER_FAIL});
        })
    }
};

/*
   @Method : updateProfile
   @Params :
   @Returns : *
   */
export const updateProfile = ({name, address, profile_picture = '', userId}) => {
    return (dispatch) => {
        dispatch({type: LOGIN_USER});
        const {currentUser} = firebase.auth();
        firebase.database().ref(`/users/${userId}`)
            .update({name, address, profile_picture})
            .then(() => {
                let user = firebase.auth().currentUser;
                user.updateProfile({
                    photoURL: profile_picture,
                    displayName:name
                }).then(function () {
                    Alert.alert('Success', 'Profile has been updated successfully');
                    dispatch({type: LOGIN_USER_FAIL});
                }).catch(function (error) {
                    Alert.alert('Error', 'Something is wrong,Please try again');
                    loginUserFail(dispatch);

                });

            })
    };
};
/*
   @Method : resetForm
   @Params :
   @Returns : *
   */
export const resetForm = () => {
    return (dispatch) => {
        dispatch({type: RESET_USER});
    }
};

/*
   @Method : updateUserState
   @Params :
   @Returns : *
   */
export const updateUserState = ({isOnline}) => {
    return (dispatch) => {
        dispatch({type: LOGIN_USER});
        const {currentUser} = firebase.auth();

        firebase.database().ref(`/users/${currentUser.uid}`)
            .push({isOnline})
            .then(() => {
                loginUserSuccess(dispatch, currentUser);
            })

    };
};

/*
   @Method : loginUser
   @Params :
   @Returns : *
   */
export const loginUser = ({email, password}) => {

    return (dispatch) => {
        dispatch({type: LOGIN_USER});

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(user => {
                loginUserSuccess(dispatch, user);
                 Actions.Home({type:'reset'});
            })
            .catch(() => {
                Alert.alert('Error', 'Invalid email or password,Please try again');
                loginUserFail(dispatch);
            })
    };
};

/*
   @Method : getCurrentUserAuthDetails
   @Params :
   @Returns : *
   */
export const getCurrentUserAuthDetails = () => {
    const {currentUser} = firebase.auth();
    return (dispatch) => {
        firebase.database().ref(`/users/${currentUser.uid}`)
            .on('child_added', snapshot => {
                dispatch({
                    type: FETCH_AUTH_DETAIL_SUCCESS,
                    payload: currentUser,
                    userDetails: snapshot.val(),
                    uid: snapshot.key
                });

            });
    }
};

/*
   @Method : loginUserSuccess
   @Params :
   @Returns : *
   */
const loginUserSuccess = (dispatch, user) => {
    dispatch({type: LOGIN_USER_SUCCESS, payload: user});

};

/*
   @Method : loginUserFail
   @Params :
   @Returns : *
   */
const loginUserFail = (dispatch) => {
    dispatch({type: LOGIN_USER_FAIL});

};