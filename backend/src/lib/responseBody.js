export const errResponseBody = (message = "Something went wrong, cannot process the request", err = {}) => ({
  success: false,
  message,
  err,
  data: {},
});

export const successResponseBody = (message = "Successfully processed the request", data = {}) => ({
  success: true,
  message,
  data,
  err: {},
});