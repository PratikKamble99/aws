# Amazon ECS (Elastic Container Service)

Amazon Elastic Container Service (Amazon ECS) is a fully managed container orchestration service that allows you to run, stop, and manage Docker containers on a cluster

## Key Components

1.  **Task Definition**: A **blueprint for your container** . It's a text file (in JSON format) that specifies critical settings like which Docker image to use, how much CPU and memory to allocate, which ports to open, and what environment variables to set. - Can define up to 10 containers in a Task Definition

    **ECS with Load balancing(EC2 Launch Type):**
    We get a Dynamic Host Port Mapping if you define only the container port in the task definition

    example,
    - an ECS task, and all of them have the container port set to 80 but the host port set to zero, ie. host port is going to be random, is going to be dynamic, because it not set.
    - And so, each ECS task from within the EC2 instance, is going to be accessible from a different port on the host,
    - then you may say, well, it is difficult for the ALB to connect to the ECS test because the port is changing.
    - But the ALB when linked to an ECS service knows how to find the right port, thanks to the Dynamic Host Port Mapping feature.

    **ECS - load balancing with Fargate**
    - Each task has a unique private IP and because this is Fargate, there is no host, and therefore we only have to define the container ports.
    - example, ECS cluster with four tasks each task is going to get its own private IP through an Elastic Network Interface or ENI. And then each ENI is going to get the same container ports. therefore, when you have an ALB, then to connect to the Fargate task, it's just going to connect to all all of them on the same port on port 80.

    **IAM role for ECS**
    1. Task Role is assigned in the Task Definition:
        - An ECS Task Role (IAM Role) is attached to the Task Definition, not to the ECS Service.
        - This role defines what AWS services the containers inside the task can access (e.g., S3, DynamoDB, SQS).
    2. All Tasks Inherit the Role Automatically
        - When you create an ECS Service using that Task Definition, every **ECS Task launched by the service automatically assumes/get the configured Task Role**.
        - As a result, all running tasks get the same permissions, such as reading/writing objects in an S3 bucket, without needing AWS credentials inside the container.

    **Environment Variables for ECS Tasks**
    1. Hardcoded – e.g., URLs
    2. SSM Parameter Store – sensitive variables (e.g., API keys, shared configs)
    3. Secrets Manager – sensitive variables (e.g., DB passwords)
       `If you want to add env vars from secret manager add key as SECRET_DB_PASS and set value type as valueFrom and add secret arn in value field`
    4. Environment Files (bulk) – Amazon S3

    **Amazon ECS – Data Volumes (Bind Mounts)**
    1. Share data between multiple containers in the same Task Definition - Works for both EC2 and Fargate tasks
    2. EC2 Tasks – using EC2 instance storage - Data are tied to the lifecycle of the EC2 instance
    3. Fargate Tasks – using ephemeral storage- Data are tied to the container(s)lifecycle

2.  **docker agent**: The ECS container agent is a small but critical software component that runs on every container instance (EC2 server) in your ECS cluster. _Its primary job is to act as the communication bridge between the instance and the ECS control plane, enabling tasks (containers) to be scheduled and managed without manual intervention_

3.  **Task**: A running instance of a Task Definition. This represents a single, running copy of your application. Tasks can be short-lived (like a batch job that runs and stops) or long-running. You can refer **task as Docker container**

4.  **Service**:A configuration that ensures a specified number of tasks are always running. If a task fails or stops, the service automatically launches a new one to maintain the desired count, making it ideal for long-running, stateless web applications.

5.  **Cluster**: A logical grouping of the infrastructure (capacity) that your tasks and services run on - also you define EC2 instance configuration in case of EC2 launch type

6.  **Task role**: A role that allows you to access AWS services into container

### Capacity: (The infrastructure where your containers actually run)

Capacity Options:

1. **Fargate**: Fargate is a serverless compute engine for containers. You define your task, and AWS handles the rest, from provisioning the compute capacity to patching and securing the underlying servers.
2. **EC2 Launch Type (More Control)**: You manage a cluster of EC2 instances. You are responsible for choosing the instance type, scaling the cluster, patching the OS, and managing the Docker daemon and agent.

### Amazon ECS – IAM Roles for ECS

1. **EC2 Instance Profile (EC2 Launch Type only):**
    - Used by the ECS agent
    - Makes API calls to ECS service
    - Send container logs to CloudWatch Logs
    - Pull Docker image from ECR
    - Reference sensitive data in Secrets Manager or SSM Parameter Store
2. **ECS Task Role:**
    - Allows each task to have a specific role
    - Use different roles for the different ECS Services you run
    - Task Role is defined in the task definition

## Hands on Amazon ECS with Fargate

1. Go to the ECS service in the AWS Management Console
2. Click on Create Cluster
3. Select Fargate as the infrastructure type
4. Enter a cluster name
5. Click on Create
    - enter cluster name
    - select infrastructure - fargate, fargate and managed instances, fargate ans self managed ec2
    - select auto scaling group
    - select ec2 config
    - select desire capacity of ec2 instances in cluster
    - click create
6. Create task definition:
    - enter name
    - select Infrastructure requirements - AWS Fargate(selected), Managed instance, EC2 instance
    - select OS, Architecture, Network mode
    - enter container details ( name, image URL, PORT mappings)
    - Create
7. Create Service
    - Select Task definition family
    - Deployment configuration
        - enter desire task count (how many container you want to run)
    - select Environment config
        - select capacity provider strategy
    - Load balancing
        - select load balancer type
        - select Container
        - enter listeners, target groups
    - Service auto scaling ( for auto scaling of task)

8. Then you can access your application using load balancer URL

### EC2 Launch Type – Auto Scaling EC2 Instances

1. **Auto Scaling Group Scaling**
    - Scale your ASG based on CPU Utilization
    - Add EC2 instances over time

2. **ECS Cluster Capacity Provider**
    - Used to automatically provision and scale the infrastructure for your ECS Tasks
    - Capacity Provider paired with an Auto Scaling Group
    - Add EC2 Instances when you’re missing capacity (CPU, RAM…)

### ECS Rolling Updates

This strategy gradually replaces old versions of your application tasks with new ones, ensuring your service remains available without downtime

Hands on Rolling Updates

```
1. Navigate to your ECS cluster and select the service.
2. Choose Update.
3. In the Deployment options section, ensure Deployment strategy is set to Rolling update.
4. Set your desired values for Minimum healthy percent and Maximum percent
```

## explore amazon-event-bridge: (serverless event bus service)

## Amazon ECS – Task Placement

1. When an ECS task is started with EC2 Launch Type, ECS must determine
   where to place it, with the constraints of CPU and memory (RAM)
2. Similarly, when a service scales in, ECS needs to determine which task to
   terminate

### When Amazon ECS places a task, it uses the following process to select the appropriate EC2 Container instance:

1. Identify which instances that satisfy the CPU, memory, and port requirements
2. Identify which instances that satisfy the Task Placement Constraints
3. Identify which instances that satisfy the Task Placement Strategies
4. Select the instances

### Amazon ECS – Task Placement Strategies

1.  **Binpack**
    - Tasks are placed on the least available amount of CPU and Memory
    - Minimizes the number of EC2 instances in use (cost savings)

2.  **Random**: Tasks are placed randomly

3.  **Spread**:
    - Tasks are placed evenly based on the specified value
    - Example: instanceId, attribute:ecs.availability-zone, …

### Amazon ECS – Task Placement Constraints

1. **Distinct Instance**: Tasks are placed on a different EC2 instance
2. **Distinct Member**: Tasks are placed on EC2 instances that satisfy a specified expression - Uses the Cluster Query Language (advanced)

# Amazon ECR (Elastic Container Registry)

- Store and manage Docker images on AWS
- Private and Public repository (Amazon ECR Public Gallery https://gallery.ecr.aws )
- Fully integrated with ECS, backed by Amazon S3
- All access is controlled through IAM (permission errors => policy)
- Supports image vulnerability scanning, versioning, image tags, image lifecycle, …

### Login Command

- AWS CLI v2: 
  aws ecr get-login-password --region <_region_> | docker login --username AWS--password-stdin <_aws_account_id_>.dkr.ecr.<_region_>.amazonaws.com

### Docker Commands

- Push: docker push <_aws_account_id_>.dkr.ecr.<_region_>.amazonaws.com/demo:latest
- Pull: docker pull <_aws_account_id_>.dkr.ecr.<_region_>.amazonaws.com/demo:latest
- In case an EC2 instance (or you) can’t pull a Docker image, check IAM permissions

# AWS Copilot CLI (https://aws.github.io/copilot-cli/)

AWS Copilot is an open-source command line interface (CLI) that serves as a high-level toolkit, designed to simplify the process of building, releasing, and operating production-ready containerized applications on AWS

From a Docker file and the Copilot's configuration files of course, we're able to create a full pipeline on AWS to deploy our application

1. Run your apps on AppRunner, ECS, and Fargate
2. Helps you focus on building apps rather than setting up infrastructure
3. Provisions all required infrastructure for containerized apps (ECS, VPC, ELB, ECR…)
4. Automated deployments with one command using CodePipeline

Installing AWS Copilot CLI ( windows )

```powershell
iwr -useb https://github.com/aws/copilot-cli/releases/latest/download/copilot-windows.exe -OutFile copilot.exe

mkdir C:\copilot

move .\copilot.exe C:\copilot\copilot.exe
```

Add C:\copilot to your PATH:

```powershell
[Environment]::SetEnvironmentVariable(
  "Path",
  $env:Path + ";C:\copilot",
  [EnvironmentVariableTarget]::User
)

// CHECK VERSION
copilot --version
```

```powershell
copilot init // creates a new copilot app and a workspace in your current directory

copilot app delete // deletes the application

```

# Amazon EKS (Elastic Kubernetes Service)

**for this learn kubernetes in-depth.**

- Kubernetes is an open-source system for automatic deployment, scaling and management of containerized (usually Docker) application
- It’s an alternative to ECS, similar goal but different API
- EKS supports EC2 if you want to deploy worker nodes or Fargate to deploy serverless containers
- Kubernetes is cloud-agnostic (can be used in any cloud - Azure, GCP…)
- Collect logs and metrics using CloudWatch Container Insights
