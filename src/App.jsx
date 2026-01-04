import { useState, useEffect } from 'react'
import './App.css'
import BoardList from './components/Board'
import NewBoardForm from './components/NewBoardForm'
import Card from './components/Card.jsx'

const URL = "http://127.0.0.1:5000/boards"

function App() {
  const [boards, setBoards] = useState([])
  // its supposed to only show form on create or something? have to research. set to true to toggle modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  // stores board we're currently editing
  const [currentBoard, setCurrentBoard] = useState({})
  const [cards, setCards] = useState([])
  const [selectedBoardId, setSelectedBoardId] = useState(null)
  const [loadingCards, setLoadingCards] = useState(false)

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

  const fetchBoards = async () => {
    try {
      const response = await fetch(URL)
      const data = await response.json()
      setBoards(data.boards)
      console.log(data.boards)
    } catch (error) {
      console.error("Failed to fetch boards:", error)
    }
  }

  const fetchCardsForBoard = async (boardId) => {
    setLoadingCards(true)
    try {
      const response = await fetch(`http://127.0.0.1:5000/boards/${boardId}/cards`)
      const data = await response.json()
      setCards(data.cards)
      console.log("Cards for board:", data.cards)
    } catch (error) {
      console.error("Failed to fetch cards:", error)
      setCards([])
    } finally {
      setLoadingCards(false)
    }
  }

  const handleSelectBoard = (boardId) => {
    // If clicking the same board, deselect it
    if (selectedBoardId === boardId) {
      setSelectedBoardId(null)
      setCards([])
    } else {
      setSelectedBoardId(boardId)
      fetchCardsForBoard(boardId)
    }
  }

  useEffect(() => {
    fetchBoards()
  }, [])

  const closeModal = () => {
    setIsModalOpen(false)
    // resets currentBoard object when closing modal
    setCurrentBoard({})
  }

  const openCreateModal = () => {
    if (!isModalOpen) setIsModalOpen(true)
  }

  const openEditModal = (board) => {
    if (isModalOpen) return
    setCurrentBoard(board)
    setIsModalOpen(true)
  }
    // whats actually happening when we create an update
  const onUpdate = () => {
    closeModal()
    fetchBoards()
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
        <div className="boards-container">
          <BoardList 
            boards={boards} 
            updateBoard={openEditModal} 
            updateCallback={onUpdate}
            onSelectBoard={handleSelectBoard}
            selectedBoardId={selectedBoardId}
          />
          <button onClick={openCreateModal}>Create New Board</button>
          {isModalOpen && (
            <div className="modal">
              <div className="modal-content">
                <span className="close" onClick={closeModal}>&times;</span>
                <NewBoardForm existingBoard={currentBoard} updateCallback={onUpdate} />
              </div>
            </div>
          )}
        </div>
      </section>

      <section
        className="cards-section"
        aria-label="Cards for selected board"
      >
        {selectedBoardId ? (
          <>
            <h2 className="section-title">
              Cards for {boards.find(b => b.id === selectedBoardId)?.title || 'Selected Board'}
            </h2>
            {loadingCards ? (
              <p>Loading cards...</p>
            ) : cards.length > 0 ? (
              <div className="cards-container">
                {cards.map((card) => (
                  <Card
                    key={card.id}
                    card={card}
                    onLike={() => handleLikeCard(card.id)}
                  />
                ))}
              </div>
            ) : (
              <p>No cards yet for this board.</p>
            )}
          </>
        ) : (
          <p>Select a board to view its cards</p>
        )}
      </section>
    </main>
  )
}

export default App
