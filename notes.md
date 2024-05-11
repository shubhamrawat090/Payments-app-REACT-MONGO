> BUILD DOCKER

```
docker build ./ -t mongodb:4.7-replset
```

> AFTER BUILDING, RUN THE IMAGE

```
docker run --name mongodb-replset -p 27017:27017 mongodb:4.7-replset
```

> YOU CAN NOW OPEN IT IN MONGODB COMPASS AT THE BELOW URL

```
mongodb://localhost:27017
```

> THIS ERROR IS OCCURRING IN /transfer ROUTE

```
MongoServerError: Transaction numbers are only allowed on a replica set member or mongos
(https://stackoverflow.com/questions/51461952/mongodb-v4-0-transaction-mongoerror-transaction-numbers-are-only-allowed-on-a)
```
