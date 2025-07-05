import React from 'react';

const CustomLogo = () => {
	return (
		<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
			<img
				src="/assets/logo.png"
				alt="Omniboard Logo"
				style={{ width: '40px', height: '40px' }}
			/>
			<span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#004080' }}>Omniboard</span>
		</div>
	);
};

export default CustomLogo;
