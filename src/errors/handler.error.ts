import { BadRequestError } from "./bad-request.error";
import { NotFoundError } from "./not-found.error";

export async function handleError(error: any) {
  console.error(error);

  if (error instanceof BadRequestError) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: error.message }),
    };
  } else if (error instanceof NotFoundError) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: error.message }),
    };
  }

  return {
    statusCode: 500,
    body: JSON.stringify({ message: "Internal Server Error" }),
  };
}
