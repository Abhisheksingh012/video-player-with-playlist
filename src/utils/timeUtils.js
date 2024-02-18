export const formatDuration = (time) => {
    const seconds = Math.floor(time % 60);
    const minutes = Math.floor(time / 60) % 60;
    const hours = Math.floor(time / 3600);
    if (hours === 0) {
      return `${minutes}:${digitFormate.format(seconds)}`;
    } else {
      return `${hours}:${digitFormate.format(minutes)}:${digitFormate.format(
        seconds
      )}`;
    }
  };
  const digitFormate = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2,
  });