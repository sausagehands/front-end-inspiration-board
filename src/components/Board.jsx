import React from "react";

// whenever we perform update we'll call update callback & whenever we want to update contact, we'll call function with contact we want to update
const BoardList = ({ boards, updateBoard, updateCallback }) => {
    const onDelete = async (id) => {
        try {
            const options = {
                method: "DELETE"
            }
            const response = await fetch(`http://127.0.0.1:5000/delete_board/${id}`, options)
            if (response.status === 200) {
                updateCallback()
            } else {
                console.error("Failed to delete")
            }
        } catch (error) {
            alert(error)
        }
    }


    // how it renders our boards
    return <div>
        <h2>Boards</h2>
        {/* presents it as a table-- what are the other ways to present info? */}
        <table>
            <thead>
                <tr>
                    <th>board name</th>
                    <th>board owner</th>
                </tr>
            </thead>
            <tbody>
                {/* function maps all the boards we have & returns new row for them */}
                {boards.map((board) => (
                    // use key whenever we have dynamic data
                    <tr key={board.id}>
                        {/* table data for all the entries i want to show */}
                        <td>{board.title}</td>
                        <td>{board.owner}</td>
                        <td>
                            {/* clicking the button calls updateBoard with the board we want updated-- this opens the modal that allows us to update contact */}
                            <button onClick={() => updateBoard(board)}>Update</button>
                            <button onClick={() => onDelete(board.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
}

export default BoardList;