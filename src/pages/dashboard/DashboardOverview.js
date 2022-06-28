
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCashRegister, faChartLine, faCloudUploadAlt, faPlus, faRocket, faTasks, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Button, Dropdown, ButtonGroup } from '@themesberg/react-bootstrap';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Pie} from 'react-chartjs-2';
import { CounterWidget, CircleChartWidget, BarChartWidget, TeamMembersWidget, ProgressTrackWidget, RankingWidget, SalesValueWidget, SalesValueWidgetPhone, AcquisitionWidget } from "../../components/Widgets";
import { PageVisitsTable } from "../../components/Tables";
import { trafficShares, totalOrders } from "../../data/charts";
import {ReactChart} from '../../components/ReactChart';
import { getToken } from "../../function/helpers";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default () => {

  const access_token = getToken()

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart',
      },
    },
  };
  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  const data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        fill: 'start',
        data: [parseInt(Math.random() * 100), parseInt(Math.random() * 100), parseInt(Math.random() * 100), parseInt(Math.random() * 100), parseInt(Math.random() * 100), parseInt(Math.random() * 100), parseInt(Math.random() * 100)],
        borderColor: 'rgb(255, 99, 132)',
      },
    ],
  };
  // const data = (canvas) => {
  //   const ctx = canvas.getContext("2d");
  //   const gradient = ctx.createLinearGradient(0, 0, 100, 0);

  //   return{
  //     labels,
  //     datasets: [
  //       {
  //         label: 'Dataset 1',
  //         backgroundColor: gradient,
  //         fill: 'start',
  //         data: [parseInt(Math.random() * 100), parseInt(Math.random() * 100), parseInt(Math.random() * 100), parseInt(Math.random() * 100), parseInt(Math.random() * 100), parseInt(Math.random() * 100), parseInt(Math.random() * 100)],
  //         borderColor: 'rgb(255, 99, 132)',
  //       },
  //     ],
  //   }
  // }

  return (
    <>
      <div className="py-4 content-page">
        <div className="head-title">
          <h2 className="h5 mb-2">Ringkasan</h2>
          <p>02 Jul 2022</p>
        </div>
        <br/>
        <div className="main-content">
          <Row>
            <Col lg={3}>
              <div className="card-information">
                <p className="p-info">Total Dana Masuk</p>
                <p className="p-amount">Rp. 50.700.000</p>
              </div>
            </Col>
            <Col lg={3}>
              <div className="card-information">
                <p className="p-info">Total Biaya Partner</p>
                <p className="p-amount">Rp. 50.700.000</p>
              </div>
            </Col>
            <Col lg={3}>
              <div className="card-information">
                <p className="p-info">Total Biaya VA</p>
                <p className="p-amount">Rp. 50.700.000</p>
              </div>
            </Col>
            <Col lg={3}>
              <div className="card-information">
                <p className="p-info">Total Biaya Settlement</p>
                <p className="p-amount">Rp. 50.700.000</p>
              </div>
            </Col>
          </Row>
            <div className="settlement-section">
              <p className="h5 mb-2 mt-4">Grafik Settlement Partner</p>
              <Row className="justify-content-md-center" style={{backgroundColor: "#FFFFFF"}}>
                <Col xs={12} className="mb-4 d-none d-sm-block">
                  <div className="div-chart">
                    <Line
                      data={data}
                      options={options}
                    />
                  </div>
                </Col>
              </Row>
          </div>
          <div className="partner-section">
              <p className="h5 mb-2 mt-4">Grafik Biaya Partner</p>
              <Row className="justify-content-md-center" style={{backgroundColor: "#FFFFFF"}}>
                <Col xs={12} className="mb-4 d-none d-sm-block">
                  <Line options={options} data={data} />;
                </Col>
              </Row>
          </div>
          <div className="va-section">
              <p className="h5 mb-2 mt-4">Grafik Biaya VA</p>
              <Row className="justify-content-md-center" style={{backgroundColor: "#FFFFFF"}}>
                <Col xs={12} className="mb-4 d-none d-sm-block">
                  <Line options={options} data={data} />;
                </Col>
              </Row>
          </div>
        </div>
      </div>
    </>
  );
};
