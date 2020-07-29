import React from 'react';
import InlineSVG from 'react-inlinesvg';
import { Helmet } from 'react-helmet';

const squareLogoUrl = require('../../../images/p5js-square-logo.svg');
// const playUrl = require('../../../images/play.svg');
const asteriskUrl = require('../../../images/p5-asterisk.svg');


function About(props) {
  return (
    <div className="about__content">
      <Helmet>
        <title>InventorBox About</title>
      </Helmet>
      <div className="about__content-column">
        <InlineSVG className="about__logo" src={squareLogoUrl} alt="p5js Square Logo" />
        {/* Video button to hello p5 video page */}
        {/* <p className="about__play-video">
          <a
            href="http://hello.p5js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InlineSVG className="about__play-video-button" src={playUrl} alt="Play Hello Video" />
          Play hello! video</a>
        </p>  */}
      </div>
      <div className="about__content-column">
        <h3 className="about__content-column-title">Este Site</h3>
        <p className="about__content-column-list">
          <a
            href="https://escoladeinventor.com.br/blog/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InlineSVG className="about__content-column-asterisk" src={asteriskUrl} alt="p5 asterisk" />
          Subindo um teste de modificação
          </a>
        </p>
        <p className="about__content-column-list">
          <a
            href="https://escoladeinventor.com.br/blog/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InlineSVG className="about__content-column-asterisk" src={asteriskUrl} alt="p5 asterisk" />
          O que é Este Site?
          </a>
        </p>
        <p className="about__content-column-list">
          <a
            href="https://escoladeinventor.com.br/blog/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InlineSVG className="about__content-column-asterisk" src={asteriskUrl} alt="p5 asterisk" />
          O que é Maker?
          </a>
        </p>
      </div>
      <div className="about__content-column">
        <h3 className="about__content-column-title">Recursos</h3>
        <p className="about__content-column-list">
          <a
            href="https://tableless.github.io/iniciantes/manual/js/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InlineSVG className="about__content-column-asterisk" src={asteriskUrl} alt="p5 asterisk" />
          Exemplos
          </a>
        </p>
        <p className="about__content-column-list">
          <a
            href="https://escoladeinventor.com.br/blog/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InlineSVG className="about__content-column-asterisk" src={asteriskUrl} alt="p5 asterisk" />
          Aprenda
          </a>
        </p>
        <p className="about__content-column-list">
          <a
            href="https://discourse.processing.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InlineSVG className="about__content-column-asterisk" src={asteriskUrl} alt="p5 asterisk" />
          Comandos
          </a>
        </p>
      </div>
      <div className="about__footer">
        <p className="about__footer-list">
          <a
            href="https://escoladeinventor.com.br/"
            target="_blank"
            rel="noopener noreferrer"
          >Escola de Inventor
          </a>
        </p>
        <p className="about__footer-list">
          <a
            href="https://www.facebook.com/escoladeinventor/"
            target="_blank"
            rel="noopener noreferrer"
          >Facebook
          </a>
        </p>
        <p className="about__footer-list">
          <a
            href="https://www.instagram.com/escoladeinventor/"
            target="_blank"
            rel="noopener noreferrer"
          >Instagram
          </a>
        </p>
      </div>
    </div>
  );
}

export default About;
