## Invoice App

An application meant to facilitate the process of writing up a traditional invoice.
Keeping track of goods sent and services provided should be a computer's job.

## [Demo](https://www.youtube.com/watch?v=BpFPk3wXWZk&t=4s)

## UML

<div style="text-align: center;">
<img width="950" height="550" src="./screenshots/uml.jpg">
</div>

## Screenshots

<div style="text-align: center;">
<img width="950" height="550" src="./screenshots/dashboard.png">
</div>
<br>
<div style="text-align: center;">
<img width="950" height="550" src="./screenshots/inside-doc.png">
</div>

## Features

* **CRUD on**
    - products
    - documents
    - providers

* Keep track of the actions performed throughout the application

* Generate invoice from documents in **PDF**/**Excel** format

## Getting Started
```bash
git clone https://github.com/Andrei0872/invoice-app.git
```

```bash
cd client/ && npm i && cd - && cd server/ && npm i && cd -
```

```bash
cp server/.env.example server/.env
# Then, add the information needed
```

```bash
# Open a new terminal tab (CTRL + SHIFT + T)
cd client/ && npm run serve
cd server/ && npm run dev
```

## Behind the scenes

### A common pattern for *provider*, *product* and *document* entities.
All the above mentioned entities rely on a single piece of logic([a vuex module](https://github.com/Andrei0872/vue-invoice-app/blob/master/client/src/store/modules/common/index.js) + common methods found in a [mixin](https://github.com/Andrei0872/vue-invoice-app/blob/master/client/src/mixins/commonMixin.js)) that it's been written once
and used multiple times.

### History
[Here](https://dev.to/anduser96/vue-js-sharing-data-between-components-with-vue-observable-2lc) you can read more about the technique I've used to implement such feature.

## App structure 
```
.
├── client
│   ├── dist
│   ├── src
│   ├── babel.config.js
│   ├── package.json
│   ├── package-lock.json
│   └── vue.config.js
├── server
│   ├── controllers
│   ├── db
│   ├── routes
│   ├── services
│   ├── utils
│   ├── app.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
└── readme.md
```

## Acknowledgements

This project stems from my desire to improve my knowledge through building applications.  
Knowing that this application could also help someone, that motivated me even more.