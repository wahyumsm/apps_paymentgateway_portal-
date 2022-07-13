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
import { BaseURL, getToken, removeUserSession } from "../function/helpers";
import axios from "axios";
import { getUserDetail } from "../redux/ActionCreators/UserDetailAction";
import { useDispatch, useSelector } from "react-redux";
import DropdownToggle from "@themesberg/react-bootstrap/lib/esm/DropdownToggle";
import { agenLists } from "../data/tables";
import DataTable from "react-data-table-component";
import loadingEzeelink from "../assets/img/technologies/Double Ring-1s-303px.svg"
import checklistCircle from '../assets/img/icons/checklist_circle.svg';
import CopyIcon from '../assets/icon/carbon_copy.svg'

export default (props) => {
  const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA);
  const areNotificationsRead = notifications.reduce(
    (acc, notif) => acc && notif.read,
    true
  );
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

  const [showModalTopUp, setShowModalTopUp] = useState(false);
  const [showModalHistoryTopUp, setShowModalHistoryTopUp] = useState(false)
  const [showModalKonfirmasiTopUp, setShowModalKonfirmasiTopUp] = useState(false)
  const handleCloseModalTopUp = () => setShowModalTopUp(false);
  const handleCloseHistoryTopUp = () => setShowModalHistoryTopUp(false);
  const [imageTopUp, setImageTopUp] = useState({});
  const hiddenFileInput = useRef(null);
  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };
  const handleFileChange = (event) => {
    let dataImage = {
      data: event.target.files[0],
    };
    setImageTopUp(dataImage);
    console.log(dataImage);
  };

  const toHistoryBalance = () => {
    alert("HistoryBalance!");
  };

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
      // console.log(logout, 'ini hasil logout');
      if (logout.status === 200 && logout.data.response_code === 200) {
        removeUserSession();
        history.push("/sign-in");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const columns = [
    {
      name: 'No',
      selector: row => row.id,
      ignoreRowClick: true,
      button: true,
    },
    {
      name: 'ID Transaksi',
      selector: row => row.IDAgen,
      // sortable: true,
      // cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} onClick={() => detailAgenHandler(row.agen_id)}>{row.agen_id}</Link>
    },
    {
      name: 'Sumber Agen',
      selector: row => row.namaAgen,
      // sortable: true,
    },
    {
      name: 'Kode Unik',
      selector: row => row.email,
      // sortable: true,
    },
    {
      name: 'Nominal Top Up',
      selector: row => row.noHp,
      // sortable: true,
    },
    {
      name: 'Tanggal Top Up',
      selector: row => row.noRekening,
      // sortable: true
    },
    {
      name: 'Status',
      selector: row => row.status,
      width: "90px",
      style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px 12px", margin: "6px 0px", width: "50%", borderRadius: 4 },
      // conditionalCellStyles: [
      //   {
      //     when: row => row.status === "Aktif",
      //     style: { background: "rgba(7, 126, 134, 0.08)" }
      //   },
      //   {
      //     when: row => row.status === "Tidak Aktif",
      //     style: { background: "#F0F0F0" }
      //   }
      // ],
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

  const modalNavbar = () => {
    setShowModalTopUp(false)
    setShowModalKonfirmasiTopUp(true)
  }

  const modalRiwayat = () => {
    setShowModalKonfirmasiTopUp(false)
    setShowModalHistoryTopUp(true)
  }

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
                  <span className="mb-0 font-small fw-bold">Rp 20.000.000</span>
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
                  <Form.Control placeholder="Rp -" disabled />
                </Form.Group>
                <Form.Group id="referenceNumber" mb-1>
                  <Form.Label>Reference Number</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="text-gray-600"></InputGroup.Text>
                    <Form.Control placeholder="Masukkan Reference Number" />
                  </InputGroup>
                </Form.Group>
                <div style={{ color: "#B9121B", fontSize: 12 }}>
                  <img src={noteIconRed} className="me-2" />
                  Nomor Referensi wajib diisi
                </div>
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
                  }}
                  onClick={handleClick}
                >
                  Upload File
                </u>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={hiddenFileInput}
                />
              </div>
              <div className="d-flex justify-content-center">
                <button
                  // onClick={() => tambahAgen()}
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
                  onClick={modalNavbar}
                >
                  <FontAwesomeIcon style={{ marginRight: 10 }} /> Konfirmasi
                </button>
              </div>
            </Modal.Body>
          </Modal>
        </React.Fragment>
        <Modal centered show={showModalKonfirmasiTopUp} onHide={() => setShowModalKonfirmasiTopUp(false)} style={{ borderRadius: 8 }}>
          <Modal.Body style={{ maxWidth: 468, width: "100%", padding: "0px 24px" }}>
              <div style={{ display: "flex", justifyContent: "center", marginTop: 24, marginBottom: 12 }}>
                  <img src={checklistCircle} alt="logo" />
              </div>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                  <p style={{ fontFamily: "Exo", fontSize: 20, fontWeight: 700, marginBottom: "unset" }}>Top Up Berhasil</p>
              </div>
              <div style={{ display: "flex", justifyContent: "center", textAlign: "center", marginBottom: 24 }}>
                  <p style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginBottom: "unset" }}>Kamu telah berhasil top up senilai Rp100.000</p>
              </div>
              <center>
                  <div style={{ margin: "20px -15px 15px -15px", width: 420, height: 1, padding: "0px 24px", backgroundColor: "#EBEBEB" }} />
              </center>
              <div>
                  <Table className='detailSave'>
                    <tr>ID Transaksi</tr>
                    <tr>
                        <td style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700 }}>#3123535</td>
                        <td className="mx-5 text-end" style={{ fontWeight: 600 }}><img src={CopyIcon} alt="copy" />Salin</td>
                    </tr>
                    <tr>
                        <td>Rabu, 06 Juli 2022 11:46 WIB</td>
                    </tr>
                  </Table>
                  <p style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700 }}>Detail Transaksi</p>
                  <Table >
                      <tr>
                          <td>Nominal Top Up</td>
                          <td>:</td>
                          <td style={{ fontWeight: 600 }}>Rp.100.000</td>
                      </tr>
                      <tr>
                          <td>Sumber Agen</td>
                          <td>:</td>
                          <td style={{ fontWeight: 600 }}>Agen Agus</td>
                      </tr>
                      <tr>
                          <td>Kode Unik</td>
                          <td>:</td>
                          <td style={{ fontWeight: 600 }}>145</td>
                      </tr>
                      <tr>
                          <td>Status</td>
                          <td>:</td>
                          <td className='active-status-badge' style={{ fontWeight: 600 }}>Berhasil</td>
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
                  data={agenLists}
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
