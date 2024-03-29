import mongoose from 'mongoose';

const bcrypt = require('bcrypt-nodejs');

const EmailConfirmationStates = {
  Verified: 'verified',
  Sent: 'sent',
  Resent: 'resent',
};

const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, default: '' },
  username: { type: String, required: true, unique: true },
  password: { type: String },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  verified: { type: String },
  verifiedToken: String,
  verifiedTokenExpires: Date,
  github: { type: String },
  email: { type: String, unique: true },
  tokens: Array,
  preferences: {
    fontSize: { type: Number, default: 18 },
    lineNumbers: { type: Boolean, default: true },
    indentationAmount: { type: Number, default: 2 },
    isTabIndent: { type: Boolean, default: false },
    autosave: { type: Boolean, default: true },
    linewrap: { type: Boolean, default: true },
    lintWarning: { type: Boolean, default: false },
    textOutput: { type: Boolean, default: false },
    gridOutput: { type: Boolean, default: false },
    soundOutput: { type: Boolean, default: false },
    theme: { type: String, default: 'light' },
    autorefresh: { type: Boolean, default: false }
  }
}, { timestamps: true, usePushEach: true });

/**
 * Password hash middleware.
 */
userSchema.pre('save', function checkPassword(next) { // eslint-disable-line consistent-return
  const user = this;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => { // eslint-disable-line consistent-return
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, null, (innerErr, hash) => {
      if (innerErr) { return next(innerErr); }
      user.password = hash;
      return next();
    });
  });
});

userSchema.virtual('id').get(function idToString() {
  return this._id.toHexString();
});

userSchema.set('toJSON', {
  virtuals: true
});


/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
// userSchema.methods.comparePassword = (candidatePassword, cb) => {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

userSchema.statics.findByMailOrName = function findByMailOrName(email) {
  const query = {
    $or: [{
      email,
    }, {
      username: email,
    }],
  };
  return this.findOne(query).exec();
};

userSchema.statics.findGuest = function findGuest(onSuccess) {
  const query = {
    guest: true,
  };
  return this.findOne(query,  (err, user) => {
    onSuccess(err,user);
  })
};



userSchema.statics.EmailConfirmation = EmailConfirmationStates;

export default mongoose.model('User', userSchema);
