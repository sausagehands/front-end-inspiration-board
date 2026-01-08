import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const BASE_URL = "https://back-end-inspiration-board-vz3n.onrender.com";

// going to do calback before we do any functions
const NewBoardForm = ({ existingBoard = {}, updateCallback }) => {
    const [title, setTitle] = useState(existingBoard.title || "");
    const [owner, setOwner] = useState(existingBoard.owner || "");
    const [isSubmitting, setIsSubmitting] = useState(false);
    //if you  passed as an object that has at least one entry inside, we're updating it because it means we have existing data
    const updating = Object.entries(existingBoard).length !== 0

    // Update form fields when existingBoard changes
    useEffect(() => {
        setTitle(existingBoard.title || "");
        setOwner(existingBoard.owner || "");
    }, [existingBoard])

    const onSubmit = async (e) => {
      
        e.preventDefault()

       
        const trimmedTitle = title.trim();
        const trimmedOwner = owner.trim();
        if (!trimmedTitle || !trimmedOwner) {
            return;
        }

        setIsSubmitting(true);

        // corresponds with what we're looking for in API when we create new board
        const data = {
            title: trimmedTitle,
            owner: trimmedOwner
        }

        try {
            
            const URL = updating
                ? `${BASE_URL}/boards/${existingBoard.id}`
                : `${BASE_URL}/boards`;
            const options = {
                method: updating ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            };

            const response = await fetch(URL, options);
            console.log("Response status:", response.status);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            updateCallback();
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        // once we press the submit button we enter the onSubmit function  
        <form
            onSubmit={onSubmit}
            className="board-form"
        >
            <div>
                <label htmlFor="title" style={{ display: "block", marginBottom: "0.5rem", color: "#e5e7eb", fontWeight: "500" }}>
                    Title: *
                </label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="board-form-input"
                    required
                />
            </div>
            <div>
                <label htmlFor="owner" style={{ display: "block", marginBottom: "0.5rem", color: "#e5e7eb", fontWeight: "500" }}>
                    Owner: *
                </label>
                <input
                    type="text"
                    id="owner"
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    className="board-form-input"
                    required
                />
            </div>
            <button
                type="submit"
                disabled={isSubmitting}
                className="primary-action-button"
            >
                {isSubmitting ? "Submitting..." : (updating ? "Update Board" : "Create Board")}
            </button>
        </form>
    );
};

NewBoardForm.propTypes = {
    existingBoard: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        owner: PropTypes.string.isRequired
    }),
    updateCallback: PropTypes.func.isRequired
};

export default NewBoardForm