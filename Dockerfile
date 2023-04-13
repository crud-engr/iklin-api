FROM node:16.17.0-alpine
WORKDIR /usr
COPY package.json ./
COPY tsconfig.json ./
COPY . ./
RUN ls -a
RUN npm install

FROM node:16.17.0-alpine
WORKDIR /usr
COPY package.json ./
RUN npm install --only=production
COPY --from=0 /usr .
RUN ls -a
EXPOSE 3003
RUN npm run build
CMD ["node","/usr/dist/app.js"]