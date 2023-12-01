FROM node:20-alpine as dependancies

COPY package.json .
COPY package-lock.json .

RUN npm install


FROM node:20-alpine as build


COPY --from=dependancies package.json .
COPY --from=dependancies node_modules node_modules
COPY . .

ENV NODE_ENV=production
RUN npm run build


FROM node:20-alpine as release

ENV NODE_ENV=production
COPY --from=build dist dist
COPY --from=build package.json .

EXPOSE 3000

CMD [ "npm", "start" ]