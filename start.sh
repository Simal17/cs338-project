#!/bin/bash
echo "Starting both frontend and backend"
ng serve &
node server.js
