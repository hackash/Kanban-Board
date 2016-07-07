import React, {Component} from 'react';
import KanbanBoard from './KanbanBoard';
import 'whatwg-fetch';
import 'babel-polyfill';
import update from 'react-addons-update';

const API_URL = "store.json";
const API_HEADERS = {
  'Content-Type': 'application/json',
};

class KanbanBoardContainer extends Component {

  constructor() {
    super();
    this.state = {
      cards: []
    }
  }

  componentDidMount() {
    // for local development purpose we check if localstorage
    // item exists we do not perform additional HTTP request
    if (localStorage.getItem("cards") === null) {
      fetch(API_URL, {headers: API_HEADERS}).then((response) =>response.json())
        .then((responseData) => {
          this.setState({
            cards: responseData
          });
          // for local development using localstorage
          localStorage.setItem('cards', JSON.stringify(this.state.cards));
        })
        .catch((error) => {
          console.log('Error fetching and parsing data', error);
        });
    } else {
      this.setState({
        cards: JSON.parse(localStorage.getItem('cards'))
      });
    }

  }

  findIndex(cardId) {
    return this.state.cards.findIndex((card) => card.id === cardId);
  }

  addTask(cardId, taskName) {
    // Find the index of the card
    let cardIndex = this.findIndex(cardId);
    // Create a new task with the given name and a temporary ID
    let newTask = {id: Math.floor(Math.random() * 1000), name: taskName, done: false};
    // Create a new object and push the new task to the array of tasks
    let nextState = update(this.state.cards, {
      [cardIndex]: {
        tasks: {$push: [newTask]}
      }
    });
    // set the component state to the mutated object
    this.setState({cards: nextState});
    // for local development using localstorage
    localStorage.setItem('cards', JSON.stringify(this.state.cards));
  }

  deleteTask(cardId, taskId, taskIndex) {
    // Find the index of the card
    let cardIndex = this.findIndex(cardId);
    // Create a new object without the task
    let nextState = update(this.state.cards, {
      [cardIndex]: {
        tasks: {$splice: [[taskIndex, 1]]}
      }
    });
    // set the component state to the mutated object
    this.setState({cards: nextState});
    // for local development using localstorage
    localStorage.setItem('cards', JSON.stringify(this.state.cards));
  }

  toggleTask(cardId, taskId, taskIndex) {
    // Find the index of the card
    let cardIndex = this.findIndex(cardId);
    // Save a reference to the task' done value to its opposite
    let newDoneValue;
    let nextState = update(this.state.cards, {
      [cardIndex]: {
        tasks:  {
          [taskIndex]: {
            done: {$apply: (done) => {
              newDoneValue = !done;
              return newDoneValue;
            }}
          }
        }
      }
    });
    // set the component state to the mutated object
    this.setState({cards: nextState});
    // for local development using localstorage
    localStorage.setItem('cards', JSON.stringify(this.state.cards));
  }

  updateCardStatus(cardId, listId) {
    // Find the index of the card
    let cardIndex = this.findIndex(cardId);
    
  }

  render() {
    return <KanbanBoard cards={this.state.cards}
    taskCallbacks={{
      toggle: this.toggleTask.bind(this),
      delete: this.deleteTask.bind(this),
      add: this.addTask.bind(this)
    }}/>
  }

}

export default KanbanBoardContainer;
