<script lang="ts">
  export let size: number = 100; // 원의 크기
  export let stroke: number = 10; // 바의 두께
  export let progress: number = 0; // 진행률 (0-100)
  export let trackColor: string = '#d1d5db'; // 배경색
  export let centerTexts: Array<{ text: string; size: string; lineHeight?: number }> = []; // 중앙에 표시할 텍스트 배열

  const radius = size / 2 - stroke * 2;
  const circumference = radius * 2 * Math.PI;
  const offset = (): number => circumference - (progress / 100) * circumference;

  // 진행률에 따라 바와 텍스트 색상을 결정하는 반응형 변수
  $: color = progress >= 99 ? '#4ade80' : progress >= 95 ? '#facc15' : '#e11d48'; // 붉은색

  // 텍스트의 Y 위치를 계산하는 함수
  function calculateYPosition(index, lineHeight) {
    const baseY = 50;
    const defaultLineHeight = 20;
    let totalOffset = 0;

    for (let i = 0; i < index; i++) {
      totalOffset += centerTexts[i].lineHeight || defaultLineHeight;
    }

    return `${baseY + (totalOffset - (centerTexts.length - 1) * defaultLineHeight / 2)}%`;
  }
</script>

<style>
  .progress-ring__circle {
    transition: stroke-dashoffset 2s;
    transform: rotate(-90deg);
    transform-origin: 50% 50%;
  }
</style>

<div class="progress-container" style="width: {size}px; height: {size}px; position: relative;">
  <svg
    class="progress-ring"
    width="{size}"
    height="{size}">
    <circle
      class="progress-ring__circle"
      stroke="{trackColor}"
      stroke-width="{stroke}"
      fill="transparent"
      r="{radius}"
      cx="{size / 2}"
      cy="{size / 2}" />
    <circle
      class="progress-ring__circle"
      stroke="{color}"
      stroke-width="{stroke}"
      fill="transparent"
      r="{radius}"
      cx="{size / 2}"
      cy="{size / 2}"
      style="stroke-dasharray: {circumference} {circumference}; stroke-dashoffset: {offset()};" />
    {#each centerTexts as { text, size, lineHeight }, index (text)}
      <text x="50%" y={calculateYPosition(index, lineHeight)} class="progress-ring__text" style="fill: {color}; font-size: {size}; text-anchor: middle; dominant-baseline: middle;">
        {text}
      </text>
    {/each}
  </svg>
</div>
