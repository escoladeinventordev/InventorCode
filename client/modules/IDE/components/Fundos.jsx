import React, {useState} from 'react';
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

const images = importAll(require.context('./background', false, /\.(png|jpe?g|svg)$/));



const copyToClipboard = (text) => {
  const el = document.createElement('textarea');
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}

function Fundos(props) {

  const [pagina, setPagina] = useState(0);
  const [busca,setBusca] = useState('');

  function escapeRegex(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  }

  let filtered = images;
  if(busca != ''){
    filtered = {};
    for(let i in images){
      if(i.match(new RegExp(escapeRegex(busca), 'g'))){
        filtered[i] = images[i];
      }
    }
  }

  let por_pagina = 16;
  let total_paginas = Math.ceil(Object.keys(filtered).length / por_pagina);

  const proximaPagina = (p) => {
    if(pagina <= total_paginas-2 && total_paginas > 1){
      setPagina(p+2);
    }
  }

  const paginaAnterior = (p) => {
    if(pagina > 0){
      setPagina(p-2);
    }
  }
  
  let imageList = () => {
    let retorno = <div></div>

    let list = [];
    if(Object.keys(filtered).length > 0){
      for(let i in filtered){
        list.push(
          <div className="box" key={"image_"+i} onClick={() => {copyToClipboard(getFileName(i))}} style={{cursor:'pointer'}}>
            <img src={filtered[i]} alt={i} style={{width:100,height:100}} />
            <p>{getFileName(i)}</p>
          </div>
        )
      }
    }

    let pp = por_pagina/2;
    let p1 = list.slice(pp*pagina,pp*(pagina+1));
    let p2 = list.slice(pp*(pagina+1),pp*(pagina+2));

    if(Object.keys(filtered).length <= 0){
      p1 = <div>Nenhuma imagem encontrada</div>
    }

    retorno = <div className="book-content">
      <div className="w50">
        <div className="search d-flex a-center">
          <input type="text" placeholder="Buscar" value={busca} onChange={(event) => {
            setBusca(event.target.value);
            setPagina(0);
          }}/>
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
    
    return retorno;
  }

  return (
    <div className="bg-black">
        
    <div className="book">
      <div className="book-tabs">
        <div className="tab">
          <Link to="/personagens"><span>Personagens</span></Link> 
             
          <InlineSVG src={tlogoUrl} alt="" />
        </div>
        <div className="tab active">
        <Link to="/fundos"><span>Fundos</span></Link>
          <InlineSVG src={imagesUrl} alt="" />
        </div>
        <div className="tab">
        <Link to="/musicas"><span>Musicas</span></Link>
          <InlineSVG src={corUrl} alt="" />
        </div>
        <div className="tabdn">
        <Link to="/personagens"><span>Sons</span></Link>
          <InlineSVG src={audioUrl} alt="" />
        </div>
        <div className="tab">
        <Link to="/sons"><span>Sons</span></Link>
          <InlineSVG src={audioUrl} alt="" />
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

export default Fundos;
