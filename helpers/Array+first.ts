declare global {
  interface Array<T> {
    first(): T | undefined
  }
}

Array.prototype.first = function first(): Element | undefined {
  if (this.length > 0) {
    return this[0]
  } else {
    return undefined
  }
}

export {}
