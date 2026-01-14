# Journal App Backend

AWS SAM-based serverless backend for the Journal application.

## Prerequisites

- AWS CLI configured with appropriate credentials
- AWS SAM CLI installed ([Installation Guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html))
- Node.js 20.x

## Setup

1. Install Lambda layer dependencies:
```bash
cd src/layers/common/nodejs
npm install
cd ../../../../
```

2. Copy samconfig example:
```bash
cp samconfig.toml.example samconfig.toml
# Edit samconfig.toml with your AWS configuration
```

## Development

### Build
```bash
sam build
```

### Local Testing
```bash
sam local start-api
```

### Deploy
```bash
# First time (guided)
sam deploy --guided

# Subsequent deployments
sam deploy
```

## Infrastructure

All AWS resources are tagged with `Project: journal` for cost tracking.

### Resources Created
- API Gateway (REST API with Cognito authorization)
- Lambda Functions (Create, List, Get, Update, Delete entries)
- S3 Bucket (Journal entries storage)
- Cognito User Pool (User authentication)
- Lambda Layer (Common utilities and AWS SDK)

## Configuration

After deployment, SAM will output:
- `ApiEndpoint` - Use this for VITE_API_URL in frontend
- `UserPoolId` - Use this for VITE_COGNITO_USER_POOL_ID
- `UserPoolClientId` - Use this for VITE_COGNITO_CLIENT_ID
- `Region` - Use this for VITE_REGION
