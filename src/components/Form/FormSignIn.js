import React, { useState, useEffect } from 'react';
import {
	FormWrapper,
	FormSection,
	FormMessage,
	FormButton,
	FormTitle,
} from './FormStyles';

import { GoogleLogin } from 'react-google-login';
import { gapi } from 'gapi-script';
import { Container } from '../../globalStyles';
import validateForm from './validateForm';

// 🔥 Firebase SDK setup
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, child } from 'firebase/database';

// Firebase config — your provided values
const firebaseConfig = {
	apiKey: "AIzaSyBpqlqb0w-AkvamtA1RqbPCI6j-Vt8zrVg",
	authDomain: "omniboard-f7c9b.firebaseapp.com",
	databaseURL: "https://omniboard-f7c9b-default-rtdb.firebaseio.com",
	projectId: "omniboard-f7c9b",
	storageBucket: "omniboard-f7c9b.firebasestorage.app",
	messagingSenderId: "137032677402",
	appId: "1:137032677402:web:bb883c70db916233bfb9a3"
};

// Init Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

const DOMAIN = 'https://omniboard-apis.afd.enterprises';
const SD1 = 'https://master.d25nukl6hjw7rl.amplifyapp.com';

const FormSignIn = () => {
	const [name, setName] = useState('');
	const [lname, setLname] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPass, setConfirmPass] = useState('');
	const [error, setError] = useState(null);

	const signinwithgoogle = async (firstname, lastname, __password__, __email__) => {
		let __api__ = await fetch(`${DOMAIN}/verify_sign_in_information/${__email__}/${firstname}/${lastname}`);
		__api__ = await __api__.json();
		let disected_address = __email__.split('@')[1];
		let white_list = await fetch(`${DOMAIN}/whitelisted_domains`);
		white_list = await white_list.json();
		white_list = white_list['data'];

		if (__api__['data'] === 'good to go!') {
			if (white_list.includes(disected_address)) {
				try {
					// 🔐 Hash the password using SHA-256
					const encoder = new TextEncoder();
					const data = encoder.encode(__password__ + 'somesalt'); // Replace with real salt in production
					const hashBuffer = await crypto.subtle.digest('SHA-256', data);
					const hashArray = Array.from(new Uint8Array(hashBuffer));
					const hashedPassword = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

					const dbRef = ref(db);

					// Get current value of "n"
					const snapshot = await get(child(dbRef, 'n'));
					let current_n = snapshot.exists() ? snapshot.val() : 0;

					// Increment "n"
					await set(child(dbRef, 'n'), current_n + 1);

					// Store user in Firebase
					await set(child(dbRef, `Users/${firstname}`), {
						firstname: firstname,
						lastname: lastname,
						password: hashedPassword,
						email: __email__,
						index: current_n + 1,
					});

					window.location.replace(`${SD1}/login`);
				} catch (error) {
					console.error('Error during sign-in:', error);
					alert('An error occurred while signing in. Please try again later.');
				}
			} else {
				alert('Use company email to sign in');
			}
		} else {
			alert('You have an account associated with this email');
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
		<FormSection
			style={{
				backgroundColor: '#e9f5ff',
				padding: '60px 0',
				minHeight: '100vh',
				display: 'flex',
				alignItems: 'center',
			}}
		>
			<Container
				style={{
					maxWidth: '500px',
					margin: '0 auto',
					textAlign: 'center',
					backgroundColor: '#ffffff',
					borderRadius: '10px',
					boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
					padding: '30px',
				}}
			>
				<FormTitle style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#007bff', fontWeight: 'bold' }}>
					Join Us!
				</FormTitle>
				<p style={{ fontSize: '1rem', color: '#555', marginBottom: '30px' }}>Sign up to create your account</p>
				<FormWrapper>
					<FormMessage>
						<div>
							<GoogleLogin
								clientId={'615921346526-8gs4b74dja97fje48tv2o459a6g7e9ns.apps.googleusercontent.com'}
								onSuccess={(res) =>
									signinwithgoogle(
										res.profileObj['name'],
										res.profileObj['givenName'],
										res.profileObj['googleId'],
										res.profileObj['email']
									)
								}
								onFailure={(res) => alert('If you are using Google to sign up, please try again later')}
								isSignedIn={false}
								buttonText={'Sign up with Google'}
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
						</div>
					</FormMessage>
				</FormWrapper>
			</Container>
		</FormSection>
	);
};

export default FormSignIn;
