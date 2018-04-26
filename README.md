# taenil
A side project of taenil

## Documents & Resources

* LINE [Messaging API](https://developers.line.me/en/docs/messaging-api/overview/)
* [line-bot-sdk-nodejs](https://github.com/line/line-bot-sdk-nodejs) github
* [LINE@生活圈](http://at-blog.line.me/tw/)

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

## Notes

* [Heroku Config Vars](https://devcenter.heroku.com/articles/config-vars) for secret and access token
* Push same heroku app from different work place
	```shell
	git remote add heroku https://git.heroku.com/<YOUR_HEROKU_APP_NAME>.git
	```
