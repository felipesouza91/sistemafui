# build environment
FROM node:14.18.1-slim as builder
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .
RUN npm run build:prod

### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /usr/src/app/dist/sistemafui /usr/share/nginx/html

CMD ["/bin/sh", "-c", \
  "echo API_URL=[$API_URL], && \
  sed -i s#API_SERVER_URL#$API_URL#g /usr/share/nginx/html/main.*.js && \
  sed -i s#API_SERVER_IP#$API_IP#g /usr/share/nginx/html/main.*.js && \
  sed -i s#CALLBACK_URL#$CALLBACK_URL#g /usr/share/nginx/html/main.*.js && \
  sed -i s#APP_URL#$APP_URL#g /usr/share/nginx/html/main.*.js && \
  sed -i s#CLIENT_SECRET#$CLIENT_SECRET#g /usr/share/nginx/html/main.*.js && \
  nginx -g 'daemon off;'"]
