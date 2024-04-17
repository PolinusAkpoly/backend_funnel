const orderModel = require("../models/orderModel");
const orderdetailModel = require("../models/orderdetailModel");


const calculateOrderAmount = (cart, carrier) => {
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    const carrierPrice = (carrier?.price * 100)
    return (carrierPrice + cart.items.reduce((total, item)=> item.sub_total + total, 0) * 100).toFixed(0);
};
const createOrderWithCart = async (cart, user, billingAddress,carrier, shippingAddress, paymentIntent, paymentMethod) => {
    if (cart && user && billingAddress && shippingAddress && carrier) {
        const order = new orderModel({ billingAddress, shippingAddress, carrier })
        order.clientName = user?.fullName
        order.taxe = 0
        order.priceHT = cart.sub_total
        order.priceTTC = cart.sub_total + carrier.price
        order.total = cart.sub_total
        order.carrier_price = carrier.price
        order.carrier_name = carrier.name
        order.quantity = cart.quantity
        order.payment_intent = paymentIntent.id
        const { items } = cart

        let orderdetails = await Promise.all(items.map(async (article) => {
            const orderdetail = new orderdetailModel()
            orderdetail.product_name = article.product.name
            orderdetail.product_description = article.product.description
            orderdetail.product_more_description = article.product.more_description
            orderdetail.product_image = article.product.imageUrls[0]
            orderdetail.product_solde_price = article.product.solde_price
            orderdetail.product_regular_price = article.product.regular_price
            orderdetail.quantity = article.quantity
            orderdetail.total = article.sub_total
            await orderdetail.save()
            return orderdetail._id
        }))

        order.payment_method = paymentMethod
        order.order_details = orderdetails
        await order.save()
        console.log(order);
        return order
    }
    return null
};

module.exports = {
    calculateOrderAmount,
    createOrderWithCart
}