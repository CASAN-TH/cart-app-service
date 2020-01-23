'use strict';
// use model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TotalcartSchema = new Schema({
    u_id: {
        type: String
    },
    total_regularprice: {
        type: Number
    },
    total_regularprice_text: {
        type: String
    },
    total_saleprice: {
        type: Number
    },
    total_saleprice_text: {
        type: String
    },
    currency: {
        type: String
    },
    installment_price: {
        type: Number
    },
    installment_price_text: {
        type: String
    },
    installment_period: {
        type: Number
    },
    amount_product: {
        type: Number
    },
    promotion_price: {
        type: Number
    },
    promotion_price_text: {
        type: String
    },
    shippingfee_price: {
        type: Number
    },
    shippingfee_price_text: {
        type: String
    },
    coupon_price: {
        type: Number
    },
    coupon_price_text: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date
    },
    createby: {
        _id: {
            type: String
        },
        username: {
            type: String
        },
        displayname: {
            type: String
        }
    },
    updateby: {
        _id: {
            type: String
        },
        username: {
            type: String
        },
        displayname: {
            type: String
        }
    }
});

mongoose.model("Totalcart", TotalcartSchema);