var React = require('react');
var ReactDOM = require('react-dom');

Generator = require("./modules/contestGenerator").ContestGenerator;
Contest = require("./modules/contestComponents").ContestFrame;

if(isContest) {
  ReactDOM.render(
    <Contest contest={contest[lang]} lang={lang} />,
    document.getElementById('tl-contest')
  );
}else{
  ReactDOM.render(
    <Generator />,
    document.getElementById('tl-contestGenerator')
    );
}
