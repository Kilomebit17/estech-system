const moment = require('moment')
const Order = require('../models/Order')
const errorHandler = require('../Utils/errorHandler')

module.exports.overview = async function (req, res) {
    try {
        const allOrders = await Order.find({user: req.user.id}).sort({date: 1})
        const orderMap = await getOrdersMap(allOrders)

        // к-сть за вчора
        const countYesterday = orderMap[moment().add(-1, 'd').format('DD.MM.YYYY')] || []
        // к-кість заказів за вчора
        const countYesterdayNumber = countYesterday.length
        // к-кість заказів
        const totalOrderNumber = allOrders.length
        //  к-кість днів всього
        const daysNumbers = Object.keys(orderMap).length
        // заказів в день
        const ordersInDay = (totalOrderNumber / daysNumbers).toFixed(0)
        // процент для к-сті замовлень
        const ordersPercent = (((countYesterdayNumber / ordersInDay) - 1) * 100).toFixed(2)
        //Загальна виручка
        const totalGain = calculatePrice(allOrders)
        // Виручка в день
        const gainInDay = totalGain / daysNumbers
        // Виручка за вчера
        const yesterdayGain = calculatePrice(countYesterday)
        // Процент виручки
        const gainPercent = (((yesterdayGain / gainInDay) - 1) * 100).toFixed(2)
        // Порівняння виручки
        const compareGain = (yesterdayGain - gainInDay).toFixed(2)
        // Порівняння к-ксті заказів
        const compareNumber = (countYesterdayNumber - ordersInDay).toFixed(2)


        res.status(200).json({
            gain: {
                percent: Math.abs(+gainPercent),
                compare: Math.abs(+compareGain),
                yesterday: +yesterdayGain,
                isHigher: +gainPercent > 0
            },
            orders: {
                percent: Math.abs(+ordersPercent),
                compare: Math.abs(+compareNumber),
                yesterday: +countYesterdayNumber,
                isHigher: +ordersPercent > 0
            }
        })
    } catch (e) {
        errorHandler(res, e)
    }
}
module.exports.analytics = async function (req, res) {
    try {
        const allOrders = await Order.find({user: req.user.id}).sort({date: 1})
        const ordersMap = await getOrdersMap(allOrders)

        const average = +(calculatePrice(allOrders) / Object.keys(ordersMap).length).toFixed(2)
        const chart = Object.keys(ordersMap).map(label => {
            const gain = calculatePrice(ordersMap[label])
            const order = ordersMap[label].length
            return {label, order, gain}
        })


        res.status(200).json({
            average,
            chart
        })
    } catch (e) {
        errorHandler(res, e)
    }
}

function getOrdersMap(orders = []) {
    const daysOrders = {}
    orders.forEach(order => {
        const date = moment(order.date).format('DD.MM.YYYY')

        if (date === moment().format('DD.MM.YYYY')) {
            return
        }

        if (!daysOrders[date]) {
            daysOrders[date] = []
        }

        daysOrders[date].push(order)

    })
    return daysOrders
}

function calculatePrice(orders = []) {
    return orders.reduce((total, order) => {
        const orderPrice = order.list.reduce((orderTotal, item) => {
            return orderTotal += item.cost * item.quantity
        }, 0)
        return total += orderPrice
    }, 0)
}
