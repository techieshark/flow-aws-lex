# flow-aws-lex

Flow type definitions for AWS Lex's AWS Lambda function input event and response format, based on [these docs](https://docs.aws.amazon.com/lex/latest/dg/lambda-input-response-format.html).

Since lambda function interface itself is not a NPM library you cannot use Flow NPM type definitions (https://github.com/flowtype/flow-typed)

But it's still usefull to have types for objects which Lex sends and expects as response in calls to lambda functions.

See also https://github.com/yarax/flow-aws-lambda (this README based on that too).


# Example usage

```
import type {LexInputEvent, LexResponse, LexLambdaCb as LambdaCb} from 'flow-aws-lambda';
import type {Context as LambdaContext} from 'flow-aws-lambda';

function yourLambdaFunctionToFulfillLexIntent(event: LexInputEvent, context: LambdaContext, callback: LambdaCb) {
  if (... /* success */) {
    fulfillmentResponse("Your request has been fulfilled.", true);
  } else {
    fulfillmentResponse("Sorry, couldn't help you with that.", false);
  }
}

// just an example showing one possible LexResponse structure
function fulfillmentResponse(content, success): LexResponse {
  return {
    "dialogAction": {
      "type": "Close",
      "fulfillmentState": success ? "Fulfilled" : "Failed",
      "message" : {
        "contentType" : "PlainText",
        "content" : content
      }
    }
  }
}
```
