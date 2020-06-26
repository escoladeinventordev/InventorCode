import React from 'react';
import InlineSVG from 'react-inlinesvg';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router';

const elementosUrl = require('../../../images/elementosicon.svg');
// const playUrl = require('../../../images/play.svg');
const asteriskUrl = require('../../../images/p5-asterisk.svg');
const audioUrl = require('../../../images/new/t-audio.svg');
const codeUrl = require('../../../images/new/t-code.svg');
const corUrl = require('../../../images/new/t-cor.svg');
const imagesUrl = require('../../../images/new/t-images.svg');
const tlogoUrl = require('../../../images/new/t-logo.svg');
const musicaUrl = require('../../../images/new/t-musica.svg');
const searchUrl = require('../../../images/new/search.svg');
const sonsUrl = require('../../../images/new/sons.svg');
const copyUrl = require('../../../images/new/copy.svg');
const bugUrl = require('../../../images/new/bug.svg');


//const images = [(asteriskUrl), (elementosUrl),];

function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}

const getFileName = (name) => {
  let split = name.split(".");
  split.pop();
  return split.join(".");
}

const images = importAll(require.context('./images', false, /\.(png|jpe?g|svg)$/));

let pagina = 0;
let por_pagina = 16;
let total_paginas = Math.ceil(Object.keys(images) / por_pagina);

const proximaPagina = (p) => {
  console.log('proximaPagina',p);
  pagina = p+1;
}

const paginaAnterior = (p) => {
  pagina = p-1;
}

function Personagens(props) {

  let imageList = () => {
    let retorno = <div>Nenhuma imagem disponível</div>

    if(Object.keys(images).length > 0){
      let list = [];
      for(let i in images){
        list.push(
          <div className="box" key={"image_"+i} onClick={() => {copyToClipboard(getFileName(i))}} style={{cursor:'pointer'}}>
            <img src={images[i]} alt={i} style={{width:100,height:100}} />
            <p>{getFileName(i)}</p>
          </div>
        )
      }

      let pp = por_pagina/2;
      let p1 = list.slice(pp*pagina,pp*(pagina+1));
      let p2 = list.slice(pp*(pagina+1),pp*(pagina+2));

      retorno = <div className="book-content">
      <div className="w50">
        <div className="search d-flex a-center">
          <input type="text" placeholder="Buscar" />
          <button className="btn-search">
            <InlineSVG src={searchUrl} alt="" />
          </button>
        </div>
        <div className="list">
          {p1}
        </div>
      </div>

      <div className="w50 right">
        <div className="buttons d-flex jc-end">
          <button className="btn" onClick={() => {paginaAnterior(pagina)}}>Anterior</button>
          <button className="btn" onClick={() => {proximaPagina(pagina)}}>Proximo</button>
        </div>
        <div className="list">
          {p2}
        </div>
      </div>
    </div> 
    }
    return retorno;
  }

  const copyToClipboard = (text) => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  return (
    <div className="bg-black">
        
    <div className="book">
      <div className="book-tabs">
        <div className="tab active">
        <Link to="/personagens"><span>Sprite</span></Link>
          <InlineSVG src={tlogoUrl} alt="" />
        </div>
        <div className="tab">
        <Link to="/fundos"><span>Fundos</span></Link>
          <InlineSVG src={imagesUrl} alt="" />
        </div>
        <div className="tabdn">
          <span>Tab 3</span>
          <InlineSVG src={corUrl} alt="" />
        </div>
        <div className="tab">
        <Link to="/sons"><span>Sons</span></Link>
          <InlineSVG src={audioUrl} alt="" />
        </div>
        <div className="tabdn">
          <span>Sons</span>
          <InlineSVG src={musicaUrl} alt="" />
        </div>
        <div className="tabdn">
          <span>Comandos</span>
          <InlineSVG src={codeUrl} alt="" />
        </div> 
      </div>
      {imageList()}

    </div>
  </div>

  );
}

export default Personagens;
