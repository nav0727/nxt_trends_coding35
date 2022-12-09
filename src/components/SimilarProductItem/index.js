import './index.css'

const SimilarProductItem = props => {
  const {similarData} = props
  const {imageUrl, title, price, rating} = similarData

  return (
    <li className="list-container">
      <div className="similar">
        <img src={imageUrl} alt={title} className="sim-img" />
        <p>{title}</p>
        <p>by {}</p>

        <div className="col">
          <p>Rs {price}/-</p>
          <div className="con">
            <p>{rating}</p>
            <img
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              alt="star"
              className="star"
            />
          </div>
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
