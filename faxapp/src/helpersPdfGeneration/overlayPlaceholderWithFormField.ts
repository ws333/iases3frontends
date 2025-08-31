/**
 * Overlay a form field on the placeholder text "Dear __________________"
 * This is simpler and more reliable than direct text replacement
 *
 * Also overlaying "Dear" since a precise alignment of the texts is not working due to
 * pdf-lib using lower resolution points rather than pixels
 */
import fs from 'node:fs';
import { step3letterPdfOriginal } from '../constants/step3letterPdfTemplate';

const placeholderPosition = {
  x: 75, // Left position in pdf-lib points
  y: 670, // Vertical position (bottom-left to top-left)
  width: 600, // Width to cover the placeholder
  height: 20, // Height of the field
};

export async function overlayPlaceholderWithFormField(): Promise<Uint8Array> {
  try {
    // Import pdf-lib dynamically
    const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');

    // Load the PDF template
    const templateBytes = Uint8Array.from(atob(step3letterPdfOriginal), (c) => c.charCodeAt(0));
    const pdfDoc = await PDFDocument.load(templateBytes);

    // Get the form
    const form = pdfDoc.getForm();

    // Get the first page
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Embed the font
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Create a text field to overlay on the placeholder
    const nameField = form.createTextField('recipientName');

    nameField.addToPage(firstPage, {
      x: placeholderPosition.x,
      y: placeholderPosition.y,
      width: placeholderPosition.width,
      height: placeholderPosition.height,
      font: helveticaFont,
      textColor: rgb(0, 0, 0),
      backgroundColor: rgb(1, 1, 1),
      borderWidth: 0, // No border to make it look like text
    });

    // Needed to ensure consistent appearance across all PDF viewers, i.e. fax APIs.
    nameField.updateAppearances(helveticaFont);

    // Save the modified PDF
    const pdfBytes = await pdfDoc.save();

    // Convert pdfBytes to base64 string and output to console
    const pdfString = btoa(String.fromCharCode(...pdfBytes));
    fs.writeFileSync('step3letterWithFromField.txt', pdfString);
    return new Uint8Array(pdfBytes);
  } catch (error) {
    console.error('Error replacing placeholder with form field:', error);
    throw new Error(`Failed to replace placeholder: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

void overlayPlaceholderWithFormField();
