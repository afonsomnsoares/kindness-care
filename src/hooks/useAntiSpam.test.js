import { renderHook, act } from '@testing-library/react';
import useAntiSpam from './useAntiSpam';

// Testes de fumo (smoke tests) para a lógica anti-spam usada nos
// formulários (ContactForm.jsx e PousadasForm.jsx): honeypot + time-trap.
// Ver src/hooks/useAntiSpam.js

describe('useAntiSpam', () => {
  test('não marca como bot um preenchimento humano (honeypot vazio, após o tempo mínimo)', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useAntiSpam());

    act(() => {
      vi.advanceTimersByTime(3100);
    });

    expect(result.current.isBot()).toBe(false);
    vi.useRealTimers();
  });

  test('marca como bot quando o campo honeypot é preenchido', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useAntiSpam());

    act(() => {
      vi.advanceTimersByTime(3100);
      result.current.setHoneypot('spam');
    });

    expect(result.current.isBot()).toBe(true);
    vi.useRealTimers();
  });

  test('marca como bot um envio demasiado rápido (antes do time-trap mínimo)', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useAntiSpam());

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.isBot()).toBe(true);
    vi.useRealTimers();
  });
});
