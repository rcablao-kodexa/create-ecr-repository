const { 
  ECRClient, 
  DescribeRegistryCommand,
  DescribeRepositoriesCommand, 
  CreateRepositoryCommand,
  SetRepositoryPolicyCommand 
} = require('@aws-sdk/client-ecr');
const core = require('@actions/core');
const github = require('@actions/github');

const client = new ECRClient();

async function getRegistryId(){
  const response = await client.send(new DescribeRegistryCommand());
  return response.registryId;
}

async function getRepositoryDetails(name){
  try {
    const response = await client.send(new DescribeRepositoriesCommand({ repositoryNames: [name] }));
    if (response.repositories.length == 1){
      console.log("Repository exists!");
      return response.repositories[0];
    }
  } catch(error){
    console.log("Repository does not exists!");
  }
  return null;
}

async function setRepositoryLambdaPolicy(name, region, account){
  policyText = {
    "Version": "2008-10-17",
    "Statement": [
      {
        "Sid": "LambdaECRImageRetrievalPolicy",
        "Effect": "Allow",
        "Principal": {
          "Service": "lambda.amazonaws.com"
        },
        "Action": [
          "ecr:BatchGetImage",
          "ecr:DeleteRepositoryPolicy",
          "ecr:GetDownloadUrlForLayer",
          "ecr:GetRepositoryPolicy",
          "ecr:SetRepositoryPolicy"
        ],
        "Condition": {
          "StringLike": {
            "aws:sourceArn": `arn:aws:lambda:${region}:${account}:function:*`
          }
        }
      }
    ]
  };

  const params = {
    repositoryName: name,
    policyText: JSON.stringify(policyText)
  };

  const response = await client.send(new SetRepositoryPolicyCommand(params));
  return response;
}

async function createRepository(name){
  const response = await client.send(new CreateRepositoryCommand({ repositoryName: name }));
  return response;
}

async function main(){
  // Get inputs
  const repositoryName = core.getInput('repository-name');
  const enableLambdaPolicyStatement = core.getInput('enable-lambda-policy-statement');

  // Fetch other details
  const region = await client.config.region();
  const account = await getRegistryId();

  // Get repo details
  const getRepository = await getRepositoryDetails(repositoryName);

  if(getRepository === null){
    await createRepository(repositoryName);

    if(enableLambdaPolicyStatement.toLowerCase() === 'true'){
      await setRepositoryLambdaPolicy(repositoryName, region, account)
    }
    core.setOutput("repository-uri", `${account}.dkr.ecr.${region}.amazonaws.com/${repositoryName}`);
    core.setOutput("status", "created");
  }else{
    core.setOutput("repository-uri", getRepository.repositoryUri);
    core.setOutput("status", "exists");
  } 

}

main();
