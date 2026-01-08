import React from "react";
import './Board.css';
import PropTypes from "prop-types";


const BASE_URL = "https://back-end-inspiration-board-vz3n.onrender.com";

// whenever we perform update we'll call update callback & whenever we want to update contact, we'll call function with contact we want to update
const BoardList = ({ boards, updateBoard, updateCallback, onSelectBoard, selectedBoardId }) => {
    const onDelete = async (id) => {
        try {
            const options = {
                method: "DELETE"
            };
            const response = await fetch(`${BASE_URL}/boards/${id}`, options);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`)
            }
            updateCallback();
        } catch (error) {
            console.error("Failed to delete board:", error);
        }
    }
// how it renders our boards
    return <div className="board-list">
        <h2>Boards</h2>
        <table>
            <thead>
                <tr>
                    <th>board name</th>
                    <th>board owner</th>
                    <th>actions</th>
                </tr>
            </thead>
            <tbody>
                {boards.map((board) => (               
                    <tr 
                        key={board.id}
                        className={selectedBoardId === board.id ? 'selected-board' : ''}
                    >
                        <td 
                            onClick={() => onSelectBoard(board.id)}
                            style={{ cursor: 'pointer' }}
                        >
                            {board.title}
                        </td>
                        <td 
                            onClick={() => onSelectBoard(board.id)}
                            style={{ cursor: 'pointer' }}
                        >
                            {board.owner}
                        </td>
                        <td>
                            <button onClick={() => updateBoard(board)}>Update</button>
                            <button onClick={() => onDelete(board.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
}

BoardList.propTypes = {
    boards: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            owner: PropTypes.string.isRequired
        })
    ).isRequired,
    updateBoard: PropTypes.func.isRequired,
    updateCallback: PropTypes.func.isRequired,
    onSelectBoard: PropTypes.func.isRequired,
    selectedBoardId: PropTypes.number.isRequired
};

export default BoardList;
