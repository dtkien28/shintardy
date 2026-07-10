const express = require('express');
const playlistsController = require('./playlists.controller');
const authenticate = require('../../middlewares/auth.middleware');

const router = express.Router();

router.use(authenticate); // Require authentication for all playlist routes

router.get('/', playlistsController.getAll);
router.post('/', playlistsController.create);
router.delete('/:id', playlistsController.delete);
router.post('/:id/tracks', playlistsController.addTrack);
router.delete('/tracks/:trackId', playlistsController.deleteTrack);

module.exports = router;
