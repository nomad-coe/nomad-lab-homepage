FROM node:16.15 AS base_node
FROM nginx:1.23.3-alpine AS base_nginx

FROM base_node AS dev_node

WORKDIR /app

COPY ./package.json ./package-lock.json ./
RUN npm install

COPY ./ .
RUN npm run build

FROM base_nginx AS final

RUN mkdir -p /app/static
COPY --chown=1000:1000 --from=dev_node /app/dist /app/static/nomad-lab
ADD ./nginx.conf /etc/nginx/nginx.conf
