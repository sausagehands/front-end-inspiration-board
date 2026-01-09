import PropTypes from 'prop-types';
import './Card.css'

function Card({ card, onLike, onDelete }) {
  if (!card) return null

  const { message, likes } = card

  return (
    <article className="inspo-card" aria-label="Inspiration card">
      <p className="inspo-card-message">{message}</p>

      <footer className="inspo-card-footer">
        <div className="inspo-card-actions">
          {onDelete && (
            <button
              type="button"
              className="inspo-card-delete"
              onClick={onDelete}
              aria-label="Delete card"
            >
              <span aria-hidden="true">🗑️</span>
            </button>
          )}
          <button
            type="button"
            className="inspo-card-like"
            onClick={onLike}
            aria-label={`Like card: ${likes} likes`}
          >
            <span aria-hidden="true">❤️ {likes}</span>
          </button>
        </div>
      </footer>
    </article>
  )
}

Card.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.number,
    message: PropTypes.string.isRequired,
    likes: PropTypes.number
  }).isRequired,
  onLike: PropTypes.func.isRequired,
  onDelete: PropTypes.func
}

export default Card

