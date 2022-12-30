import React from "react";

import AppButton from "../AppButton";

function SubmitButton({
  title,
  bgColor = "primary",
  textColor = "white",
  handleSubmit,
}) {
  return (
    <AppButton
      title={title}
      bgColor={bgColor}
      textColor={textColor}
      onPress={handleSubmit}
    />
  );
}

export default SubmitButton;
