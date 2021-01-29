function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (1 + max - min) + min);
}

module.exports = { randomNumber };
