describe('Basic Testing Section', () => {
  test('2 + 2 to equal 4', () => {
    expect(2 + 2).toBe(4);
  });

  test('2 * 2 to equal 4', () => {
    expect(2 * 2).toBe(4);
  });

  test('2 + 3 to not equal 4', () => {
    expect(2 + 3 === 4).toBe(false);
  });

  test('2 * 3 to not equal 4', () => {
    expect(2 * 3 === 4).toBe(false);
  });
});