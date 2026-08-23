// jest-dom adiciona matchers personalizados do Jest para asserções sobre
// nós do DOM, como toHaveTextContent e toBeInTheDocument.
// Ver: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Polyfill necessário: o jsdom usado pelo react-scripts 5 (CRA) não expõe
// TextEncoder/TextDecoder globalmente, mas o react-router-dom 7 precisa
// deles ao carregar. Sem isto, qualquer teste que importe react-router-dom
// falha com "TextEncoder is not defined".
import { TextEncoder, TextDecoder } from 'util';
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}
