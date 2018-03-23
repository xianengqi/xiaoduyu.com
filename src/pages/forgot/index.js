import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { sendEmailCaptcha, resetPasswordByCaptcha } from '../../actions/account';
import { addCaptcha }  from '../../actions/captcha';
import { signin } from '../../actions/sign';

import Shell from '../../components/shell';
import Meta from '../../components/meta';
import CaptchaButton from '../../components/captcha-button';


@connect(
  (state, props) => ({
  }),
  dispatch => ({
    sendEmailCaptcha: bindActionCreators(sendEmailCaptcha, dispatch),
    resetPasswordByCaptcha: bindActionCreators(resetPasswordByCaptcha, dispatch),
    signin: bindActionCreators(signin, dispatch)
  })
)
export class Forgot extends Component {

  constructor(props) {
    super(props)
    this.submitResetPassword = this.submitResetPassword.bind(this)
    this.sendCaptcha = this.sendCaptcha.bind(this)
  }

  submitResetPassword() {
    const { account, captcha, newPassword, confirmNewPassword } = this.refs
    const { resetPasswordByCaptcha, signin } = this.props

    if (!account.value) return account.focus()
    if (!captcha.value) return captcha.focus()
    if (!newPassword.value) return newPassword.focus()
    if (!confirmNewPassword.value) return confirmNewPassword.focus()
    if (newPassword.value != confirmNewPassword.value) return alert('两次密码输入不一致')

    let option = {
      captcha: captcha.value,
      newPassword: newPassword.value,
      callback: function(result) {

        if (result.success) {
          alert('密码修改成功')

          let option = { password: newPassword.value }

          if (account.value.indexOf('@') != -1) {
            option.email = account.value
          } else {
            option.phone = account.value
          }

          signin(option, ()=>{
            window.location.href = '/'
          })

        } else {
          alert(result.error || '密码修改失败')
        }
      }
    }

    if (account.value.indexOf('@') != -1) {
      option.email = account.value
    } else {
      option.phone = account.value
    }

    resetPasswordByCaptcha(option)

  }

  sendCaptcha(callback) {

    const { account } = this.refs

    if (!account.value) return account.focus()

    let params = { type: 'forgot' }

    if (account.value.indexOf('@') != -1) {
      params.email = account.value
    } else {
      params.phone = account.value
    }

    callback(params)

  }

  render() {

    return (
      <div>
        <Meta title="忘记密码" />
        
        <form>
          <div className="form-group">
            <label for="exampleInputEmail1">请输入你的注册手机号或邮箱</label>
            <input type="text" className="form-control" placeholder="请输入你的注册手机号或邮箱" ref="account" />
          </div>
          <div className="form-group">
            <label for="exampleInputPassword1">输入验证码</label>
            <CaptchaButton onClick={this.sendCaptcha} />
            <input type="text" className="form-control" placeholder="输入验证码" ref="captcha" />
          </div>
          <div className="form-group">
            <label for="exampleInputPassword1">新密码</label>
            <input type="password" className="form-control" placeholder="新密码" ref="newPassword" />
          </div>
          <div className="form-group">
            <label for="exampleInputPassword1">重复新密码</label>
            <input type="password" className="form-control" placeholder="重复新密码" ref="confirmNewPassword" />
          </div>
          <button type="submit" className="btn btn-primary" onClick={this.submitResetPassword}>提交</button>
        </form>

        {/*
        <div className="container">

          <div className="list">
            <input type="text" placeholder="请输入你的注册手机号或邮箱" ref="account" />
            <input type="text" placeholder="输入验证码" ref="captcha" />
            <div>
              <CaptchaButton onClick={this.sendCaptcha} />
            </div>
            <input type="password" placeholder="新密码" ref="newPassword" />
            <input type="password" placeholder="重复新密码" ref="confirmNewPassword" />
          </div>

          <div className="list">
            <input type="submit" className="button center" onClick={this.submitResetPassword} value="提交" />
          </div>

        </div>
        */}
      </div>
    )

  }

}

export default Shell(Forgot)
