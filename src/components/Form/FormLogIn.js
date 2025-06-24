import React, { useState,useEffect } from 'react';
import {
	FormColumn,
	FormWrapper,
	FormInput,
	FormSection,
	FormRow,
	FormLabel,
	FormInputRow,
	FormMessage,
	FormButton,
	FormTitle,
} from './FormStyles';
import axios from 'axios';

import {GoogleLogin} from 'react-google-login';
import {gapi} from 'gapi-script'
import { Container } from '../../globalStyles';
import validateForm from './validateForm';
import Cookies from 'js-cookie';
import useToken from "./useToken"

const DOMAIN = 'https://25xdhfsbmi.execute-api.us-east-2.amazonaws.com/prod'
const SD = 'https://master.d7ue7wu507q2m.amplifyapp.com'
const SD1 = 'http://localhost:3000'
const FormLogIn = (props) => {
	const [name, setName] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
    const [access,setAccess] = useState("denied")
	const setCookie = async(email) => {
		let api = await fetch(`${DOMAIN}/set_cookie/${email}`)
		api = await api.json()
		
		Cookies.set('session_id', api['data'], { expires: 7 }); // expires in 7 days
	  };
	  
	   useEffect(async()=>{
		function start(){
		  gapi.auth2.init({
			'clientId':'615921346526-8gs4b74dja97fje48tv2o459a6g7e9ns.apps.googleusercontent.com'
		  })
		}
		gapi.load('client:auth2',start)

	  },[])
	const handleSubmit = (e) => {
		e.preventDefault();
		const resultError = validateForm({ name, password });

		if (resultError !== null) {
			setError(resultError);
			return;
		}
		setName('');

		setPassword('');
		setError(null);
	};

	const messageVariants = {
		hidden: { y: 30, opacity: 0 },
		animate: { y: 0, opacity: 1, transition: { delay: 0.2, duration: 0.4 } },
	};

	const formData = [
		{ label: 'first name', value: name, onChange: (e) => setName(e.target.value), type: 'text' },
		{
			label: 'Password',
			value: password,
			onChange: (e) => setPassword(e.target.value),
			type: 'password',
		},
		
	];

	const { token, removeToken, setToken } = useToken();
    const loginwithgoogle = async(firstname_google,password) =>{
        
        try{
			let preapi3 = await fetch(`${DOMAIN}/get_last_name_and_email/${firstname_google}`)
			preapi3 = await preapi3.json()
		    let preapi2 = await fetch(`${DOMAIN}/set_cookie/${preapi3.email}`)
			preapi2 = await preapi2.json()
			setCookie(preapi3.email)
					let api = await fetch(`${DOMAIN}/login/`, {
						method: 'POST',
						headers: {
						  'Content-Type': 'application/json'
						},
						body: JSON.stringify({ first_name: firstname_google, password: password })
					  })
                  api = await api.json()
				  setToken(api.access_token)
				  
				  localStorage.setItem('name', firstname_google)
                  console.log(password==api['data'])
                  if(api['data'] == "username not found"){
                    console.log('username not found')
                      alert("username not found")
                  }
                  if(api['data']!='username not found'){
                    setAccess("Granted")
					
					
													
															window.location.replace(SD+'/folders/'+preapi3['email'])
														
													
                  }
                  else{
                    alert('Username not found')
                  }
                  console.log(access)
  
                }catch(err){console.log(err);alert('Account does not exist')}
                          
      }
	return (
		<FormSection style={{ backgroundColor: '#e9f5ff', padding: '60px 0', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
  <Container style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', padding: '30px' }}>
    <FormTitle style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#007bff', fontWeight: 'bold' }}>Welcome Back!</FormTitle>
    <p style={{ fontSize: '1rem', color: '#555', marginBottom: '30px' }}>Log in to access your account</p>
    <FormWrapper>
      <FormMessage>
        <div>
          <GoogleLogin 
            clientId={'615921346526-8gs4b74dja97fje48tv2o459a6g7e9ns.apps.googleusercontent.com'}
            onSuccess={(res)=>loginwithgoogle(res.profileObj['name'],res.profileObj['googleId'])}
            onFailure={(res)=>alert('had trouble logging in, please try again')}
            isSignedIn={false}
            buttonText={'Login with Google'}
            style={{ width: '100%', padding: '15px', fontSize: '1.2rem', borderRadius: '8px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}
          />
        </div>
      </FormMessage>
    </FormWrapper>
  </Container>
</FormSection>
	);
};

export default FormLogIn;
