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

import {GoogleLogin} from 'react-google-login';
import {gapi} from 'gapi-script'
import { Container } from '../../globalStyles';
import sign_in_function from '../../functions/sign_in_function';
import validateForm from './validateForm';

const DOMAIN = 'https://25xdhfsbmi.execute-api.us-east-2.amazonaws.com/prod'
const SD1 = 'http://localhost:3000'
const FormSignIn = () => {
	const [name, setName] = useState('');
	const [lname, setLname] = useState('')
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPass, setConfirmPass] = useState('');
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const signinwithgoogle = async(firstname,lastname,__password__,__email__) =>{
		let __api__ = await fetch(`${DOMAIN}/verify_sign_in_information/${__email__}/${firstname}/${lastname}`)
	  __api__ = await __api__.json()
	  let user_type = ''
	  let disected_address = __email__.split('@')[1]
	  console.log(disected_address)
	  let white_list = await fetch(`${DOMAIN}/whitelisted_domains`)
	  white_list = await white_list.json()
	  white_list = white_list['data']

	  if(__api__['data'] == 'good to go!'){
		  user_type = 'student'
		
		  user_type = 'teacher'

		if(white_list.includes(disected_address)){
			let api = await fetch(`${DOMAIN}/sign_in/${firstname}/${lastname}/${__password__}/${__email__}`)
			let api_json = await api.json()
			window.location.replace(SD1+'/login')
			return api_json
			}
			else{alert('Use company email to sign in')}
			 
		  
			}     else{  
				 alert('You have an account associated with this email')
		  }
	  }
	   useEffect(()=>{
		function start(){
		  gapi.auth2.init({
			'clientId':'615921346526-8gs4b74dja97fje48tv2o459a6g7e9ns.apps.googleusercontent.com'
		  })
		}
		gapi.load('client:auth2',start)
	  })
	const handleSubmit = (e) => {
		e.preventDefault();
		const resultError = validateForm({ name, email, password, confirmPass });

		if (resultError !== null) {
			setError(resultError);
			return;
		}
		setName('');
		setLname('');

		setEmail('');
		setPassword('');
		setConfirmPass('');
		setError(null);
	};

	const messageVariants = {
		hidden: { y: 30, opacity: 0 },
		animate: { y: 0, opacity: 1, transition: { delay: 0.2, duration: 0.4 } },
	};

	const formData = [
		{ label: 'Name', value: name, onChange: (e) => setName(e.target.value), type: 'text' },
		{label: 'Last Name',value:lname,onChange:(e)=>setLname(e.target.value),type:'text'},
		{ label: 'Email', value: email, onChange: (e) => setEmail(e.target.value), type: 'email' },
		{
			label: 'Password',
			value: password,
			onChange: (e) => setPassword(e.target.value),
			type: 'password',
		},
		{
			label: 'Confirm Password',
			value: confirmPass,
			onChange: (e) => setConfirmPass(e.target.value),
			type: 'password',
		},
	];
	return (
		<FormSection style={{ backgroundColor: '#e9f5ff', padding: '60px 0', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
			<Container style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', padding: '30px' }}>
				<FormTitle style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#007bff', fontWeight: 'bold' }}>Join Us!</FormTitle>
				<p style={{ fontSize: '1rem', color: '#555', marginBottom: '30px' }}>Sign up to create your account</p>
				<FormWrapper>
					<FormMessage>
						<div>
							<GoogleLogin 
								clientId={'615921346526-8gs4b74dja97fje48tv2o459a6g7e9ns.apps.googleusercontent.com'}
								onSuccess={(res)=>signinwithgoogle(res.profileObj['name'],res.profileObj['givenName'],res.profileObj['googleId'],res.profileObj['email'])}
								onFailure={(res)=>alert('if you are using Google to sign up, please try again later')}
								isSignedIn={false}
								buttonText={'Sign up with Google'}
								style={{ width: '100%', padding: '15px', fontSize: '1.2rem', borderRadius: '8px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}
							/>
						</div>
					</FormMessage>
				</FormWrapper>
			</Container>
		</FormSection>
	);
};

export default FormSignIn;
