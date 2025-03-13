export function getDateTime() {
    return new Date().toJSON().slice(0, 19).replace(/[T]/g, " ");
}
