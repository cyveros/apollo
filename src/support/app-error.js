class AppError extends Error
{
	set status(code) {
		this.status = code;
	}

	get status() {
		return this.status;
	}
}

function AppErrorHandle(message, status) {
	let err = new AppError(message);

	err.status = status;

	return err;
}

export default AppErrorHandle;