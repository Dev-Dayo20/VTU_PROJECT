import React from "react";
import { useHistory } from "react-router-dom";

const BackButton = () => {
  const history = useHistory();

  return <button onClick={() => history.goBack()}>Go Back</button>;
};

export default BackButton;
