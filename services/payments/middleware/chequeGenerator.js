// services/payments/middleware/chequeGenerator.js
import Payment from '../models/Payment.js';

export const generateChequeNumber = async (req, res, next) => {
  try {
    if (!req.body.chequeNumber) {
      // Fetch last payment by creation time
      const last = await Payment.findOne().sort({ createdAt: -1 }).lean();
      let nextNumber = '000001';
      if (last && last.chequeNumber) {
        // Extract numeric part
        const match = last.chequeNumber.match(/(\d+)$/);
        if (match) {
          const num = parseInt(match[1], 10) + 1;
          // Pad to same length as previous
          const length = match[1].length;
          nextNumber = num.toString().padStart(length, '0');
        }
      }
      req.body.chequeNumber = nextNumber;
    }
    next();
  } catch (err) {
    next(err);
  }
};
