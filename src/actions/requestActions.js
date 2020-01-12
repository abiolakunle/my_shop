export const request = type => {
  console.log(`Request started`);
  return {
    type
  };
};

export const success = (type, data = "Successful") => {
  console.log(`Request Success defails >>`, data);
  return {
    type,
    payload: data
  };
};

export const failure = (type, message = "Undefined error") => {
  console.error(`Request failure details >> ${message}`);
  return {
    type,
    payload: message
  };
};
