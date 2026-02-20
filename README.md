# FlexIt! - Fitness tracker demo app.

## About this app

**FlexIt!** is a web application designed as a modern, user-friendly, and flexible fitness tracker that allows our members to create exercise definitions, track their multiple executions, associate them within workouts, and monitor their personal progress through a consistent and data-oriented approach to historical performance.

The application has been built around two key elements: a backend server based on **Django + Django REST Framework** that acts as a RESTful API with a clear set of endpoints to process the lifecycle of the different core entities used throughout the app, and a frontend client built with **React + Vite** designed as an SPA tightly integrated with the aforementioned API. Together, they provide a modern solution that users can rely on to provide a consistent and reliable service. The application runs on Azure, leveraging the reliability of Azure Container Apps, Azure SQL, Azure Container Registry and other solutions offered by the cloud platform. As the features of the application grow, so will the use of the services offered by the cloud provider.

Do you want to check it out? Feel free to explore it [here](https://flexit-client.victoriousstone-49dcb6b1.westeurope.azurecontainerapps.io/ "FlexIt Fitness App").

## About the client app

The client-facing application is built as a modern SPA that leverages React + Vite to deliver an agile, dynamic, and responsive experience for users interacting with the app. Integration with the backend API is managed via *Axios*, while a custom authentication system [work in progress] manages session state and other global app contexts.

Each new release will introduce additional functionality, potentially including AI-driven features leveraging user-generated data for feedback and recommendations, along with enhanced data visualizations for workout and exercise sessions.

## About the server

The server exposes a RESTful API that leverages the out-of-the-box features offered by *Django REST Framework*, including model serializers, class-based views for standard REST operations, etc. Authentication is managed with *Django-Rest-Knox*, which provides a flexible and secure approach for token management. The API itself is designed to facilitate the integration of multiple solutions beyond the initial SPA + future clients, including native mobile apps for Android and iOS in the near future.
