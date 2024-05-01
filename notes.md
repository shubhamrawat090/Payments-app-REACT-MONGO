BUILD DOCKER
docker build ./ -t mongodb:4.7-replset

AFTER BUILDING, RUN THE IMAGE
docker run --name mongodb-replset -p 27017:27017 mongodb:4.7-replset

YOU CAN NOW OPEN IT IN MONGODB COMPASS AT THE BELOW URL
mongodb://localhost:27017
