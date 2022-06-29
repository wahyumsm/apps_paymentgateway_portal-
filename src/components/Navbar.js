
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCog, faEnvelopeOpen, faSearch, faSignOutAlt, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { faUserCircle } from "@fortawesome/free-regular-svg-icons";
import { Row, Col, Nav, Form, Image, Navbar, Dropdown, Container, ListGroup, InputGroup } from '@themesberg/react-bootstrap';

import NOTIFICATIONS_DATA from "../data/notifications";
import Profile3 from "../assets/icon/default_profile.png";
import iconDetailAkun from "../assets/icon/detail_akun_icon.svg"
import userIcon from "../assets/icon/akun_icon.svg"
import logoutIcon from "../assets/icon/logout_icon.svg"
import arrowDown from "../assets/img/icons/arrow_down.svg"
import { useHistory } from "react-router-dom";
import { BaseURL, getToken, removeUserSession } from "../function/helpers";
import axios from "axios";
import { getUserDetail } from "../redux/ActionCreators/UserDetailAction";
import { useDispatch, useSelector } from "react-redux";

export default (props) => {
  const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA);
  const areNotificationsRead = notifications.reduce((acc, notif) => acc && notif.read, true);
  const history = useHistory();
  const userDetail = useSelector(state => state.userDetailReducer.userDetail);
  const dispatch = useDispatch()

  const markNotificationsAsRead = () => {
    setTimeout(() => {
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    }, 300);
  };

  // async function getUserDetail() {
  //   try {
  //     const auth = "Bearer " + getToken()
  //     const headers = {
  //       'Content-Type':'application/json',
  //       'Authorization' : auth
  //     }
  //     const userDetail = await axios.post("/Account/GetUserProfile", { data: "" }, { headers: headers })
  //     // console.log(userDetail, 'ini data user');
  //     if (userDetail.status === 200 && userDetail.data.response_code === 200) {
  //       // console.log(userDetail.data.response_data, 'ini data user untuk navbar');
  //       setUserDetail(userDetail.data.response_data)
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
    
  // }

  const navToDetailAccount = () => {
    history.push("/detailakun");
  }

  async function logoutHandler() {
    try {
      const auth = "Bearer " + getToken()
      const headers = {
        'Content-Type':'application/json',
        'Authorization' : auth
      }
      const logout = await axios.post("/Account/Logout", { data: "" }, { headers: headers })
      // console.log(logout, 'ini hasil logout');
      if (logout.status === 200 && logout.data.response_code === 200) {
        removeUserSession()
        history.push("/sign-in")
      }
    } catch (error) {
      console.log(error)
    }
  }


  const Notification = (props) => {
    const { link, sender, image, time, message, read = false } = props;
    const readClassName = read ? "" : "text-danger";

    return (
      <ListGroup.Item action href={link} className="border-bottom border-light">
        <Row className="align-items-center">
          <Col className="col-auto">
            <Image src={image} className="user-avatar lg-avatar rounded-circle" />
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
    dispatch(getUserDetail("/Account/GetUserProfile"))
  }, [])
  // console.log(userDetail, 'ini data user untuk navbar');
  
  return (
    <Navbar variant="dark" expanded className="ps-0 pe-2 pb-0" style={{backgroundColor: '#ffffff'}}>
      <Container fluid className="px-0">
        <div className="d-flex justify-content-between w-100">
          <div className="d-flex align-items-center">

          </div>
          <Nav className="align-items-center">
            {/* <Dropdown as={Nav.Item} onToggle={markNotificationsAsRead} >
              <Dropdown.Toggle as={Nav.Link} className="text-dark icon-notifications me-lg-3">
                <span className="icon icon-sm">
                  <FontAwesomeIcon icon={faBell} className="bell-shake" />
                  {areNotificationsRead ? null : <span className="icon-badge rounded-circle unread-notifications" />}
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu className="dashboard-dropdown notifications-dropdown dropdown-menu-lg dropdown-menu-center mt-2 py-0">
                <ListGroup className="list-group-flush">
                  <Nav.Link href="#" className="text-center text-primary fw-bold border-bottom border-light py-3">
                    Notifications
                  </Nav.Link>

                  {notifications.map(n => <Notification key={`notification-${n.id}`} {...n} />)}

                  <Dropdown.Item className="text-center text-primary fw-bold py-3">
                    View all
                  </Dropdown.Item>
                </ListGroup>
              </Dropdown.Menu>
            </Dropdown> */}

            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle as={Nav.Link} className="pt-1 px-0">
                <div className="media d-flex align-items-center">
                  <Image src={Profile3} className="user-avatar md-avatar rounded-circle" />
                  <div className="media-body ms-2 text-dark align-items-center d-none d-lg-block">
                    <span className="mb-0 font-small fw-bold">{userDetail.muser_name}</span>
                    <img src={arrowDown} alt="arrow_down" style={{ marginLeft: 10 }} />
                  </div>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="user-dropdown dropdown-menu-right mt-2" style={{ minWidth: "14rem", width: "100%" }}>
                <Dropdown.Item className="fw-bold" style={{ width: "100%" }}>
                <img alt="" src={userIcon}/> {userDetail.muser_name} ({userDetail.mrole_desc})
                </Dropdown.Item>
                {/* <Dropdown.Item className="fw-bold" onClick={() => navToDetailAccount()}>
                  <img alt="" src={iconDetailAkun}/> Detail Akun
                </Dropdown.Item> */}
                <Dropdown.Divider />

                <Dropdown.Item onClick={() => logoutHandler()} className="fw-bold">
                  <img alt="" src={logoutIcon}/> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </div>
      </Container>
    </Navbar>
  );
};
