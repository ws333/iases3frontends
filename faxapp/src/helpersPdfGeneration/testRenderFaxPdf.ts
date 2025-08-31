import { writeFileSync } from 'fs';
import { join } from 'path';
import { renderFaxPdf } from '../helpers/renderFaxPdf';

export async function testRenderFaxPdf() {
  const pdfBytes = await renderFaxPdf('Dear Jane Smith');

  const outputPath = join(process.cwd(), 'step3-test-renderFax.pdf');
  try {
    writeFileSync(outputPath, pdfBytes);
    console.log(`✅ PDF saved synchronously to: ${outputPath}`);
  } catch (error) {
    console.error('❌ Failed to save PDF synchronously:', error);
    throw new Error(`Failed to save PDF to ${outputPath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

void testRenderFaxPdf();
