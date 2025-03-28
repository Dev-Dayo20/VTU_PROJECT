// Regex format to validate nigerian number inputs
const validatePhoneNumber = (mobileNumber, next) => {
    const regex = /^0\d{10}$/;
    return regex.test(mobileNumber);
    next();
  };