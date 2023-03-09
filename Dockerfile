FROM node:16.15 AS base_node
FROM python:3.9-slim AS base_python
FROM nginx:1.23.3-alpine AS base_nginx


# build web page
FROM base_node AS node_build

WORKDIR /app

COPY ./package.json ./package-lock.json ./
RUN npm install

COPY ./ .
RUN npm run build


# final web server
FROM base_nginx AS final

RUN mkdir -p /app/static
COPY --chown=1000:1000 --from=node_build /app/dist /app/static/nomad-lab
ADD ./nginx.conf /etc/nginx/nginx.conf
