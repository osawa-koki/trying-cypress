FROM node:20 as builder
WORKDIR /src/
COPY ./package.json ./yarn.lock ./
RUN yarn install --frozen-lockfile --non-interactive --production
COPY ./ ./
RUN yarn build

FROM nginx:1.25 as server
COPY --from=builder /src/out/ /usr/share/nginx/html/
