import React, { Component } from 'react';
import Credits from './components/Credits';
import NavigationTab from './components/NavigationTab';
import marked from 'marked';

const BEST_PRACTICES = "https://raw.githubusercontent.com/thoughtbot/guides/master/best-practices/README.md"
const CODE_REVIEW = "https://raw.githubusercontent.com/thoughtbot/guides/master/code-review/README.md"
const PAIR_PROGRAMMING = "https://raw.githubusercontent.com/thoughtbot/guides/master/working-together/README.md"

class App extends Component {
  constructor(props) {
    super(props)

    this.state = { text: "", loading: true, active: "best_practices", }
    this.setContent = this.setContent.bind(this)
    this.fetchContent = this.fetchContent.bind(this)
    this.rawMarkup = this.rawMarkup.bind(this)
    this.linkClasses = this.linkClasses.bind(this)
  }

  componentWillMount() {
    let url = this._getUrlFromActiveLink(this.state.active)
    this.fetchContent(url)
  }

  rawMarkup() {
    let rawMarkup = marked(this.state.text, {sanitize: true})
    return { __html: rawMarkup }
  }

  fetchContent(url) {
    fetch(url)
      .then(response => {
        return response.text()
      })
      .then(text => {
        this.setState({ text: text, loading: false, })
      })
  }

  setContent(value) {
    this.setState({ loading: true, active: value }, () => {
      let url = this._getUrlFromActiveLink(value)
      this.fetchContent(url)
    })
  }

  linkClasses(value) {
    let active = this.state.active

    console.log(`active: ${active}`)
    console.log(`value: ${value}`)

    if (active === value) {
      return "mr-2 bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded no-underline"
    }

    return "mr-2 bg-transparent hover:bg-blue-dark text-blue-dark font-semibold hover:text-white py-2 px-4 rounded border border-blue hover:border-transparent no-underline"
  }

  render() {
    let content;

    if (this.state.loading) {
      content = <span> Loading content... </span>
    } else {
      content = <span dangerouslySetInnerHTML={this.rawMarkup()} />
    }

    return (
      <div className="container mx-auto"> 

        <Credits />
        <NavigationTab onSetContent={this.setContent} linkClasses={this.linkClasses} />
        
        <div className="mt-4"> {content} </div>

      </div>
    );
  }

  _getUrlFromActiveLink(active) {
    if (active === "best_practices") {
      return BEST_PRACTICES
    } else if (active === "code_review") {
      return CODE_REVIEW
    } else {
      return PAIR_PROGRAMMING
    }
  }
}

export default App;
