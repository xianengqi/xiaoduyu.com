import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router'

import styles from './style.scss'

import arriveFooter from '../../common/arrive-footer'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { showSign } from '../../actions/sign'
import { getAccessToken } from '../../reducers/user'
import { loadAnswerList } from '../../actions/answer-list'
import { getAnswerListByName } from '../../reducers/answer-list'

import ListLoading from '../list-loading'
import AnswerItem from '../answer-item'
import CommentItem from '../comment-item'

class AnswerList extends Component {

  constructor(props) {
    super(props)

    const { name, filters } = this.props
    this.state = {
      name: name,
      filters: filters
    }
    this.triggerLoad = this._triggerLoad.bind(this)
  }

  componentWillMount() {

    const self = this
    const { loadAnswerList, answerList } = this.props

    if (!answerList.data) {
      self.triggerLoad()
    }

    arriveFooter.add(this.state.name, ()=>{
      self.triggerLoad()
    })

  }

  componentWillUnmount() {
    arriveFooter.remove(this.state.name)
  }

  _triggerLoad(callback) {
    const { loadAnswerList } = this.props
    const { name, filters } = this.state
    loadAnswerList({ name, filters })
  }

  render () {

    let { answerList, isSignin, showSign } = this.props

    if (!answerList.data) {
      return (<div></div>)
    }

    return (
      <div>
        <div className="container">
          <div className={styles.answers}>
            {answerList.data.map((answer)=>{
              return (<div key={answer._id}>
                <AnswerItem answer={answer} />
                <div className={styles.comments}>
                  {answer.comments && answer.comments.map(comment=>{
                    return (<div key={comment._id}><CommentItem comment={comment} /></div>)
                  })}
                  {answer.comment_count && answer.comments.length < answer.comment_count ? <div>
                    <Link to={`/answer/${answer._id}`}>还有 {answer.comment_count - answer.comments.length} 条评论，查看全部</Link>
                    </div> : null}
                </div>
              </div>)
            })}
          </div>
          <ListLoading loading={answerList.loading} more={answerList.more} handleLoad={this.triggerLoad} />
        </div>
      </div>
    )
  }
}

AnswerList.propTypes = {
  answerList: PropTypes.object.isRequired,
  loadAnswerList: PropTypes.func.isRequired,
  showSign: PropTypes.func.isRequired
}

function mapStateToProps(state, props) {
  const name = props.name
  return {
    answerList: getAnswerListByName(state, name),
    isSignin: getAccessToken(state)
  }
}

function mapDispatchToProps(dispatch, props) {
  return {
    showSign: bindActionCreators(showSign, dispatch),
    loadAnswerList: bindActionCreators(loadAnswerList, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnswerList)
