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
import EzeeLogoChina from "../assets/icon/Logo_Ezeelink_vers_China.svg";
import ThemesbergLogo from "../assets/img/themesberg.svg";
import ReactHero from "../assets/img/technologies/react-hero-logo.svg";
import ProfilePicture from "../assets/img/team/profile-picture-3.jpg";
import { GetUserAccessMenu } from "../redux/ActionCreators/UserAccessMenuAction";
import { useDispatch, useSelector } from "react-redux";
import { getRole, getToken, language } from "../function/helpers";
import arrowDown from "../assets/img/icons/arrow_down.svg";
import arrowRight from "../assets/img/icons/arrow_right_white.png";

export default (props = {}) => {

  const location = useLocation();
  // console.log(location, "location");
  const dispatch = useDispatch()
  const history = useHistory()
  const access_token = getToken()
  const user_role = getRole()
  const { pathname } = location;
  const [show, setShow] = useState(false);
  const showClass = show ? "show" : "";
  const userAccessMenu = useSelector(state => state.userAccessMenuReducer.userAccessMenu)

  const onCollapse = () => setShow(!show);

  const CollapsableNavItem = (props) => {
    const { eventKey, title, url, icon, image, children = null } = props;
    // const defaultKey = pathname.indexOf(eventKey) !== -1 ? eventKey : "";
    const defaultKey = pathname.indexOf(url) !== -1 ? eventKey : "";

    // console.log(defaultKey, "defaultKey");
    // console.log(pathname, "pathname");
    // console.log(eventKey, "eventKey");
    // console.log(title, "title");
    // console.log(url, "url");

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
    dispatch(GetUserAccessMenu("/Account/GetUserAccess", user_role === "100" ? "ID" : (language === null ? 'EN' : language.flagName)))
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
                {/* <img src={language === null ? EzeeLogo : language.flagName === "CN" ? EzeeLogoChina : EzeeLogo} style={{width: 66, height: language === null ? 36 : language.flagName === "CN" ? 46 : 36, marginTop: 12}} alt=""/> */}
                <img src={user_role !== "102" || language !== "CN" ? EzeeLogo : EzeeLogoChina} style={{width: 66, height: user_role !== "102" || language !== "CN" ? 36 : 46, marginTop: 12}} alt=""/>
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
                      url={item.maccess_url}
                      // link={Routes.Transactions.path}
                      link={(item.id === 10) ? Routes.DashboardOverview.path : (item.id === 11) ? Routes.Transactions.path : (item.id === 14) ? Routes.DaftarAgen.path : (item.id === 12) ? Routes.NotFound.path : (item.id === 15) ? Routes.DaftarPartner.path : (item.id === 17) ? Routes.InvoiceVA.path : (item.id === 18) ? Routes.ListUser.path : (item.id === 20) ? Routes.ListPayment.path : (item.id === 22) ? Routes.RiwayatTopUp.path : (item.id === 23) ? Routes.InvoiceDisbursement.path : (item.id === 24) ? Routes.SubAccountTransfer.path : (item.id === 25) ? Routes.ListRiwayatSubAccountAdmin.path : (item.id === 26) ? Routes.DisbursementPage.path : (item.id === 27) ? Routes.SaldoPartnerMenu.path : (item.id === 28) ? Routes.UserDirectDebit.path : (item.id === 29) ? Routes.SaldoPartnerMenu.path : (item.id === 31) ? Routes.DisbursementPage.path : (item.id === 32) ? Routes.SubAccountTransfer.path : (item.id === 33) ? Routes.SettlementManual.path : (item.id === 34) ? Routes.RiwayatBalance.path : (item.id === 36) ? Routes.GetBalance.path : ""}
                    /> :
                    <CollapsableNavItem eventKey={item.label} key={item.id} title={item.label} image={item.icon} url={item.maccess_url}>
                      {
                        item.detail.map(item2 => {
                          return (
                            (item2.detail.length === 0) ?
                            <NavItem
                              key={item2.id}
                              title={item2.label}
                              // icon={faAngleRight}
                              // image={item2.icon} (item2.id === 1603) ? Routes.eWallet.path :
                              // link={(item2.id === 1601) ? Routes.RiwayatTransaksi.path : (item2.id === 1602) ? Routes.SaldoPartner.path : (item2.id === 1603) ? Routes.VaDanPaymentLinkAdmin.path : (item2.id === 1604) ? Routes.RiwayatDirectDebitAdmin.path : (item2.id === 1605) ? Routes.DisbursementAdmin.path : (item2.id === 1606) ? Routes.SubAccountAdmin.path : (item2.id === 1607) ? Routes.DisbursementTimeout.path : (item2.id === 1701) ? Routes.InvoiceVASubMenu.path : (item2.id === 1702) ? Routes.InvoiceDisbursementSubMenu.path : (item2.id === 1901) ? Routes.ReNotifyVA.path : (item2.id === 2401) ? Routes.InfoSaldoDanMutasi.path : (item2.id === 2403) ? Routes.ListRiwayatSubAccount.path : (item2.id === 2602) ? Routes.RiwayatDisbursement.path : (item2.id === 3001) ? Routes.VaDanPaymentLink.path : (item2.id === 3002) ? Routes.RiwayatDirectDebit.path : (item2.id === 3003) ? Routes.Disbursement.path : (item2.id === 3004) ? Routes.SubAccount.path : (item2.id === 9901) ? Routes.NotFound.path : (item2.id === 9902) ? Routes.NotFound.path : ""}
                              link={(item2.id === 1101) ? Routes.VaDanPaymentLink.path : (item2.id === 1102) ? Routes.Disbursement.path : (item2.id === 1103) ? Routes.eWallet.path : (item2.id === 1104) ? Routes.RiwayatDirectDebit.path : (item2.id === 1105) ? Routes.SubAccount.path : (item2.id === 1108) ? Routes.RiwayatVAUSDPartner.path : (item2.id === 1106) ? Routes.QrisTransaksi.path : (item2.id === 1107) ? Routes.TransaksiQrisApi.path : (item2.id === 1601) ? Routes.VaDanPaymentLinkAdmin.path : (item2.id === 1602) ? Routes.DisbursementAdmin.path : (item2.id === 1603) ? Routes.eWalletAdmin.path : (item2.id === 1604) ? Routes.RiwayatDirectDebitAdmin.path : (item2.id === 1605) ? Routes.SubAccountAdmin.path : (item2.id === 1606) ? Routes.DisbursementTimeout.path : (item2.id === 1609) ? Routes.QrisTransaksiAdmin.path : (item2.id === 1610) ? Routes.TransaksiQrisApiAdmin.path : (item2.id === 1611) ? Routes.QrisIssuerAdmin.path : (item2.id === 1608) ? Routes.RiwayatVAUSDAdmin.path : (item2.id === 1701) ? Routes.Settlement.path : (item2.id === 1702) ? Routes.SettlementManual.path : (item2.id === 1703) ? Routes.ExcludeSettlementManual.path : (item2.id === 1704) ? Routes.SettlementVAUSDAdmin.path : (item2.id === 1705) ? Routes.QrisSettlement.path : (item2.id === 1706) ? Routes.UnsettledTransaction.path : (item2.id === 1901) ? Routes.ReNotifyVA.path : (item2.id === 1902) ? Routes.ReNotifyEwallet.path : (item2.id === 1903) ? Routes.ReNotifyQris.path : (item2.id === 2301) ? Routes.InvoiceDisbursementSubMenu.path : (item2.id === 2302) ? Routes.InvoiceVASubMenu.path : (item2.id === 2303) ? Routes.TransaksiTopup.path : (item2.id === 2304) ? Routes.RiwayatInvoice.path : (item2.id === 2401) ? Routes.InfoSaldoDanMutasi.path : (item2.id === 2403) ? Routes.ListRiwayatSubAccount.path : (item2.id === 3501) ? Routes.VAUSD.path : (item2.id === 3502) ? Routes.RiwayatFileSFTP.path : (item2.id === 3701) ? Routes.DaftarMerchantQris.path : (item2.id === 3702) ? Routes.PengaturanKasir.path : (item2.id === 3801) ? Routes.ReportLogRintis.path : (item2.id === 9901) ? Routes.NotFound.path : (item2.id === 9902) ? Routes.NotFound.path : ""}
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
