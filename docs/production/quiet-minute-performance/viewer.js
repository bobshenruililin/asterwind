'use strict';
(function () {
  const captions = {
    round: [
      'Theo draws breath and begins to raise a finger. Nia keeps the token and her speaking space.',
      'Theo closes his mouth and holds the impulse. Nia continues to explain her route.',
      'Theo rests his hand away from the token. He stays interested; Nia keeps the floor without triumph.'
    ],
    slips: [
      'The lead has misread a slip. Nia catches the mismatch and makes room to clarify.',
      'Nia points to the courtyard gate: go there first, not remove it. The lead opens a hand to receive the correction.',
      'The lead acknowledges; Theo adds his sketch. Participation continues; the story still leaves a different slip unresolved.'
    ]
  };
  const summaries = {
    round: 'Theo starts to answer, then leaves the speaking space with Nia. The unfinished harbour remains a separate ending beat.',
    slips: 'Nia can correct the meaning. The lead receives it without defensiveness; Theo contributes. One slip remains uncertain.'
  };
  const overview = document.getElementById('overview');
  const buttons = [...document.querySelectorAll('.beat')];
  const boards = document.getElementById('boards');
  const images = [...document.querySelectorAll('.sheet')];
  const frames = [...document.querySelectorAll('.frame')];
  function show(frame) {
    const whole = frame === null;
    boards.classList.toggle('framed', !whole);
    overview.setAttribute('aria-pressed', String(whole));
    buttons.forEach(button => button.setAttribute('aria-pressed', String(!whole && Number(button.dataset.frame) === frame)));
    images.forEach(img => { img.hidden = !whole; });
    frames.forEach((element, i) => {
      const branch = i === 0 ? 'round' : 'slips';
      element.hidden = whole;
      if (!whole) {
        element.style.backgroundPositionX = `${frame * 50}%`;
        element.setAttribute('aria-label', captions[branch][frame]);
      }
      document.getElementById(`${branch}-caption`).textContent = whole ? summaries[branch] : captions[branch][frame];
    });
    document.getElementById('status').textContent = whole ? 'Showing both complete studies.' : `Pose ${frame + 1} of 3, both branches.`;
  }
  overview.addEventListener('click', () => show(null));
  buttons.forEach(button => button.addEventListener('click', () => show(Number(button.dataset.frame))));
})();
