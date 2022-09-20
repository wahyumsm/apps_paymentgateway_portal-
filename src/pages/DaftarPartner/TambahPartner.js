import React, { useEffect, useState } from "react";
import { Col, Row, Form, Image } from "@themesberg/react-bootstrap";
import { useHistory } from "react-router-dom";
import encryptData from "../../function/encryptData";
import {
  BaseURL,
  convertToRupiah,
  errorCatch,
  getRole,
  getToken,
  RouteTo,
  setUserSession,
} from "../../function/helpers";
import axios from "axios";
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg";
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg";
import { useCallback } from "react";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import edit from "../../assets/icon/edit_icon.svg";
import deleted from "../../assets/icon/delete_icon.svg";
import { useRef } from "react";

function TambahPartner() {
  const [addPartner, setAddPartner] = useState({});
  const history = useHistory();
  const access_token = getToken();
  const user_role = getRole();
  const [fiturType, setFiturType] = useState({});
  const [listTypeMethod, setListTypeMethod] = useState({});
  const [loading, setLoading] = useState(false);
  const [fitur, setFitur] = useState("", "");
  const [edited, setEdited] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState([]);
  const [paymentNameMethod, setPaymentNameMethod] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [numbering, setNumbering] = useState(0);
  const myRef = useRef(null);
  const [payment, setPayment] = useState([]);
  const [inputHandle, setInputHandle] = useState({
    namaPerusahaan: "",
    emailPerusahaan: "",
    phoneNumber: "",
    alamat: "",
    noNpwp: "",
    namaNpwp: "",
    nama: "",
    noHp: "",
    active: 1,
    bankName: 1,
    akunBank: "",
    rekeningOwner: "",
  });

  const [biayaHandle, setBiayaHandle] = useState({
    fee: 0,
    settlementFee: 0,
  });

  const showCheckboxes = () => {
    if (!expanded) {
      setExpanded(true);
    } else {
      setExpanded(false);
    }
  };

  function handleChange(e) {
    setInputHandle({
      ...inputHandle,
      [e.target.name]: e.target.value,
    });
  }

  function handleChangeBiaya(e) {
    setBiayaHandle({
      ...biayaHandle,
      [e.target.name]: e.target.value,
    });
  }

  const handleChoosenPaymentType = useCallback(
    (e, payTypeId, payTypeName, listMethod) => {
      if (e.target.checked) {
        if (payTypeId === 0) {
          const allId = Object.values(listMethod).map(val => val.payment_id)          
          const allName = Object.values(listMethod).map(val => val.payment_name )
          setPaymentMethod(allId)
          setPaymentNameMethod(allName)
        } else {
          setPaymentMethod((value) => [...value, payTypeId]);
          setPaymentNameMethod((item) => [...item, payTypeName]);
        }
        
      } else {
        if (payTypeId === 0) {
          setPaymentMethod([])
          setPaymentNameMethod([])
        } else {
          setPaymentMethod((item) => item.filter((value) => value !== payTypeId));
          setPaymentNameMethod((item) =>
          item.filter((items) => items !== payTypeName)
        );
        }
      }
    },
    [setPaymentMethod, setPaymentNameMethod]
  );

  const handleChangeFitur = (e) => {
    setLoading(true);
    getTypeMethod(e.target.value);
    if (e.target.checked) {
      setFitur([e.target.value, e.target.name]);
      setLoading(false);
      setPaymentMethod([]);
      setPaymentNameMethod([]);
    }
  };

  const columnPayment = [
    {
      name: "No",
      selector: (row) => row.number,
      width: "67px",
    },
    {
      name: "Metode Pembayaran",
      selector: (row) => row.mpaytype_name.join(", "),
      width: "200px",
    },
    {
      name: "Fitur",
      selector: (row) => row.fitur_name,
    },
    {
      name: "Fee",
      selector: (row) => row.fee,
    },
    {
      name: "Settlement Fee",
      selector: (row) => row.fee_settle,
      width: "150px",
    },
    {
      name: "Aksi",
      //   selector: (row) => row.icon,
      width: "130px",
      cell: (row) => (
        <div className="d-flex justify-content-center align-items-center">
          <img
            src={edit}
            onClick={() => editInTableHandler(row.number)}
            style={{ cursor: "pointer" }}
          />
          <img
            onClick={() => deleteDataHandler(row.number)}
            src={deleted}
            style={{ cursor: "pointer" }}
            className="ms-2"
          />
        </div>
      ),
    },
  ];

  function editInTableHandler(numberId) {
    setEdited(true);
    const result = payment.find((item) => item.number === numberId);
    getTypeMethod(result.fitur_id);
    setBiayaHandle({
      fee: result.fee,
      settlementFee: result.fee_settle,
    });
    if (result.fitur_id) {
      setFitur([result.fitur_id, result.fitur_name]);
      setPaymentMethod(result.mpaytype_id);
      setPaymentNameMethod(result.mpaytype_name);
      setNumbering(result.number);
    }
  }

  function saveEditInTableHandler(
    numberId,
    fee,
    settleFee,
    fiturId,
    fiturName,
    typeId,
    typeName
  ) {
    const source = {
      fee: fee,
      fee_settle: settleFee,
      fitur_id: fiturId,
      fitur_name: fiturName,
      mpaytype_id: typeId,
      mpaytype_name: typeName,
      number: numberId,
    };
    const target = payment.find((item) => item.number === numberId);
    Object.assign(target, source);
    setPayment([...payment]);
    setEdited(false);
    setBiayaHandle({
      fee: 0,
      settlementFee: 0,
    });
    setFitur("", "");
    setPaymentMethod([]);
    setPaymentNameMethod([]);
  }

  function deleteDataHandler(numberId) {
    const result = payment.findIndex((item) => item.number === numberId);
    payment.splice(result, 1);
    setPayment([...payment]);
    setBiayaHandle({
      fee: 0,
      settlementFee: 0,
    });
    setFitur("", "");
    setPaymentMethod([]);
    setPaymentNameMethod([]);
    setEdited(false);
  }

  function batalEdit() {
    setBiayaHandle({
      fee: 0,
      settlementFee: 0,
    });
    setFitur("", "");
    setPaymentMethod([]);
    setPaymentNameMethod([]);
    setEdited(false);
}

  function saveNewSchemaHandle(
    fee,
    fee_settle,
    fiturId,
    fiturName,
    typeId,
    typeName,
    number
  ) {
    const newData = {
      fee: fee,
      fee_settle: fee_settle,
      fitur_id: fiturId,
      fitur_name: fiturName,
      mpaytype_id: typeId,
      mpaytype_name: typeName,
      number: Number(number),
    };
    setPayment((values) => [...values, newData]);
    setBiayaHandle({
      fee: 0,
      settlementFee: 0,
    });
    setFitur("", "");
    setPaymentMethod([]);
    setPaymentNameMethod([]);
  }

  // console.log(payment, "ini payment");

  async function getTypeFitur() {
    try {
      const auth = "Bearer " + getToken();
      const headers = {
        "Content-Type": "application/json",
        Authorization: auth,
      };
      const listFitur = await axios.post(
        "/Partner/GetFitur",
        { data: "" },
        { headers: headers }
      );
      // console.log(listFitur, "ini data list fitur");
      if (
        listFitur.status === 200 &&
        listFitur.data.response_code === 200 &&
        listFitur.data.response_new_token.length === 0
      ) {
        setFiturType(listFitur.data.response_data);
      } else if (
        listFitur.status === 200 &&
        listFitur.data.response_code === 200 &&
        listFitur.data.response_new_token.length !== 0
      ) {
        setUserSession(listFitur.data.response_new_token);
        setFiturType(listFitur.data.response_data);
      }
    } catch (error) {
      // console.log(error);
      // RouteTo(errorCatch(error.response.status))
      history.push(errorCatch(error.response.status));
    }
  }

  async function getTypeMethod(fiturId) {
    try {
      const auth = "Bearer " + getToken();
      const dataParams = encryptData(`{"fitur_id":"${fiturId}"}`);
      const headers = {
        "Content-Type": "application/json",
        Authorization: auth,
      };
      const paymentMethod = await axios.post(
        "/PaymentLink/GetMetodePembayaran",
        { data: dataParams },
        { headers: headers }
      );
      // console.log(paymentMethod, "ini data payment method");
      if (
        paymentMethod.status === 200 &&
        paymentMethod.data.response_code === 200 &&
        paymentMethod.data.response_new_token.length === 0
      ) {
        paymentMethod.data.response_data.unshift({
          payment_name: "Pilih Semua",
          payment_id: 0,
        });
        setListTypeMethod(paymentMethod.data.response_data);
      } else if (
        paymentMethod.status === 200 &&
        paymentMethod.data.response_code === 200 &&
        paymentMethod.data.response_new_token.length !== 0
      ) {
        setUserSession(paymentMethod.data.response_new_token);
        paymentMethod.data.response_data.unshift({
          payment_name: "Pilih Semua",
          payment_id: 0,
        });
        setListTypeMethod(paymentMethod.data.response_data);
      }
    } catch (error) {
      // console.log(error);
      // RouteTo(errorCatch(error.response.status))
      history.push(errorCatch(error.response.status));
    }
  }

  let atasFitur = 0;
  let bawahFitur = 0;
  let equalFitur = 0;

  if (fiturType.length % 2 === 1) {
    atasFitur = Math.ceil(fiturType.length / 2);
    bawahFitur = fiturType.length - atasFitur;
  } else {
    equalFitur = fiturType.length / 2;
  }

  function dataAtasFitur(params1) {
    let dataFitur = [];
    for (let i = 0; i < params1; i++) {
      dataFitur.push(fiturType[i]);
    }
    return dataFitur;
  }

  function dataBawahFitur(params2) {
    let dataFitur = [];
    for (let i = params2 + 1; i < fiturType.length; i++) {
      dataFitur.push(fiturType[i]);
    }
    return dataFitur;
  }

  function dataAtasEqualFitur(params1) {
    let dataFitur = [];
    for (let i = 0; i < params1; i++) {
      dataFitur.push(fiturType[i]);
    }
    return dataFitur;
  }

  function dataBawahEqualFitur(params2) {
    let dataFitur = [];
    for (let i = params2; i < fiturType.length; i++) {
      dataFitur.push(fiturType[i]);
    }
    return dataFitur;
  }

  let atasTypeMethod = 0;
  let bawahTypeMethod = 0;
  let equalTypeMethod = 0;

  if (listTypeMethod.length % 2 === 1) {
    atasTypeMethod = Math.ceil(listTypeMethod.length / 2);
    bawahTypeMethod = listTypeMethod.length - atasTypeMethod;
  } else {
    equalTypeMethod = listTypeMethod.length / 2;
  }

  function dataAtasMethod(params1) {
    let dataTypeMethod = [];
    for (let i = 0; i < params1; i++) {
      dataTypeMethod.push(listTypeMethod[i]);
    }
    return dataTypeMethod;
  }

  function dataBawahMethod(params2) {
    let dataTypeMethod = [];
    for (let i = params2 + 1; i < listTypeMethod.length; i++) {
      dataTypeMethod.push(listTypeMethod[i]);
    }
    return dataTypeMethod;
  }

  function dataAtasEqualMethod(params1) {
    let dataTypeMethod = [];
    for (let i = 0; i < params1; i++) {
      dataTypeMethod.push(listTypeMethod[i]);
    }
    return dataTypeMethod;
  }

  function dataBawahEqualMethod(params2) {
    let dataTypeMethod = [];
    for (let i = params2; i < listTypeMethod.length; i++) {
      dataTypeMethod.push(listTypeMethod[i]);
    }
    return dataTypeMethod;
  }

  async function tambahPartner(
    namaPerusahaan,
    emailPerusahaan,
    phoneNumber,
    alamat,
    noNpwp,
    namaNpwp,
    nama,
    noHp,
    active,
    bankName,
    akunBank,
    rekeningOwner,
    paymentData
  ) {
    try {
      paymentData = paymentData.map((item) => ({
        ...item,
        payment_id: item.mpaytype_id,
        settle_fee: item.fee_settle,
      }));
      paymentData = paymentData.filter(
        (item) => (
          delete item.number,
          delete item.mpaytype_name,
          delete item.mpaytype_id,
          delete item.fee_settle,
          delete item.fitur_name
        )
      );
      const auth = "Bearer " + getToken();
      const dataParams = encryptData(
        `{"mpartner_name": "${namaPerusahaan}", "mpartner_email": "${emailPerusahaan}", "mpartner_telp": "${phoneNumber}", "mpartner_address": "${alamat}", "mpartner_npwp": "${noNpwp}", "mpartner_npwp_name": "${namaNpwp}", "mpartner_direktur": "${nama}", "mpartner_direktur_telp": "${noHp}", "mpartner_is_active": ${active}, "bank_id": ${bankName}, "bank_account_number": "${akunBank}", "bank_account_name": "${rekeningOwner}", "payment_method": ${JSON.stringify(
          paymentData
        )}}`
      );
      const headers = {
        "Content-Type": "application/json",
        Authorization: auth,
      };
      const addPartner = await axios.post(
        "/Partner/SavePartner",
        { data: dataParams },
        { headers: headers }
      );
      // console.log(addPartner, 'ini add partner');
      if (
        addPartner.status === 200 &&
        addPartner.data.response_code === 200 &&
        addPartner.data.response_new_token.length === 0
      ) {
        history.push("/daftarpartner");
      } else if (
        addPartner.status === 200 &&
        addPartner.data.response_code === 200 &&
        addPartner.data.response_new_token.length !== 0
      ) {
        setUserSession(addPartner.data.response_new_token);
        history.push("/daftarpartner");
      }

      alert("Partner Baru Berhasil Ditambahkan");
    } catch (error) {
      // console.log(error);
      // RouteTo(errorCatch(error.response.status))
      history.push(errorCatch(error.response.status));
    }
  }

  const CustomLoader = () => (
    <div style={{ padding: "24px" }}>
      <Image
        className="loader-element animate__animated animate__jackInTheBox"
        src={loadingEzeelink}
        height={80}
      />
      <div>Loading...</div>
    </div>
  );

  useEffect(() => {
    if (!access_token) {
      history.push("/login");
      // window.location.reload();
    }
    if (user_role === "102") {
      history.push("/404");
    }
    getTypeFitur();
  }, [access_token, user_role]);

  return (
    <div className="main-content mt-5" style={{ padding: "37px 27px" }}>
      <span className="breadcrumbs-span">
        Beranda &nbsp;
        <img alt="" src={breadcrumbsIcon} /> &nbsp;Daftar Agen &nbsp;
        <img alt="" src={breadcrumbsIcon} /> &nbsp;Tambah Agen
      </span>
      <div className="head-title">
        <h4 className="mt-4 mb-4" style={{ fontFamily: "Exo" }}>
          Tambah Partner
        </h4>
        <h5 style={{ fontFamily: "Exo" }}>Profil Perusahaan</h5>
      </div>
      <div className="base-content" style={{ width: "100%", padding: 50 }}>
        <div>
          <Row className="mb-4">
            <Col xs={2} style={{ width: "14%", paddingRight: "unset" }}>
              <span
                style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}
              >
                Nama Perusahaan*
              </span>
            </Col>
            <Col xs={10}>
              <Form.Control
                name="namaPerusahaan"
                onChange={handleChange}
                placeholder="Masukkan Nama Perusahaan"
                type="text"
                style={{
                  width: "100%",
                  height: 40,
                  marginTop: "-7px",
                  marginLeft: "unset",
                }}
              />
            </Col>
          </Row>
          <Row className="mb-4">
            <Col xs={2} style={{ width: "14%", paddingRight: "unset" }}>
              <span
                style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}
              >
                Email Perusahaan*
              </span>
            </Col>
            <Col xs={10}>
              <Form.Control
                name="emailPerusahaan"
                onChange={handleChange}
                placeholder="Masukkan Email Perusahaan"
                type="text"
                style={{
                  width: "100%",
                  height: 40,
                  marginTop: "-7px",
                  marginLeft: "unset",
                }}
              />
            </Col>
          </Row>
          <Row className="mb-4">
            <Col xs={2} style={{ width: "14%", paddingRight: "unset" }}>
              <span
                style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}
              >
                Nomor Telepon*
              </span>
            </Col>
            <Col xs={10}>
              <Form.Control
                name="phoneNumber"
                onChange={handleChange}
                placeholder="Masukkan Nomor Telepon"
                type="text"
                style={{
                  width: "100%",
                  height: 40,
                  marginTop: "-7px",
                  marginLeft: "unset",
                }}
              />
            </Col>
          </Row>
          <Row className="mb-4">
            <Col xs={2} style={{ width: "14%", paddingRight: "unset" }}>
              <span
                style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}
              >
                Alamat*
              </span>
            </Col>
            <Col xs={10}>
              <Form.Control
                name="alamat"
                onChange={handleChange}
                placeholder="Masukkan Alamat"
                type="text"
                style={{
                  width: "100%",
                  height: 40,
                  marginTop: "-7px",
                  marginLeft: "unset",
                }}
              />
            </Col>
          </Row>
        </div>
      </div>
      <div className="head-title">
        <h5 className="mt-5 mb-4" style={{ fontFamily: "Exo" }}>
          Detail NPWP
        </h5>
      </div>
      <div className="base-content" style={{ width: "100%", padding: 50 }}>
        <div>
          <Row className="mb-4">
            <Col xs={2} style={{ width: "14%", paddingRight: "unset" }}>
              <span
                style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}
              >
                No NPWP*
              </span>
            </Col>
            <Col xs={10}>
              <Form.Control
                name="noNpwp"
                onChange={handleChange}
                placeholder="Masukkan Nomor NPWP"
                type="text"
                style={{
                  width: "100%",
                  height: 40,
                  marginTop: "-7px",
                  marginLeft: "unset",
                }}
              />
            </Col>
          </Row>
          <Row className="mb-4">
            <Col xs={2} style={{ width: "14%", paddingRight: "unset" }}>
              <span
                style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}
              >
                Nama NPWP*
              </span>
            </Col>
            <Col xs={10}>
              <Form.Control
                name="namaNpwp"
                onChange={handleChange}
                placeholder="Masukkan Nama NPWP"
                type="text"
                style={{
                  width: "100%",
                  height: 40,
                  marginTop: "-7px",
                  marginLeft: "unset",
                }}
              />
            </Col>
          </Row>
        </div>
      </div>
      <div className="head-title">
        <h5 className="mt-5 mb-4" style={{ fontFamily: "Exo" }}>
          Profil Direktur Perusahaan
        </h5>
      </div>
      <div className="base-content" style={{ width: "100%", padding: 50 }}>
        <div>
          <Row className="mb-4">
            <Col xs={2} style={{ width: "14%", paddingRight: "unset" }}>
              <span
                style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}
              >
                Nama Direktur*
              </span>
            </Col>
            <Col xs={10}>
              <Form.Control
                name="nama"
                onChange={handleChange}
                placeholder="Masukkan Nama Direktur"
                type="text"
                style={{
                  width: "100%",
                  height: 40,
                  marginTop: "-7px",
                  marginLeft: "unset",
                }}
              />
            </Col>
          </Row>
          <Row className="mb-4">
            <Col xs={2} style={{ width: "14%", paddingRight: "unset" }}>
              <span
                style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}
              >
                No Hp Direktur*
              </span>
            </Col>
            <Col xs={10}>
              <Form.Control
                name="noHp"
                onChange={handleChange}
                placeholder="Masukkan No HP Direktur"
                type="text"
                style={{
                  width: "100%",
                  height: 40,
                  marginTop: "-7px",
                  marginLeft: "unset",
                }}
              />
            </Col>
          </Row>
        </div>
      </div>
      <div className="head-title">
        <h5 className="mt-5 mb-4" style={{ fontFamily: "Exo" }}>
          Rekening
        </h5>
      </div>
      <div className="base-content" style={{ width: "100%", padding: 50 }}>
        <div>
          <Row className="mb-4">
            <Col xs={2} style={{ width: "14%", paddingRight: "unset" }}>
              <span
                style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}
              >
                Nama Bank*
              </span>
            </Col>
            <Col xs={10}>
              <Form.Control
                name="bankName"
                onChange={handleChange}
                placeholder="BCA"
                type="text"
                disabled
                style={{
                  width: "100%",
                  height: 40,
                  marginTop: "-7px",
                  marginLeft: "unset",
                }}
              />
            </Col>
          </Row>
          <Row className="mb-4">
            <Col xs={2} style={{ width: "14%", paddingRight: "unset" }}>
              <span
                style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}
              >
                No. Rekening*
              </span>
            </Col>
            <Col xs={10}>
              <Form.Control
                name="akunBank"
                onChange={handleChange}
                placeholder="Masukkan Nomor Rekening"
                type="text"
                style={{
                  width: "100%",
                  height: 40,
                  marginTop: "-7px",
                  marginLeft: "unset",
                }}
              />
            </Col>
          </Row>
          <Row className="mb-4">
            <Col xs={2} style={{ width: "14%", paddingRight: "unset" }}>
              <span
                style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}
              >
                Nama Pemilik Rekening*
              </span>
            </Col>
            <Col xs={10}>
              <Form.Control
                name="rekeningOwner"
                onChange={handleChange}
                placeholder="Masukkan Nama Pemilik Rekening"
                type="text"
                style={{
                  width: "100%",
                  height: 40,
                  marginTop: "-7px",
                  marginLeft: "unset",
                }}
              />
            </Col>
          </Row>
        </div>
      </div>
      <div className="head-title">
        <h5 className="mt-5 mb-4" style={{ fontFamily: "Exo" }}>
          Biaya
        </h5>
      </div>
      <div className="base-content" style={{ width: "100%", padding: 50 }}>
        <div>
          <Row className="mb-4">
            <Col xs={2} style={{ width: "14%", paddingRight: "unset" }}>
              <span
                style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}
              >
                Fee*
              </span>
            </Col>
            <Col xs={10}>
              <Form.Control
                name="fee"
                onChange={handleChangeBiaya}
                value={biayaHandle.fee}
                placeholder="Rp."
                type="number"
                style={{
                  width: "100%",
                  height: 40,
                  marginTop: "-7px",
                  marginLeft: "unset",
                }}
              />
            </Col>
          </Row>
          <Row className="mb-4">
            <Col xs={2} style={{ width: "14%", paddingRight: "unset" }}>
              <span
                style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}
              >
                Settlement Fee*
              </span>
            </Col>
            <Col xs={10}>
              <Form.Control
                name="settlementFee"
                onChange={handleChangeBiaya}
                value={biayaHandle.settlementFee}
                placeholder="Rp."
                type="number"
                style={{
                  width: "100%",
                  height: 40,
                  marginTop: "-7px",
                  marginLeft: "unset",
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={2} style={{ width: "14%", paddingRight: "unset" }}>
              <span
                style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}
              >
                Fitur <span style={{ color: "red" }}>*</span>
              </span>
            </Col>
            <Col>
              {equalFitur === 0 ? (
                <>
                  <Row>
                    {dataAtasFitur(atasFitur).map((item) => {
                      return (
                        <Col key={item.fitur_id} xs={2}>
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              id="inlineCheckbox1"
                              name={item.fitur_name}
                              value={item.fitur_id}
                              onChange={(e) => handleChangeFitur(e)}
                              checked={
                                edited === true
                                  ? fitur[0] && fitur.includes(item.fitur_name)
                                  : fitur.includes(item.fitur_name)
                              }
                            />
                            <label
                              className="form-check-label"
                              style={{ fontWeight: 400, fontSize: "14px" }}
                              for="inlineCheckbox1"
                            >
                              {item.fitur_name}
                            </label>
                          </div>
                        </Col>
                      );
                    })}
                  </Row>
                  <Row>
                    {dataBawahFitur(bawahFitur).map((item) => {
                      return (
                        <Col key={item.fitur_id} xs={2}>
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              id="inlineCheckbox1"
                              name={item.fitur_name}
                              value={item.fitur_id}
                              onChange={(e) => handleChangeFitur(e)}
                              checked={
                                edited === true
                                  ? fitur[0] && fitur.includes(item.fitur_name)
                                  : fitur.includes(item.fitur_name)
                              }
                            />
                            <label
                              className="form-check-label"
                              style={{ fontWeight: 400, fontSize: "14px" }}
                              for="inlineCheckbox1"
                            >
                              {item.fitur_name}
                            </label>
                          </div>
                        </Col>
                      );
                    })}
                  </Row>
                </>
              ) : (
                <>
                  <Row>
                    {dataAtasEqualFitur(equalFitur).map((item) => {
                      return (
                        <Col key={item.fitur_id} xs={2}>
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              id="inlineCheckbox1"
                              name={item.fitur_name}
                              value={item.fitur_id}
                              onChange={(e) => handleChangeFitur(e)}
                              checked={
                                edited === true
                                  ? fitur[0] && fitur.includes(item.fitur_name)
                                  : fitur.includes(item.fitur_name)
                              }
                            />
                            <label
                              className="form-check-label"
                              style={{ fontWeight: 400, fontSize: "14px" }}
                              for="inlineCheckbox1"
                            >
                              {item.fitur_name}
                            </label>
                          </div>
                        </Col>
                      );
                    })}
                  </Row>
                  <Row>
                    {dataBawahEqualFitur(equalFitur).map((item) => {
                      return (
                        <Col key={item.fitur_id} xs={2}>
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              id="inlineCheckbox1"
                              name={item.fitur_name}
                              value={item.fitur_id}
                              onChange={(e) => handleChangeFitur(e)}
                              checked={
                                edited === true
                                  ? fitur[0] && fitur.includes(item.fitur_name)
                                  : fitur.includes(item.fitur_name)
                              }
                            />
                            <label
                              className="form-check-label"
                              style={{ fontWeight: 400, fontSize: "14px" }}
                              for="inlineCheckbox1"
                            >
                              {item.fitur_name}
                            </label>
                          </div>
                        </Col>
                      );
                    })}
                  </Row>
                </>
              )}
            </Col>
          </Row>
          <Row
            className="mt-4"
            style={{
              display: fitur[0] !== undefined || edited === true ? "" : "none",
            }}
          >
            <Col xs={2} style={{ width: "14%", paddingRight: "unset" }}>
              <span
                style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}
              >
                Metode Pembayaran <span style={{ color: "red" }}>*</span>
              </span>
            </Col>
            <Col>
              {equalTypeMethod === 0 ? (
                <>
                  {loading ? (
                    <div className="d-flex justify-content-center align-items-center vh-100">
                      <CustomLoader />
                    </div>
                  ) : (
                    <>
                      <Row style={{ flexWrap: "nowrap" }}>
                        {dataAtasMethod(atasTypeMethod).map((item) => {
                          return (
                            <Col key={item.payment_id} xs={2}>
                              <div className="form-check form-check-inline">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="inlineCheckbox1"
                                  name={item.payment_name}
                                  value={item.payment_id}
                                  checked={
                                    listTypeMethod.length - 1 ===
                                    paymentMethod.length
                                      ? true
                                      : paymentMethod.includes(
                                          item.payment_id
                                        )
                                  }
                                  onChange={(e) =>
                                    handleChoosenPaymentType(
                                      e,
                                      item.payment_id,
                                      item.payment_name,
                                      listTypeMethod
                                    )
                                  }
                                />
                                <label
                                  className="form-check-label"
                                  style={{ fontWeight: 400, fontSize: "14px" }}
                                  for="inlineCheckbox1"
                                >
                                  {item.payment_name}
                                </label>
                              </div>
                            </Col>
                          );
                        })}
                      </Row>
                      <Row>
                        {dataBawahMethod(bawahTypeMethod).map((item) => {
                          return (
                            <Col key={item.payment_id} xs={2}>
                              <div className="form-check form-check-inline">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="inlineCheckbox1"
                                  name={item.payment_name}
                                  value={item.payment_id}
                                  checked={
                                    listTypeMethod.length - 1 ===
                                    paymentMethod.length
                                      ? true
                                      : paymentMethod.includes(
                                          item.payment_id
                                        )
                                  }
                                  onChange={(e) =>
                                    handleChoosenPaymentType(
                                      e,
                                      item.payment_id,
                                      item.payment_name,
                                      listTypeMethod
                                    )
                                  }
                                />
                                <label
                                  className="form-check-label"
                                  style={{ fontWeight: 400, fontSize: "14px" }}
                                  for="inlineCheckbox1"
                                >
                                  {item.payment_name}
                                </label>
                              </div>
                            </Col>
                          );
                        })}
                      </Row>
                    </>
                  )}
                </>
              ) : (
                <>
                  {loading ? (
                    <div className="d-flex justify-content-center align-items-center vh-100">
                      <CustomLoader />
                    </div>
                  ) : (
                    <>
                      <Row>
                        {dataAtasEqualMethod(equalTypeMethod).map((item) => {
                          return (
                            <Col key={item.payment_id} xs={2}>
                              <div className="form-check form-check-inline">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="inlineCheckbox1"
                                  name={item.payment_name}
                                  value={item.payment_id}
                                  checked={
                                    listTypeMethod.length - 1 ===
                                    paymentMethod.length
                                      ? true
                                      : paymentMethod.includes(
                                          item.payment_id
                                        )
                                  }
                                  onChange={(e) =>
                                    handleChoosenPaymentType(
                                      e,
                                      item.payment_id,
                                      item.payment_name,
                                      listTypeMethod
                                    )
                                  }
                                />
                                <label
                                  className="form-check-label"
                                  style={{ fontWeight: 400, fontSize: "14px" }}
                                  for="inlineCheckbox1"
                                >
                                  {item.payment_name}
                                </label>
                              </div>
                            </Col>
                          );
                        })}
                      </Row>
                      <Row>
                        {dataBawahEqualMethod(equalTypeMethod).map((item) => {
                          return (
                            <Col key={item.payment_id} xs={2}>
                              <div className="form-check form-check-inline">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="inlineCheckbox1"
                                  name={item.payment_name}
                                  value={item.payment_id}
                                  checked={
                                    listTypeMethod.length - 1 ===
                                    paymentMethod.length
                                      ? true
                                      : paymentMethod.includes(
                                          item.payment_id
                                        )
                                  }
                                  onChange={(e) =>
                                    handleChoosenPaymentType(
                                      e,
                                      item.payment_id,
                                      item.payment_name,
                                      listTypeMethod
                                    )
                                  }
                                />
                                <label
                                  className="form-check-label"
                                  style={{ fontWeight: 400, fontSize: "14px" }}
                                  for="inlineCheckbox1"
                                >
                                  {item.payment_name}
                                </label>
                              </div>
                            </Col>
                          );
                        })}
                      </Row>
                    </>
                  )}
                </>
              )}
            </Col>
          </Row>
          <Row className="d-flex justify-content-between align-items-center">
            <Col xs={1}></Col>
            <Col className="ms-5">
              {edited === false ? (
                <button
                  onClick={() =>
                    saveNewSchemaHandle(
                      biayaHandle.fee,
                      biayaHandle.settlementFee,
                      fitur[0],
                      fitur[1],
                      paymentMethod.filter(it => it !== 0),
                      paymentNameMethod.filter(it => it !== "Pilih Semua"),
                      payment.length + 1
                    )
                  }
                  style={{
                    fontFamily: "Exo",
                    fontSize: 16,
                    fontWeight: 700,
                    alignItems: "center",
                    padding: "12px 24px",
                    gap: 8,
                    width: 250,
                    height: 48,
                    color: "#077E86",
                    background: "unset",
                    border: "0.6px solid #077E86",
                    borderRadius: 6,
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} style={{ marginRight: 10 }} />{" "}
                  Tambah Skema Baru
                </button>
              ) : (
                <>
                  <button
                    className="mx-2"
                    onClick={() => batalEdit()}
                    style={{
                      fontFamily: "Exo",
                      fontSize: 16,
                      fontWeight: 900,
                      alignItems: "center",
                      padding: "12px 24px",
                      gap: 8,
                      width: 136,
                      height: 45,
                      background: "#FFFFFF",
                      color: "#888888",
                      border: "0.6px solid #EBEBEB",
                      borderRadius: 6,
                    }}
                  >
                    Batal
                  </button>
                  <button
                    style={{
                      fontFamily: "Exo",
                      fontSize: 16,
                      fontWeight: 700,
                      alignItems: "center",
                      padding: "12px 24px",
                      gap: 8,
                      width: 136,
                      height: 45,
                      color: "#077E86",
                      background: "transparent",
                      border: "1px solid #077E86",
                      borderRadius: 6,
                    }}
                    onClick={() =>
                      saveEditInTableHandler(
                        numbering,
                        biayaHandle.fee,
                        biayaHandle.settlementFee,
                        fitur[0],
                        fitur[1],
                        paymentMethod.filter(it => it !== 0),
                        paymentNameMethod.filter(it => it !== "Pilih Semua")
                      )
                    }
                  >
                    Simpan
                  </button>
                </>
              )}
            </Col>
            <Col>
              {expanded ? (
                <div
                  className="my-4"
                  style={{
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                    padding: "unset",
                  }}
                >
                  <button
                    style={{
                      fontFamily: "Exo",
                      fontSize: 16,
                      fontWeight: 700,
                      alignItems: "center",
                      gap: 8,
                      width: 300,
                      height: 48,
                      color: "#077E86",
                      background: "unset",
                      border: "unset",
                    }}
                    onClick={showCheckboxes}
                  >
                    Sembunyikan tabel skema biaya{" "}
                    <FontAwesomeIcon icon={faChevronUp} className="mx-2" />
                  </button>
                </div>
              ) : (
                <div
                  className="my-4"
                  style={{
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                    padding: "unset",
                  }}
                >
                  <button
                    style={{
                      fontFamily: "Exo",
                      fontSize: 16,
                      fontWeight: 700,
                      alignItems: "center",
                      gap: 8,
                      width: 300,
                      height: 48,
                      color: "#077E86",
                      background: "unset",
                      border: "unset",
                    }}
                    onClick={showCheckboxes}
                  >
                    Lihat tabel skema lainnya{" "}
                    <FontAwesomeIcon icon={faChevronDown} className="mx-2" />
                  </button>
                </div>
              )}
            </Col>
          </Row>
          {expanded && (
            <div className="div-table pb-4" ref={myRef}>
              <DataTable
                columns={columnPayment}
                data={payment}
                // customStyles={customStyles}
                // progressPending={pendingSettlement}
                progressComponent={<CustomLoader />}
              />
            </div>
          )}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          marginTop: 16,
          marginRight: 83,
        }}
      >
        <button
          onClick={() =>
            tambahPartner(
              inputHandle.namaPerusahaan,
              inputHandle.emailPerusahaan,
              inputHandle.phoneNumber,
              inputHandle.alamat,
              inputHandle.noNpwp,
              inputHandle.namaNpwp,
              inputHandle.nama,
              inputHandle.noHp,
              inputHandle.active,
              inputHandle.bankName,
              inputHandle.akunBank,
              inputHandle.rekeningOwner,
              payment
            )
          }
          style={{ width: 136 }}
        //   className="btn-ez-on"
          className={(inputHandle.namaPerusahaan.length !== 0 && inputHandle.emailPerusahaan.length !== 0 && inputHandle.phoneNumber.length !== 0 && inputHandle.alamat.length !== 0 && inputHandle.noNpwp.length !== 0 && inputHandle.namaNpwp.length !== 0 && inputHandle.nama.length !== 0 && inputHandle.noHp.length !== 0 && inputHandle.active.length !== 0 && inputHandle.bankName.length !== 0 && inputHandle.akunBank.length !== 0 && inputHandle.rekeningOwner.length !== 0 && inputHandle.payment !== 0 ) ? 'btn-ez-on' : 'btn-ez'}
          disabled={inputHandle.namaPerusahaan.length === 0 && inputHandle.emailPerusahaan.length === 0 && inputHandle.phoneNumber.length === 0 && inputHandle.alamat.length === 0 && inputHandle.noNpwp.length === 0 && inputHandle.namaNpwp.length === 0 && inputHandle.nama.length === 0 && inputHandle.noHp.length === 0 && inputHandle.active.length === 0 && inputHandle.bankName.length === 0 && inputHandle.akunBank.length === 0 && inputHandle.rekeningOwner.length === 0 && inputHandle.payment === 0 }
        >
          Tambahkan
        </button>
      </div>
    </div>
  );
}

export default TambahPartner;
