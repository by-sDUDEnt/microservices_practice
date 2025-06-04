# 🧩 Microservices Practice

A personal DevOps project to explore and practice microservices architecture, focusing on building and managing multiple services with Docker and Node.js.

## 📁 Project Structure

```
microservices_practice/
├── lab1/
├── lab2/
├── lab3/
├── lab4/
├── lab5/
├── lab6/
└── README.md
```

- **lab1/** to **lab6/**: Each directory represents a lab or module focusing on different aspects of microservices, such as service communication, data management, and deployment strategies.
- **README.md**: Project overview and setup instructions.

## 🛠️ Technologies Used

- **Node.js**: Runtime environment for building scalable network applications.
- **Docker**: Containerization platform to package services and their dependencies.
- **Express.js**: Web framework for Node.js to build APIs.
- **MongoDB**: NoSQL database for data storage.
- **Redis**: In-memory data structure store, used as a database, cache, and message broker.
- **Nginx**: Web server used as a reverse proxy, load balancer, and HTTP cache.

## 🚀 Getting Started

### Prerequisites

- Docker and Docker Compose installed on your machine.
- Node.js and npm installed if you plan to run services outside Docker.

### Deployment Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/by-sDUDEnt/microservices_practice.git
   cd microservices_practice
   ```

2. **Navigate to a Lab Directory**

   Choose a lab to work on, for example:

   ```bash
   cd lab1
   ```

3. **Build and Run Services with Docker Compose**

   ```bash
   docker-compose up --build
   ```

4. **Access the Application**

   - Services will be accessible via `http://localhost:<port>` as configured in each lab's `docker-compose.yml`.
   - Refer to the specific lab's README or documentation for detailed information on endpoints and usage.

## 📓 Lab Descriptions

- **lab1/**: Introduction to microservices and Docker.
- **lab2/**: Implementing service communication using REST APIs.
- **lab3/**: Integrating MongoDB for data persistence.
- **lab4/**: Adding Redis for caching and message brokering.
- **lab5/**: Setting up Nginx as a reverse proxy and load balancer.
- **lab6/**: Orchestrating services and handling failures.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
