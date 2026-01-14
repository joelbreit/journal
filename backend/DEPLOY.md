# Backend Deployment Guide

## Prerequisites

✅ AWS CLI installed and configured with credentials
✅ AWS SAM CLI installed
✅ Node.js 20.x installed

## Deployment Steps

### 1. Build the Application

```bash
cd backend
sam build
```

This command:
- Builds all Lambda functions
- Builds the Lambda layer with shared models
- Validates the SAM template

### 2. Deploy (First Time)

```bash
sam deploy --guided
```

You'll be prompted for:
- **Stack Name**: `journal-app-prod` (or your preferred name)
- **AWS Region**: `us-east-1` (or your preferred region)
- **Parameter Stage**: `prod` (press Enter for default)
- **Confirm changes before deploy**: `Y`
- **Allow SAM CLI IAM role creation**: `Y`
- **Disable rollback**: `N`
- **Save arguments to configuration file**: `Y`
- **SAM configuration file**: `samconfig.toml` (press Enter)
- **SAM configuration environment**: `default` (press Enter)

### 3. Deploy (Subsequent Times)

```bash
sam deploy
```

Uses the saved configuration from `samconfig.toml`.

### 4. Capture Outputs

After successful deployment, run:

```bash
aws cloudformation describe-stacks \
  --stack-name journal-app-prod \
  --query 'Stacks[0].Outputs' \
  --output table
```

You'll see outputs like:
```
---------------------------------------------------------------------------
|                            DescribeStacks                              |
+------------------------+-----------------------------------------------+
| OutputKey              | OutputValue                                   |
+------------------------+-----------------------------------------------+
| ApiEndpoint            | https://abc123.execute-api.us-east-1.amazonaws.com/prod |
| UserPoolId             | us-east-1_XXXXXXXXX                          |
| UserPoolClientId       | 1234567890abcdefghijk                        |
| BucketName             | journal-entries-123456789012-prod            |
| Region                 | us-east-1                                    |
+------------------------+-----------------------------------------------+
```

### 5. Update Frontend Configuration

Copy these values to `frontend/.env`:

```bash
VITE_API_URL=<ApiEndpoint value>
VITE_COGNITO_USER_POOL_ID=<UserPoolId value>
VITE_COGNITO_CLIENT_ID=<UserPoolClientId value>
VITE_REGION=<Region value>
```

## Verification

### Test API Endpoint

```bash
# Should return Method Not Allowed (no auth yet)
curl https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/entries
```

### View Logs

```bash
sam logs --tail
```

### Check Created Resources

```bash
# List all resources in the stack
aws cloudformation list-stack-resources \
  --stack-name journal-app-prod \
  --query 'StackResourceSummaries[*].[LogicalResourceId,ResourceType,ResourceStatus]' \
  --output table
```

## Troubleshooting

### Build Errors

If `sam build` fails:
```bash
# Check Node.js version
node --version  # Should be 20.x

# Clear build artifacts
rm -rf .aws-sam
sam build --use-container
```

### Deploy Errors

If deployment fails:
```bash
# Check AWS credentials
aws sts get-caller-identity

# Check permissions
aws iam get-user
```

### Lambda Errors

View specific function logs:
```bash
sam logs -n CreateEntryFunction --tail
sam logs -n ListEntriesFunction --tail
```

## Updating the Stack

After code changes:
```bash
sam build && sam deploy
```

## Deleting the Stack

To tear down everything:
```bash
sam delete --stack-name journal-app-prod
```

⚠️ **Warning**: This will delete all resources including the S3 bucket and all journal entries!

## Cost Estimation

Expected monthly costs for personal use:
- **S3**: ~$0.10 (100MB storage)
- **Lambda**: ~$0.20 (within free tier)
- **API Gateway**: ~$0.35 (within free tier initially)
- **Cognito**: Free (within 50,000 MAU)

**Total**: ~$0.50-1.00/month for light use

## Next Steps

After deployment:
1. ✅ Copy outputs to frontend/.env
2. ✅ Create a test user in Cognito (AWS Console)
3. ✅ Start frontend development server
4. ✅ Test signup/login flow
