import { useEffect, useState } from 'react';
//import Board from './components/Board.jsx';
//import NewBoardForm from './components/NewBoardForm.jsx';
import Card from './components/Card.jsx';
import './App.css';
import axios from 'axios';

//const kbaseURL = 'http://localhost:3000/boards'; 
// getAPIresponse function to fetch data from the API


const initialCards = [
  {
    id: 1,
    message: 'Ship early, iterate often.',
    likes: 3,
    author: 'Ada',
    tag: 'Product',
  },
  {
    id: 2,
    message: 'Good design is as little design as possible.',
    likes: 5,
    author: 'Dieter Rams',
    tag: 'Design',
  },
  {
    id: 3,
    message: 'Programs must be written for people to read.',
    likes: 2,
    author: 'Harold Abelson',
    tag: 'Engineering',
  },
]

function App() {
  const [cards, setCards] = useState(initialCards)

  const handleLikeCard = (cardId) => {
    setCards((prevCards) => {
      return prevCards.map((card) => {
        if (card.id === cardId) {
          return { ...card, likes: card.likes + 1 }
        } else {
          return card
        }
      })
    })
  }

  return (
    <main className="app" aria-labelledby="app-title">
      <header className="app-header">
        <h1 id="app-title" className="app-title">
          Inspiration Board
        </h1>
        <p className="app-subtitle">
          Our goal is to create a digital inspiration board with multiple boards and cards.
        </p>
      </header>

      <section className="boards-section" aria-label="Boards">
        <h2 className="section-title">Boards</h2>
        {/* list of boards here. selecting a board will show its cards. */}
        <p className="section-placeholder">
          Boards list will go here. Select a board to see its associated cards.
        </p>
      </section>

      <section
        className="cards-section"
        aria-label="Cards for selected board"
      >
        <h2 className="section-title">Cards</h2>
        <div className="cards-container">
          {cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              onLike={() => handleLikeCard(card.id)}
            />
          ))}
        </div>
      </section>
    </main>
  )
}

export default App
