# Dikky Client

This repository contains a web client for a multiplayer card game. The game allows up to four players to join and play against each other in real time.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Tech Stack](#tech)
- [Contributing](#contributing)
- [License](#license)

## Installation

To run this project locally, you need to have [Node.js](https://nodejs.org/en/) installed on your computer.

1. Clone the repository: `git clone https://github.com/tikabsic/cardgameclient.git`
2. Install dependencies: `npm install`
3. Start the development server: `npm start`

## Usage

To use the web client, simply open your web browser and navigate to `http://localhost:8080`. The web client will connect to the server automatically.

## Features

The web client includes the following features:

- Registration of new users.
- Authentication based on JWT token.
- Creating game rooms.
- Joining specific rooms based on their IDs.
- Multiplayer games with up to four players.
- Real-time communication between clients and the server using SignalR.
- Real-time chat during the game.

## Tech

The web client uses the following technologies:

- JavaScript
- HTML/CSS
- [SignalR](https://docs.microsoft.com/en-us/aspnet/core/signalr/introduction?view=aspnetcore-5.0) for real-time communication

## Contributing

If you would like to contribute to this project, feel free to create a pull request. Please make sure to follow the existing code style and write clear commit messages.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
