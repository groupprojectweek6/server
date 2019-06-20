1. Install : npm install --save 
  - bcryptjs
  - cors
  - dotenv
  - express
  - jsonwebtoken
  - mongoose
  Install : npm install --save-dev
  - dotenv
2. Make folder: controllers, helpers, middlewares, models, routes
3. Make file
  - .gitignore /node_modules && .env
  - app.js
    - change database name
  - routes: index.js model.js
  - models: model.js model-user.js model-blacklist-token.js
  - middlewares: author-authen.js error-handlers.js
  - helpers: hash-helpers.js jwthelper.js
  - controller: controller-user.js controller-model.js
  - .env :
    JWT_TOKEN=
    DATABASE_CONNECTION=mongodb://localhost:27017/mini_wp_db
    PORT=3000 
  - tambahan di package json
    "dev": "export NODE_ENV=development && nodemon app.js",
    "start": "node app.js"

4. 