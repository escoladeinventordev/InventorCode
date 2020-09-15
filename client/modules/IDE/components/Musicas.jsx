import React, {useState} from 'react';
import InlineSVG from 'react-inlinesvg';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router';
import ReactAudioPlayer from 'react-audio-player';


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


const images = [(asteriskUrl), (elementosUrl),];

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

const audios = importAll(require.context('./music', false, /\.(mp3|wav|ogg)$/));
let audios_ref = {};

const copyToClipboard = (text) => {
  const el = document.createElement('textarea');
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}

function Musicas(props) {

  const [pagina, setPagina] = useState(0);
  const [busca,setBusca] = useState('');

  function escapeRegex(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  }

  let filtered = audios;
  if(busca != ''){
    filtered = {};
    for(let i in audios){
      if(i.match(new RegExp(escapeRegex(busca), 'g'))){
        filtered[i] = audios[i];
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

  let audioList = () => {
    let retorno = <div></div>

    let list = [];
    if(Object.keys(filtered).length > 0){
      for(let i in filtered){
        list.push(
          <div className="box" key={"image_"+i}>
            <div style={{width:100,height:100,overflow:'hidden'}}>
              <button onClick={() => {
                if(audios_ref[i] && audios_ref[i] != null){
                  if(audios_ref[i].audioEl.current){
                    audios_ref[i].audioEl.current.play();
                  }
                }
              }}>
                <img src={audioUrl} style={{width:80,height:80}}/>
              </button>
              <ReactAudioPlayer
                  src={filtered[i]}
                  ref={(element) => { audios_ref[i] = element }}
              />
            </div>
            <p onClick={() => {copyToClipboard(getFileName(i))}} style={{cursor:'pointer'}}>{getFileName(i)}</p>
          </div>
        )
      }
    }

    let pp = por_pagina/2;
    let p1 = list.slice(pp*pagina,pp*(pagina+1));
    let p2 = list.slice(pp*(pagina+1),pp*(pagina+2));

    if(Object.keys(filtered).length <= 0){
      p1 = <div>Nenhum áudio encontrado</div>
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
        <div className="tab">
        <Link to="/fundos"><span>Fundos</span></Link>
          <InlineSVG src={imagesUrl} alt="" />
        </div>
        <div className="tab active">
        <Link to="/musicas"><span>Músicas</span></Link>
          <InlineSVG src={corUrl} alt="" />
        </div>
        <div className="tabdn">
          <span>Sons</span>
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

      {audioList()}

    </div>

  </div>

  );
}

export default Musicas;
