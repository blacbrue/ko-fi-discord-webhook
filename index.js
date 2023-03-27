const express = require('express')
const app = express()
const bodyParser = require('body-parser');

const { Webhook, MessageBuilder } = require('discord-webhook-node');
const hook = new Webhook(process.env["WEBHOOK_URL"]);

const config = require("./config.json")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/ko-fi", async (req, res) => {
  data = JSON.parse(req.body["data"])

  if (data.verification_token != process.env["VERIFICATION_TOKEN"]) return;

  const { verification_token, message_id, timestamp, type, is_public, from_name, message, amount, url, email, currency, is_subscription_payment, is_first_subscription_payment, kofi_transaction_id, tier_name } = JSON.parse(req.body["data"]);

  if (config.publicChannel) {
    console.log(data)

    const date = new Date(timestamp).getTime()

    // const embed = new MessageBuilder()
    //   .setTitle('My title here')
    //   .setAuthor('Author here', 'https://cdn.discordapp.com/embed/avatars/0.png', 'https://www.google.com')
    //   .setURL('https://www.google.com')
    //   .addField('First field', 'this is inline', true)
    //   .addField('Second field', 'this is not inline')
    //   .setColor('#00b0f4')
    //   .setThumbnail('https://cdn.discordapp.com/embed/avatars/0.png')
    //   .setDescription('Oh look a description :)')
    //   .setImage('https://cdn.discordapp.com/embed/avatars/0.png')
    //   .setFooter('Hey its a footer', 'https://cdn.discordapp.com/embed/avatars/0.png')
    //   .setTimestamp();

    if (is_public == true) {
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
    console.log(data)

    const date = new Date(timestamp).getTime()

    // const embed = new MessageBuilder()
    //   .setTitle('My title here')
    //   .setAuthor('Author here', 'https://cdn.discordapp.com/embed/avatars/0.png', 'https://www.google.com')
    //   .setURL('https://www.google.com')
    //   .addField('First field', 'this is inline', true)
    //   .addField('Second field', 'this is not inline')
    //   .setColor('#00b0f4')
    //   .setThumbnail('https://cdn.discordapp.com/embed/avatars/0.png')
    //   .setDescription('Oh look a description :)')
    //   .setImage('https://cdn.discordapp.com/embed/avatars/0.png')
    //   .setFooter('Hey its a footer', 'https://cdn.discordapp.com/embed/avatars/0.png')
    //   .setTimestamp();

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

app.listen(process.env["PORT"])