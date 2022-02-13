const express = require('express');
const Partner = require('../models/partner');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();


favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({ user: req.user._id })
    .populate('campsites.user')
    .populate('campsites.campsites')
    .then(favorites => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .then(favorite => {
        if(favorite) {
            req.body.forEach(fav => {
                const isFavNotInCampsites = !favorite.campsites.includes(fav._id)
                if (isFavNotInCampsites) {
                    favorite.campsites.push(fav._id)
                } else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/plain')
                    res.end('That Campsite is already in your favorites!')
                }
            })
            favorite.save()
                .then(favorite => {
                    res.statusCode = 200;
                    res.setHeader('Content Type', 'application/json')
                    res.json(favorite)
                })
                .catch(err => next(err))

        } else {
            Favorite.create(req.user._id)
                .then(favorite => {
                    req.body.forEach(fav => {
                        const isFavNotInCampsites = !favorite.campsites.includes(fav._id)
                        if (isFavNotInCampsites) {
                            favorite.campsites.push(fav._id)
                        }
                    })
                    favorite.save()
                        .then(favorite => {
                            res.statusCode = 200;
                            res.setHeader('Content Type', 'application/json')
                            res.json(favorite)
                        })
                        .catch(err => next(err))
                })
                .catch(err => next(err))
        }
    })
    .catch(err => next(err));
    
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete(req.params.user._id)
    .then(favorite => {
        if(favorite) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application.json');
            res.json(favorite);
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text-plain');
            res.end('You do not have any favorites to delete.')
        }
    })
    .catch(err => next(err))
});

// partner id router

favoriteRouter.route('/:campsiteId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /favorites');
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    Favorite.findOne(req.params.favoriteId)
    .then(favorite => {
        if(favorite) {
            req.body.forEach(fav => {
                const isFavNotInCampsites = !favorite.campsites.includes(fav._id)
                if (isFavNotInCampsites) {
                    favorite.campsites.push(fav._id)
                } else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/plain')
                    res.end('That Campsite is already in your favorites!')
                }
            })
            favorite.save()
                .then(favorite => {
                    res.statusCode = 200;
                    res.setHeader('Content Type', 'application/json')
                    res.json(favorite)
                })
                .catch(err => next(err))

        } else {
            Favorite.create(req.user._id)
                .then(favorite => {
                    req.body.forEach(fav => {
                        const isFavNotInCampsites = !favorite.campsites.includes(fav._id)
                        if (isFavNotInCampsites) {
                            favorite.campsites.push(fav._id)
                        }
                    })
                    favorite.save()
                        .then(favorite => {
                            res.statusCode = 200;
                            res.setHeader('Content Type', 'application/json')
                            res.json(favorite)
                        })
                        .catch(err => next(err))
                })
                .catch(err => next(err))
        }
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id})
        .then(favorite => {
            if (favorite) {
                const index = favorite.campsites.indexOf(req.params.campsiteId)
                if (index >= 0) {
                    favorite.campsites.splice(index, 1);
                }
                favorite
                    .save()
                    .then(favorite => {
                        res.statusCode = 200;
                        res.setHeader('Content Type', 'application/json');
                        res.json(favorite)
                    })
                    .catch(err => next(err))
            } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end('There are no favorites to delete.');

            }
        })
        .catch(err => next(err));
});



module.exports = favoriteRouter;