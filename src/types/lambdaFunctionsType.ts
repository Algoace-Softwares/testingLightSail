import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";

type LambdaFunctionNames = "lociBackendApp";

// Add more function names as needed

export type LambdaFunctionsType = {
  [key in LambdaFunctionNames]: LambdaIntegration;
};
