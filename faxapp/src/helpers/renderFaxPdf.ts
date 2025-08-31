/**
 * Fills a form field in a PDF template (preferred method for maintaining typography)
 */
export async function renderFaxPdf(recipientName: string): Promise<Uint8Array> {
  try {
    // Import pdf-lib dynamically to handle missing dependency
    const { PDFDocument } = await import('pdf-lib');
    const { step3letterPdfWithFormField: step3letterPdfTemplateWithFormField } = await import(
      '../constants/step3letterPdfTemplate'
    );

    // Load the PDF template with form fields
    const templateBytes = Uint8Array.from(atob(step3letterPdfTemplateWithFormField), (c) => c.charCodeAt(0));
    const pdfDoc = await PDFDocument.load(templateBytes);

    // Get the form and fill the field
    const form = pdfDoc.getForm();
    const nameField = form.getTextField('recipientName');

    // Fill the field with text
    nameField.setText(recipientName);

    // Save the filled PDF
    const filledPdfBytes = await pdfDoc.save();
    return new Uint8Array(filledPdfBytes);
  } catch (error) {
    console.error('Error filling form field:', error);
    throw new Error(
      `Failed to fill form field in PDF template: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}
