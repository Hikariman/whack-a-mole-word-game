// Shows a word with its silent letters highlighted. Only used AFTER a level
// is complete (and on the final recap), never during listening or hunting.
export default function WordReveal({ level, className = '' }) {
  return (
    <span className={`word-reveal ${className}`} aria-label={`${level.word.toUpperCase()}, ${level.silentLabel}`}>
      {level.word
        .toUpperCase()
        .split('')
        .map((letter, i) => (
          <span key={i} className={level.silentIndexes.includes(i) ? 'silent-letter' : 'letter'} aria-hidden="true">
            {letter}
          </span>
        ))}
    </span>
  );
}
