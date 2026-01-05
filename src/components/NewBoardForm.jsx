import { useState } from "react";

// going to do calback before we do any functions
const NewBoardForm = ({ existingBoard = {}, updateCallback }) => {
    const [title, setTitle] = useState(existingBoard.title || "");
    const [owner, setOwner] = useState(existingBoard.owner || "");
    //if you  passed as an object that has at least one entry inside, we're updating it because it means we have existing data
    const updating = Object.entries(existingBoard).length !== 0

    const onSubmit = async (e) => {
        // to not refresh the page onSubmit
        e.preventDefault()

        // corresponds with what we're looking for in API when we create new board
        const data = {
            title,
            owner
        }


        // const URL = "http://127.0.0.1:5000/create_board"
        // changes URL based on if we're updating or creating
        // if we're updating, call update_board & pass id of board being updated-- otherwise, /create_board
        const URL = "http://127.0.0.1:5000/" + (updating ? `update_board/${existingBoard.id}` : "create_board")

        const options = {
            // have to specify when its anything other than GET request
            // if updating use PATCH, if creating use POST
            method: updating ? "PATCH" : "POST",
            headers: {
                // specifying that we're about to submit json data
                "Content-Type": "application/json"
            },
            // const data is a js object, like in python, we have to convert to valid json object
            body: JSON.stringify(data)
        }
        // sends the request
        const response = await fetch(URL, options)
        // if not valid response, alert user of error
        if (response.status !== 201 && response.status !== 200) {
            const data = await response.json()
            alert(data.message)
        } else {
            // tells app.jsx-- hey, we finished this. we created or updated
            // closes modal & allows us to update data we see in board list
            updateCallback()
        }

    }

    return (
        // once we press the submit button we enter the onSubmit function  
        <form onSubmit={onSubmit}>
            <div>
                <label htmlFor="title">Title:</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="owner">Owner:</label>
                <input
                    type="text"
                    id="owner"
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                />
            </div>
            <button type="submit">{updating ? "Update Board" : "Create Board"} </button>
        </form>
    );
};

export default NewBoardForm