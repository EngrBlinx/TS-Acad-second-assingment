
// utils/nuban.js

function generateNUBAN(bankCode) {
  // Pad bankCode to ensure it's 3 digits (e.g. "108" or "058")
  const paddedBankCode = bankCode.toString().padStart(3, '0');

  // Generate a random 6-digit serial number (e.g., "407128")
  const serialNumber = Math.floor(100000 + Math.random() * 900000).toString();

  // Combine bankCode and serial number
  const cipher = paddedBankCode + serialNumber;

  // CBN weighting factors: [3, 7, 3, 3, 7, 3, 3, 7, 3]
  const multipliers = [3, 7, 3, 3, 7, 3, 3, 7, 3];

  let sum = 0;
  for (let i = 0; i < cipher.length; i++) {
    sum += parseInt(cipher[i], 10) * multipliers[i];
  }

  // Calculate check digit: 10 - (sum modulo 10)
  let checkDigit = 10 - (sum % 10);
  if (checkDigit === 10) {
    checkDigit = 0; // If result is 10, check digit is 0
  }

  // Combine 6-digit serial number + 1-digit check digit = 7 digits appended to bank code/prefix
  // In NUBAN, the final 10-digit account number is: serialNumber + checkDigit
  // (or bankCode-derived 10-digit string)
  return `${paddedBankCode.slice(-3)}${serialNumber.slice(0, 6)}${checkDigit}`.slice(0, 10);
}

module.exports = generateNUBAN;