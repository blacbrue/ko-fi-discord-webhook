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
    data = JSON.parse(req.body["data"])

    if (data.verification_token != process.env["VERIFICATION_TOKEN"]) return;

    const { verification_token, message_id, timestamp, type, is_public, from_name, message, amount, url, email, currency, is_subscription_payment, is_first_subscription_payment, kofi_transaction_id, tier_name, shop_items } = JSON.parse(req.body["data"]);

    const date = new Date(timestamp).getTime()

    if (config.publicChannel) {
        if (is_public == true) {
            if (config.devMode) {
                console.log(data)
            }

            const embed = new MessageBuilder()
                .setTitle('New Ko-fi Donation!')
                .addField("Type", type, true)
                .addField("Public?", is_public ? "Yes" : "No", true)
                .addField("Timestamp", `<t:${date}:F>`, true)
                .addField("Name", from_name, true)
                .addField("Message", message != null ? message : "None", true)
                .addField(`Amount (${currency})`, amount, true)
                .addField("Subscription Payment?", is_subscription_payment ? "Yes" : "No", true)
                .addField("First Subscription Payment?", is_first_subscription_payment ? "Yes" : "No", true)
                .addField("Tier Name", tier_name == null ? "None" : tier_name, true)
                .setColor('#00b0f4')
                .setDescription('You just got a new donation in Ko-fi! Below are the details')
                .setTimestamp();

            hook.send(embed);
        } else if (is_public == false) {
            if (config.devMode) {
                console.log(data)
            }

            const embed = new MessageBuilder()
                .setTitle('New Ko-fi Donation!')
                .addField("Type", type, true)
                .addField("Public?", is_public ? "Yes" : "No", true)
                .addField("Timestamp", `<t:${date}:F>`, true)
                .addField("Name", from_name, true)
                .addField("Message", message != null ? "Redacted" : "None", true)
                .addField(`Amount (${currency})`, amount, true)
                .addField("Subscription Payment?", is_subscription_payment ? "Yes" : "No", true)
                .addField("First Subscription Payment?", is_first_subscription_payment ? "Yes" : "No", true)
                .addField("Tier Name", tier_name == null ? "None" : tier_name, true)
                .setColor('#00b0f4')
                .setDescription('You just got a new donation in Ko-fi! Below are the details')
                .setTimestamp();

            hook.send(embed);
        }
    } else {
        if (config.devMode) {
            console.log(data)
        }

        const embed = new MessageBuilder()
            .setTitle('New Ko-fi Donation!')
            .addField('Message ID', `||${message_id}||`, true)
            .addField("Ko-fi Transaction ID", `||${kofi_transaction_id}||`, true)
            .addField("\u200b", "\u200b", true)
            .addField("Type", type, true)
            .addField("Public?", is_public ? "Yes" : "No", true)
            .addField("Timestamp", `<t:${date}:F> (${date})`, true)
            .addField("Name", from_name, true)
            .addField("Message", message != null ? message : "None", true)
            .addField(`Amount (${currency})`, amount, true)
            .addField(`URL`, url, true)
            .addField(`Email address`, email, true)
            .addField("\u200b", "\u200b", true)
            .addField("Subscription Payment?", is_subscription_payment ? "Yes" : "No", true)
            .addField("First Subscription Payment?", is_first_subscription_payment ? "Yes" : "No", true)
            .addField("Tier Name", tier_name == null ? "None" : tier_name, true)
            .setColor('#00b0f4')
            .setDescription('You just got a new donation in Ko-fi! Below are the details')
            .setTimestamp();

        hook.send(embed);
    }
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})