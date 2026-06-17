Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: () => ({
    font: '',
    measureText: (text: string | null) => ({ width: (text ?? '').length * 10 })
  })
});
