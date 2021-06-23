import React          from 'react';
import InputField     from './InputField';
import SubmitButton   from './SubmitButton';
import UserStore      from '../stores/UserStore';
// import * as constants from '../constants';

class LoginFrom extends React.Component {

  constructor(props) {
    super(props);

    // this.setState(state => ({...state, username: '', password: '', buttonDisabled: false}));
    this.state = ({
      username: '',
      password: '',
      buttonDisabled: false
    });
  }

  setInputValue(property, val) {
    val = val.trim();
    if (val.length > 40) {
      return;
    }
    // this.setState(state => ({...state, property: val}));
    this.setState({
      [property]: val
    });
  }

  resetForm() {
    this.setState(state => ({...state, username: '', password: '', buttonDisabled: false}));

    // this.state = ({
    //   username: '',
    //   password: '',
    //   buttonDisabled: false
    // });
  }

  async doLogin() {
    if (!this.state.username) {
      return;
    }
    if (!this.state.password) {
      return;
    }
    this.setState(state => ({...state, buttonDisabled: true}));
    // this.setState({
    //   buttonDisabled: true
    // })

    try {

      let res = await fetch('http://localhost:8080/login', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type' : 'application/json'
        },
        mode: 'no-cors',
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password
        })
      });

      let result = await res.json();
      if (result && result.success) {
        UserStore.isLoggedIn = true;
        UserStore.username = result.username;
      } else if (result && !result.success) {
        this.resetForm();
        alert(result.msg);
      }


    } catch(e) {
      console.log(e);
      this.resetForm();
    }
  }

  render() {
    return (
      <div className="loginForm">
        Log in
        
         <InputField 
          type='email'
          placeholder='Username'
          value={this.state.username ? this.state.username : ''}
          onChange={ (val) => this.setInputValue('username', val) }
        />

        <InputField 
          type='password'
          placeholder='Password'
          value={this.state.password ? this.state.password : ''}
          onChange={ (val) => this.setInputValue('password', val) }
        />

        <SubmitButton 
          text='Login'
          disabled={this.state.buttonDisabled}
          onClick={ () => this.doLogin() }
        />
      </div>
    );
  }
}

export default LoginFrom;
