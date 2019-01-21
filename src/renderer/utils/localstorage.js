
export function setLocal(name, data) {
    return localStorage.setItem(name, data)
}
export function getLocal(name) {
    return localStorage.getItem(name)
}

export function removeLocal(name) {
    return localStorage.removeItem(name);
}