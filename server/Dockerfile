FROM node:14
WORKDIR /usr/app/server
COPY package*.json ./
RUN npm install
COPY . .
CMD ./run_prod.sh