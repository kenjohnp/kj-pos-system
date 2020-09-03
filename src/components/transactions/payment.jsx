import React from "react";
import { renderInput } from "../common/renderForms";
import CurrencyInput from "react-currency-input-field";

const Payment = ({ received, onChange, totalAmount, error }) => {
  return (
    <table>
      <tbody>
        <tr>
          <td>
            <b>Payments Received (Cash)</b>
          </td>
          <td>
            <CurrencyInput
              name="cashReceived"
              placeholder="PHP 0.00"
              prefix="PHP "
              value={received}
              onChange={onChange}
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
                (parseFloat(received) || 0) - totalAmount
              ).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default Payment;
