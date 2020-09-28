FROM node:14-alpine3.10

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY . ./

CMD ["npm", "start"]

# docker build -t blog -f frontend/apps/blog/blog.Dockerfile frontend/apps/blog 
# docker run -it -p 3001:3000 blog:latest
