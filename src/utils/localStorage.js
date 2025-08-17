export function getItem(key) {
	let value = localStorage.getItem(key)
	return value ? value : null
}

export function setItem(key, value) {
	return localStorage.setItem(key, value)
}

export function removeItem(key) {
	return localStorage.removeItem(key)
}

// * ACCESS TOKEN
const accessTokenKey = 'access_token'

export function setAccessToken(token) {
	return setItem(accessTokenKey, token)
}

export function getAccessToken() {
	return getItem(accessTokenKey)
}

export function removeAccessToken() {
	return removeItem(accessTokenKey)
}