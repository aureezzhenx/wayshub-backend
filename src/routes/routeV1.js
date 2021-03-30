const express = require('express');
const router = express.Router();

const { auth } = require('../middleware/auth');
const { uploadCloudinary } = require('../middleware/uploadCloudinary')
const { upload } = require('../middleware/upload');
const { register } = require('../controllers/register');
const { login } = require('../controllers/login');

const {
    getChanels,
    getChanelById,
    getVideosByChanelId,
    editChanel,
    deleteChanel
} = require('../controllers/chanels');

const {
    getVideos,
    getVideoById,
    addVideo,
    editVideo,
    deleteVideo
} = require('../controllers/videos');

const {
    getCommentsByVideo,
    getDetailComment,
    addComment,
    editComment,
    deleteComment
} = require('../controllers/comments');

const {
    addSubscribe,
    unSubscribe,
    getSubscribtion,
    getVideosSubscribtion,
    checkSubscribe
} = require('../controllers/subscribes');

const { checkAuth } = require('../controllers/checkAuth');
const { search } = require('../controllers/search');
const {checkLike, addLike, unlike} = require('../controllers/likeVideo');

// register
router.post('/register', register);

// login
router.post('/login', login);

// chanels
router.get('/chanels', getChanels);
router.get('/chanel/:id', getChanelById);
router.get('/chanel/:id/videos', getVideosByChanelId);
router.put('/chanel/:id', auth, uploadCloudinary(["photo", "cover"]), editChanel);
router.delete('/chanel/:id', auth, deleteChanel);

// videos
router.get('/videos/:offset/:limit', getVideos);
router.get('/video/:id', getVideoById);
router.put('/video/:videoId', auth, upload(["thumbnail", "video"]), editVideo);
router.delete('/video/:videoId', auth, deleteVideo);
router.post('/video', auth, uploadCloudinary(["thumbnail", "video"]), addVideo);

// comments
router.get('/video/:videoId/comments', getCommentsByVideo);
router.get('/video/:videoId/comment/:commentId', getDetailComment);
router.post('/video/:videoId/comment', auth, addComment);
router.put('/video/:videoId/comment/:commentId', auth, editComment);
router.delete('/video/:videoId/comment/:commentId', auth, deleteComment);

// subscribe
router.post('/subscribe', auth, addSubscribe);
router.delete('/subscribe/:chanelId', auth, unSubscribe);
router.get('/subscribe', auth, getSubscribtion);
router.get('/videos-subscribtion', auth, getVideosSubscribtion)
router.post('/check-subscribe', auth, checkSubscribe);

// check auth
router.get('/auth', auth, checkAuth);

// search
router.post('/search', auth, search);

// like
router.get('/check-like/:videoId', auth, checkLike);
router.post('/add-like', auth, addLike);
router.delete('/unlike/:videoId', auth, unlike);

module.exports = router;