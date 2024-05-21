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

[MongoServerError: Transaction numbers are only allowed on a replica set member or mongos](https://stackoverflow.com/questions/51461952/mongodb-v4-0-transaction-mongoerror-transaction-numbers-are-only-allowed-on-a)

> CHECK IF SIGNIN OR NOT

```
Should expose a '/me' endpoint in which we send the token and it will send back the user info if the user is logged in.
If it sends a valid response then we should redirect to /dashboard page.
If it send NULL then we should redirect to /signin page
This /me endpoint should be hit at every page to check whether a user is logged in or not.
```
