# EC2 Instance Metadata

EC2 Instance Metadata is data about your EC2 instance that the instance can query from within itself

- The URL is **http://169.254.169.254/latest/meta-data**
- You can retrieve the IAM Role name from the metadata, but you CANNOT retrieve the IAM Policy.
- Metadata = Info about the EC2 instance
- Userdata = launch script of the EC2 instance

### IMDSv2 vs. IMDSv1

1. IMDSv1
    - IMDSv1 is accessing http://169.254.169.254/latest/meta-data directly
2. IMDSv2 is more secure and is done in two steps:
    - Get Session Token (limited validity) – using headers & PUT
    - Use Session Token in IMDSv2 calls – using headers

### IMDS Hands on

```txt
1. connect to ec2 instance
2. check Metadata version
    if Metadata version is V1 and V2 - token optional
    if Metadata version is V2 - token mandatory
3. fetch instance metadata
    - Using IMDSv1
        curl -X GET http://169.254.169.254/latest/meta-data/
    - Using IMDSv2
        - Get Session Token
            TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"`
        - Use Session Token in IMDSv2 calls
            curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/

Note:- If listed values have "/" at end the it is a directory, else it is a file
```

## AWS CLI with multiple accounts

1. check which account is currently logged in

    ```txt
    aws sts get-caller-identity
    ```

2. shows the active configuration settings and credentials currently being used by the AWS CLI.

    ```txt
    aws configure list
    ```

3. go to ./aws directory and check

    ```txt
    cd ~/.aws/
    cat credentials - list all profiles credentials
    cat config - list all profiles
    ```

4. to configure new profile

    ```txt
    aws configure --profile <profile-name>
    and enter your credentials details when asked
    ```

5. to switch between profiles

    ```txt
    aws configure list-profiles
    aws sts get-caller-identity --profile <profile-name>
    ```

### AWS CLI with MFA ( This will give you short temporary credentials)

```txt
1. assign mfa to IAM user
2. get credentials by below command
    aws sts get-session-token --serial-number <arn_of_mfa> --token-code <mfa-code>
3. create profile with temporary credentials
    aws configure --profile <profile-name>
    and enter your credentials details when asked
4. then you can use that profile to access resource in CLI
```

# AWS SDK

AWS uses python sdk called boto3

### AWS Limits (Quotas)

1. API Rate Limits
    - DescribeInstances API for EC2 has a limit of 100 calls per seconds
    - GetObject on S3 has a limit of 5500 GET per second per prefix
    - For **Intermittent Errors**: implement **Exponential Backoff**
    - For Consistent Errors: request an API throttling limit increase

2. Service Quotas (Service Limits)
    - Running On-Demand Standard Instances: 1152 vCPU
    - You can request a service limit increase by opening a ticket
    - You can request a service quota increase by using the Service Quotas API

### Exponential Backoff (any AWS service)

- If you get ThrottlingException intermittently, use exponential backoff
- Retry mechanism already included in AWS SDK API calls
- Must implement yourself if using the AWS API as-is or in specific cases
- **Must only implement the retries on 5xx server errors**
- **Do not implement on the 4xx client errors**

### Signing AWS API requests

- When you call the AWS HTTP API, you sign the request so that AWS can identify you, using your AWS credentials (access key & secret key)
- If you use the SDK or CLI, the HTTP requests are signed for you
- You should sign an AWS HTTP request using **Signature v4 (SigV4)**

### SigV4 Request examples

- HTTP Header option (signature in Authorization header)
- Query String option, ex: S3 pre-signed URLs (signature in X-Amz-Signature)
