import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'

import Shell from '../../../../shell'
import PeopleList from '../../../../components/people-list'

import { loadPeopleById, loadFans } from '../../../../actions/people'

class PeopleFans extends React.Component {

  // 服务器预加载内容
  static loadData(option, callback) {

    const { id } = option.props.params
    const { dispatch } = option.store

    dispatch(loadPeopleById({
      id,
      callback:(people)=>{
        if (!people) {
          callback('not found')
          return;
        }
        dispatch(loadFans({ name:'fans-'+id, filters:{ user_id: id }, callback:()=>{
          callback()
        }}))
      }
    }))

  }

  constructor(props) {
    super(props)
  }

  render() {

    const { people } = this.props

    return (
      <div>
        <PeopleList name={people._id} filters={{ user_id: people._id }} type={"fans"} />
      </div>
    )

  }

}

export default Shell(PeopleFans)
