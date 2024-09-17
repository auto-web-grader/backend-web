#!/bin/bash

# Check if an argument was provided
if [ -z "$1" ]; then
    echo "No argument provided!"
    exit 1
fi

# Get the application path from the first argument
app_path="$1"

# Start the HTTP server and record its PID
http-server "$app_path" &
http_server_pid=$!

# Define the Express server file name
express_server="app.js"

# Start the Express server and record its PID
node "$app_path/$express_server" &
express_server_pid=$!

# Define the Cypress script path
cypress_script_path="cypress/e2e/spec.cy.js"
output_name="/output.txt"
echo $app_path

# Run the Cypress tests and save the output to test.txt
npx cypress run --spec "$cypress_script_path" > $app_path$output_name

# Shut down the HTTP server and Express server
kill $http_server_pid
kill $express_server_pid

echo "Servers shut down successfully!"

