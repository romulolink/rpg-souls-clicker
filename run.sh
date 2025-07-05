#!/bin/bash

# Comando para construir a imagem Docker

# docker build --no-cache -t node-app  .
# docker build -t node-app .

# docker stop node-app

# docker rm node-app

# Comando para executar o contêiner Docker
# docker run -p 8000:8000 --name node-app -d node-app 

# docker ps -a | head -n 10

# start chrome.exe http://localhost:3000/

nodemon app.js
