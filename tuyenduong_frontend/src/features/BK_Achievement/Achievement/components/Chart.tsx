import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StackedBarChart = (props: any) => {
  const {labels, arr_confirmed, arr_unconfirmed} = props;
  const options = {
    plugins: {
      title: {
        display: true,
        text: "Biểu đồ thống kê các loại hồ sơ",
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Đã được duyệt",
        data: arr_confirmed,
        backgroundColor: "rgb(255, 99, 132)",
      },
      {
        label: "Chưa được duyệt",
        data: arr_unconfirmed,
        backgroundColor: "rgb(75, 192, 192)",
      },
    ],
  };

  return <Bar options={options} data={data} />;
};

const StackedBarChartThreeField = (props: any) => {
  const {labels, arr_result_2, arr_result_1, arr_result_0} = props;
  const options = {
    plugins: {
      title: {
        display: true,
        text: "Biểu đồ thống kê các loại hồ sơ đã thẩm định",
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Đạt loại A",
        data: arr_result_2,
        backgroundColor: "rgb(75, 192, 192)",

      },
      {
        label: "Đạt loại B",
        data: arr_result_1,
        backgroundColor: "rgb(255, 204, 153)",
      },
      {
        label: "Đạt loại C",
        data: arr_result_0,
        backgroundColor: "rgb(255, 99, 132)",
      },
    ],
  };

  return <Bar options={options} data={data} />;
};

export default StackedBarChart;
export {StackedBarChartThreeField}