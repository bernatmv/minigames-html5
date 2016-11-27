# local
# docker build -t jaken/server .
# aws
# aws ecr get-login --region eu-west-1
# docker build -t jankengame/server .
# docker images
# GET IMAGE ID
# docker tag jankengame/server 318806095243.dkr.ecr.eu-west-1.amazonaws.com/jankengame/server
# docker push 318806095243.dkr.ecr.eu-west-1.amazonaws.com/jankengame/server

FROM mhart/alpine-node:6.9.1

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app
COPY ./public /usr/src/app/public

EXPOSE 9000
CMD [ "npm", "start" ]