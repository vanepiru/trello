import React, {Component} from 'react';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import _ from 'lodash';
import {Board} from './Board';
import axios from "axios";


let _columnId = 0;
let _cardId = 0;



const initialCards = Array.from({length: 9}).map(() => ({
  id: ++_cardId,
  title: `Card ${_cardId}`,
}));

const initialColumns = ['TODO', 'Doing', 'Done'].map((title, i) => ({
  id: _columnId++,
  title,
  cardIds: initialCards.slice(i * 3, i * 3 + 3).map(card => card.id),
}));

class App extends Component {
  state = {
   // cards: initialCards,
   cards:[],
   // columns: initialColumns,
   columns: [],
  };

  componentDidMount() {

    this.getColumna();
    this.getCards();
  };


     getCards = async () => {    
     
  
      axios.get(`http://127.0.0.1:8080/todo/api/v1.0/cards`
        ).then((response) => {
        console.log(response.data);
      
        this.setState({cards: response});
       }).catch(function (error) {
        if (error.response) {
          // Request made and server responded
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received // 
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        };

      });
    };

    getColumna = async () => {    
     
  
      axios.get(`http://127.0.0.1:8080/todo/api/v1.0/columns`
        ).then((response) => {
        console.log(response.data);
      
        this.setState({columns: response});
       }).catch(function (error) {
        if (error.response) {
          // Request made and server responded
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received // 
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        };

      });
    };

 

  addColumn = _title => {
    const title = _title.trim();
    let name;
    if (!title) {return;}else{name=title;}



    axios.post(`http://127.0.0.1:8080/todo/api/v1.0/columns`,
    {
      name
    }
    ).then((response) => {

    console.log(response.data);
  
    const newColumn = {
      id: response.data.id,
      tilte:response.data.name,
      cardIds: [],
    };
    this.setState(state => ({
      columns: [...state.columns, newColumn],
    }));


   // this.setState({columns: response});
   }).catch(function (error) {
    if (error.response) {
      // Request made and server responded
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received // 
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    };

  });


   // const newColumn = {
   //   id: ++_columnId,
    //  title,
    //  cardIds: [],
   // };
   //  this.setState(state => ({
   //  columns: [...state.columns, newColumn],
   //  }));
  };

  setCards  () {
   

      const user = {
        name: this.state.name
      };
  
      axios.post(`https://jsonplaceholder.typicode.com/users`, { user })
        .then(res => {
          console.log(res);
          console.log(res.data);
        })
     
    };

  addCard = (columnId, _title) => {
    const title = _title.trim();
    if (!title) return;

    const newCard = {id: ++_cardId, title};

    axios.post('http://localhost:8080/createCard', newCard)
        .then(response => console.log("responde"));

//;this.setState({ newCard: response.data.id }


    this.setState(state => ({
      cards: [...state.cards, newCard],
      columns: state.columns.map(
        column =>
          column.id === columnId
            ? {...column, cardIds: [...column.cardIds, newCard.id]}
            : column
      ),
    }));
  };

  

  moveCard = (cardId, destColumnId, index) => {
    this.setState(state => ({
      columns: state.columns.map(column => ({
        ...column,
        cardIds: _.flowRight(
          // 2) If this is the destination column, insert the cardId.
          ids =>
            column.id === destColumnId
              ? [...ids.slice(0, index), cardId, ...ids.slice(index)]
              : ids,
          // 1) Remove the cardId for all columns
          ids => ids.filter(id => id !== cardId)
        )(column.cardIds),
      })),
    }));
  };

  render() {
    return (
      <Board
        cards={this.state.cards}
        columns={this.state.columns}
        moveCard={this.moveCard}
        addCard={this.addCard}
        addColumn={this.addColumn}
      />
    );
  }
}

export default DragDropContext(HTML5Backend)(App);
