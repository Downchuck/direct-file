# Email Service

This service is responsible for sending emails based on messages from an SQS queue.

## Setup

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Create a `.env` file in this directory with the following variables:
    ```
    PORT=3000
    AWS_REGION=
    SQS_QUEUE_URL=
    SMTP_HOST=
    SMTP_PORT=
    SMTP_SECURE=
    SMTP_USER=
    SMTP_PASS=
    EMAIL_FROM=
    ```

## Running the service

```bash
npm run dev
```

This will start the service with `ts-node-dev`, which will automatically restart the service on file changes.

## Building for production

```bash
npm run build
```

This will compile the TypeScript code to JavaScript in the `dist` directory.

## Running in production

```bash
npm start
```

This will run the compiled JavaScript code from the `dist` directory.
