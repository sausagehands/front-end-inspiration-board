import { useState, useEffect } from "react";

// going to do calback before we do any functions
const NewBoardForm = ({ existingBoard = {}, updateCallback }) => {
    const [title, setTitle] = useState(existingBoard.title || "");
    const [owner, setOwner] = useState(existingBoard.owner || "");
    //if you  passed as an object that has at least one entry inside, we're updating it because it means we have existing data
    const updating = Object.entries(existingBoard).length !== 0

    // Update form fields when existingBoard changes
    useEffect(() => {
        setTitle(existingBoard.title || "");
        setOwner(existingBoard.owner || "");
    }, [existingBoard])

    const onSubmit = async (e) => {
        // to not refresh the page onSubmit
        e.preventDefault()

        // Validate form fields
        if (!title.trim() || !owner.trim()) {
            alert("Please fill in both title and owner fields")
            return
        }

        // corresponds with what we're looking for in API when we create new board
        const data = {
            title: title.trim(),
            owner: owner.trim()
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

        try {
            console.log("Submitting form:", { URL, data, updating })
            // sends the request
            const response = await fetch(URL, options)
            console.log("Response status:", response.status)
            
            // if not valid response, alert user of error
            if (response.status !== 201 && response.status !== 200) {
                let errorMessage = "Failed to create/update board"
                try {
                    const errorData = await response.json()
                    errorMessage = errorData.message || errorMessage
                    console.error("Error response:", errorData)
                } catch (parseError) {
                    errorMessage = `Error: ${response.status} ${response.statusText}`
                    console.error("Failed to parse error response:", parseError)
                }
                alert(errorMessage)
            } else {
                console.log("Board created/updated successfully")
                // tells app.jsx-- hey, we finished this. we created or updated
                // closes modal & allows us to update data we see in board list
                updateCallback()
            }
        } catch (error) {
            console.error("Error submitting form:", error)
            alert(`Network error: ${error.message}. Please check if the backend server is running.`)
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