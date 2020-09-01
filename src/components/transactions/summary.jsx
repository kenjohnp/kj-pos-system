import React from "react";

const Summary = ({ data }) => {
  return (
    <table>
      <tbody>
        {Object.entries(data).map((i) => (
          <tr
            key={i[1].label}
            style={
              i[0] === "total"
                ? {
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    color: "green",
                  }
                : {}
            }
          >
            <td>
              <b>{i[1].label}</b>
            </td>
            <td style={{ textAlign: "right" }}>
              {"PHP " + i[1].value.toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Summary;
