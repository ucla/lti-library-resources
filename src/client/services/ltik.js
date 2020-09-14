const getLtik = () => {
  const searchParams = new URLSearchParams(window.location.search);
  let ltik = searchParams.get('ltik');
  if (!ltik) {
    ltik = sessionStorage.getItem('ltik');
    if (!ltik) throw new Error('Missing lti key.');
  }
  sessionStorage.setItem('ltik', ltik);
  return ltik;
};

export { getLtik };
