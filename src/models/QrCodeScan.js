import mongoose from 'mongoose';

const QrCodeScan = new mongoose.Schema({
    qrId: { type: String, unique: true }, 
    qrDataUrl :{type: String},
    location: String, 
    scanCount: { type: Number, default: 0 }, 
    scans: [{
      scannedAt: { type: Date, default: Date.now },
      userAgent: String, 
      ipAddress: String,
    }],
  }, {timestamps : true});

export default mongoose.models.QrCode || mongoose.model('QrCode', QrCodeScan);
