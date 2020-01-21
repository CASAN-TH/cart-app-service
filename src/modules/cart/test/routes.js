'use strict';
var request = require('supertest'),
    assert = require('assert'),
    config = require('../../../config/config'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    app = require('../../../config/express'),
    Cart = mongoose.model('Cart');

var credentials,
    token,
    mockup;

describe('Cart CRUD routes tests', function () {

    before(function (done) {
        mockup = {
            "shop": {
                "shop_id": "shop001",
                "shop_name": "shopTest",
                "shop_image": "image.jpg"
            },
            "items": [
                {
                    "product_id": "Product001",
                    "sku": 'sku',
                    "images": ["https://res.cloudinary.com/hml20oe33/image/upload/v1576751856/catalog/2_pfwgiy.jpg"],
                    "name": 'Vivo v13 Pro Crystal Sky RAM 8 GB ROM 128 GB',
                    "options": ['green', '32GB'],
                    "sale_price_percentage": 50,
                    "sale_avaliable": true,
                    "sale_price": {
                        "price": 5000,
                        "currency": "฿"
                    },
                    "sale_price_text": "฿5,000",
                    "regular_price": {
                        "price": 10000,
                        "currency": "฿"
                    },
                    "regular_price_text": "฿10,000",
                    "down_payment": {
                        "price": 1000,
                        "currency": "฿"
                    },
                    "down_payment_text": "฿1,000",
                    "installment": {
                        "price": 222.222222222223,
                        "period": 18,
                        "currency": "฿"
                    },
                    "installment_price_text": "฿222.22",
                    "amount_product": 2,
                    "shipping": {
                        "shipping_name": "kerry",
                        "shipping_fee": 50,
                        "shipping_currency": "฿"
                    },
                    "promotions": [
                        {
                            "gift_type": "ของแถม",
                            "gift_name": "หูฟังไร้สาย",
                            "gift_amount": 1
                        }
                    ],
                    "down_payment_lists": [20, 30, 40, 50],
                    "periods_lists": [3, 6, 9, 12, 18]
                }
            ]
        };
        credentials = {
            username: '0992436806',
            password: 'password',
            firstname: 'first name',
            lastname: 'last name',
            email: 'test@email.com',
            roles: ['user']
        };
        token = jwt.sign(_.omit(credentials, 'password'), config.jwt.secret, {
            expiresIn: 2 * 60 * 60 * 1000
        });
        done();
    });

    it('should be Cart get use token', (done) => {
        request(app)
            .get('/api/carts')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                done();
            });
    });

    it('should be Cart get by id', function (done) {

        request(app)
            .post('/api/carts')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .get('/api/carts/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.status, 200);
                        assert.equal(resp.data.shop.shop_id, mockup.shop.shop_id);
                        assert.equal(resp.data.shop.shop_name, mockup.shop.shop_name);
                        assert.equal(resp.data.shop.shop_image, mockup.shop.shop_image);
                        assert.equal(resp.data.items[0].product_id, mockup.items[0].product_id);
                        assert.equal(resp.data.items[0].sku, mockup.items[0].sku);
                        assert.equal(resp.data.items[0].images[0], mockup.items[0].images[0]);
                        assert.equal(resp.data.items[0].name, mockup.items[0].name);
                        assert.equal(resp.data.items[0].options[0], mockup.items[0].options[0]);
                        assert.equal(resp.data.items[0].options[1], mockup.items[0].options[1]);
                        assert.equal(resp.data.items[0].sale_price_percentage, mockup.items[0].sale_price_percentage);
                        assert.equal(resp.data.items[0].sale_avaliable, mockup.items[0].sale_avaliable);
                        assert.equal(resp.data.items[0].sale_price.price, mockup.items[0].sale_price.price);
                        assert.equal(resp.data.items[0].sale_price.currency, mockup.items[0].sale_price.currency);
                        assert.equal(resp.data.items[0].sale_price_text, mockup.items[0].sale_price_text);
                        assert.equal(resp.data.items[0].regular_price.price, mockup.items[0].regular_price.price);
                        assert.equal(resp.data.items[0].regular_price.currency, mockup.items[0].regular_price.currency);
                        assert.equal(resp.data.items[0].regular_price_text, mockup.items[0].regular_price_text);
                        assert.equal(resp.data.items[0].down_payment.price, mockup.items[0].down_payment.price);
                        assert.equal(resp.data.items[0].down_payment.currency, mockup.items[0].down_payment.currency);
                        assert.equal(resp.data.items[0].down_payment_text, mockup.items[0].down_payment_text);
                        assert.equal(resp.data.items[0].installment.price, mockup.items[0].installment.price);
                        assert.equal(resp.data.items[0].installment.period, mockup.items[0].installment.period);
                        assert.equal(resp.data.items[0].installment.currency, mockup.items[0].installment.currency);
                        assert.equal(resp.data.items[0].installment_price_text, mockup.items[0].installment_price_text);
                        assert.equal(resp.data.items[0].amount_product, mockup.items[0].amount_product);
                        assert.equal(resp.data.items[0].shipping.shipping_name, mockup.items[0].shipping.shipping_name);
                        assert.equal(resp.data.items[0].shipping.shipping_fee, mockup.items[0].shipping.shipping_fee);
                        assert.equal(resp.data.items[0].shipping.shipping_currency, mockup.items[0].shipping.shipping_currency);
                        assert.equal(resp.data.items[0].promotions.gift_type, mockup.items[0].promotions.gift_type);
                        assert.equal(resp.data.items[0].promotions.gift_name, mockup.items[0].promotions.gift_name);
                        assert.equal(resp.data.items[0].promotions.gift_amount, mockup.items[0].promotions.gift_amount);
                        assert.equal(resp.data.items[0].down_payment_lists.length, mockup.items[0].down_payment_lists.length);
                        assert.equal(resp.data.items[0].periods_lists.length, mockup.items[0].periods_lists.length);
                        done();
                    });
            });

    });

    it('should be Cart post use token', (done) => {
        request(app)
            .post('/api/carts')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                assert.equal(resp.data.shop.shop_id, mockup.shop.shop_id);
                assert.equal(resp.data.shop.shop_name, mockup.shop.shop_name);
                assert.equal(resp.data.shop.shop_image, mockup.shop.shop_image);
                assert.equal(resp.data.items[0].product_id, mockup.items[0].product_id);
                assert.equal(resp.data.items[0].sku, mockup.items[0].sku);
                assert.equal(resp.data.items[0].images[0], mockup.items[0].images[0]);
                assert.equal(resp.data.items[0].name, mockup.items[0].name);
                assert.equal(resp.data.items[0].options[0], mockup.items[0].options[0]);
                assert.equal(resp.data.items[0].options[1], mockup.items[0].options[1]);
                assert.equal(resp.data.items[0].sale_price_percentage, mockup.items[0].sale_price_percentage);
                assert.equal(resp.data.items[0].sale_avaliable, mockup.items[0].sale_avaliable);
                assert.equal(resp.data.items[0].sale_price.price, mockup.items[0].sale_price.price);
                assert.equal(resp.data.items[0].sale_price.currency, mockup.items[0].sale_price.currency);
                assert.equal(resp.data.items[0].sale_price_text, mockup.items[0].sale_price_text);
                assert.equal(resp.data.items[0].regular_price.price, mockup.items[0].regular_price.price);
                assert.equal(resp.data.items[0].regular_price.currency, mockup.items[0].regular_price.currency);
                assert.equal(resp.data.items[0].regular_price_text, mockup.items[0].regular_price_text);
                assert.equal(resp.data.items[0].down_payment.price, mockup.items[0].down_payment.price);
                assert.equal(resp.data.items[0].down_payment.currency, mockup.items[0].down_payment.currency);
                assert.equal(resp.data.items[0].down_payment_text, mockup.items[0].down_payment_text);
                assert.equal(resp.data.items[0].installment.price, mockup.items[0].installment.price);
                assert.equal(resp.data.items[0].installment.period, mockup.items[0].installment.period);
                assert.equal(resp.data.items[0].installment.currency, mockup.items[0].installment.currency);
                assert.equal(resp.data.items[0].installment_price_text, mockup.items[0].installment_price_text);
                assert.equal(resp.data.items[0].amount_product, mockup.items[0].amount_product);
                assert.equal(resp.data.items[0].shipping.shipping_name, mockup.items[0].shipping.shipping_name);
                assert.equal(resp.data.items[0].shipping.shipping_fee, mockup.items[0].shipping.shipping_fee);
                assert.equal(resp.data.items[0].shipping.shipping_currency, mockup.items[0].shipping.shipping_currency);
                assert.equal(resp.data.items[0].promotions.gift_type, mockup.items[0].promotions.gift_type);
                assert.equal(resp.data.items[0].promotions.gift_name, mockup.items[0].promotions.gift_name);
                assert.equal(resp.data.items[0].promotions.gift_amount, mockup.items[0].promotions.gift_amount);
                assert.equal(resp.data.items[0].down_payment_lists.length, mockup.items[0].down_payment_lists.length);
                assert.equal(resp.data.items[0].periods_lists.length, mockup.items[0].periods_lists.length);
                done();
            });
    });

    it('should be cart put use token', function (done) {

        request(app)
            .post('/api/carts')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    "shop": {
                        "shop_id": "shopId Update",
                        "shop_name": "shopTest Update",
                        "shop_image": "update.jpg"
                    }
                }
                request(app)
                    .put('/api/carts/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(update)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.data.shop.shop_id, update.shop.shop_id);
                        assert.equal(resp.data.shop.shop_name, update.shop.shop_name);
                        assert.equal(resp.data.shop.shop_image, update.shop.shop_image);
                        assert.equal(resp.data.items[0].product_id, mockup.items[0].product_id);
                        assert.equal(resp.data.items[0].sku, mockup.items[0].sku);
                        assert.equal(resp.data.items[0].images[0], mockup.items[0].images[0]);
                        assert.equal(resp.data.items[0].name, mockup.items[0].name);
                        assert.equal(resp.data.items[0].options[0], mockup.items[0].options[0]);
                        assert.equal(resp.data.items[0].options[1], mockup.items[0].options[1]);
                        assert.equal(resp.data.items[0].sale_price_percentage, mockup.items[0].sale_price_percentage);
                        assert.equal(resp.data.items[0].sale_avaliable, mockup.items[0].sale_avaliable);
                        assert.equal(resp.data.items[0].sale_price.price, mockup.items[0].sale_price.price);
                        assert.equal(resp.data.items[0].sale_price.currency, mockup.items[0].sale_price.currency);
                        assert.equal(resp.data.items[0].sale_price_text, mockup.items[0].sale_price_text);
                        assert.equal(resp.data.items[0].regular_price.price, mockup.items[0].regular_price.price);
                        assert.equal(resp.data.items[0].regular_price.currency, mockup.items[0].regular_price.currency);
                        assert.equal(resp.data.items[0].regular_price_text, mockup.items[0].regular_price_text);
                        assert.equal(resp.data.items[0].down_payment.price, mockup.items[0].down_payment.price);
                        assert.equal(resp.data.items[0].down_payment.currency, mockup.items[0].down_payment.currency);
                        assert.equal(resp.data.items[0].down_payment_text, mockup.items[0].down_payment_text);
                        assert.equal(resp.data.items[0].installment.price, mockup.items[0].installment.price);
                        assert.equal(resp.data.items[0].installment.period, mockup.items[0].installment.period);
                        assert.equal(resp.data.items[0].installment.currency, mockup.items[0].installment.currency);
                        assert.equal(resp.data.items[0].installment_price_text, mockup.items[0].installment_price_text);
                        assert.equal(resp.data.items[0].amount_product, mockup.items[0].amount_product);
                        assert.equal(resp.data.items[0].shipping.shipping_name, mockup.items[0].shipping.shipping_name);
                        assert.equal(resp.data.items[0].shipping.shipping_fee, mockup.items[0].shipping.shipping_fee);
                        assert.equal(resp.data.items[0].shipping.shipping_currency, mockup.items[0].shipping.shipping_currency);
                        assert.equal(resp.data.items[0].promotions.gift_type, mockup.items[0].promotions.gift_type);
                        assert.equal(resp.data.items[0].promotions.gift_name, mockup.items[0].promotions.gift_name);
                        assert.equal(resp.data.items[0].promotions.gift_amount, mockup.items[0].promotions.gift_amount);
                        assert.equal(resp.data.items[0].down_payment_lists.length, mockup.items[0].down_payment_lists.length);
                        assert.equal(resp.data.items[0].periods_lists.length, mockup.items[0].periods_lists.length);
                        done();
                    });
            });

    });

    it('should be cart delete use token', function (done) {

        request(app)
            .post('/api/carts')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/carts/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(done);
            });

    });

    it('should be cart get not use token', (done) => {
        request(app)
            .get('/api/carts')
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);
    });

    it('should be cart post not use token', function (done) {

        request(app)
            .post('/api/carts')
            .send(mockup)
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);

    });

    it('should be cart put not use token', function (done) {

        request(app)
            .post('/api/carts')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    name: 'name update'
                }
                request(app)
                    .put('/api/carts/' + resp.data._id)
                    .send(update)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    it('should be cart delete not use token', function (done) {

        request(app)
            .post('/api/carts')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/carts/' + resp.data._id)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    xit('should be cart get by user', function (done) {

        request(app)
            .post('/api/carts')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;

                credentials = {
                    username: '7116895698',
                    password: 'password',
                    firstname: 'first name',
                    lastname: 'last name',
                    email: 'test@email.com',
                    roles: ['user']
                };
                token = jwt.sign(_.omit(credentials, 'password'), config.jwt.secret, {
                    expiresIn: 2 * 60 * 60 * 1000
                });
                request(app)
                    .post('/api/carts')
                    .set('Authorization', 'Bearer ' + token)
                    .send(mockup)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;

                        request(app)
                            .get('/api/cartsbyuser')
                            .set('Authorization', 'Bearer ' + token)
                            .expect(200)
                            .end(function (err, res) {
                                if (err) {
                                    return done(err);
                                }
                                var resp = res.body;
                                done();
                            })
                    });
            });

    });

    afterEach(function (done) {
        Cart.remove().exec(done);
    });

});