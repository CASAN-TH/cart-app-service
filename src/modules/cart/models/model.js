'use strict';
// use model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var CartSchema = new Schema({
    u_id: {
        type: String
    },
    shop: {
        type: {
            shop_id: {
                type: String
            },
            shop_name: {
                type: String
            },
            shop_image: {
                type: String
            }
        }
    },
    items: {
        type: [
            {
                product_id: {
                    type: String
                },
                images: [String],
                sku: {
                    type: String
                },
                name: {
                    type: String
                },
                product_status: {
                    type: String,
                    enum: ['waitpayment', 'waitshipping', 'waitreceive', 'waitreview'],
                    default: 'waitpayment'
                },
                option1: String,
                option2: String,
                sale_price_percentage: Number,
                sale_avaliable: {
                    type: Boolean
                },
                sale_price: {
                    type: {
                        price: {
                            type: Number
                        },
                        currency: {
                            type: String
                        }
                    }
                },
                sale_price_text: {
                    type: String
                },
                regular_price: {
                    type: {
                        price: {
                            type: Number
                        },
                        currency: {
                            type: String
                        }
                    }
                },
                regular_price_text: {
                    type: String
                },
                down_payment: {
                    type: {
                        price: {
                            type: Number
                        },
                        currency: {
                            type: String
                        }
                    }
                },
                down_payment_text: {
                    type: String
                },
                installment: {
                    type: {
                        price: {
                            type: Number
                        },
                        period: {
                            type: Number
                        },
                        currency: {
                            type: String
                        }
                    }
                },
                installment_price_text: {
                    type: String
                },
                amount_product: {
                    type: Number
                },
                shipping: {
                    type: {
                        shipping_name: {
                            type: String
                        },
                        shipping_fee: {
                            type: Number
                        },
                        shipping_currency: {
                            type: String
                        }
                    }
                },
                promotions: {
                    type: [
                        {
                            gift_type: {
                                type: String
                            },
                            gift_name: {
                                type: String
                            },
                            gift_amount: {
                                type: Number
                            }
                        }
                    ]
                },
                down_payment_lists: {
                    type: [Number]
                },
                periods_lists: {
                    type: [Number]
                },
            }
        ]
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

mongoose.model("Cart", CartSchema);