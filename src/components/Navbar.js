import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCog,
  faEnvelopeOpen,
  faSearch,
  faSignOutAlt,
  faUserShield,
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
  Button, Table, Alert, Toast
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
import arrowDown from "../assets/img/icons/arrow_down.svg";
import { useHistory } from "react-router-dom";
import { BaseURL, errorCatch, getRole, convertToRupiah, getToken, removeUserSession, RouteTo, setRoleSession, convertToCurrency, convertDateTimeStamp, convertFormatNumber, setUserSession } from "../function/helpers";
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
  const [showModalTopUp, setShowModalTopUp] = useState(false);
  const [showModalKonfirmasiTopUp, setShowModalKonfirmasiTopUp] = useState(false)
  const [showRiwayatTopUp, setShowRiwayatTopUp] = useState(false)
  const [showStatusTopup, setShowStatusTopup] = useState(false)
  const handleCloseModalTopUp = () => setShowModalTopUp(false);
  const handleCloseRiwayatTopUp = () => setShowRiwayatTopUp(false)
  const [imageTopUp, setImageTopUp] = useState({});
  const hiddenFileInput = useRef(null);
  const access_token = getToken()
  const [text, setText] = useState('');
  const [nominalTopup, setNominalTopup] = useState(false)
  const [inputHandle, setInputHandle] = useState({
    amounts: 0,
    amount: 0,
    reffNo: "",
  })
  const [topUpBalance, setTopUpBalance] = useState({})
  const [ topUpResult, setTopUpResult ] = useState({})
  const [iconGagal, setIconGagal] = useState(false)
  const [uploadGagal, setUploadGagal] = useState(false)

  function handleChange(e) {
    setInputHandle({
      ...inputHandle,
      [e.target.name] : e.target.value
    })
  }

  const startColorNumber = (money) => {  
    if (money !== 0) {
      var diSliceAwal = String(money).slice(0, -3)
    }
    return new Intl.NumberFormat('id-ID', { style: 'decimal', currency: 'IDR', maximumFractionDigits: 2, currencyDisplay: "symbol"}).format(diSliceAwal).replace(/\B(?=(\d{4})+(?!\d))/g, ".")
  }

  const endColorNumber = (money) => {
    var diSliceAkhir = String(money).slice(-3)
    return "."+diSliceAkhir
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

  const copyHandler = (event) => {
    setText(event.target.value);
  };

  const copyPrice = async () => {
    var copyText = document.getElementById('pricing').innerHTML;
    await navigator.clipboard.writeText(copyText);
    alert('Text copied');
  };

  const copyRek = async () => {
    var copyText = document.getElementById('noRek').innerHTML;
    await navigator.clipboard.writeText(copyText);
    alert('Text copied');
  };

  async function topUpConfirmation(amounts) {
    try {
        if (inputHandle.amounts.length === 0 || inputHandle.amounts === undefined || inputHandle.amounts == 0) {
          setIconGagal(true)
        } else {
          setIconGagal(false)
        }
        const auth = "Bearer " + getToken()   
        const dataParams = encryptData(`{"tparttopup_amount":${amounts}}`)
        const headers = {
          "Content-Type": "application/json",
          'Authorization': auth,
        };
        const topUpBalance = await axios.post("/Partner/TopupBalancePartner", { data: dataParams }, { headers: headers })
        // console.log(topUpBalance, 'ini topup balance ya');
        if(topUpBalance.status === 200 && topUpBalance.data.response_code === 200 && topUpBalance.data.response_new_token.length === 0) {
          setTopUpBalance(topUpBalance.data.response_data)
          setShowModalTopUp(false)
          setShowModalKonfirmasiTopUp(true)
        } else {
          setUserSession(topUpBalance.data.response_new_token)
          setTopUpBalance(topUpBalance.data.response_data)
          setShowModalTopUp(false)
          setShowModalKonfirmasiTopUp(true)
        }
      } catch (error) {
        console.log(error)
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
          const topUpResult = await axios.post("/Partner/TopupConfirmation", { data: "" }, { headers: headers })
          // console.log(topUp, 'ini topup');
          if(topUpResult.status === 200 && topUpResult.data.response_code === 200 && topUpResult.data.response_new_token.length === 0) {
            setTopUpResult(topUpResult.data.response_data)
            setShowModalKonfirmasiTopUp(false)
            setShowStatusTopup(true)
          } else {
            setUserSession(topUpResult.data.response_new_token)
            setTopUpResult(topUpResult.data.response_data)
            setShowModalKonfirmasiTopUp(false)
            setShowStatusTopup(true)
          }
        } catch (error) {
          console.log(error)
          history.push(errorCatch(error.response.status))
        }
      }

  // async function topUpHandle(imageTopUp, amount, reffNo) {
  //   try {
  //       if (inputHandle.reffNo.length === 0 || inputHandle.reffNo === undefined) {
  //         setIconGagal(true)
  //       } else {
  //         setIconGagal(false)
  //       }
  //       if (Object.keys(imageTopUp).length === 0) {
  //         setUploadGagal(true)
  //       } else {
  //         setUploadGagal(false)
  //       }
  //       const auth = "Bearer " + getToken()        
  //       var formData = new FormData()
  //       formData.append('SlipPaymentFile', imageTopUp.SlipPaymentFile)
  //       formData.append('amount', amount)
  //       formData.append('reffNo', reffNo)
  //       // for (var pair of formData.entries()) {
  //       //     console.log(pair[0]+ ', ' + pair[1], "ini logfor"); 
  //       // }
  //       const headers = {
  //           'Content-Type':'multipart/form-data',
  //           'Authorization' : auth
  //       }
  //       const topUp = await axios.post("/Partner/TopupConfirmation", formData, { headers: headers })
  //       // console.log(topUp, 'ini topup');
  //       if(topUp.status === 200 && topUp.data.response_code === 200) {
  //         setTopUpResult(topUp.data.response_data.results)
  //         setShowModalTopUp(false)
  //         setShowModalKonfirmasiTopUp(true)
  //       }
  //     } catch (error) {
  //       console.log(error)
  //       if (error.response.status === 401) {
  //           history.push('/login')
  //       } else if (error.response.status === 400) {
  //         alert("Top Up Gagal")
  //       }
  //     }
  //   }

    async function GetBalanceHandle () {
      try {
          const auth = "Bearer " + getToken()
          const headers = {
              'Content-Type':'application/json',
              'Authorization' : auth
          }
          const getBalance = await axios.post("/Partner/GetBalance", { data: "" }, { headers: headers })
          console.log(getBalance, 'ini data get balance');
          if (getBalance.data.response_code === 200 && getBalance.status === 200 && getBalance.data.response_new_token.length === 0) {
              // getBalance.data.response_data = getBalance.data.response_data.map((obj, id) => ({ ...obj, number: id +1}));
              setGetBalance(getBalance.data.response_data)
          } else {
            setUserSession(getBalance.data.response_new_token)
            setGetBalance(getBalance.data.response_data)
          }
          
      } catch (error) {
          console.log(error)
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
          const listRiwayat = await axios.post("/partner/TopUpHistory", { data: "" }, { headers: headers })
          // console.log(listRiwayat, 'ini data user ');
          if (listRiwayat.data.response_code === 200 && listRiwayat.status === 200 && listRiwayat.data.response_new_token.length === 0) {
              listRiwayat.data.response_data = listRiwayat.data.response_data.map((obj, id) => ({ ...obj, number: id +1}));
              setListRiwayat(listRiwayat.data.response_data)
          } else {
            setUserSession(listRiwayat.data.response_new_token)
            listRiwayat.data.response_data = listRiwayat.data.response_data.map((obj, id) => ({ ...obj, number: id +1}));
            setListRiwayat(listRiwayat.data.response_data)
          }
          
      } catch (error) {
          console.log(error)
          history.push(errorCatch(error.response.status))
        }
    }

    useEffect(() => {
      if (!access_token) {
        history.push('/login');
      }
      dispatch(GetUserDetail("/Account/GetUserProfile"));
      GetBalanceHandle()
      listRiwayatTopUp()
    }, [showModalTopUp])

  async function logoutHandler() {
    try {
      const auth = "Bearer " + getToken();
      const headers = {
        "Content-Type": "application/json",
        Authorization: auth,
      };
      const logout = await axios.post(
        "/Account/Logout",
        { data: "" },
        { headers: headers }
      );
      if (logout.status === 200 && logout.data.response_code === 200) {
        removeUserSession();
        history.push("/login");
      }
    } catch (error) {
      console.log(error);
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

            {
              (user_role === "102") && 
              <Dropdown as={Nav.Item}>
                <Dropdown.Toggle as={Nav.Link} className="pt-1 px-0 me-lg-3">
                  <div className="media-body ms-2 text-dark align-items-center d-block d-lg-block">
                    <span className="mb-0 font-small">Saldo: </span>
                    <span className="mb-0 font-small fw-bold">{convertToRupiah(getBalance.balance)}</span>
                    <img
                      src={arrowDown}
                      alt="arrow_down"
                      style={{ marginLeft: 10 }}
                    />
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu className="user-dropdown dropdown-menu-right mt-2">
                  <Dropdown.Item
                    onClick={() => setShowModalTopUp(true)}
                    className="fw-bold"
                  >
                    <img alt="" src={topUpSaldoIcon} /> Top Up Saldo
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => toHistoryBalance()}
                    className="fw-bold"
                  >
                    <img alt="" src={riwayatSaldoIcon} /> Riwayat Top Up
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
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
                {nominalTopup ? 
                  <Form.Control onBlur={() => setNominalTopup(!nominalTopup)} onChange={handleChange} placeholder="Rp" name="amounts" type="number" value={inputHandle.amounts === 0 ? "Rp" : inputHandle.amounts} /> :
                  <Form.Control onFocus={() => setNominalTopup(!nominalTopup)} onChange={handleChange} placeholder="Rp" name="amounts" type="text" value={convertFormatNumber(inputHandle.amounts)} />
                }
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
                    <div style={{ color: "#B9121B", fontSize: 12 }}>
                      <img src={noteIconRed} className="me-2" />
                      Nominal Top Up wajib diisi
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
                <img src={Jam} alt="jam" /><span className="mx-2 fw-bold" style={{color: "#077E86"}}><Countdown date={Date.now() + 7199000} daysInHours={true} /></span>
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
                      <div onChange={copyHandler} id="noRek" style={{padding:"unset"}} className="fw-bold mt-1">{topUpBalance.no_rek}</div>
                    </div>
                    <div className="d-flex flex-column mt-3">
                      <div onClick={copyRek} style={{padding:"unset", cursor: "pointer"}} className="fw-bold"><img src={CopyIcon} alt="copy" /><span className="ms-2" style={{color: "#077E86"}}>Salin</span></div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="d-flex flex-column text-left">
                      <div style={{padding:"unset"}}>Nominal Transfer</div>
                      <div onChange={copyHandler} id="pricing" style={{padding:"unset"}} className="fw-bold mt-1">{startColorNumber(topUpBalance.amount_transfer)}<span style={{color: "#DF9C43"}}>{endColorNumber(topUpBalance.amount_transfer)}</span></div>
                    </div>
                    <div className="d-flex flex-column mt-3">
                      <div onClick={copyPrice} style={{padding:"unset", cursor: "pointer"}} className="fw-bold"><img src={CopyIcon} alt="copy" /><span className="ms-2" style={{color: "#077E86"}}>Salin</span></div>
                    </div>
                  </div>
                </Table>                
              </div>
              <Table style={{borderRadius: "8px", backgroundColor: "#FFFBE5", fontSize: "12px", padding: "10px"}} className="d-flex justify-content-center align-items-center mt-2">
                <img src={noticeIcon} alt="notice" />
                <div className="mx-2 text-left">Lakukan transfer sesuai dengan nominal yang tertera hingga 3 digit terakhir.</div>
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
                  // noDataComponent={<div style={{ marginBottom: 10 }}>No Data</div>}
                  pagination
                  highlightOnHover
                  // progressPending={pending}
                  progressComponent={<CustomLoader />}
                />
              </div>
            }
          </Modal.Body>
        </Modal>
      </Container>
    </Navbar>
    {topUpResult.is_update === true ?
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
