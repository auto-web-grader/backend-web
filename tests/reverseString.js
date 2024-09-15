import { path } from "path";

const pathToCode = process.argv[3];

// import * as codeToTest from pathToCode;
const codeToTest = await import(pathToCode);

test('reverseString membalik string dengan benar', () => {
    expect(codeToTest.reverseString('hello')).toBe('olleh');
    expect(codeToTest.reverseString('JavaScript')).toBe('tpircSavaJ');
    expect(codeToTest.reverseString('')).toBe('');
})