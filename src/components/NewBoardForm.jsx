import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

const NewBoardForm = ({ existingBoard = {}, updateCallback }) => {
    const [title, setTitle] = useState(existingBoard.title || "");
    const [owner, setOwner] = useState(existingBoard.owner || "");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const updating = Object.entries(existingBoard).length !== 0

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

        const data = {
            title: trimmedTitle,
            owner: trimmedOwner
        }

        try {
            const url = updating
                ? `${BASE_URL}/boards/${existingBoard.id}`
                : `${BASE_URL}/boards`;
            
            if (updating) {
                await axios.put(url, data);
            } else {
                await axios.post(url, data);
            }
            
            updateCallback();
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
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
        id: PropTypes.number,
        title: PropTypes.string,
        owner: PropTypes.string
    }),
    updateCallback: PropTypes.func.isRequired
};

export default NewBoardForm;