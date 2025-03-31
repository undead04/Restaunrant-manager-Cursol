// create function Response
export const Response = (status: number, message: string, data: any) => {
  return {
    status,
    message,
    data,
  };
};

export const SuccessResponse = (
  message: string,
  data: any,
  status: number = 200
) => {
  return Response(status, message, data);
};

export const ErrorResponse = (
  message: string,
  data: any,
  status: number = 500
) => {
  return Response(status, message, data);
};
