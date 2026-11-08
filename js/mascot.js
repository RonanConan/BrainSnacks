// Berry, the site's blueberry. Moods are switched with data-mood in CSS.
export const berrySvg = `
<svg class="berry" data-mood="idle" viewBox="0 0 120 120" aria-hidden="true">
  <g class="berry-all">
    <circle cx="60" cy="70" r="44" fill="#5B5FC7"/>
    <ellipse cx="44" cy="46" rx="14" ry="8" fill="#8A8DE0" transform="rotate(-28 44 46)"/>
    <path d="M60 8l8 14 15-6-3 17 15 4-14 9H39l-14-9 15-4-3-17 15 6z" fill="#2A2860"/>
    <circle cx="36" cy="84" r="8" fill="#F4A6B8"/>
    <circle cx="84" cy="84" r="8" fill="#F4A6B8"/>
    <g class="eyes-open">
      <circle cx="44" cy="70" r="7.5" fill="#fff"/>
      <circle cx="76" cy="70" r="7.5" fill="#fff"/>
      <circle class="pupil" cx="45" cy="71" r="4" fill="#2A2860"/>
      <circle class="pupil" cx="77" cy="71" r="4" fill="#2A2860"/>
    </g>
    <g class="eyes-happy" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round">
      <path d="M36 73q8-11 16 0"/>
      <path d="M68 73q8-11 16 0"/>
    </g>
    <path class="mouth-smile" d="M51 86q9 9 18 0" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round"/>
    <circle class="mouth-o" cx="60" cy="89" r="4.5" fill="#fff"/>
  </g>
</svg>`;
