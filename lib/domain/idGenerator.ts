/**
 * Formats a sequential counter and schoolId into a standardized permanent Student ID.
 * Example: generateStudentId('AAR', 14) -> 'AAR-0014'
 * 
 * @param schoolId The school tenant code (e.g. 'AAR', 'BIS')
 * @param sequenceNum The sequential integer from the school's counter (e.g. 14)
 * @param padLength The total padding length for the number (default: 4 digits)
 */
export const generateStudentId = (
  schoolId: string,
  sequenceNum: number,
  padLength: number = 4
): string => {
  const cleanSchoolId = schoolId.trim().toUpperCase();
  const paddedNumber = String(sequenceNum).padStart(padLength, '0');
  return `${cleanSchoolId}-${paddedNumber}`;
};

/**
 * Parses a standard permanent Student ID back into its component parts.
 * Example: parseStudentId('AAR-0014') -> { schoolId: 'AAR', sequenceNum: 14 }
 */
export const parseStudentId = (studentId: string) => {
  const parts = studentId.split('-');
  if (parts.length < 2) {
    throw new Error(`Invalid Student ID format: ${studentId}`);
  }
  const schoolId = parts[0].toUpperCase();
  const sequenceNum = parseInt(parts[1], 10);
  return { schoolId, sequenceNum };
};
