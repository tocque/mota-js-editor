/**
 * Field Path Utilities
 * 
 * Functions for parsing and manipulating field paths in the table system.
 * Field paths follow the format: "['key1']['key2']['key3']"
 */

/**
 * Parse a field path string into an array of keys.
 * 
 * @param field - Field path string, e.g., "['main']['floorIds']"
 * @returns Array of keys, e.g., ['main', 'floorIds']
 * 
 * @example
 * parseFieldPath("['main']['floorIds']") // ['main', 'floorIds']
 * parseFieldPath("") // []
 * parseFieldPath("['a']['b']['c']") // ['a', 'b', 'c']
 */
export function parseFieldPath(field: string): string[] {
  if (!field || field.length === 0) {
    return [];
  }
  
  // Match all ['key'] patterns and extract the keys
  const matches = field.match(/\['([^']+)'\]/g);
  if (!matches) {
    return [];
  }
  
  return matches.map(match => {
    // Extract the key from ['key'] format
    const keyMatch = match.match(/\['([^']+)'\]/);
    return keyMatch ? keyMatch[1] : '';
  }).filter(key => key !== '');
}

/**
 * Get the short field name (last segment) from a field path.
 * 
 * @param field - Field path string, e.g., "['main']['floorIds']"
 * @returns Short field name, e.g., 'floorIds'
 * 
 * @example
 * getShortField("['main']['floorIds']") // 'floorIds'
 * getShortField("['single']") // 'single'
 * getShortField("") // ''
 */
export function getShortField(field: string): string {
  if (!field || field.length === 0) {
    return '';
  }
  
  // Split by "'][" and get the last segment, then clean up
  const segments = field.split("']");
  const lastSegment = segments[segments.length - 2]; // -2 because last element is empty after split
  
  if (!lastSegment) {
    // Try alternative parsing for single segment
    const match = field.match(/\['([^']+)'\]$/);
    return match ? match[1] : '';
  }
  
  // Extract key from "['key" format
  const keyMatch = lastSegment.match(/\['([^']+)$/);
  return keyMatch ? keyMatch[1] : '';
}

/**
 * Build a field path from an array of keys.
 * 
 * @param keys - Array of keys
 * @returns Field path string
 * 
 * @example
 * buildFieldPath(['main', 'floorIds']) // "['main']['floorIds']"
 * buildFieldPath([]) // ""
 */
export function buildFieldPath(keys: string[]): string {
  if (!keys || keys.length === 0) {
    return '';
  }
  return keys.map(key => `['${key}']`).join('');
}

/**
 * Get the parent field path by removing the last segment.
 * 
 * @param field - Field path string
 * @returns Parent field path, or empty string if no parent
 * 
 * @example
 * getParentField("['main']['floorIds']") // "['main']"
 * getParentField("['single']") // ""
 */
export function getParentField(field: string): string {
  const keys = parseFieldPath(field);
  if (keys.length <= 1) {
    return '';
  }
  return buildFieldPath(keys.slice(0, -1));
}

/**
 * Convert a field path to a data-field attribute format.
 * Used for CSS selectors and DOM attributes.
 * 
 * @param field - Field path string
 * @returns Hyphen-separated string for data-field attribute
 * 
 * @example
 * fieldToDataAttr("['main']['floorIds']") // "main-floorIds"
 */
export function fieldToDataAttr(field: string): string {
  const keys = parseFieldPath(field);
  return keys.join('-');
}
