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
  Button,
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
  const handleCloseModalTopUp = () => setShowModalTopUp(false);
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
          <Modal centered show={showModalTopUp} onHide={handleCloseModalTopUp}>
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
                <Form.Group id="referenceNumber">
                  <Form.Label>Reference Number</Form.Label>
                  <InputGroup className="disini"></InputGroup>
                  <Form.Control placeholder="Masukkan Reference Number" />
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
                    cursor: "pointer",
                  }}
                  onClick={handleClick}
                >
                  Upload File
                </u>
                <span className="mx-1">{imageTopUp.data?.name}</span>
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
                >
                  <FontAwesomeIcon style={{ marginRight: 10 }} /> Konfirmasi
                </button>
              </div>
            </Modal.Body>
          </Modal>
        </React.Fragment>
      </Container>
    </Navbar>
  );
};
