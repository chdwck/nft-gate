FROM --platform=linux/amd64 node:16.3.0-alpine3.13

# Create destination directory
RUN mkdir -p /usr/src/nft-gate-web
WORKDIR /usr/src/nft-gate-web

# Update & Install dependencies
RUN apk update && apk upgrade
RUN apk add git

# copy the app, note .dockerignore
COPY . /usr/src/nft-gate-web/
RUN npm install

# Build the app
RUN npm run build

EXPOSE 3000

ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

CMD [ "node", ".output/server/index.mjs" ]