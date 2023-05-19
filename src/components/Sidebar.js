import React, { useEffect, useState } from "react";
import SimpleBar from 'simplebar-react';
import { NavLink, useHistory, useLocation } from "react-router-dom";
import { CSSTransition } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faBoxOpen, faChartPie, faCog, faFileAlt, faHandHoldingUsd, faSignOutAlt, faTable, faTimes, faCalendarAlt, faMapPin, faInbox, faRocket, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Nav, Badge, Image, Button, Dropdown, Accordion, Navbar } from '@themesberg/react-bootstrap';
import { Link } from 'react-router-dom';
import './css/global.css'

import { Routes } from "../routes";
import EzeeLogo from "../assets/icon/Logo_Ezeelink.svg";
import ThemesbergLogo from "../assets/img/themesberg.svg";
import ReactHero from "../assets/img/technologies/react-hero-logo.svg";
import ProfilePicture from "../assets/img/team/profile-picture-3.jpg";
import { GetUserAccessMenu } from "../redux/ActionCreators/UserAccessMenuAction";
import { useDispatch, useSelector } from "react-redux";
import { getRole, getToken } from "../function/helpers";
import arrowDown from "../assets/img/icons/arrow_down.svg";
import arrowRight from "../assets/img/icons/arrow_right_white.png";

export default (props = {}) => {

  const location = useLocation();
  const dispatch = useDispatch()
  const history = useHistory()
  const access_token = getToken()
  const { pathname } = location;
  const [show, setShow] = useState(false);
  const showClass = show ? "show" : "";
  const userAccessMenu = useSelector(state => state.userAccessMenuReducer.userAccessMenu)

  const onCollapse = () => setShow(!show);

  const CollapsableNavItem = (props) => {
    const { eventKey, title, icon, image, children = null } = props;
    const defaultKey = pathname.indexOf(eventKey) !== -1 ? eventKey : "";

    return (
      <Accordion as={Nav.Item} defaultActiveKey={defaultKey}>
        <Accordion.Item eventKey={eventKey}>
          <Accordion.Button as={Nav.Link} className="d-flex justify-content-between align-items-center">
            <span>
              {icon ? <span className="sidebar-icon"><FontAwesomeIcon icon={icon} /> </span> : null}
              {image ? <Image src={image} width={20} height={20} className="sidebar-icon svg-icon" /> : null}
              <span className="sidebar-text">{title}</span>
            </span>
          </Accordion.Button>
          <Accordion.Body className="multi-level">
            <Nav className="flex-column">
              {children}
            </Nav>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  };

  const NavItem = (props) => {
    const { title, link, external, target, icon, image, badgeText, badgeBg = "secondary", badgeColor = "primary" } = props;
    const classNames = badgeText ? "d-flex justify-content-start align-items-center justify-content-between" : "";
    const navItemClassName = link === pathname ? "active" : "";
    const linkProps = external ? { href: link } : { as: Link, to: link };

    return (
      <Nav.Item className={navItemClassName} onClick={() => setShow(false)}>
        <Nav.Link {...linkProps} target={target} className={` d-flex justify-content-start align-items-center ${classNames}`}>
          <div>
            {icon ? <span className="sidebar-icon"><FontAwesomeIcon icon={icon} /> </span> : null}
            {image ? <Image src={image} width={20} height={20} className="sidebar-icon svg-icon" /> : null}

          </div>
          <div className={title === "Riwayat Transaksi Sub Account Admin" ? " ms-2 sidebar-text" : "sidebar-text"}>{title}</div>
          {badgeText ? (
            <Badge pill bg={badgeBg} text={badgeColor} className="badge-md notification-count ms-2">{badgeText}</Badge>
          ) : null}
        </Nav.Link>
      </Nav.Item>
    );
  };

  useEffect(() => {
    if (!access_token) {
      history.push("/login")
    }
    dispatch(GetUserAccessMenu("/Account/GetUserAccess"))
  }, [])
  
  if (!userAccessMenu) {
    return null
  }

  return (
    <>
      <Navbar expand={false} collapseOnSelect variant="dark" className="px-4 d-md-none">
        <Navbar.Brand className="me-lg-5" as={Link} to={Routes.DashboardOverview.path}>
          <Image src={ReactHero} className="navbar-brand-light" />
        </Navbar.Brand>
        <Navbar.Toggle as={Button} aria-controls="main-navbar" onClick={onCollapse}>
          <span className="navbar-toggler-icon" />
        </Navbar.Toggle>
      </Navbar>
      <CSSTransition timeout={300} in={show} classNames="sidebar-transition">
        <SimpleBar className={`collapse ${showClass} sidebar d-md-block text-white`} style={{backgroundColor: '#2C1919'}}>       
          <div className="sidebar-inner">
            {/* <div className="user-card d-flex d-md-none align-items-center justify-content-between justify-content-md-center pb-4">
              <div className="d-flex align-items-center">
                <div className="user-avatar lg-avatar me-4">
                  <Image src={ProfilePicture} className="card-img-top rounded-circle border-white" />
                </div>
                <div className="d-block">
                  <h6>Hi, Jane</h6>
                  <Button as={Link} variant="secondary" size="xs" to={Routes.Login.path} className="text-dark">
                    <FontAwesomeIcon icon={faSignOutAlt} className="me-2" /> Sign Out
                  </Button>
                </div>
              </div>
              <Nav.Link className="collapse-close d-md-none" onClick={onCollapse}>
                <FontAwesomeIcon icon={faTimes} />
              </Nav.Link>
            </div> */}
            <Nav className="flex-column pt-3 pt-md-0">              
              <div style={{backgroundColor: '#DF9C43', height: '67px', textAlign: 'center'}}>
                <img src={EzeeLogo} style={{width: 66, height: 36, marginTop: 12}} alt=""/>
              </div>              
              {
                userAccessMenu.map((item) => {
                  return (
                    (item.detail.length === 0) ?
                    <NavItem
                      key={item.id}
                      // className={ (!item.is_visibled) ? "nav-link disabled" : "" }
                      // disabled={(!item.isVisibled) ? false : true}
                      title={item.label}
                      // image={(item.label === "Dashboard") ? BerandaIcon : (item.label === "Report") ? LaporanIcon : (item.label === "Daftar Agen") ? DaftarAgenIcon : ""}
                      image={item.icon}
                      // link={Routes.Transactions.path}
                      link={(item.id === 10) ? Routes.DashboardOverview.path : (item.id === 11) ? Routes.Transactions.path : (item.id === 14) ? Routes.DaftarAgen.path : (item.id === 12) ? Routes.NotFound.path : (item.id === 15) ? Routes.DaftarPartner.path : (item.id === 17) ? Routes.InvoiceVA.path : (item.id === 18) ? Routes.ListUser.path : (item.id === 20) ? Routes.ListPayment.path : (item.id === 21) ? Routes.DisbursementReport.path : (item.id === 22) ? Routes.RiwayatTopUp.path : (item.id === 23) ? Routes.InvoiceDisbursement.path : (item.id === 25) ? Routes.ListRiwayatSubAccountAdmin.path : ""}
                    /> :
                    <CollapsableNavItem eventKey={item.label} key={item.id} title={item.label} image={item.icon}>
                      {
                        item.detail.map(item2 => {
                          return (
                            (item2.detail.length === 0) ?
                            <NavItem
                              key={item2.id}
                              title={item2.label}
                              // icon={faAngleRight}
                              image={item2.icon}
                              link={(item2.id === 1601) ? Routes.RiwayatTransaksi.path : (item2.id === 1602) ? Routes.SaldoPartner.path : (item2.id === 1603) ? Routes.eWallet.path : (item2.id === 1607) ? Routes.disbursementTimeout.path : (item2.id === 1901) ? Routes.ReNotifyVA.path : (item2.id === 2401) ? Routes.InfoSaldoDanMutasi.path : (item2.id === 2402) ? Routes.TransferSubAccount.path : (item2.id === 2403) ? Routes.ListRiwayatSubAccount.path : (item2.id === 2601) ? Routes.DisbursementPage.path : (item2.id === 2602) ? Routes.RiwayatDisbursement.path : (item2.id === 9901) ? Routes.NotFound.path : (item2.id === 9902) ? Routes.NotFound.path : ""}
                            /> :
                            <CollapsableNavItem key={item2.id} title={item2.label} image={item2.icon}>
                              {
                                item2.detail.map(item3 => {
                                  return (
                                    <div style={{ marginLeft: 30 }}>
                                      <NavItem
                                        key={item3.id}
                                        title={item3.label}
                                        // icon={faAngleRight}
                                        image={item3.icon}
                                        link={(item2.id === 990201) ? Routes.NotFound.path : (item2.id === 990202) ? Routes.NotFound.path : ""}
                                      />
                                    </div>
                                  )
                                })
                              }
                            </CollapsableNavItem>
                          )
                        })
                      }
                    </CollapsableNavItem>
                  )
                })
              }
              {/* <NavItem title="Beranda" link={Routes.DashboardOverview.path} image={BerandaIcon} /> */}
              {/* <NavItem title="Laporan" image={LaporanIcon} link={Routes.Transactions.path} /> */}
              {/* <NavItem title="Riwayat Transaksi" image={RiwayatIcon} link={Routes.RiwayatTransaksi.path} /> */}
              {/* <NavItem title="Daftar Agen" image={DaftarAgenIcon} link={Routes.DaftarAgen.path} /> */}
              {/* <NavItem title="Daftar Partner" image={DaftarPartnerIcon} link={Routes.DaftarPartner.path}/> */}
{/* 
              <CollapsableNavItem eventKey="tables/" title="Tables" icon={faTable}>
                <NavItem title="Bootstrap Table" link={Routes.BootstrapTables.path} />
              </CollapsableNavItem>

              <CollapsableNavItem eventKey="examples/" title="Page Examples" icon={faFileAlt}>
                <NavItem title="Sign In" link={Routes.Login.path} />
                <NavItem title="Sign Up" link={Routes.Signup.path} />
                <NavItem title="Forgot password" link={Routes.ForgotPassword.path} />
                <NavItem title="Reset password" link={Routes.ResetPassword.path} />
                <NavItem title="Lock" link={Routes.Lock.path} />
                <NavItem title="404 Not Found" link={Routes.NotFound.path} />
                <NavItem title="500 Server Error" link={Routes.ServerError.path} />
              </CollapsableNavItem> */}
              {/* <CollapsableNavItem eventKey="components/" title="Components" icon={faBoxOpen}>
                <NavItem title="Accordion" link={Routes.Accordions.path} />
                <NavItem title="Alerts" link={Routes.Alerts.path} />
                <NavItem title="Badges" link={Routes.Badges.path} />
                <NavItem external title="Widgets" link="https://demo.themesberg.com/volt-pro-react/#/components/widgets" target="_blank" badgeText="Pro" />
                <NavItem title="Breadcrumbs" link={Routes.Breadcrumbs.path} />
                <NavItem title="Buttons" link={Routes.Buttons.path} />
                <NavItem title="Forms" link={Routes.Forms.path} />
                <NavItem title="Modals" link={Routes.Modals.path} />
                <NavItem title="Navbars" link={Routes.Navbars.path} />
                <NavItem title="Navs" link={Routes.Navs.path} />
                <NavItem title="Pagination" link={Routes.Pagination.path} />
                <NavItem title="Popovers" link={Routes.Popovers.path} />
                <NavItem title="Progress" link={Routes.Progress.path} />
                <NavItem title="Tables" link={Routes.Tables.path} />
                <NavItem title="Tabs" link={Routes.Tabs.path} />
                <NavItem title="Toasts" link={Routes.Toasts.path} />
                <NavItem title="Tooltips" link={Routes.Tooltips.path} />
              </CollapsableNavItem> */}

              {/* <NavItem external title="Plugins" link="https://demo.themesberg.com/volt-pro-react/#/plugins/datatable" target="_blank" badgeText="Pro" icon={faChartPie} />

              <Dropdown.Divider className="my-3 border-indigo" />

              <CollapsableNavItem eventKey="documentation/" title="Getting Started" icon={faBook}>
                <NavItem title="Overview" link={Routes.DocsOverview.path} />
                <NavItem title="Download" link={Routes.DocsDownload.path} />
                <NavItem title="Quick Start" link={Routes.DocsQuickStart.path} />
                <NavItem title="License" link={Routes.DocsLicense.path} />
                <NavItem title="Folder Structure" link={Routes.DocsFolderStructure.path} />
                <NavItem title="Build Tools" link={Routes.DocsBuild.path} />
                <NavItem title="Changelog" link={Routes.DocsChangelog.path} />
              </CollapsableNavItem>
              
              <NavItem external title="Themesberg" link="https://themesberg.com" target="_blank" image={ThemesbergLogo} />
              <Button as={Link} to={Routes.Upgrade.path} variant="secondary" className="upgrade-to-pro"><FontAwesomeIcon icon={faRocket} className="me-1" /> Upgrade to Pro</Button> */}
            </Nav>
          </div>
        </SimpleBar>
      </CSSTransition>
    </>
  );
};
