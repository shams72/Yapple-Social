
# Yapple Frontend

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

## Development

- Built with Vite for fast development
- TypeScript for type safety
- ESLint for code quality
- Material-UI for consistent design
- WebSocket for real-time features


## Docker Support
Make sure you have the following installed:
- [Docker](https://docs.docker.com/get-docker/)

### Installation & Setup


1. Start the Frontend container:
   ```sh
   docker compose up --build frontend
   ```

   This will fire up the Frontend container.

2. To stop the container:
   ```sh
   docker compose down
   ```


## Environment Variables

Required environment variables:
- `API_URL`: Backend API endpoint
- `WS_URL`: WebSocket server URL

### Click Here to view the Frontend Documentation

[Click Here to view the Frontend Documentation](./documentation)


### Click Here to view the Frontend Project Structure


[Click Here to view the Frontend Structure](./projectStructure)


## Some things we are missing becuase of time / communication constraints (retrospective)
- Global auth state / auth context for the logged in user
- An axios API layer for all of our api calls
- A type folder for all of our types to keep our code clean, uniform and organized
- More use of reusable components. Communicating with components we want to reuse early
- Better state management with zustand or redux
- Better pagination for lists of posts, communities, friends, etc. (infinite scroll) 



