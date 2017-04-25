var React = require('react');
var ReactDOM = require('react-dom');
var Translations = require("./translations");

function isValidEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};


/* QUESTION FORM ELEMENTS */
var ContestRadioButton = React.createClass({
  render: function() {
  return (
  <label className={this.props.selected ? "radioLabel selected" : "radioLabel"} >
  <input 
  id={this.props.id + "a" + this.props.index} 
  name={this.props.id} 
  type="radio" 
  onChange={this.props.handleAnswer}
  value={"a" + this.props.index} />
  {this.props.answer}
  </label>
  );
}
});

var FormElements = React.createClass({
  getInitialState: function() {
    return ({
      selected: -1
    })
  },
  handleAnswer: function(event) {
    this.props.handleAnswer(event);
    this.setState({
      selected: parseInt(event.target.value.replace("a",""))
    })
  },
  render: function() {
    var elements = [];
    this.props.question.answers.map(function(a, index){
      elements.push(<ContestRadioButton 
        id={this.props.id} 
        selected={this.state.selected == index}
        key={index} 
        index={index} 
        answer={a} 
        handleAnswer={this.handleAnswer} />);
    }, this);
  if (elements.length === 0) {
        // This is not a 1X2 question
        elements = <textarea 
        name={this.props.id}
        placeholder={Translations.motivering[this.props.lang]}
        onChange={this.props.handleAnswer} />;
      }
      return (
      <div>
      {elements}
      </div>
      );
}
});

var NextButton = React.createClass({
  render: function() {
  return (
  <a href="#" className={this.props.nextButtonEnabled ? "nextBtn fading visible" : "nextBtn fading" } onClick={this.props.handleNext}>{this.props.string}</a>
  );
}
});

var Question = React.createClass({
  getInitialState: function() {
    return ({
      nextButtonEnabled: false
    });
  },
  handleAnswer: function(e) {
    this.setState({
      nextButtonEnabled: e.target.value !== ""
    })
  },
  render: function() {
    var hiddenOrNot = "active";
    if (this.props.activeQuestion > this.props.id) {
    hiddenOrNot = "hiddenLeft";
  }else if (this.props.activeQuestion < this.props.id) {
    hiddenOrNot = "hiddenRight";
  }
  return (
  <li id={"q" + this.props.id} className={hiddenOrNot}>
  <img src={"q" + this.props.id + ".jpg"} />
  {this.props.question.question}
  <FormElements 
  id={"q" + this.props.id} 
  question={this.props.question} 
  handleAnswer={this.handleAnswer} 
  lang={this.props.lang} />
  {this.props.id !== 0 ? <NextButton 
    nextButtonEnabled={this.state.nextButtonEnabled} 
    handleNext={this.props.handlePrev}
    lang={this.props.lang} 
    string={Translations.prev[this.props.lang]} /> : null}
    <NextButton 
    nextButtonEnabled={this.state.nextButtonEnabled} 
    handleNext={this.props.handleNext}
    lang={this.props.lang}
    string={Translations.next[this.props.lang]} />
    </li>
    );
  } 
});

var SubmitBox = React.createClass({
  getInitialState: function() {
  return ({
    pristine: true,
    firstNameIsValid: false,
    lastNameIsValid: false,
    genderIsValid: false,
    ageIsValid: false,
    postNummerIsValid: false,
    emailIsValid: false,
    acceptIsValid: true
  })
},
handleClick: function(event) {
  event.preventDefault();
  switch (event.target.id) {
    case "submit":
    if(this.checkForm()) {
      this.props.handleSubmit();          
    }
    break;
    default:
    this.props.showModal();
    break;
  }
},
checkValid: function(event) {
  switch(event.target.id) {
    case "firstName":
    this.setState({
      firstNameIsValid: (event.target.value != "")
    });
    break;
    case "lastName":
    this.setState({
      lastNameIsValid: (event.target.value != "")
    });
    break;
    case "gender":
    this.setState({
      genderIsValid: (event.target.value != "")
    });
    break;
    case "age":
    this.setState({
      ageIsValid: (event.target.value != "")
    });
    break;
    case "postNummer":
    this.setState({
      postNummerIsValid: (event.target.value != "")
    });
    break;
    case "email":
    this.setState({
      emailIsValid: isValidEmail(event.target.value)
    });
    break;
    case "accept":
    this.setState({
      acceptIsValid: event.target.checked
    });
    break;
  }
},
checkForm: function() {
  this.setState({
    pristine: false
  })
  if (this.props.lang == "NO" && !this.state.postNummerIsValid && !this.state.genderIsValid && !this.state.ageIsValid) {
    return false;
  }
return this.state.firstNameIsValid && this.state.lastNameIsValid && this.state.emailIsValid && this.state.acceptIsValid;
},
render: function() {
    var hiddenOrNot = "active";
    if (this.props.activeQuestion > this.props.id) {
      hiddenOrNot = "hiddenLeft";
    }else if (this.props.activeQuestion < this.props.id) {
      hiddenOrNot = "hiddenRight";
    }
    return (
      <li id={"q" + this.props.id} className={hiddenOrNot}>
      <input id="country" type="hidden" name="country" value={this.props.lang} />

      <label className="info">{Translations.firstName[this.props.lang]}</label>
      <span className={!this.state.firstNameIsValid && !this.state.pristine ? "alertBox fading visible" : "alertBox fading"}>{Translations.validateFirstName[this.props.lang]}</span>
      <input id="firstName" onChange={this.checkValid} type="text" placeholder="" name="firstName" />

      <label className="info">{Translations.lastName[this.props.lang]}</label>
      <span className={!this.state.lastNameIsValid && !this.state.pristine ? "alertBox fading visible" : "alertBox fading"}>{Translations.validateLastName[this.props.lang]}</span>
      <input id="lastName" onChange={this.checkValid} type="text" placeholder="" name="lastName" />

      {this.props.lang == "NO" ? <label className="info">{Translations.gender[this.props.lang]}</label> : null}
      {this.props.lang == "NO" ? <span className={!this.state.genderIsValid && !this.state.pristine ? "alertBox fading visible" : "alertBox fading"}>{Translations.validateGender[this.props.lang]}</span> : null}
      {this.props.lang == "NO" ? <input id="gender" onChange={this.checkValid} type="text" placeholder="" name="gender" /> : null}

      {this.props.lang == "NO" ? <label className="info">{Translations.age[this.props.lang]}</label> : null}
      {this.props.lang == "NO" ? <span className={!this.state.ageIsValid && !this.state.pristine ? "alertBox fading visible" : "alertBox fading"}>{Translations.validateAge[this.props.lang]}</span> : null}
      {this.props.lang == "NO" ? <input id="age" onChange={this.checkValid} type="text" placeholder="" name="age" /> : null}

      {this.props.lang == "NO" ? <label className="info">{Translations.postNummer[this.props.lang]}</label> : null}
      {this.props.lang == "NO" ? <span className={!this.state.postNummerIsValid && !this.state.pristine ? "alertBox fading visible" : "alertBox fading"}>{Translations.validatePostNummer[this.props.lang]}</span> : null}
      {this.props.lang == "NO" ? <input id="postNummer" onChange={this.checkValid} type="text" placeholder="" name="postNummer" /> : null}

      <label className="info">{Translations.email[this.props.lang]}</label>
      <span className={!this.state.emailIsValid && !this.state.pristine ? "alertBox fading visible" : "alertBox fading"}>{Translations.validateEmail[this.props.lang]}</span>
      <input id="email" ref="email" onChange={this.checkValid} type="email" placeholder="" name="email" />

      <p className="left">
      <span className={!this.state.acceptIsValid&& !this.state.pristine  ? "alertBox fading visible" : "alertBox fading"}>{Translations.validateAccept[this.props.lang]}</span>
      <input id="accept" ref="accept" onChange={this.checkValid} style={{display:"inline-block !important"}} type="checkbox" defaultChecked />{Translations.godkanner[this.props.lang][0]}<a id="villkor" href="#" onClick={this.handleClick}>{Translations.godkanner[this.props.lang][1]}</a>.<br />
      <input id="newsletter" name="newsletter" style={{display:"inline-block !important"}} type="checkbox" defaultChecked />{Translations.jatackclient[this.props.lang][0] + this.props.contest.client + Translations.jatackclient[this.props.lang][1]} <br />
      <input id="newsletterTL" name="newsletterTL" style={{display:"inline-block !important"}} type="checkbox" defaultChecked />{Translations.jatack[this.props.lang]}</p>

      <label className="nextBtn">
      {Translations.skicka[this.props.lang]}
      <input id="submit" type="submit" onClick={this.handleClick} className="fading" />
      </label>
      </li>
    );
  } 
});

var StatusPage = React.createClass({
  render: function() {
    var statusMessage = [];
    if (this.props.response != null) {
      if (this.props.response.success != null){
        statusMessage.push(<h2 key="h2">{Translations.tack_h1[this.props.lang]}</h2>);

        Translations.tack_p[this.props.lang].map(function(text, i){
          statusMessage.push(<p key={"p" + i}>{text}</p>);
        }, this);
        Translations.vinnaren[this.props.lang].map(function(text, i){
          statusMessage.push(<p key={"v" + i}>{text}{this.props.week}.</p>);
        }, this);
        Translations.lyckatill[this.props.lang].map(function(text, i){
          statusMessage.push(<p key={"l" + i}><b>{text}</b></p>);
        }, this);
      }else{
        statusMessage.push(<h2 key="h2">{Translations.existing_h1[this.props.lang]}</h2>);

        Translations.existing_p[this.props.lang].map(function(text, i){
          statusMessage.push(<p key={"p" +i}>{text}</p>);
        }, this);
        Translations.vinnaren[this.props.lang].map(function(text, i){
          statusMessage.push(<p key={"v" + i}>{text}</p>);
        }, this);
        Translations.lyckatill[this.props.lang].map(function(text, i){
          statusMessage.push(<p key={"l" + i}><b>{text}</b></p>);
        }, this);
      }
    }
    var hiddenOrNot = "active";
    if (this.props.activeQuestion > this.props.id) {
      hiddenOrNot = "hiddenLeft";
    }else if (this.props.activeQuestion < this.props.id) {
      hiddenOrNot = "hiddenRight";
    }
    return (
      <li className={hiddenOrNot}>
      {statusMessage}
      </li>
    );
  }
});

var ContestFrame = React.createClass({
  getInitialState: function() {
    return ({
      activeQuestion: 0,
      response: null,
      modalVisible: false
    });
  },
  handleSubmit: function() {
    $.post("post.php", $("#contestForm").serialize())
    .done(function(response) {
      var res = $.parseJSON(response);
      var nextQuestion = this.state.activeQuestion + 1;
      this.setState({
        response: res,
        activeQuestion: nextQuestion
      })
    }.bind(this));
  },
  handlePrev: function(e) {
    e.preventDefault();
    var nextQuestion = this.state.activeQuestion - 1;
    if (nextQuestion > this.props.contest.questions.length) {
      console.error("this.refs.contestForm.submit() called");
    }else{
      this.setState({
        activeQuestion: nextQuestion
      })
    }
  },
  handleNext: function(e) {
    e.preventDefault();
    var nextQuestion = this.state.activeQuestion + 1;
    if (nextQuestion <= this.props.contest.questions.length) {
    this.setState({
      activeQuestion: nextQuestion
    })
  }
  },
  showModal: function(e) {
    if (e !== undefined) {
      e.preventDefault();
    };
    this.setState({
      modalVisible: !this.state.modalVisible
    });
  },
  render: function() {
    var copys = [];
    this.props.contest.copy.split("\n").map(function(p, index){
      copys.push(<p className="splash" key={index}>{p}</p>);
    });
  var questions = [];
  this.props.contest.questions.map(function(q, index){
    questions.push(<Question 
      id={index} 
      activeQuestion={this.state.activeQuestion} 
      handlePrev={this.handlePrev} 
      handleNext={this.handleNext} 
      key={index} 
      lang={this.props.lang}
      question={q} />);
  }, this);

  return (
    <div className={isIE9() ? "tl-contest ie9" : "tl-contest"}>
      {this.state.modalVisible ?
    <div id="modal">
    <p className="center"><a href="#" onClick={this.showModal}>{Translations.tillbaka[this.props.lang]}</a></p>
    <ul className="terms">{
      this.props.contest.termsAndConditions.split("\n").map(function(line, index){
        if (line.indexOf("*") == 0) {
          // Make bold
          return <li className="fett" key={index}><b>{line.substring(1)}</b></li>;
        }else{
          return <li className="dot" key={index}>{line}</li>;
        }
      })
    }</ul>
    <p className="center"><a href="#" onClick={this.showModal}>{Translations.tillbaka[this.props.lang]}</a></p>
    </div>
    : null}
    <h1 className="splash">{this.props.contest.title}</h1>
    {copys}
    {this.props.contest.moreInfoUrl != undefined && this.props.contest.moreInfoUrl != "" ? <p className="splash"><a href={this.props.contest.moreInfoUrl} target="_blank">{Translations.moreInfo[this.props.lang]}</a></p> : null}
    <form id="contestForm" ref="contestForm">
    <ul className="tl-contest-questions">
    {questions}
    {this.props.contest.questions.length > 0 ? <SubmitBox 
      handleSubmit={this.handleSubmit}
      showModal={this.showModal}
      id={this.props.contest.questions.length} 
      activeQuestion={this.state.activeQuestion} 
      contest={this.props.contest}
      lang={this.props.lang}
      key="submit" /> : null}
      <StatusPage
      id={this.props.contest.questions.length + 1} 
      activeQuestion={this.state.activeQuestion}
      lang={this.props.lang}
      week={this.props.contest.week}
      response={this.state.response} />
    </ul>
    </form>
    </div>
  );
  }
});

function isIE9() {
    // Detect IE9
  var ua = window.navigator.userAgent;
  var msie = ua.indexOf('MSIE ');
  if (msie > 0) {
    // IE 10 or older => return version number
    var version = parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    if (version == 9) {
      return true;
    }
  }
  return false;
}


module.exports = {
  ContestFrame: ContestFrame
};