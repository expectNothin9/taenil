# taenil
A side project of [taenil](https://serene-falls-99879.herokuapp.com/)

## Todos
* [ ] lint

## Development

### Prerequisites

LINE Messaging API `CHANNEL_ACCESS_TOKEN` and `CHANNEL_SECRET` in local `.env` file (**DO NOT COMMIT**), check [LINE Developer Guides](https://developers.line.biz/en/docs/messaging-api/getting-started/) for details.

### Install & Run

```bash
» npm ci
» npm run dev
```

## Documents & Resources

* LINE [Messaging API](https://developers.line.me/en/docs/messaging-api/overview/)
* [line-bot-sdk-nodejs](https://github.com/line/line-bot-sdk-nodejs) github
* [LINE@生活圈](http://at-blog.line.me/tw/)
* Getting Started on [Heroku with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
* MongoLab MongoDB [Mongoose Node.js Demo on Heroku](https://github.com/mongolab/hello-mongoose)
* [Dotenv + Nodemon](https://medium.com/@pdx.lucasm/dotenv-nodemon-a380629e8bff), using environment variables the right way

## Progress

* [x] [LINE Developers console](https://developers.line.me/console/register/messaging-api/provider/) registration
* [x] Create a channel (required for Messaging API)
* [x] [LINE@](https://admin-official.line.me/) account (auto-created, bind with channel)
* [x] Building a sample bot with Heroku
  - [x] Prepare LINE channel `SECRET` and `ACCESS_TOKEN`
  - [x] Install [Heroku CLI](https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up) and `heroku login`
  - [x] echo-bot and deploy to Heroku
    - Move to app folder, `heroku create` and `git push heroku master`
    - Use `heroku ps:scale web=1` to ensure that at least one instance is running
    - View logs via `heroku logs --tail`
    - Set secret variables into Heroku config, then app can use via `process.env.<secret_variable_name>`
    	```shell
    	heroku config:set CHANNEL_SECRET=<YOUR_SECRET>
    	heroku config:set CHANNEL_ACCESS_TOKEN=<YOUR_ACCESS_TOKEN>
    	```
  - [x] Enable webhooks and set Webhook URL on LINE Developers console
    - ex: <YOUR_HEROKU_APP_NAME>.herokuapp.com/webhook
* [x] MongoDB on Heroku
  - [x] Open datebase with simple schema
    - Use [mongolab](https://devcenter.heroku.com/articles/mongolab) (Heroku add-ons, sandbox for free)
      - Adopt, `heroku addons:create mongolab`
      - Connection URI will be set in Heroku config, `heroku config:get MONGODB_URI
    `
      - App should use connection URI via `process.env.MONGODB_URI`
  - [x] Add, Get, Update, Delete
  - [x] Integrate with LINE Messaging API flow
* [x] Setup Rich Menu via [LINE@ MANAGER](https://admin-official.line.me/)
* [x] [Template Messages](https://developers.line.me/en/docs/messaging-api/reference/#template-messages) (Buttons, Confirm, Carousel, Image carousel)
  - [x] Buttons , Confirm, Carousel template
  - [ ] Image carousel template
  - [x] Handle postback events
    - Example of postback data, `cmd=BUY&mid=001`
* [x] [IFTTT](https://ifttt.com/discover) Applet, if PR, then send LINE message

## Notes

* [Heroku Config Vars](https://devcenter.heroku.com/articles/config-vars) for secret and access token
* Push same heroku app from different work place
	```shell
	git remote add heroku https://git.heroku.com/<YOUR_HEROKU_APP_NAME>.git
	```
