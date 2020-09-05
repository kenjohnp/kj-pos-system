import React from "react";
import Input from "../common/input";
import CurrencyInput from "react-currency-input-field";
import MaskedInput from "react-text-mask";
import createNumberMask from "text-mask-addons/dist/createNumberMask";

const Payment = ({ received, onChange, totalAmount, error }) => {
  const defaultMaskOptions = {
    prefix: "PHP ",
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
    <table>
      <tbody>
        <tr>
          <td>
            <b>Payments Received (Cash)</b>
          </td>
          <td>
            <MaskedInput
              mask={currencyMask}
              name="cashReceived"
              value={received}
              onChange={onChange}
              placeholder="0.00"
            />

            {error && <span className="red-text">{error}</span>}
          </td>
        </tr>
        <tr
          style={{
            fontWeight: "bold",
            fontSize: "1.5rem",
            color: "green",
          }}
        >
          <td>Change</td>
          <td>
            {"PHP " +
              (
                (parseFloat(String(received).replace(/[^\d.-]/g, "")) || 0) -
                totalAmount
              ).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default Payment;
