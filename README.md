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
* [ ] Building a sample bot with Heroku
  - [ ] Prepare LINE channel `SECRET` and `ACCESS_TOKEN`
  - [x] Install [Heroku CLI](https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up) and `heroku login`
  - [ ] echo-bot and deploy to Heroku
    - Move to app folder, `heroku create` and `git push heroku master`
    - Use `heroku ps:scale web=1` to ensure that at least one instance is running
    - View logs via `heroku logs --tail`

## Notes

* [Heroku Config Vars](https://devcenter.heroku.com/articles/config-vars) for secret and access token
