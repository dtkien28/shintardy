const express = require('express');
const playlistsController = require('./playlists.controller');
const authenticate = require('../../middlewares/auth.middleware');

const router = express.Router();

const upload = require('../../middlewares/upload.middleware');

router.use(authenticate); // Require authentication for all playlist routes

router.get('/', playlistsController.getAll);
router.post('/', playlistsController.create);
router.delete('/:id', playlistsController.delete);
router.post('/:id/tracks', playlistsController.addTrack);
router.post('/:id/upload', upload.single('audio'), playlistsController.uploadTrack);
router.delete('/tracks/:trackId', playlistsController.deleteTrack);

module.exports = router;
