export function getDateTime(timestamp?: number): string {
  return (timestamp ? new Date(timestamp) : new Date()).toJSON().slice(0, 19).replace(/[T]/g, ' ');
}
