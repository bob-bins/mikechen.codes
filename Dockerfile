FROM node:alpine3.12
RUN apk add --update bash curl

WORKDIR /code

COPY package.json yarn.lock ./
RUN yarn install
COPY tsconfig.json webpack.config.js ./
COPY src/ src/
RUN yarn build

ENTRYPOINT ["bash", "-c"]
CMD ["yarn start"]