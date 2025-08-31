interface FontInfo {
  name: string;
  baseFont: string;
  type: string;
  subtype?: string;
  encoding?: string;
}

/**
 * Extracts font information from a PDF string by parsing the raw PDF content
 */
export function extractFontsFromPdfString(pdfTemplate: string): FontInfo[] {
  try {
    // Convert base64 to string to search for font definitions
    const pdfBuffer = Buffer.from(pdfTemplate, 'base64');
    const pdfText = pdfBuffer.toString('binary');

    const fonts: FontInfo[] = [];

    // Look for font object definitions in the PDF
    // Font objects typically look like: /Type /Font /Subtype /TrueType /BaseFont /FontName
    const fontObjectRegex = /\/Type\s+\/Font[^>]*?\/BaseFont\s+\/([^/\s]+)[^>]*?(?=>|endobj)/g;

    let match;
    while ((match = fontObjectRegex.exec(pdfText)) !== null) {
      const fontBlock = match[0];
      const baseFont = match[1];

      // Extract subtype
      const subtypeRegex = /\/Subtype\s+\/(\w+)/;
      const subtypeMatch = subtypeRegex.exec(fontBlock);
      const subtype = subtypeMatch?.[1];

      // Extract encoding
      const encodingRegex = /\/Encoding\s+\/(\w+)/;
      const encodingMatch = encodingRegex.exec(fontBlock);
      const encoding = encodingMatch?.[1];

      // Clean up font name (remove + prefix if present, indicating subset)
      const cleanFontName = baseFont.replace(/^[A-Z]{6}\+/, '');

      const fontInfo: FontInfo = {
        name: baseFont,
        baseFont: cleanFontName,
        type: 'Font',
        subtype,
        encoding,
      };

      // Avoid duplicates
      const existingFont = fonts.find((f) => f.baseFont === fontInfo.baseFont);
      if (!existingFont) {
        fonts.push(fontInfo);
      }
    }

    return fonts;
  } catch (error) {
    console.error('Error extracting fonts from PDF template:', error);
    throw new Error('Failed to extract fonts from PDF template');
  }
}

/**
 * Analyzes the PDF template and returns font usage information
 */
export function analyzePdfFonts(pdfTemplate: string): {
  fonts: FontInfo[];
  summary: string;
} {
  try {
    const fonts = extractFontsFromPdfString(pdfTemplate);

    const fontNames = fonts.map((f) => f.baseFont).join(', ');
    const summary = `Found ${fonts.length} font(s): ${fontNames}`;

    return {
      fonts,
      summary,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      fonts: [],
      summary: `Error analyzing fonts: ${errorMessage}`,
    };
  }
}
