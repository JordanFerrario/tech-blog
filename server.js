import express from "express";
import session from "express-session";
import handlebars from "express-handlebars";
import path from "path";

// import Sequelize store for session storage
import SequelizeStore from "connect-session-sequelize";

// import database config
import sequelize from "./config/connection.js";

// set up express app
const app = express();
const PORT = process.env.PORT || 3000;

// set up session with Sequelize store
const sess = {
  secret: "assword", // change to env in production
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

// set up handelbars as the templating engine
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serving static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// importing routes
import apiRoutes from "./controllers/apiRoutes.js";
import homeRoutes from "./controllers/homeRoutes.js";

app.use(apiRoutes);
app.use(homeRoutes);

// syncing the Sequelize models to the database, then starting the server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
});
