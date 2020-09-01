import React from "react";
import { renderInput } from "../common/renderForms";
import CurrencyInput from "react-currency-input-field";

const Payment = ({ received, onChange, totalAmount }) => {
  return (
    <table>
      <tbody>
        <tr>
          <td>
            <b>Payments Received (Cash)</b>
          </td>
          <td>
            {/* {renderInput({
              name: "paymentReceived",
              disableRow: true,
              value: received,
              onChange,
              style: { textAlign: "right" },
            })} */}
            <CurrencyInput
              name="cashReceived"
              placeholder="PHP 0.00"
              fixedDecimalLength={2}
              prefix="PHP "
              defaultValue={received}
              onChange={onChange}
            />
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
              ((parseInt(received) || 0) - totalAmount).toLocaleString()}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default Payment;
