export const request = type => {
  return {
    type
  };
};

export const success = (type, message = "Successful") => {
  console.log(`Request Success defails >> ${message}`);
  return {
    type,
    payload: message
  };
};

export const failure = (type, message = "Undefined error") => {
  console.error(`Request failure details >> ${message}`);
  return {
    type,
    payload: message
  };
};
