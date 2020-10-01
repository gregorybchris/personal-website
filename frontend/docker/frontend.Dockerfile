FROM node:14-alpine3.10

WORKDIR /app
# ENV PATH ../app/node_modules/.bin:$PATH

COPY package*.json ./
RUN npm install

COPY . ./
RUN npm run build
RUN npm install -g serve

EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
