import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import NewBoardForm from './components/NewBoardForm.jsx';
import NewCardForm from './components/NewCardForm.jsx';
import BoardList from './components/Board';
import Card from './components/Card.jsx';
import './App.css';

const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

function App() {
  const [boards, setBoards] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentBoard, setCurrentBoard] = useState({})
  const [cards, setCards] = useState([])
  const [selectedBoardId, setSelectedBoardId] = useState(null)
  const [loadingCards, setLoadingCards] = useState(false)

  const handleLikeCard = async (cardId) => {
    try {
      const response = await axios.patch(`${BASE_URL}/cards/${cardId}/like`)
      const newLikesFromApi = response.data.card?.likes ?? response.data.likes

      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === cardId
            ? {
                ...card,
                likes:
                  typeof newLikesFromApi === "number"
                    ? newLikesFromApi
                    : (card.likes || 0) + 1,
              }
            : card
        )
      )
    } catch (error) {
      console.error("Failed to like card:", error)
    }
  }

  const handleDeleteCard = async (cardId) => {
    try {
      await axios.delete(`${BASE_URL}/cards/${cardId}`)
      setCards((prevCards) => prevCards.filter((card) => card.id !== cardId))
    } catch (error) {
      console.error("Failed to delete card:", error)
    }
  }

  const handleCardCreated = () => {
    if (selectedBoardId) {
      fetchCardsForBoard(selectedBoardId);
    }
  }

  const fetchBoards = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/boards`)
      const boardsData = Array.isArray(response.data) ? response.data : (response.data.boards || [])
      setBoards(boardsData)
      console.log(boardsData)
    } catch (error) {
      console.error("Failed to fetch boards:", error)
    }
  }, [])

  const fetchCardsForBoard = async (boardId) => {
    setLoadingCards(true)
    try {
      const response = await axios.get(`${BASE_URL}/boards/${boardId}/cards`)
      const cardsData = response.data
      const normalizedCards = cardsData.map((card) => ({
        id: card.id,
        message: card.message,
        likes: card.likes ?? card.like_count ?? 0
      }))
      setCards(normalizedCards)
    } catch (error) {
      console.error("Failed to fetch cards:", error)
      setCards([])
    } finally {
      setLoadingCards(false)
    }
  }

  const handleSelectBoard = (boardId) => {
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
  }, [fetchBoards])

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentBoard({})
  }

  const openCreateModal = () => {
    setCurrentBoard({})
    setIsModalOpen(true)
  }

  const openEditModal = (board) => {
    if (isModalOpen) return
    setCurrentBoard(board)
    setIsModalOpen(true)
  }

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
      </header>

      <div className="main-content">
        {/* Left Column - Boards */}
        <section className="boards-section" aria-label="Boards">
          <div className="boards-container">
            <BoardList 
              boards={boards} 
              updateBoard={openEditModal} 
              updateCallback={onUpdate}
              onSelectBoard={handleSelectBoard}
              selectedBoardId={selectedBoardId}
            />
            <button
              onClick={openCreateModal}
              className="primary-action-button create-board-button"
            >
              Create New Board
            </button>
            {isModalOpen && (
              <div className="modal" onClick={closeModal}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <span className="close" onClick={closeModal}>&times;</span>
                  <NewBoardForm existingBoard={currentBoard} updateCallback={onUpdate} />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Right Column - Card Form and Cards */}
        <div className="right-column">
          {selectedBoardId ? (
            <>
              <NewCardForm boardId={selectedBoardId} updateCallback={handleCardCreated} />
              
              <section
                className="cards-section"
                aria-label="Cards for selected board"
              >
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
                        onDelete={() => handleDeleteCard(card.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <p>No cards yet for this board. Create one above!</p>
                )}
              </section>
            </>
          ) : (
            <p className="section-placeholder">Select a board to view and create cards</p>
          )}
        </div>
      </div>

      <footer className="app-footer">
        <p>&copy; 2025 Inspiration Board. All rights reserved.</p>
      </footer>
    </main>
  )
}

export default App;