// Berry, the site's blueberry. Moods are switched with data-mood in CSS,
// and the crown swaps for a nightcap and sleepy eyes in dark mode.
export const berrySvg = `
<svg class="berry" data-mood="idle" viewBox="0 0 120 124" aria-hidden="true">
  <g class="berry-all">
    <circle class="b-body" cx="60" cy="74" r="44"/>
    <ellipse class="b-shine" cx="44" cy="50" rx="14" ry="8" transform="rotate(-28 44 50)"/>
    <path class="b-crown" d="M60 12l8 14 15-6-3 17 15 4-14 9H39l-14-9 15-4-3-17 15 6z"/>
    <circle cx="36" cy="88" r="8" fill="#F6C3DA"/>
    <circle cx="84" cy="88" r="8" fill="#F6C3DA"/>
    <g class="eyes-open">
      <circle cx="44" cy="74" r="7.5" fill="#fff"/>
      <circle cx="76" cy="74" r="7.5" fill="#fff"/>
      <circle class="pupil" cx="45" cy="75" r="4" fill="#2C2260"/>
      <circle class="pupil" cx="77" cy="75" r="4" fill="#2C2260"/>
    </g>
    <g class="eyes-happy" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round">
      <path d="M36 77q8-11 16 0"/>
      <path d="M68 77q8-11 16 0"/>
    </g>
    <path class="b-lid" d="M35 74a9 9 0 0 1 18 0zM67 74a9 9 0 0 1 18 0z"/>
    <path class="mouth-smile" d="M51 90q9 9 18 0" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round"/>
    <circle class="mouth-o" cx="60" cy="93" r="4.5" fill="#fff"/>
    <g class="b-cap">
      <path d="M30 38C36 22 50 12 60 10c10 2 24 12 30 28Q60 20 30 38z"/>
      <path d="M24 52Q60 28 96 52q2-8-4-13Q60 20 28 39q-6 5-4 13z" fill="#FDFBFF"/>
      <circle cx="60" cy="9" r="7" fill="#FDFBFF"/>
    </g>
  </g>
</svg>`;
