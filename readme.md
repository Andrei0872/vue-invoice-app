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