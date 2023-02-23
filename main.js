const core = require('@actions/core');
const github = require('@actions/github');

try {
  // Get inputs
  const repositoryName = core.getInput('repository-name');
  const policyStatement = core.getInput('policy-statement');

  console.log(`Creating ${repositoryName} using policy stored in ${policyStatement}...`);
  
  core.setOutput("repository-uri", `ACCOUNT.dkr.ecr.REGION.amazonaws.com/${repositoryName}`);
  core.setOutput("status", "Just a test");
  
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}