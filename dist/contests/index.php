<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Contests</title>
  <link rel="stylesheet" href="contestStatistics.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
<!--   <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.0.0/react-dom-server.js"></script>
 -->  
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.0.0/react.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.0.0/react-dom.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.23/browser.min.js"></script>
</head>
<body>
<div class="wrapper">
  <div id="contestInfo"></div>
</div>
<script type="text/babel">
<?php
require_once("db.php");

$query = "SELECT * FROM contests ORDER BY endDate DESC";
$result = $conn->query($query);
echo "var contests = [";
if ($result->num_rows > 0) {
  // output data of each row
  while($row = $result->fetch_assoc()) {
    $name = $row["name"];
    $tableName = $row["table"];
    $endDate = $row["endDate"];
    echo "  {\n";
    echo "    \"name\": \"$name\",\n";
    echo "    \"tableName\": \"$tableName\",\n";
    echo "    \"endDate\": \"$endDate\",\n";
    echo "  },\n";
  }
}else{
  echo "{}";
}
$conn->close();

echo "];"
?>

function getContest(name) {
  for (var i = 0; i < contests.length; i++) {
    if (contests[i].tableName == name) {
      return contests[i];
    }
  }
  return "ERROR: No endDate set";
}

var ContestInfo = React.createClass({
  getInitialState: function(){
    return ({
      winner: false,
      showContestInfo: {
        "name": "",
        "endDate": "",
        "contestants": [],
        "columns": [],
        "countries": [],
        "tableName": ""
      }
    });
  },
  handleData: function(data){
    var contestants = [];

    for(var country in data.countries){
      var countryName = data.countries[country];
      var nrOfContestants = data.nrOfContestants[countryName];
      contestants.push({
        countryName: countryName,
        nrOfContestants: nrOfContestants
      });
    }

    var endDate = getContest(data.tableName).endDate;

    this.setState({
      winner: false,
      showContestInfo: {
        "name": data.name,
        "endDate": endDate,
        "contestants": contestants,
        "columns": data.columns,
        "countries": data.countries,
        "tableName": data.tableName
      }
    });
  },
  showWinner: function(){
    this.setState({
      winner: true
    })
  },
  handleClick: function(e){
    e.preventDefault();
    this.setState({
      winner: false,
    });
    $.post("../getContestInfo.php", {
      tableName: e.target.id, 
      name: e.target.dataset.name
    }, this.handleData, 'json');
  },
  render: function(){
    return (
      <div>
        <h2>Select Contest</h2>
        <ContestSelector handleClick={this.handleClick} />
        <ContestStats contest={this.state.showContestInfo} winner={this.state.winner} showWinner={this.showWinner} />
      </div>
    );
  }
});

var ContestSelector = React.createClass({
  render: function() {
    var contestLinks = [];
    contests.forEach(function(contest, i){
      contestLinks.push(
        <li key={i} className="contestLink">
          <a
            id={contest.tableName}
            data-name={contest.name}
            onClick={this.props.handleClick}>
            {contest.name}
          </a>
        </li>
      );
    }, this)
    return (
      <ul>
        {contestLinks}
      </ul>
    );
  }
});

var ContestStats = React.createClass({
  drawWinner: function(e){
    e.preventDefault();
    $.post("../getRandomWinner.php", {
      tableName: this.props.contest.tableName, 
      country: e.target.dataset.country, 
      columns: JSON.stringify(this.props.contest.columns)
    }, this.handleData, 'json');
  },
  handleData: function(data) {
    this.setState({
      country: data.country,
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      age: data.age,
      postNummer: data.postNummer,
      email: data.email,
      motivation: data.answers[data.answers.length - 1]
    })
    this.props.showWinner();
  },
  render: function() {
    var contestants = [];
    var winnerLinks = [];
    this.props.contest.contestants.forEach(function(contestant, i){
      contestants.push(<li key={i}>{contestant.countryName}: <b style={{fontSize:"30px"}}>{contestant.nrOfContestants}</b></li>);
      winnerLinks.push(<a key={"a" + i} className="downloadLink" data-country={contestant.countryName} onClick={this.drawWinner}>Draw random winner in {contestant.countryName}</a>);
    }, this);
    var today = new Date();
    var endDateDate = new Date(this.props.contest.endDate);
    var endDateColor = endDateDate > today ? "#338695" : "#CC0000";
    var endDateString = endDateDate > today ? "Contest ACTIVE. Final date: " : "Contest ENDED ";
    return (
      <div>
        <h2>{this.props.contest.name}</h2>
        {this.props.contest.endDate != "" ? <p style={{"color": endDateColor, "padding": "0px", "fontSize": "11px"}}>{endDateString}{this.props.contest.endDate}</p> : null }
        {contestants.length > 0 ? <p>Number of contestants</p> : null }
        <ul>
          {contestants}
        </ul>
        {contestants.length > 0 ? <a className="downloadLink" href={"../downloadExcelFile.php?filename=" + this.props.contest.name + "&columns=" + JSON.stringify(this.props.contest.columns) + "&tableName=" + this.props.contest.tableName}>Download Excel File (.csv)</a> : null}
        {winnerLinks}
        {this.props.winner ? 
        <div className="winner">
          <h3>{this.state.firstName} {this.state.lastName}</h3>
          {this.state.country == "NO" ? <p>{"Postnummer: " + this.state.postNummer}</p> : null}
          {this.state.country == "NO" ? <p>{"Gender: " + this.state.gender}</p> : null}
          {this.state.country == "NO" ? <p>{"Year of birth: " + this.state.age}</p> : null}
          <p><i>{this.state.email}</i></p>
          <p>{this.state.motivation.split("BREAK").map(function(item, i){
        return (
          <span key={i}>{item.replace(/&quot;/g, '"').replace(/&amp;/g, '&')}<br/></span>
        );
      })}</p>
        </div>
        : null }

      </div>
    );
  }
})

ReactDOM.render(
  <ContestInfo />,
  document.getElementById('contestInfo')
);

</script>
  

</body>
</html>