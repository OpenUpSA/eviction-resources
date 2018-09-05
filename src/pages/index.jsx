import React, { Component } from 'react'
import Link from 'gatsby-link'
import Button from '@material-ui/core/Button';
import Header from '../components/Header';


class IndexPage extends Component {
  constructor(...props) {
    super(...props);

    this.state = {
      loading: null,
    }

    this.events = {
      setLoading: this.setLoading.bind(this),
    }
  }

  setLoading(loading) {
    this.setState({ loading })
  }

  render() {
    const { loading } = this.state
    const { setLoading } = this.events
    return <Markup {...{ loading, setLoading }} />
  }
}


const urls = [
  '/preview-1/affidavits',
]


function Markup({ loading, setLoading }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header text="Get Started" />
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, padding: '2rem' }}>
        {
          urls.map((url, index) => {
            return (
              <Link key={url} to={url} onClick={() => setLoading(url)}>
                <Button variant="contained" color="primary">
                  {url === loading ? 'Loading...' : `Launch Preview Version ${index + 1}`}
                </Button>
              </Link>
            )
          })
        }
      </div>
    </div>
  )
}


export default IndexPage;