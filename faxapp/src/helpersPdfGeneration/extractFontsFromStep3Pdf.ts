import { step3letterPdfOriginal } from '../constants/step3letterPdfTemplate';
import { analyzePdfFonts } from './extractPdfFonts';

const result = analyzePdfFonts(step3letterPdfOriginal);

console.log('Summary:', result.summary);
console.log('Fonts:', result.fonts);
