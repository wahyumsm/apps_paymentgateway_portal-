
import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCashRegister, faChartLine, faCloudUploadAlt, faPlus, faRocket, faTasks, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Button, Dropdown, ButtonGroup, Form, FormGroup, FormCheck } from '@themesberg/react-bootstrap';
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
import { BaseURL, convertToRupiah, errorCatch, getRole, getToken, setUserSession } from "../../function/helpers";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import encryptData from "../../function/encryptData";
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

  const history = useHistory()
  const access_token = getToken()
  const user_role = getRole()
  const [settlementTransaction, setSettlementTransaction] = useState({})
  const [partnerChartData, setPartnerChartData] = useState([])
  const [feePartnerChartData, setFeePartnerChartData] = useState([])
  const [feeVaChartData, setFeeVaChartData] = useState([])
  const [listPartner, setListPartner] = useState([])
  const currentDate = new Date().toISOString().split('T')[0]
  const [isChecked, setIsChecked] = useState(false);
  const myRef = useRef(null);
  const [inputHandle, setInputHandle] = useState({
    partnerId: "",
  })

  // function handleChange(e) {
  //   setInputHandle({
  //     ...inputHandle,
  //     [e.target.name]: e.target.value,
  //   });
  // }

  const handleOnChangeCheckBox = (e) => {
    setIsChecked(!isChecked);
    if (e.target.checked) {
      // setIsChecked(!isChecked);
      setInputHandle({
        ...inputHandle,
        [e.target.name]: e.target.value,
      })
    } 
  };

  const [expanded, setExpanded] = useState(false);

  const showCheckboxes = () => {
    var checkboxes = document.getElementById("checkboxes");
    if (!expanded) {
      // checkboxes.style.display = "block"
      setExpanded(true)
    } else {
      // checkboxes.style.display = "none"
      setExpanded(false)
    }
  }
  
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

  async function listDataPartner (url) {
    try {
        const auth = "Bearer " + getToken()
        const headers = {
            'Content-Type':'application/json',
            'Authorization' : auth
        }
        const listDataPartner = await axios.post(url, { data: "" }, { headers: headers })
        console.log(listDataPartner, "list partner di beranda")
        if (listDataPartner.data.response_code === 200 && listDataPartner.status === 200 && listDataPartner.data.response_new_token.length === 0) {
            setListPartner(listDataPartner.data.response_data)
            // setPending(false)
        } else {
            setUserSession(listDataPartner.data.response_new_token)
            setListPartner(listDataPartner.data.response_data)
            // setPending(false)
        }
        
    } catch (error) {
        console.log(error)
        // RouteTo(errorCatch(error.response.status))
        history.push(errorCatch(error.response.status))
    }
}

  async function ringkasanData() {
    try {
      const auth = 'Bearer ' + getToken();
      const headers = {
          'Content-Type': 'application/json',
          'Authorization': auth
      }
      const ringkasanData = await axios.post("/Home/GetSummaryTransaction", {data: ""}, { headers: headers });
      if (ringkasanData.status === 200 && ringkasanData.data.response_code === 200) {
        setSettlementTransaction(ringkasanData.data.response_data)
      }
    } catch (error) {
      console.log(error)
      history.push(errorCatch(error.response.status))
    }
  }

  async function partnerChartHandler(partnerId) {
    try {
      const auth = 'Bearer ' + getToken();
      const dataParams = encryptData(`{"partner_id":["${partnerId}"]}`)
      const headers = {
          'Content-Type': 'application/json',
          'Authorization': auth
      }
      const partnerChart = await axios.post("/Home/GetSettlementPartnerChart", {data: dataParams}, { headers: headers });
      console.log(partnerChart, 'partner chart');
      if (partnerChart.status === 200 && partnerChart.data.response_code === 200) {
        setPartnerChartData(partnerChart.data.response_data)
      }
    } catch (error) {
      console.log(error)
      history.push(errorCatch(error.response.status))
    }
  }

  async function feePartnerChartHandler(partnerId) {
    try {
      const auth = 'Bearer ' + getToken();
      const dataParams = encryptData(`{"partner_id":["${partnerId}"]}`)
      const headers = {
          'Content-Type': 'application/json',
          'Authorization': auth
      }
      const feePartnerChart = await axios.post("/Home/GetFeePartnerChart", {data: dataParams}, { headers: headers });
      // console.log(feePartnerChart.data.response_data, 'partner chart');
      if (feePartnerChart.status === 200 && feePartnerChart.data.response_code === 200) {
        setFeePartnerChartData(feePartnerChart.data.response_data)
      }
    } catch (error) {
      console.log(error)
      history.push(errorCatch(error.response.status))
    }
  }

  async function feeVaChartHandler(partnerId) {
    try {
      const auth = 'Bearer ' + getToken();
      const dataParams = encryptData(`{"partner_id":["${partnerId}"]}`)
      const headers = {
          'Content-Type': 'application/json',
          'Authorization': auth
      }
      const feeVaChartData = await axios.post("/Home/GetFeeVAChart", {data: dataParams}, { headers: headers });
      // console.log(feeVaChartData.data.response_data, 'partner chart');
      if (feeVaChartData.status === 200 && feeVaChartData.data.response_code === 200) {
        setFeeVaChartData(feeVaChartData.data.response_data)
      }
    } catch (error) {
      console.log(error)
      history.push(errorCatch(error.response.status))
    }
  }

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
  // const labels = partnerChartData.map(obj => obj.dates);
  const data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        fill: 'start',
        // data: partnerChartData,
        data: [parseInt(Math.random() * 100), parseInt(Math.random() * 100), parseInt(Math.random() * 100), parseInt(Math.random() * 100), parseInt(Math.random() * 100), parseInt(Math.random() * 100), parseInt(Math.random() * 100)],
        borderColor: 'rgb(255, 99, 132)',
      },
    ],
  };

  useEffect(() => {
    if (!access_token) {
      history.push('/login');
    }
    if (user_role == 102) {
      history.push('/404');
    }
    listDataPartner('/Partner/ListPartner')
    ringkasanData()
    partnerChartHandler(`${inputHandle.partnerId}`)
    feePartnerChartHandler(`${inputHandle.partnerId}`)
    feeVaChartHandler(`${inputHandle.partnerId}`)
  }, [access_token, user_role, inputHandle.partnerId])

  // console.log(inputHandle.partnerId);
  

  if(!access_token) {
    return (
      <div className="py-4 mt-6 content-page">
        <div className="head-title">
          <h2 className="h5 mb-2">Ringkasan</h2>
          <p style={{ display: "flex", justifyContent: "center", marginTop: 150 }}>There is no data in this page</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="py-5 mt-5 content-page">
        <div className="head-title">
          <h2 className="h5 mb-2">Ringkasan</h2>
          <p>{currentDate}</p>
        </div>
        <br/>
        <div className="main-content">
          <Row>
            <Col lg={3}>
              <div className="card-information">
                <p className="p-info">Total Dana Masuk</p>
                <p className="p-amount">{convertToRupiah(settlementTransaction.total_dana_masuk)}</p>
              </div>
            </Col>
            <Col lg={3}>
              <div className="card-information">
                <p className="p-info">Total Biaya Partner</p>
                <p className="p-amount">{convertToRupiah(settlementTransaction.total_biaya_partner)}</p>
              </div>
            </Col>
            <Col lg={3}>
              <div className="card-information">
                <p className="p-info">Total Biaya VA</p>
                <p className="p-amount">{convertToRupiah(settlementTransaction.total_biaya_va)}</p>
              </div>
            </Col>
            <Col lg={3}>
              <div className="card-information">
                <p className="p-info">Total Biaya Settlement</p>
                <p className="p-amount">{convertToRupiah(settlementTransaction.total_biaya_settlement)}</p>
              </div>
            </Col>
          </Row>
            <div className="settlement-section">
              <p className="h5 mb-2 mt-4">Grafik Settlement Partner</p>
              {/* <Dropdown style={{width: "25%"}} name="partnerId" onChange={handleChange} value={inputHandle.partnerId}>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  Dropdown Button
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item>
                     {listPartner.map((item, idx) => {
                      return (
                        <Form.Group key={idx}>
                          <Form.Check name="partnerId" checked={isChecked} value={item.partner_id} onChange={handleOnChangeCheckBox} label={item.nama_perusahaan} />
                        </Form.Group>
                      )
                     })}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown> */}
              {/* <Form.Select style={{width: "25%"}} name="partnerId" onChange={handleChange} value={inputHandle.partnerId}>
                <option defaultValue>--- Choose Partner ---</option>
                {listPartner.map((item, idx) => {
                  // console.log(item, "ini item");
                  return (
                    // <Form.Check key={idx} checked={item.status} label={item.nama_perusahaan} />
                    <option key={idx} type="checkbox" >
                      <Form.Group>
                        <Form.Check checked={isChecked} value={item.partner_id} onChange={handleOnChangeCheckBox} label={item.nama_perusahaan} />
                      </Form.Group>
                    </option>
                  )
                })}
              </Form.Select> */}
              <Form>
                <div className="multiselect">
                  <div className="selectBox" style={{display: !expanded ? "block" : "none"}} onclick={() => showCheckboxes()}>
                    <Form.Select>
                      <option value="">Select an option</option>
                    </Form.Select>
                    <div className="overSelect"></div>          
                  </div>
                  <div id="checkboxes" name="checkboxes" >
                    {
                      listPartner.map((item, idx) => {
                        return (
                          // <option key={idx} value={item.partner_id}>
                            <label key={idx} value={item.partner_id}>
                              <input type="checkbox" name="partnerId" id="partnerId" checked={isChecked} value={item.partner_id} onChange={handleOnChangeCheckBox} />{item.nama_perusahaan}
                            </label>
                          // </option>
                        )
                      })
                    }
                  </div>
                </div>
              </Form>
              <Row className="justify-content-md-center" style={{backgroundColor: "#FFFFFF"}}>
                <Col xs={12} className="mb-4 d-none d-sm-block">
                  <div className="div-chart">
                    <Line
                      className="mt-3 mb-3"
                      data={{
                        labels: partnerChartData.map(obj => obj.date),
                        datasets: [
                          {
                            label: null,
                            fill: true,
                            // backgroundColor: gradient,
                            backgroundColor: "rgba(156, 67, 223, 0.38)",
                            borderColor: "#9C43DF",
                            pointBackgroundColor: "rgba(220, 220, 220, 1)",
                            pointBorderColor: "#9C43DF",
                            data: partnerChartData.map(obj => obj.amount)
                          },
                        ],
                      }}
                      height={100}
                      width={200}
                      options= {{
                        plugins: {
                          legend: {
                            display: false
                          },
                        },
                        responsive: true,
                        scales: {
                          xAxes: {
                            beginAtZero: false,
                            ticks: {
                              autoSkip: false,
                              maxRotation: 45,
                              minRotation: 45
                            }
                          },
                          yAxes: {
                            beginAtZero: true,
                            ticks: {
                              stepSize: 2000
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </Col>
              </Row>
          </div>
          <div className="partner-section">
              <p className="h5 mb-2 mt-4">Grafik Biaya Partner</p>
              <Row className="justify-content-md-center" style={{backgroundColor: "#FFFFFF"}}>
                <Col xs={12} className="mb-4 d-none d-sm-block">
                  {/* <Line options={options} data={data} />; */}
                  <div className="div-chart">
                    <Line
                      className="mt-3 mb-3"
                      data={{
                        labels: feePartnerChartData.map(obj => obj.date),
                        datasets: [
                          {
                            label: null,
                            fill: true,
                            // backgroundColor: gradient,
                            backgroundColor: "rgba(156, 67, 223, 0.38)",
                            borderColor: "#9C43DF",
                            pointBackgroundColor: "rgba(220, 220, 220, 1)",
                            pointBorderColor: "#9C43DF",
                            data: feePartnerChartData.map(obj => obj.amount)
                          },
                        ],
                      }}
                      height={100}
                      width={200}
                      options= {{
                        plugins: {
                          legend: {
                            display: false
                          },
                        },
                        responsive: true,
                        scales: {
                          xAxes: {
                            beginAtZero: false,
                            ticks: {
                              autoSkip: false,
                              maxRotation: 45,
                              minRotation: 45
                            }
                          },
                          yAxes: {
                            beginAtZero: true,
                            ticks: {
                              stepSize: 2000
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </Col>
              </Row>
          </div>
          <div className="va-section">
              <p className="h5 mb-2 mt-4">Grafik Biaya VA</p>
              <Row className="justify-content-md-center" style={{backgroundColor: "#FFFFFF"}}>
                <Col xs={12} className="mb-4 d-none d-sm-block">
                  {/* <Line options={options} data={data} />; */}
                  <div className="div-chart">
                    <Line
                      className="mt-3 mb-3"
                      data={{
                        labels: feeVaChartData.map(obj => obj.date),
                        datasets: [
                          {
                            label: null,
                            fill: true,
                            // backgroundColor: gradient,
                            backgroundColor: "rgba(156, 67, 223, 0.38)",
                            borderColor: "#9C43DF",
                            pointBackgroundColor: "rgba(220, 220, 220, 1)",
                            pointBorderColor: "#9C43DF",
                            data: feeVaChartData.map(obj => obj.amount)
                          },
                        ],
                      }}
                      height={100}
                      width={200}
                      options= {{
                        plugins: {
                          legend: {
                            display: false
                          },
                        },
                        responsive: true,
                        scales: {
                          xAxes: {
                            beginAtZero: false,
                            ticks: {
                              autoSkip: false,
                              maxRotation: 45,
                              minRotation: 45
                            }
                          },
                          yAxes: {
                            beginAtZero: true,
                            ticks: {
                              stepSize: 2000
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </Col>
              </Row>
          </div>
        </div>
      </div>
    </>
  );
};
