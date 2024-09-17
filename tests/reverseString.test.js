const pathToCode = process.argv[3];
const { reverseString }  = require(pathToCode);

test('reverseString membalik string dengan benar', () => {
    expect(reverseString('hello')).toBe('olleh');
    expect(reverseString('JavaScript')).toBe('tpircSavaJ');
    expect(reverseString('')).toBe('');
});
