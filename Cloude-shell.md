# Cloud Shell

- WS CloudShell is a browser-based, pre-authenticated shell environment you can launch directly from the AWS Management Console . Think of it as a free, on-demand virtual terminal for running AWS CLI commands and scripts without installing anything on your local machine

- When you launch CloudShell in a Region, AWS provisions a container for you. Everything outside your home directory is ephemeral (resets after each session), but files in $HOME persist

### Key features

1. Pre-Installed Tools (No Setup Required)

    CloudShell comes with everything you need :

    | Category        | Tools                                                    |
    | --------------- | -------------------------------------------------------- |
    | AWS CLI & SDKs  | AWS CLI v2, ECS CLI, SAM CLI, AWS SDKs (Python, Node.js) |
    | Shells          | Bash, PowerShell, Z shell                                |
    | Editors         | vim, vi                                                  |
    | Version Control | git                                                      |
    | Build Tools     | make, pip, sudo, tar, wget, zip                          |
    | Runtimes        | Node.js, Python, .NET Core (for PowerShell)              |

2. Persistent Storage
    - 1 GB free per Region in your home directory
    - Data persists across sessions for up to 120 days of inactivity
    - Storage is Region-specific (not synchronized across Regions)

3. Session Restore
    - Close your browser tab, come back later—your session resumes (as long as it hasn't timed out)
    - Powered by tmux under the hood

4. File Transfer
    - Upload files from your local machine via browser
    - Download files up to 1 GB
    - Alternative: Use aws s3 cp for larger transfers

5. VPC Environments (New)
    - You can now launch CloudShell inside your VPC to access private resources
    - Note: VPC environments have no persistent storage—$HOME is ephemeral
