const { calculateOrderAmount, createOrderWithItems } = require("../helpers/payment");
const available_paymentModel = require("../models/available_paymentModel");
const orderModel = require("../models/orderModel");
const orderdetailModel = require("../models/orderdetailModel");
const shop_paramsModel = require("../models/shop_paramsModel");
const userModel = require("../models/userModel");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const endpointSecret = "whsec_cc3075fd729141955e9b0984e9daaad4404b5b8909fec5acca8cb855873800e7";

module.exports = {
    webhook: async (req, res) => {
        const sig = req.headers['stripe-signature'];

        let event;
      
        try {
          event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        } catch (err) {
          res.status(400).send(`Webhook Error: ${err.message}`);
          return;
        }
      
        // Handle the event
        switch (event.type) {
          case 'payment_intent.succeeded':
            const paymentIntentSucceeded = event.data.object;
            // Then define and call a function to handle the event payment_intent.succeeded
            break;
          // ... handle other event types
          default:
            console.log(`Unhandled event type ${event.type}`);
        }
      
        // Return a 200 res to acknowledge receipt of the event
        res.send();
    }
}