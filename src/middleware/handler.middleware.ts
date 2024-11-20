import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { handleError } from "../errors";

/**
 * Higher-order function to wrap handlers with try-catch error handling.
 */
export const handleRequest = (fn: (event: APIGatewayProxyEvent) => Promise<any>): Handler => {
  return async (event: APIGatewayProxyEvent) => {
    try {
      return await fn(event);
    } catch (error) {
      return handleError(error);
    }
  };
};
