
import React from 'react';
import { Image } from '@themesberg/react-bootstrap';

import ReactLogo from "../assets/img/technologies/react-logo-transparent.svg";
import loadingEzeelink from "../assets/img/technologies/Double Ring-1s-303px.svg"

export default (props) => {

  const { show } = props;

  return (
    <div className={`preloader bg-soft flex-column justify-content-center align-items-center ${show ? "" : "show"}`}>
      <Image className="loader-element animate__animated animate__jackInTheBox" src={loadingEzeelink} height={80} />
    </div>
  );
};
