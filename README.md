# Ko-fi & Discord Webhook Integration
Ko-fi and Discord Webhook API Integration made with [Node.js](https://nodejs.org) and the [`express`](https:///npmjs.org/package/express) library

`.env` File Template:
```
PORT = 8080
VERIFICATION_TOKEN = ""
WEBHOOK_URL = ""
```
- Get `VERIFICATION_TOKEN` from https://ko-fi.com/manage/webhooks > API > Webhooks > Dropdown Menu "Advanced" > Verification Token > Copy the code in the text field and paste it in the `.env` file
- Get `WEBHOOK_URL` from creating a webhook for a Discord Channel. Copy the webhook URL and paste it in the `.env` file

___

`config.json` Explanined:
```
{
  "publicChannel": false,
  "devMode": true,
  "linkEmbed": false
}
```
- Set `publicChannel` to `true` if you are planning to show payments in a channel where all members can view
- Set `devMode` to `true` if you want JSON data to be printed in the Terminal/Console
- Set `linkEmbed` to `true` if you want embeds to be shown from links when there is a new shop order.