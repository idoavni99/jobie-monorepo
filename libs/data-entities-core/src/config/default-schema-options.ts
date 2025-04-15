export const defaultSchemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
  toObject: {
    getters: true,
    virtuals: true,
  },
};
