# Cat Tinder Backend
This app is built using Ruby on Rails, SQlite, and Rspec.  It is an API to drive the front end React application.

## Development Setup
Clone the repo then:
```
cd backend
bundle install
rake db:create db:migrate
rails s
```

## Tests
Once the app is setup for development, you can run the specs:
```
bundle exec rspec spec
```
