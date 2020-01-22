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

exports.mixData = function (req, res, next) {

    Cart.find({ u_id: req.user.username }, function (err, datas) {
        if (datas.length < 1) {
            // resualt = []
            // ไม่มีข้อมูล ให้ next ไป save
            next();
        } else {
            // จำนวนข้อมูลตั้งแต่ 1 ขึ้นไป
            // console.log('*ข้อมูล req.body = ' + req.body.shop.shop_id);
            // เช็ค ว่ามี shop รึยัง
            var shopIdx = datas.findIndex(el => {
                return el.shop.shop_id === req.body.shop.shop_id
            });

            if (shopIdx >= 0) {
                // console.log('มี shop แล้ว');
                // เช็คว่ามี product รึยัง
                var itemIdx = datas[shopIdx].items.findIndex(el => {
                    return el.product_id === req.body.items[0].product_id && el.option1 === req.body.items[0].option1 && el.option2 === req.body.items[0].option2
                })

                if (itemIdx >= 0) {
                    // console.log('มี product แล้ว ทำการเพิ่ม amount_product');
                    datas[shopIdx].items[itemIdx].amount_product += req.body.items[0].amount_product;
                    req.body = datas[shopIdx];
                    next();
                } else {
                    // console.log('ไม่มี product ทำการเพิ่ม item');
                    datas[shopIdx].items.push(req.body.items[0]);
                    req.body = datas[shopIdx];
                    next();
                }

            } else {
                // console.log('ยังไม่มี shop')
                next();
            };
        };
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
