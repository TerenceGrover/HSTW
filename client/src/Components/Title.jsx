export default function Title({ index }) {
  function assignWord(idx) {
    if (idx < -2) {
      return 'Terrible';
    }
    if (idx > 2) {
      return 'Great';
    }
    if (idx <= -1) {
      return 'Bad';
    }
    if (idx >= 1) {
      return 'Good';
    }
    if (idx > -1 || idx < 1) {
      return 'Pretty Average';
    }
  }

  return (
    <>
      {index ? (
        <h1 className="master">
          The World is doing {assignWord(index.global)} today.
        </h1>
      ) : (
        ''
      )}
    </>
  );
}
ƒ