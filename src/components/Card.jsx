import PropTypes from 'prop-types';
import './Card.css'

function Card({ card, onLike }) {
  if (!card) return null

  const { message, likes, author, tag } = card

  return (
    <article className="inspo-card" aria-label="Inspiration card">
      {tag && (
        <header className="inspo-card-header">
          <p className="inspo-card-tag">{tag}</p>
        </header>
      )}

      <p className="inspo-card-message">{message}</p>

      <footer className="inspo-card-footer">
        <div className="inspo-card-meta">
          {author && <span className="inspo-card-author">By {author}</span>}
        </div>
        <button
          type="button"
          className="inspo-card-like"
          onClick={onLike}
          aria-label={`Like card: ${likes} likes`}
        >
          <span aria-hidden="true">❤️ {likes}</span>
        </button>
      </footer>
    </article>
  )
}

Card.propTypes = {
  card: PropTypes.object.isRequired,
  onLike: PropTypes.func.isRequired
}

export default Card