import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  return (
    <button 
        className={"square " + (props.isWinning ? "square--winning" : null)} 
        onClick={props.onClick}
        >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        isWinning={this.props.winningSquares.includes(i)}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true
    };
  }

  handleClick(i) {
    const squares = this.state.squares;
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = "X";
    this.setState({
      squares: squares,
      xIsNext: false
    });
    this.cpuPlay();
  }

  cpuPlay(){
    const squares = this.state.squares;
    if (calculateWinner(squares)) {
      return;
    }
    const emptyPositions = [];
    for( let i = 0; i < 9; i++){
      if(squares[i] == null){
        emptyPositions.push(i);
      }
    }
    const randomIndex = Math.floor(Math.random() * emptyPositions.length);
    const emptyCell = emptyPositions[randomIndex];
    squares[emptyCell] = "O";
    this.setState({
      squares: squares,
      xIsNext: true
    });  
  }

  reset(){
    this.setState({
      squares: Array(9).fill(null),
      xIsNext: true
    })
  }

  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    const button = "Reset";
    if (winner) {
      status = "Winner: " + winner.name;
    }
    return (
        <div className="game">
          <div className="game-board">
            <Board
              winningSquares={winner ? winner.line : []}
              squares={this.state.squares}
              onClick={i => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <button className="reset-button" onClick={()=> this.reset()}>{button}</button>
            <div className="winner-status">{status}</div>
          </div>
        </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<div style={{
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}}><Game /></div>);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {name: squares[a] == 'X'? 'Player':'CPU', line: lines[i]};
    }
  }
  return null;
}

