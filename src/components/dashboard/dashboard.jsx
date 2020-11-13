import React from "react";
import Card from "./card";
import { Line, Bar, HorizontalBar } from "react-chartjs-2";
import PageTitle from "../common/pageTitle";

const Dashboard = () => {
  const cardList = [
    {
      label: "Daily Transactions",
      value: "43",
      icon: "shopping_cart",
      color: "#00bcd4",
    },
    {
      label: "Today",
      value: "113,150.30",
      icon: "today",
      color: "#4caf50",
    },
    {
      label: "This Month",
      value: "541,020.98",
      icon: "attach_money",
      color: "#5b5bff",
    },
    {
      label: "This Year",
      value: "3,524,050.65",
      icon: "monetization_on",
      color: "#f44336",
    },
  ];

  const data = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "Sales",
        fill: false,
        lineTension: 0,
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 2,
        data: [65, 59, 80, 81, 56],
      },
    ],
  };

  const data2 = {
    labels: ["Nintendo Switch", "PS4", "Nintendo 3DS", "XBOX ONE", "RTX 2080 Ti"],
    datasets: [
      {
        label: "Sales",
        fill: false,
        lineTension: 0,
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 2,
        data: [140, 120, 110, 109, 100],
      },
    ],
  };

  return (
    <>
      <PageTitle title="Dashboard" />
      <div className="row" style={{ marginTop: "30px" }}>
        {cardList.map((card) => (
          <Card label={card.label} value={card.value} icon={card.icon} color={card.color} key={card.label} />
        ))}
      </div>
      <div className="row">
        <div className="col s6">
          <Line
            data={data}
            options={{
              title: {
                display: true,
                text: "Sales Performance",
                fontSize: 20,
              },
              legend: {
                display: false,
                position: "right",
              },
            }}
          />
        </div>
        <div className="col s6">
          <Line
            data={data}
            options={{
              title: {
                display: true,
                text: "Transactions",
                fontSize: 20,
              },
              legend: {
                display: false,
                position: "right",
              },
            }}
          />
        </div>
        <div className="col s6">
          <HorizontalBar
            data={data2}
            options={{
              title: {
                display: true,
                text: "Top 10 Best Selling Products",
                fontSize: 20,
              },
              legend: {
                display: false,
                position: "right",
              },
            }}
          />
        </div>
        <div className="col s6">
          <Line
            data={data}
            options={{
              title: {
                display: true,
                text: "Products sold",
                fontSize: 20,
              },
              legend: {
                display: false,
                position: "right",
              },
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
