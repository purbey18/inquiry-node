const response = {
  success_response: (status_code: any, message: String, data: any) => {
    // data = Array.isArray(data) ? data : [data];
    return {
      status: true,
      status_code: String(status_code),
      message: message,
      data: data,
    };
  },
  error_response: (status_code: any, message: String) => {
    return {
      status: false,
      status_code: String(status_code),
      message: message,
    };
  },
};

export default response;
