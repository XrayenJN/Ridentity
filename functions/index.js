const functions = require('firebase-functions');
const app = require('express')();

const {
    getAllTransportations,
    postOneTransportation,
    deleteTransportation,
    editTransportation
} = require('./APIs/transportations')

app.post('/transportation', auth, postOneTransportation);

app.delete('/transportation/:transportationId', auth, deleteTransportation);

app.put('/transportation/:transportationId', auth, editTransportation);

app.get('/transportations', auth, getAllTransportations);
exports.api = functions.https.onRequest(app);

const auth = require('./util/auth');

const {
    loginUser,
    signUpUser,
    uploadProfilePhoto,
    getUserDetail,
    updateUserDetail
} = require('./APIs/users')

app.post('/login', loginUser)

app.post('/signup', signUpUser)

app.post('/user/image', auth, uploadProfilePhoto);

app.get('/user', auth, getUserDetail);

app.post('/user', auth, updateUserDetail);