# taenil
A side project of taenil

## Features

### Public Features

| Timing   | Keyword & Parameters         | Description |
| -------- | ---------------------------- | ----------- |
| follow   | N/A                          | :o: Add user information when bot is added as a friend (or unblocked) |
| message  | N/A                          | :o: Echo user's message back when not in keyword list |
| message  | [MY_INFO]                    | :o: Display user info with available actions |
| postback | cmd=SET_MOBILE               | :o: Provide setting mobile prompt and change system operation state to SETTING_MOBILE |
| message  | ANY                          | :o: While system operation state is SETTING_MOBILE, check mobile format and update user mobile, then state back to NONE |
| message  | [SHOPPING]                   | :o: Display shopping list |
| postback | cmd=BUY&mid=${id}            | :o: Reply buy confirm message when user tap buy button on shopping list |
| postback | cmd=BUY_CONFIRMED&mid=${id}  | :x: Create order when user tap buy confirm button, and reply order information |

### Admin-only Features

| Timing   | Keyword & Parameters         | Description |
| -------- | ---------------------------- | ----------- |
| message  | [ALL_USERS]                  | :o: Show all users information |
| message  | [DEPOSIT] ${name} ${points}  | :o: Add points to user with target LINE name |

### Dev-only Features (!!REMOVE_WHEN_PRODUCTION!!)

| Timing   | Keyword & Parameters         | Description |
| -------- | ---------------------------- | ----------- |
| message  | [ADD_ME]                     | :o: Add current user just like follow event |
| message  | [DELETE_ALL_USERS]           | :o: Delete all users information, **DEV_ONLY**, **REMOVE_WHEN_PRODUCTION** |

## Documents & Resources

* LINE [Messaging API](https://developers.line.me/en/docs/messaging-api/overview/)
* [line-bot-sdk-nodejs](https://github.com/line/line-bot-sdk-nodejs) github
* [LINE@生活圈](http://at-blog.line.me/tw/)
* Getting Started on [Heroku with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
* MongoLab MongoDB [Mongoose Node.js Demo on Heroku](https://github.com/mongolab/hello-mongoose)

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
* [ ] MongoDB on Heroku
  - [x] Open datebase with simple schema
    - Use [mongolab](https://devcenter.heroku.com/articles/mongolab) (Heroku add-ons, sandbox for free)
      - Adopt, `heroku addons:create mongolab`
      - Connection URI will be set in Heroku config, `heroku config:get MONGODB_URI
    `
      - App should use connection URI via `process.env.MONGODB_URI`
  - [ ] Add, Get, Update, Delete
    - [x] addUser, getUsers, updateUserPoints
  - [ ] Integrate with LINE Messaging API flow
    - [x] ADD_ME, SHOW_ALL_USERS, ADD_POINTS_TO_USER
* [x] Setup Rich Menu via [LINE@ MANAGER](https://admin-official.line.me/)
* [ ] [Template Messages](https://developers.line.me/en/docs/messaging-api/reference/#template-messages) (Buttons, Confirm, Carousel, Image carousel)
  - [x] Carousel template
  - [x] Handle postback events
    - Example of postback data, `command=BUY&itemId=001`
* [x] [IFTTT](https://ifttt.com/discover) Applet, if PR, then send LINE message

## Notes

* [Heroku Config Vars](https://devcenter.heroku.com/articles/config-vars) for secret and access token
* Push same heroku app from different work place
	```shell
	git remote add heroku https://git.heroku.com/<YOUR_HEROKU_APP_NAME>.git
	```
