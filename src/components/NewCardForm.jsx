import { useState } from "react";

const BASE_URL = "https://back-end-inspiration-board-vz3n.onrender.com";

const NewCardForm = ({ boardId, updateCallback }) => {
    const [message, setMessage] = useState("");
    const [messageError, setMessageError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();

        const trimmedMessage = message.trim();
        if (!trimmedMessage) {
            setMessageError("Message is required");
            return;
        }

        setIsSubmitting(true);
        setMessageError("");

        try {
            const URL = `${BASE_URL}/boards/${boardId}/cards`;
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message: trimmedMessage })
            };

            const response = await fetch(URL, options);
            console.log("Response status:", response.status);

            if (response.status !== 201) {
                console.error("Failed to create card, status:", response.status);
            } else {

                setMessage("");
                updateCallback();
            }
        } catch (error) {
            console.error("Error creating card:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={onSubmit} className="new-card-form">
            <h3 className="new-card-form-title">
                Create New Card
            </h3>
            <div>
                <label htmlFor="message" className="new-card-form-label">
                    Message: *
                </label>
                <textarea
                    id="message"
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value);
                        if (messageError) setMessageError("");
                    }}
                    rows="3"
                    className="new-card-textarea"
                />
                {messageError && (
                    <div className="new-card-form-error">
                        {messageError}
                    </div>
                )}
            </div>
            <button
                type="submit"
                disabled={isSubmitting}
                className="primary-action-button"
            >
                {isSubmitting ? "Creating..." : "Create Card"}
            </button>
        </form>
    );
};

export default NewCardForm;

