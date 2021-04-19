# Budget Tracker

## Description

Budget Tracker is a mobile-first full stack application that allows users to track their expenditures as a total. A user may input a transaction they wish to note and add or subtract it from their current total. This total is tracked over time via a chart at the bottom of the app.

This is a progressive web application, or PWA, so users can download it directly to their own devices for local use. Budget Tracker utilizes service worker caching and IndexedDB in order to remain functional offline. This allows users to continue using the application with no problems, even with a poor internet connection.

![budget-tracker-screenshot](https://user-images.githubusercontent.com/59624292/115185360-890f0900-a094-11eb-8111-85f5c3bfda35.png)


## Usage

This project is hosted online using Heroku, at:
https://desolate-inlet-48182.herokuapp.com/

If you wish to host the Budget Tracker server on your local machine, refer to the Installation section of this README.


## Installation

Follow the steps below to install the Budget Tracker server on your local machine. This application requires Node.js and MongoDB installed on your machine in order to run.

1. Clone this repository to your local machine.
2. Navigate to the root directory of this project in your console.
3. Use ``` npm install ``` to install the dependencies for this project.
4. You may now host the Budget Tracker server using ``` npm start ```.
