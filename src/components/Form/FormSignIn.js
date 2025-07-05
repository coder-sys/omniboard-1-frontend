import React, { useState, useEffect } from 'react';
import {
	FormWrapper,
	FormSection,
	FormMessage,
	FormTitle,
} from './FormStyles';

import { GoogleLogin } from 'react-google-login';
import { gapi } from 'gapi-script';
import { Container } from '../../globalStyles';
import validateForm from './validateForm';

const FormSignIn = () => {
	const [name, setName] = useState('');
	const [lname, setLname] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPass, setConfirmPass] = useState('');
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);

	const signinwithgoogle = async (firstname, lastname, __password__, __email__) => {
		try {
			let verifyRes = await fetch(`https://omniboard-apis.afd.enterprises/verify_sign_in_information/${__email__}/${firstname}/${lastname}`);
			let verifyJson = await verifyRes.json();

			let domain = __email__.split('@')[1];

			let whitelistRes = await fetch(`https://omniboard-apis.afd.enterprises/whitelisted_domains`);
			let whitelistJson = await whitelistRes.json();
			let whitelistedDomains = whitelistJson['data'];

			if (verifyJson['data'] === 'good to go!') {
				if (whitelistedDomains.includes(domain)) {
					let signInRes = await fetch(`https://omniboard-apis.afd.enterprises/sign_in/${firstname}/${lastname}/${__password__}/${__email__}`);
					let signInJson = await signInRes.json();
					window.location.replace('https://omniboard.afd.enterprises/login');
					return signInJson;
				} else {
					alert('Use company email to sign in');
				}
			} else {
				alert('You already have an account associated with this email');
			}
		} catch (err) {
			console.error('Error during Google sign-in:', err);
			alert('There was an issue signing in. Please try again later.');
		}
	};

	useEffect(() => {
		function start() {
			gapi.auth2.init({
				clientId: '615921346526-8gs4b74dja97fje48tv2o459a6g7e9ns.apps.googleusercontent.com',
			});
		}
		gapi.load('client:auth2', start);
	}, []);

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

	return (
		<FormSection style={{ backgroundColor: '#e9f5ff', padding: '60px 0', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
			<Container style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', padding: '30px' }}>
				<FormTitle style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#007bff', fontWeight: 'bold' }}>Join Us!</FormTitle>
				<p style={{ fontSize: '1rem', color: '#555', marginBottom: '30px' }}>Sign up to create your account</p>

				<FormWrapper>
					<FormMessage>
						<GoogleLogin
							clientId="615921346526-8gs4b74dja97fje48tv2o459a6g7e9ns.apps.googleusercontent.com"
							onSuccess={(res) =>
								signinwithgoogle(
									res.profileObj?.name,
									res.profileObj?.givenName,
									res.profileObj?.googleId,
									res.profileObj?.email
								)
							}
							onFailure={() => alert('If you are using Google to sign up, please try again later')}
							isSignedIn={false}
							cookiePolicy="single_host_origin"
							buttonText="Sign up with Google"
							style={{
								width: '100%',
								padding: '15px',
								fontSize: '1.2rem',
								borderRadius: '8px',
								backgroundColor: '#007bff',
								color: '#fff',
								border: 'none',
								cursor: 'pointer',
							}}
						/>
					</FormMessage>
				</FormWrapper>
			</Container>
		</FormSection>
	);
};

export default FormSignIn;
