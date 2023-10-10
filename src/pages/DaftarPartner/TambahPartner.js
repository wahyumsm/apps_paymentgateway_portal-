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
import noteIconRed from "../../assets/icon/note_icon_red.svg";
import alertIcon from "../../assets/icon/alert_icon.svg";
import CurrencyInput from 'react-currency-input-field'

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
  const [expandedSubAcc, setExpandedSubAcc] = useState(false)
  const [numbering, setNumbering] = useState(0);
  const myRef = useRef(null);
  const [payment, setPayment] = useState([]);
  const [redFlag, setRedFlag] = useState(false)
  const [mustFill, setMustFill] = useState(false)
  const [alertFee, setAlertFee] = useState(false)
  const [alertSettlement, setAlertSettlement] = useState(false)
  const [alertFeeType, setAlertFeeType] = useState(false)
  const [alertMinTopup, setAlertMinTopup] = useState(false)
  const [alertMinTransaksi, setAlertMinTransaksi] = useState(false)
  const [alertMaksTransaksi, setAlertMaksTransaksi] = useState(false)
  const [editFee, setEditFee] = useState(false)
  const [editSettle, setEditSettle] = useState(false)
  const [editMinTopup, setEditMinTopup] = useState(false)
  const [editMinTransaksi, setEditMinTransaksi] = useState(false)
  const [editMaxTransaksi, setEditMaxTransaksi] = useState(false)
  const [isDisableFeeType, setIsDisableFeeType] = useState(false)
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
    sumberAgen: "",
    akunBankSubAcc: "",
    rekeningOwnerSubAcc: "",
    bankNameSubAcc: "011",
    isChargeFee: false,
  });

  const [biayaHandle, setBiayaHandle] = useState({
    feeType: 0,
    fee: 0,
    settlementFee: 0,
    minTopup: 0,
    minTransaksi: 0,
    maksTransaksi: 0
  });

  const showCheckboxes = () => {
    if (!expanded) {
      setExpanded(true);
    } else {
      setExpanded(false);
    }
  };

  const showCheckboxesSubAccount = () => {
    if (!expandedSubAcc) {
      setExpandedSubAcc(true);
    } else {
      setExpandedSubAcc(false);
    }
  };

  function handleChange(e) {
    if (e.target.name === "isChargeFee") {
      setInputHandle({
        ...inputHandle,
        [e.target.name]: e.target.checked,
      });
    } else {
      setInputHandle({
        ...inputHandle,
        [e.target.name]: e.target.value,
      });
    }
  }

  function handleChangeFee(e, feeType) {
    setAlertFee(false)
    setBiayaHandle({
      ...biayaHandle,
      fee: e,
    });
    if (feeType === 101) {
      if (e === undefined || e === "") {
        setAlertFee(true)
      } else if (e.length === 3 && e !== "100") {
        setBiayaHandle({
          ...biayaHandle,
          fee: "100",
        });
      }
    }
  }

  // function handleChangeFee(e) {
  //   setAlertFee(false)
  //   setBiayaHandle({
  //     ...biayaHandle,
  //     [e.target.name]: Number(e.target.value).toString(),
  //   });
  //   if (e.target.value.length === 0) {
  //     setAlertFee(true)
  //   }
  // }

  function handleChangeSettlement(e) {
    setAlertSettlement(false)
    setBiayaHandle({
      ...biayaHandle,
      settlementFee: e,
    });
    if (e === undefined || e === "") {
      setAlertSettlement(true)
    }
  }

  // function handleChangeSettlement(e) {
  //   setAlertSettlement(false)
  //   setBiayaHandle({
  //     ...biayaHandle,
  //     [e.target.name]: Number(e.target.value).toString(),
  //   });
  //   if (e.target.value.length === 0) {
  //     setAlertSettlement(true)
  //   }
  // }

  // function handleChangeMinTopup(e) {
  //   setAlertMinTopup(false)
  //   setBiayaHandle({
  //     ...biayaHandle,
  //     minTopup: e,
  //   });
  //   if (e === undefined || e === "") {
  //     setAlertMinTopup(true)
  //   }
  // }

  // function handleChangeMinTopup(e) {
  //   if (e.target.value.length === 0) {
  //     setAlertMinTopup(true)
  //   } else {
  //     setAlertMinTopup(false)
  //     setBiayaHandle({
  //       ...biayaHandle,
  //       [e.target.name]: Number(e.target.value).toString()
  //     })
  //   }
  // }

  function handleChangeMinTransaksi(e) {
    setAlertMinTransaksi(false)
    setBiayaHandle({
      ...biayaHandle,
      minTransaksi: e,
    });
    if (e === undefined || e === "") {
      setAlertMinTransaksi(true)
    }
  }

  // function handleChangeMinTransaksi(e) {
  //   if (e.target.value.length === 0) {
  //     setAlertMinTransaksi(true)
  //   } else {
  //     setAlertMinTransaksi(false)
  //     setBiayaHandle({
  //       ...biayaHandle,
  //       [e.target.name]: Number(e.target.value).toString()
  //     })
  //   }
  // }

  function handleChangeMaksTransaksi(e) {
    setAlertMaksTransaksi(false)
    setBiayaHandle({
      ...biayaHandle,
      maksTransaksi: e,
    });
    if (e === undefined || e === "") {
      setAlertMaksTransaksi(true)
    }
  }

  // function handleChangeMaksTransaksi(e) {
  //   if (e.target.value.length === 0) {
  //     setAlertMaksTransaksi(true)
  //   } else {
  //     setAlertMaksTransaksi(false)
  //     setBiayaHandle({
  //       ...biayaHandle,
  //       [e.target.name]: Number(e.target.value).toString()
  //     })
  //   }
  // }

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
        setRedFlag(false)
        setMustFill(false)
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
        setRedFlag(false)
        setMustFill(false)
      }
    },
    [setPaymentMethod, setPaymentNameMethod]
  );

  const handleChangeFitur = (e, handleBiaya) => {
    if (e.target.name === "Payment Collection") {
      setIsDisableFeeType(false)
    } else {
      setIsDisableFeeType(true)
      if (handleBiaya.feeType !== 100) {
        setBiayaHandle({
          ...biayaHandle,
          feeType: 100,
          fee: ""
        })
      }
    }
    setLoading(true);
    setRedFlag(false)
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
      name: "Fitur",
      selector: (row) => row.fitur_name,
    },
    {
      name: "Metode Pembayaran",
      selector: (row) => row.mpaytype_name.join(", "),
      width: "230px",
      wrap: true
    },
    {
      name: "Tipe Fee",
      selector: (row) => row.fee_type === 100 ? "Fix Fee" : "Persentase",
      width: "200px",
      wrap: true
    },
    {
      name: "Fee",
      selector: (row) => row.fee_type === 100 ? convertToRupiah(row.fee, true, 2) : `${row.fee}%`,
    },
    {
      name: "Settlement Fee",
      selector: (row) => convertToRupiah(row.fee_settle, true, 2),
      width: "150px",
    },
    // {
    //   name: "Minimal Topup Alokasi",
    //   selector: (row) => convertToRupiah(row.mpartfitur_min_topup_allocation, true, 2),
    //   width: "200px",
    //   wrap: true
    // },
    {
      name: "Minimal Transaksi",
      selector: (row) => convertToRupiah(row.mpartfitur_min_amount_trx, true, 2),
      width: "180px",
      wrap: true
    },
    {
      name: "Maksimal Transaksi",
      selector: (row) => convertToRupiah(row.mpartfitur_max_amount_trx, true, 2),
      width: "180px",
      wrap: true
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
      feeType: result.fee_type,
      minTransaksi: result.mpartfitur_min_amount_trx,
      maksTransaksi: result.mpartfitur_max_amount_trx
    });
    if (result.fitur_id) {
      setFitur([result.fitur_id, result.fitur_name]);
      setPaymentMethod(result.mpaytype_id);
      setPaymentNameMethod(result.mpaytype_name);
      setNumbering(result.number);
    }
    if (result.fitur_id === 105) {
      setIsDisableFeeType(false)
    } else {
      setIsDisableFeeType(true)
    }
  }

  function saveEditInTableHandler(
    numberId,
    fee,
    settleFee,
    feeType,
    minTransaksi,
    maksTransaksi,
    fiturId,
    fiturName,
    typeId,
    typeName
  ) {
    if (typeId.length === 0) {
      setMustFill(true)
    } else {
      let sameFlag = 0
      const result = payment.filter(res => res.number !== numberId)
      result.forEach((val) => {
        if (val.fitur_id === Number(fiturId)) {
          val.mpaytype_id.forEach(item => {
            typeId.forEach(item2 => {
              if (item === item2) {
                sameFlag++
              }
            })
          })
        }
      })
      if (sameFlag === 0) {
        const source = {
          fee: typeof fee === "string" ? Number(fee.replaceAll(',', '.')) : fee,
          fee_settle: typeof settleFee === "string" ? Number(settleFee.replaceAll(',', '.')) : settleFee,
          fee_type: typeof feeType === "string" ? Number(feeType.replaceAll(',', '.')) : feeType,
          mpartfitur_min_amount_trx: typeof minTransaksi === "string" ? Number(minTransaksi.replaceAll(',', '.')) : minTransaksi,
          mpartfitur_max_amount_trx: typeof maksTransaksi === "string" ? Number(maksTransaksi.replaceAll(',', '.')) : maksTransaksi,
          fitur_id: Number(fiturId),
          fitur_name: fiturName,
          mpaytype_id: typeId,
          mpaytype_name: typeName,
          number: Number(numberId),
        };
        const target = payment.find((item) => item.number === numberId);
        Object.assign(target, source);
        setPayment([...payment]);
        setEdited(false);
        setBiayaHandle({
          fee: 0,
          settlementFee: 0,
          feeType: 0,
          minTransaksi: 0,
          maksTransaksi: 0
        });
        setFitur("", "");
        setPaymentMethod([]);
        setPaymentNameMethod([]);
        setIsDisableFeeType(false)
      } else {
        setRedFlag(true)
      }
    }

  }

  function deleteDataHandler(numberId) {
    const result = payment.findIndex((item) => item.number === numberId);
    payment.splice(result, 1);
    setPayment([...payment]);
    setBiayaHandle({
      fee: 0,
      settlementFee: 0,
      feeType: 0,
      minTransaksi: 0,
      maksTransaksi: 0
    });
    setFitur("", "");
    setPaymentMethod([]);
    setPaymentNameMethod([]);
    setEdited(false);
    setIsDisableFeeType(false)
  }

  function batalEdit() {
    setBiayaHandle({
      fee: 0,
      settlementFee: 0,
      feeType: 0,
      minTransaksi: 0,
      maksTransaksi: 0
    });
    setFitur("", "");
    setPaymentMethod([]);
    setPaymentNameMethod([]);
    setEdited(false);
    setRedFlag(false)
    setMustFill(false)
    setIsDisableFeeType(false)
}

  function saveNewSchemaHandle(
    fee,
    fee_settle,
    feeType,
    minTransaksi,
    maksTransaksi,
    fiturId,
    fiturName,
    typeId,
    typeName,
    number
  ) {
    let sameFlag = 0
    payment.forEach((val) => {
      if (val.fitur_id === fiturId) {
        val.mpaytype_id.forEach(item => {
          typeId.forEach(item2 => {
            if (item === item2) {
              sameFlag++
            }
          })
        })
      }
    })
    if (sameFlag === 0) {
      if (feeType === undefined || feeType === "0") {
        setAlertFeeType(true)
      } else {
        setAlertFeeType(false)
        if (typeId.length === 0) {
          setMustFill(true)
        } else {
          setMustFill(false)
          if (fee === undefined || fee.length === 0) {
            setAlertFee(true)
          } else {
            setAlertFee(false)
            if (fee_settle === undefined || fee_settle.length === 0) {
              setAlertSettlement(true)
            } else {
              setAlertSettlement(false)
              if (minTransaksi === undefined || minTransaksi.length === 0) {
                setAlertMinTransaksi(true)
              } else {
                setAlertMinTransaksi(false)
                if (maksTransaksi === undefined || maksTransaksi.length === 0) {
                  setAlertMaksTransaksi(true)
                } else {
                  setAlertMaksTransaksi(false)
                  const newData = {
                    fee: typeof fee === "string" ? Number(fee.replaceAll(',', '.')) : fee,
                    fee_settle: typeof fee_settle === "string" ? Number(fee_settle.replaceAll(',', '.')) : fee_settle,
                    fee_type: typeof feeType === "string" ? Number(feeType.replaceAll(',', '.')) : feeType,
                    mpartfitur_min_amount_trx: typeof minTransaksi === "string" ? Number(minTransaksi.replaceAll(',', '.')) : minTransaksi,
                    mpartfitur_max_amount_trx: typeof maksTransaksi === "string" ? Number(maksTransaksi.replaceAll(',', '.')) : maksTransaksi,
                    fitur_id: Number(fiturId),
                    fitur_name: fiturName,
                    mpaytype_id: typeId,
                    mpaytype_name: typeName,
                    number: Number(number),
                  };
                  setPayment((values) => [...values, newData]);
                  setRedFlag(false)
                  setBiayaHandle({
                    fee: 0,
                    settlementFee: 0,
                    feeType: 0,
                    minTransaksi: 0,
                    maksTransaksi: 0
                  });
                  setFitur("", "");
                  setPaymentMethod([]);
                  setPaymentNameMethod([]);
                  setIsDisableFeeType(false)
                }
              }
            }
          }
        }
      }
    } else {
      setRedFlag(true)
    }
  }

  async function getTypeFitur() {
    try {
      const auth = "Bearer " + getToken();
      const headers = {
        "Content-Type": "application/json",
        Authorization: auth,
      };
      const listFitur = await axios.post(BaseURL +
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
      const paymentMethod = await axios.post(BaseURL +
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
    isChargeFee,
    paymentData,
    // bankNameSubAcc,
    // rekeningOwnerSubAcc,
    // akunBankSubAcc
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
        `{"mpartner_name": "${namaPerusahaan}", "mpartner_email": "${emailPerusahaan}", "mpartner_telp": "${phoneNumber}", "mpartner_address": "${alamat}", "mpartner_npwp": "${noNpwp}", "mpartner_npwp_name": "${namaNpwp}", "mpartner_direktur": "${nama}", "mpartner_direktur_telp": "${noHp}", "mpartner_is_active": ${active}, "bank_id": ${bankName}, "bank_account_number": "${akunBank}", "bank_account_name": "${rekeningOwner}", "mpartner_is_charged_fee": ${isChargeFee}, "payment_method": ${JSON.stringify(
          paymentData
        )}, "sub_acc_bank_code": "", "sub_acc_name": "", "sub_acc_number": ""}`
      );
      const headers = {
        "Content-Type": "application/json",
        Authorization: auth,
      };
      const addPartner = await axios.post(BaseURL +
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

  function toDaftarPartner() {
    history.push("/daftarpartner");
}

function toDashboard() {
  history.push("/");
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

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#F2F2F2",
        border: "12px",
        fontWeight: "bold",
        fontSize: "16px",
      },
    },
  };

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
        <span style={{ cursor: "pointer" }} onClick={() => toDashboard()}>Beranda</span> &nbsp;
        <img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }} onClick={() => toDaftarPartner()}>Daftar Partner</span> &nbsp;
        <img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Tambah Partner</span>
      </span>
      <div className="head-title">
        <h4 className="mt-4 mb-4" style={{ fontFamily: "Exo" }}>
          Tambah Partner
        </h4>
        <h5 className=" mb-4" style={{ fontFamily: "Exo" }}>Profil Perusahaan</h5>
      </div>
      <div className="base-content" style={{ width: "100%", padding: 50 }}>
        <div>
          <Row className="mb-3 align-items-center">
            <Col xs={2} style={{ width: "14%", paddingRight: "unset" }}>
              <span
                style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}
              >
                Nama Perusahaan <span style={{ color: "red" }}>*</span>
              </span>
            </Col>
            <Col xs={10}>
              <Form.Control
                className="input-text-user"
                name="namaPerusahaan"
                onChange={handleChange}
                placeholder="Masukkan Nama Perusahaan"
                type="text"
                style={{
                  marginLeft: "unset"
                }}
              />
            </Col>
          </Row>
          <Row className="mb-3 align-items-center">
            <Col xs={2} style={{ width: "14%", paddingRight: "unset" }}>
              <span
                style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}
              >
                Email Perusahaan <span style={{ color: "red" }}>*</span>
              </span>
            </Col>
            <Col xs={10}>
              <Form.Control
                className="input-text-user"
                name="emailPerusahaan"
                onChange={handleChange}
                placeholder="Masukkan Email Perusahaan"
                type="text"
                style={{
                  marginLeft: "unset"
                }}
              />
            </Col>
          </Row>
          <Row className="mb-3 align-items-center">
            <Col xs={2} style={{ width: "14%", paddingRight: "unset" }}>
              <span
                style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}
              >
                Nomor Telepon <span style={{ color: "red" }}>*</span>
              </span>
            </Col>
            <Col xs={10}>
              <Form.Control
                className="input-text-user"
                name="phoneNumber"
                onChange={handleChange}
                placeholder="Masukkan Nomor Telepon"
                type="number"
                onKeyDown={(evt) => ["e", "E", "+", "-", ".", ","].includes(evt.key) && evt.preventDefault()}
                style={{
                  marginLeft: "unset"
                }}
              />
            </Col>
          </Row>
          <Row className="mb-3 align-items-center">
            <Col xs={2} style={{ width: "14%", paddingRight: "unset" }}>
              <span
                style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}
              >
                Alamat <span style={{ color: "red" }}>*</span>
              </span>
            </Col>
            <Col xs={10}>
              <Form.Control
                className="input-text-user"
                name="alamat"
                onChange={handleChange}
                placeholder="Masukkan Alamat"
                type="text"
                style={{
                  marginLeft: "unset"
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
          <Row className="mb-3 align-items-center">
            <Col xs={2} style={{ width: "14%", paddingRight: "unset" }}>
              <span
                style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}
              >
                No NPWP <span style={{ color: "red" }}>*</span>
              </span>
            </Col>
            <Col xs={10}>
              <Form.Control
                className="input-text-user"
                name="noNpwp"
                onChange={handleChange}
                placeholder="Masukkan Nomor NPWP"
                type="number"
                onKeyDown={(evt) => ["e", "E", "+", "-", ".", ","].includes(evt.key) && evt.preventDefault()}
                style={{
                  marginLeft: "unset",
                }}
              />
            </Col>
          </Row>
          <Row className="mb-3 align-items-center">
            <Col xs={2} style={{ width: "14%", paddingRight: "unset" }}>
              <span
                style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}
              >
                Nama NPWP <span style={{ color: "red" }}>*</span>
              </span>
            </Col>
            <Col xs={10}>
              <Form.Control
                className="input-text-user"
                name="namaNpwp"
                onChange={handleChange}
                placeholder="Masukkan Nama NPWP"
                type="text"
                style={{
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
          <Row className="mb-3 align-items-center">
            <Col xs={2} style={{ width: "14%", paddingRight: "unset" }}>
              <span
                style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}
              >
                Nama Direktur <span style={{ color: "red" }}>*</span>
              </span>
            </Col>
            <Col xs={10}>
              <Form.Control
                className="input-text-user"
                name="nama"
                onChange={handleChange}
                placeholder="Masukkan Nama Direktur"
                type="text"
                style={{
                  marginLeft: "unset",
                }}
              />
            </Col>
          </Row>
          <Row className="mb-3 align-items-center">
            <Col xs={2} style={{ width: "14%", paddingRight: "unset" }}>
              <span
                style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}
              >
                No Hp Direktur <span style={{ color: "red" }}>*</span>
              </span>
            </Col>
            <Col xs={10}>
              <Form.Control
                className="input-text-user"
                name="noHp"
                onChange={handleChange}
                placeholder="Masukkan No HP Direktur"
                type="number"
                onKeyDown={(evt) => ["e", "E", "+", "-", ".", ","].includes(evt.key) && evt.preventDefault()}
                style={{
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
          <Row className="mb-3 align-items-center">
            <Col xs={2} style={{ width: "14%", paddingRight: "unset" }}>
              <span
                style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}
              >
                Nama Bank <span style={{ color: "red" }}>*</span>
              </span>
            </Col>
            <Col xs={10}>
              <Form.Control
                className="input-text-user"
                name="bankName"
                onChange={handleChange}
                placeholder="BCA"
                type="text"
                disabled
                style={{
                  marginLeft: "unset",
                }}
              />
            </Col>
          </Row>
          <Row className="mb-3 align-items-center">
            <Col xs={2} style={{ width: "14%", paddingRight: "unset" }}>
              <span
                style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}
              >
                No. Rekening <span style={{ color: "red" }}>*</span>
              </span>
            </Col>
            <Col xs={10}>
              <Form.Control
                className="input-text-user"
                name="akunBank"
                onChange={handleChange}
                placeholder="Masukkan Nomor Rekening"
                type="number"
                onKeyDown={(evt) => ["e", "E", "+", "-", ".", ","].includes(evt.key) && evt.preventDefault()}
                style={{
                  marginLeft: "unset",
                }}
              />
            </Col>
          </Row>
          <Row className="mb-3 align-items-center">
            <Col xs={2} style={{ width: "14%", paddingRight: "unset" }}>
              <span
                style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}
              >
                Nama Pemilik Rekening <span style={{ color: "red" }}>*</span>
              </span>
            </Col>
            <Col xs={10}>
              <Form.Control
                className="input-text-user"
                name="rekeningOwner"
                onChange={handleChange}
                placeholder="Masukkan Nama Pemilik Rekening"
                type="text"
                style={{
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
          <Row className="mb-3 align-items-center">
            <Col xs={2} style={{ width: "14%", paddingRight: "unset" }}>
              <span
                style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}
              >
                Partner Charge Fee Bank
              </span>
            </Col>
            <Col xs={10}>
              <Form.Check
                type="switch"
                id="custom-switch"
                label={
                  inputHandle.isChargeFee === false
                    ? "False"
                    : "True"
                }
                checked={inputHandle.isChargeFee}
                name="isChargeFee"
                onChange={handleChange}
              />
            </Col>
          </Row>
          <Row className="mb-3 align-items-center">
            <Col xs={2} style={{ width: "14%", paddingRight: "unset" }}>
              <span
                style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}
              >
                Tipe Fee <span style={{ color: "red" }}>*</span>
              </span>
            </Col>
            <Col xs={10}>
              <Form.Select name='feeType' className='input-text-user' style={{ display: "inline" }} value={biayaHandle.feeType} disabled={isDisableFeeType} onChange={(e) => { setAlertFeeType(false); setBiayaHandle({ ...biayaHandle, feeType: Number(e.target.value), fee: 0 }) }}>
                <option defaultValue disabled value={0}>Pilih Tipe Fee</option>
                <option value={100}>Fix Fee</option>
                <option value={101}>Persentase</option>
              </Form.Select>
              {alertFeeType === true ?
                <div style={{ color: "#B9121B", fontSize: 12 }} className="mt-1">
                  <img src={noteIconRed} className="me-2" alt="icon notice" />
                  Tipe Fee harus dipilih
                </div> : ""
              }
            </Col>
          </Row>
          <Row className="mb-3 align-items-center">
            <Col xs={2} style={{ width: "14%", paddingRight: "unset" }}>
              <span
                style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}
              >
                Fee <span style={{ color: "red" }}>*</span>
              </span>
            </Col>
            <Col xs={10}>
              <CurrencyInput
                className="input-text-user"
                value={biayaHandle.fee}
                onValueChange={(e) => handleChangeFee(e, biayaHandle.feeType)}
                placeholder="Masukkan Fee"
                style={{
                  borderColor: alertFee ? "red" : ""
                }}
                groupSeparator={"."}
                decimalSeparator={','}
                maxLength={biayaHandle.feeType === 101 ? 3 : false}
                prefix={biayaHandle.feeType === 0 || biayaHandle.feeType === 100 ? "Rp " : ""}
                suffix={biayaHandle.feeType === 0 || biayaHandle.feeType === 100 ? "" : "%"}
              />

              {/* {editFee ?
                <Form.Control
                  name="fee"
                  onChange={handleChangeFee}
                  value={biayaHandle.fee.length === 0 ? "" : (biayaHandle.fee)}
                  placeholder="Rp. 0"
                  type="number"
                  style={{
                    width: "100%",
                    height: 40,
                    marginTop: "-7px",
                    marginLeft: "unset",
                    borderColor: alertFee ? "red" : ""
                  }}
                  onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                  min={0}
                  onBlur={() => setEditFee(!editFee)}
                /> :
                <Form.Control
                  name="fee"
                  onChange={handleChangeFee}
                  value={biayaHandle.fee.length === 0 ? "" : convertToRupiah(biayaHandle.fee, true, 2)}
                  placeholder="Rp. 0"
                  type="text"
                  style={{
                    width: "100%",
                    height: 40,
                    marginTop: "-7px",
                    marginLeft: "unset",
                    borderColor: alertFee ? "red" : ""
                  }}
                  // min={0}
                  onFocus={() => setEditFee(!editFee)}
                />
              } */}
              {alertFee === true ?
                <div style={{ color: "#B9121B", fontSize: 12 }} className="mt-1">
                  <img src={noteIconRed} className="me-2" alt="icon notice" />
                  Fee Wajib Diisi. Jika tidak dikenakan biaya silahkan tulis 0
                </div> : ""
              }
            </Col>
          </Row>
          <Row className="mb-3 align-items-center">
            <Col xs={2} style={{ width: "14%", paddingRight: "unset" }}>
              <span
                style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}
              >
                Settlement Fee <span style={{ color: "red" }}>*</span>
              </span>
            </Col>
            <Col xs={10}>
              <CurrencyInput
                className="input-text-user"
                value={biayaHandle.settlementFee}
                onValueChange={(e) => handleChangeSettlement(e)}
                placeholder="Masukkan Settlement Fee"
                style={{
                  borderColor: alertSettlement ? "red" : ""
                }}
                groupSeparator={"."}
                decimalSeparator={','}
                prefix={"Rp "}
              />

              {/* {editSettle ?
                <Form.Control
                  name="settlementFee"
                  onChange={handleChangeSettlement}
                  value={(biayaHandle.settlementFee.length === 0) ? "" : (biayaHandle.settlementFee)}
                  placeholder="Rp. 0"
                  type="number"
                  style={{
                    width: "100%",
                    height: 40,
                    marginTop: "-7px",
                    marginLeft: "unset",
                    borderColor: alertSettlement ? "red" : ""
                  }}
                  onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                  min={0}
                  onBlur={() => setEditSettle(!editSettle)}
                /> :
                <Form.Control
                  name="settlementFee"
                  onChange={handleChangeSettlement}
                  value={(biayaHandle.settlementFee.length === 0) ? "" : convertToRupiah(biayaHandle.settlementFee, true, 2)}
                  placeholder="Rp. 0"
                  type="text"
                  style={{
                    width: "100%",
                    height: 40,
                    marginTop: "-7px",
                    marginLeft: "unset",
                    borderColor: alertSettlement ? "red" : ""
                  }}
                  // min={0}
                  onFocus={() => setEditSettle(!editSettle)}
                />
              } */}
              {alertSettlement === true ?
                <div style={{ color: "#B9121B", fontSize: 12 }} className="mt-1">
                  <img src={noteIconRed} className="me-2" alt="icon notice" />
                  Settlement Wajib Diisi. Jika tidak dikenakan biaya silahkan tulis 0
                </div> : ""
              }
            </Col>
          </Row>
          {/* <Row className="mb-3 align-items-center"> */}
            {/* <Col xs={2} style={{ width: "14%", paddingRight: "unset" }}>
              <span
                style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}
              >
                Minimal Topup Alokasi <span style={{ color: "red" }}>*</span>
              </span>
            </Col>
            <Col xs={10}>
              <CurrencyInput
                className="input-text-user"
                value={biayaHandle.minTopup}
                onValueChange={(e) => handleChangeMinTopup(e)}
                placeholder="Masukkan Minimal Top Up Alokasi"
                style={{
                  borderColor: alertMinTopup ? "red" : ""
                }}
                groupSeparator={"."}
                decimalSeparator={','}
                prefix={"Rp "}
              /> */}

              {/* {editMinTopup ?
                <Form.Control
                  name="minTopup"
                  onChange={handleChangeMinTopup}
                  value={(biayaHandle.minTopup.length === 0) ? "" : (biayaHandle.minTopup)}
                  placeholder="Rp. 0"
                  type="number"
                  style={{
                    width: "100%",
                    height: 40,
                    marginTop: "-7px",
                    marginLeft: "unset",
                    borderColor: alertMinTopup ? "red" : ""
                  }}
                  onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                  min={0}
                  onBlur={() => setEditMinTopup(!editMinTopup)}
                /> :
                <Form.Control
                  name="minTopup"
                  onChange={handleChangeMinTopup}
                  value={(biayaHandle.minTopup.length === 0) ? "" : convertToRupiah(biayaHandle.minTopup, true, 2)}
                  placeholder="Rp. 0"
                  type="text"
                  style={{
                    width: "100%",
                    height: 40,
                    marginTop: "-7px",
                    marginLeft: "unset",
                    borderColor: alertMinTopup ? "red" : ""
                  }}
                  // min={0}
                  onFocus={() => setEditMinTopup(!editMinTopup)}
                />
              } */}
              {/* {alertMinTopup === true ?
                <div style={{color: "#B9121B", fontSize: 12}} className="mt-1">
                    <img src={noteIconRed} className="me-2" alt="icon notice" />
                    Minimal Topup Alokasi Wajib Diisi. Jika tidak dikenakan biaya silahkan tulis 0
                </div> : ""
              }
            </Col>
          </Row> */}
          <Row className="mb-3 align-items-center">
            <Col xs={2} style={{ width: "14%", paddingRight: "unset" }}>
              <span
                style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}
              >
                Minimal Transaksi <span style={{ color: "red" }}>*</span>
              </span>
            </Col>
            <Col xs={10}>
              <CurrencyInput
                className="input-text-user"
                value={biayaHandle.minTransaksi}
                onValueChange={(e) => handleChangeMinTransaksi(e)}
                placeholder="Masukkan Minimal Transaksi"
                style={{
                  borderColor: alertMinTransaksi ? "red" : ""
                }}
                groupSeparator={"."}
                decimalSeparator={','}
                prefix={"Rp "}
              />

              {/* {editMinTransaksi ?
                <Form.Control
                  name="minTransaksi"
                  onChange={handleChangeMinTransaksi}
                  value={(biayaHandle.minTransaksi.length === 0) ? "" : (biayaHandle.minTransaksi)}
                  placeholder="Rp. 0"
                  type="number"
                  style={{
                    width: "100%",
                    height: 40,
                    marginTop: "-7px",
                    marginLeft: "unset",
                    borderColor: alertMinTransaksi ? "red" : ""
                  }}
                  onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                  min={0}
                  onBlur={() => setEditMinTransaksi(!editMinTransaksi)}
                /> :
                <Form.Control
                  name="minTransaksi"
                  onChange={handleChangeMinTransaksi}
                  value={(biayaHandle.minTransaksi.length === 0) ? "" : convertToRupiah(biayaHandle.minTransaksi, true, 2)}
                  placeholder="Rp. 0"
                  type="text"
                  style={{
                    width: "100%",
                    height: 40,
                    marginTop: "-7px",
                    marginLeft: "unset",
                    borderColor: alertMinTransaksi ? "red" : ""
                  }}
                  // min={0}
                  onFocus={() => setEditMinTransaksi(!editMinTransaksi)}
                />
              } */}
              {alertMinTransaksi === true ?
                <div style={{color: "#B9121B", fontSize: 12}} className="mt-1">
                    <img src={noteIconRed} className="me-2" alt="icon notice" />
                    Minimal Transaksi Wajib Diisi. Jika tidak dikenakan biaya silahkan tulis 0
                </div> : ""
              }
            </Col>
          </Row>
          <Row className="mb-3 align-items-center">
            <Col xs={2} style={{ width: "14%", paddingRight: "unset" }}>
              <span
                style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}
              >
                Maksimal Transaksi <span style={{ color: "red" }}>*</span>
              </span>
            </Col>
            <Col xs={10}>
              <CurrencyInput
                className="input-text-user"
                value={biayaHandle.maksTransaksi}
                onValueChange={(e) => handleChangeMaksTransaksi(e)}
                placeholder="Masukkan Maksimal Transaksi"
                style={{
                  borderColor: alertMaksTransaksi ? "red" : ""
                }}
                groupSeparator={"."}
                decimalSeparator={','}
                prefix={"Rp "}
              />

              {/* {editMaxTransaksi ?
                <Form.Control
                  name="maksTransaksi"
                  onChange={handleChangeMaksTransaksi}
                  value={(biayaHandle.maksTransaksi.length === 0) ? "" : (biayaHandle.maksTransaksi)}
                  placeholder="Rp. 0"
                  type="number"
                  style={{
                    width: "100%",
                    height: 40,
                    marginTop: "-7px",
                    marginLeft: "unset",
                    borderColor: alertMaksTransaksi ? "red" : ""
                  }}
                  onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                  min={0}
                  onBlur={() => setEditMaxTransaksi(!editMaxTransaksi)}
                /> :
                <Form.Control
                  name="maksTransaksi"
                  onChange={handleChangeMaksTransaksi}
                  value={(biayaHandle.maksTransaksi.length === 0) ? "" : convertToRupiah(biayaHandle.maksTransaksi, true, 2)}
                  placeholder="Rp. 0"
                  type="text"
                  style={{
                    width: "100%",
                    height: 40,
                    marginTop: "-7px",
                    marginLeft: "unset",
                    borderColor: alertMaksTransaksi ? "red" : ""
                  }}
                  // min={0}
                  onFocus={() => setEditMaxTransaksi(!editMaxTransaksi)}
                />
              } */}
              {alertMaksTransaksi === true ?
                <div style={{color: "#B9121B", fontSize: 12}} className="mt-1">
                    <img src={noteIconRed} className="me-2" alt="icon notice" />
                    Maksimal Transaksi Wajib Diisi. Jika tidak dikenakan biaya silahkan tulis 0
                </div> : ""
              }
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
                              onChange={(e) => handleChangeFitur(e, biayaHandle)}
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
                              onChange={(e) => handleChangeFitur(e, biayaHandle)}
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
                              onChange={(e) => handleChangeFitur(e, biayaHandle)}
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
                              onChange={(e) => handleChangeFitur(e, biayaHandle)}
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
          {mustFill === true ?
            <div style={{ color: "#B9121B", fontSize: 12, marginLeft: 133 }} className="mt-3">
              <img src={noteIconRed} className="me-2" alt="icon notice" />
              Wajib Dipilih
            </div> : ""
          }
          {redFlag === true ?
            <div style={{ color: "#B9121B", fontSize: 12, marginLeft: 133 }} className="mt-2">
              <img src={noteIconRed} className="me-2" alt="icon notice" />
              Metode Pembayaran tidak boleh sama dalam satu Fitur
            </div> : ""
          }
          <Row className="d-flex justify-content-between align-items-center">
            <Col xs={1}></Col>
            <Col className="ms-5">
              {edited === false ? (
                <button
                  onClick={() =>
                    saveNewSchemaHandle(
                      biayaHandle.fee,
                      biayaHandle.settlementFee,
                      biayaHandle.feeType,
                      biayaHandle.minTransaksi,
                      biayaHandle.maksTransaksi,
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
                        biayaHandle.feeType,
                        biayaHandle.minTransaksi,
                        biayaHandle.maksTransaksi,
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
            <div className="div-table" ref={myRef}>
              <DataTable
                columns={columnPayment}
                data={payment}
                customStyles={customStyles}
                // progressPending={pendingSettlement}
                progressComponent={<CustomLoader />}
              />
            </div>
          )}
        </div>
      </div>

      <div className="head-title">
        <h5 className="mt-5 mb-4" style={{ fontFamily: "Exo" }}>
          Rekening Sub Account
        </h5>
      </div>

      <div
          style={{
              width:"100%",
              fontSize: "14px",
              background: "rgba(255, 214, 0, 0.16)",
              borderRadius: "4px",
              fontStyle: "italic",
              padding: "12px",
              gap: 10,
          }}
          className="text-start my-2"
      >
          <span className="mx-2">
              <img src={alertIcon} alt="alert" />
          </span>
          Anda dapat menambahkan rekening Sub-Account saat Edit Profil Partner setelah Akun Partner berhasil dibuat.
      </div>
      {/* <div className="base-content" style={{ width: "100%", padding: 50 }}>
        <div>
          <Row className="mb-4">
            <Col xs={2} style={{ width: "14%", paddingRight: "unset" }}>
              <span
                style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}
              >
                Sumber Agen
              </span>
            </Col>
            <Col xs={10}>
              <Form.Select name='sumberAgen' onChange={handleChange} disabled value={inputHandle.sumberAgen} className="form-add" placeholder="Pilih Agen" style={{width: "100%", height: 40, marginTop: "-7px", marginLeft: "unset" }}>
                <option defaultChecked value={""}>Pilih Agen</option>
              </Form.Select>
            </Col>
          </Row>
          <Row className="mb-4">
            <Col xs={2} style={{ width: "14%", paddingRight: "unset" }}>
              <span
                style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}
              >
                Nama Bank
              </span>
            </Col>
            <Col xs={10}>
              <Form.Control
                name="bankNameSubAcc"
                onChange={handleChange}
                placeholder="Bank Danamon"
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
                No. Rekening <span style={{ color: "red" }}>*</span>
              </span>
            </Col>
            <Col xs={10}>
              <Form.Control
                name="akunBankSubAcc"
                onChange={handleChange}
                placeholder="Masukkan Nomor Rekening"
                type="number"
                onKeyDown={(evt) => ["e", "E", "+", "-", ".", ","].includes(evt.key) && evt.preventDefault()}
                style={{
                  width: "100%",
                  height: 40,
                  marginTop: "-7px",
                  marginLeft: "unset",
                }}
              />
            </Col>
          </Row>
          <Row className="">
            <Col xs={2} style={{ width: "14%", paddingRight: "unset" }}>
              <span
                style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}
              >
                Nama Pemilik Rekening <span style={{ color: "red" }}>*</span>
              </span>
            </Col>
            <Col xs={10}>
              <Form.Control
                name="rekeningOwnerSubAcc"
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
      </div> */}

      <div
        style={{
          display: "flex",
          justifyContent: "end",
          marginTop: 16,
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
              inputHandle.isChargeFee,
              payment,
              // inputHandle.bankNameSubAcc,
              // inputHandle.rekeningOwnerSubAcc,
              // inputHandle.akunBankSubAcc
            )
          }
          style={{ width: 136, cursor: (inputHandle.namaPerusahaan.length !== 0 && inputHandle.emailPerusahaan.length !== 0 && inputHandle.phoneNumber.length !== 0 && inputHandle.alamat.length !== 0 && inputHandle.noNpwp.length !== 0 && inputHandle.namaNpwp.length !== 0 && inputHandle.nama.length !== 0 && inputHandle.noHp.length !== 0 && inputHandle.active.length !== 0 && inputHandle.bankName.length !== 0 && inputHandle.akunBank.length !== 0 && inputHandle.rekeningOwner.length !== 0 && payment.length !== 0 ) ? "pointer" : "unset" }}
          className={(inputHandle.namaPerusahaan.length !== 0 && inputHandle.emailPerusahaan.length !== 0 && inputHandle.phoneNumber.length !== 0 && inputHandle.alamat.length !== 0 && inputHandle.noNpwp.length !== 0 && inputHandle.namaNpwp.length !== 0 && inputHandle.nama.length !== 0 && inputHandle.noHp.length !== 0 && inputHandle.active.length !== 0 && inputHandle.bankName.length !== 0 && inputHandle.akunBank.length !== 0 && inputHandle.rekeningOwner.length !== 0 && payment.length !== 0 ) ? 'btn-ez-on' : 'btn-ez'}
          disabled={inputHandle.namaPerusahaan.length === 0 || inputHandle.emailPerusahaan.length === 0 || inputHandle.phoneNumber.length === 0 || inputHandle.alamat.length === 0 || inputHandle.noNpwp.length === 0 || inputHandle.namaNpwp.length === 0 || inputHandle.nama.length === 0 || inputHandle.noHp.length === 0 || inputHandle.active.length === 0 || inputHandle.bankName.length === 0 || inputHandle.akunBank.length === 0 || inputHandle.rekeningOwner.length === 0 || payment.length === 0  }
        >
          Tambahkan
        </button>
      </div>
    </div>
  );
}

export default TambahPartner;
