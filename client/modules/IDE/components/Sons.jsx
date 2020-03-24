import React from 'react';
import InlineSVG from 'react-inlinesvg';
import { Helmet } from 'react-helmet';

const elementosUrl = require('../../../images/elementosicon.svg');
// const playUrl = require('../../../images/play.svg');
const asteriskUrl = require('../../../images/p5-asterisk.svg');

const images = [('http://placehold.it/100x100/92DG15'), ('http://placehold.it/200x200/92DG15'),('http://placehold.it/150x150/92DG15'),('http://placehold.it/300x300/92DG15'),('http://placehold.it/100x100/92DG15'), ('http://placehold.it/200x200/92DG15'),('http://placehold.it/150x150/92DG15'),('http://placehold.it/300x300/92DG15'),];


function Sons(props) {
  return (
    <div className="about2__teste">
      <Helmet>
        <title>Editor da Escola de Inventor About</title>
      </Helmet>
      <div className="about2__teste">
        {/*<InlineSVG className="about2__teste" src={elementosUrl} />*/}
        {images.map(function(image, imageIndex){
      return <img key={ imageIndex } src={ image } />
     })}
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
    </div>
  );
}

export default Sons;
