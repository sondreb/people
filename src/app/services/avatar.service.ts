import { Injectable } from '@angular/core';
import { Md5 } from 'ts-md5';

@Injectable({
  providedIn: 'root',
})
export class AvatarService {
  private readonly colors = [
    '#0078D4', // Blue
    '#498205', // Green
    '#8764B8', // Purple
    '#C239B3', // Magenta
    '#E3008C', // Pink
    '#B4009E', // Purple
    '#881798', // Dark Purple
    '#038387', // Teal
    '#0099BC', // Light Blue
    '#00B7C3', // Cyan
    '#004E8C', // Dark Blue
  ];

  async getAvatarUrl(email: string | undefined, name?: string, size: number = 128): Promise<string> {
    if (!email && !name) {
      return this.generateDefaultAvatarUrl(size);
    }

    if (email) {
      const cleanEmail = email.trim().toLowerCase();

      // Try Gravatar first since it's more reliable
      const hash = Md5.hashStr(cleanEmail);
      const gravatarUrl = `https://www.gravatar.com/avatar/${hash}?s=${size}&d=404`;
      try {
        const gravatarResponse = await fetch(gravatarUrl);
        if (gravatarResponse.ok) {
          return gravatarUrl;
        }
      } catch (e) {
        console.log('Failed to load Gravatar');
      }

      // Try Microsoft service directly
      const outlookUrl = `https://outlook.office365.com/owa/service.svc/s/GetPersonaPhoto?email=${encodeURIComponent(cleanEmail)}&size=HR${size}x${size}`;
      try {
        const outlookResponse = await fetch(outlookUrl);
        if (outlookResponse.ok) {
          return outlookUrl;
        }
      } catch (e) {
        console.log('Failed to load Outlook avatar');
      }

      // Fall back to generated avatar using email
      const colorIndex = this.getConsistentIndex(cleanEmail);
      const backgroundColor = this.colors[colorIndex];
      const initials = this.getInitials(cleanEmail);
      return this.generateAvatarDataUrl(initials, backgroundColor, size);
    }

    // Generate avatar from name if no email is available
    if (name) {
      const colorIndex = this.getConsistentIndex(name);
      const backgroundColor = this.colors[colorIndex];
      const initials = this.getInitialsFromName(name);
      return this.generateAvatarDataUrl(initials, backgroundColor, size);
    }

    return this.generateDefaultAvatarUrl(size);
  }

  // Helper method to check if an image URL is valid
  private async isImageUrlValid(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok && response.headers.get('content-type')?.startsWith('image/') || false;
    } catch {
      return false;
    }
  }

  private getConsistentIndex(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }
    const positiveHash = Math.abs(hash);
    return positiveHash % this.colors.length;
  }

  private getInitials(email: string): string {
    const parts = email.split('@')[0].split(/[._-]/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }

  private getInitialsFromName(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }

  private generateDefaultAvatarUrl(size: number): string {
    return this.generateAvatarDataUrl('?', '#666666', size);
  }

  private generateAvatarDataUrl(
    text: string,
    backgroundColor: string,
    size: number
  ): string {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    if (!context) return '';

    // Draw background
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, size, size);

    // Draw text
    context.fillStyle = 'white';
    context.font = `bold ${size * 0.4}px Arial`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, size / 2, size / 2);

    return canvas.toDataURL('image/png');
  }
}
