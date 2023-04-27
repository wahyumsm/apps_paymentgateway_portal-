import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import { Routes } from "../routes";

// pages
import Presentation from "./Presentation";
import Upgrade from "./Upgrade";
import DashboardOverview from "./dashboard/DashboardOverview";
import DaftarPartner from './DaftarPartner/DaftarPartner';
import DaftarAgen from './DaftarAgen/DaftarAgen';
import DetailAkun from './DetailAkun/DetailAkun';
import RiwayatTransaksi from './RiwayatTransaksi/RiwayatTransaksi';
import Transactions from "./Transactions";
import Settings from "./Settings";
import BootstrapTables from "./tables/BootstrapTables";
import Signin from "./examples/Signin";
import Signup from "./examples/Signup";
import ForgotPassword from "./examples/ForgotPassword";
import ResetPassword from "./examples/ResetPassword";
import Lock from "./examples/Lock";
import NotFoundPage from "./examples/NotFound";
import ServerError from "./examples/ServerError";
import ListPayment from "./PaymentLink/ListPayment"
import DetailPayment from './PaymentLink/DetailPayment';
import AddPayment from './PaymentLink/AddPayment';
import CustomDesignPayment from './PaymentLink/CustomDesignPayment';
import ListRiwayatSubAccount from './RiwayatSubAccount/ListRiwayatSubAccount';

// documentation pages
import DocsOverview from "./documentation/DocsOverview";
import DocsDownload from "./documentation/DocsDownload";
import DocsQuickStart from "./documentation/DocsQuickStart";
import DocsLicense from "./documentation/DocsLicense";
import DocsFolderStructure from "./documentation/DocsFolderStructure";
import DocsBuild from "./documentation/DocsBuild";
import DocsChangelog from "./documentation/DocsChangelog";

// components
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Preloader from "../components/Preloader";

import Accordion from "./components/Accordion";
import Alerts from "./components/Alerts";
import Badges from "./components/Badges";
import Breadcrumbs from "./components/Breadcrumbs";
import Buttons from "./components/Buttons";
import Forms from "./components/Forms";
import Modals from "./components/Modals";
import Navs from "./components/Navs";
import Navbars from "./components/Navbars";
import Pagination from "./components/Pagination";
import Popovers from "./components/Popovers";
import Progress from "./components/Progress";
import Tables from "./components/Tables";
import Tabs from "./components/Tabs";
import Tooltips from "./components/Tooltips";
import Toasts from "./components/Toasts";
import TambahAgen from './DaftarAgen/TambahAgen';
import DetailAgen from './DaftarAgen/DetailAgen';
import TambahPartner from './DaftarPartner/TambahPartner';
import DetailPartner from './DaftarPartner/DetailPartner';
import EditPartner from './DaftarPartner/EditPartner';
import EditAgen from './DaftarAgen/EditAgen';
import ListUser from './ManagementUser/ListUser';
import UpdateUser from './ManagementUser/UpdateUser';
import AddUser from './ManagementUser/AddUser';
import ListMenuAccess from './ManagementUser/ListMenuAccess';
import RiwayatTopUp from './TopUp/RiwayatTopUp';
import InvoiceVA from './Invoice/InvoiceVA';
import InvoiceDisbursement from './Invoice/InvoiceDisbursement';
import DetailSettlement from './RiwayatTransaksi/DetailSettlement';
import ReNotifyVA from './HelpDesk/ReNotifyVA';
import DisbursementReport from './Disbursement/DishbursmentReport';
import AlokasiSaldo from './TopUp/AlokasiSaldo';
import InfoSaldoDanMutasi from './RiwayatSubAccount/InfoSaldoDanMutasi';
import TransferSubAccount from './RiwayatSubAccount/TransferSubAccount';
import SaldoPartner from './RiwayatTransaksi/SaldoPartner';
import DisbursementPage from './Disbursement/DisbursementPage';
import EWallet from './RiwayatTransaksi/EWallet';

const RouteWithLoader = ({ component: Component, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Route {...rest} render={props => ( <> <Preloader show={loaded ? false : true} /> <Component {...props} /> </> ) } />
  );
};

const RouteWithSidebar = ({ component: Component, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const localStorageIsSettingsVisible = () => {
    return localStorage.getItem('settingsVisible') === 'false' ? false : true
  }

  const [showSettings, setShowSettings] = useState(localStorageIsSettingsVisible);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    localStorage.setItem('settingsVisible', !showSettings);
  }

  return (
    <Route {...rest} render={props => (
      <>
        <Preloader show={loaded ? false : true} />
        <Sidebar />

        <main className="content">
          <Navbar />
          <Component {...props} />
          {/* <Footer toggleSettings={toggleSettings} showSettings={showSettings} /> */}
        </main>
      </>
    )}
    />
  );
};

export default () => (
  <Switch>
    {/* <RouteWithLoader exact path={Routes.Presentation.path} component={Presentation} /> */}
    <RouteWithLoader exact path={Routes.Login.path} component={Signin} />
    {/* <RouteWithLoader exact path={Routes.Signup.path} component={Signup} /> */}
    <RouteWithLoader exact path={Routes.ForgotPassword.path} component={ForgotPassword} />
    <RouteWithLoader exact path={Routes.ResetPassword.path} component={ResetPassword} />
    {/* <RouteWithLoader exact path={Routes.Lock.path} component={Lock} /> */}
    <RouteWithLoader exact path={Routes.NotFound.path} component={NotFoundPage} />
    {/* <RouteWithLoader exact path={Routes.ServerError.path} component={ServerError} /> */}

    {/* pages */}
    <RouteWithSidebar exact path={Routes.DashboardOverview.path} component={DashboardOverview} />
    {/* <RouteWithSidebar exact path={Routes.Upgrade.path} component={Upgrade} /> */}
    <RouteWithSidebar exact path={Routes.Transactions.path} component={Transactions} />
    <RouteWithSidebar exact path={Routes.RiwayatTransaksi.path} component={RiwayatTransaksi} />
    <RouteWithSidebar exact path={Routes.SaldoPartner.path} component={SaldoPartner} />
    <RouteWithSidebar exact path={Routes.DetailSettlement.path} component={DetailSettlement} />
    <RouteWithSidebar exact path={Routes.DaftarPartner.path} component={DaftarPartner}/>
    <RouteWithSidebar exact path={Routes.TambahPartner.path} component={TambahPartner}/>
    <RouteWithSidebar exact path={Routes.DaftarAgen.path} component={DaftarAgen}/>
    <RouteWithSidebar exact path={Routes.TambahAgen.path} component={TambahAgen}/>
    <RouteWithSidebar exact path={Routes.DetailAgen.path} component={DetailAgen}/>
    <RouteWithSidebar exact path={Routes.EditAgen.path} component={EditAgen}/>
    <RouteWithSidebar exact path={Routes.DetailPartner.path} component={DetailPartner}/>
    <RouteWithSidebar exact path={Routes.EditPartner.path} component={EditPartner}/>
    <RouteWithSidebar exact path={Routes.DetailAkun.path} component={DetailAkun}/>
    <RouteWithSidebar exact path={Routes.ListUser.path} component={ListUser}/>
    <RouteWithSidebar exact path={Routes.UpdateUser.path} component={UpdateUser} />
    <RouteWithSidebar exact path={Routes.ListMenuAccess.path} component={ListMenuAccess}/>
    <RouteWithSidebar exact path={Routes.RiwayatTopUp.path} component={RiwayatTopUp}/>
    <RouteWithSidebar exact path={Routes.AlokasiSaldo.path} component={AlokasiSaldo}/>
    <RouteWithSidebar exact path={Routes.InvoiceVA.path} component={InvoiceVA}/>
    <RouteWithSidebar exact path={Routes.InvoiceDisbursement.path} component={InvoiceDisbursement}/>
    <RouteWithSidebar exact path={Routes.ReNotifyVA.path} component={ReNotifyVA}/>
    <RouteWithSidebar exact path={Routes.DisbursementPage.path} component={DisbursementPage}/>
    <RouteWithSidebar exact path={Routes.RiwayatDisbursement.path} component={DisbursementReport}/>
    <RouteWithSidebar exact path={Routes.DisbursementReport.path} component={DisbursementReport}/>
    {/* <RouteWithSidebar exact path={Routes.Settings.path} component={Settings} /> */}
    {/* <RouteWithSidebar exact path={Routes.BootstrapTables.path} component={BootstrapTables} /> */}
    <RouteWithSidebar exact path={Routes.AddUser.path} component={AddUser}/>
    <RouteWithSidebar exact path={Routes.ListPayment.path} component={ListPayment} />
    <RouteWithSidebar exact path={Routes.DetailPayment.path} component={DetailPayment} />
    <RouteWithSidebar exact path={Routes.AddPayment.path} component={AddPayment} />
    <RouteWithSidebar exact path={Routes.CustomDesignPayment.path} component={CustomDesignPayment} />
    <RouteWithSidebar exact path={Routes.ListRiwayatSubAccountAdmin.path} component={ListRiwayatSubAccount} />
    <RouteWithSidebar exact path={Routes.ListRiwayatSubAccount.path} component={ListRiwayatSubAccount} />
    <RouteWithSidebar exact path={Routes.InfoSaldoDanMutasi.path} component={InfoSaldoDanMutasi} />
    <RouteWithSidebar exact path={Routes.TransferSubAccount.path} component={TransferSubAccount} />
    <RouteWithSidebar exact path={Routes.eWallet.path} component={EWallet} />

    {/* components */}
    {/* <RouteWithSidebar exact path={Routes.Accordions.path} component={Accordion} /> */}
    {/* <RouteWithSidebar exact path={Routes.Alerts.path} component={Alerts} /> */}
    {/* <RouteWithSidebar exact path={Routes.Badges.path} component={Badges} /> */}
    {/* <RouteWithSidebar exact path={Routes.Breadcrumbs.path} component={Breadcrumbs} /> */}
    {/* <RouteWithSidebar exact path={Routes.Buttons.path} component={Buttons} /> */}
    {/* <RouteWithSidebar exact path={Routes.Forms.path} component={Forms} /> */}
    {/* <RouteWithSidebar exact path={Routes.Modals.path} component={Modals} /> */}
    {/* <RouteWithSidebar exact path={Routes.Navs.path} component={Navs} /> */}
    {/* <RouteWithSidebar exact path={Routes.Navbars.path} component={Navbars} /> */}
    {/* <RouteWithSidebar exact path={Routes.Pagination.path} component={Pagination} /> */}
    {/* <RouteWithSidebar exact path={Routes.Popovers.path} component={Popovers} /> */}
    {/* <RouteWithSidebar exact path={Routes.Progress.path} component={Progress} /> */}
    {/* <RouteWithSidebar exact path={Routes.Tables.path} component={Tables} /> */}
    {/* <RouteWithSidebar exact path={Routes.Tabs.path} component={Tabs} /> */}
    {/* <RouteWithSidebar exact path={Routes.Tooltips.path} component={Tooltips} /> */}
    {/* <RouteWithSidebar exact path={Routes.Toasts.path} component={Toasts} /> */}

    {/* documentation */}
    {/* <RouteWithSidebar exact path={Routes.DocsOverview.path} component={DocsOverview} /> */}
    {/* <RouteWithSidebar exact path={Routes.DocsDownload.path} component={DocsDownload} /> */}
    {/* <RouteWithSidebar exact path={Routes.DocsQuickStart.path} component={DocsQuickStart} /> */}
    {/* <RouteWithSidebar exact path={Routes.DocsLicense.path} component={DocsLicense} /> */}
    {/* <RouteWithSidebar exact path={Routes.DocsFolderStructure.path} component={DocsFolderStructure} /> */}
    {/* <RouteWithSidebar exact path={Routes.DocsBuild.path} component={DocsBuild} /> */}
    {/* <RouteWithSidebar exact path={Routes.DocsChangelog.path} component={DocsChangelog} /> */}

    <Redirect to={Routes.NotFound.path} />
  </Switch>
);
