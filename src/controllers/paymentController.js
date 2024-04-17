const { calculateOrderAmount, createOrderWithCart } = require("../helpers/payment");
const available_paymentModel = require("../models/available_paymentModel");
const orderModel = require("../models/orderModel");
const orderdetailModel = require("../models/orderdetailModel");
const shop_paramsModel = require("../models/shop_paramsModel");
const userModel = require("../models/userModel");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));


let paypalBaseURL

if (process.env.NODE_ENV === "production") {
    paypalBaseURL = "https://api-m.paypal.com"
} else {
    paypalBaseURL = "https://api-m.sandbox.paypal.com"
}

//////////////////////
// PayPal API helpers
//////////////////////

// use the orders api to create an order
async function createOrder(paymentMethod, cart, carrier, userId, billingAddress, shippingAddress) {
    const accessToken = await generateAccessToken();
    const params = await shop_paramsModel.findOne({})
    const currency_code = params?.currency ? params?.currency : "EUR"
    const total = (cart.sub_total + carrier.price).toFixed(2)
    const url = `${paypalBaseURL}/v2/checkout/orders`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: currency_code,
                        value: total,
                    },
                },
            ],
        }),
    });
    const data = await response.json();
    data.currency_code = currency_code
    const user = await userModel.findOne({ _id: userId })
    const order = await createOrderWithCart(cart, user, billingAddress, carrier, shippingAddress, data, "PAYPAL")
    return data;
}

// use the orders api to capture payment for an order
async function capturePayment(orderId) {
    try {
        const accessToken = await generateAccessToken();
        const url = `${paypalBaseURL}/v2/checkout/orders/${orderId}/capture`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const data = await response.json();
        return data;

    } catch (error) {
        console.log(error);
    }
}

// generate an access token using client id and app secret
async function generateAccessToken() {
    let paymentMode = new RegExp("paypal", 'i')
    const paymentMethod = await available_paymentModel.findOne({ name: paymentMode })
    let result
    let SECRET_API_KEY, PUBLIC_API_KEY
    console.log(paymentMethod?.options);
    if (paymentMethod) {
        if (process.env.NODE_ENV === "production") {
            // production
            SECRET_API_KEY = paymentMethod.options.filter((option) => option.name == "PROD_PRIVATE_API_KEY")[0]?.values[0]?.name
            PUBLIC_API_KEY = paymentMethod.options.filter((option) => option.name == "PROD_PUBLIC_API_KEY")[0]?.values[0]?.name
        } else {
            // development
            SECRET_API_KEY = paymentMethod.options.filter((option) => option.name == "TEST_PRIVATE_API_KEY")[0]?.values[0]?.name
            PUBLIC_API_KEY = paymentMethod.options.filter((option) => option.name == "TEST_PUBLIC_API_KEY")[0]?.values[0]?.name
        }
    }

    const auth = Buffer.from(PUBLIC_API_KEY + ":" + SECRET_API_KEY).toString("base64")
    const response = await fetch(`${paypalBaseURL}/v1/oauth2/token`, {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: {
            Authorization: `Basic ${auth}`,
        },
    });
    const data = await response.json();
    console.log(data);
    return data.access_token;
}


module.exports = {
    createStripePaymentIndent: async (req, res) => {

        try {
            const { cart, userId, carrier, billingAddress, shippingAddress } = req.body;



            let paymentMode = new RegExp(req.query?.paymentMode, 'i')
            const paymentMethod = await available_paymentModel.findOne({ name: paymentMode })
            let result = {}

            const user = await userModel.findOne({ _id: userId })


            if (!paymentMethod) {
                res.status(404).json({
                    isSuccess: false,
                    message: "Payment method not found !",
                    clientSecret: null
                });
            }


            let SECRET_API_KEY, PUBLIC_API_KEY
            if (paymentMethod.name.search(new RegExp("stripe", 'i')) !== -1) {
                // STRIPE PAYMENT METHOD
                // console.log(paymentMethod.options);
                var stripe = require("stripe")
                if (process.env.NODE_ENV === "production") {
                    // production
                    SECRET_API_KEY = paymentMethod.options.filter((option) => option.name == "PROD_PUBLIC_API_KEY")[0]?.values[0]?.name
                    PUBLIC_API_KEY = paymentMethod.options.filter((option) => option.name == "PROD_PUBLIC_API_KEY")[0]?.values[0]?.name
                    result["PUBLIC_API_KEY"] = PUBLIC_API_KEY
                    result["PROD_PUBLIC_API_KEY"] = PUBLIC_API_KEY
                } else {
                    // development
                    SECRET_API_KEY = paymentMethod.options.filter((option) => option.name == "TEST_PRIVATE_API_KEY")[0]?.values[0]?.name
                    PUBLIC_API_KEY = paymentMethod.options.filter((option) => option.name == "TEST_PUBLIC_API_KEY")[0]?.values[0]?.name
                    result["PUBLIC_API_KEY"] = PUBLIC_API_KEY
                    result["TEST_PUBLIC_API_KEY"] = PUBLIC_API_KEY
                }
                stripe = stripe(SECRET_API_KEY)
            }


            // Create a PaymentIntent with the order amount and currency
            const paymentIntent = await stripe.paymentIntents.create({
                amount: calculateOrderAmount(cart, carrier),
                currency: "eur",
                automatic_payment_methods: {
                    enabled: true,
                },
            });

            await createOrderWithCart(cart, user, billingAddress, carrier, shippingAddress, paymentIntent, "STRIPE")

            res.status(200).json({
                isSuccess: true,
                PUBLIC_API_KEY,
                TEST_PUBLIC_API_KEY: PUBLIC_API_KEY,
                PUBLIC_API_KEY: PUBLIC_API_KEY,
                clientSecret: paymentIntent.client_secret,
            });

        } catch (error) {

            console.log(error);

            res.status(500).json({
                isSuccess: false,
                message: error.message,
                clientSecret: null
            });

        }
    },
    createPaypalPaymentIndent: async (req, res) => {
        try {

            const { cart, userId, carrier, billingAddress, shippingAddress  } = req.body;


            
            let paymentMode = new RegExp("Paypal", 'i')
            const paymentMethod = await available_paymentModel.findOne({ name: paymentMode })
            console.log({paymentMethod})


            let result
            let SECRET_API_KEY, PUBLIC_API_KEY
            console.log(paymentMethod?.options);
            if (paymentMethod) {
                if (process.env.NODE_ENV === "production") {
                    // production
                    SECRET_API_KEY = paymentMethod.options.filter((option) => option.name == "PROD_PRIVATE_API_KEY")[0]?.values[0]?.name
                    PUBLIC_API_KEY = paymentMethod.options.filter((option) => option.name == "PROD_PUBLIC_API_KEY")[0]?.values[0]?.name
                } else {
                    // development
                    SECRET_API_KEY = paymentMethod.options.filter((option) => option.name == "TEST_PRIVATE_API_KEY")[0]?.values[0]?.name
                    PUBLIC_API_KEY = paymentMethod.options.filter((option) => option.name == "TEST_PUBLIC_API_KEY")[0]?.values[0]?.name
                }
            }

            if (paymentMethod) {
                const data = await createOrder(paymentMethod, cart, carrier, userId, billingAddress, shippingAddress);
                if (process.env.NODE_ENV === "production") {
                    res.json({
                        isSuccess: true,
                        statusCode: 200,
                        PROD_PUBLIC_API_KEY: PUBLIC_API_KEY,
                        data
                    });
                } else {
                    res.json({
                        isSuccess: true,
                        statusCode: 200,
                        TEST_PUBLIC_API_KEY: PUBLIC_API_KEY,
                        data
                    });
                }
            } else {
                res.json({
                    isSuccess: false,
                    statusCode: 404,
                    error: "Paiment Method Not found !"
                })
            }

        } catch (error) {
            console.log(error);
            res.json({
                error: error.message
            })

        }

    },
    captureStripePayment: async (req, res) => {
        let { payment_intent } = req.body;
        payment_intent = payment_intent.split("_secret_")[0]


        console.log(await orderModel.findOne({ payment_intent: payment_intent }));

        const result = await orderModel.updateOne({ payment_intent: payment_intent }, { $set: { isPaid: true } })

        res.json(result);
    },
    capturePaypalPayment: async (req, res) => {
        const { orderID } = req.body;
        console.log(req.body);
        console.log(orderID);
        const captureData = await capturePayment(orderID);
        const result = await orderModel.updateOne({ payment_intent: orderID }, { $set: { isPaid: true } })
        console.log(result);
        console.log(captureData);
        // TODO: store payment information such as the transaction ID
        res.json(captureData);
    }
}