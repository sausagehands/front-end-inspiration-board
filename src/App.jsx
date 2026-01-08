import { useEffect, useState, useCallback } from 'react';
import NewBoardForm from './components/NewBoardForm.jsx';
import NewCardForm from './components/NewCardForm.jsx';
import BoardList from './components/Board';
import Card from './components/Card.jsx';
import './App.css';


const BASE_URL = "https://back-end-inspiration-board-vz3n.onrender.com";

function App() {
  const [boards, setBoards] = useState([])
  // its supposed to only show form on create or something? have to research. set to true to toggle modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  // stores board we're currently editing
  const [currentBoard, setCurrentBoard] = useState({})
  const [cards, setCards] = useState([])
  const [selectedBoardId, setSelectedBoardId] = useState(null)
  const [loadingCards, setLoadingCards] = useState(false)

  const handleLikeCard = async (cardId) => {
    try {
      const response = await fetch(`${BASE_URL}/cards/${cardId}/like`, {
        method: "PATCH",
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()
      const newLikesFromApi = data.card?.likes ?? data.likes

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
      const response = await fetch(`${BASE_URL}/cards/${cardId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

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
      const response = await fetch(`${BASE_URL}/boards`)
      const data = await response.json()
      const boardsData = Array.isArray(data) ? data : (data.boards || [])
      setBoards(boardsData)
      console.log(boardsData)
    } catch (error) {
      console.error("Failed to fetch boards:", error)
    }
  }, [])

  const fetchCardsForBoard = async (boardId) => {
    setLoadingCards(true)
    try {

      const response = await fetch(`${BASE_URL}/boards/${boardId}/cards`)
      const data = await response.json()
      const cardsData = data
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
  }, [fetchBoards])

  const closeModal = () => {
    setIsModalOpen(false)
    // resets currentBoard object when closing modal
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
        <p>C24 - Group 6 - Madi, Lexy, Alice, Bianca</p>
      </footer>
    </main>
  )
}

export default App;