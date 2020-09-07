import React from "react";
import MaskedInput from "react-text-mask";
import createNumberMask from "text-mask-addons/dist/createNumberMask";
import PropTypes from "prop-types";

const CurrencyInput = ({
  name,
  value,
  onChange,
  placeHolder,
  prefix,
  ...rest
}) => {
  const defaultMaskOptions = {
    prefix,
    suffix: "",
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: ",",
    allowDecimal: true,
    decimalSymbol: ".",
    decimalLimit: 2, // how many digits allowed after the decimal
    integerLimit: 7, // limit length of integer numbers
    allowNegative: false,
    allowLeadingZeroes: false,
  };

  const currencyMask = createNumberMask({
    ...defaultMaskOptions,
  });

  return (
    <MaskedInput
      mask={currencyMask}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeHolder}
      {...rest}
    />
  );
};

CurrencyInput.propTypes = {
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  placeHolder: PropTypes.string,
  prefix: PropTypes.string,
};

export default CurrencyInput;
