import { useState, useEffect } from 'react'
import './App.css'
import BoardList from './components/board'
import NewBoardForm from './components/NewBoardForm'


const URL = "http://127.0.0.1:5000/boards"

function App() {
    const [boards, setBoards] = useState([])

    // its supposed to only show form on create or something? have to research. set to true to toggle modal
    const [isModalOpen, setIsModalOpen] = useState(false)
    // stores board we're currently editing
    const [currentBoard, setCurrentBoard] = useState({})

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

    return <>
    <BoardList boards={boards} updateBoard={openEditModal} updateCallback={onUpdate}/>
    <button onClick={openCreateModal}>Create New Board</button>
    {isModalOpen && (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={closeModal}>&times;</span>
                <NewBoardForm existingBoard={currentBoard} updateCallback={onUpdate} />
            </div>
        </div>
    )}
</>

}

export default App
