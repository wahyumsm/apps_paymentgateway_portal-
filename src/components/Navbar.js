import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCog,
  faEnvelopeOpen,
  faSearch,
  faSignOutAlt,
  faUserShield,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { faUserCircle } from "@fortawesome/free-regular-svg-icons";
import {
  Row,
  Col,
  Nav,
  Form,
  Image,
  Navbar,
  Dropdown,
  Container,
  ListGroup,
  InputGroup,
  Modal,
  Button, Table, Alert, Toast, Tooltip, OverlayTrigger
} from "@themesberg/react-bootstrap";

import NOTIFICATIONS_DATA from "../data/notifications";
import Profile3 from "../assets/icon/default_profile.png";
import iconDetailAkun from "../assets/icon/detail_akun_icon.svg";
import userIcon from "../assets/icon/akun_icon.svg";
import logoutIcon from "../assets/icon/logout_icon.svg";
import topUpSaldoIcon from "../assets/icon/top_up_saldo_icon.svg";
import noteIcon from "../assets/icon/note_icon.svg";
import noteIconRed from "../assets/icon/note_icon_red.svg";
import riwayatSaldoIcon from "../assets/icon/riwayat_saldo_icon.svg";
import alokasiIcon from "../assets/icon/alokasi_icon.svg"
import arrowDown from "../assets/img/icons/arrow_down.svg";
import arrowUp from "../assets/img/icons/arrow_up.svg";
import circleInfo from "../assets/icon/circle-info.svg"
import { useHistory } from "react-router-dom";
import { BaseURL, errorCatch, getRole, convertToRupiah, getToken, removeUserSession, RouteTo, setRoleSession, convertDateTimeStamp, convertFormatNumber, setUserSession, deleteZero } from "../function/helpers";
import axios from "axios";
import { GetUserDetail } from "../redux/ActionCreators/UserDetailAction";
import { useDispatch, useSelector } from "react-redux";
import DropdownToggle from "@themesberg/react-bootstrap/lib/esm/DropdownToggle";
import { agenLists } from "../data/tables";
import DataTable from "react-data-table-component";
import loadingEzeelink from "../assets/img/technologies/Double Ring-1s-303px.svg"
import checklistCircle from '../assets/img/icons/checklist_circle.svg';
import CopyIcon from '../assets/icon/carbon_copy.svg'
import Jam from '../assets/icon/jam_icon.svg'
import noticeIcon from '../assets/icon/notice_icon.svg'
import Countdown from "react-countdown";
import Checklist from '../assets/icon/checklist_icon.svg'
import encryptData from "../function/encryptData";
import { useCallback } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import gagalMasukAlokasi from '../assets/icon/gagaltopup_icon.svg'
import CurrencyInput from "react-currency-input-field";

export default (props) => {
  const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA);
  const areNotificationsRead = notifications.reduce(
    (acc, notif) => acc && notif.read,
    true
  );
  const user_role = getRole()
  const [listRiwayat, setListRiwayat] = useState([])
  const history = useHistory();
  const userDetail = useSelector((state) => state.userDetailReducer.userDetail);
  const dispatch = useDispatch();
  const [copied, setCopied] = useState(false);

  const markNotificationsAsRead = () => {
    setTimeout(() => {
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
    }, 300);
  };

  const navToDetailAccount = () => {
    history.push("/detailakun");
    // RouteTo("/detailakun")
  };

  const [getBalance, setGetBalance] = useState({})
  const [balanceDetail, setBalanceDetail] = useState([])
  const [showModalTopUp, setShowModalTopUp] = useState(false);
  const [showModalKonfirmasiTopUp, setShowModalKonfirmasiTopUp] = useState(false)
  const [showRiwayatTopUp, setShowRiwayatTopUp] = useState(false)
  const [showStatusTopup, setShowStatusTopup] = useState(false)
  const [showModalAlokasi, setShowModalAlokasi] = useState(false)
  const handleCloseModalTopUp = () => setShowModalTopUp(false);
  const handleCloseRiwayatTopUp = () => setShowRiwayatTopUp(false)
  const [imageTopUp, setImageTopUp] = useState({});
  const hiddenFileInput = useRef(null);
  const access_token = getToken()
  const [text, setText] = useState('');
  const [expanded, setExpanded] = useState(false)
  const [nominalTopup, setNominalTopup] = useState(false)
  const [inputHandle, setInputHandle] = useState({
    amounts: 0,
    amount: 0,
    reffNo: "",
  })
  const [topUpBalance, setTopUpBalance] = useState({})
  const [ countDown, setCountDown ] = useState(0)
  const [dateNow, setDateNow] = useState(0)
  const [ topUpResult, setTopUpResult ] = useState({})
  const [iconGagal, setIconGagal] = useState(false)
  const [uploadGagal, setUploadGagal] = useState(false)

  function handleChange(e) {
    setInputHandle({
      ...inputHandle,
      [e.target.name] : e.target.value
    })
  }

  
  // function handleChangeTopUp(e) {
  //   setIconGagal(false)
  //   setInputHandle({
  //     ...inputHandle,
  //     [e.target.name] : Number(e.target.value).toString()
  //   })
  // }

  function handleChangeTopUp(e) {
    setIconGagal(false)
    setInputHandle({
      ...inputHandle,
      amounts : e
    })
  }

  const startColorNumber = (money) => {  
    if (money !== 0) {
      var diSliceAwal = String(money).slice(0, -3)
    }
    return new Intl.NumberFormat('id-ID', { style: 'decimal', currency: 'IDR', maximumFractionDigits: 2, currencyDisplay: "symbol"}).format(diSliceAwal).replace(/\B(?=(\d{4})+(?!\d))/g, ".") + "."
  }

  const endColorNumber = (money) => {
    var diSliceAkhir = String(money).slice(-3)
    return diSliceAkhir
  }

  const handleClick = () => {
    hiddenFileInput.current.click();
  };
  
  const handleFileChange = (event) => {
    let dataImage = {
      SlipPaymentFile: event.target.files[0],
    };
    setImageTopUp(dataImage);
  };

  const toHistoryBalance = () => {
    history.push('/riwayattopup')
  };

  const onCopyRek = React.useCallback(() => {
    setCopied(true);
  }, [])

  const onClickRek = useCallback(({target: {innerText}}) => {
    // console.log(`Clicked on "${innerText}"!`);
    alert('Text copied');
  }, [])

  const onCopyPrice = React.useCallback(() => {
    setCopied(true);
  }, [])

  const onClickPrice = useCallback(({target: {innerText}}) => {
    // console.log(`Clicked on "${innerText}"!`);
    alert('Text copied');
  }, [])

  // const copyHandler = (event) => {
  //   setText(event.target.value);
  // };

  // const copyPrice = async () => {
  //   try {
  //     var copyText = document.getElementById('pricing').innerHTML.split("<")
  //     // await navigator.clipboard.writeText(copyText);
  //     await navigator.clipboard.writeText(copyText[0]+copyText[1].slice(-3));
  //     alert('Text copied');
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const copyRek = async () => {
  //   try {
  //     var copyText = document.getElementById('noRek').innerHTML;
  //     await navigator.clipboard.writeText(copyText);
  //     alert('Text copied');
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const showCheckboxes = () => {
    if (!expanded) {
      setExpanded(true);
    } else {
      setExpanded(false);
    }
  }

  async function topUpConfirmation(amountTopUp) {
    try {
        if (amountTopUp.length < 5 || amountTopUp === undefined || amountTopUp < 10000) {
          setIconGagal(true)
        } else {
          setIconGagal(false)
          const auth = "Bearer " + getToken()   
          const dataParams = encryptData(`{"tparttopup_amount":${Number(amountTopUp.replaceAll(',', '.'))}}`)
          const headers = {
            "Content-Type": "application/json",
            'Authorization': auth,
          };
          const topUpBalance = await axios.post(BaseURL + "/Partner/TopupBalancePartner", { data: dataParams }, { headers: headers })
          if(topUpBalance.status === 200 && topUpBalance.data.response_code === 200 && topUpBalance.data.response_new_token.length === 0) {
            setTopUpBalance(topUpBalance.data.response_data)
            const timeStamps = new Date(topUpBalance.data.response_data.exp_date*1000).toLocaleString()
            const convertTimeStamps = new Date(timeStamps).getTime()
            const date = Date.now()
            const countDown = convertTimeStamps - date
            setDateNow(date)
            setCountDown(countDown)
            setShowModalTopUp(false)
            setShowModalKonfirmasiTopUp(true)
            setInputHandle({amounts: 0})
          } else if (topUpBalance.status === 200 && topUpBalance.data.response_code === 200 && topUpBalance.data.response_new_token.length !== 0) {
            setUserSession(topUpBalance.data.response_new_token)
            setTopUpBalance(topUpBalance.data.response_data)
            setShowModalTopUp(false)
            setShowModalKonfirmasiTopUp(true)
            setInputHandle({amounts: 0})
          }
        }
      } catch (error) {
        // console.log(error)
        history.push(errorCatch(error.response.status))
      }
    }

    async function topUpHandleConfirm() {
      try {
          const auth = "Bearer " + getToken()        
          const headers = {
              'Content-Type':'application/json',
              'Authorization' : auth
          }
          const topUpResult = await axios.post(BaseURL + "/Partner/TopupConfirmation", { data: "" }, { headers: headers })
          if(topUpResult.status === 200 && topUpResult.data.response_code === 200 && topUpResult.data.response_new_token.length === 0) {
            setTopUpResult(topUpResult.data.response_data)
            setShowModalKonfirmasiTopUp(false)
            setTimeout(() => {
              history.push("/riwayattopup")
            }, 500);
            // setShowStatusTopup(true)
          } else if (topUpResult.status === 200 && topUpResult.data.response_code === 200 && topUpResult.data.response_new_token.length !== 0) {
            setUserSession(topUpResult.data.response_new_token)
            setTopUpResult(topUpResult.data.response_data)
            setShowModalKonfirmasiTopUp(false)
            setTimeout(() => {
              history.push("/riwayattopup")
            }, 500);
            // setShowStatusTopup(true)
          }
        } catch (error) {
          // console.log(error)
          history.push(errorCatch(error.response.status))
        }
      }

    async function GetBalanceHandle () {
      try {
          const auth = "Bearer " + getToken()
          const headers = {
              'Content-Type':'application/json',
              'Authorization' : auth
          }
          const getBalance = await axios.post(BaseURL + "/Partner/GetBalance", { data: "" }, { headers: headers })
          if (getBalance.data.response_code === 200 && getBalance.status === 200 && getBalance.data.response_new_token.length === 0) {
              setGetBalance(getBalance.data.response_data)
              setBalanceDetail(getBalance.data.response_data.balance_detail)
          } else if (getBalance.data.response_code === 200 && getBalance.status === 200 && getBalance.data.response_new_token.length !== 0) {
            setUserSession(getBalance.data.response_new_token)
            setGetBalance(getBalance.data.response_data)
            setBalanceDetail(getBalance.data.response_data.balance_detail)
          }
          
      } catch (error) {
          // console.log(error)
          history.push(errorCatch(error.response.status))
        }
    }

    async function listRiwayatTopUp () {
      try {
          const auth = "Bearer " + getToken()
          const headers = {
              'Content-Type':'application/json',
              'Authorization' : auth
          }
          const listRiwayat = await axios.post(BaseURL + "/partner/TopUpHistory", { data: "" }, { headers: headers })
          if (listRiwayat.data.response_code === 200 && listRiwayat.status === 200 && listRiwayat.data.response_new_token.length === 0) {
              listRiwayat.data.response_data = listRiwayat.data.response_data.map((obj, id) => ({ ...obj, number: id +1}));
              setListRiwayat(listRiwayat.data.response_data)
          } else if (listRiwayat.data.response_code === 200 && listRiwayat.status === 200 && listRiwayat.data.response_new_token.length !== 0) {
            setUserSession(listRiwayat.data.response_new_token)
            listRiwayat.data.response_data = listRiwayat.data.response_data.map((obj, id) => ({ ...obj, number: id +1}));
            setListRiwayat(listRiwayat.data.response_data)
          }
          
      } catch (error) {
          // console.log(error)
          history.push(errorCatch(error.response.status))
        }
    }

    function toAlokasiPage () {
      if (balanceDetail.length !== 0) {
        history.push("/alokasisaldo")
      } else {
        setShowModalAlokasi(true)
      }
    }

    useEffect(() => {
      if (!access_token) {
        history.push('/login');
      }
      dispatch(GetUserDetail("/Account/GetUserProfile"));
      if (user_role === "102") {
        GetBalanceHandle()
        listRiwayatTopUp()
      }
    }, [showModalTopUp])

  async function logoutHandler() {
    try {
      const auth = "Bearer " + getToken();
      const headers = {
        "Content-Type": "application/json",
        Authorization: auth,
      };
      const logout = await axios.post(
        BaseURL + "/Account/Logout",
        { data: "" },
        { headers: headers }
      );
      if (logout.status === 200 && logout.data.response_code === 200) {
        removeUserSession();
        history.push("/login");
      }
    } catch (error) {
      // console.log(error);
      history.push(errorCatch(error.response.status))
    }
  }

  const columns = [
    {
      name: 'No',
      selector: row => row.number,
      ignoreRowClick: true,
      button: true,
      width: "50px"
    },
    {
      name: 'ID Transaksi',
      selector: row => row.code_trans,
      sortable: true,
      width: "150px"
    },
    {
      name: 'Sumber Agen',
      selector: row => row.agen_name,
      sortable: true,
      width: "170px"
    },
    {
      name: 'Kode Unik',
      selector: row => row.unique_code,
      sortable: true
    },
    {
      name: 'Nominal Top Up',
      selector: row => row.amount,
      sortable: true,
      width: "170px",
      cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center" }}>{ convertToRupiah(row.amount) }</div>,
      style: { display: "flex", flexDirection: "row", justifyContent: "center", }
    },
    {
      name: 'Tanggal Top Up',
      selector: row => row.topup_date,
      sortable: true,
      width: "170px"
    },
    {
      name: 'Status',
      selector: row => row.status_name === "Berhasil" ? <div className="berhasil-status-topup">Berhasil</div> : <div className="gagal-status-topup">Gagal</div>,
      width: "150px",
    }
  ]

  const customStyles = {
      headCells: {
          style: {
              backgroundColor: '#F2F2F2',
              border: '12px',
              fontWeight: 'bold',
              fontSize: '16px',
          },
      },
  };

  const CustomLoader = () => (
    <div style={{ padding: '24px' }}>
      <Image className="loader-element animate__animated animate__jackInTheBox" src={loadingEzeelink} height={80} />
      <div>Loading...</div>
    </div>
  );

  const Notification = (props) => {
    const { link, sender, image, time, message, read = false } = props;
    const readClassName = read ? "" : "text-danger";

    return (
      <ListGroup.Item action href={link} className="border-bottom border-light">
        <Row className="align-items-center">
          <Col className="col-auto">
            <Image
              src={image}
              className="user-avatar lg-avatar rounded-circle"
            />
          </Col>
          <Col className="ps-0 ms--2">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="h6 mb-0 text-small">{sender}</h4>
              </div>
              <div className="text-end">
                <small className={readClassName}>{time}</small>
              </div>
            </div>
            <p className="font-small mt-1 mb-0">{message}</p>
          </Col>
        </Row>
      </ListGroup.Item>
    );
  };

  return (
    <>
      <Navbar
        variant="dark"
        expanded
        className="ps-0 pe-4 pb-2 pt-2"
        style={{ backgroundColor: "#ffffff", boxShadow: "0 2px 7px 0 rgba(0,0,0,.2)", position: "fixed", top: 0, left: 260, right: 0, zIndex: 999 }}
      >
      <Container fluid className="px-0">
        <div className="d-flex justify-content-between w-100">
          <div className="d-flex align-items-center"></div>
          <Nav className="align-items-center">

            { //https://www.ezeelink.co.id/ezeepg/#/ezeepg/Disbursement/disbursementpage
              (user_role === "102" && (
                (window.location.href === 'https://www.ezeelink.co.id/ezeepg/#/ezeepg/Disbursement/disbursementpage' || window.location.href === 'https://ezeelink.co.id/ezeepg/#/ezeepg/Disbursement/disbursementpage' || window.location.href === 'https://www.ezeelink.co.id/ezeepg/?#/ezeepg/Disbursement/disbursementpage' || window.location.href === 'https://ezeelink.co.id/ezeepg/?#/ezeepg/Disbursement/disbursementpage') ||
                (window.location.href === 'https://www.ezeelink.co.id/ezeepg/#/ezeepg/Disbursement/report' || window.location.href === 'https://ezeelink.co.id/ezeepg/#/ezeepg/Disbursement/report' || window.location.href === 'https://www.ezeelink.co.id/ezeepg/?#/ezeepg/Disbursement/report' || window.location.href === 'https://ezeelink.co.id/ezeepg/?#/ezeepg/Disbursement/report') ||
                (window.location.href === 'https://www.ezeelink.co.id/ezeepg/#/ezeepg/disbursement-report'|| window.location.href === 'https://ezeelink.co.id/ezeepg/#/ezeepg/disbursement-report' || window.location.href === 'https://www.ezeelink.co.id/ezeepg/?#/ezeepg/disbursement-report'|| window.location.href === 'https://ezeelink.co.id/ezeepg/?#/ezeepg/disbursement-report') ||
                (window.location.href === 'https://www.ezeelink.co.id/ezeepg/#/ezeepg/riwayattopup' || window.location.href === 'https://ezeelink.co.id/ezeepg/#/ezeepg/riwayattopup' || window.location.href === 'https://www.ezeelink.co.id/ezeepg/?#/ezeepg/riwayattopup' || window.location.href === 'https://ezeelink.co.id/ezeepg/?#/ezeepg/riwayattopup') ||
                (window.location.href === 'https://www.ezeelink.co.id/ezeepg/#/ezeepg/alokasisaldo' || window.location.href === 'https://ezeelink.co.id/ezeepg/#/ezeepg/alokasisaldo' || window.location.href === 'https://www.ezeelink.co.id/ezeepg/?#/ezeepg/alokasisaldo' || window.location.href === 'https://ezeelink.co.id/ezeepg/?#/ezeepg/alokasisaldo')

                // (window.location.href === 'https://localhost:3000/ezeepg#/ezeepg/Disbursement/disbursementpage') ||
                // (window.location.href === 'https://localhost:3000/ezeepg#/ezeepg/Disbursement/report') ||
                // (window.location.href === 'https://localhost:3000/ezeepg#/ezeepg/disbursement-report') ||
                // (window.location.href === 'https://localhost:3000/ezeepg#/ezeepg/riwayattopup') ||
                // (window.location.href === 'https://localhost:3000/ezeepg#/ezeepg/alokasisaldo')
                
                // (window.location.href === 'http://reactdev/dev3/#/dev3/Disbursement/disbursementpage') ||
                // (window.location.href === 'http://reactdev/dev3/#/dev3/Disbursement/report') ||
                // (window.location.href === 'http://reactdev/dev3/#/dev3/disbursement-report') ||
                // (window.location.href === 'http://reactdev/dev3/#/dev3/riwayattopup') ||
                // (window.location.href === 'http://reactdev/dev3/#/dev3/alokasisaldo')
                )
              ) && 
              // (user_role === "102" && (window.location.href === 'http://reactdev/dev1/#/dev1/Disbursement/disbursementpage' || window.location.href === 'http://reactdev/dev1/#/dev1/Disbursement/report' || window.location.href === 'http://reactdev/dev1/#/dev1/riwayattopup' || window.location.href === 'http://reactdev/dev1/#/dev1/alokasisaldo')) && 
              // (user_role === "102" && (window.location.href === 'http://reactdev/dev2/#/dev2/Disbursement/disbursementpage' || window.location.href === 'http://reactdev/dev2/#/dev2/Disbursement/report' || window.location.href === 'http://reactdev/dev2/#/dev2/riwayattopup' || window.location.href === 'http://reactdev/dev2/#/dev2/alokasisaldo')) && 
              // (user_role === "102" && (window.location.href === 'https://localhost:3000/ezeepg#/ezeepg/Disbursement/disbursementpage' || window.location.href === 'https://localhost:3000/ezeepg#/ezeepg/Disbursement/report' || window.location.href === 'https://localhost:3000/ezeepg#/ezeepg/riwayattopup' || window.location.href === 'https://localhost:3000/ezeepg#/ezeepg/alokasisaldo')) && 
              // (user_role === "102") && 
              <>
                <OverlayTrigger
                  placement="bottom"
                  trigger={["click"]}
                  overlay={
                    <Tooltip>Saldo Tersedia adalah saldo yang mengendap dari hasil Top Up. Untuk menggunakan saldo ini kamu harus alokasikan saldo terlebih dulu pada laman “Alokasi Saldo” didalam menu “Saldo Tersedia”.</Tooltip>
                  }
                >
                  <img
                    src={circleInfo}
                    alt="circle_info"
                    style={{ marginTop: -5 }}
                  />
                </OverlayTrigger>
                <Dropdown as={Nav.Item}>
                  <Dropdown.Toggle as={Nav.Link} className="pt-1 px-0 me-lg-3">
                    <div className="media-body ms-2 text-dark align-items-center d-block d-lg-block">
                      <span className="mb-0 font-small">Saldo Tersedia: </span>
                      <span className="mb-0 font-small fw-bold">{(getBalance.balance !== undefined) ? convertToRupiah(getBalance.balance) : convertToRupiah(0)}</span>
                      <img
                        src={arrowDown}
                        alt="arrow_down"
                        style={{ marginLeft: 10 }}
                      />
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="user-dropdown dropdown-menu-right mt-2 d-flex justify-content-center align-items-center">
                    <div className={balanceDetail.length !== 0 ? "pe-2" : ""}>
                      {
                        balanceDetail.length !==0 &&
                        balanceDetail.map(item => {
                          return (
                            <Dropdown.Item
                              key={item.mpartballchannel_id}
                              className="fw-bold"
                            >
                              <div className="mt-1 d-flex justify-content-flex-start align-items-center">
                                <div className="me-2" style={{borderRadius: "50%", background: "#077E86", width: 10, height: 10}}></div>
                                <div style={{fontSize: 14, fontFamily: "Nunito", fontWeight: 400, color: "#383838"}}>Alokasi Saldo di {item.mpaytype_name}</div>
                              </div>
                              <div style={{fontSize: 15, fontFamily: "Exo", fontWeight: 700, color: "#383838", marginLeft: 10}}>{convertToRupiah(item.mpartballchannel_balance)}</div>
                            </Dropdown.Item>
                          )
                        })
                      }
                    </div>
                    {balanceDetail.length !== 0 ? <div style={{border:"0.5px solid #EBEBEB", width: 0, height: 135}}></div> : ""}
                    <div className="ps-2">
                      <Dropdown.Item
                        onClick={() => setShowModalTopUp(true)}
                        className="fw-bold"
                        style={{width: 160}}
                      >
                        <div className="pe-2">
                          <img alt="" src={topUpSaldoIcon} /> Top Up Saldo
                        </div>
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => history.push('/riwayattopup')}
                        className="fw-bold"
                      >
                        <div className="pe-2">
                          <img alt="" src={riwayatSaldoIcon} /> Riwayat Top Up
                        </div>
                      </Dropdown.Item>
                      <Dropdown.Item
                        className="fw-bold"
                        onClick={() => toAlokasiPage()}
                      >
                        <div className="pe-2">
                          <img alt="" src={alokasiIcon} /> Alokasi Saldo
                        </div>
                      </Dropdown.Item>
                    </div>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            }

            {/* notification */}
            {/* <Dropdown as={Nav.Item} onToggle={markNotificationsAsRead}>
              <Dropdown.Toggle
                as={Nav.Link}
                className="text-dark icon-notifications me-lg-3"
              >
                <span className="icon icon-sm">
                  <FontAwesomeIcon icon={faBell} className="bell-shake" />
                  {areNotificationsRead ? null : (
                    <span className="icon-badge rounded-circle unread-notifications" />
                  )}
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu className="dashboard-dropdown notifications-dropdown dropdown-menu-lg dropdown-menu-center mt-2 py-0">
                <ListGroup className="list-group-flush">
                  <Nav.Link
                    href="#"
                    className="text-center text-primary fw-bold border-bottom border-light py-3"
                  >
                    Notifications
                  </Nav.Link>

                  {notifications.map((n) => (
                    <Notification key={`notification-${n.id}`} {...n} />
                  ))}
                  <Dropdown.Item className="text-center text-primary fw-bold py-3">
                    View all
                  </Dropdown.Item>
                </ListGroup>
              </Dropdown.Menu>
            </Dropdown> */}

            {/* profile */}
            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle as={Nav.Link} className="pt-1 px-0">
                <div className="media d-flex align-items-center">
                  <Image
                    src={Profile3}
                    className="user-avatar md-avatar rounded-circle"
                  />
                  <div className="media-body ms-2 text-dark align-items-center d-none d-lg-block">
                    <span className="mb-0 font-small fw-bold">
                      {userDetail.muser_name}
                    </span>
                    <img
                      src={arrowDown}
                      alt="arrow_down"
                      style={{ marginLeft: 10 }}
                    />
                  </div>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu
                className="user-dropdown dropdown-menu-right mt-2"
                style={{ paddingRight: 20, width: "auto" }}
              >
                <Dropdown.Item className="fw-bold" style={{ width: "100%", pointerEvents: "none" }}>
                  <img alt="" src={userIcon} /> {userDetail.muser_name} ({userDetail.mrole_desc})
                </Dropdown.Item>
                {
                  (user_role === "102") &&
                  <Dropdown.Item className="fw-bold" onClick={() => navToDetailAccount()}>
                    <img alt="" src={iconDetailAkun}/> Detail Akun
                  </Dropdown.Item>
                }
                <Dropdown.Divider />

                <Dropdown.Item
                  onClick={() => logoutHandler()}
                  className="fw-bold"
                >
                  <img alt="" src={logoutIcon} /> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </div>

        {/* Modal Input Data */}
        <Modal centered show={showModalTopUp}>
          <Modal.Header className="border-0">
            <Col>
              <Button
                className="position-absolute top-0 end-0 m-3"
                variant="close"
                aria-label="Close"
                onClick={handleCloseModalTopUp}
              />
              <Modal.Title className="text-center fw-bold mt-3">
                Top Up Saldo
              </Modal.Title>
            </Col>
          </Modal.Header>
          <Modal.Body>
            <Form action="#">
              <Form.Group className="mb-3">
                <Form.Label>Nominal Top Up Saldo</Form.Label>
                <CurrencyInput
                  className="input-text-user"
                  value={inputHandle.amounts === undefined ? 0 : inputHandle.amounts}
                  onValueChange={(e) => handleChangeTopUp(e)}
                  placeholder="Masukkan Nominal To Up Saldo"
                  groupSeparator={"."}
                  decimalSeparator={','}
                  prefix={"Rp "}
                  allowDecimals={false}
                />
                {/* {nominalTopup ? 
                  <Form.Control onBlur={() => setNominalTopup(!nominalTopup)} onChange={handleChangeTopUp} placeholder="Rp" name="amounts" type='number' min={0} value={inputHandle.amounts === 0 ? "Rp" : inputHandle.amounts} onKeyDown={(evt) => ["e", "E", "+", "-", ".", ","].includes(evt.key) && evt.preventDefault()} /> :
                  <Form.Control onFocus={() => setNominalTopup(!nominalTopup)} onChange={handleChange} placeholder="Rp" name="amounts" type="text" value={inputHandle.amounts === 0 ? "Rp" : convertFormatNumber(inputHandle.amounts)} />
                } */}
                {/* {getBalance.topupAmount_temp !== 0 ?
                  <>
                    <div style={{ color: "#383838", fontSize: 12 }} className="mt-1">
                      <img src={noteIcon} className="me-2" />
                      Update nominal top up sebesar {convertToRupiah(getBalance.topupAmount_temp)} akan di update besok
                    </div>
                  </> :
                  " "
                } */}
                {iconGagal === true && 
                  <>
                    <div className="mt-2" style={{ color: "#B9121B", fontSize: 12 }}>
                      <img src={noteIconRed} className="me-2" alt="notice" />
                      Minimal Top Up Rp. 10.000
                    </div>
                  </>
                }
              </Form.Group>              
            </Form>     
            <div className="d-flex justify-content-center mt-2">
              <button
                style={{
                  fontFamily: "Exo",
                  fontSize: 16,
                  fontWeight: 700,
                  alignItems: "center",
                  padding: "12px 12px",
                  gap: 8,
                  width: "100%",
                  height: 48,
                  background:
                    "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)",
                  border: "0.6px solid #2C1919",
                  borderRadius: 6,
                  textAlign: "center",
                }}
                onClick={() => topUpConfirmation(inputHandle.amounts)}
              >
                <FontAwesomeIcon style={{ marginRight: 10 }} /> TOP UP
              </button>
            </div>
          </Modal.Body>
        </Modal>
        
        {/* Modal Konfirmasi Top Up */}
        <Modal centered show={showModalKonfirmasiTopUp} onHide={() => setShowModalKonfirmasiTopUp(false)} style={{ borderRadius: 8 }} className="confirm-modal">
          <Modal.Header className="border-0">
            <Col>
              <Button
                className="position-absolute top-0 end-0 m-3"
                variant="close"
                aria-label="Close"
                onClick={() => setShowModalKonfirmasiTopUp(false)}
              />
              <Modal.Title className="text-center fw-extrabold mt-3 title-topup">
                Selesaikan Proses Topup
              </Modal.Title>
            </Col>            
          </Modal.Header>
          <Modal.Body className="text-center" style={{ maxWidth: 468, width: "100%", padding: "0px 24px" }}>
              <div className="text-center" style={{fontSize: "14px"}}>Selesaikan Pembayaran Dalam</div> 
              <div className="text-center mt-2">
                <img src={Jam} alt="jam" /><span className="mx-2 fw-bold" style={{color: "#077E86"}}><Countdown date={dateNow + countDown} daysInHours={true} /></span>
              </div>
              <div style={{fontSize: "14px"}} className="d-flex justify-content-center align-items-center mt-2">
                <div>Batas Akhir :</div>
                <div className="mx-2 fw-bold">{(topUpBalance.exp_date !== undefined) ? convertDateTimeStamp(topUpBalance.exp_date) + " WIB" : null}</div>
              </div>
              <div className="mt-4" style={{border: "1px solid #EBEBEB", borderRadius: "8px", padding: "10px"}}>
                <Table className='detailSave'>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>ID Transaksi</div>
                    <div style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700 }}>{topUpBalance.id_transaksi}</div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="d-flex flex-column text-left">
                      <div style={{padding:"unset"}}>Metode Pembayaran</div>
                      <div style={{padding:"unset"}} className="fw-bold mt-1">Tranfer Bank</div>
                    </div>
                    <div className="d-flex flex-column">
                      <div style={{padding:"unset"}} className="text-end"><img src={topUpBalance.metode_pembayaran} alt="bca" style={{width: "38px", height: "12px"}} /></div>
                      <div style={{padding:"unset"}} className="mt-1">{topUpBalance.tf_bank}</div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="d-flex flex-column text-left">
                      <div style={{padding:"unset"}}>No Rekening</div>
                      <div id="noRek" style={{padding:"unset"}} className="fw-bold mt-1">{topUpBalance.no_rek}</div>
                    </div>
                    <div className="d-flex flex-column mt-3">
                      <CopyToClipboard onCopy={onCopyRek} text={topUpBalance.no_rek}><div onClick={onClickRek} style={{padding:"unset", cursor: "pointer"}} className="fw-bold"><img src={CopyIcon} alt="copy" /><span className="ms-2" style={{color: "#077E86"}}>Salin</span></div></CopyToClipboard>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="d-flex flex-column text-left">
                      <div style={{padding:"unset"}}>Nominal Transfer</div>
                      <div id="pricing" style={{padding:"unset"}} className="fw-bold mt-1">{startColorNumber(topUpBalance.amount_transfer)}<span style={{color: "#DF9C43"}}>{endColorNumber(topUpBalance.amount_transfer)}</span></div>
                    </div>
                    <div className="d-flex flex-column mt-3">
                      <CopyToClipboard onCopy={onCopyPrice} text={topUpBalance.amount_transfer}><div onClick={onClickPrice} style={{padding:"unset", cursor: "pointer"}} className="fw-bold"><img src={CopyIcon} alt="copy" /><span className="ms-2" style={{color: "#077E86"}}>Salin</span></div></CopyToClipboard>
                    </div>
                  </div>
                </Table>                
              </div>
              <Table style={{borderRadius: "8px", backgroundColor: "#FFFBE5", fontSize: "12px", padding: "10px"}} className="d-flex justify-content-center align-items-center mt-2">
                <img src={noticeIcon} alt="notice" />
                <div className="mx-2 text-left">Lakukan transfer sesuai dengan nominal yang tertera hingga <span style={{ fontWeight: 600 }}>3 digit terakhir.</span></div>
              </Table>
              <div className="mb-3" style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                  <Button variant="primary" onClick={() => topUpHandleConfirm()} style={{ fontFamily: "Exo", color: "black", background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", maxWidth: "100%", maxHeight: 45, width: "100%", height: "100%" }}>SAYA SUDAH TRANSFER</Button>
              </div>
          </Modal.Body>
        </Modal>

        <Modal className="history-modal" size="xl" centered show={showRiwayatTopUp} onHide={handleCloseRiwayatTopUp}>
          <Modal.Header className="border-0">
            <Button
              className="position-absolute top-0 end-0 m-3"
              variant="close"
              aria-label="Close"
              onClick={handleCloseRiwayatTopUp}
            />
            <Modal.Title className="fw-bold mt-3">
              History Top Up
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {
              agenLists.length === 0 ?
              <div style={{ display: "flex", justifyContent: "center", paddingBottom: 20, alignItems: "center" }}>There are no records to display</div> :
              <div className="div-table">
                <DataTable
                  columns={columns}
                  data={listRiwayat}
                  customStyles={customStyles}
                  pagination
                  highlightOnHover
                  // progressPending={pending}
                  progressComponent={<CustomLoader />}
                />
              </div>
            }
          </Modal.Body>
        </Modal>

        <Modal className="history-modal" size="sm" centered show={showModalAlokasi} onHide={() => setShowModalAlokasi(false)}>
            <Modal.Body>
                <div className="text-center mt-3"><img src={gagalMasukAlokasi} alt="alokasi saldo"/></div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: 24,
                    marginBottom: 16,
                  }}
                >
                  <p
                    style={{
                      fontFamily: "Exo",
                      fontSize: 20,
                      fontWeight: 700,
                      marginBottom: "unset",
                    }}
                    className="text-center"
                  >
                    You can't access Alokasi Saldo Page
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: 12,
                    marginBottom: 16,
                  }}
                >
                  <p
                    style={{
                      fontFamily: "Nunito",
                      fontSize: 14,
                      fontWeight: 400,
                      marginBottom: "unset",
                    }}
                    className="text-center"
                  >
                    Please contact your admin.
                  </p>
                </div>
                <div 
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: 12,
                    marginBottom: 16,
                  }}>
                  <Button
                    onClick={() => setShowModalAlokasi(false)}
                    style={{
                      fontFamily: "Exo",
                      color: "#2C1919",
                      background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)",
                      maxWidth: 125,
                      maxHeight: 45,
                      width: "100%",
                      height: "100%",
                      border: "0.6px solid #2C1919",
                      borderRadius: 6
                    }}
                    className="mx-2"
                  >
                    Close
                  </Button>
                </div>
            </Modal.Body>
        </Modal>
      </Container>
    </Navbar>
    {topUpResult.is_update === false ?
      <div className="d-flex justify-content-center align-items-center mt-5 pt-5">
        <Toast style={{width: "900px", backgroundColor: "#077E86"}} onClose={() => setShowStatusTopup(false)} show={showStatusTopup} className="text-center" position="bottom-center" delay={3000} autohide>
          <Toast.Body  className="text-center text-white"><span className="mx-2"><img src={Checklist} alt="checklist" /></span>Top Up Saldo {convertToRupiah(inputHandle.amounts)} Berhasil</Toast.Body>
        </Toast>
      </div> :
      ""
    }
    </>
  );
};
