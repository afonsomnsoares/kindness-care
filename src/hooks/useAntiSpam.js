import { useState, useRef } from 'react';

const MIN_FILL_TIME_MS = 3000;

function useAntiSpam() {
  const [honeypot, setHoneypot] = useState('');
  const mountedAt = useRef(Date.now());

  const isBot = () =>
    honeypot.trim() !== '' || Date.now() - mountedAt.current < MIN_FILL_TIME_MS;

  return { honeypot, setHoneypot, isBot };
}

export default useAntiSpam;
