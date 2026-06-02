# Amazon S3

### Use cases

- Backup and storage
- Disaster Recovery
- Archive
- Hybrid Cloud storage
- Application hosting
- Media hosting
- Data lakes & big data analytics
- Software delivery
- Static website

## Buckets

1. Amazon S3 allows people to store objects (files) in “buckets” (directories)
2. Buckets are defined at the region level

## Objects

- Objects (files) have a Key
- The key is the FULL path: s3://my-bucket/my_folder1/another_folder/my_file.txt
- The key is composed of **prefix** + _object name_ : s3://my-bucket/**my_folder1/another_folder**/_my_file.txt_
- Object values are the content of the body:
    - Max. Object Size is 50TB (50,000GB)
    - If uploading more than 5GB, must use “multi-part upload”
- Version ID (if versioning is enabled)

### Hands on

```txt
1. General configuration
    - bucket type
    - bucket namespace - global, account regional

    - You can also choose existing bucket conf also
2. Owner ship
    -ACL is disabled ( all objects own by you)
    -ACL is enabled ( object own by aws )
3. Public access setting
4. Bucket Versioning
```

### Note:- If public access is disabled and you have presigned URL(Object URL) then you can access image with presigned url, but you can not access image with public URL.

## Amazon S3 – Security

1. User-Based
    - IAM Policies – which API calls should be allowed for a specific user from IAM

2. Resource-Based
    - Bucket Policies – bucket wide rules from the S3 console - allows cross account
    - Object Access Control List (ACL) – finer grain (can be disabled)
    - Bucket Access Control List (ACL) – less common (can be disabled)
3. Note: an IAM principal can access an S3 object if
    - The user IAM permissions ALLOW it OR
    - AND there’s no explicit DENY the resource policy ALLOWS it
4. Encryption: encrypt objects in Amazon S3 using encryption keys

### S3 Bucket Policies

1. JSON based
    - Resources: Bucket and objects Eg. "Resource": "arn:aws:s3:::amzn-s3-demo-bucket/\*"
    - Effect: Allow or Deny
    - Action: Set of API to allow or deny Eg. "s3:GetObject"
    - Principle: The **account or user to apply policy to**

    ie. above policy means anyone can **read all object** from **arn:aws:s3:::amzn-s3-demo-bucket**

    eg.

    ```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": "*",
                "Action": "s3:GetObject",
                "Resource": "arn:aws:s3:::amzn-s3-demo-bucket/*"
            }
        ]
    }
    ```

- **for Cross Account access ie. from another account user can access your S3 bucket, then you have to use Bucket policy**

### S3 Static website hosting

- S3 can host static websites and have them accessible via internet.
- If you get a **403 Forbidden** error, make sure the bucket policy allows public reads!

- to enable it go to
    - properties
    - Static website hosting
    - enable
    - upload index.html and error.html
    - save changes

### Versioning

- It is enabled at the bucket level
- Same key overwrite will change the “version”: 1, 2, 3…
- t is best practice to version your buckets
    - Protect against unintended deletes (ability to restore a version)
    - Easy roll back to previous version

**NOTE: If you have versioning enabled and you _deleted any file then it does not delete file, but it will create a delete marker_, so that file is not accessible by public but still present in S3** and if **you permanently delete that delete marker** then that file will get **restore and you can access it again**

### S3 Replication

- CRR - Cross Region Replication
- SRR - Same Region Replication

1. Must enable Versioning in source and destination buckets
2. Buckets can be in different AWS accounts
3. Copying is asynchronous
4. Must give proper IAM permissions to S3
5. Use cases:
    - CRR – compliance, lower latency access, replication across accounts
    - SRR – log aggregation, live replication between production and test accounts
6. After **you enable Replication, only new objects are replicated**
7. Optionally, **you can replicate existing objects using S3 Batch Replication**
    - Replicates existing objects and objects that failed replication
8. For DELETE operations
    - Can replicate delete markers from source to target (optional setting)
    - Deletions with a version ID are not replicated (to avoid malicious deletes)

#### How to create replication rule in S3?

```txt
1. Select source bucket
2. Go to Management tab
3. Click on "Replication rules" → "Create replication rule"
4. Choose rule scope - apply all OR specific object
5. Select destination bucket (and region if cross-region)
6. Additional replication option
    - If you want delete markers also replicated then check **Delete Markers** ( This will also replicate delete markers but not deleted version files)
7. Save rule
```

### S3 Storage Classes

1. **General Purpose**

- 99.99% Availability
- Used for frequently accessed data
- Low latency and high throughput
- Sustain 2 concurrent facility failures

2. **Infrequent Access**

- For **data that is less frequently accessed, but requires rapid access when needed**
    - Lower cost than S3 Standard
    - Amazon S3 Standard-Infrequent Access (S3 Standard-IA)
    - 99.9% Availability
    - Use cases: Disaster Recovery, backups
- Amazon S3 One Zone-Infrequent Access (S3 One Zone-IA)
    - High durability (99.999999999%) in a single AZ; lost when AZ is destroyed
    - 99.5% Availability
    - Use Cases: Storing secondary backup on-premises data, or data you can recreate

3. **Amazon S3 Glacier Storage Classes**

- Low-cost object storage **meant for archiving / backup**
- Pricing: price for storage + object retrieval cost
- Amazon S3 Glacier Instant Retrieval
    - **Millisecond retrieval**, great for **data accessed once a quarter**
    - **Minimum storage duration of 90 days**
- Amazon S3 Glacier Flexible Retrieval (formerly Amazon S3 Glacier):
    - Expedited (1 to 5 minutes), Standard (3 to 5 hours), Bulk (5 to 12 hours) – free
    - Minimum storage duration of 90 days
- Amazon S3 Glacier Deep Archive – for long term storage:
    - Standard (12 hours), Bulk (48 hours)
    - Minimum storage duration of 180 days

![S3 storage classes pricing](/Images/S3-storage-classes.png)

### Hands on

```txt
1. Create bucket
2. Upload file
3. select file
5. go to permissions in upload file tab

You will see different storage classes with there properties
```
