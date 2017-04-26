var React = require('react');
var ReactDOM = require('react-dom');
var Contest = require('./contestComponents');
var Config = require('./config');

var globalInfo = [
  {
    "short": "title",
    "long" : "Competition slogan/headline",
  },
  {
    "short": "copy",
    "long" : "Short copy text, describing the prize etc.",
  },
  {
    "short": "moreInfoUrl",
    "long" : "Optional external url",
  },
  {
    "short": "termsAndConditions",
    "long" : "Enter the terms and conditions for the contest. Each new line will translate into a dotted list item.",
  },
  {
    "short": "client",
    "long" : "The client's name (will be visible)",
  },
  {
    "short": "week",
    "long" : "Which week will the winner be presented.",
  },
  {
    "short": "endDate",
    "long" : "When will the contest be removed from the landing page? Format: YYYY-MM-DD",
  }
];

var activeInputs = {
  "languageSelectors" : 0,
  "campaign"          : 1,
  "title"             : 2,
  "copy"              : 3,
  "moreInfoUrl"       : 3,
  "termsAndConditions": 4,
  "client"            : 5,
  "week"              : 6,
  "endDate"           : 7,
  "Question"          : 8,
  "1"                 : 8,
  "X"                 : 8,
  "2"                 : 8,
  "Motivering"        : 8,
  "questions"         : 8,
};

function camelCase(input, removeStrangeCharacters) {
  var words = input.trim().split(" ");
  var output = words[0].toLowerCase();
  for (var i = 1; i < words.length; i++) {
    output += words[i].substr(0,1).toUpperCase() + words[i].substr(1).toLowerCase();
  }
  if(removeStrangeCharacters) {
    output = output.replace(/[^a-z0-9]/gi, "_");
  }
  return output;
}

var RadioButton = React.createClass({
  getInitialState: function() {
    return ({
      selectedLang: this.props.selectedLang
    });
  },
  componentWillReceiveProps: function(newProps) {
    this.setState({
      selectedLang: newProps.selectedLang
    });
  },
  render: function() {
    return (
      <label className={this.state.selectedLang == this.props.value ? "fourth selected" : "fourth"}>{this.props.value}
      <input 
      type="radio" 
      tabIndex={this.props.index}
      name={this.props.name} 
      onChange={this.props.onChange} 
      value={this.props.value} />
      </label>
      );
  }
});

var CheckBox = React.createClass({
  getInitialState: function() {
    return ({
      checked: this.props.checked
    });
  },
  onChange: function(event) {
    this.setState({
      checked: event.target.checked
    });
    this.props.onChange(event);
  },
  render: function() {
    return (
      <label className={this.state.checked ? "fourth selected" : "fourth"}>{this.props.value}
      <input 
      type="checkbox" 
      name={this.props.name} 
      onChange={this.onChange} 
      value={this.props.value} />
      </label>
      );
  }
});

var GeneratorInput = React.createClass({
  render: function() {
    return (
      <label className={activeInputs[this.props.id] <= this.props.activeInput ? "block fading visible" : "block fading"}>{this.props.label}
        {this.props.type == "text" ? <input
    id={this.props.language + this.props.id}
    type="text"
    placeholder={this.props.language == "XX" ? this.props.placeholder : this.props.placeholder + " (" + this.props.language + ")"}
    value={this.props.value}
    onChange={this.props.handleChange} /> : <textarea
      id={this.props.language + this.props.id}
      placeholder={this.props.language == "XX" ? this.props.placeholder : this.props.placeholder + " (" + this.props.language + ")"}
      value={this.props.value}
      onChange={this.props.handleChange} />}
      </label>
      );
  }
});

var QuestionAdder = React.createClass({
  getInitialState: function() {
    var question = {
      "fields" : []
    };
    this.props.languages.map(function(language, i){
      question[language] = {
        "texts" : [],
        "answers" : []
      };
    }, this);
    return ({
      question: question
    });
  },
  handleChange: function(event) {
    var question = this.state.question;
    var targetLanguage = event.target.id.substring(0,2);
    var targetId = event.target.id.substring(2);
    if (question[targetLanguage] === undefined) {
      if (question.fields[0] == "Question") {
        question[targetLanguage] = {
          "imgSrc" : "q" + this.props.questionNr + ".jpg",
          "column" : "q" + this.props.questionNr + " varchar(2)",
          "question" : "",
          "answers" : [
          "",
          "",
          ""
          ]
        };
      }else{
        question[targetLanguage] = {
          "imgSrc" : "q" + this.props.questionNr + ".jpg",
          "column" : "q" + this.props.questionNr + " text",
          "question" : "",
          "answers" : []
        };
      }
    }
    switch (targetId) {
      case "1":
      question[targetLanguage].answers[0] = event.target.value;
      break;
      case "X":
      question[targetLanguage].answers[1] = event.target.value;
      break;
      case "2":
      question[targetLanguage].answers[2] = event.target.value;
      break;
      case "imgSrc":
      question[targetLanguage].imgSrc = event.target.value;
      break;
      case "Statisk text":
      this.props.updateStaticText(event.target.value, "p" + this.props.questionNr);
      break;
      default:
      question[targetLanguage].question = event.target.value;
      break;
    }
    this.setState({
      question: question
    });
    this.props.updateQuestion(question, this.props.questionNr, targetLanguage);
  },
  addQuestionForm: function(event) {
    event.preventDefault();
    if (event.target.href.indexOf('add1X2Question') != -1) {
      var question = {
        "fields": ["Question", "1", "X", "2"]
      };
      this.props.languages.map(function(language, i){
        question[language] = {
          "imgSrc" : "q" + this.props.questionNr + ".jpg",
          "column" : "q" + this.props.questionNr + " varchar(2)",
          "question" : "",
          "answers" : [
          "",
          "",
          ""
          ]
        };
      }, this);
      this.setState({
        question: question
      });
    }else if (event.target.href.indexOf('addTextQuestion') != -1) {
      var question = {
        "fields": ["Motivering"]
      };
      this.props.languages.map(function(language, i){
        question[language] = {
          "imgSrc" : "q" + this.props.questionNr + ".jpg",
          "column" : "q" + this.props.questionNr + " text",
          "question" : "",
          "answers" : []
        };
      }, this);
      this.setState({
        question: question
      });
    }
  },
  addStaticText: function(event) {
    event.preventDefault();
    this.props.addStaticText(event.target.value, "p" + this.props.questionNr);
    var question = this.state.question;
    question.fields = ["Statisk text"];
    this.setState({
      question: question
    })
  },
  render: function() {
    var languageQuestionInputs = [];
    this.props.languages.map(function(language, i){
      languageQuestionInputs.push(
        <LanguageQuestionInput 
          key={i}
          fields={this.state.question.fields}
          language={language}
          width={this.props.width}
          handleChange={this.handleChange}
          activeInput={this.props.activeInput}
        />);
    }, this);

    return (
      <div>
        {this.state.question.fields.length === 0 ? <a 
          className={activeInputs["questions"] <= this.props.activeInput ? "half questionAdder fading visible" : "half questionAdder fading"}
          onClick={this.addQuestionForm}
          href="add1X2Question">Lägg till en 1X2 fråga</a> : null}

        {this.state.question.fields.length === 0 ? <a 
          className={activeInputs["questions"] <= this.props.activeInput ? "half questionAdder fading visible" : "half questionAdder fading"}
          onClick={this.addQuestionForm}
          href="addTextQuestion">Lägg till en textfråga (typ 'Motivering')</a> : null}

        {this.state.question.fields.length === 9999 ? <a 
          className={activeInputs["questions"] <= this.props.activeInput ? "half questionAdder fading visible" : "half questionAdder fading"}
          onClick={this.addStaticText}
          href="addStaticText">Lägg till statisk text/information</a> : null}

        {languageQuestionInputs}
      </div>
    );
  }
});

var LanguageQuestionInput = React.createClass({
  render: function() {
    var generatorInputs = [];
    this.props.fields.map(function(alt, i){
      generatorInputs.push(<GeneratorInput
        id={alt}
        placeholder={alt}
        label={alt}
        value={null}
        key={i}
        language={this.props.language}
        type="text"
        activeInput={this.props.activeInput}
        handleChange={this.props.handleChange} />);
    }, this);
    return (
      <div className={"languageInput " + this.props.width}>
        {generatorInputs}
      </div>
    )
  }
});

var LanguageInput = React.createClass({
  getInitialState: function() {
    return ({
      activeInput: this.props.activeInput
    });
  },
  componentWillReceiveProps: function(newProps) {
    this.setState({
      activeInput: newProps.activeInput > this.state.activeInput ? newProps.activeInput : this.state.activeInput
    })
  },
  render: function(){
    var inputs = [];
    globalInfo.map(function(infoItem, i){
      inputs.push(<GeneratorInput 
        id={infoItem.short}
        placeholder={infoItem.short}
        language={this.props.language}
        label={infoItem.long}
        value={this.props.contest[this.props.language][infoItem.short]}
        type={infoItem.short == "copy" | infoItem.short == "termsAndConditions" ? "textarea" : "text"}
        key={this.props.language + "_" + i}
        activeInput={this.state.activeInput}
        handleChange={this.props.handleChange} />);
    }, this);
    return (
    <div className={"languageInput " + this.props.width}>
      {inputs}
    </div>
    );
  }
});

var ContestGenerator = React.createClass({
  getInitialState: function() {
    return {
      contest: {},
      activeInput: 0,
      nrOfQuestions: 0,
      selectedLanguages: [],
      gotResponse: null,
      existingTables: []
    };
  },
  handleChange: function(event) {
    var contest = this.state.contest;
    var value = event.target.value;
    var targetLanguage = event.target.id.substring(0,2);
    var targetId = event.target.id.substring(2);
    var activeInput = this.state.activeInput;
    switch (targetId) {
      case "campaign":
        if(value !== ''){
          $.post("checkForExistingCampaign.php", {
            tableName: camelCase(value, true),
          }, "json")
          .done(function(response){
            var res = $.parseJSON(response);
            if (res.error != undefined) {
              console.error(res.error);
            }else{
              this.setState({
                existingTables: res.tables
              });
            }
          }.bind(this));
        }else{
          this.setState({
            existingTables: []
          })
        }
        contest.databaseTable = camelCase(value, true);
        contest.campaign = value;
      break;
      case "endDate":
        var components = value.split("-");
        if(components[0] !== undefined && components[1] !== undefined && components[2] !== undefined){
          var endDate = new Date(components[0], parseInt(components[1]) - 1, components[2]);
          contest.endDate = endDate;
          console.log("Setting endDate to " + endDate.toLocaleDateString());
        }
      break;
      default:
        contest[targetLanguage][targetId] = value;
      break;
    }
    this.setState({
      contest: contest,
      activeInput: activeInputs[targetId] + 1 > this.state.activeInput ? activeInputs[targetId] + 1 : this.state.activeInput
    });
  },
  updateQuestion: function(question, questionNr, language) {
    var contest = this.state.contest;
    this.state.selectedLanguages.forEach(function(selectedLanguage, i){
      if (selectedLanguage == language) {
        contest[language].questions[questionNr] = question[language];
      }
    });
    this.setState({
      contest: contest,
      nrOfQuestions: questionNr + 1,
      activeInput: activeInputs["questions"] + questionNr > this.state.activeInput ? activeInputs["questions"] + questionNr : this.state.activeInput
    });
  },
  addStaticText: function(text, indexKey) {
    var contest = this.state.contest;
    contest[this.state.lang].texts.push({
      "text" : text,
      "indexKey" : indexKey
    });
  },
  updateStaticText: function(text, indexKey) {
    var contest = this.state.contest[this.state.lang];
    for (var i = 0; i < contest.texts.length; i++) {
      if (contest.texts[i].indexKey == indexKey) {
        contest.texts[i].text = text; 
      }
    }
  },
  setLanguage: function(event) {
    var selectedLanguages = this.state.selectedLanguages;
    var contest = this.state.contest;
    // If contest with selected language is undefined, init it
    if (contest[event.target.value] === undefined) {
      selectedLanguages.push(event.target.value);
      contest[event.target.value] = {
        "title" : "",
        "copy"  : "",
        "client" : "",
        "questions" : [],
        "texts" : []
      };
    }else{
      var i = selectedLanguages.indexOf(event.target.value);
      if (i > -1){
        selectedLanguages.splice(i, 1);
      }
      contest[event.target.value] = undefined;
    }
    this.setState({
      selectedLanguages: selectedLanguages,
      contest: contest,
      activeInput: this.state.activeInput === 0 ? 1 : this.state.activeInput
    })
  },
  outputContest: function() {
    var node = document.getElementById('outputHtml');
    var editorial = document.getElementById('editorial');
    var contestHtml, editorialHtml;
    var generatedContest = '\n' +
    'var contest = ' + JSON.stringify(this.state.contest) + ';\n' +
    '</script>\n';
    var renderContestScript = '<script type="text/javascript" src=' + Config.rootURL + '"/scripts/bundle.js?v=<?php echo mktime(); ?>"></script>\n' +
    '</body>\n' + 
    '</html>\n'; 
    contestHtml = node.innerHTML
      .replace("<!-- #START#", "")
      .replace("#END# -->", "")
      .replace(/#IFRAME_DOMAIN#/g, Config.iFrameDomain)
      .replace(/#MAIN_DOMAIN#/g, Config.mainDomain) + generatedContest + renderContestScript;
    editorialHtml = editorial.innerHTML
      .replace("<!-- #START#", "")
      .replace("#END# -->", "")
      .replace(/#IFRAME_DOMAIN#/g, Config.iFrameDomain)
      .replace(/#MAIN_DOMAIN#/g, Config.mainDomain)
      .replace("#CAMPAIGN_NAME#", this.state.contest.databaseTable)
      .replace("#END_DATE_YEAR#", this.state.contest.endDate.getFullYear())
      .replace("#END_DATE_MONTH#", this.state.contest.endDate.getMonth())
      .replace("#END_DATE_DAY#", this.state.contest.endDate.getDate());
    
    var queryColumns = {"columns":[]};
    var questions = this.state.contest[this.state.selectedLanguages[0]].questions;
    for (var i = 0; i < questions.length; i++) {
      queryColumns.columns.push(questions[i].column);
    }
    $.post("saveFile.php", {
      fileContent: contestHtml,
      languages: JSON.stringify(this.state.selectedLanguages),
      editorialHtml: editorialHtml,
      columns: JSON.stringify(queryColumns),
      contestName: this.state.contest.campaign,
      tableName: this.state.contest.databaseTable,
      endDate: this.state.contest.endDate.toLocaleDateString()
    }, "json")
    .done(function(response){
      var res = $.parseJSON(response);
      console.log(res);
      if (res.error != undefined) {
        if (res.error == "ERROR_TABLE_EXISTS") {
          var createNewTable = confirm("WARNING: The database already contains a table named '" + this.state.contest.databaseTable + "'. If you want to use the existing table, click OK. If not, click cancel and then choose a new name for your campaign.");
          if (createNewTable) {
            console.log("Using existing data table '" + this.state.contest.databaseTable + "'.");
            this.setState({
              gotResponse: res
            });
          }else{
            console.log("Not creating new database table");
            this.setState({
              gotResponse: res
            });
          }
        }
      }else{
        this.setState({
          gotResponse: res
        });
      }
    }.bind(this))
    .fail(function(response){
      console.error("ERROR when creating contest.");
      console.log(response);
    });
    },
    imagesNeeded: function() {
      var imagesNeeded = [];
      this.state.selectedLanguages.forEach(function(lang){
        imagesNeeded.push(<li key={lang}><p><b>{lang}:</b></p></li>);
        imagesNeeded.push(<li key={lang + "bg"}><p>{Config.iFrameDomain}/{lang.toLowerCase()}/{this.state.contest.campaign.charAt(0).toLowerCase()}/contest-bg.jpg</p></li>);
        for (var img = 0; img < this.state.nrOfQuestions; img++) {
          imagesNeeded.push(<li key={img}><p>{Config.iFrameDomain}/{lang.toLowerCase()}/{this.state.contest.campaign.charAt(0).toLowerCase()}/q{img}.jpg</p></li>);
        }
      }, this);
      return imagesNeeded;
    },
    render: function() {
      var languageSelectors = [];
      Config.possibleLanguages.map(function(lang, i) {
        languageSelectors.push(<CheckBox
          name="lang"
          onChange={this.setLanguage}
          value={lang}
          key={"lang" + i} />);
      }, this);

      var languageInputs = [];
      this.state.selectedLanguages.map(function(lang, index){
        languageInputs.push(<LanguageInput
          key={"langInput" + index}
          language={lang}
          contest={this.state.contest}
          nrOfQuestions={this.state.nrOfQuestions}
          activeInput={this.state.activeInput} 
          handleChange={this.handleChange}
          width={"fit" + this.state.selectedLanguages.length} />);
      }, this);

      var questionAdders = [];
      for (var i = 0; i <= this.state.nrOfQuestions; i++) {
        questionAdders.push(<QuestionAdder 
          key={"questionAdder" + i}
          languages={this.state.selectedLanguages}
          questionNr={i}
          updateQuestion={this.updateQuestion} 
          addStaticText={this.addStaticText}
          updateStaticText={this.updateStaticText}
          activeInput={this.state.activeInput} 
          width={"fit" + this.state.selectedLanguages.length} />
          );
      }

      var fileNames = [];
      for (var l in this.state.selectedLanguages) {
        fileNames.push(<span key={"span" + l}><b>editorial-{this.state.selectedLanguages[l].toLowerCase()}.html</b>{l == this.state.selectedLanguages.length - 1 ? "." : ", "}</span>);
      }

      var existingTables = [];
      this.state.existingTables.forEach(function(table, i){
        existingTables.push(<li key={"table" + i}>Existing database table: <b>{table}</b></li>);
      });      
      
      return (
        <div>
          <form className="tl-contestGenerator">
            <div className="centered">
              <p>Choose languages</p>
              {languageSelectors}
            </div>
            <GeneratorInput 
              id="campaign"
              placeholder="campaign"
              language="XX"
              label="Campaign Name (will not be visible, for your reference only) e.g. 'AustriaMar16'"
              value={this.state.contest.campaign}
              type="text"
              activeInput={this.state.activeInput}
              handleChange={this.handleChange} />
            <ul className="suggestions">
            {existingTables}
            </ul>
            {languageInputs}
            {questionAdders}
            {this.state.activeInput >= activeInputs["questions"] ? <label className="submitLabel">CREATE CONTEST<input type="button" onClick={this.outputContest} value="SKAPA TÄVLING" /></label> : null }
          </form>
            {this.state.selectedLanguages.length !== 0 ? <p className="center"><b>Contest preview below</b></p> : null}
            <div style={{width:"720px", border:"1px solid #338695",margin:"20px auto", position:"relative", background:"url(contest-bg.jpg) no-repeat top center"}}>
            {this.state.selectedLanguages.length !== 0 && this.state.gotResponse == null ? <Contest.ContestFrame contest={this.state.contest[this.state.selectedLanguages[0]]} lang={this.state.selectedLanguages[0]} /> : null }
            </div>
            {this.state.gotResponse != null ? 
          <div className="centered" style={{width:"90%"}}>
            <h1>Contest created!</h1>
            <ul>
              <li><p>Download <a target="_blank" href={"download.php?type=application/zip&file=" + this.state.gotResponse.zipFile + "&filename=" + this.state.gotResponse.contestName + ".zip"}>{this.state.gotResponse.contestName}.zip</a></p></li>
              <li><p>Unzip</p></li>
              <li><p>The unzipped folder consists of {this.state.selectedLanguages.length} folder{this.state.selectedLanguages.length > 1 ? "s" : ""} named <b>{this.state.selectedLanguages.join(", ")}</b>.</p></li>
              <li><p>The content of {this.state.selectedLanguages.length > 1 ? "each of these folders" : "this folder"} should be uploaded to <b>{Config.iFrameDomain}/</b><i>[se, no, dk or fi]</i><b>/</b>.</p></li>
            </ul>
            <h2>Images needed</h2>
            <ul>
              <li><p>The contest background is a JPEG image with a fixed width of 720px. The image must be at least 1200px tall to cover the entire page but can be taller if necessary. Since the top heading and the contest copy is white, make sure that the upper half of the background image is dark and the text is readable.</p><p>Name the file <b>contest-bg.jpg</b></p></li>
              <li><p>For every question/motivering a JPEG image should be supplied. Dimensions: 540x300px. Name the files <b>q0.jpg</b>, <b>q1.jpg</b>, <b>q2.jpg</b> etc... </p></li>
              <li><p>Upload the images to the same folder{this.state.selectedLanguages.length > 1 ? "s. Since this is a multiple language contest, make sure to upload the images to every language's folder." : "."}</p></li>
            </ul>
            <p>Below are all the images you need to upload:</p>
            <ul>
              {imagesNeeded()}
            </ul>
            <h2>Add the Editorial</h2>
            <ul>
              <li><p>The zip file contains {this.state.selectedLanguages.length} file{this.state.selectedLanguages.length > 1 ? "s" : ""} named {fileNames}. Use {this.state.selectedLanguages.length > 1 ? "these files" : "this file"} as a starting point for an Editorial.</p></li>
            </ul>
          </div> : null }

        </div>
      );
    }
  })

module.exports = {
  ContestGenerator: ContestGenerator
}