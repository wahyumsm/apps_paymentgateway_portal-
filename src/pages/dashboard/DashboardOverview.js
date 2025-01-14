import React, { useEffect, useRef, useState } from "react";
import { Image, Col, Row, Form } from "@themesberg/react-bootstrap";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg";
import { Line, Pie } from "react-chartjs-2";
import {
  BaseURL,
  convertToRupiah,
  errorCatch,
  getRole,
  getToken,
  removeUserSession,
  setUserSession,
} from "../../function/helpers";
import { useHistory } from "react-router-dom";
import axios from "axios";
import encryptData from "../../function/encryptData";
import chevron from "../../assets/icon/chevron_down_icon.svg";
import DateRangePicker from "@wojtekmaj/react-daterange-picker/dist/DateRangePicker";
import context from "@themesberg/react-bootstrap/lib/esm/AccordionContext";
import ReactSelect, { components } from "react-select";
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
  const history = useHistory();
  const access_token = getToken();
  const user_role = getRole();
  const [settlementTransaction, setSettlementTransaction] = useState({});
  const [partnerChartData, setPartnerChartData] = useState([]);
  const [feePartnerChartData, setFeePartnerChartData] = useState([]);
  const [feeVaChartData, setFeeVaChartData] = useState([]);
  const [paylinkChartData, setPaylinkChartData] = useState([]);
  const [listPartner, setListPartner] = useState([]);
  const currentDate = new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const [isCheckedPartner, setIsCheckedPartner] = useState(false);
  const [isCheckedBiaya, setIsCheckedBiaya] = useState(false);
  const [isCheckedVa, setIsCheckedVa] = useState(false);
  const [isCheckedPaylink, setIsCheckedPaylink] = useState(false);
  const [queryPartner, setQueryPartner] = useState([]);
  const [queryBiaya, setQueryBiaya] = useState([]);
  const [queryVa, setQueryVa] = useState([]);
  const [queryPaylink, setQueryPaylink] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [biaya, setBiaya] = useState(false);
  const [va, setVa] = useState(false);
  const [paylink, setPaylink] = useState(false);
  const myRef = useRef(null);
  const [statePartnerChart, setStatePartnerChart] = useState(null);
  const [stateFeePartner, setStateFeePartner] = useState(null);
  const [stateVaPartner, setStateVaPartner] = useState(null);
  const [statePaylink, setStatePaylink] = useState(null);
  const [dateRangePartnerChart, setDateRangePartnerChart] = useState([]);
  const [dateRangeFeePartner, setDateRangeFeePartner] = useState([]);
  const [dateRangeVaPartner, setDateRangeVaPartner] = useState([]);
  const [dateRangePaylink, setDateRangePaylink] = useState([]);
  const [showDatePartnerChart, setShowDatePartnerChart] = useState("none");
  const [showDateFeePartner, setShowDateFeePartner] = useState("none");
  const [showDateVaPartner, setShowDateVaPartner] = useState("none");
  const [showDatePaylink, setShowDatePaylink] = useState("none");
  const [isSelected, setIsSelected] = useState(null);
  const [pendingPartner, setPendingPartner] = useState(false);
  const [pendingFee, setPendingFee] = useState(false);
  const [pendingVa, setPendingVa] = useState(false);
  const [pendingPaylink, setPendingPaylink] = useState(false);
  const [inputHandle, setInputHandle] = useState({
    partnerId: "",
    periodePartnerChart: 0,
    periodeFeeChart: 0,
    periodeVaChart: 0,
    periodePaylinkChart: 0,
  });

  const [selectedOptionSettlementPartner, setSelectedOptionSettlementPartner] = useState([])
  const [selectedOptionBiayaPartner, setSelectedOptionBiayaPartner] = useState([])
  const [selectedOptionBiayaVA, setSelectedOptionBiayaVA] = useState([])
  const [selectedOptionPaymentLink, setSelectedOptionPaymentLink] = useState([])

  const Option = (props) => {
    return (
      <div>
        <components.Option {...props}>
          <input
            type="checkbox"
            checked={props.isSelected}
            onChange={() => null}
          />{" "}
          <label>{props.label}</label>
        </components.Option>
      </div>
    );
  };

  // const showCheckboxesBiaya = () => {
  //   if (!biaya) {
  //     setBiaya(true);
  //   } else {
  //     setBiaya(false);
  //   }
  // };

  // const showCheckboxesVa = () => {
  //   if (!va) {
  //     setVa(true);
  //   } else {
  //     setVa(false);
  //   }
  // };

  // const showCheckboxesPaylink = () => {
  //   if (!paylink) {
  //     setPaylink(true);
  //   } else {
  //     setPaylink(false);
  //   }
  // };

  // const handleQueryPartnerChange = (event) => {
  //   if (event.target.checked && !queryPartner.includes(event.target.value)) {
  //     setQueryPartner([...queryPartner, event.target.value]);
  //   } else if (
  //     !event.target.checked &&
  //     queryPartner.includes(event.target.value)
  //   ) {
  //     setQueryPartner(queryPartner.filter((q) => q !== event.target.value));
  //   }
  //   setIsCheckedPartner(!isCheckedPartner);
  // };

  // const handleQueryBiayaChange = (event) => {
  //   if (event.target.checked && !queryBiaya.includes(event.target.value)) {
  //     setQueryBiaya([...queryBiaya, event.target.value]);
  //   } else if (
  //     !event.target.checked &&
  //     queryBiaya.includes(event.target.value)
  //   ) {
  //     setQueryBiaya(queryBiaya.filter((q) => q !== event.target.value));
  //   }
  //   setIsCheckedBiaya(!isCheckedBiaya);
  // };

  // const handleQueryVaChange = (event) => {
  //   if (event.target.checked && !queryVa.includes(event.target.value)) {
  //     setQueryVa([...queryVa, event.target.value]);
  //   } else if (!event.target.checked && queryVa.includes(event.target.value)) {
  //     setQueryVa(queryVa.filter((q) => q !== event.target.value));
  //   }
  //   setIsCheckedVa(!isCheckedVa);
  // };

  // const handleQueryPaylinkChange = (event) => {
  //   if (event.target.checked && !queryPaylink.includes(event.target.value)) {
  //     setQueryPaylink([...queryPaylink, event.target.value]);
  //   } else if (
  //     !event.target.checked &&
  //     queryPaylink.includes(event.target.value)
  //   ) {
  //     setQueryPaylink(queryPaylink.filter((q) => q !== event.target.value));
  //   }
  //   setIsCheckedPaylink(!isCheckedPaylink);
  // };

  const customStylesSelectedOption = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: "none",
      color: "black"
    })
  }

  function handleChangePeriodeChart(e) {
    if (e.target.value === "7") {
      setShowDatePartnerChart("");
      setInputHandle({
        ...inputHandle,
        [e.target.name]: e.target.value,
      });
    } else {
      setShowDatePartnerChart("none");
      setInputHandle({
        ...inputHandle,
        [e.target.name]: e.target.value,
      });
    }
  }

  function pickDatePartnerChart(item) {
    setStatePartnerChart(item);
    if (item !== null) {
      item = item.map((el) => el.toLocaleDateString("en-CA"));
      setDateRangePartnerChart(item);
    }
  }

  function handleChangeFeePartner(e) {
    if (e.target.value === "7") {
      setShowDateFeePartner("");
      setInputHandle({
        ...inputHandle,
        [e.target.name]: e.target.value,
      });
    } else {
      setShowDateFeePartner("none");
      setInputHandle({
        ...inputHandle,
        [e.target.name]: e.target.value,
      });
    }
  }

  function pickFeePartnerChart(item) {
    setStateFeePartner(item);
    if (item !== null) {
      item = item.map((el) => el.toLocaleDateString("en-CA"));
      setDateRangeFeePartner(item);
    }
  }

  function handleChangeVaPartner(e) {
    if (e.target.value === "7") {
      setShowDateVaPartner("");
      setInputHandle({
        ...inputHandle,
        [e.target.name]: e.target.value,
      });
    } else {
      setShowDateVaPartner("none");
      setInputHandle({
        ...inputHandle,
        [e.target.name]: e.target.value,
      });
    }
  }

  function pickVaPartnerChart(item) {
    setStateVaPartner(item);
    if (item !== null) {
      item = item.map((el) => el.toLocaleDateString("en-CA"));
      setDateRangeVaPartner(item);
    }
  }

  function handleChangePaylinkChart(e) {
    if (e.target.value === "7") {
      setShowDatePaylink("");
      setInputHandle({
        ...inputHandle,
        [e.target.name]: e.target.value,
      });
    } else {
      setShowDatePaylink("none");
      setInputHandle({
        ...inputHandle,
        [e.target.name]: e.target.value,
      });
    }
  }

  function pickPaylinkChart(item) {
    setStatePaylink(item);
    if (item !== null) {
      item = item.map((el) => el.toLocaleDateString("en-CA"));
      setDateRangePaylink(item);
    }
  }

  async function listDataPartner(url) {
    try {
      const auth = "Bearer " + getToken();
      const headers = {
        "Content-Type": "application/json",
        Authorization: auth,
      };
      const listDataPartner = await axios.post(BaseURL +
        url,
        { data: "" },
        { headers: headers }
      );
      // console.log(listDataPartner, "list partner di beranda")
      if (
        listDataPartner.data.response_code === 200 &&
        listDataPartner.status === 200 &&
        listDataPartner.data.response_new_token.length === 0
      ) {
        let newArr = [];
        var obj = {};
        listDataPartner.data.response_data.forEach((item) => {
          obj.value = item.partner_id;
          obj.label = item.nama_perusahaan;
          newArr.push(obj);
          obj = {};
        });
        setListPartner(newArr);
      } else if (
        listDataPartner.data.response_code === 200 &&
        listDataPartner.status === 200 &&
        listDataPartner.data.response_new_token.length !== 0
      ) {
        setUserSession(listDataPartner.data.response_new_token);
        let newArr = [];
        var obj = {};
        listDataPartner.data.response_data.forEach((item) => {
          obj.value = item.partner_id;
          obj.label = item.nama_perusahaan;
          newArr.push(obj);
          obj = {};
        });
        setListPartner(newArr);
      }
    } catch (error) {
      // console.log(error);
      history.push(errorCatch(error.response.status));
    }
  }

  async function ringkasanData() {
    try {
      const auth = "Bearer " + getToken();
      const headers = {
          'Content-Type': 'application/json',
          'Authorization': auth
      }
      const ringkasanData = await axios.post(BaseURL + "/Home/GetSummaryTransaction", {data: ""}, { headers: headers });
      if (ringkasanData.status === 200 && ringkasanData.data.response_code === 200 && ringkasanData.data.response_new_token.length === 0) {
        setSettlementTransaction(ringkasanData.data.response_data)
      } else if (ringkasanData.status === 200 && ringkasanData.data.response_code === 200 && ringkasanData.data.response_new_token.length !== 0) {
        setUserSession(ringkasanData.data.response_new_token)
        setSettlementTransaction(ringkasanData.data.response_data)
      }
    } catch (error) {
      // console.log(error)
      history.push(errorCatch(error.response.status))
    }
  }

  async function partnerChartHandler(query) {
    try {
      setPendingPartner(true)
      const auth = 'Bearer ' + getToken();
      const dataParams = encryptData(`{"partner_id":[${query}], "dateID": 4}`)
      const headers = {
          'Content-Type': 'application/json',
          'Authorization': auth
      }
      const partnerChart = await axios.post(BaseURL + "/Home/GetSettlementPartnerChart", {data: dataParams}, { headers: headers });
      if (partnerChart.status === 200 && partnerChart.data.response_code === 200 && partnerChart.data.response_new_token.length === 0) {
        setPartnerChartData([{amount: 0, date: ""}, ...partnerChart.data.response_data])
        setPendingPartner(false)
      } else if (partnerChart.status === 200 && partnerChart.data.response_code === 200 && partnerChart.data.response_new_token.length !== 0) {
        setUserSession(partnerChart.data.response_new_token)
        setPartnerChartData([{amount: 0, date: ""}, ...partnerChart.data.response_data])
        setPendingPartner(false)
      } 
    } catch (error) {
      // console.log(error)
      history.push(errorCatch(error.response.status))
    }
  }

  async function filterPartnerChartHandler(dateId, periode, query) {
    try {
      let partnerId = []
      query.forEach(item => partnerId.push(item.value))
      setPendingPartner(true)
      const auth = 'Bearer ' + getToken();
      const dataParams = encryptData(`{"partner_id":["${partnerId}"], "dateID": ${dateId}, "date_from":"${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}"}`)
      const headers = {
          'Content-Type': 'application/json',
          'Authorization': auth
      }
      const filterPartnerChart = await axios.post(BaseURL + "/Home/GetSettlementPartnerChart", {data: dataParams}, { headers: headers });
      if (filterPartnerChart.status === 200 && filterPartnerChart.data.response_code === 200 && filterPartnerChart.data.response_new_token.length === 0) {
        setPartnerChartData([{amount: 0, date: ""}, ...filterPartnerChart.data.response_data])
        setPendingPartner(false)
      } else if (filterPartnerChart.status === 200 && filterPartnerChart.data.response_code === 200 && filterPartnerChart.data.response_new_token.length !== 0) {
        setUserSession(filterPartnerChart.data.response_new_token)
        setPartnerChartData([{amount: 0, date: ""}, ...filterPartnerChart.data.response_data])
        setPendingPartner(false)
      }
    } catch (error) {
      // console.log(error)
      history.push(errorCatch(error.response.status))
    }
  }

  async function feePartnerChartHandler(query) {
    try {
      setPendingFee(true);
      const auth = "Bearer " + getToken();
      const dataParams = encryptData(`{"partner_id":[${query}], "dateID": 4}`);
      const headers = {
          'Content-Type': 'application/json',
          'Authorization': auth
      }
      const feePartnerChart = await axios.post(BaseURL + "/Home/GetFeePartnerChart", {data: dataParams}, { headers: headers });
      if (feePartnerChart.status === 200 && feePartnerChart.data.response_code === 200 && feePartnerChart.data.response_new_token.length === 0) {
        setFeePartnerChartData([{amount: 0, date: ""}, ...feePartnerChart.data.response_data])
        setPendingFee(false)
      } else if (feePartnerChart.status === 200 && feePartnerChart.data.response_code === 200 && feePartnerChart.data.response_new_token.length !== 0) {
        setUserSession(feePartnerChart.data.response_new_token)
        setFeePartnerChartData([{amount: 0, date: ""}, ...feePartnerChart.data.response_data])
        setPendingFee(false)
      }
    } catch (error) {
      // console.log(error)
      history.push(errorCatch(error.response.status))
    }
  }

  async function filterFeePartnerHandler(dateId, periode, query) {
    try {
      let partnerId = []
      query.forEach(item => partnerId.push(item.value))
      setPendingFee(true)
      const auth = 'Bearer ' + getToken();
      const dataParams = encryptData(`{"partner_id":["${partnerId}"], "dateID": ${dateId}, "date_from":"${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}"}`)

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': auth
      }
      const filterFeePartnerChart = await axios.post(BaseURL + "/Home/GetFeePartnerChart", {data: dataParams}, { headers: headers });
      if (filterFeePartnerChart.status === 200 && filterFeePartnerChart.data.response_code === 200 && filterFeePartnerChart.data.response_new_token.length === 0) {
        setFeePartnerChartData([{amount: 0, date: ""}, ...filterFeePartnerChart.data.response_data])
        setPendingFee(false)
      } else if (filterFeePartnerChart.status === 200 && filterFeePartnerChart.data.response_code === 200 && filterFeePartnerChart.data.response_new_token.length !== 0) {
        setUserSession(filterFeePartnerChart.data.response_new_token)
        setFeePartnerChartData([{amount: 0, date: ""}, ...filterFeePartnerChart.data.response_data])
        setPendingFee(false)
      }
    } catch (error) {
      // console.log(error)
      history.push(errorCatch(error.response.status))
    }
  }

  async function feeVaChartHandler(query) {
    try {
      setPendingVa(true);
      const auth = "Bearer " + getToken();
      const dataParams = encryptData(`{"partner_id":[${query}], "dateID": 4}`);
      const headers = {
          'Content-Type': 'application/json',
          'Authorization': auth
      }
      const feeVaChartData = await axios.post(BaseURL + "/Home/GetFeeVAChart", {data: dataParams}, { headers: headers });
      if (feeVaChartData.status === 200 && feeVaChartData.data.response_code === 200 && feeVaChartData.data.response_new_token.length === 0) {
        setFeeVaChartData([{amount: 0, date: ""}, ...feeVaChartData.data.response_data])
        setPendingVa(false)
      } else if (feeVaChartData.status === 200 && feeVaChartData.data.response_code === 200 && feeVaChartData.data.response_new_token.length !== 0) {
        setUserSession(feeVaChartData.data.response_new_token)
        setFeeVaChartData([{amount: 0, date: ""}, ...feeVaChartData.data.response_data])
        setPendingVa(false)
      } 
    } catch (error) {
      // console.log(error)
      history.push(errorCatch(error.response.status))
    }
  }

  async function filterVaPartnerHandler(dateId, periode, query) {
    try {
      let partnerId = []
      query.forEach(item => partnerId.push(item.value))
      setPendingVa(true)
      const auth = 'Bearer ' + getToken();
      const dataParams = encryptData(`{"partner_id":["${partnerId}"], "dateID": ${dateId}, "date_from":"${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}"}`)
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': auth
      }
      const filterVaPartnerChart = await axios.post(BaseURL + "/Home/GetFeeVAChart", {data: dataParams}, { headers: headers });
      if (filterVaPartnerChart.status === 200 && filterVaPartnerChart.data.response_code === 200 && filterVaPartnerChart.data.response_new_token.length === 0) {
        setFeeVaChartData([{amount: 0, date: ""}, ...filterVaPartnerChart.data.response_data])
        setPendingVa(false)
      } else if (filterVaPartnerChart.status === 200 && filterVaPartnerChart.data.response_code === 200 && filterVaPartnerChart.data.response_new_token.length !== 0) {
        setUserSession(filterVaPartnerChart.data.response_new_token)
        setFeeVaChartData([{amount: 0, date: ""}, ...filterVaPartnerChart.data.response_data])
        setPendingVa(false)
      } 
    } catch (error) {
      // console.log(error)
      history.push(errorCatch(error.response.status))
    }
  }

  async function paylinkChartHandler(query) {
    try {
      setPendingPaylink(true);
      const auth = "Bearer " + getToken();
      const dataParams = encryptData(`{"partner_id":[${query}], "dateID": 4}`);
      const headers = {
        "Content-Type": "application/json",
        Authorization: auth,
      };
      const paylinkChartData = await axios.post(BaseURL +
        "/Home/GetFeePaymentLinkChart",
        { data: dataParams },
        { headers: headers }
      );
      // console.log(paylinkChartData.data.response_data, "paylink chart");
      if (
        paylinkChartData.status === 200 &&
        paylinkChartData.data.response_code === 200 &&
        paylinkChartData.data.response_new_token.length === 0
      ) {
        setPaylinkChartData([
          { amount: 0, date: "" },
          ...paylinkChartData.data.response_data,
        ]);
        setPendingPaylink(false);
      } else if (
        paylinkChartData.status === 200 &&
        paylinkChartData.data.response_code === 200 &&
        paylinkChartData.data.response_new_token.length !== 0
      ) {
        setUserSession(paylinkChartData.data.response_new_token);
        setPaylinkChartData([
          { amount: 0, date: "" },
          ...paylinkChartData.data.response_data,
        ]);
        setPendingPaylink(false);
      }
    } catch (error) {
      // console.log(error);
      history.push(errorCatch(error.response.status));
    }
  }

  async function filterPaylinkHandler(dateId, periode, query) {
    try {
      let partnerId = []
      query.forEach(item => partnerId.push(item.value))
      setPendingPaylink(true);
      const auth = "Bearer " + getToken();
      const dataParams = encryptData(
        `{"partner_id":["${partnerId}"], "dateID": ${dateId}, "date_from":"${
          periode.length !== 0 ? periode[0] : ""
        }", "date_to": "${periode.length !== 0 ? periode[1] : ""}"}`
      );
      const headers = {
        "Content-Type": "application/json",
        Authorization: auth,
      };
      const filterPaylinkChart = await axios.post(BaseURL +
        "/Home/GetFeePaymentLinkChart",
        { data: dataParams },
        { headers: headers }
      );
      // console.log(filterPaylinkChart, 'fee partner handler');
      if (
        filterPaylinkChart.status === 200 &&
        filterPaylinkChart.data.response_code === 200 &&
        filterPaylinkChart.data.response_new_token.length === 0
      ) {
        setPaylinkChartData([
          { amount: 0, date: "" },
          ...filterPaylinkChart.data.response_data,
        ]);
        setPendingPaylink(false);
      } else if (
        filterPaylinkChart.status === 200 &&
        filterPaylinkChart.data.response_code === 200 &&
        filterPaylinkChart.data.response_new_token.length !== 0
      ) {
        setUserSession(filterPaylinkChart.data.response_new_token);
        setPaylinkChartData([
          { amount: 0, date: "" },
          ...filterPaylinkChart.data.response_data,
        ]);
        setPendingPaylink(false);
      }
    } catch (error) {
      // console.log(error);
      history.push(errorCatch(error.response.status));
    }
  }

  const periodik = [
    { time: "Hari ini", value: 2 },
    { time: "Kemarin", value: 3 },
    { time: "7 Hari Kemarin", value: 4 },
    { time: "Bulan ini", value: 5 },
    { time: "Bulan Kemarin", value: 6 },
    { time: "Pilih Range Tanggal", value: 7 },
  ];

  function buttonResetPartner(param) {
    if (param === "Reset Partner") {
      setInputHandle({
        ...inputHandle,
        periodePartnerChart: 0,
      })
    }
    setStatePartnerChart(null)
    setDateRangePartnerChart([])
    setShowDatePartnerChart("none")
    setSelectedOptionSettlementPartner([])
  }

  function buttonResetFee(param) {
    if (param === "Reset Fee") {
      setInputHandle({
        ...inputHandle,
        periodeFeeChart: 0,
      })
    }
    setStateFeePartner(null)
    setDateRangeFeePartner([])
    setShowDateFeePartner("none")
    setSelectedOptionBiayaPartner([])
  }

  function buttonResetVa(param) {
    if (param === "Reset Va") {
      setInputHandle({
        ...inputHandle,
        periodeVaChart: 0,
      })
    }
    setStateVaPartner(null)
    setDateRangeVaPartner([])
    setShowDateVaPartner("none")
    setSelectedOptionBiayaVA([])
  }

  function buttonResetPaylink(param) {
    if (param === "Reset Paylink") {
      setInputHandle({
        ...inputHandle,
        periodePaylinkChart: 0,
        queryPaylink: [],
      });
    }
    setStatePaylink(null);
    setDateRangePaylink([]);
    setShowDatePaylink("none");
    setSelectedOptionPaymentLink([])
    // setQueryVa([]);
  }

  useEffect(() => {
    if (!access_token) {
      history.push("/login");
    }
    if (user_role === "102") {
      history.push("/404");
    }
    listDataPartner("/Partner/ListPartner");
    ringkasanData();
    partnerChartHandler(queryPartner);
    feePartnerChartHandler(queryBiaya);
    feeVaChartHandler(`${queryVa}`);
    paylinkChartHandler(queryPaylink);
  }, [access_token, user_role]);

  if(!access_token) {
    return (
      <div className="py-4 mt-6 content-page">
        <div className="head-title">
          <h2 className="h5 mb-2">Ringkasan</h2>
          <p
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 150,
            }}
          >
            There is no data in this page
          </p>
        </div>
      </div>
    );
  }

  const CustomLoader = () => (
    <div style={{ padding: "36px" }}>
      <Image
        className="loader-element animate__animated animate__jackInTheBox"
        src={loadingEzeelink}
        height={80}
      />
      <div>Loading...</div>
    </div>
  );

  return (
    <>
      <div className="py-5 mt-5 content-page">
        <div className="head-title">
          <h2 className="h5 mb-2" style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}>Ringkasan</h2>
          <p style={{ fontFamily: "Nunito", fontSize: 16 }}>{currentDate}</p>
        </div>
        <br />
        <div className="main-content">
          <Row>
            <Col lg={3}>
              <div className="card-information base-content-beranda">
                <p className="p-info">Total Dana Masuk</p>
                <p className="p-amount">{convertToRupiah((settlementTransaction.total_dana_masuk !== undefined) ? settlementTransaction.total_dana_masuk : 0)}</p>
              </div>
            </Col>
            <Col lg={3}>
              <div className="card-information base-content-beranda">
                <p className="p-info">Total Biaya Partner</p>
                <p className="p-amount">{convertToRupiah((settlementTransaction.total_biaya_partner !== undefined) ? settlementTransaction.total_biaya_partner : 0)}</p>
              </div>
            </Col>
            <Col lg={3}>
              <div className="card-information base-content-beranda">
                <p className="p-info">Total Biaya VA</p>
                <p className="p-amount">{convertToRupiah((settlementTransaction.total_biaya_va !== undefined) ? settlementTransaction.total_biaya_va : 0)}</p>
              </div>
            </Col>
            <Col lg={3}>
              <div className="card-information base-content-beranda">
                <p className="p-info">Total Biaya Payment Link</p>
                <p className="p-amount">
                  {convertToRupiah(
                    (settlementTransaction.total_biaya_payment_link !== undefined) ? settlementTransaction.total_biaya_payment_link : 0
                  )}
                </p>
              </div>
            </Col>
            <Col lg={3} className="mt-3">
              <div className="card-information base-content-beranda">
                <p className="p-info">Total Biaya Settlement</p>
                <p className="p-amount">{convertToRupiah((settlementTransaction.total_biaya_settlement !== undefined) ? settlementTransaction.total_biaya_settlement : 0)}</p>
              </div>
            </Col>
          </Row>
          <div className="settlement-section">
            <p className="h5 mb-2 mt-4">Grafik Settlement Partner</p>
            <div className="base-content mt-3">
              <Row className="mt-4">
                <Col xs={3}>
                  <span>Pilih Periode</span>
                  <Form.Select name='periodePartnerChart' value={inputHandle.periodePartnerChart} onChange={(e) => handleChangePeriodeChart(e)}>
                    <option defaultChecked disabled value={0}>Pilih Periode</option>
                    {periodik.map((times, idx) => {
                      return (
                        <option key={idx} value={times.value}>
                          {times.time}
                        </option>
                      );
                    })}
                  </Form.Select>
                  <div
                    className="my-2"
                    style={{ display: showDatePartnerChart }}
                  >
                    <DateRangePicker
                      onChange={pickDatePartnerChart}
                      value={statePartnerChart}
                      clearIcon={null}
                    />
                  </div>
                </Col>
                <Col xs={3}>
                  <span>Pilih Partner</span>
                    <div className="dropdown dropPartner">
                      <ReactSelect
                        isMulti
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        options={listPartner}
                        // allowSelectAll={true}
                        value={selectedOptionSettlementPartner}
                        onChange={(selected) => setSelectedOptionSettlementPartner(selected)}
                        placeholder="Pilih Partner"
                        components={{ Option }}
                        styles={customStylesSelectedOption}
                      />
                    </div>
                </Col>                
              </Row>
              <Row className="my-3">
                <Col xs={5}>
                  <Row>
                    <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                      <button
                          onClick={() => filterPartnerChartHandler(inputHandle.periodePartnerChart, dateRangePartnerChart, selectedOptionSettlementPartner)}
                          className={(inputHandle.periodePartnerChart !== 0) ? "btn-ez-on" : "btn-ez"}
                          disabled={inputHandle.periodePartnerChart === 0}
                      >
                        Terapkan
                      </button>
                    </Col>
                    <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                      <button
                          onClick={() => buttonResetPartner("Reset Partner")}
                          className={(inputHandle.periodePartnerChart !== 0) ? "btn-reset" : "btn-ez-reset"}
                          disabled={inputHandle.periodePartnerChart === 0}
                      >
                        Atur Ulang
                      </button>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row
                className="justify-content-md-center"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <Col xs={12} className="mb-4 d-none d-sm-block">
                  <div className="div-chart">
                    {
                      pendingPartner ? (
                        <div className="d-flex justify-content-center align-items-center vh-100">
                          <CustomLoader />
                        </div>
                      ) : (
                        //  (partnerChartData.length > 1) ?
                        <Line
                          id="myChart"
                          className="mt-3 mb-3"
                          data={{
                            labels: partnerChartData.map((obj) => obj.date),
                            datasets: [
                              {
                                label: null,
                                fill: true,
                                backgroundColor: (context) => {
                                  const ctx = context.chart.ctx;
                                  const gradient = ctx.createLinearGradient(
                                    0,
                                    0,
                                    0,
                                    900
                                  );
                                  gradient.addColorStop(
                                    0,
                                    "rgba(7, 126, 134, 0.38)"
                                  );
                                  gradient.addColorStop(
                                    0.5,
                                    "rgba(7, 126, 134, 0)"
                                  );
                                  gradient.addColorStop(
                                    1,
                                    "rgba(0, 124, 194, 0.7)"
                                  );
                                  return gradient;
                                },
                                borderColor: "#077E86",
                                pointBackgroundColor: "rgba(220, 220, 220, 1)",
                                pointBorderColor: "#9C43DF",
                                data: partnerChartData.map((obj) => obj.amount),
                              },
                            ],
                          }}
                          height={100}
                          width={200}
                          options={{
                            plugins: {
                              legend: {
                                display: false,
                              },
                              tooltip: {
                                displayColors: false,
                              },
                            },
                            responsive: true,
                            scales: {
                              xAxes: {
                                beginAtZero: false,
                                ticks: {
                                  autoSkip: false,
                                  maxRotation: 45,
                                  minRotation: 45,
                                },
                              },
                              yAxes: {
                                beginAtZero: true,
                                ticks: {
                                  callback: function (value, index, ticks) {
                                    if (value > 999 && value < 1e6) {
                                      return value / 1000 + " rb"; // convert to K for number from > 1000 < 1 million
                                    } else if (value >= 1e6) {
                                      return value / 1e6 + " jt"; // convert to M for number from > 1 million
                                    } else if (value >= 1e9) {
                                      return (
                                        (value / 1e9).toFixed(1) + " milyar"
                                      );
                                    } else if (value >= 1e12) {
                                      return (
                                        (value / 1e12).toFixed(1) + " milyar"
                                      );
                                    } else if (value < 1000) {
                                      return value; // if value < 1000, nothing to do
                                    }
                                  },
                                },
                              },
                            },
                          }}
                        />
                      )
                      //   :
                      //  <div style={{color: "black"}} className="d-flex justify-content-center align-items-center">There are no records to display</div>
                    }
                  </div>
                </Col>
              </Row>
            </div>
          </div>
          <div className="partner-section">
              <p className="h5 mb-2 mt-4">Grafik Biaya Partner</p>
              <div className="base-content mt-3">
                <Row className="mt-4">
                  <Col xs={3}>
                    <span>Pilih Periode</span>
                    <Form.Select name='periodeFeeChart' value={inputHandle.periodeFeeChart} onChange={(e) => handleChangeFeePartner(e)}>
                        <option defaultChecked disabled value={0} >Pilih Periode</option>
                        {periodik.map((times, idx) => {
                          return (
                            <option key={idx} value={times.value}>{times.time}</option>
                          )
                        }) }
                    </Form.Select>
                    <div className="my-2" style={{ display: showDateFeePartner }}>
                      <DateRangePicker 
                        onChange={pickFeePartnerChart}
                        value={stateFeePartner}
                        clearIcon={null}
                      />
                    </div>
                  </Col>
                  <Col xs={3}>
                    <span>Pilih Partner</span>
                      <div className="dropdown dropPartner">
                        <ReactSelect
                          isMulti
                          closeMenuOnSelect={false}
                          hideSelectedOptions={false}
                          options={listPartner}
                          // allowSelectAll={true}
                          value={selectedOptionBiayaPartner}
                          onChange={(selected) => setSelectedOptionBiayaPartner(selected)}
                          placeholder="Pilih Partner"
                          components={{ Option }}
                          styles={customStylesSelectedOption}
                        />
                      </div>
                  </Col>                
                </Row>
                <Row className='my-3'>
                  <Col xs={5}>
                    <Row>
                      <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                        <button
                            onClick={() => filterFeePartnerHandler(inputHandle.periodeFeeChart, dateRangeFeePartner, selectedOptionBiayaPartner)}
                            className={(inputHandle.periodeFeeChart !== 0) ? "btn-ez-on" : "btn-ez"}
                            disabled={inputHandle.periodeFeeChart === 0}
                        >
                            Terapkan
                        </button>
                      </Col>
                      <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                        <button
                          onClick={() => buttonResetFee("Reset Fee")}
                          className={(inputHandle.periodeFeeChart !== 0) ? "btn-reset" : "btn-ez-reset"}
                          disabled={inputHandle.periodeFeeChart === 0}
                        >
                            Atur Ulang
                        </button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row className="justify-content-md-center" style={{backgroundColor: "#FFFFFF"}}>
                  <Col xs={12} className="mb-4 d-none d-sm-block">
                    <div className="div-chart">
                      {pendingFee ?
                        <div className="d-flex justify-content-center align-items-center">
                          <CustomLoader />
                        </div> :
                        feePartnerChartData.length > 1 ?
                        <Line
                        className="mt-3 mb-3"
                        data={{
                          labels: feePartnerChartData.map(obj => obj.date),
                          datasets: [
                            {
                              label: null,
                              fill: true,
                              backgroundColor: (context) => {
                                const ctx = context.chart.ctx;
                                const gradient = ctx.createLinearGradient(0, 0, 0, 900);
                                gradient.addColorStop(0, "rgba(236, 84, 14, 0.38)");
                                gradient.addColorStop(0.5, "rgba(236, 84, 14, 0)");
                                gradient.addColorStop(1, "rgba(0, 124, 194, 0.7)");
                                return gradient;
                              },
                              borderColor: "#EC540E",
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
                            tooltip: {
                              displayColors: false,                              
                            }
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
                                callback: function(value, index, ticks) {
                                  if(value > 999 && value < 1e6){
                                    return (value/1000) + ' rb'; // convert to K for number from > 1000 < 1 million 
                                  } else if(value >= 1e6){
                                      return (value/1e6) + ' jt'; // convert to M for number from > 1 million 
                                  } else if (value >= 1e9) {
                                    return (value/1e9).toFixed(1) + ' milyar'
                                  } else if (value >= 1e12) {
                                    return (value/1e12).toFixed(1) + ' milyar'
                                  } else if (value < 1000) {
                                    return value; // if value < 1000, nothing to do
                                  }
                                }
                              }
                            }
                          }
                        }}
                        /> :
                        <div style={{color: "black"}} className="d-flex justify-content-center align-items-center">There are no records to display</div>
                      }
                    </div>
                  </Col>
                </Row>
              </div>
          </div>
          <div className="va-section">
              <p className="h5 mb-2 mt-4">Grafik Biaya VA</p>
              <div className="base-content mt-3">
                <Row className="mt-4">
                  <Col xs={3}>
                    <span>Pilih Periode</span>
                    <Form.Select name='periodeVaChart' value={inputHandle.periodeVaChart} onChange={(e) => handleChangeVaPartner(e)} >
                        <option defaultChecked disabled value={0}>Pilih Periode</option>
                        {periodik.map((times, idx) => {
                          return (
                            <option key={idx} value={times.value}>{times.time}</option>
                          )
                        }) }
                    </Form.Select>
                    <div className="my-2" style={{ display: showDateVaPartner }}>
                      <DateRangePicker 
                        onChange={pickVaPartnerChart}
                        value={stateVaPartner}
                        clearIcon={null}
                      />
                    </div>
                  </Col>
                  <Col xs={3}>
                    <span>Pilih Partner</span>
                    <div className="dropdown dropPartner">
                      <ReactSelect
                        isMulti
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        options={listPartner}
                        // allowSelectAll={true}
                        value={selectedOptionBiayaVA}
                        onChange={(selected) => setSelectedOptionBiayaVA(selected)}
                        placeholder="Pilih Partner"
                        components={{ Option }}
                        styles={customStylesSelectedOption}
                      />
                    </div>
                  </Col>                
                </Row>
                <Row className='my-3'>
                  <Col xs={5}>
                    <Row>
                      <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                        <button
                            onClick={() => filterVaPartnerHandler(inputHandle.periodeVaChart, dateRangeVaPartner, selectedOptionBiayaVA)}
                            className={(inputHandle.periodeVaChart !== 0) ? "btn-ez-on" : "btn-ez"}
                            disabled={inputHandle.periodeVaChart === 0}
                        >
                            Terapkan
                        </button>
                      </Col>
                      <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                        <button
                            onClick={() => buttonResetVa("Reset Va")}
                            className={(inputHandle.periodeVaChart !== 0) ? "btn-reset" : "btn-ez-reset"}
                            disabled={inputHandle.periodeVaChart === 0}
                        >
                            Atur Ulang
                        </button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row className="justify-content-md-center" style={{backgroundColor: "#FFFFFF"}}>
                  <Col xs={12} className="mb-4 d-none d-sm-block">
                    <div className="div-chart">
                      {pendingVa ?
                        <div className="d-flex justify-content-center align-items-center vh-100">
                          <CustomLoader />
                        </div>
                      : (
                        // feeVaChartData.length > 1 ?
                        <Line
                          style={{ overflowX: "scroll" }}
                          className="mt-3 mb-3"
                          data={{
                            labels: feeVaChartData.map((obj) => obj.date),
                            datasets: [
                              {
                                label: null,
                                fill: true,
                                backgroundColor: (context) => {
                                  const ctx = context.chart.ctx;
                                  const gradient = ctx.createLinearGradient(
                                    0,
                                    0,
                                    0,
                                    900
                                  );
                                  gradient.addColorStop(
                                    0,
                                    "rgba(156, 67, 223, 0.38)"
                                  );
                                  gradient.addColorStop(
                                    0.5,
                                    "rgba(156, 67, 223, 0)"
                                  );
                                  gradient.addColorStop(
                                    1,
                                    "rgba(0, 124, 194, 0.7)"
                                  );
                                  return gradient;
                                },
                                borderColor: "#9C43DF",
                                pointBackgroundColor: "rgba(220, 220, 220, 1)",
                                pointBorderColor: "#9C43DF",
                                data: feeVaChartData.map((obj) => obj.amount),
                              },
                            ],
                          }}
                          height={100}
                          width={200}
                          onProgress={<CustomLoader />}
                          options={{
                            plugins: {
                              legend: {
                                display: false,
                              },
                              tooltip: {
                                displayColors: false,
                              },
                            },
                            responsive: true,
                            scales: {
                              xAxes: {
                                beginAtZero: false,
                                ticks: {
                                  autoSkip: false,
                                  maxRotation: 45,
                                  minRotation: 45,
                                },
                              },
                              yAxes: {
                                beginAtZero: true,
                                ticks: {
                                  callback: function (value, index, ticks) {
                                    if (value > 999 && value < 1e6) {
                                      return value / 1000 + " rb"; // convert to K for number from > 1000 < 1 million
                                    } else if (value >= 1e6) {
                                      return value / 1e6 + " jt"; // convert to M for number from > 1 million
                                    } else if (value >= 1e9) {
                                      return (
                                        (value / 1e9).toFixed(1) + " milyar"
                                      );
                                    } else if (value >= 1e12) {
                                      return (
                                        (value / 1e12).toFixed(1) + " milyar"
                                      );
                                    } else if (value < 1000) {
                                      return value; // if value < 1000, nothing to do
                                    }
                                  },
                                },
                              },
                            },
                          }}
                        />
                      )
                      // :
                      // <div style={{color: "black"}} className="d-flex justify-content-center align-items-center">There are no records to display</div>
                    }
                  </div>
                </Col>
              </Row>
            </div>
          </div>
          <div className="paylink-section">
            <p className="h5 mb-2 mt-4">Grafik Biaya Payment Link</p>
            <div className="base-content mt-3">
              <Row className="mt-4">
                <Col xs={3}>
                  <span>Pilih Periode</span>
                  <Form.Select
                    name="periodePaylinkChart"
                    value={inputHandle.periodePaylinkChart}
                    onChange={(e) => handleChangePaylinkChart(e)}
                  >
                    <option defaultChecked disabled value={0}>Pilih Periode</option>
                    {periodik.map((times, idx) => {
                      return (
                        <option key={idx} value={times.value}>
                          {times.time}
                        </option>
                      );
                    })}
                  </Form.Select>
                  <div className="my-2" style={{ display: showDatePaylink }}>
                    <DateRangePicker
                      onChange={pickPaylinkChart}
                      value={statePaylink}
                      clearIcon={null}
                    />
                  </div>
                </Col>
                <Col xs={3}>
                  <span>Pilih Partner</span>
                  <div className="dropdown dropPartner">
                    <ReactSelect
                      isMulti
                      closeMenuOnSelect={false}
                      hideSelectedOptions={false}
                      options={listPartner}
                      // allowSelectAll={true}
                      value={selectedOptionPaymentLink}
                      onChange={(selected) => setSelectedOptionPaymentLink(selected)}
                      placeholder="Pilih Partner"
                      components={{ Option }}
                      styles={customStylesSelectedOption}
                    />
                    {/* <button
                      style={{
                        width: "225px",
                        height: "44px",
                        padding: "12px",
                        borderRadius: "8px",
                        backgroundColor: "#ffffff",
                        border: "1px solid #C4C4C4",
                      }}
                      className="d-flex justify-content-between align-items-center"
                      name="query"
                      onClick={showCheckboxesPaylink}
                      value="none"
                    >
                      <div>Semua</div>{" "}
                      <span>
                        <img
                          src={chevron}
                          alt="chevron"
                          style={{ fontSize: "5px" }}
                        />
                      </span>
                    </button>
                    {paylink && (
                      <div
                        ref={myRef}
                        className="checkboxes border-black-0 border border-solid position-absolute bg-white"
                        style={{
                          overflowY: "auto",
                          height: "10rem",
                          width: "14rem",
                        }}
                      >
                        {listPartner.map((item, idx) => {
                          return (
                            <div
                              key={idx}
                              className="d-flex align-items-center block m-1"
                            >
                              <input
                                type="checkbox"
                                name="query"
                                checked={isCheckedPartner[item.value]}
                                value={item.value}
                                onChange={handleQueryPaylinkChange}
                              />
                              <label className="mx-1 list" htmlFor="query">
                                {item.label}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    )} */}
                  </div>
                </Col>
              </Row>
              <Row className="my-3">
                <Col xs={5}>
                  <Row>
                    <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                      <button
                        onClick={() =>
                          filterPaylinkHandler(
                            inputHandle.periodePaylinkChart,
                            dateRangePaylink,
                            selectedOptionPaymentLink
                          )
                        }
                        className={
                            (inputHandle.periodePaylinkChart !== 0)
                            ? "btn-ez-on"
                            : "btn-ez"
                        }
                        disabled={
                          inputHandle.periodePaylinkChart === 0
                        }
                      >
                        Terapkan
                      </button>
                    </Col>
                    <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                      <button
                        onClick={() => buttonResetPaylink("Reset Paylink")}
                        className={                          
                          (inputHandle.periodePaylinkChart !== 0)
                            ? "btn-reset"
                            : "btn-ez-reset"
                        }
                        disabled={
                          inputHandle.periodePaylinkChart === 0
                        }
                      >
                        Atur Ulang
                      </button>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row
                className="justify-content-md-center"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <Col xs={12} className="mb-4 d-none d-sm-block">
                  <div className="div-chart">
                    {
                      pendingPaylink ? 
                        <div className="d-flex justify-content-center align-items-center vh-100">
                          <CustomLoader />
                        </div>
                       : (
                        //  (paylinkChartData.length > 1) ?
                        <Line
                          style={{ overflowX: "scroll" }}
                          className="mt-3 mb-3"
                          data={{
                            labels: paylinkChartData.map((obj) => obj.date),
                            datasets: [
                              {
                                label: null,
                                fill: true,
                                backgroundColor: (context) => {
                                  const ctx = context.chart.ctx;
                                  const gradient = ctx.createLinearGradient(
                                    0,
                                    0,
                                    0,
                                    900
                                  );
                                  gradient.addColorStop(
                                    0,
                                    "rgba(7, 126, 134, 0.38)"
                                  );
                                  gradient.addColorStop(
                                    0.5,
                                    "rgba(7, 126, 134, 0)"
                                  );
                                  gradient.addColorStop(
                                    1,
                                    "rgba(0, 124, 194, 0.7)"
                                  );
                                  return gradient;
                                },
                                borderColor: "#077E86",
                                pointBackgroundColor: "rgba(220, 220, 220, 1)",
                                pointBorderColor: "#9C43DF",
                                data: paylinkChartData.map((obj) => obj.amount),
                              },
                            ],
                          }}
                          height={100}
                          width={200}
                          options={{
                            plugins: {
                              legend: {
                                display: false,
                              },
                              tooltip: {
                                displayColors: false,
                              },
                            },
                            responsive: true,
                            scales: {
                              xAxes: {
                                beginAtZero: false,
                                ticks: {
                                  autoSkip: false,
                                  maxRotation: 45,
                                  minRotation: 45,
                                },
                              },
                              yAxes: {
                                beginAtZero: true,
                                ticks: {
                                  callback: function (value, index, ticks) {
                                    if (value > 999 && value < 1e6) {
                                      return value / 1000 + " rb"; // convert to K for number from > 1000 < 1 million
                                    } else if (value >= 1e6) {
                                      return value / 1e6 + " jt"; // convert to M for number from > 1 million
                                    } else if (value >= 1e9) {
                                      return (
                                        (value / 1e9).toFixed(1) + " milyar"
                                      );
                                    } else if (value >= 1e12) {
                                      return (
                                        (value / 1e12).toFixed(1) + " milyar"
                                      );
                                    } else if (value < 1000) {
                                      return value; // if value < 1000, nothing to do
                                    }
                                  },
                                },
                              },
                            },
                          }}
                        />
                      )
                      //   :
                      //  <div style={{color: "black"}} className="d-flex justify-content-center align-items-center">There are no records to display</div>
                    }
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
