#!/bin/bash

function dev_env () {
  cd /home/anduser/Documents/vue-invoice-app/

  docker-compose -f docker-compose.yml --env-file ./server/.env -p "$(basename $(pwd))_DEV" down -v \
    && openssl rand -base64 32 > ./server/.key \
    && docker-compose -f docker-compose.yml --env-file ./server/.env -p "$(basename $(pwd))_DEV" up
}

function prod_env () {
  cd $APP_PATH

  docker-compose -f docker-compose.prod.yml --env-file ./server/.env -p "$(basename $(pwd))_PROD" down -v \
    && openssl rand -base64 32 > ./server/.key \
    && docker-compose -f docker-compose.prod.yml --env-file ./server/.env -p "$(basename $(pwd))_PROD" up -d
}

if [[ $APP_ENV == "DEV" ]]
then
  dev_env
elif [[ $APP_ENV == "PROD" ]]
then
  prod_env
fi