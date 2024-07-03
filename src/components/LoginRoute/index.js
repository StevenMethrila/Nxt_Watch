import {Component} from 'react'

import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import NxtWatchContext from '../../Context/NxtWatchContext'

import {
  LoginPage,
  LoginCard,
  LogoImage,
  Label,
  InputField,
  ShowPassword,
  Inputbox,
  LoginButton,
  ErrorMessage,
  ShowPasswordContainer,
} from './styledComponents'

class LoginRoute extends Component {
  state = {
    showPasswordStatus: false,
    usernameInput: '',
    passwordInput: '',
    showErrorMessage: false,
    errorMessage: '',
  }

  changeShowPasswordStatus = () => {
    this.setState(prevState => ({
      showPasswordStatus: !prevState.showPasswordStatus,
    }))
  }

  getUsernameInput = event => {
    this.setState({usernameInput: event.target.value})
  }

  getPasswordInput = event => {
    this.setState({passwordInput: event.target.value})
  }

  loginCredentialsSubmission = async event => {
    event.preventDefault()
    const {usernameInput, passwordInput} = this.state
    const userDetails = {username: usernameInput, password: passwordInput}
    const response = await fetch('https://apis.ccbp.in/login', {
      method: 'POST',
      body: JSON.stringify(userDetails),
    })
    const data = await response.json()
    if (response.ok) {
      Cookies.set('jwt_token', data.jwt_token, {expires: 1})
      const {history} = this.props
      history.replace('/')
    } else {
      this.setState({showErrorMessage: true, errorMessage: data.error_msg})
    }
  }

  render() {
    if (Cookies.get('jwt_token') !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <NxtWatchContext.Consumer>
        {value => {
          const {lightTheme, changedAttributesOnThemeChange} = value

          const {showPasswordStatus, showErrorMessage, errorMessage} =
            this.state

          const passwordInputType = showPasswordStatus ? 'text' : 'password'

          const {watchLogoImage, watchLogoImageAlt} =
            changedAttributesOnThemeChange()

          return (
            <LoginPage value={lightTheme}>
              <LoginCard onSubmit={this.loginCredentialsSubmission}>
                <LogoImage src={watchLogoImage} alt={watchLogoImageAlt} />

                <Label value={lightTheme} htmlFor="usernameInputField">
                  USERNAME
                </Label>

                <InputField
                  type="text"
                  id="usernameInputField"
                  placeholder="Username"
                  onChange={this.getUsernameInput}
                />

                <Label value={lightTheme} htmlFor="passwordInputField">
                  PASSWORD
                </Label>

                <InputField
                  type={passwordInputType}
                  id="passwordInputField"
                  placeholder="Password"
                  onChange={this.getPasswordInput}
                />

                <ShowPasswordContainer>
                  <Inputbox
                    id="showPasswordInputField"
                    type="checkbox"
                    onChange={this.changeShowPasswordStatus}
                  />
                  <ShowPassword
                    value={lightTheme}
                    htmlFor="showPasswordInputField"
                  >
                    Show Password
                  </ShowPassword>
                </ShowPasswordContainer>
                <LoginButton type="submit">Login</LoginButton>
                {showErrorMessage && (
                  <ErrorMessage>*{errorMessage}</ErrorMessage>
                )}
              </LoginCard>
            </LoginPage>
          )
        }}
      </NxtWatchContext.Consumer>
    )
  }
}

export default LoginRoute
