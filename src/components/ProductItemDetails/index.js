/* eslint-disable react/no-unknown-property */
import {Component} from 'react'

import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productsList: [],
    similarList: [],
    count: 1,
    status: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProductsList()
  }

  getProductsList = async () => {
    this.setState({status: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    this.setState({status: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    if (jwtToken !== undefined) {
      const apiUrl = `https://apis.ccbp.in/products/${id}`

      const response = await fetch(apiUrl, options)

      const fetchedData = await response.json()
      // console.log(fetchedData)
      const updatedData = {
        id: fetchedData.id,
        imageUrl: fetchedData.image_url,
        title: fetchedData.title,
        availability: fetchedData.availability,
        brand: fetchedData.brand,
        description: fetchedData.description,
        price: fetchedData.price,
        totalReviews: fetchedData.total_reviews,
        rating: fetchedData.rating,
      }
      const similar = fetchedData.similar_products.map(each => ({
        id: each.id,
        imageUrl: each.image_url,
        title: each.title,
        style: each.style,
        price: each.price,
        rating: each.rating,
      }))

      //  console.log(updatedData)
      // console.log(similar)
      this.setState({
        productsList: updatedData,
        similarList: similar,
        status: apiStatusConstants.failure,
      })
    } else {
      this.setState({status: apiStatusConstants.failure})
    }
  }

  onDecrease = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prev => ({count: prev.count - 1}))
    }
  }

  onIncrease = () => {
    this.setState(prev => ({count: prev.count + 1}))
  }

  renderProducts = () => {
    const {productsList, similarList, count} = this.state

    const {
      imageUrl,
      title,
      availability,
      brand,
      description,
      price,
      totalReviews,
      rating,
    } = productsList

    return (
      <div className="cont1">
        <div className="cont2">
          <div className="con1">
            <img src={imageUrl} alt="product" className="image" />
          </div>
          <div className="con1">
            <h4>{title}</h4>
            <p>Rs {price}</p>
            <div className="fl">
              <div className="con">
                <p>{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                />
              </div>
              <p className="review">{totalReviews}Reviews</p>
            </div>
            <p className="desc"> {description}</p>
            <p>Available: {availability}</p>
            <p>Brand: {brand}</p>
            <hr />

            <div>
              <div className="cont2">
                <button
                  type="button"
                  onClick={this.onDecrease}
                  testid="minus"
                  alt="minus"
                  className="btns"
                >
                  <BsDashSquare />
                </button>
                <p>{count} </p>
                <button
                  type="button"
                  onClick={this.onIncrease}
                  testid="plus"
                  alt="plus"
                  className="btns"
                >
                  <BsPlusSquare />
                </button>
              </div>
              <button type="button" className="btn">
                ADD TO CART
              </button>
            </div>
          </div>
        </div>
        <h1 className="pro">Similar Products</h1>
        <ul className="ul-con">
          {similarList.map(each => (
            <SimilarProductItem key={each.id} similarData={each} />
          ))}
        </ul>
      </div>
    )
  }

  renderFailure = () => (
    <div className="fail-con">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="error view"
        className="fail-image"
      />
      <Link to="/products">
        <button type="button" className="btn">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderProgress = () => (
    <div testid="loader" className="fail-con">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderAll = () => {
    const {status} = this.state

    switch (status) {
      case apiStatusConstants.success:
        return this.renderProducts()
      case apiStatusConstants.failure:
        return this.renderFailure()
      case apiStatusConstants.inProgress:
        return this.renderProgress()
      default:
        return null
    }
  }

  render() {
    return <div className="bg-con">{this.renderAll()}</div>
  }
}

export default ProductItemDetails
