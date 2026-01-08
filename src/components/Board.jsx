import PropTypes from "prop-types";
import axios from 'axios';
import './Board.css';

const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

const BoardList = ({ boards, updateBoard, updateCallback, onSelectBoard, selectedBoardId }) => {
    const onDelete = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/boards/${id}`)
            updateCallback();
        } catch (error) {
            console.error("Failed to delete board:", error);
        }
    }

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
    selectedBoardId: PropTypes.number
};

export default BoardList;