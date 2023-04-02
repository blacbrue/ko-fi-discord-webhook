require("dotenv").config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser');

const { Webhook, MessageBuilder } = require('discord-webhook-node');
const hook = new Webhook(process.env["WEBHOOK_URL"]);

const config = require("./config.json")
const port = process.env["PORT"] ?? 4001

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/ko-fi", async (req, res) => {
    // console.log(req.body)
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) return res.sendStatus(204)

    let data;

    try {
        data = JSON.parse(req.body["data"])
    } catch (error) {
        return res.sendStatus(400)
    }

    if (data.verification_token != process.env["VERIFICATION_TOKEN"]) return res.sendStatus(403)

    const date = new Date(data.timestamp).getTime()

    if (config.publicChannel) {
        if (data.shop_items != null && data.shop_items.length > 0) {
            if (config.devMode) {
                console.log(data)
            }

            sendEmbed(data, date, true, true, data.type).then(() => { res.sendStatus(200) })
        } else {
            if (data.is_public == true) {
                if (config.devMode) {
                    console.log(data)
                }

                sendEmbed(data, date, true, true).then(() => { res.sendStatus(200) })
            } else if (data.is_public == false) {
                if (config.devMode) {
                    console.log(data)
                }

                sendEmbed(data, date, false, true).then(() => { res.sendStatus(200) })
            }
        }
    } else {
        if (config.devMode) {
            console.log(data)
        }

        if (data.shop_items != null && data.shop_items.length > 0) {
            sendEmbed(data, date, true, false, data.type).then(() => { res.sendStatus(200) })
        } else {
            sendEmbed(data, date, true, false).then(() => { res.sendStatus(200) })
        }
    }
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

// Functions
function sendEmbed(data, date, isPublic, isPublicChannel, type) {
    if (isPublicChannel) {
        if (type === "Shop Order") {
            const embed = new MessageBuilder()
                .setTitle('New Ko-fi Shop Order!')
                .addField("Public?", data.is_public ? "Yes" : "No", true)
                .addField("Timestamp", `<t:${date}:F>`, true)
                .addField("Name", data.from_name, true)
                .addField(`Amount (${data.currency})`, data.amount, true)
                .setColor('#00b0f4')
                .setDescription('You just got a new shop order in Ko-fi! Below are the details')
                .setTimestamp();

            let secondMsg = ""

            for (let i = 0; i < data.shop_items.length; i++) {
                secondMsg += `__Item #${i + 1}__:\n• Direct Link Code: ${config.linkEmbed ? `https://ko-fi.com/s/${data.shop_items[i].direct_link_code}` : `<https://ko-fi.com/s/${data.shop_items[i].direct_link_code}>`}\n• Variation Name: ${data.shop_items[i].variation_name ?? "None"}\n• Quantity: ${data.shop_items[i].quantity}\n\n`
            }

            return hook.send(embed).then(() => {
                hook.send(
                    `=== **Purchased Shop Items** ===\n${secondMsg}`
                )
            })
        } else {
            if (isPublic) {
                const embed = new MessageBuilder()
                    .setTitle('New Ko-fi Donation!')
                    .addField("Type", data.type, true)
                    .addField("Public?", data.is_public ? "Yes" : "No", true)
                    .addField("Timestamp", `<t:${date}:F>`, true)
                    .addField("Name", data.from_name, true)
                    .addField("Message", data.message ?? "None", true)
                    .addField(`Amount (${data.currency})`, data.amount, true)
                    .addField("Subscription Payment?", data.is_subscription_payment ? "Yes" : "No", true)
                    .addField("First Subscription Payment?", data.is_first_subscription_payment ? "Yes" : "No", true)
                    .addField("Tier Name", data.tier_name ?? "None", true)
                    .setColor('#00b0f4')
                    .setDescription('You just got a new donation in Ko-fi! Below are the details')
                    .setTimestamp();

                return hook.send(embed);
            } else {
                const embed = new MessageBuilder()
                    .setTitle('New Ko-fi Donation!')
                    .addField("Type", data.type, true)
                    .addField("Public?", data.is_public ? "Yes" : "No", true)
                    .addField("Timestamp", `<t:${date}:F>`, true)
                    .addField("Name", data.from_name, true)
                    .addField("Message", "Redacted", true)
                    .addField(`Amount (${data.currency})`, data.amount, true)
                    .addField("Subscription Payment?", data.is_subscription_payment ? "Yes" : "No", true)
                    .addField("First Subscription Payment?", data.is_first_subscription_payment ? "Yes" : "No", true)
                    .addField("Tier Name", data.tier_name ?? "None", true)
                    .setColor('#00b0f4')
                    .setDescription('You just got a new donation in Ko-fi! Below are the details')
                    .setTimestamp();

                return hook.send(embed);
            }
        }
    } else {
        if (type === "Shop Order") {
            const embed = new MessageBuilder()
                .setTitle('New Ko-fi Shop Order!')
                .addField('Message ID', `||${data.message_id}||`, true)
                .addField("Ko-fi Transaction ID", `||${data.kofi_transaction_id}||`, true)
                .addField("\u200b", "\u200b", true)
                .addField("Public?", data.is_public ? "Yes" : "No", true)
                .addField("Timestamp", `<t:${date}:F> (${date})`, true)
                .addField("Name", data.from_name, true)
                .addField(`Amount (${data.currency})`, data.amount, true)
                .addField(`URL`, data.url, true)
                .addField(`Email address`, data.email, true)
                .setColor('#00b0f4')
                .setDescription('You just got a new donation in Ko-fi! Below are the details')
                .setTimestamp();

            let secondMsg = ""

            for (let i = 0; i < data.shop_items.length; i++) {
                secondMsg += `__Item #${i + 1}__:\n• Direct Link Code: ${config.linkEmbed ? `https://ko-fi.com/s/${data.shop_items[i].direct_link_code}` : `<https://ko-fi.com/s/${data.shop_items[i].direct_link_code}>`}\n• Variation Name: ${data.shop_items[i].variation_name ?? "None"}\n• Quantity: ${data.shop_items[i].quantity}\n\n`
            }

            return hook.send(embed).then(() => {
                hook.send(
                    `=== **Purchased Shop Items** ===\n${secondMsg}`
                ).then(() => {
                    if (Object.keys(data.shipping).length != 0 || data.shipping != null) {
                        hook.send(
                            `=== **Shipping Address** ===\nFull Name: ${data.shipping.full_name}\nStreet Address: ${data.shipping.street_address}\nCity: ${data.shipping.city}\nState/Province: ${data.shipping.state_or_province}\nPostal Code: ${data.shipping.postal_code}\nCountry: ${data.shipping.country}\nCountry Code: ${data.shipping.country_code}\nTelephone: ${data.shipping.telephone}`
                        )
                    } else {
                        hook.send(
                            `=== **No Shipping Address** ===`
                        )
                    }
                })
            })
        } else {
            const embed = new MessageBuilder()
                .setTitle('New Ko-fi Donation!')
                .addField('Message ID', `||${data.message_id}||`, true)
                .addField("Ko-fi Transaction ID", `||${data.kofi_transaction_id}||`, true)
                .addField("\u200b", "\u200b", true)
                .addField("Type", data.type, true)
                .addField("Public?", data.is_public ? "Yes" : "No", true)
                .addField("Timestamp", `<t:${date}:F> (${date})`, true)
                .addField("Name", data.from_name, true)
                .addField("Message", data.message ?? "None", true)
                .addField(`Amount (${data.currency})`, data.amount, true)
                .addField(`URL`, data.url, true)
                .addField(`Email address`, data.email, true)
                .addField("\u200b", "\u200b", true)
                .addField("Subscription Payment?", data.is_subscription_payment ? "Yes" : "No", true)
                .addField("First Subscription Payment?", data.is_first_subscription_payment ? "Yes" : "No", true)
                .addField("Tier Name", data.tier_name ?? "None", true)
                .setColor('#00b0f4')
                .setDescription('You just got a new donation in Ko-fi! Below are the details')
                .setTimestamp();

            return hook.send(embed);
        }
    }
}