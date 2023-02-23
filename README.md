# Create ECR Repository 

This action creates ECR repository with option to set lambda policy statement

## Inputs

### `repository-name`

**Required** Name of the repository to create.

### `enable-lambda-policy-statement`

**Optional** Enable lambda policy statement. Set to 'true' by default

## Outputs

### `repository-uri`

URI of the repository.

### `status`

Shows the status of the repository: Created or Exists.


## Example usage

```yaml
    # Prerequisite: We need to login first
    - name: Login to Amazon ECR
      id: login-ecr
      uses: aws-actions/amazon-ecr-login@v1

    - name: Create new repository
      uses: rcablao-kodexa/create-ecr-repository@main
      with:
        repository-name: 'my-new-repository'
        enable-lambda-policy-statement: 'true'
```