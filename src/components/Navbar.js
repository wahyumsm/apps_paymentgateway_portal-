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
  Button, Table
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
import { BaseURL, convertToRupiah, getToken, removeUserSession } from "../function/helpers";
import axios from "axios";
import { getUserDetail } from "../redux/ActionCreators/UserDetailAction";
import { useDispatch, useSelector } from "react-redux";
import DropdownToggle from "@themesberg/react-bootstrap/lib/esm/DropdownToggle";
import { agenLists } from "../data/tables";
import DataTable from "react-data-table-component";
import loadingEzeelink from "../assets/img/technologies/Double Ring-1s-303px.svg"
import checklistCircle from '../assets/img/icons/checklist_circle.svg';
import CopyIcon from '../assets/icon/carbon_copy.svg'
import GagalIcon from '../assets/icon/gagaltopup_icon.svg'

export default (props) => {
  const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA);
  const areNotificationsRead = notifications.reduce(
    (acc, notif) => acc && notif.read,
    true
  );
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
  };

  const [getBalance, setGetBalance] = useState({})
  const [showModalTopUp, setShowModalTopUp] = useState(false);
  const [showModalHistoryTopUp, setShowModalHistoryTopUp] = useState(false)
  const [showModalKonfirmasiTopUp, setShowModalKonfirmasiTopUp] = useState(false)
  const [showGagalTopUp, setShowGagalTopUp] = useState(false)
  const [showRiwayatTopUp, setShowRiwayatTopUp] = useState(false)
  const handleCloseModalTopUp = () => setShowModalTopUp(false);
  const handleCloseHistoryTopUp = () => setShowModalHistoryTopUp(false);
  const handleCloseRiwayatTopUp = () => setShowRiwayatTopUp(false)
  const [topUp, setTopUp] = useState({})
  const [imageTopUp, setImageTopUp] = useState({});
  const hiddenFileInput = useRef(null);
  const access_token = getToken()
  const [text, setText] = useState('');
  const [inputHandle, setInputHandle] = useState({
    amount: "",
    reffNo: "",
  })
  const [ topUpResult, setTopUpResult ] = useState({})
  const [iconGagal, setIconGagal] = useState(false)
  const [uploadGagal, setUploadGagal] = useState(false)

  function handleChange(e) {
    setInputHandle({
      ...inputHandle,
      [e.target.name] : e.target.value
    })
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
    setShowRiwayatTopUp(true)
  };  

  const copyHandler = (event) => {
    setText(event.target.value);
  };

  const copyId = async () => {
    var copyText = document.getElementById('myInput').innerHTML;
    await navigator.clipboard.writeText(copyText);
    alert('Text copied');
  };


  async function topUpHandle(imageTopUp, amount, reffNo) {
    try {
        if (inputHandle.reffNo.length === 0 || inputHandle.reffNo === undefined) {
          setIconGagal(true)
        } else {
          setIconGagal(false)
        }
        if (Object.keys(imageTopUp).length === 0) {
          setUploadGagal(true)
        } else {
          setUploadGagal(false)
        }
        const auth = "Bearer " + getToken()        
        var formData = new FormData()
        formData.append('SlipPaymentFile', imageTopUp.SlipPaymentFile)
        formData.append('amount', amount)
        formData.append('reffNo', reffNo)
        console.log(formData, "ini form data")
        for (var pair of formData.entries()) {
            console.log(pair[0]+ ', ' + pair[1], "ini logfor"); 
        }
        const headers = {
            'Content-Type':'multipart/form-data',
            'Authorization' : auth
        }
        const topUp = await axios.post("/Partner/TopupConfirmation", formData, { headers: headers })
        console.log(topUp, 'ini topup');
        if(topUp.status === 200 && topUp.data.response_code === 200) {
          setTopUpResult(topUp.data.response_data.results)
          setShowModalTopUp(false)
          setShowModalKonfirmasiTopUp(true)
        }
      } catch (error) {
        console.log(error)
        if (error.response.status === 401) {
            history.push('/login')
        } else if (error.response.status === 400) {
          alert("Top Up Gagal")
        }
      }
    }

    async function GetBalanceHandle () {
      try {
          const auth = "Bearer " + getToken()
          const headers = {
              'Content-Type':'application/json',
              'Authorization' : auth
          }
          const getBalance = await axios.post("/partner/GetBalance", { data: "" }, { headers: headers })
          console.log(getBalance, 'ini data get balance');
          if (getBalance.data.response_code === 200 && getBalance.status === 200) {
              // getBalance.data.response_data = getBalance.data.response_data.map((obj, id) => ({ ...obj, number: id +1}));
              setGetBalance(getBalance.data.response_data)
          }
          
      } catch (error) {
          console.log(error)
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
          console.log(listRiwayat, 'ini data user ');
          if (listRiwayat.data.response_code === 200 && listRiwayat.status === 200) {
              listRiwayat.data.response_data = listRiwayat.data.response_data.map((obj, id) => ({ ...obj, number: id +1}));
              setListRiwayat(listRiwayat.data.response_data)
          }
          
      } catch (error) {
          console.log(error)
      }
    }

    useEffect(() => {
      if (!access_token) {
      history.push('/login');
    }
      GetBalanceHandle()
      listRiwayatTopUp()
    }, [])

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
    }
  }

  const columns = [
    {
      name: 'No',
      selector: row => row.number,
      ignoreRowClick: true,
      button: true,
    },
    {
      name: 'ID Transaksi',
      selector: row => row.code_trans,
      sortable: true,
    },
    {
      name: 'Sumber Agen',
      selector: row => row.agen_name,
      sortable: true,
    },
    {
      name: 'Kode Unik',
      selector: row => row.unique_code,
      sortable: true,
    },
    {
      name: 'Nominal Top Up',
      selector: row => row.amount,
      sortable: true,
    },
    {
      name: 'Tanggal Top Up',
      selector: row => row.topup_date,
      sortable: true
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
      {/* <div>Loading...</div> */}
    </div>
  );

  const modalRiwayat = () => {
    setShowModalKonfirmasiTopUp(false)
    setShowModalHistoryTopUp(true)
  };

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

  useEffect(() => {
    dispatch(getUserDetail("/Account/GetUserProfile"));
  }, []);

  return (
    <Navbar
      variant="dark"
      expanded
      className="ps-0 pe-2 pb-0"
      style={{ backgroundColor: "#ffffff" }}
    >
      <Container fluid className="px-0">
        <div className="d-flex justify-content-between w-100">
          <div className="d-flex align-items-center"></div>
          <Nav className="align-items-center">

            {/* Saldo */}
            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle as={Nav.Link} className="pt-1 px-0">
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
                  <img alt="" src={riwayatSaldoIcon} /> Riwayat
                </Dropdown.Item>
              </Dropdown.Menu>

              {/* notification */}
            </Dropdown>
            <Dropdown as={Nav.Item} onToggle={markNotificationsAsRead}>
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
            </Dropdown>

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
                <Dropdown.Item className="fw-bold" style={{ width: "100%" }}>
                  <img alt="" src={userIcon} /> {userDetail.muser_name} (
                  {userDetail.mrole_desc})
                </Dropdown.Item>
                {/* <Dropdown.Item className="fw-bold" onClick={() => navToDetailAccount()}>
                  <img alt="" src={iconDetailAkun}/> Detail Akun
                </Dropdown.Item> */}
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
        <React.Fragment>
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
                  Konfirmasi Top Up Saldo
                </Modal.Title>
              </Col>
            </Modal.Header>
            <Modal.Body>
              <Form action="#">
                <Form.Group className="mb-3">
                  <Form.Label>Nominal Top Up Saldo</Form.Label>
                  <Form.Control disabled name="amount" value={getBalance.topupAmount} type="number" />
                </Form.Group>
                <Form.Group id="referenceNumber">
                  <Form.Label>Reference Number</Form.Label>
                  <InputGroup className="topup"></InputGroup>
                  <Form.Control className="reff" name="reffNo"  onChange={handleChange} placeholder="Masukkan Reference Number" type="number" />
                </Form.Group>
                {iconGagal === true && 
                <>
                  <div style={{ color: "#B9121B", fontSize: 12 }}>
                    <img src={noteIconRed} className="me-2" />
                    Nomor Referensi wajib diisi
                  </div>
                </>
              }               
              </Form>              
              <div>
                <img src={noteIcon} className="me-2" />
                <span className="text-modal">
                  Reference Number dapat dilihat pada bukti transfer
                </span>
              </div>
              <div
                className="my-2"
                style={{
                  fontSize: 14,
                  color: "#383838",
                }}
              >
                Upload Bukti Transaksi
              </div>
              <div className="mb-4">
                <u
                  style={{
                    fontSize: 14,
                    color: "#077E86",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                  onClick={handleClick}
                >
                  Upload File
                </u>
                <span className="mx-1">{imageTopUp.SlipPaymentFile?.name}</span>
                {uploadGagal === true && 
                  <span style={{ color: "#B9121B", fontSize: 12 }} className="mx-2">
                    <img src={noteIconRed} className="me-2" />
                    Wajib upload bukti top up
                  </span>
                }                
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={hiddenFileInput}
                  id="imageTopUp"
                  name="imageTopUp"
                />
              </div>
              <div className="d-flex justify-content-center">
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
                  onClick={() => topUpHandle(imageTopUp, getBalance.topupAmount, inputHandle.reffNo)}
                >
                  <FontAwesomeIcon style={{ marginRight: 10 }} /> Konfirmasi
                </button>
              </div>
            </Modal.Body>
          </Modal>
        </React.Fragment>

        
        <Modal centered show={showModalKonfirmasiTopUp} onHide={() => setShowModalKonfirmasiTopUp(false)} style={{ borderRadius: 8 }}>
          <Modal.Body style={{ maxWidth: 468, width: "100%", padding: "0px 24px" }}>
              <Button
                className="position-absolute top-0 end-0 m-3"
                variant="close"
                aria-label="Close"
                onClick={() => setShowModalKonfirmasiTopUp(false)}
              />
              <div style={{ display: "flex", justifyContent: "center", marginTop: 24, marginBottom: 12 }}>
                  <img src={checklistCircle} alt="logo" />
              </div>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                  <p style={{ fontFamily: "Exo", fontSize: 20, fontWeight: 700, marginBottom: "unset" }}>Top Up Berhasil</p>
              </div>
              <div style={{ display: "flex", justifyContent: "center", textAlign: "center", marginBottom: 24 }}>
                  <p style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginBottom: "unset" }}>Kamu telah berhasil top up senilai {topUpResult.amount}</p>
              </div>
              <center>
                  <div style={{ margin: "20px -15px 15px -15px", width: 420, height: 1, padding: "0px 24px", backgroundColor: "#EBEBEB" }} />
              </center>
              <div>
                  <Table className='detailSave'>
                    <tr>ID Transaksi</tr>
                    <tr>
                        <td onChange={copyHandler} id="myInput" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700 }} >{topUpResult.IDTrx}</td>
                        <td onClick={copyId} className="mx-5 text-end" style={{ fontWeight: 600, cursor: "pointer" }} ><img src={CopyIcon} alt="copy" />Salin</td>
                    </tr>
                    <tr>
                        <td>{topUpResult.tglTrx}</td>
                    </tr>
                  </Table>
                  <p style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700 }}>Detail Transaksi</p>
                  <Table >
                      <tr>
                          <td>Nominal Top Up</td>
                          <td>:</td>
                          <td style={{ fontWeight: 600 }}>{topUpResult.amount}</td>
                      </tr>
                      <tr>
                          <td>Sumber Agen</td>
                          <td>:</td>
                          <td style={{ fontWeight: 600 }}>{topUpResult.partner}</td>
                      </tr>
                      <tr>
                          <td>Kode Unik</td>
                          <td>:</td>
                          <td style={{ fontWeight: 600 }}>{topUpResult.uniqueCode}</td>
                      </tr>
                      <tr>
                          <td>Status</td>
                          <td>:</td>
                          <td className='active-status-badge' style={{ fontWeight: 600 }}>{topUpResult.statusName}</td>
                      </tr>
                  </Table>
              </div>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                  <Button variant="primary" onClick={modalRiwayat} style={{ fontFamily: "Exo", color: "black", background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", maxWidth: "100%", maxHeight: 45, width: "100%", height: "100%" }}>Lihat Riwayat Top up</Button>
              </div>
          </Modal.Body>
        </Modal>


        <Modal className="history-modal" size="xl" centered show={showModalHistoryTopUp} onHide={handleCloseHistoryTopUp}>
          <Modal.Header className="border-0">
            <Button
              className="position-absolute top-0 end-0 m-3"
              variant="close"
              aria-label="Close"
              onClick={handleCloseHistoryTopUp}
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
                  // paginationResetDefaultPage={resetPaginationToggle}
                  // subHeader
                  // subHeaderComponent={subHeaderComponentMemo}
                  // selectableRows
                  // persistTableHead
                  // onRowClicked={(listAgen) => {
                  //   detailAgenHandler(listAgen.agen_id)
                  // }}
                />
              </div>
            }
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
                  // paginationResetDefaultPage={resetPaginationToggle}
                  // subHeader
                  // subHeaderComponent={subHeaderComponentMemo}
                  // selectableRows
                  // persistTableHead
                  // onRowClicked={(listAgen) => {
                  //   detailAgenHandler(listAgen.agen_id)
                  // }}
                />
              </div>
            }
          </Modal.Body>
        </Modal>
      </Container>
    </Navbar>
  );
};
