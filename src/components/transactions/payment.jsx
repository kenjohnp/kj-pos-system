import React from "react";
import CurrencyInput from "../common/currencyInput";

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
              value={received}
              onChange={onChange}
              prefix="PHP "
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
