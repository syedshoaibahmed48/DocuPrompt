export function fileNameWithoutExtension(filename: string) {
  return filename.substring(0, filename.lastIndexOf("."));
}

export function formattedFileSize(bytes: number) {
  if (bytes < 1024) {
    return bytes + ' B';
  } else if (bytes < 1024 * 1024) {
    return formatSize(bytes / 1024, 'KB');
  } else if (bytes < 1024 * 1024 * 1024) {
    return formatSize(bytes / (1024 * 1024), 'MB');
  } else {
    return formatSize(bytes / (1024 * 1024 * 1024), 'GB');
  }
}

function formatSize(size: number, unit: string): string {
  const roundedSize = Math.round(size * 10) / 10;
  return roundedSize % 1 === 0 ? `${Math.round(roundedSize)} ${unit}` : `${roundedSize.toFixed(1)} ${unit}`;
}

export function calcStatPercentage(value: number, total: number): string {
  return Math.ceil((value / total) * 100).toString();
}

export function commaSeparatedNumber(value: number): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}