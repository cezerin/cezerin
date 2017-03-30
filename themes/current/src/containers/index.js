import React from 'react'
import Helmet from 'react-helmet'

const IndexContainer = (props) => {
  const {pageDetails} = props.state;

  return (
    <div>
      <Helmet title={pageDetails.meta_title} meta={[
        {
          "name": "description",
          "content": pageDetails.meta_description
        }, {
          "property": "og:type",
          "content": "article"
        }
      ]} link={[{
          "rel": "canonical",
          "href": pageDetails.url
        }
      ]}/>

      <section className="section">
        <div className="container">
          <div className="columns is-multiline is-mobile">

            <div className="column is-6-tablet is-12-mobile">
              <div className="card">
                <div className="card-image">
                  <figure className="image">
                    <img src="/assets/images/bg_slide_1.jpg" />
                  </figure>
                </div>
                <div className="card-content">
                  <div className="content">
                    <h3 className="title is-6">Category name</h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="column is-6-tablet is-12-mobile">
              <div className="card">
                <div className="card-image">
                  <figure className="image">
                    <img src="/assets/images/bg_slide_2.jpg" />
                  </figure>
                </div>
                <div className="card-content">
                  <div className="content">
                    <h3 className="title is-6">Category name</h3>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="content">
            <div dangerouslySetInnerHTML={{
              __html: pageDetails.content
            }}/>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="notification">
            <div className="columns is-mobile">

              <div className="column is-4 has-text-centered">
                <img src="/assets/images/delivery-cart.svg" alt="" style={{ width: 64 }} />
                <div className="title is-6">
                  Free shipping on orders over USD $89
                </div>
              </div>

              <div className="column is-4 has-text-centered">
                <img src="/assets/images/credit-card.svg" alt="" style={{ width: 64 }} />
                <div className="title is-6">
                  We accept credit cards, PayPal, and bank wires
                </div>
              </div>

              <div className="column is-4 has-text-centered">
                <img src="/assets/images/open.svg" alt="" style={{ width: 64 }} />
                <div className="title is-6">
                  Open 24/7
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default IndexContainer
