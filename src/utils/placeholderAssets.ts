// Placeholder asset generation system
export class PlaceholderAssets {
  private static cache: Map<string, HTMLCanvasElement> = new Map();

  static generatePlayerSprite(state: 'idle' | 'hop' | 'collision', size: number = 32): HTMLCanvasElement {
    const key = `player-${state}-${size}`;
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Base color changes by state
    let baseColor = '#22C55E'; // Green for idle
    let text = 'RASTA';

    if (state === 'hop') {
      baseColor = '#16A34A'; // Darker green
      text = 'HOP!';
    } else if (state === 'collision') {
      baseColor = '#EF4444'; // Red
      text = 'OUCH';
    }

    // Draw character rectangle
    ctx.fillStyle = baseColor;
    ctx.fillRect(2, 2, size - 4, size - 4);

    // Border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(2, 2, size - 4, size - 4);

    // Text label
    ctx.fillStyle = '#000000';
    ctx.font = `bold ${Math.floor(size / 4)}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, size / 2, size / 2);

    this.cache.set(key, canvas);
    return canvas;
  }

  static generateVehicleSprite(
    type: string,
    direction: 'left' | 'right',
    width: number,
    height: number
  ): HTMLCanvasElement {
    const key = `vehicle-${type}-${direction}-${width}x${height}`;
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    // Vehicle colors
    const colors: Record<string, string> = {
      cng: '#FCD34D',      // Yellow
      rickshaw: '#22C55E',  // Green
      bus: '#3B82F6',       // Blue
      truck: '#6B7280',     // Gray
      motorcycle: '#EF4444', // Red
      car: '#8B5CF6',       // Purple
      tempo: '#F97316'      // Orange
    };

    const color = colors[type] || '#9CA3AF';

    // Draw vehicle body
    ctx.fillStyle = color;
    ctx.fillRect(2, 2, width - 4, height - 4);

    // Border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.strokeRect(2, 2, width - 4, height - 4);

    // Direction arrow
    ctx.fillStyle = '#000000';
    ctx.font = `bold ${Math.min(height / 3, 12)}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const arrow = direction === 'left' ? '←' : '→';
    ctx.fillText(`${type.toUpperCase()}`, width / 2, height / 2 - 3);
    ctx.fillText(arrow, width / 2, height / 2 + 8);

    this.cache.set(key, canvas);
    return canvas;
  }

  static generateBackgroundTile(width: number, height: number, type: 'road' | 'sidewalk'): HTMLCanvasElement {
    const key = `bg-${type}-${width}x${height}`;
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    if (type === 'road') {
      // Dark gray road with lane lines
      ctx.fillStyle = '#374151';
      ctx.fillRect(0, 0, width, height);

      // Lane dividers
      ctx.strokeStyle = '#FBBF24';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 10]);

      for (let i = 80; i < width; i += 80) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    } else {
      // Light gray sidewalk
      ctx.fillStyle = '#D1D5DB';
      ctx.fillRect(0, 0, width, height);

      // Texture pattern
      ctx.fillStyle = '#9CA3AF';
      for (let x = 0; x < width; x += 20) {
        for (let y = 0; y < height; y += 20) {
          if ((x / 20 + y / 20) % 2) {
            ctx.fillRect(x, y, 20, 20);
          }
        }
      }
    }

    this.cache.set(key, canvas);
    return canvas;
  }

  static clearCache(): void {
    this.cache.clear();
  }
}