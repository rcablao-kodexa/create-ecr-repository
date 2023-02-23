# Hello world javascript action

This action prints "Hello World" or "Hello" + the name of a person to greet to the log.

## Inputs

### `repository-name`

**Required** Name of the repository to create.

### `policy-statement`

**Optional** Path to the permission/policy statement.

## Outputs

### `repository-uri`

URI of the repository.

### `status`

Shows the status of the repository: Created or Exists.


## Example usage

```yaml
uses: rcablao-kodexa/create-ecr-repository@main
with:
  repository-name: 'my-new-repository'
  policy-statement: 'ecr-policy.json'
```