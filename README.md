# atare-rides

 A functional rest API for a ride-sharing app using node js (typescript) and express js. The API fetchs data from a functional MySQl database.

## Documentation

The api consists of four collections the user routes, trip routes and the payment routes.

[API Documentation](https://www.postman.com/quester-deca/workspace/atare-rides/overview)

### User Routes

These routes facilite the sign up and log in of the various users.

### Trip Routes

This facilites creation, fetching all trips or a single trip, as well as updating them when necessary.

### Payment Routes

The fund routes facilitates, a user transfering funds to other users, a user's withdrawal to their bank account, and user wallet credit.

### Payment Services

Paystack was incoporated to handle payments, here is a link to their Documentation.

[Paystack API Documentation](https://paystack.com/docs/)

## Entity-Relationship Diagram

[E-R Diagram](https://dbdesigner.page.link/3uYBsLPAwMDWTeEZA)

## Environment Variables

To run this project, you will need to add a .db.env file and an .env file.

### For the .db.env file add the following environment variables

`MYSQL_ROOT_PASSWORD` this is the root password for your MySQL database.

`MYSQL_DATABASE` this is whatever name you wish to call your database.

`MYSQL_USER` this is whatever name of the intended user of the database.

`MYSQL_PASSWORD` this is the password for said user to login.

`MYSQL_HOME` this is the path to the directory in which the server-specific my.cnf file resides.

### For the .env file add the following environment variables

`JWT_SECRET`  this is your secret used for token generation

`ROOT_URL`  this is the base url of your app for example <http://locahost:3000> or the link of your deployed app.

`DATABASE` the same value as `MYSQL_DATABASE` in your .db.env.

`DB_USER` the same value as `MYSQL_USER` in your .db.env.

`DB_PASSWORD` the same value as `MYSQL_PASSWORD` in your .db.env.

`DB_HOST` what host your database will connect through.

`DB_PORT` the same value as the port exposed from docker.

`DB_DIALECT` the dialect you wish communicate with your database.

`LD_RUN_PATH` used to specify the location of libmysqlclient.so.

`PAYSTACK_SECRET_KEY` the same as your secret api key gotten from your paystack dashboard.

## Run Locally

To run this project you must have docker desktop installed and running  on your local machine.
You will also need to create an account with paystack, depending on what you want to work with,
in other to get your api keys.

Clone the project

```bash
  git clone git@github.com:DarthVve/atare-rides.git
```

Go to the project directory

```bash
  cd atare-rides
```

Install dependencies

```bash
  yarn install
```

Compile to typescrit

```bash
  yarn build
```

Start the server

```bash
  yarn start
```

OR

```bash
  yarn dev
```

 to start the server in development mode

## Running Tests

To run tests, run the following command

```bash
  yarn test
```

## Deployment

This project was deployed on Fly.io. Here is the link to the base url.
Check the documentation to get an overview and details of it's use cases.

<https://atare-rides.fly.dev>

NB: The above link may not function properly during deployment due to some technical difficulties, docker needs to be installed in the container orchestration.

## Authors

- [Engr. Majoroh](https://www.linkedin.com/in/viremaj)
