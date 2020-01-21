'use strict';
var mongoose = require('mongoose'),
    model = require('../models/model'),
    mq = require('../../core/controllers/rabbitmq'),
    Cart = mongoose.model('Cart'),
    errorHandler = require('../../core/controllers/errors.server.controller'),
    _ = require('lodash');

exports.getList = function (req, res) {
    var pageNo = parseInt(req.query.pageNo);
    var size = parseInt(req.query.size);
    var query = {};
    if (pageNo < 0 || pageNo === 0) {
        response = { "error": true, "message": "invalid page number, should start with 1" };
        return res.json(response);
    }
    query.skip = size * (pageNo - 1);
    query.limit = size;
    Cart.find({}, {}, query, function (err, datas) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: datas
            });
        };
    });
};

exports.findByUser = function (req, res, next) {

    Cart.find({ u_id: req.user.username }, function (err, datas) {
        if (datas.length < 1) {
            // resualt = []
            // ไม่มีข้อมูล ให้ next ไป save
            next();
        } else {
            // จำนวนข้อมูลตั้งแต่ 1 ขึ้นไป
            console.log('*ข้อมูล req.body = ' + req.body.shop.shop_id);

            var shopIdx = datas.findIndex(el => {
                return el.shop.shop_id === req.body.shop.shop_id
            });

            if (shopIdx >= 0) {
                console.log('shop already')

                var itemIdx = datas[shopIdx].items.findIndex(el => {
                    return el.product_id === req.body.items[0].product_id
                })
                console.log(itemIdx)
                next();
            } else {
                console.log('shop not ready')
                next();
            };


            // console.log('---------------ข้อมูลเตรียม Next-----------------')
            // console.log(req.body)
            // next();
        }
    });
};

exports.create = function (req, res) {
    var newCart = new Cart(req.body);
    newCart.createby = req.user;
    newCart.save(function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: data
            });
            /**
             * Message Queue
             */
            // mq.publish('exchange', 'keymsg', JSON.stringify(newOrder));
        };
    });
};

exports.getByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            status: 400,
            message: 'Id is invalid'
        });
    }

    Cart.findById(id, function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            req.data = data ? data : {};
            next();
        };
    });
};

exports.read = function (req, res) {
    res.jsonp({
        status: 200,
        data: req.data ? req.data : []
    });
};

exports.update = function (req, res) {
    var updCart = _.extend(req.data, req.body);
    updCart.updated = new Date();
    updCart.updateby = req.user;
    updCart.save(function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: data
            });
        };
    });
};

exports.delete = function (req, res) {
    req.data.remove(function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: data
            });
        };
    });
};
