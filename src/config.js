
const config = {
	env: process.env.NODE_ENV || 'development',
	jwtSecret: process.env.JWT_SECRET_KEY || '0a6b944d-d2fb-46fc-a85e-0295c986cd9f',
	db: process.env.MONGODB_URI || 'mongodb://localhost:4200/apollo',
	port: process.env.PORT || 3000
};

export default config;